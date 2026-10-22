const bcrypt = require('bcryptjs');

const seedCategories = [
  { name: 'Merit-cum-Means', slug: 'merit-cum-means', description: 'Financial support for high academic achievers from economically weaker sections', icon: 'Award' },
  { name: 'Girls & Women', slug: 'girls-women', description: 'Empowering female scholars across engineering, medicine, and general degrees', icon: 'Heart' },
  { name: 'Engineering & STEM', slug: 'engineering-stem', description: 'Scholarships for B.Tech, Polytechnic, M.Tech, and Research students', icon: 'Cpu' },
  { name: 'Medical & Healthcare', slug: 'medical-healthcare', description: 'Financial grants for MBBS, BDS, Nursing, and Allied Health Sciences', icon: 'Activity' },
  { name: 'Government & National', slug: 'government-national', description: 'Central and State government initiatives including NSP and Post-Matric schemes', icon: 'Landmark' },
  { name: 'Minority & Social Inclusion', slug: 'minority-inclusion', description: 'Affirmative action scholarships for SC, ST, OBC, and minority communities', icon: 'Users' },
  { name: 'Study Abroad & Global', slug: 'study-abroad', description: 'Full and partial tuition coverage for foreign universities', icon: 'Globe' }
];

const seedUsers = [
  {
    name: 'College Admin',
    email: 'admin@eduscholar.org',
    password: 'Admin@123', // will be hashed
    mobile: '9876543210',
    role: 'admin'
  },
  {
    name: 'Aarav Sharma',
    email: 'student@eduscholar.org',
    password: 'Student@123', // will be hashed
    mobile: '9812345678',
    role: 'student'
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    password: 'Student@123',
    mobile: '9823456789',
    role: 'student'
  }
];

const seedStudentProfiles = [
  {
    userEmail: 'student@eduscholar.org',
    dob: '2004-05-15',
    gender: 'Male',
    category: 'General',
    state_domicile: 'Maharashtra',
    district: 'Pune',
    current_education_level: 'Graduation',
    current_course: 'B.Tech Computer Science',
    current_year: '3rd Year',
    marks_percentage: 84.50,
    family_annual_income: 240000.00,
    is_physically_challenged: 0,
    bio: 'Passionate computer science undergraduate looking for merit-based financial aid to complete software research projects.'
  },
  {
    userEmail: 'priya.patel@example.com',
    dob: '2005-08-20',
    gender: 'Female',
    category: 'OBC',
    state_domicile: 'Gujarat',
    district: 'Ahmedabad',
    current_education_level: 'Graduation',
    current_course: 'MBBS Medical Sciences',
    current_year: '2nd Year',
    marks_percentage: 89.20,
    family_annual_income: 180000.00,
    is_physically_challenged: 0,
    bio: 'Medical student committed to community healthcare in underserved rural districts.'
  }
];

