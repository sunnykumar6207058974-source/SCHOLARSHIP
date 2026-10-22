import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ShieldAlert, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide your registered email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoStudent = () => {
    setEmail('student@eduscholar.org');
    setPassword('Student@123');
    setError('');
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@eduscholar.org');
    setPassword('Admin@123');
    setError('');
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '60px 20px', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        
        {/* Card */}
        <div className="card" style={{ padding: '36px', border: '1.5px solid var(--slate-200)', boxShadow: 'var(--shadow-xl)' }}>
          
          {/* Brand Logo Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--primary-800) 0%, var(--primary-600) 100%)',
              color: 'var(--white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              boxShadow: '0 4px 12px rgba(15, 44, 89, 0.25)'
            }}>
              <GraduationCap size={32} />
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-800)' }}>
              Welcome Back
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--slate-500)', marginTop: '4px' }}>
              Sign in to manage scholarship applications and track status
            </p>
          </div>

          {/* Demo Login Quick-Fill Buttons */}
          <div style={{ backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-100)', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--primary-700)', display: 'block', marginBottom: '6px' }}>
              Quick Evaluation Credentials:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={handleFillDemoStudent}
                style={{
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--white)',
                  border: '1px solid var(--primary-200)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--primary-800)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <User size={12} /> Student Demo
              </button>

              <button
                type="button"
                onClick={handleFillDemoAdmin}
                style={{
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--white)',
                  border: '1px solid #fed7aa',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#ea580c',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <ShieldAlert size={12} /> Admin Demo
              </button>
            </div>
          </div>

          {error && (
            <div style={{ backgroundColor: 'var(--accent-rose-light)', border: '1px solid var(--accent-rose-border)', color: 'var(--accent-rose)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.86rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="student@eduscholar.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
                <Mail size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('For this college project, password reset can be performed with the Student Demo account or newly registered user.'); }} style={{ fontSize: '0.78rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                  Forgot?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '36px', paddingRight: '36px' }}
                />
                <Lock size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '10px' }}
            >
              {loading ? 'Authenticating...' : (
                <>
                  Log In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer switch */}
          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--slate-100)', fontSize: '0.88rem', color: 'var(--slate-600)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--primary-700)', fontWeight: 700 }}>
              Register for Free
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
