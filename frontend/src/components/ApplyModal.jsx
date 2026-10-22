import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, CheckCircle2, AlertCircle, Send, Award, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function ApplyModal({ isOpen, onClose, scholarship }) {
  const { user, profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [currentInstitute, setCurrentInstitute] = useState('');
  const [statementOfPurpose, setStatementOfPurpose] = useState('');
  const [confirmedTruthful, setConfirmedTruthful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  if (!isOpen || !scholarship) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentInstitute.trim()) {
      setError('Please provide your current enrolled College / Institute name.');
      return;
    }

    if (!statementOfPurpose.trim() || statementOfPurpose.trim().length < 20) {
      setError('Please provide a brief Statement of Purpose (minimum 20 characters) explaining your educational aspiration.');
      return;
    }

    if (!confirmedTruthful) {
      setError('Please confirm that all submitted details and credentials are true and verifiable.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.applications.apply({
        scholarship_id: scholarship.id,
        current_institute: currentInstitute.trim(),
        statement_of_purpose: statementOfPurpose.trim()
      });

      if (res.success) {
        setSuccessData(res);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSuccessData(null);
    setError('');
    setCurrentInstitute('');
    setStatementOfPurpose('');
    setConfirmedTruthful(false);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={resetAndClose}
    >
      <div
        style={{
          backgroundColor: 'var(--white)',
          width: '100%',
          maxWidth: '560px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          border: '1px solid var(--slate-200)',
          animation: 'fadeInDown 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '18px 24px', backgroundColor: 'var(--primary-800)', color: 'var(--white)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-orange)', fontWeight: 700, letterSpacing: '0.04em' }}>
              Scholarship Application
            </span>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--white)', fontWeight: 700, marginTop: '2px' }}>
              {scholarship.title}
            </h3>
          </div>
          <button onClick={resetAndClose} style={{ color: 'var(--white)', opacity: 0.8, cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', maxHeight: '75vh', overflowY: 'auto' }}>
          {!isAuthenticated ? (
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
              <AlertCircle size={44} color="var(--accent-orange)" style={{ margin: '0 auto 14px auto' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--slate-800)' }}>Authentication Required</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.92rem', marginBottom: '24px' }}>
                Please sign in to your student account to apply for <strong>{scholarship.title}</strong> and track your application status.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Link to="/login" onClick={onClose} className="btn btn-navy" style={{ padding: '10px 24px' }}>
                  Log In
                </Link>
                <Link to="/register" onClick={onClose} className="btn btn-primary" style={{ padding: '10px 24px' }}>
                  Create Account
                </Link>
              </div>
            </div>
          ) : successData ? (
            <div style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald-light)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-800)', marginBottom: '8px' }}>
                Application Submitted Successfully!
              </h3>

              <div style={{ backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-100)', borderRadius: 'var(--radius-md)', padding: '14px', margin: '18px 0' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                  Your Application Reference Number
                </span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--primary-800)', letterSpacing: '0.05em' }}>
                  {successData.application_number}
                </strong>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', marginBottom: '24px', lineHeight: 1.6 }}>
                Your credentials and Statement of Purpose have been routed to the scholarship review committee. You can monitor verification stages and interview updates on your dashboard.
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    resetAndClose();
                    navigate('/dashboard?tab=applications');
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Track on Dashboard
                </button>
                <button onClick={resetAndClose} className="btn btn-outline" style={{ flex: 1 }}>
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Provider Info Pill */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--slate-50)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', marginBottom: '18px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'block' }}>Grant Award</span>
                  <strong style={{ color: 'var(--accent-orange)', fontSize: '0.95rem' }}>{scholarship.award_amount}</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'block' }}>Provider</span>
                  <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--slate-800)' }}>{scholarship.provider_name}</span>
                </div>
              </div>

              {error && (
                <div style={{ backgroundColor: 'var(--accent-rose-light)', border: '1px solid var(--accent-rose-border)', color: 'var(--accent-rose)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.86rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Applicant Summary */}
              <div style={{ marginBottom: '16px', padding: '12px 14px', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', backgroundColor: '#fafbfc' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Applicant Details
                </span>
                <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-800)' }}>{user.name} ({user.email})</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                  Level: {profile?.current_education_level || 'Graduation'} • Score: {profile?.marks_percentage || 0}% • Domicile: {profile?.state_domicile || 'All India'}
                </p>
              </div>

              {/* Enrolled Institute */}
              <div className="form-group">
                <label className="form-label">Current College / School / University *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Pune Institute of Computer Technology, Pune"
                  value={currentInstitute}
                  onChange={(e) => setCurrentInstitute(e.target.value)}
                />
              </div>

              {/* Statement of Purpose */}
              <div className="form-group">
                <label className="form-label">
                  Statement of Purpose & Need *
                  <span style={{ fontWeight: 400, color: 'var(--slate-500)', fontSize: '0.8rem', marginLeft: '6px' }}>
                    (Why should you receive this scholarship?)
                  </span>
                </label>
                <textarea
                  required
                  className="form-textarea"
                  rows={4}
                  placeholder="Describe your academic goals, family background, and how this scholarship will assist your higher education..."
                  value={statementOfPurpose}
                  onChange={(e) => setStatementOfPurpose(e.target.value)}
                />
              </div>

              {/* Truthfulness Declaration Checkbox */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.84rem', color: 'var(--slate-700)', lineHeight: 1.5 }}>
                  <input
                    type="checkbox"
                    checked={confirmedTruthful}
                    onChange={(e) => setConfirmedTruthful(e.target.checked)}
                    style={{ marginTop: '3px', accentColor: 'var(--primary-600)', width: '16px', height: '16px' }}
                  />
                  <span>
                    I confirm that the academic scores and family financial data declared in my profile are true, complete, and verifiable against official government documentation.
                  </span>
                </label>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '12px' }}
                >
                  {loading ? 'Submitting Application...' : (
                    <>
                      <Send size={16} /> Submit Application
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="btn btn-outline"
                  style={{ padding: '12px 18px' }}
                >
                  Cancel
                </button>
              </div>

              {/* Official Source Link Disclaimer */}
              {scholarship.official_source_url && (
                <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                  <span>Official Provider Portal: </span>
                  <a
                    href={scholarship.official_source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--primary-600)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                  >
                    Visit Official Site <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
