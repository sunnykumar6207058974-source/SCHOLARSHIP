-- EduScholar Database Schema
-- Inspired by Buddy4Study Scholarship Ecosystem
-- Compatible with MySQL 8.0+

CREATE DATABASE IF NOT EXISTS eduscholar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eduscholar_db;

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(20),
    role ENUM('student', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Student Profiles
CREATE TABLE IF NOT EXISTS student_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
    is_physically_challenged TINYINT(1) DEFAULT 0,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_profile_edu (current_education_level),
    INDEX idx_profile_state (state_domicile)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Categories
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Scholarships
CREATE TABLE IF NOT EXISTS scholarships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    provider_name VARCHAR(200) NOT NULL,
    provider_logo VARCHAR(255),
    award_amount VARCHAR(100) NOT NULL,
    award_amount_value INT DEFAULT 0,
    deadline DATE,
    is_always_open TINYINT(1) DEFAULT 0,
    status ENUM('live', 'upcoming', 'closed') DEFAULT 'live',
    scholarship_type VARCHAR(50) DEFAULT 'Corporate/CSR',
    education_level VARCHAR(100) DEFAULT 'All',
    state_domicile VARCHAR(100) DEFAULT 'All India',
    brief_description TEXT NOT NULL,
    full_overview LONGTEXT,
    benefits LONGTEXT,
    application_procedure LONGTEXT,
    official_source_url VARCHAR(500),
    featured TINYINT(1) DEFAULT 0,
    is_published TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_sch_status (status),
    INDEX idx_sch_featured (featured),
    INDEX idx_sch_type (scholarship_type),
    INDEX idx_sch_deadline (deadline)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Eligibility Criteria
CREATE TABLE IF NOT EXISTS eligibility_criteria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scholarship_id INT NOT NULL,
    min_education_level VARCHAR(100) DEFAULT 'All',
    min_marks_percentage DECIMAL(5,2) DEFAULT 0.00,
    max_family_income DECIMAL(12,2) DEFAULT NULL,
    applicable_gender VARCHAR(30) DEFAULT 'All',
    applicable_category VARCHAR(100) DEFAULT 'All',
    applicable_state VARCHAR(100) DEFAULT 'All India',
    requires_disability TINYINT(1) DEFAULT 0,
    additional_rules TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE,
    INDEX idx_crit_sch (scholarship_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Saved Scholarships
CREATE TABLE IF NOT EXISTS saved_scholarships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    scholarship_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_sch (user_id, scholarship_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Applications
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_number VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    scholarship_id INT NOT NULL,
    status ENUM('submitted', 'under_review', 'documents_verified', 'interview_scheduled', 'approved', 'rejected', 'awarded') DEFAULT 'submitted',
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statement_of_purpose TEXT,
    current_institute VARCHAR(200),
    reviewer_notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE,
    INDEX idx_app_user (user_id),
    INDEX idx_app_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Documents
CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    is_verified TINYINT(1) DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'system',
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notif_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Articles
CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    author VARCHAR(100) DEFAULT 'EduScholar Editorial Team',
    read_time VARCHAR(30) DEFAULT '5 min read',
    image_url VARCHAR(500),
    content LONGTEXT NOT NULL,
    is_published TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. FAQs
CREATE TABLE IF NOT EXISTS faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scholarship_id INT NULL,
    question VARCHAR(300) NOT NULL,
    answer TEXT NOT NULL,
    order_index INT DEFAULT 0,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Community Questions (Q&A)
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(300) NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    upvotes INT DEFAULT 0,
    answer_count INT DEFAULT 0,
    is_resolved TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Answers
CREATE TABLE IF NOT EXISTS answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    user_id INT NOT NULL,
    answer_text TEXT NOT NULL,
    is_official TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
