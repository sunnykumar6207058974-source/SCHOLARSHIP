import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Bookmark,
  Bell,
  BookOpen,
  Award,
  Video,
  HelpCircle,
  Phone,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Navbar({ onOpenSearch }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scholarshipDropdownOpen, setScholarshipDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setScholarshipDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Fetch unread notifications if logged in
  useEffect(() => {
    if (isAuthenticated) {
      api.profile.getNotifications()
        .then((res) => {
          if (res.success && res.data) {
            const unread = res.data.filter((n) => !n.is_read).length;
            setUnreadCount(unread);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'var(--white)', boxShadow: '0 2px 10px rgba(15, 44, 89, 0.08)' }}>
      {/* Top Bar */}
      <div style={{ backgroundColor: 'var(--primary-900)', color: '#94a3b8', fontSize: '0.8rem', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={13} color="var(--accent-orange)" />
              Student Support Helpline: <strong style={{ color: '#f1f5f9' }}>1800-102-3344</strong> (Mon-Sat 10AM - 6PM)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={13} color="var(--accent-orange)" />
              <span style={{ color: '#f1f5f9' }}>help@eduscholar.org</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/results" style={{ color: '#cbd5e1', hover: { color: 'var(--white)' } }}>Scholarship Results</Link>
            <span style={{ opacity: 0.3 }}>|</span>
            <Link to="/contact" style={{ color: '#cbd5e1' }}>Contact Us</Link>
            {isAdmin && (
              <>
                <span style={{ opacity: 0.3 }}>|</span>
                <Link to="/admin" style={{ color: '#fb923c', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldAlert size={13} /> Admin Portal
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav style={{ backgroundColor: 'var(--white)', padding: '12px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--primary-800) 0%, var(--primary-600) 100%)',
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--white)',
              boxShadow: '0 4px 10px rgba(15, 44, 89, 0.25)'
            }}>
              <GraduationCap size={26} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-800)', letterSpacing: '-0.02em' }}>Edu</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent-orange)', letterSpacing: '-0.02em' }}>Scholar</span>
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--slate-500)', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '-4px' }}>
                Scholarship Discovery Portal
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div style={{ display: 'none', lgDisplay: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
            
            {/* Scholarships Mega Dropdown */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setScholarshipDropdownOpen(true)}
              onMouseLeave={() => setScholarshipDropdownOpen(false)}
            >
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '8px 14px',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  color: location.pathname.startsWith('/scholarships') ? 'var(--primary-600)' : 'var(--slate-700)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                Scholarships <ChevronDown size={15} style={{ transform: scholarshipDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {scholarshipDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '680px',
                  backgroundColor: 'var(--white)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--slate-200)',
                  padding: '24px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '20px',
                  zIndex: 200,
                  animation: 'fadeInDown 0.2s ease-out'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--primary-700)', fontWeight: 700, marginBottom: '12px', borderBottom: '2px solid var(--primary-100)', paddingBottom: '6px' }}>
                      By Class / Degree
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                      <li><Link to="/scholarships?education_level=Class 1-10" style={{ color: 'var(--slate-600)' }}>Class 1 to 10 (Pre-Matric)</Link></li>
                      <li><Link to="/scholarships?education_level=Class 11-12" style={{ color: 'var(--slate-600)' }}>Class 11 & 12 (Post-Matric)</Link></li>
                      <li><Link to="/scholarships?education_level=Graduation" style={{ color: 'var(--slate-600)' }}>Graduation / Undergrad</Link></li>
                      <li><Link to="/scholarships?education_level=Post-Graduation" style={{ color: 'var(--slate-600)' }}>Post-Graduation / Masters</Link></li>
                      <li><Link to="/scholarships?education_level=Diploma" style={{ color: 'var(--slate-600)' }}>Polytechnic & Diploma</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--primary-700)', fontWeight: 700, marginBottom: '12px', borderBottom: '2px solid var(--primary-100)', paddingBottom: '6px' }}>
                      By Category & Type
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                      <li><Link to="/scholarships?gender=Female" style={{ color: 'var(--slate-600)' }}>Girls & Women Only</Link></li>
                      <li><Link to="/scholarships?category=merit-cum-means" style={{ color: 'var(--slate-600)' }}>Merit-cum-Means Based</Link></li>
                      <li><Link to="/scholarships?category=engineering-stem" style={{ color: 'var(--slate-600)' }}>Engineering & STEM</Link></li>
                      <li><Link to="/scholarships?category=medical-healthcare" style={{ color: 'var(--slate-600)' }}>Medical (MBBS / Nursing)</Link></li>
                      <li><Link to="/scholarships?category=minority-inclusion" style={{ color: 'var(--slate-600)' }}>Minority & SC/ST/OBC</Link></li>
                      <li><Link to="/scholarships?scholarship_type=Government" style={{ color: 'var(--slate-600)' }}>Government & NSP Schemes</Link></li>
                      <li>
                        <Link
                          to="/scholarships?scholarship_type=Online"
                          style={{
                            color: 'var(--primary-600)',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          🌐 Online Scholarships
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--primary-700)', fontWeight: 700, marginBottom: '12px', borderBottom: '2px solid var(--primary-100)', paddingBottom: '6px' }}>
                      Top States
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                      <li><Link to="/scholarships?state=Maharashtra" style={{ color: 'var(--slate-600)' }}>Maharashtra</Link></li>
                      <li><Link to="/scholarships?state=Uttar Pradesh" style={{ color: 'var(--slate-600)' }}>Uttar Pradesh</Link></li>
                      <li><Link to="/scholarships?state=Karnataka" style={{ color: 'var(--slate-600)' }}>Karnataka</Link></li>
                      <li><Link to="/scholarships?state=Gujarat" style={{ color: 'var(--slate-600)' }}>Gujarat</Link></li>
                      <li><Link to="/scholarships?state=Bihar" style={{ color: 'var(--slate-600)' }}>Bihar & West Bengal</Link></li>
                      <li style={{ marginTop: '4px' }}>
                        <Link to="/scholarships" style={{ color: 'var(--accent-orange)', fontWeight: 600 }}>Explore All Scholarships →</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/scholarships?tab=live"
              style={{
                padding: '8px 14px',
                fontWeight: 600,
                fontSize: '0.92rem',
                color: location.search.includes('tab=live') ? 'var(--primary-600)' : 'var(--slate-700)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              Live Schemes
            </Link>

            <Link
              to="/articles"
              style={{
                padding: '8px 14px',
                fontWeight: 600,
                fontSize: '0.92rem',
                color: location.pathname.startsWith('/articles') ? 'var(--primary-600)' : 'var(--slate-700)'
              }}
            >
              Articles
            </Link>

            <Link
              to="/videos"
              style={{
                padding: '8px 14px',
                fontWeight: 600,
                fontSize: '0.92rem',
                color: location.pathname.startsWith('/videos') ? 'var(--primary-600)' : 'var(--slate-700)'
              }}
            >
              Videos
            </Link>

            <Link
              to="/qna"
              style={{
                padding: '8px 14px',
                fontWeight: 600,
                fontSize: '0.92rem',
                color: location.pathname.startsWith('/qna') ? 'var(--primary-600)' : 'var(--slate-700)'
              }}
            >
              Q&A
            </Link>

            <Link
              to="/eligibility-checker"
              className="btn btn-sm"
              style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
                color: '#9a3412',
                border: '1px solid #fdba74',
                fontWeight: 700,
                marginLeft: '6px'
              }}
            >
              <Sparkles size={14} color="#ea580c" /> Check Eligibility
            </Link>
          </div>

          {/* Right Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            
            {/* Instant Search Button */}
            <button
              onClick={onOpenSearch}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--slate-100)',
                color: 'var(--slate-600)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.88rem',
                border: '1px solid var(--slate-200)',
                transition: 'all 0.2s'
              }}
              title="Search scholarships, articles, providers"
            >
              <Search size={16} color="var(--slate-500)" />
              <span className="search-text-desktop">Search Scholarships...</span>
              <kbd style={{ backgroundColor: 'var(--white)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--slate-400)', border: '1px solid var(--slate-200)' }}>⌘K</kbd>
            </button>

            {/* Auth Buttons or User Avatar */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--primary-50)',
                    border: '1.5px solid var(--primary-100)'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-700)',
                    color: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--primary-800)' }} className="user-name-desktop">
                    {user.name.split(' ')[0]}
                  </span>
                  {unreadCount > 0 && (
                    <span style={{
                      backgroundColor: 'var(--accent-orange)',
                      color: 'var(--white)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      borderRadius: '10px',
                      padding: '1px 6px'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                  <ChevronDown size={14} color="var(--slate-600)" />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    width: '240px',
                    backgroundColor: 'var(--white)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--slate-200)',
                    padding: '8px 0',
                    zIndex: 300,
                    animation: 'fadeInDown 0.15s ease-out'
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-100)' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--slate-900)' }}>{user.name}</p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', wordBreak: 'break-all' }}>{user.email}</p>
                    </div>

                    <div style={{ padding: '6px 0' }}>
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: 'var(--slate-700)', fontSize: '0.88rem' }}
                      >
                        <LayoutDashboard size={16} color="var(--primary-600)" /> Student Dashboard
                      </Link>

                      <Link
                        to="/dashboard?tab=applications"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: 'var(--slate-700)', fontSize: '0.88rem' }}
                      >
                        <Award size={16} color="var(--primary-600)" /> My Applications
                      </Link>

                      <Link
                        to="/dashboard?tab=saved"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: 'var(--slate-700)', fontSize: '0.88rem' }}
                      >
                        <Bookmark size={16} color="var(--primary-600)" /> Saved Scholarships
                      </Link>

                      <Link
                        to="/dashboard?tab=notifications"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', color: 'var(--slate-700)', fontSize: '0.88rem' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Bell size={16} color="var(--primary-600)" /> Notifications
                        </div>
                        {unreadCount > 0 && (
                          <span style={{ backgroundColor: 'var(--accent-orange)', color: '#fff', fontSize: '0.7rem', padding: '1px 6px', borderRadius: '10px', fontWeight: 700 }}>
                            {unreadCount}
                          </span>
                        )}
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: '#ea580c', fontWeight: 600, fontSize: '0.88rem', borderTop: '1px solid var(--slate-100)' }}
                        >
                          <ShieldAlert size={16} /> Admin Portal
                        </Link>
                      )}
                    </div>

                    <div style={{ borderTop: '1px solid var(--slate-100)', padding: '6px 0 0 0' }}>
                      <button
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 16px', color: 'var(--accent-rose)', fontSize: '0.88rem', fontWeight: 600, textAlign: 'left' }}
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: 'block', padding: '6px', color: 'var(--primary-800)' }}
              className="mobile-nav-toggle"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--white)',
          borderTop: '1px solid var(--slate-200)',
          padding: '20px',
          boxShadow: 'var(--shadow-lg)',
          animation: 'fadeInDown 0.2s ease-out'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem', fontWeight: 600 }}>
            <Link to="/scholarships" style={{ color: 'var(--slate-800)', padding: '8px 0', borderBottom: '1px solid var(--slate-100)' }}>
              All Scholarships
            </Link>
            <Link to="/scholarships?tab=live" style={{ color: 'var(--slate-800)', padding: '8px 0', borderBottom: '1px solid var(--slate-100)' }}>
              Live Scholarships
            </Link>
            <Link
              to="/scholarships?scholarship_type=Online"
              style={{
                color: 'var(--primary-700)',
                fontWeight: 700,
                padding: '8px 0',
                borderBottom: '1px solid var(--slate-100)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🌐 Online Scholarships
            </Link>
            <Link to="/eligibility-checker" style={{ color: 'var(--accent-orange)', padding: '8px 0', borderBottom: '1px solid var(--slate-100)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} /> Check Eligibility Match
            </Link>
            <Link to="/results" style={{ color: 'var(--slate-800)', padding: '8px 0', borderBottom: '1px solid var(--slate-100)' }}>
              Scholarship Results
            </Link>
            <Link to="/articles" style={{ color: 'var(--slate-800)', padding: '8px 0', borderBottom: '1px solid var(--slate-100)' }}>
              Articles & Guides
            </Link>
            <Link to="/videos" style={{ color: 'var(--slate-800)', padding: '8px 0', borderBottom: '1px solid var(--slate-100)' }}>
              Video Masterclasses
            </Link>
            <Link to="/qna" style={{ color: 'var(--slate-800)', padding: '8px 0', borderBottom: '1px solid var(--slate-100)' }}>
              Community Q&A
            </Link>
            <Link to="/contact" style={{ color: 'var(--slate-800)', padding: '8px 0' }}>
              Contact Support
            </Link>
          </div>
        </div>
      )}

      {/* Responsive Styles for Navbar */}
      <style>{`
        @media (min-width: 992px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
        }
        @media (max-width: 991px) {
          .desktop-nav {
            display: none !important;
          }
          .search-text-desktop, .user-name-desktop {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
