import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ArrowRight,
  RotateCcw,
  Sliders,
  Check,
  ChevronRight,
  Heart
} from 'lucide-react';
import ApplyModal from '../components/ApplyModal';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function EligibilityChecker() {
  const { user, profile, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    current_education_level: 'Graduation',
    current_course: 'B.Tech / Undergraduate',
    marks_percentage: 80,
    family_annual_income: 250000,
    gender: 'Female',
    category: 'General',
    state_domicile: 'Maharashtra',
    is_physically_challenged: 0
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('full'); // 'full' or 'partial'

  // Application Modal state
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  // Pre-fill from profile if logged in
  useEffect(() => {
    if (profile) {
      setFormData({
        current_education_level: profile.current_education_level || 'Graduation',
        current_course: profile.current_course || 'B.Tech / Undergraduate',
        marks_percentage: profile.marks_percentage ? parseFloat(profile.marks_percentage) : 80,
        family_annual_income: profile.family_annual_income ? parseFloat(profile.family_annual_income) : 250000,
        gender: profile.gender || 'Female',
        category: profile.category || 'General',
        state_domicile: profile.state_domicile || 'Maharashtra',
        is_physically_challenged: profile.is_physically_challenged ? 1 : 0
      });
    }
  }, [profile]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEvaluate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await api.eligibility.check(formData);
      if (res.success) {
        setResults(res);
        if (res.full_matches.length > 0) {
          setActiveTab('full');
        } else {
          setActiveTab('partial');
        }
      }
    } catch (err) {
      console.error('Error evaluating eligibility:', err);
    } finally {
      setLoading(false);
    }
  };

  // Run initial evaluation once on mount
  useEffect(() => {
    handleEvaluate();
  }, []);

  const handleOpenApply = (sch) => {
    setSelectedScholarship(sch);
    setApplyModalOpen(true);
  };

  const states = [
    'All India', 'Maharashtra', 'Uttar Pradesh', 'Karnataka',
    'Gujarat', 'Bihar', 'West Bengal', 'Tamil Nadu', 'Rajasthan',
    'Madhya Pradesh', 'Andhra Pradesh', 'Telangana', 'Delhi', 'Jammu & Kashmir'
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '40px 0 80px 0', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Title Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fef3c7', color: '#9a3412', padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '12px' }}>
            <Sparkles size={15} color="#ea580c" /> Rule-Based Scholarship Evaluator
          </div>
          <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--primary-800)', letterSpacing: '-0.02em' }}>
            Instant Scholarship Eligibility Matcher
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1rem', marginTop: '8px' }}>
            Enter your academic standing, family income, and demographic data. Our deterministic algorithm tests every active scholarship guideline and explains why you match!
          </p>
        </div>

        {/* Layout: Input Form + Results Dashboard */}
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '32px', alignItems: 'start' }} className="eligibility-layout">
          
          {/* Form Card */}
          <div className="card" style={{ padding: '28px', border: '1.5px solid var(--slate-200)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--slate-100)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                Your Student Profile
              </h3>
              {profile && (
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                  ✓ Loaded from account
                </span>
              )}
            </div>

            <form onSubmit={handleEvaluate}>
              {/* Education Level */}
              <div className="form-group">
                <label className="form-label">Current Education Level</label>
                <select
                  className="form-select"
                  value={formData.current_education_level}
                  onChange={(e) => handleInputChange('current_education_level', e.target.value)}
                >
                  <option value="Class 1-10">Class 1 to 10 (School)</option>
                  <option value="Class 11-12">Class 11 & 12 (Junior College)</option>
                  <option value="Graduation">Undergraduate / College Degree</option>
                  <option value="Post-Graduation">Post-Graduation / Masters</option>
                  <option value="Diploma">Polytechnic / Diploma</option>
                  <option value="PhD">PhD / Doctoral</option>
                </select>
              </div>

              {/* Marks % */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Qualifying Exam Score</label>
                  <strong style={{ color: 'var(--primary-700)', fontSize: '0.92rem' }}>{formData.marks_percentage}%</strong>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="1"
                  value={formData.marks_percentage}
                  onChange={(e) => handleInputChange('marks_percentage', parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary-600)' }}
                />
              </div>

              {/* Annual Income */}
              <div className="form-group">
                <label className="form-label">Family Annual Income (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  step="10000"
                  value={formData.family_annual_income}
                  onChange={(e) => handleInputChange('family_annual_income', parseFloat(e.target.value))}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px', display: 'block' }}>
                  Approx: ₹{(formData.family_annual_income / 100000).toFixed(2)} Lakhs per annum
                </span>
              </div>

              {/* Gender */}
              <div className="form-group">
                <label className="form-label">Gender</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Female', 'Male', 'Other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleInputChange('gender', g)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        border: formData.gender === g ? '1.5px solid var(--primary-600)' : '1px solid var(--slate-300)',
                        backgroundColor: formData.gender === g ? 'var(--primary-50)' : 'var(--white)',
                        color: formData.gender === g ? 'var(--primary-700)' : 'var(--slate-600)'
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">Social Reservation Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="General">General (Unreserved)</option>
                  <option value="OBC">OBC (Other Backward Class)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="Minority">Minority (Muslim, Christian, Sikh, Jain, Buddhist)</option>
                </select>
              </div>

              {/* State */}
              <div className="form-group">
                <label className="form-label">State of Domicile</label>
                <select
                  className="form-select"
                  value={formData.state_domicile}
                  onChange={(e) => handleInputChange('state_domicile', e.target.value)}
                >
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Disability Check */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--slate-700)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_physically_challenged === 1}
                    onChange={(e) => handleInputChange('is_physically_challenged', e.target.checked ? 1 : 0)}
                    style={{ accentColor: 'var(--primary-600)', width: '16px', height: '16px' }}
                  />
                  <span>Specially-Abled / Person with Disability (PwD)</span>
                </label>
              </div>

              {/* Evaluate Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.96rem' }}
              >
                {loading ? 'Evaluating Rules...' : (
                  <>
                    <Sparkles size={16} /> Re-Calculate Matches
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Side */}
          <div>
            {results && (
              <div>
                {/* Stats Summary Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--white)',
                  padding: '16px 22px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1.5px solid var(--slate-200)',
                  marginBottom: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <span style={{ fontSize: '0.84rem', color: 'var(--slate-500)' }}>
                      Evaluated Across <strong>{results.summary.total_evaluated}</strong> active schemes
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-800)', marginTop: '2px' }}>
                      Found <span style={{ color: 'var(--accent-emerald)' }}>{results.summary.full_match_count} Full Matches</span> & {results.summary.partial_match_count} Near Matches
                    </h3>
                  </div>

                  {/* Tabs */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setActiveTab('full')}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        backgroundColor: activeTab === 'full' ? 'var(--accent-emerald-light)' : 'var(--slate-100)',
                        color: activeTab === 'full' ? '#065f46' : 'var(--slate-600)',
                        border: activeTab === 'full' ? '1.5px solid var(--accent-emerald-border)' : '1px solid var(--slate-200)'
                      }}
                    >
                      100% Eligible ({results.summary.full_match_count})
                    </button>

                    <button
                      onClick={() => setActiveTab('partial')}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        backgroundColor: activeTab === 'partial' ? '#fff7ed' : 'var(--slate-100)',
                        color: activeTab === 'partial' ? '#9a3412' : 'var(--slate-600)',
                        border: activeTab === 'partial' ? '1.5px solid #fed7aa' : '1px solid var(--slate-200)'
                      }}
                    >
                      Near Matches ({results.summary.partial_match_count})
                    </button>
                  </div>
                </div>

                {/* 100% Full Matches List */}
                {activeTab === 'full' && (
                  <div>
                    {results.full_matches.length === 0 ? (
                      <div className="card" style={{ padding: '40px 20px', textAlign: 'center' }}>
                        <h4 style={{ color: 'var(--slate-700)', marginBottom: '8px' }}>No 100% Exact Matches Found</h4>
                        <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', marginBottom: '16px' }}>
                          Check the <strong>Near Matches</strong> tab to view scholarships where you satisfy almost all criteria, or adjust your score or income slider.
                        </p>
                        <button onClick={() => setActiveTab('partial')} className="btn btn-outline btn-sm">
                          View Near Matches ({results.summary.partial_match_count})
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        {results.full_matches.map((sch) => (
                          <div
                            key={sch.id}
                            className="card"
                            style={{
                              padding: '24px',
                              border: '1.5px solid var(--accent-emerald-border)',
                              boxShadow: 'var(--shadow-card)'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--slate-500)', fontWeight: 600 }}>
                                    {sch.provider_name}
                                  </span>
                                  <span className="badge badge-live">
                                    ✓ 100% Eligible Match
                                  </span>
                                </div>
                                <Link to={`/scholarships/${sch.slug || sch.id}`}>
                                  <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                                    {sch.title}
                                  </h3>
                                </Link>
                              </div>

                              <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 600 }}>Grant Amount</span>
                                <strong style={{ fontSize: '1.1rem', color: 'var(--accent-orange)', display: 'block' }}>
                                  {sch.award_amount}
                                </strong>
                              </div>
                            </div>

                            {/* Passed Criteria Breakdown */}
                            <div style={{ backgroundColor: 'var(--accent-emerald-light)', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: '18px', border: '1px solid rgba(16,185,129,0.2)' }}>
                              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#065f46', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                                Why You Qualify:
                              </span>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                                {sch.passed_criteria.map((c, i) => (
                                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#065f46' }}>
                                    <CheckCircle2 size={15} color="var(--accent-emerald)" flexShrink={0} />
                                    <span><strong>{c.criterion}:</strong> {c.detail}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                              <Link to={`/scholarships/${sch.slug || sch.id}`} className="btn btn-outline btn-sm">
                                View Details
                              </Link>
                              <button
                                onClick={() => handleOpenApply(sch)}
                                className="btn btn-primary btn-sm"
                              >
                                Apply Now <ArrowRight size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Partial Matches List */}
                {activeTab === 'partial' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {results.partial_matches.map((sch) => (
                      <div
                        key={sch.id}
                        className="card"
                        style={{
                          padding: '24px',
                          border: '1.5px solid var(--slate-200)',
                          boxShadow: 'var(--shadow-card)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--slate-500)', fontWeight: 600 }}>
                                {sch.provider_name}
                              </span>
                              <span className="badge" style={{ backgroundColor: '#fff7ed', color: '#9a3412', border: '1px solid #fed7aa' }}>
                                {sch.match_percentage}% Match Score
                              </span>
                            </div>
                            <Link to={`/scholarships/${sch.slug || sch.id}`}>
                              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                                {sch.title}
                              </h3>
                            </Link>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 600 }}>Grant Amount</span>
                            <strong style={{ fontSize: '1.05rem', color: 'var(--accent-orange)', display: 'block' }}>
                              {sch.award_amount}
                            </strong>
                          </div>
                        </div>

                        {/* Unmet Criteria Reason Box */}
                        <div style={{ backgroundColor: 'var(--accent-rose-light)', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: '12px', border: '1px solid var(--accent-rose-border)' }}>
                          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--accent-rose)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                            Unmet Criteria Explanation:
                          </span>
                          {sch.failed_criteria.map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: '#991b1b', marginTop: '3px' }}>
                              <XCircle size={15} color="var(--accent-rose)" flexShrink={0} />
                              <span><strong>{f.criterion}: </strong> {f.detail}</span>
                            </div>
                          ))}
                        </div>

                        {/* Passed Criteria */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '16px' }}>
                          {sch.passed_criteria.map((p, i) => (
                            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Check size={14} color="var(--accent-emerald)" /> {p.criterion} Passed
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          <Link to={`/scholarships/${sch.slug || sch.id}`} className="btn btn-outline btn-sm">
                            View Criteria
                          </Link>
                          <button
                            onClick={() => handleOpenApply(sch)}
                            className="btn btn-navy btn-sm"
                          >
                            Apply Anyway <ArrowRight size={14} />
                          </button>
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

      {/* Application Modal */}
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        scholarship={selectedScholarship}
      />

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 900px) {
          .eligibility-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
