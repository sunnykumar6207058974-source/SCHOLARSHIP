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
  AlertCircle,
  RefreshCw,
  Globe,
  Building2,
  Landmark,
  Radio,
  ExternalLink,
  History,
  CheckCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('scholarships'); // scholarships, applications, users, crawler
  const [stats, setStats] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [crawlerData, setCrawlerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncingPortals, setSyncingPortals] = useState(false);

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
    scheme_authority_type: 'Central Government',
    education_level: 'Graduation',
    state_domicile: 'All India',
    brief_description: '',
    full_overview: '',
    benefits: '',
    application_procedure: '',
    official_source_url: '',
    featured: 0,
    previous_year_cutoff: '',
    last_year_disbursed_amount: '',
    total_beneficiaries_last_year: '',
    expected_next_cycle: '',
    history_summary: '',
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
      const [statsRes, schRes, appRes, usersRes, crawlerRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getScholarships(),
        api.admin.getApplications(appStatusFilter === 'all' ? '' : appStatusFilter),
        api.admin.getUsers(),
        api.admin.getCrawlerStatus().catch(() => ({ success: false }))
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (schRes.success) setScholarships(schRes.data);
      if (appRes.success) setApplications(appRes.data);
      if (usersRes.success) setUsersList(usersRes.data);
      if (crawlerRes && crawlerRes.success) setCrawlerData(crawlerRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [appStatusFilter]);

  const handleSyncPortals = async () => {
    try {
      setSyncingPortals(true);
      const res = await api.admin.syncPortals();
      if (res.success) {
        setActionSuccess(`✓ Portals Scanned: ${res.data.new_schemes_added} new schemes ingested, ${res.data.existing_synced} deadlines & circulars refreshed!`);
        await loadData();
        setTimeout(() => setActionSuccess(''), 6000);
      }
    } catch (err) {
      setFormError('Failed to sync government portals: ' + (err.message || 'Server error'));
      setTimeout(() => setFormError(''), 5000);
    } finally {
      setSyncingPortals(false);
    }
  };

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
        // Reset form
        setNewScholarship({
          title: '',
          provider_name: '',
          award_amount: '',
          award_amount_value: 50000,
          deadline: '',
          is_always_open: false,
          status: 'live',
          scholarship_type: 'Corporate/CSR',
          scheme_authority_type: 'Central Government',
          education_level: 'Graduation',
          state_domicile: 'All India',
          brief_description: '',
          full_overview: '',
          benefits: '',
          application_procedure: '',
          official_source_url: '',
          featured: 0,
          previous_year_cutoff: '',
          last_year_disbursed_amount: '',
          total_beneficiaries_last_year: '',
          expected_next_cycle: '',
          history_summary: '',
          min_marks_percentage: 60,
          max_family_income: 500000,
          applicable_gender: 'All',
          applicable_category: 'All',
          additional_rules: ''
        });
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
              <ShieldAlert size={16} /> Portal Administration & Live Hub
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-800)' }}>
              All-India Scholarship Control Center
            </h1>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.92rem' }}>
              Sync official government circulars, manage Central & State schemes, track historical cutoffs, and review applications.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={handleSyncPortals}
              disabled={syncingPortals}
              className="btn btn-outline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderColor: '#0284c7',
                color: '#0284c7',
                backgroundColor: '#f0f9ff',
                fontWeight: 700
              }}
            >
              <RefreshCw size={16} className={syncingPortals ? 'spin-icon' : ''} />
              {syncingPortals ? 'Scanning Govt Portals...' : '⚡ Sync Live Portals'}
            </button>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <PlusCircle size={18} /> Add New Scheme
            </button>
          </div>
        </div>

        {actionSuccess && (
          <div style={{ backgroundColor: 'var(--accent-emerald-light)', border: '1px solid var(--accent-emerald-border)', color: '#065f46', padding: '12px 18px', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', marginBottom: '24px', fontWeight: 600 }}>
            {actionSuccess}
          </div>
        )}

        {formError && (
          <div style={{ backgroundColor: 'var(--accent-rose-light)', border: '1px solid #fecdd3', color: 'var(--accent-rose)', padding: '12px 18px', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', marginBottom: '24px', fontWeight: 600 }}>
            ⚠️ {formError}
          </div>
        )}

        {/* Analytics KPIs */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '16px',
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
                <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {kpi.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--slate-200)', marginBottom: '24px', overflowX: 'auto' }}>
          {[
            { id: 'scholarships', label: `Manage Scholarships (${scholarships.length})` },
            { id: 'crawler', label: `🌐 Live Portals & Scraper Engine` },
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
                cursor: 'pointer',
                whiteSpace: 'nowrap'
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
                    <th style={{ padding: '14px 20px' }}>Authority & Scheme</th>
                    <th style={{ padding: '14px 20px' }}>Award Amount</th>
                    <th style={{ padding: '14px 20px' }}>Historical Cutoff</th>
                    <th style={{ padding: '14px 20px' }}>Deadline</th>
                    <th style={{ padding: '14px 20px' }}>Status</th>
                    <th style={{ padding: '14px 20px' }}>Applications</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scholarships.map((s) => {
                    const isCentral = s.scheme_authority_type === 'Central Government';
                    const isState = s.scheme_authority_type === 'State Government';
                    const isCsr = s.scheme_authority_type === 'Corporate / CSR' || s.scholarship_type === 'Corporate/CSR';

                    return (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                        <td style={{ padding: '16px 20px', maxWidth: '340px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <span style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: isState ? '#eef2ff' : isCsr ? '#ecfdf5' : '#fff7ed',
                              color: isState ? '#4338ca' : isCsr ? '#047857' : '#c2410c',
                              border: `1px solid ${isState ? '#c7d2fe' : isCsr ? '#a7f3d0' : '#fed7aa'}`
                            }}>
                              {isState ? '🏛️ State Govt' : isCsr ? '🏢 CSR' : '🇮🇳 Central Govt'}
                            </span>
                            {s.state_domicile && s.state_domicile !== 'All India' && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                                • {s.state_domicile}
                              </span>
                            )}
                          </div>
                          <strong style={{ color: 'var(--primary-800)', display: 'block', fontSize: '0.94rem' }}>
                            {s.title}
                          </strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                            {s.provider_name}
                          </span>
                        </td>

                        <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--accent-orange)', whiteSpace: 'nowrap' }}>
                          {s.award_amount}
                        </td>

                        <td style={{ padding: '16px 20px', fontSize: '0.82rem' }}>
                          {s.previous_year_cutoff ? (
                            <div>
                              <span style={{ fontWeight: 700, color: '#047857', display: 'block' }}>
                                {s.previous_year_cutoff}
                              </span>
                              {s.total_beneficiaries_last_year ? (
                                <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>
                                  {Number(s.total_beneficiaries_last_year).toLocaleString('en-IN')} students
                                </span>
                              ) : null}
                            </div>
                          ) : (
                            <span style={{ color: 'var(--slate-400)', fontStyle: 'italic' }}>First cycle / N/A</span>
                          )}
                        </td>

                        <td style={{ padding: '16px 20px', color: 'var(--slate-600)', fontSize: '0.84rem', whiteSpace: 'nowrap' }}>
                          {s.is_always_open ? 'Always Open' : (s.deadline ? new Date(s.deadline).toLocaleDateString('en-IN') : 'TBA')}
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <span className={`badge ${s.status === 'live' ? 'badge-live' : s.status === 'closed' ? 'badge-closed' : 'badge-upcoming'}`}>
                            {s.status === 'closed' ? 'Closed (History)' : s.status}
                          </span>
                        </td>

                        <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--primary-700)' }}>
                          {s.applications_count || 0}
                        </td>

                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => handleDeleteScholarship(s.id)}
                              style={{ color: 'var(--accent-rose)', cursor: 'pointer', padding: '4px', background: 'none', border: 'none' }}
                              title="Delete scholarship"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Crawler Engine & Official Government Portals */}
        {activeTab === 'crawler' && (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '24px 28px',
              marginBottom: '28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                  <Radio size={16} style={{ color: '#22c55e' }} /> Automated Live Synchronization Active
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: '6px' }}>
                  Official Government & Corporate CSR Portal Ingestion
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '640px' }}>
                  EduScholar’s automated engine monitors state and central portals to fetch latest notifications, application opening dates, and previous year cutoff statistics.
                </p>
                <div style={{ marginTop: '12px', display: 'flex', gap: '20px', fontSize: '0.84rem', color: '#cbd5e1' }}>
                  <span><strong>Schedule:</strong> Daily at Midnight IST</span>
                  <span><strong>Protocol:</strong> Hybrid Scraper + REST Sync</span>
                </div>
              </div>

              <div>
                <button
                  onClick={handleSyncPortals}
                  disabled={syncingPortals}
                  className="btn"
                  style={{
                    backgroundColor: '#0284c7',
                    color: 'white',
                    padding: '12px 22px',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-md)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.92rem',
                    border: 'none',
                    cursor: syncingPortals ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
                  }}
                >
                  <RefreshCw size={18} className={syncingPortals ? 'spin-icon' : ''} />
                  {syncingPortals ? 'Scanning Connected Portals...' : 'Run Manual Scraper Now'}
                </button>
              </div>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-800)', marginBottom: '16px' }}>
              Connected Official Portals & Sources ({crawlerData?.sources?.length || 6})
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '18px'
            }}>
              {(crawlerData?.sources || [
                { name: 'National Scholarship Portal (NSP)', authority: 'Central Government', portalUrl: 'https://scholarships.gov.in', state: 'All India' },
                { name: 'AICTE Student Development Schemes', authority: 'Central Government', portalUrl: 'https://www.aicte-india.org/schemes', state: 'All India' },
                { name: 'Uttar Pradesh Social Welfare Portal', authority: 'State Government', portalUrl: 'https://scholarship.up.gov.in', state: 'Uttar Pradesh' },
                { name: 'Bihar PMS Online Portal', authority: 'State Government', portalUrl: 'https://pmsonline.bih.nic.in', state: 'Bihar' },
                { name: 'Maharashtra MahaDBT Portal', authority: 'State Government', portalUrl: 'https://mahadbt.maharashtra.gov.in', state: 'Maharashtra' },
                { name: 'National CSR Foundation Network', authority: 'Corporate / CSR', portalUrl: 'https://csr.gov.in', state: 'All India' }
              ]).map((portal, idx) => (
                <div key={idx} className="card" style={{ padding: '20px', border: '1.5px solid var(--slate-200)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: portal.authority === 'State Government' ? '#eef2ff' : portal.authority === 'Corporate / CSR' ? '#ecfdf5' : '#fff7ed',
                        color: portal.authority === 'State Government' ? '#4338ca' : portal.authority === 'Corporate / CSR' ? '#047857' : '#c2410c'
                      }}>
                        {portal.authority}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontSize: '0.76rem', fontWeight: 700 }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a', display: 'inline-block' }}></span> Connected
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-800)', marginBottom: '6px' }}>
                      {portal.name}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginBottom: '12px' }}>
                      Jurisdiction: <strong>{portal.state}</strong>
                    </p>
                  </div>

                  <div style={{ paddingTop: '12px', borderTop: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <a
                      href={portal.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.82rem', color: 'var(--primary-700)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      Visit Official Portal <ExternalLink size={14} />
                    </a>
                    <span style={{ fontSize: '0.76rem', color: 'var(--slate-400)' }}>
                      Auto-verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Applications Review */}
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

        {/* Tab 4: Users List */}
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

      {/* Modal: Create / Publish Scholarship */}
      {createModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--white)', width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--slate-200)', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                  Publish New Scholarship Scheme
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                  Includes Central & State government schemes, Corporate CSR, and historical trends.
                </span>
              </div>
              <button onClick={() => setCreateModalOpen(false)} style={{ color: 'var(--slate-500)', cursor: 'pointer', background: 'none', border: 'none' }}>
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
                    placeholder="e.g. Uttar Pradesh Post-Matric Inter Scholarship 2026"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Authority Type *</label>
                  <select
                    className="form-select"
                    value={newScholarship.scheme_authority_type}
                    onChange={(e) => setNewScholarship({ ...newScholarship, scheme_authority_type: e.target.value })}
                  >
                    <option value="Central Government">Central Government (NSP / Ministries)</option>
                    <option value="State Government">State Government (State Portals)</option>
                    <option value="Corporate / CSR">Corporate / CSR Foundation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status *</label>
                  <select
                    className="form-select"
                    value={newScholarship.status}
                    onChange={(e) => setNewScholarship({ ...newScholarship, status: e.target.value })}
                  >
                    <option value="live">Live (Currently Accepting)</option>
                    <option value="upcoming">Upcoming (Opening Soon)</option>
                    <option value="closed">Closed / Historical Archive</option>
                    <option value="always_open">Always Open / Rolling</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Provider Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newScholarship.provider_name}
                    onChange={(e) => setNewScholarship({ ...newScholarship, provider_name: e.target.value })}
                    placeholder="e.g. Social Welfare Department, UP"
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
                    placeholder="e.g. ₹50,000 per annum + Tuition Waiver"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Deadline</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newScholarship.deadline}
                    onChange={(e) => setNewScholarship({ ...newScholarship, deadline: e.target.value })}
                  >
                  </input>
                </div>

                <div className="form-group">
                  <label className="form-label">State Domicile</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newScholarship.state_domicile}
                    onChange={(e) => setNewScholarship({ ...newScholarship, state_domicile: e.target.value })}
                    placeholder="All India, Uttar Pradesh, Bihar, Maharashtra, etc."
                  />
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
                    <option value="Graduation">Graduation (UG)</option>
                    <option value="Post-Graduation">Post-Graduation (PG)</option>
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

                {/* Historical stats section */}
                <div style={{ gridColumn: 'span 2', backgroundColor: '#f1f5f9', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-300)' }}>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--primary-800)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <History size={16} color="#0284c7" /> Historical Trends & Previous Year Archive Data (Optional)
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Previous Year Cutoff Score / %</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newScholarship.previous_year_cutoff}
                        onChange={(e) => setNewScholarship({ ...newScholarship, previous_year_cutoff: e.target.value })}
                        placeholder="e.g. 78.5% in 12th Board / 80th percentile"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Last Year Disbursed Amount</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newScholarship.last_year_disbursed_amount}
                        onChange={(e) => setNewScholarship({ ...newScholarship, last_year_disbursed_amount: e.target.value })}
                        placeholder="e.g. ₹120 Crores"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Total Beneficiaries Last Year</label>
                      <input
                        type="number"
                        className="form-input"
                        value={newScholarship.total_beneficiaries_last_year}
                        onChange={(e) => setNewScholarship({ ...newScholarship, total_beneficiaries_last_year: e.target.value })}
                        placeholder="e.g. 45000"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Expected Next Cycle Opening</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newScholarship.expected_next_cycle}
                        onChange={(e) => setNewScholarship({ ...newScholarship, expected_next_cycle: e.target.value })}
                        placeholder="e.g. July 2027"
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Historical Selection Summary</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newScholarship.history_summary}
                        onChange={(e) => setNewScholarship({ ...newScholarship, history_summary: e.target.value })}
                        placeholder="e.g. Over 45,000 students received Direct Benefit Transfer straight to bank account."
                      />
                    </div>
                  </div>
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
                  <label className="form-label">Official Source Portal URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={newScholarship.official_source_url}
                    onChange={(e) => setNewScholarship({ ...newScholarship, official_source_url: e.target.value })}
                    placeholder="https://scholarships.gov.in/..."
                  />
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setCreateModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Scheme to All-India Hub
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
              <button onClick={() => setSelectedApp(null)} style={{ color: 'var(--slate-500)', cursor: 'pointer', background: 'none', border: 'none' }}>
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
