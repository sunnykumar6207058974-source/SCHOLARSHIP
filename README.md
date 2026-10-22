# EduScholar — Scholarship Discovery & Support Ecosystem
> A complete, responsive, full-stack scholarship discovery portal inspired by [Buddy4Study](https://www.buddy4study.com/), built for college project evaluation.

---

## 🌟 Key Highlights & Features

1. **Homepage & Navigation**:
   - Header with helpline, notifications, and mega dropdowns categorized by degree, scholarship type, and Indian state.
   - Hero banner with instantaneous keyword, education level, and state search.
   - Live Impact Statistics (12,500+ Scholarships, ₹180+ Crores Disbursed, 4.8M Scholars, 98.6% Accuracy).
   - Featured Scholarships grid with deadline countdown badges and "Apply Now" triggers.
   - Browse by Categories (Merit-cum-Means, Girls & Women, Engineering/STEM, Medical, Government, Minority, Study Abroad).
   - 4-Step Application Walkthrough (Profile → Check Eligibility → Apply → Track Disbursement).
   - Corporate & National Partners Section (Tata Trusts, Reliance Foundation, Infosys, HDFC Parivartan, Wipro Cares, AICTE).
   - Knowledge Center & Articles carousel.
   - Comprehensive multi-column Buddy4Study-style footer with state-wise, class-wise, and legal directories.

2. **Scholarship Listings & Search Experience (`/scholarships`)**:
   - Tabs: **Live Scholarships**, **Upcoming Schemes**, **Always Open / Rolling**, and **All Available**.
   - Multi-parameter filters:
     - Education Level (Class 1-10, Class 11-12, Graduation, Post-Graduation, Diploma, PhD)
     - State of Residence (All India, Maharashtra, UP, Karnataka, Gujarat, Bihar, etc.)
     - Scholarship Type (Corporate/CSR, Government, Private/NGO, International)
     - Gender & Reservation Quotas
     - Minimum Academic Score (50%, 60%, 75%, 85%)
     - Maximum Annual Family Income Ceiling (₹2.5L, ₹5L, ₹8L, ₹12L)
   - Dynamic sorting (Deadline: Nearest First, Award Amount: High to Low, Recently Added).
   - Active filter chips with one-click removal and "Clear All Filters".
   - Pagination, search autocomplete modal (shortcut `⌘K` or `Ctrl+K`).

3. **Dynamic Scholarship Details (`/scholarships/:id`)**:
   - Dynamic URL per scholarship with official source verification and sample data labeling.
   - Key highlights: Award amount, application deadline, and eligibility at a glance.
   - Comprehensive sections:
     - About the Program & Mission
     - Detailed Eligibility Criteria (Class, minimum marks %, income threshold, gender, domicile)
     - Scholarship Benefits & Disbursement Coverage
     - Required Documents Checklist (Marksheets, Aadhaar, Income certificate, Fee receipts)
     - Step-by-Step Application Procedure
     - Frequently Asked Questions (Interactive Accordion)
     - Official Sponsor Guidelines external link & safety disclaimer.
   - One-click "Apply Now" modal and "Save to Favorites" bookmarking.

4. **Rule-Based Eligibility Checker (`/eligibility-checker`)**:
   - Deterministic rule engine (**NO AI / AI agents**).
   - Evaluates 7 criteria simultaneously: education level compatibility, academic score cut-off, annual family income limit, gender eligibility, category/caste reservation, domicile state, and disability status.
   - Explains precisely why each scholarship matches (100% Full Matches) or highlights in RED which specific criteria failed (e.g. *"Annual family income ₹5,00,000 exceeds ₹3,00,000 ceiling"* or *"Requires min 75% marks; your score is 70%"*).

5. **Student Authentication & Dashboard (`/dashboard`)**:
   - Secure registration, JWT token generation, bcrypt password hashing.
   - Profile strength progress meter (e.g. 85% Complete) with tips to reach 100%.
   - Tabbed Dashboard Sections:
     - **My Profile**: Edit personal, academic, and economic records.
     - **Applied Scholarships**: Status tracker with 5 visual stages: `Submitted` → `Screening` → `Documents Verified` → `Selection` → `Awarded`.
     - **Saved Scholarships**: Wishlist of bookmarked programs with direct apply.
     - **Document Vault**: Upload/manage certified marksheets, income certificates, Aadhaar cards.
     - **Notifications**: Real-time alerts for application review updates and deadline reminders.

6. **Educational Resources & Community**:
   - **Articles & Guides (`/articles`)**: Guides on NSP portal application, how to write winning SOPs, loans vs scholarships.
   - **Scholarship Results (`/results`)**: Officially announced merit lists and selection notices.
   - **Video Guides (`/videos`)**: Curated application video walkthroughs with embedded modal player.
   - **Community Q&A (`/qna`)**: Forum where students post queries and read verified counselor answers.
   - **Contact Desk (`/contact`)**: Working inquiry form with validation and support helpline details.

7. **Admin Portal (`/admin`)**:
   - Role-based authorization (`admin` role).
   - Live KPI overview (Total Scholarships, Live Schemes, Applications, Registered Students, Awarded count).
   - Manage Scholarships: Create new programs with criteria and FAQs, edit, publish/unpublish toggle, delete.
   - Review Applications: Filter by status, inspect candidate statements and scores, update stage (`Under Review`, `Documents Verified`, `Approved`, `Awarded`, `Rejected`), and submit reviewer feedback with automatic notification dispatch.
   - View Registered Students directory.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM, Vanilla CSS Design System, Lucide React Icons |
| **Backend** | Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, CORS, `dotenv` |
| **Database** | MySQL (with universal fallback to SQLite for zero-config portable demonstration) |
| **Testing** | Postman Collection (`EduScholar_API.postman_collection.json`), cURL, Node test scripts |

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Student Demo** | `student@eduscholar.org` | `Student@123` | Student Dashboard, Eligibility Matcher, Applications, Document Vault |
| **Admin Demo** | `admin@eduscholar.org` | `Admin@123` | Full Admin Portal, Scholarship CRUD, Application Review Desk |

*(Both accounts are pre-seeded and accessible with one-click quick fill buttons on the login page!)*

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)
- MySQL Server (optional; if MySQL is running, configure credentials in `backend/.env`)

