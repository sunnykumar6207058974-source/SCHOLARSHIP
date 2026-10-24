const bcrypt = require('bcryptjs');
const db = require('../config/db');
const {
  seedCategories,
  seedUsers,
  seedStudentProfiles,
  seedScholarships,
  seedArticles,
  seedResults,
  seedVideos,
  seedQuestions
} = require('./seedData');

async function setupTables() {
  console.log('📦 Initializing database schema...');
  await db.initDatabase();

  const engine = db.getEngine();
  const autoInc = engine === 'mysql' ? 'INT AUTO_INCREMENT' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
  const timestampCol = engine === 'mysql' ? 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' : 'DATETIME DEFAULT CURRENT_TIMESTAMP';

  // Table definitions
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id ${autoInc} ${engine === 'mysql' ? 'PRIMARY KEY' : ''},
      name VARCHAR(150) NOT NULL,
      email VARCHAR(191) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      mobile VARCHAR(20),
      role VARCHAR(20) DEFAULT 'student',
      created_at ${timestampCol},
      updated_at ${timestampCol}
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS student_profiles (
      id ${autoInc} ${engine === 'mysql' ? 'PRIMARY KEY' : ''},
      user_id INT NOT NULL UNIQUE,
      dob DATE,
      gender VARCHAR(20) DEFAULT 'All',
      category VARCHAR(50) DEFAULT 'General',
      state_domicile VARCHAR(100) DEFAULT 'All India',
      district VARCHAR(100),
      current_education_level VARCHAR(100) DEFAULT 'Graduation',
      current_course VARCHAR(150),
      current_year VARCHAR(50),
      marks_percentage DECIMAL(5,2) DEFAULT 0.00,
      family_annual_income DECIMAL(12,2) DEFAULT 0.00,
      is_physically_challenged INTEGER DEFAULT 0,
      bio TEXT,
      created_at ${timestampCol},
      updated_at ${timestampCol},
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id ${autoInc} ${engine === 'mysql' ? 'PRIMARY KEY' : ''},
      name VARCHAR(100) NOT NULL UNIQUE,
      slug VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      icon VARCHAR(50),
      created_at ${timestampCol}
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS scholarships (
      id ${autoInc} ${engine === 'mysql' ? 'PRIMARY KEY' : ''},
      category_id INT NULL,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      provider_name VARCHAR(200) NOT NULL,
      provider_logo VARCHAR(255),
      award_amount VARCHAR(100) NOT NULL,
      award_amount_value INT DEFAULT 0,
      deadline DATE,
      is_always_open INTEGER DEFAULT 0,
      status VARCHAR(20) DEFAULT 'live',
      scholarship_type VARCHAR(50) DEFAULT 'Corporate/CSR',
      scheme_authority_type VARCHAR(50) DEFAULT 'Central Government',
      education_level VARCHAR(100) DEFAULT 'All',
      state_domicile VARCHAR(100) DEFAULT 'All India',
      brief_description TEXT NOT NULL,
      full_overview TEXT,
      benefits TEXT,
      application_procedure TEXT,
      official_source_url VARCHAR(500),
      featured INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      previous_year_cutoff VARCHAR(100),
      last_year_disbursed_amount VARCHAR(100),
      total_beneficiaries_last_year INT DEFAULT 0,
      expected_next_cycle VARCHAR(100),
      history_summary TEXT,
      created_at ${timestampCol},
      updated_at ${timestampCol},
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS eligibility_criteria (
      id ${autoInc} ${engine === 'mysql' ? 'PRIMARY KEY' : ''},
      scholarship_id INT NOT NULL,
      min_education_level VARCHAR(100) DEFAULT 'All',
      min_marks_percentage DECIMAL(5,2) DEFAULT 0.00,
      max_family_income DECIMAL(12,2) DEFAULT NULL,
      applicable_gender VARCHAR(30) DEFAULT 'All',
      applicable_category VARCHAR(100) DEFAULT 'All',
      applicable_state VARCHAR(100) DEFAULT 'All India',
      requires_disability INTEGER DEFAULT 0,
      additional_rules TEXT,
      created_at ${timestampCol},
      FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS saved_scholarships (
      id ${autoInc} ${engine === 'mysql' ? 'PRIMARY KEY' : ''},
      user_id INT NOT NULL,
      scholarship_id INT NOT NULL,
      saved_at ${timestampCol},
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE,
      UNIQUE (user_id, scholarship_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS applications (
      id ${autoInc} ${engine === 'mysql' ? 'PRIMARY KEY' : ''},
      application_number VARCHAR(50) NOT NULL UNIQUE,
      user_id INT NOT NULL,
      scholarship_id INT NOT NULL,
      status VARCHAR(50) DEFAULT 'submitted',
      submission_date ${timestampCol},
      statement_of_purpose TEXT,
      current_institute VARCHAR(200),
      reviewer_notes TEXT,
      updated_at ${timestampCol},
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id ${autoInc} ${engine === 'mysql' ? 'PRIMARY KEY' : ''},
      user_id INT NOT NULL,
      document_type VARCHAR(100) NOT NULL,
      file_name VARCHAR(255) NOT NULL,
      file_url VARCHAR(500) NOT NULL,
      is_verified INTEGER DEFAULT 0,
      uploaded_at ${timestampCol},
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id ${autoInc} ${engine === 'mysql' ? 'PRIMARY KEY' : ''},
      user_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(50) DEFAULT 'system',
      is_read INTEGER DEFAULT 0,
      created_at ${timestampCol},
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS articles (
      id ${autoInc} ${engine === 'mysql' ? 'PRIMARY KEY' : ''},
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      category VARCHAR(100) NOT NULL,
      author VARCHAR(100) DEFAULT 'EduScholar Editorial Team',
      read_time VARCHAR(30) DEFAULT '5 min read',
      image_url VARCHAR(500),
      content TEXT NOT NULL,
      is_published INTEGER DEFAULT 1,
      created_at ${timestampCol}
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS faqs (
      id ${autoInc} ${engine === 'mysql' ? 'PRIMARY KEY' : ''},
      scholarship_id INT NULL,
      question VARCHAR(300) NOT NULL,
      answer TEXT NOT NULL,
      order_index INT DEFAULT 0,
      FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS questions (
      id ${autoInc} ${engine === 'mysql' ? 'PRIMARY KEY' : ''},
      user_id INT NOT NULL,
      title VARCHAR(300) NOT NULL,
      body TEXT NOT NULL,
      category VARCHAR(100) DEFAULT 'General',
      upvotes INT DEFAULT 0,
      answer_count INT DEFAULT 0,
      is_resolved INTEGER DEFAULT 0,
      created_at ${timestampCol},
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS answers (
      id ${autoInc} ${engine === 'mysql' ? 'PRIMARY KEY' : ''},
      question_id INT NOT NULL,
      user_id INT NOT NULL,
      answer_text TEXT NOT NULL,
      is_official INTEGER DEFAULT 0,
      created_at ${timestampCol},
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS scholarship_alerts (
      id ${autoInc} ${engine === 'mysql' ? 'PRIMARY KEY' : ''},
      scholarship_id INT NOT NULL,
      user_id INT NULL,
      email VARCHAR(191) NOT NULL,
      mobile VARCHAR(20),
      created_at ${timestampCol},
      FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE
    )
  `);

  // Incremental migration for existing databases
  const alterColumns = [
    "ALTER TABLE scholarships ADD COLUMN scheme_authority_type VARCHAR(50) DEFAULT 'Central Government'",
    "ALTER TABLE scholarships ADD COLUMN previous_year_cutoff VARCHAR(100)",
    "ALTER TABLE scholarships ADD COLUMN last_year_disbursed_amount VARCHAR(100)",
    "ALTER TABLE scholarships ADD COLUMN total_beneficiaries_last_year INT DEFAULT 0",
    "ALTER TABLE scholarships ADD COLUMN expected_next_cycle VARCHAR(100)",
    "ALTER TABLE scholarships ADD COLUMN history_summary TEXT"
  ];
  for (const alterSql of alterColumns) {
    try {
      await db.query(alterSql);
    } catch (e) {
      // Column may already exist
    }
  }

  console.log('✅ Tables created and migrated successfully.');
}

async function syncScholarships() {
  console.log('🔄 Synchronizing All-India & Past History scholarships...');
  const { rows: categories } = await db.query('SELECT id, slug FROM categories');
  const catMap = {};
  categories.forEach(c => { catMap[c.slug] = c.id; });

  for (const s of seedScholarships) {
    const { rows: exists } = await db.query('SELECT id FROM scholarships WHERE slug = ?', [s.slug]);
    const categoryId = catMap[s.category_slug] || null;

    if (exists.length === 0) {
      const res = await db.query(
        `INSERT INTO scholarships (
          category_id, title, slug, provider_name, provider_logo,
          award_amount, award_amount_value, deadline, is_always_open,
          status, scholarship_type, scheme_authority_type, education_level, state_domicile,
          brief_description, full_overview, benefits, application_procedure,
          official_source_url, featured, is_published,
          previous_year_cutoff, last_year_disbursed_amount, total_beneficiaries_last_year,
          expected_next_cycle, history_summary
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          categoryId, s.title, s.slug, s.provider_name, s.provider_logo || null,
          s.award_amount, s.award_amount_value, s.deadline, s.is_always_open || 0,
          s.status, s.scholarship_type, s.scheme_authority_type || 'Central Government',
          s.education_level, s.state_domicile, s.brief_description, s.full_overview,
          s.benefits, s.application_procedure, s.official_source_url, s.featured || 0, 1,
          s.previous_year_cutoff || null, s.last_year_disbursed_amount || null,
          s.total_beneficiaries_last_year || 0, s.expected_next_cycle || null, s.history_summary || null
        ]
      );
      const schId = res.insertId;

      if (s.criteria) {
        await db.query(
          `INSERT INTO eligibility_criteria (
            scholarship_id, min_education_level, min_marks_percentage,
            max_family_income, applicable_gender, applicable_category,
            applicable_state, requires_disability, additional_rules
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            schId, s.criteria.min_education_level, s.criteria.min_marks_percentage,
            s.criteria.max_family_income, s.criteria.applicable_gender,
            s.criteria.applicable_category, s.criteria.applicable_state,
            s.criteria.requires_disability, s.criteria.additional_rules
          ]
        );
      }

      if (s.faqs && s.faqs.length > 0) {
        for (let i = 0; i < s.faqs.length; i++) {
          await db.query(
            'INSERT INTO faqs (scholarship_id, question, answer, order_index) VALUES (?, ?, ?, ?)',
            [schId, s.faqs[i].question, s.faqs[i].answer, i]
          );
        }
      }
    } else {
      // Update historical fields if already in DB
      await db.query(
        `UPDATE scholarships SET
          scheme_authority_type = COALESCE(?, scheme_authority_type),
          previous_year_cutoff = COALESCE(?, previous_year_cutoff),
          last_year_disbursed_amount = COALESCE(?, last_year_disbursed_amount),
          total_beneficiaries_last_year = COALESCE(?, total_beneficiaries_last_year),
          expected_next_cycle = COALESCE(?, expected_next_cycle),
          history_summary = COALESCE(?, history_summary)
        WHERE slug = ?`,
        [
          s.scheme_authority_type || 'Central Government',
          s.previous_year_cutoff || null,
          s.last_year_disbursed_amount || null,
          s.total_beneficiaries_last_year || 0,
          s.expected_next_cycle || null,
          s.history_summary || null,
          s.slug
        ]
      );
    }
  }
  console.log('✅ Scholarships synchronized with 3-pillar data.');
}

async function seedDatabase() {
  await setupTables();

  // 1. Check if categories already seeded
  const { rows: existingCats } = await db.query('SELECT COUNT(*) as count FROM categories');
  const catCount = existingCats[0].count || existingCats[0]['COUNT(*)'] || 0;

  if (catCount > 0) {
    console.log('ℹ️  Database contains existing data. Synchronizing latest 3-pillar records...');
    await syncScholarships();
    return;
  }

  console.log('🌱 Seeding database...');

  // Seed Categories
  const catMap = {};
  for (const cat of seedCategories) {
    const res = await db.query(
      'INSERT INTO categories (name, slug, description, icon) VALUES (?, ?, ?, ?)',
      [cat.name, cat.slug, cat.description, cat.icon]
    );
    catMap[cat.slug] = res.insertId;
  }
  console.log('✅ Categories seeded.');

  // Seed Users
  const userMap = {};
  for (const user of seedUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const res = await db.query(
      'INSERT INTO users (name, email, password, mobile, role) VALUES (?, ?, ?, ?, ?)',
      [user.name, user.email, hashedPassword, user.mobile, user.role]
    );
    userMap[user.email] = res.insertId;
  }
  console.log('✅ Users seeded (Admin: admin@eduscholar.org / Admin@123, Student: student@eduscholar.org / Student@123).');

  // Seed Profiles
  for (const profile of seedStudentProfiles) {
    const userId = userMap[profile.userEmail];
    if (userId) {
      await db.query(
        `INSERT INTO student_profiles (
          user_id, dob, gender, category, state_domicile, district,
          current_education_level, current_course, current_year,
          marks_percentage, family_annual_income, is_physically_challenged, bio
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, profile.dob, profile.gender, profile.category, profile.state_domicile,
          profile.district, profile.current_education_level, profile.current_course,
          profile.current_year, profile.marks_percentage, profile.family_annual_income,
          profile.is_physically_challenged, profile.bio
        ]
      );
    }
  }
  console.log('✅ Student profiles seeded.');

  // Seed Scholarships & Criteria
  for (const s of seedScholarships) {
    const categoryId = catMap[s.category_slug] || null;
    const res = await db.query(
      `INSERT INTO scholarships (
        category_id, title, slug, provider_name, provider_logo,
        award_amount, award_amount_value, deadline, is_always_open,
        status, scholarship_type, scheme_authority_type, education_level, state_domicile,
        brief_description, full_overview, benefits, application_procedure,
        official_source_url, featured, is_published,
        previous_year_cutoff, last_year_disbursed_amount, total_beneficiaries_last_year,
        expected_next_cycle, history_summary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        categoryId, s.title, s.slug, s.provider_name, s.provider_logo || null,
        s.award_amount, s.award_amount_value, s.deadline, s.is_always_open || 0,
        s.status, s.scholarship_type, s.scheme_authority_type || 'Central Government',
        s.education_level, s.state_domicile,
        s.brief_description, s.full_overview, s.benefits, s.application_procedure,
        s.official_source_url, s.featured || 0, 1,
        s.previous_year_cutoff || null, s.last_year_disbursed_amount || null,
        s.total_beneficiaries_last_year || 0, s.expected_next_cycle || null, s.history_summary || null
      ]
    );
    const schId = res.insertId;

    // Criteria
    if (s.criteria) {
      await db.query(
        `INSERT INTO eligibility_criteria (
          scholarship_id, min_education_level, min_marks_percentage,
          max_family_income, applicable_gender, applicable_category,
          applicable_state, requires_disability, additional_rules
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          schId, s.criteria.min_education_level, s.criteria.min_marks_percentage,
          s.criteria.max_family_income, s.criteria.applicable_gender,
          s.criteria.applicable_category, s.criteria.applicable_state,
          s.criteria.requires_disability, s.criteria.additional_rules
        ]
      );
    }

    // FAQs
    if (s.faqs && s.faqs.length > 0) {
      for (let i = 0; i < s.faqs.length; i++) {
        await db.query(
          'INSERT INTO faqs (scholarship_id, question, answer, order_index) VALUES (?, ?, ?, ?)',
          [schId, s.faqs[i].question, s.faqs[i].answer, i]
        );
      }
    }
  }
  console.log('✅ Scholarships & Criteria seeded.');

  // Seed Sample Saved Scholarship & Application for Student
  const studentId = userMap['student@eduscholar.org'];
  if (studentId) {
    const { rows: schRows } = await db.query('SELECT id FROM scholarships LIMIT 3');
    if (schRows.length > 0) {
      // Save 1st scholarship
      await db.query('INSERT INTO saved_scholarships (user_id, scholarship_id) VALUES (?, ?)', [studentId, schRows[0].id]);
      
      // Apply for 2nd scholarship
      const appNum = 'APP-2026-' + Math.floor(100000 + Math.random() * 900000);
      await db.query(
        `INSERT INTO applications (
          application_number, user_id, scholarship_id, status, statement_of_purpose, current_institute, reviewer_notes
        ) VALUES (?, ?, ?, 'under_review', 'Applying for tuition assistance for high academic achievement in computer science.', 'Vellore Institute of Technology', 'Candidate profile verified. Awaiting income certification validation.')`,
        [appNum, studentId, schRows[0].id]
      );

      // Seed Notifications
      await db.query(
        `INSERT INTO notifications (user_id, title, message, type) VALUES
        (?, 'Application Submitted Successfully', 'Your application ${appNum} is currently Under Review by the scholarship committee.', 'application'),
        (?, 'Upcoming Deadline Reminder', 'Reliance Foundation Undergraduate Scholarship deadline is approaching on 15th December 2026.', 'deadline'),
        (?, 'Welcome to EduScholar!', 'Complete your 100% profile to receive customized scholarship recommendations.', 'system')`,
        [studentId, studentId, studentId]
      );

      // Seed Documents
      await db.query(
        `INSERT INTO documents (user_id, document_type, file_name, file_url, is_verified) VALUES
        (?, 'Class 12 Marksheet', 'Class12_Marksheet_AaravSharma.pdf', '/uploads/docs/sample_marksheet.pdf', 1),
        (?, 'Aadhaar Card', 'Aadhaar_AaravSharma.pdf', '/uploads/docs/sample_aadhaar.pdf', 1),
        (?, 'Family Income Certificate', 'IncomeCert_2026.pdf', '/uploads/docs/sample_income.pdf', 0)`,
        [studentId, studentId, studentId]
      );
    }
  }

  // Seed Articles
  for (const art of seedArticles) {
    await db.query(
      `INSERT INTO articles (title, slug, category, author, read_time, image_url, content)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [art.title, art.slug, art.category, art.author, art.read_time, art.image_url, art.content]
    );
  }
  console.log('✅ Articles seeded.');

  // Seed Questions and Answers
  const firstUser = userMap['student@eduscholar.org'] || 1;
  const adminUser = userMap['admin@eduscholar.org'] || 1;
  for (const q of seedQuestions) {
    const res = await db.query(
      'INSERT INTO questions (user_id, title, body, category, upvotes, answer_count) VALUES (?, ?, ?, ?, ?, ?)',
      [firstUser, q.title, q.body, q.category, q.upvotes, q.answers.length]
    );
    const qId = res.insertId;
    for (const ans of q.answers) {
      await db.query(
        'INSERT INTO answers (question_id, user_id, answer_text, is_official) VALUES (?, ?, ?, ?)',
        [qId, adminUser, ans.text, ans.is_official]
      );
    }
  }
  console.log('✅ Q&A Community seeded.');
  console.log('🎉 Database setup & seeding complete!');
}

if (require.main === module) {
  seedDatabase().then(() => {
    process.exit(0);
  }).catch(err => {
    console.error('Error during database seed:', err);
    process.exit(1);
  });
}

module.exports = { setupTables, seedDatabase };
