# 🎓 EduScholar — Scholarship Discovery & Support Ecosystem

> A complete, full-stack, responsive scholarship discovery and application tracking portal inspired by **Buddy4Study**, designed to connect Indian students with central, state, and corporate CSR scholarship schemes.

---

## 📌 Overview

**EduScholar** simplifies the complex scholarship application journey for Indian students:
1. **Discover**: Browse 12,000+ national and corporate scholarships with instant filters.
2. **Match**: Check 100% rule-based eligibility across 7 criteria without guesswork.
3. **Track**: Monitor deadlines with real-time countdowns and track application progress from submission to disbursement.
4. **Verify**: Apply with confidence using direct verified official source links (NSP, AICTE, CSR).

---

## ✨ Core Features & Capabilities

### 1. 🔍 Live Scholarship Discovery (`/scholarships`)
* **Real-Time Tabs**: Switch between **Live Schemes**, **Closing Soon**, **Upcoming Cycles**, and **Always Open (Rolling)**.
* **Instant Keyword Search**: Search by scheme name, provider, or keywords (with `Ctrl+K` / `⌘K` quick search modal).
* **Multi-Parameter Filtering**:
  * **Education Level**: Class 1–10, Class 11–12, Undergraduate (UG), Post-Graduate (PG), Diploma, ITI, PhD.
  * **State of Domicile**: All India, UP, Bihar, Maharashtra, Karnataka, Gujarat, and other states.
  * **Scholarship Type**: Central Govt, State Govt, Corporate / CSR, Private / NGO, International.
  * **Social Category & Gender**: General, OBC, SC, ST, Minorities, Girls & Women, PwD.
  * **Academic & Income Thresholds**: Minimum marks % required, Maximum annual family income ceiling.
* **Sorting & Pagination**: Sort by nearest deadline, award amount (high to low), or recently added.

---

### 2. ⏳ Automated Deadline Tracker & Countdowns
* **Dynamic Status Calculation**: Uses database queries (`deadline >= DATE('now')`) to automatically move expired scholarships to closed/history status.
* **Days-Left Badges**: Real-time countdown on every scholarship card (e.g., *"Closing in 5 Days"*, *"Active"*, or *"Always Open"*).
* **Application Cycle History**: View previous year cut-offs, past disbursement amounts, and expected opening dates for next cycles.

---

### 3. 🎯 Smart Eligibility Checker (`/eligibility-checker`)
* **Deterministic 7-Point Matching Engine**: Evaluates student profiles without unreliable AI hallucination:
  1. Current Education Level
  2. Academic Marks Percentage (%)
  3. Annual Family Income Ceiling
  4. Gender Eligibility
  5. Caste / Reservation Category
  6. State Domicile
  7. Physical Disability (PwD) Status
* **Transparent Results**:
  * **Full Matches (100% Eligible)**: Scholarships you qualify for right now.
  * **Partial Matches**: Highlights specifically which criteria failed (e.g., *"Requires min 75% marks; your score is 70%"* or *"Income ₹4.5L exceeds ₹2.5L limit"*).

---

### 4. 🛡️ Official Source Verification
* **Verified Sponsor URL**: Every scholarship record contains a direct link (`official_source_url`) to the sponsor's official application portal (e.g., National Scholarship Portal `scholarships.gov.in`, AICTE, or Tata/Reliance/HDFC CSR portals).
* **Source Badge**: A verified disclaimer box on every scholarship detail page so students avoid fake schemes and fraudulent links.

---

### 5. 🔔 Deadline & Next Cycle Alerts ("Notify Me")
* Students can click **"Notify Me"** on any upcoming or closed scholarship.
* Stores alerts in `scholarship_alerts` with student email and mobile number to notify them when the scheme opens for the next cycle.

---

### 6. 👤 Student Dashboard & Document Vault (`/dashboard`)
* **Profile Strength Meter**: Dynamic completion progress (0% to 100%) guiding students to complete their profiles.
* **Application Tracker**: Visual 5-stage pipeline for applied scholarships:
  $$\text{Submitted} \longrightarrow \text{Under Review} \longrightarrow \text{Documents Verified} \longrightarrow \text{Interview/Selection} \longrightarrow \text{Awarded}$$