### 2. Backend Setup
```bash
cd backend
npm install
node database/initDb.js   # Seeds database with 12+ verified scholarships, categories, and test accounts
node server.js            # Starts backend on http://localhost:5001
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev               # Starts Vite dev server on http://localhost:3000
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 💾 Database Configuration & MySQL Schema

The normalized SQL schema and seed files are located in `backend/database/`:
- `schema.sql`: DDL for tables (`users`, `student_profiles`, `scholarships`, `eligibility_criteria`, `saved_scholarships`, `applications`, `documents`, `notifications`, `articles`, `faqs`, `questions`, `answers`).
- `seed.sql`: Realistic seed data ready for native MySQL import.

To import directly into your local MySQL server:
```bash
mysql -u root -p < backend/database/schema.sql
mysql -u root -p eduscholar_db < backend/database/seed.sql
```
Update `backend/.env`:
```env
PORT=5001
JWT_SECRET=eduscholar_jwt_super_secret_key_2026_scholarship
USE_MYSQL=true
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=eduscholar_db
DB_PORT=3306
```

---

## 📮 Postman API Testing

Import the provided **`EduScholar_API.postman_collection.json`** into Postman:
- Contains pre-configured requests for all endpoints:
  - `POST /api/auth/register` & `POST /api/auth/login` (auto-saves auth token to collection variables)
  - `GET /api/scholarships` (with tabs, filters, keyword search)
  - `GET /api/scholarships/:idOrSlug`
  - `POST /api/eligibility/check` (deterministic rule-matcher)
  - `GET /api/profile` & `PUT /api/profile`
  - `POST /api/applications/apply` & `GET /api/applications/my`
  - `GET /api/admin/stats` & `PUT /api/admin/applications/:id/status`
