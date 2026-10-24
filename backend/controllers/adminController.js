const db = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const { rows: schCount } = await db.query('SELECT COUNT(*) as count FROM scholarships');
    const { rows: liveCount } = await db.query("SELECT COUNT(*) as count FROM scholarships WHERE status = 'live' AND is_published = 1");
    const { rows: appCount } = await db.query('SELECT COUNT(*) as count FROM applications');
    const { rows: userCount } = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
    const { rows: awardedCount } = await db.query("SELECT COUNT(*) as count FROM applications WHERE status = 'awarded'");
    const { rows: articleCount } = await db.query('SELECT COUNT(*) as count FROM articles');

    res.json({
      success: true,
      data: {
        total_scholarships: schCount[0].count || schCount[0]['COUNT(*)'] || 0,
        live_scholarships: liveCount[0].count || liveCount[0]['COUNT(*)'] || 0,
        total_applications: appCount[0].count || appCount[0]['COUNT(*)'] || 0,
        registered_students: userCount[0].count || userCount[0]['COUNT(*)'] || 0,
        awarded_applications: awardedCount[0].count || awardedCount[0]['COUNT(*)'] || 0,
        total_articles: articleCount[0].count || articleCount[0]['COUNT(*)'] || 0
      }
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving statistics.' });
  }
};

exports.getAdminScholarships = async (req, res) => {
  try {
    const sql = `
      SELECT
        s.*,
        c.name as category_name,
        COUNT(a.id) as applications_count
      FROM scholarships s
      LEFT JOIN categories c ON s.category_id = c.id
      LEFT JOIN applications a ON s.id = a.scholarship_id
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `;
    const { rows } = await db.query(sql);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching admin scholarships:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving scholarships.' });
  }
};

const scraperService = require('../services/scraperService');

exports.createScholarship = async (req, res) => {
  try {
    const {
      title,
      category_id,
      provider_name,
      award_amount,
      award_amount_value,
      deadline,
      is_always_open,
      status,
      scholarship_type,
      scheme_authority_type,
      education_level,
      state_domicile,
      brief_description,
      full_overview,
      benefits,
      application_procedure,
      official_source_url,
      featured,
      previous_year_cutoff,
      last_year_disbursed_amount,
      total_beneficiaries_last_year,
      expected_next_cycle,
      history_summary,
      min_marks_percentage,
      max_family_income,
      applicable_gender,
      applicable_category,
      additional_rules
    } = req.body;

    if (!title || !provider_name || !award_amount || !brief_description) {
      return res.status(400).json({ success: false, message: 'Please provide Title, Provider Name, Award Amount, and Brief Description.' });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    const schRes = await db.query(
      `INSERT INTO scholarships (
        category_id, title, slug, provider_name, award_amount,
        award_amount_value, deadline, is_always_open, status,
        scholarship_type, scheme_authority_type, education_level, state_domicile,
        brief_description, full_overview, benefits, application_procedure,
        official_source_url, featured, is_published,
        previous_year_cutoff, last_year_disbursed_amount, total_beneficiaries_last_year,
        expected_next_cycle, history_summary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)`,
      [
        category_id || null, title, slug, provider_name, award_amount,
        award_amount_value || 0, is_always_open ? null : (deadline || null),
        is_always_open ? 1 : 0, status || 'live', scholarship_type || 'Corporate/CSR',
        scheme_authority_type || 'Central Government',
        education_level || 'All', state_domicile || 'All India',
        brief_description, full_overview || brief_description,
        benefits || '', application_procedure || '',
        official_source_url || '', featured ? 1 : 0,
        previous_year_cutoff || null, last_year_disbursed_amount || null,
        total_beneficiaries_last_year ? parseInt(total_beneficiaries_last_year, 10) : 0,
        expected_next_cycle || null, history_summary || null
      ]
    );

    const scholarshipId = schRes.insertId;

    // Insert criteria
    await db.query(
      `INSERT INTO eligibility_criteria (
        scholarship_id, min_education_level, min_marks_percentage,
        max_family_income, applicable_gender, applicable_category,
        applicable_state, requires_disability, additional_rules
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`,
      [
        scholarshipId,
        education_level || 'All',
        min_marks_percentage ? parseFloat(min_marks_percentage) : 0,
        max_family_income ? parseFloat(max_family_income) : null,
        applicable_gender || 'All',
        applicable_category || 'All',
        state_domicile || 'All India',
        additional_rules || ''
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Scholarship created successfully!',
      scholarship_id: scholarshipId,
      slug
    });
  } catch (err) {
    console.error('Error creating scholarship:', err);
    res.status(500).json({ success: false, message: 'Server error creating scholarship.' });
  }
};

exports.updateScholarship = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      title,
      category_id,
      provider_name,
      award_amount,
      award_amount_value,
      deadline,
      is_always_open,
      status,
      scholarship_type,
      scheme_authority_type,
      education_level,
      state_domicile,
      brief_description,
      full_overview,
      benefits,
      application_procedure,
      official_source_url,
      featured,
      is_published,
      previous_year_cutoff,
      last_year_disbursed_amount,
      total_beneficiaries_last_year,
      expected_next_cycle,
      history_summary
    } = req.body;

    await db.query(
      `UPDATE scholarships SET
        title = COALESCE(?, title),
        category_id = COALESCE(?, category_id),
        provider_name = COALESCE(?, provider_name),
        award_amount = COALESCE(?, award_amount),
        award_amount_value = COALESCE(?, award_amount_value),
        deadline = ?,
        is_always_open = COALESCE(?, is_always_open),
        status = COALESCE(?, status),
        scholarship_type = COALESCE(?, scholarship_type),
        scheme_authority_type = COALESCE(?, scheme_authority_type),
        education_level = COALESCE(?, education_level),
        state_domicile = COALESCE(?, state_domicile),
        brief_description = COALESCE(?, brief_description),
        full_overview = COALESCE(?, full_overview),
        benefits = COALESCE(?, benefits),
        application_procedure = COALESCE(?, application_procedure),
        official_source_url = COALESCE(?, official_source_url),
        featured = COALESCE(?, featured),
        is_published = COALESCE(?, is_published),
        previous_year_cutoff = COALESCE(?, previous_year_cutoff),
        last_year_disbursed_amount = COALESCE(?, last_year_disbursed_amount),
        total_beneficiaries_last_year = COALESCE(?, total_beneficiaries_last_year),
        expected_next_cycle = COALESCE(?, expected_next_cycle),
        history_summary = COALESCE(?, history_summary)
      WHERE id = ?`,
      [
        title, category_id, provider_name, award_amount,
        award_amount_value, is_always_open ? null : deadline,
        is_always_open ? 1 : 0, status, scholarship_type,
        scheme_authority_type,
        education_level, state_domicile, brief_description,
        full_overview, benefits, application_procedure,
        official_source_url, featured !== undefined ? (featured ? 1 : 0) : null,
        is_published !== undefined ? (is_published ? 1 : 0) : null,
        previous_year_cutoff, last_year_disbursed_amount,
        total_beneficiaries_last_year ? parseInt(total_beneficiaries_last_year, 10) : null,
        expected_next_cycle, history_summary,
        id
      ]
    );

    res.json({ success: true, message: 'Scholarship updated successfully.' });
  } catch (err) {
    console.error('Error updating scholarship:', err);
    res.status(500).json({ success: false, message: 'Server error updating scholarship.' });
  }
};

