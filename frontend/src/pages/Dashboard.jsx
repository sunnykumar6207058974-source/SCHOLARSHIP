import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  User,
  Award,
  Bookmark,
  Bell,
  FileText,
  ShieldCheck,
  CheckCircle,
  Clock,
  ExternalLink,
  Edit,
  Save,
  Upload,
  AlertCircle,
  Trash2,
  Calendar,
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Dashboard() {
  const { user, profile, refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = searchParams.get('tab') || 'profile';
  const setActiveTab = (tab) => setSearchParams({ tab });

  // State
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [documents, setDocuments] = useState([]);

  // Profile Edit State
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    mobile: '',
    dob: '',
    gender: 'Male',
    category: 'General',
    state_domicile: 'Maharashtra',
    district: '',
    current_education_level: 'Graduation',
    current_course: '',
    current_year: '',
    marks_percentage: '',
    family_annual_income: '',
    is_physically_challenged: 0,
    bio: ''
  });
  const [profileSaveMessage, setProfileSaveMessage] = useState('');

  // Document Upload State
  const [docType, setDocType] = useState('10th Marksheet');
  const [docName, setDocName] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profileRes, appRes, savedRes, notifRes] = await Promise.all([
        api.profile.get(),
        api.applications.getMy(),
        api.profile.getSaved(),
        api.profile.getNotifications()
      ]);

      if (profileRes.success) {
        setDashboardData(profileRes.data);
        setDocuments(profileRes.data.documents || []);

        const u = profileRes.data.user;
        const p = profileRes.data.profile || {};
        setProfileForm({
          name: u.name || '',
          mobile: u.mobile || '',
          dob: p.dob ? p.dob.substring(0, 10) : '',
          gender: p.gender || 'Male',
          category: p.category || 'General',
          state_domicile: p.state_domicile || 'Maharashtra',
          district: p.district || '',
          current_education_level: p.current_education_level || 'Graduation',
          current_course: p.current_course || '',
          current_year: p.current_year || '',
          marks_percentage: p.marks_percentage !== undefined ? p.marks_percentage : '',
          family_annual_income: p.family_annual_income !== undefined ? p.family_annual_income : '',
          is_physically_challenged: p.is_physically_challenged || 0,
          bio: p.bio || ''
        });
      }

      if (appRes.success) setApplications(appRes.data);
      if (savedRes.success) setSavedScholarships(savedRes.data);
      if (notifRes.success) setNotifications(notifRes.data);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setProfileSaveMessage('');
      const res = await api.profile.update(profileForm);
      if (res.success) {
        setProfileSaveMessage('Profile saved successfully!');
        setEditingProfile(false);
        refreshUser();
        fetchDashboardData();
        setTimeout(() => setProfileSaveMessage(''), 4000);
      }
    } catch (err) {
      console.error('Save error:', err);
      setProfileSaveMessage('Failed to update profile. ' + err.message);
    }
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    if (!docName.trim()) return;

    try {
      const res = await api.profile.uploadDoc({
        document_type: docType,
        file_name: docName.trim(),
        file_url: `/uploads/sample_${encodeURIComponent(docName.trim())}.pdf`
      });
      if (res.success) {
        setUploadMessage('Document added to your vault!');
        setDocName('');
        fetchDashboardData();
        setTimeout(() => setUploadMessage(''), 3000);
      }
    } catch (err) {
      console.error('Doc upload error', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.profile.markNotifRead('all');
      fetchDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnsave = async (schId) => {
    try {
      await api.profile.toggleSave(schId);
      setSavedScholarships((prev) => prev.filter((s) => s.id !== schId));
    } catch (e) {
      console.error(e);
    }
  };

  // Profile completion calculation
  const calculateCompletion = () => {
    let score = 30; // base account
    if (profileForm.mobile) score += 10;
    if (profileForm.dob) score += 10;
    if (profileForm.current_course) score += 15;
    if (profileForm.marks_percentage) score += 15;
    if (profileForm.family_annual_income) score += 10;
    if (documents.length > 0) score += 10;
    return Math.min(100, score);
  };
  const completionPercentage = calculateCompletion();

  // Application stage badge
  const renderApplicationTimeline = (status) => {
    const stages = [
      { key: 'submitted', label: 'Submitted' },
      { key: 'under_review', label: 'Screening' },
      { key: 'documents_verified', label: 'Doc Verified' },
      { key: 'approved', label: 'Selected' },
      { key: 'awarded', label: 'Awarded' }
    ];

    const statusOrder = {
      submitted: 1,
      under_review: 2,
      documents_verified: 3,
      interview_scheduled: 3,
      approved: 4,
      awarded: 5,
      rejected: 0
    };

    const currentRank = statusOrder[status] || 1;

    if (status === 'rejected') {
      return (
        <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}>
          Application Closed / Unsuccessful
        </span>
      );
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', marginTop: '10px' }}>
        {stages.map((st, i) => {
          const isDone = currentRank >= i + 1;
          const isCurrent = currentRank === i + 1;
          return (
            <React.Fragment key={st.key}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.74rem',
                fontWeight: 600,
                backgroundColor: isDone ? 'var(--accent-emerald-light)' : 'var(--slate-100)',
                color: isDone ? '#065f46' : 'var(--slate-500)',
                border: isCurrent ? '1.5px solid var(--accent-emerald)' : '1px solid transparent'
              }}>
                {isDone && <CheckCircle size={11} color="var(--accent-emerald)" />}
                {st.label}
              </div>
              {i < stages.length - 1 && (
                <span style={{ color: 'var(--slate-300)', fontSize: '0.7rem' }}>→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '40px 0 80px 0', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Welcome Header */}
        <div style={{
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          border: '1.5px solid var(--slate-200)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '30px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: '24px',
          alignItems: 'center'
        }} className="dashboard-header-grid">
          
          {/* Avatar */}
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-700)',
            color: 'var(--white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: 800,
            boxShadow: '0 4px 12px rgba(15, 44, 89, 0.25)'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>

          {/* User Bio */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                {user?.name}
              </h1>
              <span className="badge" style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', border: '1px solid var(--primary-100)' }}>
                Student Scholar
              </span>
            </div>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.88rem', marginTop: '2px' }}>
              {user?.email} • {profileForm.current_course || 'Undergraduate Student'} • {profileForm.state_domicile}
            </p>

            {/* Profile Strength Progress Bar */}
            <div style={{ maxWidth: '380px', marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-600)', marginBottom: '4px' }}>
                <span>Profile Strength</span>
                <span style={{ color: completionPercentage === 100 ? 'var(--accent-emerald)' : 'var(--accent-orange)' }}>
                  {completionPercentage}% Complete
                </span>
              </div>
              <div style={{ width: '100%', height: '7px', backgroundColor: 'var(--slate-200)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${completionPercentage}%`,
                  height: '100%',
                  background: completionPercentage === 100 ? 'var(--accent-emerald)' : 'linear-gradient(90deg, #f97316, #ea580c)',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          </div>

          {/* Quick Match Action */}
          <div>
            <Link to="/eligibility-checker" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} /> Matched Scholarships
            </Link>
          </div>
        </div>

        {/* Navigation Tabs + Main Panel */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px', alignItems: 'start' }} className="dashboard-content-layout">
          
          {/* Dashboard Left Menu */}
          <div className="card" style={{ padding: '12px', border: '1.5px solid var(--slate-200)' }}>
            {[
              { id: 'profile', label: 'My Student Profile', icon: <User size={18} /> },
              { id: 'applications', label: 'My Applications', icon: <Award size={18} />, badge: applications.length },
              { id: 'saved', label: 'Saved Scholarships', icon: <Bookmark size={18} />, badge: savedScholarships.length },
              { id: 'documents', label: 'Document Vault', icon: <FileText size={18} />, badge: documents.length },
              { id: 'notifications', label: 'Notifications', icon: <Bell size={18} />, badge: notifications.filter((n) => !n.is_read).length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  backgroundColor: currentTab === tab.id ? 'var(--primary-50)' : 'transparent',
                  color: currentTab === tab.id ? 'var(--primary-800)' : 'var(--slate-600)',
                  border: currentTab === tab.id ? '1px solid var(--primary-100)' : '1px solid transparent',
                  marginBottom: '4px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span style={{
                    backgroundColor: currentTab === tab.id ? 'var(--primary-700)' : 'var(--slate-200)',
                    color: currentTab === tab.id ? 'var(--white)' : 'var(--slate-700)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    borderRadius: '10px',
                    padding: '1px 7px'
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content Panel */}
          <div>
            
            {/* 1. Profile Tab */}
            {currentTab === 'profile' && (
              <div className="card" style={{ padding: '30px', border: '1.5px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', borderBottom: '1.5px solid var(--slate-100)', paddingBottom: '14px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                      Personal & Academic Profile
                    </h2>
                    <p style={{ fontSize: '0.86rem', color: 'var(--slate-500)' }}>
                      This verified data is used to automatically match eligibility and auto-fill your applications.
                    </p>
                  </div>

                  {!editingProfile ? (
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="btn btn-outline btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Edit size={14} /> Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingProfile(false)}
                      className="btn btn-ghost btn-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {profileSaveMessage && (
                  <div style={{
                    backgroundColor: profileSaveMessage.includes('success') ? 'var(--accent-emerald-light)' : 'var(--accent-rose-light)',
                    color: profileSaveMessage.includes('success') ? '#065f46' : 'var(--accent-rose)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.88rem',
                    marginBottom: '20px',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    {profileSaveMessage}
                  </div>
                )}

                <form onSubmit={handleProfileSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                    
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        disabled={!editingProfile}
                        className="form-input"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Mobile Number</label>
                      <input
                        type="text"
                        disabled={!editingProfile}
                        className="form-input"
                        placeholder="10-digit mobile"
                        value={profileForm.mobile}
                        onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        disabled={!editingProfile}
                        className="form-input"
                        value={profileForm.dob}
                        onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select
                        disabled={!editingProfile}
                        className="form-select"
                        value={profileForm.gender}
                        onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Social Reservation Category</label>
                      <select
                        disabled={!editingProfile}
                        className="form-select"
                        value={profileForm.category}
                        onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })}
                      >
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="Minority">Minority</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">State of Domicile</label>
                      <input
                        type="text"
                        disabled={!editingProfile}
                        className="form-input"
                        value={profileForm.state_domicile}
                        onChange={(e) => setProfileForm({ ...profileForm, state_domicile: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Current Education Level</label>
                      <select
                        disabled={!editingProfile}
                        className="form-select"
                        value={profileForm.current_education_level}
                        onChange={(e) => setProfileForm({ ...profileForm, current_education_level: e.target.value })}
                      >
                        <option value="Class 1-10">Class 1 to 10</option>
                        <option value="Class 11-12">Class 11 & 12</option>
                        <option value="Graduation">Undergraduate / College</option>
                        <option value="Post-Graduation">Post-Graduation / Masters</option>
                        <option value="Diploma">Diploma / Polytechnic</option>
                        <option value="PhD">PhD</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Current Course / Branch</label>
                      <input
                        type="text"
                        disabled={!editingProfile}
                        className="form-input"
                        placeholder="e.g. B.Tech Computer Science, MBBS"
                        value={profileForm.current_course}
                        onChange={(e) => setProfileForm({ ...profileForm, current_course: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Marks Percentage (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        disabled={!editingProfile}
                        className="form-input"
                        value={profileForm.marks_percentage}
                        onChange={(e) => setProfileForm({ ...profileForm, marks_percentage: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Annual Family Income (₹)</label>
                      <input
                        type="number"
                        min="0"
                        disabled={!editingProfile}
                        className="form-input"
                        value={profileForm.family_annual_income}
                        onChange={(e) => setProfileForm({ ...profileForm, family_annual_income: e.target.value })}
                      />
                    </div>

                  </div>

                  {editingProfile && (
                    <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                      <button type="submit" className="btn btn-primary">
                        <Save size={16} /> Save Changes
                      </button>
                      <button type="button" onClick={() => setEditingProfile(false)} className="btn btn-outline">
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* 2. Applications Tracker Tab */}
            {currentTab === 'applications' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                      Application Status Tracking
                    </h2>
                    <p style={{ fontSize: '0.86rem', color: 'var(--slate-500)' }}>
                      Monitor verification stages, review feedback, and interview schedules.
                    </p>
                  </div>
                  <Link to="/scholarships" className="btn btn-primary btn-sm">
                    Apply for More
                  </Link>
                </div>

                {applications.length === 0 ? (
                  <div className="card" style={{ padding: '50px 20px', textAlign: 'center' }}>
                    <Award size={40} color="var(--slate-400)" style={{ margin: '0 auto 12px auto' }} />
                    <h3 style={{ color: 'var(--slate-700)', marginBottom: '6px' }}>No Applications Yet</h3>
                    <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', marginBottom: '20px' }}>
                      You haven't submitted any scholarship applications yet. Browse live scholarships to get started.
                    </p>
                    <Link to="/scholarships?tab=live" className="btn btn-primary">
                      Explore Live Scholarships
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {applications.map((app) => (
                      <div key={app.id} className="card" style={{ padding: '24px', border: '1.5px solid var(--slate-200)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--slate-100)', paddingBottom: '14px', marginBottom: '14px' }}>
                          <div>
                            <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                              Application #{app.application_number} • Submitted on {new Date(app.submission_date).toLocaleDateString('en-IN')}
                            </span>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-800)', marginTop: '2px' }}>
                              {app.scholarship_title}
                            </h3>
                            <span style={{ fontSize: '0.84rem', color: 'var(--slate-600)' }}>
                              Institute: <strong>{app.current_institute}</strong>
                            </span>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 600 }}>Grant Value</span>
                            <strong style={{ fontSize: '1.05rem', color: 'var(--accent-orange)', display: 'block' }}>
                              {app.award_amount}
                            </strong>
                          </div>
                        </div>

                        {/* Progress Timeline */}
                        <div style={{ marginBottom: '16px' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', fontWeight: 600, textTransform: 'uppercase' }}>
                            Verification Stage:
                          </span>
                          {renderApplicationTimeline(app.status)}
                        </div>

                        {/* Reviewer Note */}
                        {app.reviewer_notes && (
                          <div style={{ backgroundColor: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '12px 14px', fontSize: '0.86rem', color: 'var(--slate-700)' }}>
                            <strong style={{ color: 'var(--primary-800)' }}>Reviewer Note: </strong>
                            {app.reviewer_notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Saved Scholarships Tab */}
            {currentTab === 'saved' && (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                    Saved Scholarships ({savedScholarships.length})
                  </h2>
                  <p style={{ fontSize: '0.86rem', color: 'var(--slate-500)' }}>
                    Programs you have bookmarked to review or apply before closing deadlines.
                  </p>
                </div>

                {savedScholarships.length === 0 ? (
                  <div className="card" style={{ padding: '50px 20px', textAlign: 'center' }}>
                    <Bookmark size={40} color="var(--slate-400)" style={{ margin: '0 auto 12px auto' }} />
                    <h3 style={{ color: 'var(--slate-700)', marginBottom: '6px' }}>No Saved Scholarships</h3>
                    <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', marginBottom: '20px' }}>
                      Click the heart icon on any scholarship card to save it to your wishlist.
                    </p>
                    <Link to="/scholarships" className="btn btn-outline">
                      Explore Scholarships
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {savedScholarships.map((sch) => (
                      <div key={sch.id} className="card" style={{ padding: '20px', border: '1.5px solid var(--slate-200)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                            {sch.provider_name}
                          </span>
                          <button
                            onClick={() => handleUnsave(sch.id)}
                            style={{ color: 'var(--accent-rose)', cursor: 'pointer' }}
                            title="Remove from saved"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <Link to={`/scholarships/${sch.slug || sch.id}`}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '8px', lineHeight: 1.35 }}>
                            {sch.title}
                          </h4>
                        </Link>

                        <div style={{ backgroundColor: '#fff7ed', padding: '6px 10px', borderRadius: 'var(--radius-sm)', marginBottom: '12px', border: '1px solid #fed7aa' }}>
                          <strong style={{ fontSize: '0.92rem', color: '#c2410c' }}>{sch.award_amount}</strong>
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                          <Link to={`/scholarships/${sch.slug || sch.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                            Details
                          </Link>
                          <Link to={`/scholarships/${sch.slug || sch.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                            Apply
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. Document Vault Tab */}
            {currentTab === 'documents' && (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                    Secure Student Document Vault
                  </h2>
                  <p style={{ fontSize: '0.86rem', color: 'var(--slate-500)' }}>
                    Store certified copies of your marksheets, income certificate, and Aadhaar card once.
                  </p>
                </div>

                {/* Upload Form */}
                <div className="card" style={{ padding: '24px', marginBottom: '24px', border: '1.5px solid var(--slate-200)' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '14px' }}>
                    Add Document to Vault
                  </h3>

                  {uploadMessage && (
                    <div style={{ backgroundColor: 'var(--accent-emerald-light)', color: '#065f46', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', marginBottom: '14px' }}>
                      {uploadMessage}
                    </div>
                  )}

                  <form onSubmit={handleAddDocument} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) 140px', gap: '12px', alignItems: 'end' }} className="doc-form-grid">
                    <div>
                      <label className="form-label">Document Type</label>
                      <select
                        className="form-select"
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                      >
                        <option value="Class 10 Marksheet">Class 10 Marksheet</option>
                        <option value="Class 12 Marksheet">Class 12 Marksheet</option>
                        <option value="Aadhaar Card">Aadhaar Card</option>
                        <option value="Family Income Certificate">Family Income Certificate</option>
                        <option value="College Admission Fee Receipt">College Fee Receipt</option>
                        <option value="Caste / Community Certificate">Caste / Community Certificate</option>
                        <option value="Bank Passbook / Cheque">Bank Passbook / Cheque</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">File Description / Name</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Class12_Board_Marksheet.pdf"
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ padding: '10px' }}>
                      <Upload size={16} /> Save Doc
                    </button>
                  </form>
                </div>

                {/* Document List */}
                <div className="card" style={{ padding: '24px', border: '1.5px solid var(--slate-200)' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '16px' }}>
                    Uploaded Documents ({documents.length})
                  </h3>

                  {documents.length === 0 ? (
                    <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>No documents stored yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            backgroundColor: 'var(--slate-50)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--slate-200)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FileText size={20} />
                            </div>
                            <div>
                              <strong style={{ fontSize: '0.92rem', color: 'var(--slate-800)', display: 'block' }}>
                                {doc.document_type}
                              </strong>
                              <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                                {doc.file_name} • Uploaded {new Date(doc.uploaded_at).toLocaleDateString('en-IN')}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {doc.is_verified ? (
                              <span className="badge badge-live">
                                ✓ Verified
                              </span>
                            ) : (
                              <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                                Verification Pending
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. Notifications Tab */}
            {currentTab === 'notifications' && (
              <div className="card" style={{ padding: '28px', border: '1.5px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--slate-100)', paddingBottom: '12px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                      Notifications & Alerts
                    </h2>
                    <p style={{ fontSize: '0.86rem', color: 'var(--slate-500)' }}>
                      Application status changes, approaching deadlines, and portal announcements.
                    </p>
                  </div>

                  {notifications.some((n) => !n.is_read) && (
                    <button
                      onClick={handleMarkAllRead}
                      className="btn btn-outline btn-sm"
                    >
                      Mark All as Read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', textAlign: 'center', padding: '30px' }}>
                    No notifications at this time.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        style={{
                          padding: '14px 18px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: notif.is_read ? 'var(--white)' : 'var(--primary-50)',
                          border: notif.is_read ? '1px solid var(--slate-200)' : '1.5px solid var(--primary-100)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px'
                        }}
                      >
                        <Bell size={18} color={notif.is_read ? 'var(--slate-400)' : 'var(--primary-600)'} style={{ marginTop: '2px', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <strong style={{ fontSize: '0.92rem', color: 'var(--slate-800)', display: 'block', marginBottom: '2px' }}>
                            {notif.title}
                          </strong>
                          <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                            {notif.message}
                          </p>
                          <span style={{ fontSize: '0.74rem', color: 'var(--slate-400)', marginTop: '4px', display: 'block' }}>
                            {new Date(notif.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 850px) {
          .dashboard-header-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .dashboard-content-layout {
            grid-template-columns: 1fr !important;
          }
          .doc-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