const seedScholarships = [
  {
    title: 'Tata Trust Medical and Healthcare Scholars Program 2026',
    slug: 'tata-trust-medical-healthcare-program-2026',
    category_slug: 'medical-healthcare',
    provider_name: 'Sir Ratan Tata Trust & Allied Trusts',
    award_amount: 'Up to ₹1,50,000 per annum',
    award_amount_value: 150000,
    deadline: '2026-11-30',
    is_always_open: 0,
    status: 'live',
    scholarship_type: 'Corporate/CSR',
    education_level: 'Graduation',
    state_domicile: 'All India',
    brief_description: 'Financial aid covering up to 80% of tuition fees for meritorious students pursuing MBBS, BDS, or Nursing in accredited government or recognized colleges.',
    full_overview: 'Sir Ratan Tata Trust and Allied Trusts invite applications from eligible undergraduate and postgraduate students enrolled in recognized medical and healthcare disciplines across India. This initiative strives to support future doctors and medical personnel facing genuine financial challenges.',
    benefits: 'Covers college tuition fees up to ₹1,50,000 per year or 80% of actual tuition fee (whichever is lower). Additional book and equipment allowance of ₹15,000 provided for top percentile candidates.',
    application_procedure: '1. Register or Log in to the EduScholar portal.\n2. Verify personal details and submit academic transcripts.\n3. Upload parent/guardian annual income statement.\n4. Complete the brief Statement of Purpose explaining healthcare aspirations.\n5. Submit online application before 30th November 2026.',
    official_source_url: 'https://www.tatatrusts.org/our-work/individual-grants-programme/education-grants',
    featured: 1,
    criteria: {
      min_education_level: 'Graduation',
      min_marks_percentage: 70.00,
      max_family_income: 600000.00,
      applicable_gender: 'All',
      applicable_category: 'All',
      applicable_state: 'All India',
      requires_disability: 0,
      additional_rules: 'Candidate must have cleared NEET UG with a valid percentile and be admitted to an NMC recognized medical college.'
    },
    faqs: [
      { question: 'Is this scholarship open to students studying in private medical colleges?', answer: 'Yes, both government and recognized private medical college students can apply, provided their family income is under ₹6,00,000 per year.' },
      { question: 'When will the funds be disbursed?', answer: 'Disbursement occurs directly into the verified college fee account or student bank account within 6 weeks of final document verification.' }
    ]
  },
  {
    title: 'Reliance Foundation Undergraduate Scholarships 2026-27',
    slug: 'reliance-foundation-ug-scholarships-2026',
    category_slug: 'merit-cum-means',
    provider_name: 'Reliance Foundation',
    award_amount: 'Up to ₹2,00,000 total grant',
    award_amount_value: 200000,
    deadline: '2026-12-15',
    is_always_open: 0,
    status: 'live',
    scholarship_type: 'Corporate/CSR',
    education_level: 'Graduation',
    state_domicile: 'All India',
    brief_description: 'Prestigious merit-cum-means scholarship for 5,000 first-year undergraduate students studying any recognized stream across India.',
    full_overview: 'The Reliance Foundation Undergraduate Scholarship aims to support meritorious students from diverse backgrounds across India to pursue their undergraduate education, empowering them to become leaders of tomorrow and drive positive societal change.',
    benefits: 'Financial grant of up to ₹2 Lakh over the complete duration of the degree course. Mentorship opportunities, alumni network access, and leadership development workshops with top industry experts.',
    application_procedure: 'Step 1: Complete the online eligibility check.\nStep 2: Fill out basic personal, educational, and income details.\nStep 3: Appear for an online aptitude assessment.\nStep 4: Upload verified copies of Class 12 board marksheet and income certificate.',
    official_source_url: 'https://www.reliancefoundation.org/scholarships',
    featured: 1,
    criteria: {
      min_education_level: 'Graduation',
      min_marks_percentage: 60.00,
      max_family_income: 1500000.00,
      applicable_gender: 'All',
      applicable_category: 'All',
      applicable_state: 'All India',
      requires_disability: 0,
      additional_rules: 'First-year students enrolled in full-time regular undergraduate degree programs. Preference given to students with family income under ₹2.5 Lakh.'
    },
    faqs: [
      { question: 'Is there an aptitude test for Reliance Foundation scholarship?', answer: 'Yes, applicants who pass the initial screening are invited to take a 60-minute online multiple-choice aptitude test.' }
    ]
  },
  {
    title: 'HDFC Bank Parivartan Badhte Kadam Scholarship 2026',
    slug: 'hdfc-bank-parivartan-badhte-kadam-2026',
    category_slug: 'merit-cum-means',
    provider_name: 'HDFC Bank CSR Parivartan',
    award_amount: 'Up to ₹75,000 per year',
    award_amount_value: 75000,
    deadline: '2026-10-31',
    is_always_open: 0,
    status: 'live',
    scholarship_type: 'Corporate/CSR',
    education_level: 'All',
    state_domicile: 'All India',
    brief_description: 'Empowering high-potential underprivileged students facing sudden financial distress to prevent education disruption.',
    full_overview: 'HDFC Bank Parivartan Badhte Kadam Scholarship provides assistance to school and college scholars across India who are undergoing financial crises (loss of earning parent, medical emergencies) to ensure uninterrupted learning.',
    benefits: 'Class 11 & 12: ₹18,000 | General UG: ₹30,000 | Professional Degrees (Engineering/MBBS/Law): Up to ₹75,000 per annum.',
    application_procedure: 'Fill application online, upload recent academic records, proof of crisis (if applicable), family income certificate, and active bank account passbook.',
    official_source_url: 'https://www.hdfcbank.com/personal/about-us/corporate-social-responsibility/parivartan',
    featured: 1,
    criteria: {
      min_education_level: 'All',
      min_marks_percentage: 55.00,
      max_family_income: 600000.00,
      applicable_gender: 'All',
      applicable_category: 'All',
      applicable_state: 'All India',
      requires_disability: 0,
      additional_rules: 'Open for Class 11 to Post-Graduation students with minimum 55% in preceding exam.'
    },
    faqs: [
      { question: 'Who can apply for Badhte Kadam?', answer: 'Students from Class 11 to PG courses experiencing economic constraints with family income below ₹6 Lakhs.' }
    ]
  },
  {
    title: 'L’Oréal India For Young Women in Science Scholarship 2026',
    slug: 'loreal-india-women-in-science-2026',
    category_slug: 'girls-women',
    provider_name: 'L’Oréal India',
    award_amount: '₹2,50,000 over 4 years',
    award_amount_value: 250000,
    deadline: '2026-11-20',
    is_always_open: 0,
    status: 'live',
    scholarship_type: 'Corporate/CSR',
    education_level: 'Graduation',
    state_domicile: 'All India',
    brief_description: 'Exclusively for young women who have passed Class 12 in the science stream and wish to pursue higher education in STEM disciplines.',
    full_overview: 'Launched in 2003, this nationwide program encourages and aids meritorious young women to pursue graduation in Pure Sciences, Applied Sciences, Biotechnology, Engineering, or Medicine at recognized Indian institutions.',
    benefits: 'A total financial award of ₹2,50,000 divided over the graduation course duration, plus technical mentoring by L’Oréal scientists and industry leaders.',
    application_procedure: 'Submit Class 10 & 12 board marksheet, admission letter in science/engineering/medical stream, income certificate, and short essay answering "Why science inspires me".',
    official_source_url: 'https://www.loreal.com/en/india/articles/commitments/for-women-in-science/',
    featured: 1,
    criteria: {
      min_education_level: 'Graduation',
      min_marks_percentage: 85.00,
      max_family_income: 400000.00,
      applicable_gender: 'Female',
      applicable_category: 'All',
      applicable_state: 'All India',
      requires_disability: 0,
      additional_rules: 'Female candidates only. Minimum 85% in PCB/PCM in Class 12 board exams during current academic session.'
    },
    faqs: [
      { question: 'Is this open to male candidates?', answer: 'No, this specific scheme is dedicated solely to female scholars in science disciplines.' }
    ]
  },
  {
    title: 'Santoor Women’s Scholarship 2026-27',
    slug: 'santoor-womens-scholarship-2026',
    category_slug: 'girls-women',
    provider_name: 'Wipro Cares & Santoor',
    award_amount: '₹24,000 per year',
    award_amount_value: 24000,
    deadline: '2026-11-15',
    is_always_open: 0,
    status: 'live',
    scholarship_type: 'Corporate/CSR',
    education_level: 'Graduation',
    state_domicile: 'Karnataka, Andhra Pradesh, Telangana, Chhattisgarh',
    brief_description: 'Dedicated financial grant for young women from underprivileged backgrounds in select southern and central states pursuing full-time graduate degrees.',
    full_overview: 'The Santoor Scholarship program is an initiative of Wipro Enterprises to support girl students from marginalized socioeconomic segments who have completed schooling from government schools or junior colleges.',
    benefits: '₹24,000 per year throughout the 3 to 4 years duration of undergraduate education for tuition and academic supplies.',
    application_procedure: 'Apply through online portal with intermediate marksheet, government school passing certificate, Aadhaar card, and valid bank passbook.',
    official_source_url: 'https://www.santoorscholarship.com',
    featured: 0,
    criteria: {
      min_education_level: 'Graduation',
      min_marks_percentage: 60.00,
      max_family_income: 300000.00,
      applicable_gender: 'Female',
      applicable_category: 'All',
      applicable_state: 'Karnataka',
      requires_disability: 0,
      additional_rules: 'Must have passed Class 10 and 12 from a government school/inter-college in Karnataka, Andhra Pradesh, Telangana, or Chhattisgarh.'
    },
    faqs: [
      { question: 'Can students pursuing polytechnic diploma apply?', answer: 'No, only full-time 3 or 4-year degree courses (B.A, B.Sc, B.Com, B.Tech, etc.) are covered.' }
    ]
  },
  {
    title: 'National Scholarship Portal (NSP) Post Matric Scholarship for Minorities 2026',
    slug: 'nsp-post-matric-scholarship-minorities-2026',
    category_slug: 'minority-inclusion',
    provider_name: 'Ministry of Minority Affairs, Govt. of India',
    award_amount: 'Up to ₹20,000 + Maintenance allowance',
    award_amount_value: 20000,
    deadline: '2026-12-31',
    is_always_open: 0,
    status: 'live',
    scholarship_type: 'Government',
    education_level: 'Class 11-12',
    state_domicile: 'All India',
    brief_description: 'Central government scholarship supporting minority students (Muslim, Christian, Sikh, Buddhist, Jain, Parsi) from Class 11 through PhD.',
    full_overview: 'The Post Matric Scholarship scheme for Minorities facilitates access to secondary and higher education, providing financial grants to students from notified minority communities across India.',
    benefits: 'Admission and course fee up to ₹10,000 per year plus monthly maintenance allowance up to ₹1,200 per month for hostellers.',
    application_procedure: 'Register on NSP portal with Aadhaar, submit institute code, upload community declaration and parent income certificate.',
    official_source_url: 'https://scholarships.gov.in',
    featured: 1,
    criteria: {
      min_education_level: 'Class 11-12',
      min_marks_percentage: 50.00,
      max_family_income: 200000.00,
      applicable_gender: 'All',
      applicable_category: 'Minority',
      applicable_state: 'All India',
      requires_disability: 0,
      additional_rules: 'Student must belong to a notified religious minority community with family income below ₹2,00,000 per annum.'
    },
    faqs: [
      { question: 'Can I apply if my sibling is also applying?', answer: 'Yes, but not more than two students from one family can benefit under the scheme.' }
    ]
  },
  {
    title: 'Infosys Foundation STEM Stars Scholarship 2026',
    slug: 'infosys-foundation-stem-stars-2026',
    category_slug: 'engineering-stem',
    provider_name: 'Infosys Foundation',
    award_amount: 'Up to ₹1,00,000 annually',
    award_amount_value: 100000,
    deadline: '2026-11-25',
    is_always_open: 0,
    status: 'live',
    scholarship_type: 'Corporate/CSR',
    education_level: 'Graduation',
    state_domicile: 'All India',
    brief_description: 'Full tuition assistance and living expense stipend for female students admitted to NIRF top 100 engineering institutes.',
    full_overview: 'Infosys Foundation STEM Stars Scholarship encourages women to excel in science, technology, engineering, and mathematics by covering tuition, college hostel fees, and learning resources throughout 4 years.',
    benefits: 'Up to ₹1,00,000 per annum covering college fees, hostel expenses, study materials, and mentorship by Infosys engineers.',
    application_procedure: 'Apply via online portal, provide JEE Mains scorecard, college allotment letter, and family income certificate.',
    official_source_url: 'https://www.infosys.org/infosys-foundation/initiatives/education.html',
    featured: 1,
    criteria: {
      min_education_level: 'Graduation',
      min_marks_percentage: 75.00,
      max_family_income: 800000.00,
      applicable_gender: 'Female',
      applicable_category: 'All',
      applicable_state: 'All India',
      requires_disability: 0,
      additional_rules: 'Female students admitted in 1st year B.E./B.Tech in NIRF ranked engineering colleges.'
    },
    faqs: [
      { question: 'Does this renew automatically every year?', answer: 'Yes, subject to maintaining a CGPA of 7.0 or above in each semester.' }
    ]
  },
  {
    title: 'Prime Minister Special Scholarship Scheme (PMSSS) 2026-27',
    slug: 'pmsss-jk-ladakh-scholarship-2026',
    category_slug: 'government-national',
    provider_name: 'AICTE & Ministry of Education',
    award_amount: 'Full Fee + ₹1,00,000 Maintenance',
    award_amount_value: 300000,
    deadline: '2026-10-25',
    is_always_open: 0,
    status: 'upcoming',
    scholarship_type: 'Government',
    education_level: 'Graduation',
    state_domicile: 'Jammu & Kashmir',
    brief_description: 'Comprehensive scholarship for students of J&K and Ladakh to study in premier colleges across India outside their home state.',
    full_overview: 'Prime Minister Special Scholarship Scheme provides academic fees directly to the admitting institute and maintenance allowances directly to eligible youth from J&K and Ladakh.',
    benefits: 'Academic fees up to ₹1,25,000 for Engineering, ₹30,000 for General Degree, ₹3,00,000 for Medical, plus uniform ₹1,00,000 maintenance grant per year.',
    application_procedure: 'Register at AICTE PMSSS portal, complete facilitation center document verification, and participate in online counseling.',
    official_source_url: 'https://www.aicte-india.org/bureaus/pms-j-k',
    featured: 0,
    criteria: {
      min_education_level: 'Graduation',
      min_marks_percentage: 60.00,
      max_family_income: 800000.00,
      applicable_gender: 'All',
      applicable_category: 'All',
      applicable_state: 'Jammu and Kashmir',
      requires_disability: 0,
      additional_rules: 'Must hold valid domicile of UT of Jammu & Kashmir or UT of Ladakh and have passed 12th from JKBOSE/CBSE within J&K/Ladakh.'
    },
    faqs: [
      { question: 'Is NEET required for MBBS under PMSSS?', answer: 'Yes, NEET qualification is mandatory for medical/dental admissions.' }
    ]
  },
  {
    title: 'Colgate Keep India Smiling Foundational Scholarship 2026',
    slug: 'colgate-keep-india-smiling-2026',
    category_slug: 'merit-cum-means',
    provider_name: 'Colgate-Palmolive (India) Limited',
    award_amount: 'Up to ₹30,000 per year',
    award_amount_value: 30000,
    deadline: '2027-01-31',
    is_always_open: 0,
    status: 'live',
    scholarship_type: 'Corporate/CSR',
    education_level: 'All',
    state_domicile: 'All India',
    brief_description: 'Foundational scholarship program providing financial grants to students from Class 11 up to professional degrees or sports excellence.',
    full_overview: 'The Keep India Smiling Foundational Scholarship Program aims to provide foundational support to individuals, who are deserving and meritorious but lack resources to pursue dreams.',
    benefits: '₹20,000 per year for Class 11-12; ₹30,000 per year for 3-year Graduation/Diploma; ₹50,000 for BDS/Engineering.',
    application_procedure: 'Upload marksheets, disability certificate if applicable, family income proof, and recent passport photo.',
    official_source_url: 'https://www.colgate.com/en-in/mission-and-values/community-responsibility/scholarship',
    featured: 1,
    criteria: {
      min_education_level: 'All',
      min_marks_percentage: 75.00,
      max_family_income: 500000.00,
      applicable_gender: 'All',
      applicable_category: 'All',
      applicable_state: 'All India',
      requires_disability: 0,
      additional_rules: 'Minimum 75% marks in Class 10 board exam or 60% in Class 12 board exam.'
    },
    faqs: [
      { question: 'Can students with sports achievements apply?', answer: 'Yes, a specialized sub-category exists for state and national sports champions.' }
    ]
  },
  {
    title: 'AICTE Pragati Scholarship Scheme for Girl Students (Technical Degree)',
    slug: 'aicte-pragati-scholarship-girls-2026',
    category_slug: 'engineering-stem',
    provider_name: 'All India Council for Technical Education (AICTE)',
    award_amount: '₹50,000 per annum',
    award_amount_value: 50000,
    deadline: '2026-12-10',
    is_always_open: 0,
    status: 'live',
    scholarship_type: 'Government',
    education_level: 'Graduation',
    state_domicile: 'All India',
    brief_description: 'Empowering 5,000 girl students per year admitted to AICTE approved technical colleges across India.',
    full_overview: 'Pragati is an MHRD Scheme implemented by AICTE aimed at providing assistance for Advancement of Girls pursuing Technical Education. A total of 5,000 scholarships are sanctioned every year.',
    benefits: '₹50,000 per annum for every year of study towards college fees, computer purchase, stationeries, and books.',
    application_procedure: 'Apply through National Scholarship Portal (NSP), submit AICTE student ID, fee receipts, and bank passbook.',
    official_source_url: 'https://www.aicte-india.org/schemes/students-development-schemes/Pragati',
    featured: 1,
    criteria: {
      min_education_level: 'Graduation',
      min_marks_percentage: 60.00,
      max_family_income: 800000.00,
      applicable_gender: 'Female',
      applicable_category: 'All',
      applicable_state: 'All India',
      requires_disability: 0,
      additional_rules: 'Girl child admitted in 1st year or 2nd year (lateral entry) of technical degree course in AICTE approved college. Max two girls per family.'
    },
    faqs: [
      { question: 'Does Pragati scholarship cover diploma courses too?', answer: 'Yes, a separate Pragati Diploma scheme offers ₹50,000 per year for polytechnic diploma students.' }
    ]
  },
  {
    title: 'Kotak Kanya Scholarship 2026',
    slug: 'kotak-kanya-scholarship-2026',
    category_slug: 'girls-women',
    provider_name: 'Kotak Education Foundation',
    award_amount: '₹1,50,000 per year',
    award_amount_value: 150000,
    deadline: '2026-11-10',
    is_always_open: 0,
    status: 'live',
    scholarship_type: 'Corporate/CSR',
    education_level: 'Graduation',
    state_domicile: 'All India',
    brief_description: 'Generous financial grant to meritorious girl students pursuing professional graduation from top-ranked institutions.',
    full_overview: 'Kotak Kanya Scholarship is a flagship CSR initiative under Kotak Mahindra Group to bridge educational inequalities for ambitious young women aspiring for professional degrees in engineering, medicine, law, and architecture.',
    benefits: '₹1,50,000 per year until the completion of professional graduation course.',
    application_procedure: 'Register online, upload Class 12 marksheet, NIRF college admission proof, and family income certificate.',
    official_source_url: 'https://kotakeducation.org/kotak-kanya-scholarship/',
    featured: 0,
    criteria: {
      min_education_level: 'Graduation',
      min_marks_percentage: 75.00,
      max_family_income: 600000.00,
      applicable_gender: 'Female',
      applicable_category: 'All',
      applicable_state: 'All India',
      requires_disability: 0,
      additional_rules: 'Female candidates scoring 75%+ in 12th board and admitted to first-year professional degree in NAAC/NIRF accredited institutes.'
    },
    faqs: [
      { question: 'What courses are covered?', answer: 'Engineering, MBBS, BDS, integrated LLB, Architecture, and Design courses.' }
    ]
  },
  {
    title: 'Dr. Abdul Kalam International Open Research Fellowship',
    slug: 'dr-abdul-kalam-research-fellowship',
    category_slug: 'study-abroad',
    provider_name: 'EduScholar Global Academic Trust',
    award_amount: 'USD $12,000 grant',
    award_amount_value: 950000,
    deadline: null,
    is_always_open: 1,
    status: 'live',
    scholarship_type: 'International',
    education_level: 'Post-Graduation',
    state_domicile: 'All India',
    brief_description: 'Rolling round scholarship open throughout the year for students accepted into accredited international STEM graduate research programs.',
    full_overview: 'Created in honor of Dr. A.P.J. Abdul Kalam, this fellowship provides financial support and travel grants to Indian postgraduate researchers presenting or conducting thesis work at top 200 global universities.',
    benefits: 'One-time stipend of $12,000 plus round-trip international flight subsidy and health insurance coverage.',
    application_procedure: 'Submit research proposal abstract, letter of acceptance from foreign university, GRE/TOEFL scorecards, and two recommendation letters.',
    official_source_url: 'https://eduscholar.org/fellowships/abdul-kalam',
    featured: 0,
    criteria: {
      min_education_level: 'Post-Graduation',
      min_marks_percentage: 75.00,
      max_family_income: null,
      applicable_gender: 'All',
      applicable_category: 'All',
      applicable_state: 'All India',
      requires_disability: 0,
      additional_rules: 'Must hold a confirmed admission letter or joint research invitation from an overseas accredited institution.'
    },
    faqs: [
      { question: 'Is there a fixed deadline?', answer: 'No, applications are reviewed on a rolling basis every quarter.' }
    ]
  }
];