* **Document Vault**: Store and manage digital copies of 10th/12th marksheets, income certificates, caste certificates, and domicile proofs.
* **Saved Scholarships**: One-click bookmarking of schemes for quick application later.

---

### 7. ⚙️ Admin Management Portal (`/admin`)
* **Live Analytics KPI**: Total scholarships, live schemes, total student applications, registered students, and total awarded count.
* **Scholarship Management (CRUD)**: Create new schemes, update deadlines/benefits, toggle published status, or delete records.
* **Application Review Desk**: Inspect student statements of purpose, uploaded documents, update review statuses, and attach reviewer notes with automated in-app notifications.
* **Portal Sync Engine**: Admin trigger to scan official circulars and sync latest government schemes.

---

## ➕ How Scholarships Are Added to the System

Scholarships can be added using **4 distinct methods**:

| Method | How it Works | Best For |
|---|---|---|
| **1. Admin Dashboard Form** | Log in as Admin (`/admin`), click **"Add Scholarship"**, fill the form, and click Submit. | Adding individual schemes with custom criteria and benefits. |
| **2. Government Portal Sync** | Admin clicks **"Sync Portals"** (calls `POST /api/admin/sync-portals`), running the scraper engine across NSP, AICTE, and State feeds. | Auto-updating circulars and government announcements. |
| **3. Database Seed Script** | Run `node database/initDb.js` inside the `backend` folder. | Loading 20+ verified initial scholarships in bulk. |
| **4. Direct Admin API** | Send `POST /api/admin/scholarships` with an authorized Admin Bearer token. | Programmatic or 3rd-party webhook integrations. |

---

## 🔑 Demo Credentials

Pre-configured accounts ready for testing (also accessible via one-click fill buttons on the login page):

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Student Demo** | `student@eduscholar.org` | `Student@123` | Student Dashboard, Eligibility Checker, Document Vault, Apply Flow |
| **Admin Demo** | `admin@eduscholar.org` | `Admin@123` | Full Admin Portal, Scholarship CRUD, Application Review, Portal Sync |

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM, Vanilla CSS Design System, Lucide React Icons |
| **Backend** | Node.js (v18+), Express.js, JWT (`jsonwebtoken`), `bcryptjs`, CORS, `dotenv` |
| **Database** | **SQLite** (Default, zero-setup, portable via `better-sqlite3`) + **MySQL** (Optional production driver) |
| **Testing** | Postman Collection (`EduScholar_API.postman_collection.json`), cURL scripts |

---

## 🚀 Quick Start Guide (Run Locally)

### 1. Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)

> **Note:** By default, the project runs on **SQLite** (`USE_MYSQL=false` in `backend/.env`). No database installation (MySQL) is required to run the project immediately.

---

### 2. Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Initialize & seed the database (creates tables + 20+ scholarships)
node database/initDb.js

# 4. Start the backend server
node server.js
```
✅ **Backend will run on:** `http://localhost:5005`  
*(Health Check: `http://localhost:5005/api/health`)*

---

### 3. Frontend Setup

Open a new terminal window:

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev
```
✅ **Frontend will open on:** `http://localhost:3000`

---

## 📂 Project Directory Structure

