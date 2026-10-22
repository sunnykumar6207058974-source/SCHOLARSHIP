import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Award,
  Users,
  FileText,
  PlusCircle,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Eye,
  X,
  Search,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('scholarships'); // scholarships, applications, users
  const [stats, setStats] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter application status
  const [appStatusFilter, setAppStatusFilter] = useState('all');

  // Create Scholarship Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newScholarship, setNewScholarship] = useState({
    title: '',
    provider_name: '',
    award_amount: '',
    award_amount_value: 50000,
    deadline: '',
    is_always_open: false,
    status: 'live',
    scholarship_type: 'Corporate/CSR',
    education_level: 'Graduation',
    state_domicile: 'All India',
    brief_description: '',
    full_overview: '',
    benefits: '',
    application_procedure: '',
    official_source_url: '',
    featured: 0,
    min_marks_percentage: 60,
    max_family_income: 500000,
    applicable_gender: 'All',
    applicable_category: 'All',
    additional_rules: ''
  });
  const [formError, setFormError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Update Application Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('under_review');
  const [reviewerNotes, setReviewerNotes] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, schRes, appRes, usersRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getScholarships(),
        api.admin.getApplications(appStatusFilter === 'all' ? '' : appStatusFilter),
        api.admin.getUsers()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (schRes.success) setScholarships(schRes.data);
      if (appRes.success) setApplications(appRes.data);
      if (usersRes.success) setUsersList(usersRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [appStatusFilter]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!newScholarship.title || !newScholarship.provider_name || !newScholarship.award_amount || !newScholarship.brief_description) {
      setFormError('Please complete all required fields (Title, Provider, Award Amount, Description).');
      return;
    }

    try {
      const res = await api.admin.createScholarship(newScholarship);
      if (res.success) {
        setActionSuccess('New scholarship published successfully!');
        setCreateModalOpen(false);
        loadData();
        setTimeout(() => setActionSuccess(''), 4000);
      }
    } catch (err) {
      setFormError(err.message || 'Failed to create scholarship.');
    }
  };

  const handleDeleteScholarship = async (id) => {
    if (window.confirm('Are you sure you want to delete this scholarship? All attached applications will be removed.')) {
      try {
        await api.admin.deleteScholarship(id);
        setActionSuccess('Scholarship removed.');
        loadData();
        setTimeout(() => setActionSuccess(''), 3000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdateAppStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      const res = await api.admin.updateAppStatus(selectedApp.id, reviewStatus, reviewerNotes);
      if (res.success) {
        setActionSuccess(`Application #${selectedApp.application_number} updated to ${reviewStatus}`);
        setSelectedApp(null);
        setReviewerNotes('');
        loadData();
        setTimeout(() => setActionSuccess(''), 4000);
      }
    } catch (err) {
      console.error('Update status error', err);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '40px 0 80px 0', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#ea580c', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <ShieldAlert size={16} /> Portal Administration
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-800)' }}>
              Scholarship Operations & Review Desk
            </h1>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.92rem' }}>
              Manage active listings, review student applications, verify credentials, and track disbursements.
            </p>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <PlusCircle size={18} /> Add New Scholarship
          </button>
        </div>

        {actionSuccess && (
          <div style={{ backgroundColor: 'var(--accent-emerald-light)', border: '1px solid var(--accent-emerald-border)', color: '#065f46', padding: '12px 18px', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', marginBottom: '24px', fontWeight: 600 }}>
            ✓ {actionSuccess}
          </div>
        )}

        {/* Analytics KPIs */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '18px',
            marginBottom: '32px'
          }}>
            {[
              { label: 'Total Scholarships', val: stats.total_scholarships, color: 'var(--primary-800)' },
              { label: 'Live / Active Schemes', val: stats.live_scholarships, color: 'var(--accent-emerald)' },
              { label: 'Applications Received', val: stats.total_applications, color: 'var(--accent-orange)' },
              { label: 'Awarded Candidates', val: stats.awarded_applications, color: '#059669' },
              { label: 'Registered Students', val: stats.registered_students, color: 'var(--primary-700)' }
            ].map((kpi, idx) => (
              <div key={idx} className="card" style={{ padding: '20px', border: '1.5px solid var(--slate-200)', textAlign: 'center' }}>
                <strong style={{ fontSize: '1.8rem', color: kpi.color, fontWeight: 800, display: 'block' }}>
                  {kpi.val}
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {kpi.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--slate-200)', marginBottom: '24px' }}>
          {[
            { id: 'scholarships', label: `Manage Scholarships (${scholarships.length})` },
            { id: 'applications', label: `Student Applications (${applications.length})` },
            { id: 'users', label: `Registered Users (${usersList.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                fontWeight: 700,
                fontSize: '0.94rem',
                color: activeTab === tab.id ? 'var(--primary-700)' : 'var(--slate-500)',
                borderBottom: activeTab === tab.id ? '3px solid var(--accent-orange)' : '3px solid transparent',
                marginBottom: '-2px',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Scholarships Management */}
        {activeTab === 'scholarships' && (
          <div className="card" style={{ border: '1.5px solid var(--slate-200)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', color: 'var(--slate-600)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '14px 20px' }}>Scholarship & Provider</th>
                    <th style={{ padding: '14px 20px' }}>Award Amount</th>
                    <th style={{ padding: '14px 20px' }}>Deadline</th>
                    <th style={{ padding: '14px 20px' }}>Status</th>
                    <th style={{ padding: '14px 20px' }}>Applications</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scholarships.map((s) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <strong style={{ color: 'var(--primary-800)', display: 'block', fontSize: '0.94rem' }}>
                          {s.title}
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                          {s.provider_name} • {s.category_name || s.scholarship_type}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--accent-orange)' }}>
                        {s.award_amount}
                      </td>

                      <td style={{ padding: '16px 20px', color: 'var(--slate-600)', fontSize: '0.84rem' }}>
                        {s.is_always_open ? 'Always Open' : (s.deadline ? new Date(s.deadline).toLocaleDateString('en-IN') : 'N/A')}
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span className={`badge ${s.status === 'live' ? 'badge-live' : 'badge-upcoming'}`}>
                          {s.status}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--primary-700)' }}>
                        {s.applications_count || 0}
                      </td>

                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => handleDeleteScholarship(s.id)}
                            style={{ color: 'var(--accent-rose)', cursor: 'pointer', padding: '4px' }}
                            title="Delete scholarship"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Applications Review */}
        {activeTab === 'applications' && (
          <div>
            {/* Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <span style={{ fontSize: '0.86rem', color: 'var(--slate-600)', fontWeight: 600 }}>Filter by Status:</span>
              <select
                className="form-select"
                style={{ width: '220px', fontSize: '0.88rem' }}
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="documents_verified">Documents Verified</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="awarded">Awarded</option>
              </select>
            </div>

            <div className="card" style={{ border: '1.5px solid var(--slate-200)', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', color: 'var(--slate-600)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '14px 20px' }}>Application # & Date</th>
                      <th style={{ padding: '14px 20px' }}>Scholarship</th>
                      <th style={{ padding: '14px 20px' }}>Applicant</th>
                      <th style={{ padding: '14px 20px' }}>Institute & Score</th>
                      <th style={{ padding: '14px 20px' }}>Status</th>
                      <th style={{ padding: '14px 20px', textAlign: 'right' }}>Review</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                        <td style={{ padding: '16px 20px' }}>
                          <strong style={{ color: 'var(--primary-800)', display: 'block' }}>
                            {app.application_number}
                          </strong>
                          <span style={{ fontSize: '0.76rem', color: 'var(--slate-500)' }}>
                            {new Date(app.submission_date).toLocaleDateString('en-IN')}
                          </span>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--slate-800)', display: 'block' }}>
                            {app.scholarship_title}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--accent-orange)' }}>
                            {app.award_amount}
                          </span>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <strong style={{ color: 'var(--slate-800)', display: 'block' }}>{app.applicant_name}</strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>{app.applicant_email}</span>
                        </td>

                        <td style={{ padding: '16px 20px', fontSize: '0.84rem' }}>
                          <div>{app.current_institute}</div>
                          <span style={{ color: 'var(--primary-700)', fontWeight: 600 }}>Score: {app.marks_percentage || 'N/A'}%</span>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <span className={`badge ${app.status === 'awarded' || app.status === 'approved' ? 'badge-live' : app.status === 'rejected' ? 'badge-closed' : 'badge-upcoming'}`}>
                            {app.status.replace('_', ' ')}
                          </span>
                        </td>

                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setReviewStatus(app.status);
                              setReviewerNotes(app.reviewer_notes || '');
                            }}
                            className="btn btn-outline btn-sm"
                          >
                            Update Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Users List */}
        {activeTab === 'users' && (
          <div className="card" style={{ border: '1.5px solid var(--slate-200)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', color: 'var(--slate-600)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '14px 20px' }}>User Name & Email</th>
                    <th style={{ padding: '14px 20px' }}>Role</th>
                    <th style={{ padding: '14px 20px' }}>Education & State</th>
                    <th style={{ padding: '14px 20px' }}>Marks %</th>
                    <th style={{ padding: '14px 20px' }}>Applications</th>
                    <th style={{ padding: '14px 20px' }}>Registered At</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <strong style={{ color: 'var(--primary-800)', display: 'block' }}>{u.name}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>{u.email}</span>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span className={`badge ${u.role === 'admin' ? 'badge-upcoming' : 'badge-category'}`}>
                          {u.role}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px', fontSize: '0.84rem', color: 'var(--slate-700)' }}>
                        {u.current_education_level || 'N/A'} • {u.state_domicile || 'All India'}
                      </td>

                      <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--primary-700)' }}>
                        {u.marks_percentage ? `${u.marks_percentage}%` : 'N/A'}
                      </td>

                      <td style={{ padding: '16px 20px', fontWeight: 700 }}>
                        {u.applications_count || 0}
                      </td>

                      <td style={{ padding: '16px 20px', fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                        {new Date(u.created_at).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Modal: Create Scholarship */}
      {createModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--white)', width: '100%', maxWidth: '720px', maxHeight: '85vh', overflowY: 'auto', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--slate-200)', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                Publish New Scholarship Scheme
              </h3>
              <button onClick={() => setCreateModalOpen(false)} style={{ color: 'var(--slate-500)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div style={{ backgroundColor: 'var(--accent-rose-light)', color: 'var(--accent-rose)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.86rem', marginBottom: '16px' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Scholarship Title *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newScholarship.title}
                    onChange={(e) => setNewScholarship({ ...newScholarship, title: e.target.value })}
                    placeholder="e.g. Mahindra All India Talent Scholarship 2026"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Provider Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newScholarship.provider_name}
                    onChange={(e) => setNewScholarship({ ...newScholarship, provider_name: e.target.value })}
                    placeholder="e.g. K.C. Mahindra Education Trust"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Award Amount (Text) *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newScholarship.award_amount}
                    onChange={(e) => setNewScholarship({ ...newScholarship, award_amount: e.target.value })}
                    placeholder="e.g. ₹10,000 per annum"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Deadline</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newScholarship.deadline}
                    onChange={(e) => setNewScholarship({ ...newScholarship, deadline: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Scholarship Type</label>
                  <select
                    className="form-select"
                    value={newScholarship.scholarship_type}
                    onChange={(e) => setNewScholarship({ ...newScholarship, scholarship_type: e.target.value })}
                  >
                    <option value="Corporate/CSR">Corporate/CSR</option>
                    <option value="Government">Government</option>
                    <option value="Private/NGO">Private/NGO</option>
                    <option value="International">International</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Education Level</label>
                  <select
                    className="form-select"
                    value={newScholarship.education_level}
                    onChange={(e) => setNewScholarship({ ...newScholarship, education_level: e.target.value })}
                  >
                    <option value="All">Open for All</option>
                    <option value="Class 1-10">Class 1 to 10</option>
                    <option value="Class 11-12">Class 11 & 12</option>
                    <option value="Graduation">Graduation</option>
                    <option value="Post-Graduation">Post-Graduation</option>
                    <option value="Diploma">Diploma / Polytechnic</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Min Qualifying Marks %</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newScholarship.min_marks_percentage}
                    onChange={(e) => setNewScholarship({ ...newScholarship, min_marks_percentage: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Max Family Annual Income (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newScholarship.max_family_income}
                    onChange={(e) => setNewScholarship({ ...newScholarship, max_family_income: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gender Eligibility</label>
                  <select
                    className="form-select"
                    value={newScholarship.applicable_gender}
                    onChange={(e) => setNewScholarship({ ...newScholarship, applicable_gender: e.target.value })}
                  >
                    <option value="All">All</option>
                    <option value="Female">Female Only</option>
                    <option value="Male">Male</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Brief Description *</label>
                  <textarea
                    required
                    rows={3}
                    className="form-textarea"
                    value={newScholarship.brief_description}
                    onChange={(e) => setNewScholarship({ ...newScholarship, brief_description: e.target.value })}
                    placeholder="Short description for card display..."
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Official Source URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={newScholarship.official_source_url}
                    onChange={(e) => setNewScholarship({ ...newScholarship, official_source_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setCreateModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Scholarship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Application Status */}
      {selectedApp && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--white)', width: '100%', maxWidth: '520px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--slate-200)', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                Review Application #{selectedApp.application_number}
              </h3>
              <button onClick={() => setSelectedApp(null)} style={{ color: 'var(--slate-500)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: 'var(--slate-50)', padding: '12px 14px', borderRadius: 'var(--radius-md)', marginBottom: '18px', border: '1px solid var(--slate-200)', fontSize: '0.86rem' }}>
              <p><strong>Applicant: </strong>{selectedApp.applicant_name} ({selectedApp.applicant_email})</p>
              <p><strong>Scholarship: </strong>{selectedApp.scholarship_title}</p>
              <p style={{ marginTop: '6px', color: 'var(--slate-600)', fontStyle: 'italic' }}>"{selectedApp.statement_of_purpose}"</p>
            </div>

            <form onSubmit={handleUpdateAppStatus}>
              <div className="form-group">
                <label className="form-label">Update Status</label>
                <select
                  className="form-select"
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value)}
                >
                  <option value="under_review">Under Review (Screening)</option>
                  <option value="documents_verified">Documents Verified</option>
                  <option value="interview_scheduled">Interview Scheduled</option>
                  <option value="approved">Approved / Selected</option>
                  <option value="awarded">Scholarship Awarded & Disbursed</option>
                  <option value="rejected">Rejected / Unsuccessful</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Reviewer Note / Feedback (Visible to student)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  placeholder="e.g. Marksheet verified against university database. Approved for disbursement."
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setSelectedApp(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Notify Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
