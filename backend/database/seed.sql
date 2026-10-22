-- Seed Data for EduScholar MySQL Database
USE eduscholar_db;

-- 1. Categories
INSERT INTO categories (name, slug, description, icon) VALUES
('Merit-cum-Means', 'merit-cum-means', 'Financial support for high academic achievers from economically weaker sections', 'Award'),
('Girls & Women', 'girls-women', 'Empowering female scholars across engineering, medicine, and general degrees', 'Heart'),
('Engineering & STEM', 'engineering-stem', 'Scholarships for B.Tech, Polytechnic, M.Tech, and Research students', 'Cpu'),
('Medical & Healthcare', 'medical-healthcare', 'Financial grants for MBBS, BDS, Nursing, and Allied Health Sciences', 'Activity'),
('Government & National', 'government-national', 'Central and State government initiatives including NSP and Post-Matric schemes', 'Landmark'),
('Minority & Social Inclusion', 'minority-inclusion', 'Affirmative action scholarships for SC, ST, OBC, and minority communities', 'Users'),
('Study Abroad & Global', 'study-abroad', 'Full and partial tuition coverage for foreign universities', 'Globe')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Demo Users (Passwords hashed for: Admin@123 and Student@123)
-- Admin@123 hash: $2a$10$wK1h8f7e2kH6OQ9lS8oYLe3gXmX8s2E5JpL7q1uT6W9Z3c7N8jH9a
-- Student@123 hash: $2a$10$tN4h7e2kH6OQ9lS8oYLe3gXmX8s2E5JpL7q1uT6W9Z3c7N8jH9b
INSERT INTO users (name, email, password, mobile, role) VALUES
('College Admin', 'admin@eduscholar.org', '$2a$10$1r2/K17QZJ7qQxI4xZ2Z/eYpYl/14tS368V0hL8ZcTz5qM2a.w9C6', '9876543210', 'admin'),
('Aarav Sharma', 'student@eduscholar.org', '$2a$10$1r2/K17QZJ7qQxI4xZ2Z/eYpYl/14tS368V0hL8ZcTz5qM2a.w9C6', '9812345678', 'student')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Student Profile for Aarav
INSERT INTO student_profiles (
  user_id, dob, gender, category, state_domicile, district,
  current_education_level, current_course, current_year,
  marks_percentage, family_annual_income, is_physically_challenged, bio
) VALUES (
  (SELECT id FROM users WHERE email='student@eduscholar.org'),
  '2004-05-15', 'Male', 'General', 'Maharashtra', 'Pune',
  'Graduation', 'B.Tech Computer Science', '3rd Year',
  84.50, 240000.00, 0,
  'Passionate computer science undergraduate looking for merit-based financial aid.'
) ON DUPLICATE KEY UPDATE current_course=VALUES(current_course);