exports.deleteScholarship = async (req, res) => {
  try {
    const id = req.params.id;
    await db.query('DELETE FROM scholarships WHERE id = ?', [id]);
    res.json({ success: true, message: 'Scholarship deleted successfully.' });
  } catch (err) {
    console.error('Error deleting scholarship:', err);
    res.status(500).json({ success: false, message: 'Server error deleting scholarship.' });
  }
};

exports.getAdminApplications = async (req, res) => {
  try {
    const { status } = req.query;
    let conditions = [];
    let params = [];

    if (status && status !== 'all') {
      conditions.push('a.status = ?');
      params.push(status);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `
      SELECT
        a.*,
        u.name as applicant_name, u.email as applicant_email, u.mobile as applicant_mobile,
        p.marks_percentage, p.family_annual_income, p.state_domicile as applicant_state,
        s.title as scholarship_title, s.award_amount
      FROM applications a
      JOIN users u ON a.user_id = u.id
      LEFT JOIN student_profiles p ON u.id = p.user_id
      JOIN scholarships s ON a.scholarship_id = s.id
      ${where}
      ORDER BY a.submission_date DESC
    `;

    const { rows } = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching admin applications:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving applications.' });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status, reviewer_notes } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Application status is required.' });
    }

    const { rows: appRows } = await db.query(
      `SELECT a.user_id, a.application_number, s.title as scholarship_title
       FROM applications a
       JOIN scholarships s ON a.scholarship_id = s.id
       WHERE a.id = ?`,
      [id]
    );

    if (appRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const app = appRows[0];

    await db.query(
      'UPDATE applications SET status = ?, reviewer_notes = COALESCE(?, reviewer_notes) WHERE id = ?',
      [status, reviewer_notes || null, id]
    );

    // Notify student
    const statusLabels = {
      under_review: 'Under Review',
      documents_verified: 'Documents Verified',
      interview_scheduled: 'Interview Scheduled',
      approved: 'Approved / Selected',
      rejected: 'Application Closed / Unsuccessful',
      awarded: 'Scholarship Awarded!'
    };
    const friendlyStatus = statusLabels[status] || status;

    await db.query(
      `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)`,
      [
        app.user_id,
        `Application Status Update: ${app.scholarship_title}`,
        `Your application (${app.application_number}) status has been updated to "${friendlyStatus}". ${reviewer_notes ? 'Reviewer note: ' + reviewer_notes : ''}`,
        'application'
      ]
    );

    res.json({ success: true, message: `Application status updated to ${friendlyStatus}.` });
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ success: false, message: 'Server error updating status.' });
  }
};

exports.getAdminUsers = async (req, res) => {
  try {
    const sql = `
      SELECT
        u.id, u.name, u.email, u.mobile, u.role, u.created_at,
        p.current_education_level, p.state_domicile, p.marks_percentage,
        COUNT(a.id) as applications_count
      FROM users u
      LEFT JOIN student_profiles p ON u.id = p.user_id
      LEFT JOIN applications a ON u.id = a.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `;
    const { rows } = await db.query(sql);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving users.' });
  }
};

exports.syncGovernmentPortals = async (req, res) => {
  try {
    const result = await scraperService.syncPortals();
    res.json({
      success: true,
      message: 'Official Government & CSR portals scanned successfully!',
      data: result
    });
  } catch (err) {
    console.error('Error syncing government portals:', err);
    res.status(500).json({ success: false, message: 'Portal sync failed: ' + err.message });
  }
};

exports.getPortalCrawlerStatus = async (req, res) => {
  try {
    const status = scraperService.getPortalStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (err) {
    console.error('Error fetching portal crawler status:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch crawler status.' });
  }
};