const seedArticles = [
  {
    title: 'Complete Guide: How to Apply for National Scholarship Portal (NSP) 2026',
    slug: 'guide-how-to-apply-nsp-2026',
    category: 'Scholarship Guide',
    author: 'Sunita Mehra, Senior Education Advisor',
    read_time: '7 min read',
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    content: `
The **National Scholarship Portal (NSP)** is the Government of India's flagship single-window digital platform for scholarships. It hosts central schemes, UGC/AICTE schemes, and state government offerings.

### Essential Pre-requisites Before Applying
1. **Aadhaar Number**: Must be linked to your active bank account (Aadhaar seeding is mandatory for DBT transfers).
2. **Current Academic Admission Details**: Course name, year of admission, institute AISHE/DISE code.
3. **Domicile and Income Certificate**: Issued by a competent revenue authority (Tehsildar/SDM).
4. **Caste/Community Certificate**: Required if claiming SC/ST/OBC or Minority quotas.

### Step-by-Step Application Workflow
- **Step 1: Fresh Registration (One-Time Registration - OTR)**
  Visit [scholarships.gov.in](https://scholarships.gov.in) and click on 'New Registration'. Complete mobile verification and generate your OTR number.
- **Step 2: Fill Student Profile & Academic Record**
  Enter previous examination percentage, roll number, and present course fee structure.
- **Step 3: Scheme Selection**
  Based on your profile data, the portal automatically presents eligible schemes (Post-Matric, Merit-cum-Means, Pragati, Ishan Uday, etc.).
- **Step 4: Upload Scanned Documents**
  Keep files under 200 KB in PDF or JPEG format. Ensure clear visibility of signatures and stamps.
- **Step 5: Institute Verification**
  Once submitted, your college Nodal Officer verifies your form on the NSP portal. Follow up with your college scholarship desk to avoid delays!
    `
  },
  {
    title: 'How to Write a Winning Scholarship Statement of Purpose (SOP) & Essay',
    slug: 'how-to-write-winning-scholarship-sop-essay',
    category: 'Application Tips',
    author: 'Dr. Rajesh Verma',
    read_time: '5 min read',
    image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    content: `
A compelling Statement of Purpose (SOP) distinguishes your application from thousands of applicants with similar marks. Review committees look for resilience, clarity of vision, and authentic passion.

### The 4-Part Winning Structure:
1. **The Hook & Personal Motivation**: Start with an impactful moment that ignited your educational ambition.
2. **Academic & Extracurricular Milestones**: Highlight consistent effort, overcoming hardship, and leadership roles.
3. **Financial Need with Dignity**: Frankly explain your family's financial situation without despair; frame the scholarship as an investment in national development.
4. **Future Contribution**: How will completing your degree enable you to give back to your community or industry?

> **Pro Tip**: Always proofread using Grammarly or ask a mentor to review. Keep paragraphs concise and avoid generic cliches.
    `
  },
  {
    title: 'Top 10 Scholarships for Girl Students in India: Eligibility and Benefits',
    slug: 'top-10-scholarships-for-girls-in-india',
    category: 'Scholarship Guide',
    author: 'Kavita Rao, EduScholar Editorial',
    read_time: '6 min read',
    image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    content: `
Bridging the gender gap in higher education is a national priority. Both government bodies and leading corporate CSR initiatives offer dedicated grants for female students.

### High-Impact Programs for Women:
- **AICTE Pragati**: ₹50,000 per year for technical degree and diploma students.
- **L'Oréal India For Young Women In Science**: ₹2.5 Lakh for Class 12 passed science stream students.
- **Kotak Kanya Scholarship**: ₹1.5 Lakh per year for professional college students.
- **Santoor Women’s Scholarship**: ₹24,000 per year for southern and central states.
- **Fair & Lovely / Glow & Lovely Foundation**: Financial grants for vocational and undergraduate education.
    `
  },
  {
    title: 'Education Loans vs. Scholarships: What Should You Choose?',
    slug: 'education-loans-vs-scholarships-guide',
    category: 'Career Advice',
    author: 'Vikram Sengupta, Financial Planner',
    read_time: '4 min read',
    image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    content: `
Navigating college financing can be daunting. Understanding the difference between debt-based education loans and non-repayable scholarships is critical for financial freedom after graduation.

### Key Highlights:
- **Repayment**: Scholarships never have to be repaid. Loans require interest and EMI starting immediately after graduation.
- **Strategy**: Always apply for all eligible merit and means scholarships first. Use collateral-free education loans (like PM Vidyalaxmi) only to bridge remaining gaps.
    `
  }
];