```text
SCHOLARSHIP/
├── backend/
│   ├── config/
│   │   └── db.js                 # Unified database connection (SQLite / MySQL)
│   ├── controllers/
│   │   ├── adminController.js       # Admin stats, CRUD, application review, portal sync
│   │   ├── applicationController.js # Student application submission and tracking
│   │   ├── articleController.js     # Guides, Q&A forum, contact desk
│   │   ├── authController.js        # Register, login, JWT token verification
│   │   ├── eligibilityController.js # 7-point deterministic eligibility matching engine
│   │   ├── profileController.js     # Student profile & document vault
│   │   └── scholarshipController.js # Scholarship search, filters, details, notify alerts
│   ├── database/
│   │   ├── eduscholar.sqlite        # SQLite database file (portable)
│   │   ├── initDb.js                # Schema migration & initial database seeder
│   │   ├── schema.sql               # Pure SQL Schema DDL (13 tables)
│   │   ├── seed.sql                 # MySQL seed data
│   │   └── seedData.js              # Comprehensive JS seed data catalog
│   ├── middleware/
│   │   └── auth.js                  # JWT authentication & admin role guard
│   ├── routes/                      # Express route definitions
│   ├── services/
│   │   └── scraperService.js        # Portal crawler & official circular sync engine
│   ├── .env                         # Backend environment configuration (Port: 5005)
│   └── server.js                    # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/              # Navbar, Footer, ScholarshipCard, ApplyModal, etc.
│   │   ├── context/                 # AuthContext (user session & state management)
│   │   ├── pages/                   # Home, Scholarships, EligibilityChecker, Dashboard, Admin, etc.
│   │   ├── services/                # Axios/Fetch API wrapper
│   │   ├── App.jsx                  # Main application routes & routing logic
│   │   └── index.css                # Global design system & theme variables
│   ├── package.json
│   └── vite.config.js               # Vite config with /api proxy to port 5005
│
├── EduScholar_API.postman_collection.json # Ready-to-use Postman test collection
└── README.md                        # Project documentation
```

---

## 🌐 API Endpoints Reference

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new student
* `POST /api/auth/login` — Student / Admin login (returns JWT token)
* `GET /api/auth/me` — Get current logged-in user details

### Scholarships (`/api/scholarships`)
* `GET /api/scholarships` — Search and filter scholarships (Query params: `tab`, `search`, `education_level`, `state`, `category`, `gender`, `min_marks`, `max_income`, `page`, `limit`)
* `GET /api/scholarships/featured` — Top featured scholarships for homepage
* `GET /api/scholarships/:idOrSlug` — Full scholarship details with eligibility criteria and FAQs
* `POST /api/scholarships/:idOrSlug/notify-me` — Subscribe for deadline & next cycle notifications

### Eligibility Engine (`/api/eligibility`)
* `POST /api/eligibility/check` — Match 7 student profile criteria against active scholarships

### Student Applications & Profile
* `GET /api/profile` & `PUT /api/profile` — View/update student profile
* `POST /api/profile/save-scholarship/:id` — Bookmark / unbookmark scholarship
* `POST /api/profile/documents` — Upload documents to vault
* `POST /api/applications/apply` — Submit application for scholarship
* `GET /api/applications/my` — Get all applications submitted by logged-in student

### Admin Portal (`/api/admin`) *(Requires Admin Token)*
* `GET /api/admin/stats` — Overall KPI metrics
* `GET /api/admin/scholarships` — All scholarships with application counts
* `POST /api/admin/scholarships` — Create new scholarship
* `PUT /api/admin/scholarships/:id` — Update scholarship details
* `DELETE /api/admin/scholarships/:id` — Delete scholarship
* `GET /api/admin/applications` — All student applications
* `PUT /api/admin/applications/:id/status` — Update application stage & add reviewer note
* `POST /api/admin/sync-portals` — Run official government & CSR portal sync

---

## 💡 Troubleshooting & FAQ

<details>
<summary><b>Q1: Scholarships are not appearing on the page. What should I check?</b></summary>

1. Verify the backend is running on port 5005 (`curl http://localhost:5005/api/health`).
2. Make sure the database was seeded: `cd backend && node database/initDb.js`.
3. Check that the frontend dev server is running on port 3000 (`cd frontend && npm run dev`).
</details>

<details>
<summary><b>Q2: Can I use MySQL instead of SQLite?</b></summary>

Yes! Set `USE_MYSQL=true` in `backend/.env` and configure your MySQL credentials (`DB_USER`, `DB_PASSWORD`, `DB_NAME`). Then import `backend/database/schema.sql` into MySQL.
</details>

---

## 📄 License & Evaluation Note

Developed for academic presentation and college project evaluation. Designed to showcase production-grade full-stack architecture, clean code practices, deterministic rule-based algorithms, and intuitive UX.
