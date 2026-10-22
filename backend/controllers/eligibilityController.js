const db = require('../config/db');

exports.checkEligibility = async (req, res) => {
  try {
    const {
      current_education_level = 'Graduation',
      marks_percentage = 0,
      family_annual_income = 0,
      gender = 'All',
      category = 'General',
      state_domicile = 'All India',
      is_physically_challenged = 0
    } = req.body;

    const studentMarks = parseFloat(marks_percentage) || 0;
    const studentIncome = parseFloat(family_annual_income) || 0;
    const studentGender = (gender || 'All').trim();
    const studentCategory = (category || 'General').trim();
    const studentState = (state_domicile || 'All India').trim();
    const isPwc = parseInt(is_physically_challenged, 10) === 1 ? 1 : 0;

    // Fetch all published active scholarships with their criteria
    const sql = `
      SELECT
        s.id, s.title, s.slug, s.provider_name, s.provider_logo,
        s.award_amount, s.deadline, s.is_always_open, s.status,
        s.scholarship_type, s.education_level, s.state_domicile,
        s.brief_description, c.name as category_name,
        ec.min_education_level, ec.min_marks_percentage, ec.max_family_income,
        ec.applicable_gender, ec.applicable_category, ec.applicable_state,
        ec.requires_disability, ec.additional_rules
      FROM scholarships s
      LEFT JOIN categories c ON s.category_id = c.id
      LEFT JOIN eligibility_criteria ec ON s.id = ec.scholarship_id
      WHERE s.is_published = 1 AND s.status != 'closed'
    `;

    const { rows: scholarships } = await db.query(sql);

    const fullMatches = [];
    const partialMatches = [];

    for (const sch of scholarships) {
      const passedChecks = [];
      const failedChecks = [];

      // 1. Education Level Check
      const targetEdu = sch.min_education_level || sch.education_level || 'All';
      if (targetEdu === 'All' || targetEdu.toLowerCase() === current_education_level.toLowerCase()) {
        passedChecks.push({
          criterion: 'Education Level',
          detail: `Your level (${current_education_level}) matches requirement (${targetEdu})`
        });
      } else {
        failedChecks.push({
          criterion: 'Education Level',
          detail: `Requires ${targetEdu}; you selected ${current_education_level}`
        });
      }

      // 2. Marks Check
      const minMarks = sch.min_marks_percentage !== null ? parseFloat(sch.min_marks_percentage) : 0;
      if (studentMarks >= minMarks) {
        passedChecks.push({
          criterion: 'Academic Score',
          detail: `Your score (${studentMarks}%) satisfies minimum required (${minMarks}%)`
        });
      } else {
        failedChecks.push({
          criterion: 'Academic Score',
          detail: `Requires minimum ${minMarks}%; your current score is ${studentMarks}%`
        });
      }

      // 3. Family Income Check
      if (sch.max_family_income === null || sch.max_family_income === undefined || sch.max_family_income === 0) {
        passedChecks.push({
          criterion: 'Family Income',
          detail: 'No maximum annual family income ceiling'
        });
      } else {
        const maxInc = parseFloat(sch.max_family_income);
        if (studentIncome <= maxInc) {
          passedChecks.push({
            criterion: 'Family Income',
            detail: `Annual income ₹${studentIncome.toLocaleString('en-IN')} is within ceiling (₹${maxInc.toLocaleString('en-IN')})`
          });
        } else {
          failedChecks.push({
            criterion: 'Family Income',
            detail: `Annual family income ₹${studentIncome.toLocaleString('en-IN')} exceeds limit of ₹${maxInc.toLocaleString('en-IN')}`
          });
        }
      }

      // 4. Gender Check
      const targetGender = sch.applicable_gender || 'All';
      if (targetGender === 'All' || targetGender.toLowerCase() === studentGender.toLowerCase()) {
        passedChecks.push({
          criterion: 'Gender Eligibility',
          detail: `Eligible for ${studentGender} applicants`
        });
      } else {
        failedChecks.push({
          criterion: 'Gender Eligibility',
          detail: `Exclusively for ${targetGender} scholars (you specified ${studentGender})`
        });
      }

      // 5. Category Check
      const targetCat = sch.applicable_category || 'All';
      if (targetCat === 'All' || targetCat.toLowerCase() === studentCategory.toLowerCase()) {
        passedChecks.push({
          criterion: 'Category / Reservation',
          detail: `Eligible for ${studentCategory} community`
        });
      } else {
        failedChecks.push({
          criterion: 'Category / Reservation',
          detail: `Applicable specifically to ${targetCat} category (you specified ${studentCategory})`
        });
      }

      // 6. State / Domicile Check
      const targetState = sch.applicable_state || sch.state_domicile || 'All India';
      if (targetState === 'All India' || targetState.toLowerCase().includes(studentState.toLowerCase())) {
        passedChecks.push({
          criterion: 'Domicile / State',
          detail: `Valid for candidates from ${studentState} (${targetState})`
        });
      } else {
        failedChecks.push({
          criterion: 'Domicile / State',
          detail: `Restricted to residents of ${targetState}`
        });
      }

      // 7. Disability Check
      const requiresDisability = sch.requires_disability === 1;
      if (!requiresDisability || (requiresDisability && isPwc === 1)) {
        if (requiresDisability) {
          passedChecks.push({
            criterion: 'Disability Status',
            detail: 'Meets criteria for persons with disabilities quota'
          });
        }
      } else {
        failedChecks.push({
          criterion: 'Disability Status',
          detail: 'Requires verified disability certification'
        });
      }

      const totalCriteria = passedChecks.length + failedChecks.length;
      const matchScore = Math.round((passedChecks.length / totalCriteria) * 100);

      const resultItem = {
        id: sch.id,
        title: sch.title,
        slug: sch.slug,
        provider_name: sch.provider_name,
        provider_logo: sch.provider_logo,
        award_amount: sch.award_amount,
        deadline: sch.deadline,
        is_always_open: sch.is_always_open,
        status: sch.status,
        scholarship_type: sch.scholarship_type,
        brief_description: sch.brief_description,
        category_name: sch.category_name,
        match_percentage: matchScore,
        passed_criteria: passedChecks,
        failed_criteria: failedChecks
      };

      if (failedChecks.length === 0) {
        fullMatches.push(resultItem);
      } else if (failedChecks.length <= 2) {
        partialMatches.push(resultItem);
      }
    }

    res.json({
      success: true,
      summary: {
        total_evaluated: scholarships.length,
        full_match_count: fullMatches.length,
        partial_match_count: partialMatches.length
      },
      full_matches: fullMatches,
      partial_matches: partialMatches
    });
  } catch (err) {
    console.error('Error in eligibility rule evaluation:', err);
    res.status(500).json({ success: false, message: 'Server error processing eligibility rules.' });
  }
};