const seedResults = [
  {
    scholarshipTitle: 'Reliance Foundation Undergraduate Scholarship 2025-26',
    batch: '2025-26 Final Selected Candidates',
    announcementDate: '2026-09-15',
    totalAwardees: 5000,
    downloadUrl: '#',
    summary: 'The final merit list of 5,000 awardees across 28 states is officially released. Candidates can search their application number below.'
  },
  {
    scholarshipTitle: 'Tata Trusts Healthcare Scholarship Merit List',
    batch: 'Phase 1 - MBBS & Nursing Scholars',
    announcementDate: '2026-08-30',
    totalAwardees: 850,
    downloadUrl: '#',
    summary: 'List of provisional awardees approved for tuition fee reimbursement for the current academic session.'
  },
  {
    scholarshipTitle: 'AICTE Pragati Scholarship for Girls',
    batch: 'Academic Batch 2025 (Renewals & Fresh)',
    announcementDate: '2026-07-20',
    totalAwardees: 4200,
    downloadUrl: '#',
    summary: 'State-wise merit list of sanctioned grants uploaded on National Scholarship Portal.'
  }
];

const seedVideos = [
  {
    title: 'How to Fill Online Scholarship Applications Step-by-Step Without Mistakes',
    duration: '12:45',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    youtubeId: 'dQw4w9WgXcQ',
    views: '125K views',
    channel: 'EduScholar Masterclass'
  },
  {
    title: 'NSP Portal Document Upload Guide: Resize, Format, and Avoid Rejections',
    duration: '08:20',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    youtubeId: 'dQw4w9WgXcQ',
    views: '84K views',
    channel: 'Scholarship Alerts India'
  },
  {
    title: 'How to Crack Scholarship Personal Interviews: Common Questions Answered',
    duration: '15:10',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    youtubeId: 'dQw4w9WgXcQ',
    views: '210K views',
    channel: 'Career Guidance Hub'
  }
];

