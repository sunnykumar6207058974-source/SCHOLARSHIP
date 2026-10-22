import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { api } from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.message) {
      setError('Please provide your name, email, and detailed message.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.content.contact(formData);
      if (res.success) {
        setSuccessResponse(res);
        setFormData({ name: '', email: '', mobile: '', subject: '', message: '' });
      }
    } catch (err) {
      setError(err.message || 'Failed to submit contact form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '40px 0 80px 0', minHeight: '85vh' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
          <span style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Get in Touch
          </span>
          <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--primary-800)', marginTop: '4px' }}>
            Contact Student Support Desk
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1rem', marginTop: '6px' }}>
            Have queries regarding scholarship eligibility, portal errors, or CSR partnerships? Our dedicated academic team is here to assist you.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '36px', alignItems: 'start' }} className="contact-layout">
          
          {/* Left Info Column */}
          <div>
            <div className="card" style={{ padding: '32px', border: '1.5px solid var(--slate-200)', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-800)', marginBottom: '18px' }}>
                Helpline & Office Info
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--slate-800)', display: 'block' }}>Toll-Free Helpline</strong>
                    <span style={{ fontSize: '0.88rem', color: 'var(--primary-700)', fontWeight: 600 }}>1800-102-3344</span>
                    <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '2px' }}>Monday through Saturday (10:00 AM – 6:00 PM IST)</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--slate-800)', display: 'block' }}>Email Support</strong>
                    <span style={{ fontSize: '0.88rem', color: 'var(--primary-700)', fontWeight: 600 }}>help@eduscholar.org</span>
                    <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '2px' }}>Response within 24 to 48 business hours</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--slate-800)', display: 'block' }}>Academic Operations Center</strong>
                    <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)', lineHeight: 1.5, marginTop: '2px' }}>
                      EduScholar Academic Research Hub, Technology Park, Sector 59, Pune – 411014, Maharashtra, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff7ed', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid #fed7aa' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#9a3412', marginBottom: '6px' }}>
                Quick Tip for Faster Support:
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#7c2d12', lineHeight: 1.5 }}>
                If your inquiry concerns an existing application, please include your <strong>Application Number (e.g. APP-2026-XXXXXX)</strong> in the subject line.
              </p>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="card" style={{ padding: '36px', border: '1.5px solid var(--slate-200)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-800)', marginBottom: '8px' }}>
              Send an Online Inquiry
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--slate-500)', marginBottom: '24px' }}>
              Please fill out all required details below and our team will get back to you promptly.
            </p>

            {successResponse && (
              <div style={{ backgroundColor: 'var(--accent-emerald-light)', border: '1px solid var(--accent-emerald-border)', padding: '16px', borderRadius: 'var(--radius-md)', color: '#065f46', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={20} color="var(--accent-emerald)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.94rem' }}>Inquiry Submitted Successfully</strong>
                  <p style={{ fontSize: '0.86rem', marginTop: '2px' }}>{successResponse.message}</p>
                </div>
              </div>
            )}

            {error && (
              <div style={{ backgroundColor: 'var(--accent-rose-light)', border: '1px solid var(--accent-rose-border)', padding: '12px', borderRadius: 'var(--radius-md)', color: 'var(--accent-rose)', fontSize: '0.86rem', marginBottom: '18px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="10-digit mobile"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Query regarding Income Certificate for Tata Trust"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message & Query *</label>
                <textarea
                  required
                  rows={5}
                  className="form-textarea"
                  placeholder="Please describe your question or issue in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '0.96rem' }}
              >
                {loading ? 'Submitting Inquiry...' : (
                  <>
                    <Send size={16} /> Submit Message
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 850px) {
          .contact-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
