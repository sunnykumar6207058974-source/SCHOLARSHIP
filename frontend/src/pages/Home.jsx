import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ArrowRight,
  Award,
  Users,
  GraduationCap,
  CheckCircle,
  FileText,
  Clock,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Cpu,
  Heart,
  Activity,
  Landmark,
  Globe,
  Star,
  Building,
  Compass
} from 'lucide-react';
import ScholarshipCard from '../components/ScholarshipCard';
import ApplyModal from '../components/ApplyModal';
import { api } from '../services/api';

export default function Home() {
  const navigate = useNavigate();

  const [featuredScholarships, setFeaturedScholarships] = useState([]);
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Hero Search
  const [heroSearch, setHeroSearch] = useState('');
  const [heroEducation, setHeroEducation] = useState('All');
  const [heroState, setHeroState] = useState('All India');

  // Application Modal
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      api.scholarships.getFeatured(),
      api.scholarships.getCategories(),
      api.content.getArticles({ limit: 3 })
    ])
      .then(([featRes, catRes, artRes]) => {
        if (featRes.success) setFeaturedScholarships(featRes.data);
        if (catRes.success) setCategories(catRes.data);
        if (artRes.success) setArticles(artRes.data.slice(0, 3));
      })
      .catch((err) => console.error('Error fetching home data', err))
      .finally(() => setLoading(false));
  }, []);

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (heroSearch.trim()) params.append('search', heroSearch.trim());
    if (heroEducation !== 'All') params.append('education_level', heroEducation);
    if (heroState !== 'All India') params.append('state', heroState);
    navigate(`/scholarships?${params.toString()}`);
  };

  const handleOpenApply = (sch) => {
    setSelectedScholarship(sch);
    setApplyModalOpen(true);
  };

  const categoryIcons = {
    'merit-cum-means': <Award size={26} color="var(--primary-700)" />,
    'girls-women': <Heart size={26} color="#e11d48" />,
    'engineering-stem': <Cpu size={26} color="#0284c7" />,
    'medical-healthcare': <Activity size={26} color="#059669" />,
    'government-national': <Landmark size={26} color="#b45309" />,
    'minority-inclusion': <Users size={26} color="#7c3aed" />,
    'study-abroad': <Globe size={26} color="#0891b2" />
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary-900) 0%, var(--primary-800) 50%, var(--primary-700) 100%)',
        color: 'var(--white)',
        paddingTop: '65px',
        paddingBottom: '85px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative background circles */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            
            {/* Tagline Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.86rem',
              fontWeight: 600,
              color: '#fed7aa',
              border: '1px solid rgba(254, 215, 170, 0.3)',
              marginBottom: '20px'
            }}>
              <Sparkles size={16} color="var(--accent-orange)" />
              India's Premier Scholarship & Fellowship Discovery Portal
            </div>

            {/* Main Heading */}
            <h1 style={{
              fontSize: 'clamp(2.1rem, 4.2vw, 3.2rem)',
              fontWeight: 800,
              color: 'var(--white)',
              lineHeight: 1.2,
              marginBottom: '18px',
              letterSpacing: '-0.02em'
            }}>
              Empowering Students to Discover & Win <span style={{ color: 'var(--accent-orange)' }}>Scholarships</span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.18rem)',
              color: '#cbd5e1',
              lineHeight: 1.6,
              marginBottom: '36px',
              fontWeight: 400
            }}>
              Connect with 12,000+ verified corporate CSR, Government (NSP), and private scholarships. Calculate instant rule-based eligibility and track your applications end-to-end.
            </p>

            {/* Hero Quick Search Box */}
            <div style={{
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius-xl)',
              padding: '12px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}>
              <form onSubmit={handleHeroSearchSubmit} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 140px',
                gap: '10px',
                alignItems: 'center'
              }} className="hero-search-grid">
                
                {/* Search Text */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search by name, provider..."
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--slate-200)',
                      color: 'var(--slate-800)',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                  <Search size={17} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>

                {/* Education Dropdown */}
                <div>
                  <select
                    value={heroEducation}
                    onChange={(e) => setHeroEducation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--slate-200)',
                      color: 'var(--slate-800)',
                      fontSize: '0.92rem',
                      outline: 'none',
                      backgroundColor: 'var(--white)'
                    }}
                  >
                    <option value="All">All Education Levels</option>
                    <option value="Class 1-10">Class 1 to 10 (Pre-Matric)</option>
                    <option value="Class 11-12">Class 11 & 12 (Post-Matric)</option>
                    <option value="Graduation">Undergraduate / College</option>
                    <option value="Post-Graduation">Post-Graduation / Masters</option>
                    <option value="Diploma">Diploma / Polytechnic</option>
                  </select>
                </div>

                {/* State Dropdown */}
                <div>
                  <select
                    value={heroState}
                    onChange={(e) => setHeroState(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--slate-200)',
                      color: 'var(--slate-800)',
                      fontSize: '0.92rem',
                      outline: 'none',
                      backgroundColor: 'var(--white)'
                    }}
                  >
                    <option value="All India">All States & UTs</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Bihar">Bihar</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                  </select>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: '12px',
                    height: '100%',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.95rem'
                  }}
                >
                  <Search size={17} /> Search
                </button>
              </form>
            </div>

            {/* Popular quick tags */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '18px', fontSize: '0.84rem', color: '#cbd5e1' }}>
              <span style={{ fontWeight: 600 }}>Trending Searches:</span>
              {[
                { label: 'Tata Trusts', query: 'Tata' },
                { label: 'Girls Only', query: 'Girls' },
                { label: 'Reliance UG', query: 'Reliance' },
                { label: 'MBBS Medical', query: 'Medical' },
                { label: 'NSP Portal', query: 'NSP' }
              ].map((tag) => (
                <button
                  key={tag.label}
                  onClick={() => navigate(`/scholarships?search=${tag.query}`)}
                  style={{
                    color: '#f8fafc',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  {tag.label}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 2. Impact Statistics Bar */}
      <section style={{ backgroundColor: 'var(--white)', borderBottom: '1px solid var(--slate-200)', padding: '24px 0', boxShadow: '0 4px 12px rgba(15, 44, 89, 0.04)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            textAlign: 'center'
          }}>
            <div>
              <strong style={{ fontSize: '1.9rem', color: 'var(--primary-800)', fontWeight: 800, display: 'block' }}>12,500+</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 500 }}>Live & Upcoming Scholarships</span>
            </div>
            <div>
              <strong style={{ fontSize: '1.9rem', color: 'var(--accent-orange)', fontWeight: 800, display: 'block' }}>₹180+ Cr</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 500 }}>Disbursed Grants Value</span>
            </div>
            <div>
              <strong style={{ fontSize: '1.9rem', color: 'var(--primary-800)', fontWeight: 800, display: 'block' }}>4.8 Million</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 500 }}>Registered Indian Scholars</span>
            </div>
            <div>
              <strong style={{ fontSize: '1.9rem', color: 'var(--accent-emerald)', fontWeight: 800, display: 'block' }}>98.6%</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 500 }}>Verified Source Accuracy</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured & Trending Scholarships */}
      <section style={{ padding: '65px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <TrendingUp size={16} /> Most Popular Right Now
              </div>
              <h2 style={{ fontSize: '1.9rem', color: 'var(--primary-800)', fontWeight: 800, marginTop: '4px' }}>
                Featured Scholarships 2026
              </h2>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
                Top corporate CSR programs and national initiatives accepting online applications.
              </p>
            </div>

            <Link
              to="/scholarships?tab=live"
              className="btn btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
            >
              View All Scholarships <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {[1, 2, 3].map((n) => (
                <div key={n} style={{ height: '320px', backgroundColor: 'var(--slate-100)', borderRadius: 'var(--radius-lg)', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {featuredScholarships.map((sch) => (
                <ScholarshipCard
                  key={sch.id}
                  scholarship={sch}
                  onApply={handleOpenApply}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Interactive Eligibility Callout Banner */}
      <section style={{ backgroundColor: 'var(--primary-50)', padding: '50px 0', borderTop: '1px solid var(--primary-100)', borderBottom: '1px solid var(--primary-100)' }}>
        <div className="container">
          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: 'var(--radius-xl)',
            padding: '36px 40px',
            border: '2px solid var(--primary-100)',
            boxShadow: 'var(--shadow-card)',
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: '36px',
            alignItems: 'center'
          }} className="eligibility-banner-grid">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fef3c7', color: '#9a3412', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '12px' }}>
                <Sparkles size={14} color="#ea580c" /> 100% Rule-Based Match
              </div>
              <h3 style={{ fontSize: '1.85rem', color: 'var(--primary-800)', fontWeight: 800, lineHeight: 1.25, marginBottom: '12px' }}>
                Confused which scholarships match your scores and income?
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '22px' }}>
                Answer 5 simple questions about your current degree, 12th/UG marks percentage, family annual income, and domicile state. Our transparent rule-engine tests all eligibility criteria and tells you precisely why you qualify!
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link to="/eligibility-checker" className="btn btn-primary btn-lg pulse-button">
                  <Sparkles size={18} /> Check My Eligibility Now
                </Link>
                <Link to="/scholarships" className="btn btn-outline btn-lg">
                  Browse Catalog
                </Link>
              </div>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              border: '1px solid var(--slate-200)'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '14px' }}>
                Instant Evaluation Across 7 Parameters:
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--slate-600)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} color="var(--accent-emerald)" /> Degree Level Compatibility (UG, PG, School)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} color="var(--accent-emerald)" /> Academic Cut-off Scores & Board %
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} color="var(--accent-emerald)" /> Family Annual Income Thresholds
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} color="var(--accent-emerald)" /> Gender & Women Reservation Clauses
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} color="var(--accent-emerald)" /> State of Residence Domicile Verification
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Scholarship Categories */}
      <section style={{ padding: '65px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
            <h2 style={{ fontSize: '1.9rem', color: 'var(--primary-800)', fontWeight: 800 }}>
              Explore Scholarships by Category
            </h2>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem', marginTop: '6px' }}>
              Tailored scholarship funding categories designed for every stage of your educational pursuit.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px'
          }}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/scholarships?category=${cat.slug}`}
                className="card card-hover"
                style={{
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  border: '1.5px solid var(--slate-200)'
                }}
              >
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--primary-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {categoryIcons[cat.slug] || <Award size={26} color="var(--primary-700)" />}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '4px' }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', lineHeight: 1.4, marginBottom: '8px' }}>
                    {cat.description}
                  </p>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-orange)' }}>
                    {cat.scholarship_count || 1} Active Schemes →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. How it Works: 4 Steps Application Walkthrough */}
      <section style={{ backgroundColor: 'var(--white)', padding: '65px 0', borderTop: '1px solid var(--slate-200)', borderBottom: '1px solid var(--slate-200)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 45px auto' }}>
            <span style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Simple 4-Step Process
            </span>
            <h2 style={{ fontSize: '1.9rem', color: 'var(--primary-800)', fontWeight: 800, marginTop: '4px' }}>
              How EduScholar Helps You Win
            </h2>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
              From discovery to bank account disbursement, we streamline every step.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                desc: 'Fill your degree level, board percentage, family annual income, and domicile state.',
                icon: <FileText size={28} color="var(--primary-600)" />
              },
              {
                step: '02',
                title: 'Check Eligibility',
                desc: 'Our rule engine matches your exact credentials against active corporate & government schemes.',
                icon: <Sparkles size={28} color="var(--accent-orange)" />
              },
              {
                step: '03',
                title: 'Submit Online',
                desc: 'Upload standard documents once into your secure vault and apply directly with your Statement of Purpose.',
                icon: <Award size={28} color="var(--accent-emerald)" />
              },
              {
                step: '04',
                title: 'Track Disbursement',
                desc: 'Receive real-time notifications on screening, document verification, interview calls, and fund release.',
                icon: <Clock size={28} color="var(--primary-800)" />
              }
            ].map((st) => (
              <div
                key={st.step}
                style={{
                  backgroundColor: 'var(--slate-50)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px 24px',
                  border: '1.5px solid var(--slate-200)',
                  position: 'relative'
                }}
              >
                <span style={{ position: 'absolute', top: '16px', right: '20px', fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-200)' }}>
                  {st.step}
                </span>
                <div style={{ marginBottom: '16px' }}>{st.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '8px' }}>
                  {st.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Corporate & National Sponsors / Partners */}
      <section style={{ padding: '50px 0', backgroundColor: '#fafbfc' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--slate-400)', fontWeight: 700, letterSpacing: '0.06em', display: 'block', marginBottom: '24px' }}>
            Curated Programs From Leading Indian Trusts, Foundations & Ministries
          </span>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '36px',
            opacity: 0.85
          }}>
            {['Sir Ratan Tata Trust', 'Reliance Foundation', 'Infosys Foundation', 'HDFC Parivartan', 'Wipro Cares', 'AICTE Pragati', 'Kotak Education'].map((partner) => (
              <div
                key={partner}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--slate-200)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  color: 'var(--slate-700)'
                }}
              >
                <Building size={16} color="var(--primary-700)" />
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Latest Scholarship Guides & Articles */}
      <section style={{ padding: '65px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Knowledge & Guidance
              </span>
              <h2 style={{ fontSize: '1.9rem', color: 'var(--primary-800)', fontWeight: 800, marginTop: '4px' }}>
                Latest Scholarship Articles & Guides
              </h2>
            </div>
            <Link to="/articles" className="btn btn-outline">
              View All Articles <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {articles.map((art) => (
              <div key={art.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                {art.image_url && (
                  <div style={{ height: '180px', overflow: 'hidden' }}>
                    <img src={art.image_url} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '8px' }}>
                    <span className="badge badge-category">{art.category}</span>
                    <span>{art.read_time}</span>
                  </div>
                  <Link to={`/articles/${art.slug}`}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '8px', lineHeight: 1.35 }}>
                      {art.title}
                    </h3>
                  </Link>
                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.5, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {art.content.replace(/[#*`>]/g, '').slice(0, 140)}...
                  </p>
                  <Link
                    to={`/articles/${art.slug}`}
                    style={{ marginTop: '14px', fontSize: '0.86rem', fontWeight: 600, color: 'var(--primary-600)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    Read Full Guide <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Modal */}
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        scholarship={selectedScholarship}
      />

      {/* Responsive Styles for Home */}
      <style>{`
        @media (max-width: 768px) {
          .hero-search-grid {
            grid-template-columns: 1fr !important;
          }
          .eligibility-banner-grid {
            grid-template-columns: 1fr !important;
            padding: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
