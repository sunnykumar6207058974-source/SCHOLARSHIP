import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Award,
  GraduationCap,
  Clock,
  Heart,
  Share2,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  Building,
  FileText,
  HelpCircle,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Bell,
  History,
  TrendingUp,
  Users
} from 'lucide-react';
import ApplyModal from '../components/ApplyModal';
import NotifyModal from '../components/NotifyModal';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function ScholarshipDetail() {
  const { idOrSlug } = useParams();
  const { isAuthenticated } = useAuth();

  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    api.scholarships.getDetail(idOrSlug)
      .then((res) => {
        if (res.success && res.data) {
          setScholarship(res.data);
          setIsSaved(res.data.is_saved || false);
        } else {
          setError('Scholarship could not be found.');
        }
      })
      .catch((err) => {
        console.error('Error fetching detail:', err);
        setError(err.message || 'Unable to retrieve scholarship information.');
      })
      .finally(() => setLoading(false));
  }, [idOrSlug]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      alert('Please log in or register to save scholarships to your favorites.');
      return;
    }
    try {
      const res = await api.profile.toggleSave(scholarship.id);
      setIsSaved(res.saved);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{
          width: '45px',
          height: '45px',
          border: '4px solid var(--slate-200)',
          borderTopColor: 'var(--primary-600)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px auto'
        }} />
        <p style={{ color: 'var(--slate-600)' }}>Loading verified scholarship details...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center', minHeight: '60vh' }}>
        <AlertCircle size={48} color="var(--accent-rose)" style={{ margin: '0 auto 16px auto' }} />
        <h2 style={{ color: 'var(--slate-800)', marginBottom: '8px' }}>Scholarship Not Found</h2>
        <p style={{ color: 'var(--slate-600)', marginBottom: '24px' }}>{error || 'This scholarship may have expired or been unlisted.'}</p>
        <Link to="/scholarships" className="btn btn-navy">
          Browse All Scholarships
        </Link>
      </div>
    );
  }

  // Days left calculation
  let daysLeft = null;
  let deadlineString = 'Always Open (Rolling Admissions)';
  if (scholarship.deadline && !scholarship.is_always_open) {
    const deadlineDate = new Date(scholarship.deadline);
    const today = new Date();
    daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    deadlineString = deadlineDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', paddingBottom: '70px' }}>
      
      {/* 1. Header Hero Banner */}
      <div style={{ backgroundColor: 'var(--primary-900)', color: 'var(--white)', paddingTop: '40px', paddingBottom: '45px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container">
          
          {/* Breadcrumbs */}
          <div style={{ fontSize: '0.84rem', color: '#94a3b8', marginBottom: '16px' }}>
            <Link to="/" style={{ color: '#cbd5e1' }}>Home</Link> / <Link to="/scholarships" style={{ color: '#cbd5e1' }}>Scholarships</Link> / <span style={{ color: 'var(--white)' }}>{scholarship.title}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '30px', alignItems: 'center' }} className="detail-hero-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span className={`badge ${scholarship.status === 'live' ? 'badge-live' : scholarship.status === 'upcoming' ? 'badge-upcoming' : 'badge-closed'}`}>
                  {scholarship.status === 'live' ? '● Live Now' : scholarship.status === 'upcoming' ? 'Upcoming' : 'Closed'}
                </span>
                <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                  {scholarship.scholarship_type}
                </span>
                <span className="badge" style={{ backgroundColor: 'rgba(249,115,22,0.2)', color: '#fed7aa', border: '1px solid #f97316' }}>
                  {scholarship.category_name || 'Scholarship Scheme'}
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)', color: 'var(--white)', fontWeight: 800, lineHeight: 1.25, marginBottom: '12px' }}>
                {scholarship.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.95rem' }}>
                <Building size={16} color="var(--accent-orange)" />
                <span>Offered by: <strong>{scholarship.provider_name}</strong></span>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(8px)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              minWidth: '280px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.78rem', color: '#fed7aa', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Total Financial Award
              </span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--white)', display: 'block', margin: '4px 0 16px 0' }}>
                {scholarship.award_amount}
              </strong>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px' }}
                >
                  Apply Now <ArrowRight size={16} />
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={handleToggleSave}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: isSaved ? '#f87171' : 'var(--white)',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <Heart size={15} fill={isSaved ? '#f87171' : 'none'} />
                    {isSaved ? 'Saved' : 'Save'}
                  </button>

                  <button
                    onClick={handleShare}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: copied ? '#34d399' : 'var(--white)',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <Share2 size={15} />
                    {copied ? 'Copied' : 'Share'}
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 2. Main Content Body */}
      <div className="container" style={{ marginTop: '36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }} className="detail-layout">
          
          {/* Left Column: Full Information */}
          <div>
            
            {/* Quick Highlights Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              border: '1.5px solid var(--slate-200)',
              marginBottom: '28px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                  Deadline Date
                </span>
                <strong style={{ fontSize: '0.96rem', color: 'var(--primary-800)' }}>
                  {deadlineString}
                </strong>
                {daysLeft !== null && (
                  <span style={{ fontSize: '0.75rem', color: daysLeft <= 10 ? 'var(--accent-rose)' : 'var(--accent-emerald)', fontWeight: 600, display: 'block', marginTop: '2px' }}>
                    {daysLeft > 0 ? `(${daysLeft} days remaining)` : '(Ends today)'}
                  </span>
                )}
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                  Education Level
                </span>
                <strong style={{ fontSize: '0.96rem', color: 'var(--primary-800)' }}>
                  {scholarship.education_level || 'Open for All'}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                  Minimum Marks
                </span>
                <strong style={{ fontSize: '0.96rem', color: 'var(--primary-800)' }}>
                  {scholarship.criteria?.min_marks_percentage > 0 ? `${scholarship.criteria.min_marks_percentage}% required` : 'No minimum cutoff'}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                  Max Family Income
                </span>
                <strong style={{ fontSize: '0.96rem', color: 'var(--primary-800)' }}>
                  {scholarship.criteria?.max_family_income ? `≤ ₹${parseInt(scholarship.criteria.max_family_income, 10).toLocaleString('en-IN')}` : 'No income ceiling'}
                </strong>
              </div>
            </div>

            {/* Section 1: Overview */}
            <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.28rem', color: 'var(--primary-800)', fontWeight: 700, marginBottom: '14px', borderBottom: '2px solid var(--primary-50)', paddingBottom: '8px' }}>
                About the Scholarship Program
              </h2>
              <div style={{ fontSize: '0.95rem', color: 'var(--slate-700)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {scholarship.full_overview || scholarship.brief_description}
              </div>
            </div>

            {/* Section 2: Detailed Eligibility Criteria */}
            <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.28rem', color: 'var(--primary-800)', fontWeight: 700, marginBottom: '14px', borderBottom: '2px solid var(--primary-50)', paddingBottom: '8px' }}>
                Detailed Eligibility Criteria
              </h2>
              
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem', color: 'var(--slate-700)' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle size={18} color="var(--accent-emerald)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>
                    <strong>Educational Level: </strong>
                    Open to students pursuing {scholarship.education_level || 'recognized degree or diploma programs'}.
                  </span>
                </li>

                {scholarship.criteria?.min_marks_percentage > 0 && (
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle size={18} color="var(--accent-emerald)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>
                      <strong>Academic Score: </strong>
                      Applicant must have scored a minimum of {scholarship.criteria.min_marks_percentage}% in the previous qualifying examination.
                    </span>
                  </li>
                )}

                {scholarship.criteria?.max_family_income && (
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle size={18} color="var(--accent-emerald)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>
                      <strong>Family Annual Income: </strong>
                      Total annual income from all sources must not exceed ₹{parseInt(scholarship.criteria.max_family_income, 10).toLocaleString('en-IN')}.
                    </span>
                  </li>
                )}

                {scholarship.criteria?.applicable_gender && scholarship.criteria.applicable_gender !== 'All' && (
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle size={18} color="var(--accent-emerald)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>
                      <strong>Gender Restriction: </strong>
                      Exclusively open for <strong>{scholarship.criteria.applicable_gender}</strong> applicants.
                    </span>
                  </li>
                )}

                {scholarship.criteria?.applicable_state && (
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle size={18} color="var(--accent-emerald)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>
                      <strong>Domicile / Location: </strong>
                      {scholarship.criteria.applicable_state === 'All India' ? 'Open to Indian citizens across all states and Union Territories.' : `Restricted to permanent residents of ${scholarship.criteria.applicable_state}.`}
                    </span>
                  </li>
                )}

                {scholarship.criteria?.additional_rules && (
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle size={18} color="var(--accent-emerald)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>
                      <strong>Special Guidelines: </strong>
                      {scholarship.criteria.additional_rules}
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* Section 3: Benefits & Financial Assistance */}
            {scholarship.benefits && (
              <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.28rem', color: 'var(--primary-800)', fontWeight: 700, marginBottom: '14px', borderBottom: '2px solid var(--primary-50)', paddingBottom: '8px' }}>
                  Scholarship Benefits & Grant Distribution
                </h2>
                <div style={{ fontSize: '0.95rem', color: 'var(--slate-700)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {scholarship.benefits}
                </div>
              </div>
            )}

            {/* Section 4: Required Documents Checklist */}
            <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.28rem', color: 'var(--primary-800)', fontWeight: 700, marginBottom: '14px', borderBottom: '2px solid var(--primary-50)', paddingBottom: '8px' }}>
                Required Documents Checklist
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                {[
                  'Aadhaar Card (Identity proof)',
                  'Class 10 & 12 Board Marksheets',
                  'Current College Admission Proof / Fee Receipt',
                  'Latest Competent Authority Income Certificate',
                  'Student Active Bank Account Passbook / Cancelled Cheque',
                  'Passport Sized Photograph'
                ].map((doc, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', fontSize: '0.88rem', color: 'var(--slate-700)' }}>
                    <FileText size={16} color="var(--primary-600)" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Historical Trends & Selection Archive (Pillar 3) */}
            <div className="card" style={{ padding: '28px', marginBottom: '24px', borderLeft: '4px solid var(--accent-orange)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <History size={22} color="var(--primary-700)" />
                  <h2 style={{ fontSize: '1.28rem', color: 'var(--primary-800)', fontWeight: 700, margin: 0 }}>
                    Previous Year Selection Trends & History
                  </h2>
                </div>
                {scholarship.status === 'closed' && (
                  <span className="badge badge-closed">
                    Past Cycle Concluded
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: 1.6, marginBottom: '20px' }}>
                {scholarship.history_summary || 'Historical statistics and cutoffs help students understand previous selection criteria, fund availability, and plan ahead.'}
              </p>

              {/* 4-Stat Historical Highlights Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '14px',
                marginBottom: '20px'
              }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                    🎯 Last Year Cutoff
                  </span>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--primary-800)' }}>
                    {scholarship.previous_year_cutoff || 'Eligible Candidates Selected'}
                  </strong>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                    👥 Previous Beneficiaries
                  </span>
                  <strong style={{ fontSize: '0.98rem', color: '#047857' }}>
                    {scholarship.total_beneficiaries_last_year ? scholarship.total_beneficiaries_last_year.toLocaleString('en-IN') + ' Scholars' : 'Thousands Benefited'}
                  </strong>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                    💰 Funds Disbursed (Last Cycle)
                  </span>
                  <strong style={{ fontSize: '0.98rem', color: '#c2410c' }}>
                    {scholarship.last_year_disbursed_amount || '₹10+ Crores'}
                  </strong>
                </div>

                <div style={{ backgroundColor: '#eff6ff', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe' }}>
                  <span style={{ fontSize: '0.74rem', color: '#1d4ed8', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                    📅 Expected Next Opening
                  </span>
                  <strong style={{ fontSize: '0.98rem', color: '#1e40af' }}>
                    {scholarship.expected_next_cycle || 'Annual Next Session'}
                  </strong>
                </div>
              </div>

              {/* Alert Callout Box */}
              <div style={{
                backgroundColor: '#eff6ff',
                border: '1.5px solid #bfdbfe',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#1e40af', margin: '0 0 4px 0' }}>
                    Want to apply as soon as the fresh cycle opens?
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: '#3b82f6', margin: 0 }}>
                    We track portal announcements daily and will alert you via email & SMS when applications go live.
                  </p>
                </div>
                <button
                  onClick={() => setNotifyModalOpen(true)}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '8px 18px',
                    fontSize: '0.86rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Bell size={15} /> Set Next Cycle Alert
                </button>
              </div>
            </div>

            {/* Section 5: Application Procedure */}
            {scholarship.application_procedure && (
              <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.28rem', color: 'var(--primary-800)', fontWeight: 700, marginBottom: '14px', borderBottom: '2px solid var(--primary-50)', paddingBottom: '8px' }}>
                  Step-by-Step Application Procedure
                </h2>
                <div style={{ fontSize: '0.95rem', color: 'var(--slate-700)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {scholarship.application_procedure}
                </div>
              </div>
            )}

            {/* Section 6: FAQs Accordion */}
            {scholarship.faqs && scholarship.faqs.length > 0 && (
              <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.28rem', color: 'var(--primary-800)', fontWeight: 700, marginBottom: '16px', borderBottom: '2px solid var(--primary-50)', paddingBottom: '8px' }}>
                  Frequently Asked Questions (FAQs)
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {scholarship.faqs.map((faq, index) => (
                    <div
                      key={index}
                      style={{
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--slate-200)',
                        overflow: 'hidden'
                      }}
                    >
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 18px',
                          backgroundColor: openFaqIndex === index ? 'var(--primary-50)' : 'var(--white)',
                          fontWeight: 600,
                          fontSize: '0.94rem',
                          color: 'var(--primary-800)',
                          textAlign: 'left'
                        }}
                      >
                        <span>{faq.question}</span>
                        <ChevronDown size={16} style={{ transform: openFaqIndex === index ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                      </button>
                      {openFaqIndex === index && (
                        <div style={{ padding: '14px 18px', backgroundColor: 'var(--white)', fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: 1.6, borderTop: '1px solid var(--slate-100)' }}>
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 7: Source Verification & Disclaimer */}
            <div style={{ backgroundColor: '#fffbeb', borderRadius: 'var(--radius-lg)', padding: '20px 24px', border: '1px solid #fde68a', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <ShieldCheck size={24} color="#d97706" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#92400e', marginBottom: '4px' }}>
                  Verified Official Source Information
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#78350f', lineHeight: 1.5, marginBottom: '8px' }}>
                  This program record has been cataloged for college educational and scholarly reference. Applications are handled according to institutional CSR criteria.
                </p>
                {scholarship.official_source_url && (
                  <a
                    href={scholarship.official_source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.84rem', fontWeight: 700, color: '#b45309', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    View Official Sponsor Scheme Guidelines <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Sidebar Widgets */}
          <div>
            
            {/* Action Box */}
            <div className="card" style={{ padding: '24px', marginBottom: '24px', position: 'sticky', top: '90px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '14px' }}>
                Application Window
              </h3>

              <div style={{ padding: '12px', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)', marginBottom: '16px', border: '1px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-700)', fontSize: '0.88rem', marginBottom: '6px' }}>
                  <Calendar size={16} color="var(--primary-600)" />
                  <span>Closing Date: <strong>{deadlineString}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-700)', fontSize: '0.88rem' }}>
                  <Clock size={16} color="var(--primary-600)" />
                  <span>Status: <strong style={{ color: scholarship.status === 'live' ? 'var(--accent-emerald)' : 'var(--accent-orange)' }}>{scholarship.status.toUpperCase()}</strong></span>
                </div>
              </div>

              {scholarship.status === 'closed' ? (
                <button
                  onClick={() => setNotifyModalOpen(true)}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '10px',
                    backgroundColor: '#2563eb',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Bell size={16} /> Notify Me for Next Cycle
                </button>
              ) : scholarship.status === 'upcoming' ? (
                <button
                  onClick={() => setNotifyModalOpen(true)}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '10px',
                    backgroundColor: '#0284c7',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Bell size={16} /> Get Alert When Open
                </button>
              ) : (
                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', marginBottom: '10px' }}
                >
                  Apply Online Now
                </button>
              )}

              <button
                onClick={handleToggleSave}
                className="btn btn-outline"
                style={{ width: '100%', padding: '10px' }}
              >
                <Heart size={16} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : 'var(--slate-600)'} />
                {isSaved ? 'Bookmarked in Favorites' : 'Save for Later'}
              </button>

              <div style={{ borderTop: '1px solid var(--slate-200)', marginTop: '20px', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '10px' }}>
                  Need Guidance?
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', lineHeight: 1.5, marginBottom: '12px' }}>
                  Have questions regarding income certificates, caste affidavits, or marks calculation?
                </p>
                <Link to="/qna" style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--primary-600)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Ask on Community Q&A →
                </Link>
              </div>
            </div>

            {/* Related Scholarships */}
            {scholarship.related && scholarship.related.length > 0 && (
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '14px' }}>
                  Similar Scholarships
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {scholarship.related.map((rel) => (
                    <Link
                      key={rel.id}
                      to={`/scholarships/${rel.slug || rel.id}`}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--slate-50)',
                        border: '1px solid var(--slate-200)',
                        display: 'block',
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-300)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--slate-200)'}
                    >
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '4px', lineHeight: 1.3 }}>
                        {rel.title}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--accent-orange)', fontWeight: 600 }}>
                        {rel.award_amount}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Application Modal */}
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        scholarship={scholarship}
      />

      {/* Cycle Alert Notification Modal */}
      <NotifyModal
        isOpen={notifyModalOpen}
        onClose={() => setNotifyModalOpen(false)}
        scholarship={scholarship}
      />

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 900px) {
          .detail-hero-grid, .detail-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
