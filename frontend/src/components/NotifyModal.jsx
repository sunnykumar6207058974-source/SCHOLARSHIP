import React, { useState } from 'react';
import { X, Bell, CheckCircle2, AlertCircle, Mail, Phone, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function NotifyModal({ isOpen, onClose, scholarship }) {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !scholarship) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address so we can alert you.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.scholarships.notifyMe(scholarship.slug || scholarship.id, {
        email: email.trim(),
        mobile: mobile.trim()
      });

      if (res.success) {
        setSuccessMsg(res.message);
      } else {
        setError(res.message || 'Could not register alert.');
      }
    } catch (err) {
      setError(err.message || 'Unable to register alert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccessMsg('');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
      onClick={handleClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            padding: '22px 24px',
            color: 'white',
            position: 'relative'
          }}
        >
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell size={20} color="#fef08a" />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#bfdbfe', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Cycle Alert Subscription
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, lineHeight: 1.3 }}>
            Notify Me When Next Cycle Opens
          </h3>
          <p style={{ fontSize: '0.86rem', color: '#e0e7ff', marginTop: '6px', marginBottom: 0 }}>
            Never miss this opportunity! We'll alert you via email & SMS the moment applications go live.
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {successMsg ? (
            <div style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  border: '2px solid #a7f3d0'
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#065f46', marginBottom: '8px' }}>
                Alert Registered Successfully!
              </h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: 1.5, marginBottom: '20px' }}>
                {successMsg}
              </p>
              <button onClick={handleClose} className="btn btn-primary" style={{ padding: '10px 24px' }}>
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Program Highlight Card */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 16px',
                  marginBottom: '18px'
                }}
              >
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase' }}>
                  Target Scheme
                </span>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--primary-800)', margin: '4px 0 8px 0' }}>
                  {scholarship.title}
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--slate-600)' }}>
                    Provider: <strong>{scholarship.provider_name}</strong>
                  </span>
                  {scholarship.expected_next_cycle && (
                    <span
                      style={{
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Calendar size={12} /> Expected: {scholarship.expected_next_cycle}
                    </span>
                  )}
                </div>
              </div>

              {error && (
                <div
                  style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#b91c1c',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.86rem',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <AlertCircle size={16} flexShrink={0} />
                  <span>{error}</span>
                </div>
              )}

              {/* Email Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  Email Address <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email to receive opening alert"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--slate-300)',
                      fontSize: '0.92rem'
                    }}
                  />
                </div>
              </div>

              {/* Mobile Input */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  Mobile Number (Optional - for instant SMS / WhatsApp alert)
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit mobile number"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--slate-300)',
                      fontSize: '0.92rem'
                    }}
                  />
                </div>
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={handleClose} className="btn btn-outline" style={{ fontSize: '0.88rem' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{
                    fontSize: '0.88rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#2563eb'
                  }}
                >
                  <Bell size={15} />
                  {loading ? 'Subscribing...' : 'Notify Me When Open'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