const seedQuestions = [
  {
    title: 'Can I apply for both Government NSP scholarship and a Private CSR scholarship in the same year?',
    body: 'I am a 2nd year B.Tech student with 82% marks. My family income is ₹2.2 Lakh. Can I legally receive both NSP and Tata Trust scholarship simultaneously?',
    category: 'Eligibility Rules',
    authorName: 'Rohan Mehra',
    upvotes: 34,
    answers: [
      {
        author: 'EduScholar Counselor',
        is_official: 1,
        text: 'Most government scholarships explicitly stipulate that you cannot receive another government scholarship covering tuition fee. However, many private CSR programs allow supplementary living/book stipends if there is no double-claiming of the exact same fee component. Always review Section 4 of the specific scheme guideline.'
      }
    ]
  },
  {
    title: 'What should I do if my family income certificate has expired?',
    body: 'My revenue department certificate was issued in January 2024. Most portals require a valid certificate for the current financial year. How quickly can I renew?',
    category: 'Documentation',
    authorName: 'Simran Kaur',
    upvotes: 19,
    answers: [
      {
        author: 'Nodal Officer',
        is_official: 1,
        text: 'You can apply immediately through your state e-District or Seva Kendra portal. In most states (like Maharashtra, UP, Karnataka), an income certificate is issued digitally in 7 to 10 working days. In the meantime, apply with the existing certificate along with the renewal acknowledgement slip.'
      }
    ]
  }
];

module.exports = {
  seedCategories,
  seedUsers,
  seedStudentProfiles,
  seedScholarships,
  seedArticles,
  seedResults,
  seedVideos,
  seedQuestions
};
