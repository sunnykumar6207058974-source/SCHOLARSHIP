const db = require('../config/db');

exports.applyForScholarship = async (req, res) => {
  try {
    const userId = req.user.id;
    const { scholarship_id, statement_of_purpose, current_institute } = req.body;

    if (!scholarship_id) {
      return res.status(400).json({ success: false, message: 'Scholarship ID is required.' });
    }

    // Check if scholarship exists and is open
    const { rows: schRows } = await db.query('SELECT title, status FROM scholarships WHERE id = ?', [scholarship_id]);
    if (schRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Scholarship not found.' });
    }

    if (schRows[0].status === 'closed') {
      return res.status(400).json({ success: false, message: 'This scholarship application window is closed.' });
    }

    // Check if already applied
    const { rows: existing } = await db.query(
      'SELECT id, application_number FROM applications WHERE user_id = ? AND scholarship_id = ?',
      [userId, scholarship_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `You have already submitted an application (${existing[0].application_number}) for this scholarship.`
      });
    }

    const appNumber = 'APP-2026-' + Math.floor(100000 + Math.random() * 900000);

    const appRes = await db.query(
      `INSERT INTO applications (
        application_number, user_id, scholarship_id, status,
        statement_of_purpose, current_institute, reviewer_notes
      ) VALUES (?, ?, ?, 'submitted', ?, ?, 'Application received. Pending initial document verification.')`,
      [
        appNumber,
        userId,
        scholarship_id,
        statement_of_purpose || 'Standard application submission.',
        current_institute || 'Affiliated College / Institute'
      ]
    );

    // Create user notification
    await db.query(
      `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)`,
      [
        userId,
        `Application Submitted: ${schRows[0].title}`,
        `Your application with reference number ${appNumber} has been successfully submitted and is under screening.`,
        'application'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Scholarship application submitted successfully!',
      application_number: appNumber,
      application_id: appRes.insertId
    });
  } catch (err) {
    console.error('Error applying for scholarship:', err);
    res.status(500).json({ success: false, message: 'Server error processing application.' });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const sql = `
      SELECT
        a.id, a.application_number, a.status, a.submission_date,
        a.statement_of_purpose, a.current_institute, a.reviewer_notes, a.updated_at,
        s.id as scholarship_id, s.title as scholarship_title, s.slug as scholarship_slug,
        s.provider_name, s.award_amount, s.deadline, s.scholarship_type,
        c.name as category_name
      FROM applications a
      JOIN scholarships s ON a.scholarship_id = s.id
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE a.user_id = ?
      ORDER BY a.submission_date DESC
    `;
    const { rows } = await db.query(sql, [userId]);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving applications.' });
  }
};

exports.getApplicationDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const appId = req.params.id;

    const sql = `
      SELECT
        a.*,
        s.title as scholarship_title, s.slug as scholarship_slug,
        s.provider_name, s.provider_logo, s.award_amount, s.deadline,
        u.name as applicant_name, u.email as applicant_email
      FROM applications a
      JOIN scholarships s ON a.scholarship_id = s.id
      JOIN users u ON a.user_id = u.id
      WHERE a.id = ? AND (a.user_id = ? OR ? = 'admin')
    `;

    const { rows } = await db.query(sql, [appId, userId, req.user.role]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('Error fetching application detail:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving application.' });
  }
};
