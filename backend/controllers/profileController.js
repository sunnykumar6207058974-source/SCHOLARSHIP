const db = require('../config/db');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { rows: users } = await db.query(
      'SELECT id, name, email, mobile, role, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const user = users[0];

    const { rows: profiles } = await db.query(
      'SELECT * FROM student_profiles WHERE user_id = ?',
      [userId]
    );
    const profile = profiles.length > 0 ? profiles[0] : null;

    // Fetch documents
    const { rows: documents } = await db.query(
      'SELECT * FROM documents WHERE user_id = ? ORDER BY uploaded_at DESC',
      [userId]
    );

    // Fetch saved scholarships count
    const { rows: savedCount } = await db.query(
      'SELECT COUNT(*) as count FROM saved_scholarships WHERE user_id = ?',
      [userId]
    );

    // Fetch applications count
    const { rows: appCount } = await db.query(
      'SELECT COUNT(*) as count FROM applications WHERE user_id = ?',
      [userId]
    );

    // Fetch unread notifications count
    const { rows: unreadNotifs } = await db.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
      [userId]
    );

    res.json({
      success: true,
      data: {
        user,
        profile,
        documents,
        stats: {
          saved_count: savedCount[0].count || savedCount[0]['COUNT(*)'] || 0,
          application_count: appCount[0].count || appCount[0]['COUNT(*)'] || 0,
          unread_notifications: unreadNotifs[0].count || unreadNotifs[0]['COUNT(*)'] || 0
        }
      }
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving profile.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      mobile,
      dob,
      gender,
      category,
      state_domicile,
      district,
      current_education_level,
      current_course,
      current_year,
      marks_percentage,
      family_annual_income,
      is_physically_challenged,
      bio
    } = req.body;

    // Update basic user info if name or mobile provided
    if (name || mobile !== undefined) {
      await db.query(
        'UPDATE users SET name = COALESCE(?, name), mobile = COALESCE(?, mobile) WHERE id = ?',
        [name ? name.trim() : null, mobile !== undefined ? mobile : null, userId]
      );
    }

    // Check if profile exists
    const { rows: existing } = await db.query('SELECT id FROM student_profiles WHERE user_id = ?', [userId]);

    if (existing.length === 0) {
      await db.query(
        `INSERT INTO student_profiles (
          user_id, dob, gender, category, state_domicile, district,
          current_education_level, current_course, current_year,
          marks_percentage, family_annual_income, is_physically_challenged, bio
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, dob || null, gender || 'All', category || 'General', state_domicile || 'All India',
          district || '', current_education_level || 'Graduation', current_course || '',
          current_year || '', marks_percentage || 0, family_annual_income || 0,
          is_physically_challenged ? 1 : 0, bio || ''
        ]
      );
    } else {
      await db.query(
        `UPDATE student_profiles SET
          dob = COALESCE(?, dob),
          gender = COALESCE(?, gender),
          category = COALESCE(?, category),
          state_domicile = COALESCE(?, state_domicile),
          district = COALESCE(?, district),
          current_education_level = COALESCE(?, current_education_level),
          current_course = COALESCE(?, current_course),
          current_year = COALESCE(?, current_year),
          marks_percentage = COALESCE(?, marks_percentage),
          family_annual_income = COALESCE(?, family_annual_income),
          is_physically_challenged = COALESCE(?, is_physically_challenged),
          bio = COALESCE(?, bio)
        WHERE user_id = ?`,
        [
          dob || null, gender, category, state_domicile, district,
          current_education_level, current_course, current_year,
          marks_percentage !== undefined ? parseFloat(marks_percentage) : null,
          family_annual_income !== undefined ? parseFloat(family_annual_income) : null,
          is_physically_challenged !== undefined ? (is_physically_challenged ? 1 : 0) : null,
          bio, userId
        ]
      );
    }

    res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
};

exports.getSavedScholarships = async (req, res) => {
  try {
    const userId = req.user.id;
    const sql = `
      SELECT
        s.id, s.title, s.slug, s.provider_name, s.provider_logo,
        s.award_amount, s.deadline, s.is_always_open, s.status,
        s.scholarship_type, s.education_level, s.brief_description,
        ss.saved_at, c.name as category_name
      FROM saved_scholarships ss
      JOIN scholarships s ON ss.scholarship_id = s.id
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE ss.user_id = ?
      ORDER BY ss.saved_at DESC
    `;
    const { rows } = await db.query(sql, [userId]);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching saved:', err);
    res.status(500).json({ success: false, message: 'Server error fetching saved scholarships.' });
  }
};

exports.toggleSaveScholarship = async (req, res) => {
  try {
    const userId = req.user.id;
    const scholarshipId = parseInt(req.params.id, 10);

    const { rows: existing } = await db.query(
      'SELECT id FROM saved_scholarships WHERE user_id = ? AND scholarship_id = ?',
      [userId, scholarshipId]
    );

    if (existing.length > 0) {
      await db.query(
        'DELETE FROM saved_scholarships WHERE user_id = ? AND scholarship_id = ?',
        [userId, scholarshipId]
      );
      return res.json({ success: true, saved: false, message: 'Scholarship removed from favorites.' });
    } else {
      await db.query(
        'INSERT INTO saved_scholarships (user_id, scholarship_id) VALUES (?, ?)',
        [userId, scholarshipId]
      );
      return res.json({ success: true, saved: true, message: 'Scholarship saved to your favorites!' });
    }
  } catch (err) {
    console.error('Error toggling save:', err);
    res.status(500).json({ success: false, message: 'Server error saving scholarship.' });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { document_type, file_name, file_url } = req.body;

    if (!document_type || !file_name) {
      return res.status(400).json({ success: false, message: 'Please specify document type and file name.' });
    }

    const sampleUrl = file_url || `/uploads/docs/${encodeURIComponent(file_name)}`;

    await db.query(
      'INSERT INTO documents (user_id, document_type, file_name, file_url, is_verified) VALUES (?, ?, ?, ?, 1)',
      [userId, document_type, file_name, sampleUrl]
    );

    res.status(201).json({ success: true, message: 'Document added to your secure vault.' });
  } catch (err) {
    console.error('Error uploading document:', err);
    res.status(500).json({ success: false, message: 'Server error storing document.' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ success: false, message: 'Server error fetching notifications.' });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifId = req.params.id;

    if (notifId === 'all') {
      await db.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);
    } else {
      await db.query('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [notifId, userId]);
    }

    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (err) {
    console.error('Error updating notification:', err);
    res.status(500).json({ success: false, message: 'Server error updating notification.' });
  }
};
