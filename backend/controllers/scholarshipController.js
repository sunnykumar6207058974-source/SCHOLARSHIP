const db = require('../config/db');

exports.getScholarships = async (req, res) => {
  try {
    const {
      tab = 'live', // live, history, upcoming, always_open, all
      search = '',
      education_level = '',
      state = '',
      scholarship_type = '',
      scheme_authority_type = '',
      category = '',
      gender = '',
      min_marks = '',
      max_income = '',
      sort = 'deadline',
      page = 1,
      limit = 9
    } = req.query;

    let queryConditions = ['s.is_published = 1'];
    let params = [];

    // Filter by tab
    if (tab === 'live') {
      queryConditions.push("(s.status = 'live' AND (s.deadline >= DATE('now') OR s.is_always_open = 1 OR s.deadline IS NULL))");
    } else if (tab === 'history' || tab === 'closed') {
      queryConditions.push("(s.status = 'closed' OR (s.deadline < DATE('now') AND s.is_always_open = 0))");
    } else if (tab === 'upcoming') {
      queryConditions.push("s.status = 'upcoming'");
    } else if (tab === 'always_open') {
      queryConditions.push('s.is_always_open = 1');
    }

    // Filter by Scheme Authority Type (Central vs State vs Corporate)
    if (scheme_authority_type && scheme_authority_type !== 'All') {
      queryConditions.push('s.scheme_authority_type = ?');
      params.push(scheme_authority_type);
    }

    // Keyword search
    if (search.trim()) {
      queryConditions.push('(s.title LIKE ? OR s.provider_name LIKE ? OR s.brief_description LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    // Education level
    if (education_level && education_level !== 'All') {
      queryConditions.push('(s.education_level = ? OR s.education_level = \'All\' OR ec.min_education_level = ? OR ec.min_education_level = \'All\')');
      params.push(education_level, education_level);
    }

    // State
    if (state && state !== 'All India') {
      queryConditions.push('(s.state_domicile = ? OR s.state_domicile LIKE ? OR s.state_domicile = \'All India\' OR ec.applicable_state = \'All India\' OR ec.applicable_state LIKE ?)');
      params.push(state, `%${state}%`, `%${state}%`);
    }

    // Scholarship Type
    if (scholarship_type && scholarship_type !== 'All') {
      queryConditions.push('s.scholarship_type = ?');
      params.push(scholarship_type);
    }

    // Category (by slug or name)
    if (category && category !== 'All') {
      queryConditions.push('(c.slug = ? OR c.name = ?)');
      params.push(category, category);
    }

    // Gender filter
    if (gender && gender !== 'All') {
      queryConditions.push('(ec.applicable_gender = ? OR ec.applicable_gender = \'All\')');
      params.push(gender);
    }

    // Academic marks
    if (min_marks) {
      const marksVal = parseFloat(min_marks);
      if (!isNaN(marksVal)) {
        queryConditions.push('(ec.min_marks_percentage <= ? OR ec.min_marks_percentage IS NULL)');
        params.push(marksVal);
      }
    }

    // Max family income
    if (max_income) {
      const incomeVal = parseFloat(max_income);
      if (!isNaN(incomeVal)) {
        queryConditions.push('(ec.max_family_income >= ? OR ec.max_family_income IS NULL)');
        params.push(incomeVal);
      }
    }

    // Sorting
    let orderBy = 's.deadline ASC';
    if (sort === 'award_high') {
      orderBy = 's.award_amount_value DESC';
    } else if (sort === 'newest') {
      orderBy = 's.created_at DESC';
    } else if (sort === 'deadline') {
      orderBy = 'CASE WHEN s.deadline IS NULL THEN 1 ELSE 0 END, s.deadline ASC';
    }

    const whereClause = queryConditions.length > 0 ? `WHERE ${queryConditions.join(' AND ')}` : '';

    // Count total matches
    const countSql = `
      SELECT COUNT(DISTINCT s.id) as total
      FROM scholarships s
      LEFT JOIN categories c ON s.category_id = c.id
      LEFT JOIN eligibility_criteria ec ON s.id = ec.scholarship_id
      ${whereClause}
    `;
    const { rows: countRows } = await db.query(countSql, params);
    const totalCount = countRows[0].total || countRows[0]['COUNT(DISTINCT s.id)'] || 0;

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const offset = (pageNum - 1) * limitNum;

    // Fetch items
    const sql = `
      SELECT DISTINCT
        s.id, s.title, s.slug, s.provider_name, s.provider_logo,
        s.award_amount, s.award_amount_value, s.deadline, s.is_always_open,
        s.status, s.scholarship_type, s.scheme_authority_type, s.education_level, s.state_domicile,
        s.brief_description, s.featured, s.created_at,
        s.official_source_url,
        s.previous_year_cutoff, s.last_year_disbursed_amount, s.total_beneficiaries_last_year,
        s.expected_next_cycle, s.history_summary,
        c.name as category_name, c.slug as category_slug,
        ec.min_marks_percentage, ec.max_family_income, ec.applicable_gender, ec.additional_rules
      FROM scholarships s
      LEFT JOIN categories c ON s.category_id = c.id
      LEFT JOIN eligibility_criteria ec ON s.id = ec.scholarship_id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const { rows: scholarships } = await db.query(sql, [...params, limitNum, offset]);

    // Check if user has saved any of these scholarships
    let savedIds = new Set();
    if (req.user && req.user.id) {
      const { rows: savedRows } = await db.query('SELECT scholarship_id FROM saved_scholarships WHERE user_id = ?', [req.user.id]);
      savedIds = new Set(savedRows.map(r => r.scholarship_id));
    }

    const enriched = scholarships.map(sch => ({
      ...sch,
      is_saved: savedIds.has(sch.id)
    }));

    res.json({
      success: true,
      data: enriched,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum)
      }
    });
  } catch (err) {
    console.error('Error fetching scholarships:', err);
    res.status(500).json({ success: false, message: 'Server error fetching scholarships.' });
  }
};

exports.getFeaturedScholarships = async (req, res) => {
  try {
    const sql = `
      SELECT
        s.id, s.title, s.slug, s.provider_name, s.provider_logo,
        s.award_amount, s.deadline, s.is_always_open, s.status,
        s.scholarship_type, s.education_level, s.brief_description,
        c.name as category_name, c.slug as category_slug
      FROM scholarships s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.is_published = 1 AND s.featured = 1
      ORDER BY s.deadline ASC
      LIMIT 6
    `;
    const { rows } = await db.query(sql);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching featured:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch featured scholarships.' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const sql = `
      SELECT c.*, COUNT(s.id) as scholarship_count
      FROM categories c
      LEFT JOIN scholarships s ON c.id = s.category_id AND s.is_published = 1
      GROUP BY c.id
      ORDER BY scholarship_count DESC
    `;
    const { rows } = await db.query(sql);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
};

exports.getScholarshipDetail = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const isNumeric = /^\d+$/.test(idOrSlug);

    const condition = isNumeric ? 's.id = ?' : 's.slug = ?';
    const sql = `
      SELECT
        s.*,
        c.name as category_name, c.slug as category_slug
      FROM scholarships s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE ${condition} AND s.is_published = 1
    `;
    const { rows } = await db.query(sql, [idOrSlug]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Scholarship not found or no longer available.' });
    }

    const scholarship = rows[0];

    // Fetch criteria
    const { rows: criteriaRows } = await db.query(
      'SELECT * FROM eligibility_criteria WHERE scholarship_id = ?',
      [scholarship.id]
    );
    scholarship.criteria = criteriaRows.length > 0 ? criteriaRows[0] : null;

    // Fetch FAQs
    const { rows: faqs } = await db.query(
      'SELECT question, answer FROM faqs WHERE scholarship_id = ? ORDER BY order_index ASC',
      [scholarship.id]
    );
    scholarship.faqs = faqs;

    // Check saved status if logged in
    scholarship.is_saved = false;
    if (req.user && req.user.id) {
      const { rows: saved } = await db.query(
        'SELECT id FROM saved_scholarships WHERE user_id = ? AND scholarship_id = ?',
        [req.user.id, scholarship.id]
      );
      scholarship.is_saved = saved.length > 0;
    }

    // Fetch related scholarships in same category
    const { rows: related } = await db.query(
      `SELECT id, title, slug, provider_name, award_amount, deadline, status
       FROM scholarships
       WHERE category_id = ? AND id != ? AND is_published = 1
       LIMIT 3`,
      [scholarship.category_id, scholarship.id]
    );
    scholarship.related = related;

    res.json({ success: true, data: scholarship });
  } catch (err) {
    console.error('Error fetching scholarship detail:', err);
    res.status(500).json({ success: false, message: 'Server error fetching scholarship details.' });
  }
};

exports.subscribeAlert = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const { email, mobile } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const userId = req.user ? req.user.id : null;

    // Find scholarship
    const isNumeric = /^\d+$/.test(idOrSlug);
    const cond = isNumeric ? 'id = ?' : 'slug = ?';
    const { rows: schRows } = await db.query(`SELECT id, title, expected_next_cycle FROM scholarships WHERE ${cond}`, [idOrSlug]);

    if (schRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Scholarship program not found.' });
    }

    const sch = schRows[0];
    const cleanEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const { rows: existing } = await db.query(
      'SELECT id FROM scholarship_alerts WHERE scholarship_id = ? AND email = ?',
      [sch.id, cleanEmail]
    );

    if (existing.length > 0) {
      return res.json({
        success: true,
        already_subscribed: true,
        message: `You are already registered for alerts! We will notify you at ${cleanEmail} as soon as applications open for ${sch.expected_next_cycle || 'the next cycle'}.`
      });
    }

    await db.query(
      'INSERT INTO scholarship_alerts (scholarship_id, user_id, email, mobile) VALUES (?, ?, ?, ?)',
      [sch.id, userId, cleanEmail, mobile ? mobile.trim() : null]
    );

    res.json({
      success: true,
      message: `Alert registered successfully! We will email you at ${cleanEmail} as soon as "${sch.title}" opens for ${sch.expected_next_cycle || 'the next cycle'}.`
    });
  } catch (err) {
    console.error('Error registering alert:', err);
    res.status(500).json({ success: false, message: 'Failed to register alert.' });
  }
};
