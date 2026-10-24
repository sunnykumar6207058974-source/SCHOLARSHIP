import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  IndianRupee,
  GraduationCap,
  Heart,
  Share2,
  CheckCircle,
  ExternalLink,
  Award,
  ArrowRight,
  Clock,
  Bell,
  Landmark,
  Building2,
  History
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function ScholarshipCard({ scholarship, onApply, onSaveToggle, onNotify }) {
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(scholarship.is_saved || false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please log in or register to save scholarships to your favorites.');
      return;
    }

    try {
      setSaving(true);
      const res = await api.profile.toggleSave(scholarship.id);
      setIsSaved(res.saved);
      if (onSaveToggle) onSaveToggle(scholarship.id, res.saved);
    } catch (err) {
      console.error('Error toggling save', err);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/scholarships/${scholarship.slug || scholarship.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate days left
  let daysLeft = null;
  let deadlineText = 'Always Open';
  if (scholarship.deadline && !scholarship.is_always_open) {
    const deadlineDate = new Date(scholarship.deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    deadlineText = deadlineDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return (
    <div
      className="card card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--white)',
        border: '1.5px solid var(--slate-200)',
        position: 'relative'
      }}
    >
      {/* Top Banner & Status Tags */}
      <div style={{ padding: '18px 20px 14px 20px', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Provider Logo Avatar */}
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-50)',
            border: '1px solid var(--primary-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-700)',
            fontWeight: 800,
            fontSize: '1rem',
            flexShrink: 0
          }}>
            {scholarship.provider_logo ? (
              <img src={scholarship.provider_logo} alt={scholarship.provider_name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              scholarship.provider_name ? scholarship.provider_name.charAt(0) : 'S'
            )}
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block' }}>
              {scholarship.provider_name}
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '4px' }}>
              <span className={`badge ${scholarship.status === 'live' ? 'badge-live' : scholarship.status === 'upcoming' ? 'badge-upcoming' : 'badge-closed'}`}>
                {scholarship.status === 'live' ? '● Live Now' : scholarship.status === 'upcoming' ? '⏳ Upcoming' : '📜 Past Cycle Closed'}
              </span>
              {scholarship.scheme_authority_type === 'State Government' ? (
                <span className="badge" style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '0.72rem' }}>
                  🏛️ {scholarship.state_domicile && scholarship.state_domicile !== 'All India' ? scholarship.state_domicile : 'State Govt'}
                </span>
              ) : scholarship.scheme_authority_type === 'Corporate / CSR' ? (
                <span className="badge" style={{ backgroundColor: '#faf5ff', color: '#7e22ce', border: '1px solid #e9d5ff', fontSize: '0.72rem' }}>
                  🏢 CSR Grant
                </span>
              ) : (
                <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontSize: '0.72rem' }}>
                  🇮🇳 Central Scheme
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Favorite & Share buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={handleShare}
            title={copied ? 'Link Copied!' : 'Share Scholarship'}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: copied ? '#ecfdf5' : 'var(--slate-50)',
              color: copied ? '#059669' : 'var(--slate-400)',
              border: '1px solid var(--slate-200)',
              transition: 'all 0.2s'
            }}
          >
            {copied ? <CheckCircle size={15} /> : <Share2 size={15} />}
          </button>

          <button
            onClick={handleToggleSave}
            disabled={saving}
            title={isSaved ? 'Remove from Saved' : 'Save to Favorites'}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isSaved ? '#fef2f2' : 'var(--slate-50)',
              color: isSaved ? '#ef4444' : 'var(--slate-400)',
              border: '1px solid var(--slate-200)',
              transition: 'all 0.2s'
            }}
          >
            <Heart size={16} fill={isSaved ? '#ef4444' : 'none'} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Title */}
        <Link to={`/scholarships/${scholarship.slug || scholarship.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--primary-800)',
            marginBottom: '10px',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {scholarship.title}
          </h3>
        </Link>

        {/* Award Highlight */}
        <div style={{
          backgroundColor: '#fff7ed',
          border: '1px solid #fed7aa',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px'
        }}>
          <Award size={18} color="#ea580c" />
          <div>
            <span style={{ fontSize: '0.72rem', color: '#9a3412', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>
              Scholarship Award
            </span>
            <strong style={{ fontSize: '0.96rem', color: '#c2410c', fontWeight: 800 }}>
              {scholarship.award_amount}
            </strong>
          </div>
        </div>

        {/* Historical Past Data Box (for closed or historical scholarships) */}
        {(scholarship.status === 'closed' || scholarship.previous_year_cutoff) && (
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-md)',
            padding: '8px 10px',
            marginBottom: '12px',
            fontSize: '0.76rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-600)', marginBottom: '3px' }}>
              <span>🎯 Last Year Cutoff:</span>
              <strong style={{ color: 'var(--primary-800)' }}>{scholarship.previous_year_cutoff || 'Eligible applicants selected'}</strong>
            </div>
            {scholarship.total_beneficiaries_last_year > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-600)', marginBottom: '3px' }}>
                <span>👥 Previous Beneficiaries:</span>
                <strong style={{ color: '#047857' }}>{scholarship.total_beneficiaries_last_year.toLocaleString('en-IN')} Scholars</strong>
              </div>
            )}
            {scholarship.expected_next_cycle && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-600)' }}>
                <span>📅 Next Cycle Expected:</span>
                <strong style={{ color: '#2563eb' }}>{scholarship.expected_next_cycle}</strong>
              </div>
            )}
          </div>
        )}

        {/* Eligibility Snippet */}
        <div style={{ fontSize: '0.84rem', color: 'var(--slate-600)', marginBottom: '12px', flex: 1 }}>
          <p style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {scholarship.brief_description}
          </p>
        </div>

        {/* Quick Criteria Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px', fontSize: '0.78rem' }}>
          <span style={{ backgroundColor: 'var(--slate-100)', color: 'var(--slate-700)', padding: '3px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <GraduationCap size={13} /> {scholarship.education_level || 'Open for All'}
          </span>
          {scholarship.state_domicile && scholarship.state_domicile !== 'All India' && (
            <span style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
              📍 {scholarship.state_domicile}
            </span>
          )}
          {scholarship.min_marks_percentage > 0 && (
            <span style={{ backgroundColor: 'var(--slate-100)', color: 'var(--slate-700)', padding: '3px 8px', borderRadius: '4px' }}>
              Min {scholarship.min_marks_percentage}% Marks
            </span>
          )}
          {scholarship.applicable_gender && scholarship.applicable_gender !== 'All' && (
            <span style={{ backgroundColor: '#fdf2f8', color: '#be185d', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
              {scholarship.applicable_gender} Only
            </span>
          )}
        </div>

        {/* Deadline Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: scholarship.status === 'closed' ? 'var(--slate-500)' : daysLeft !== null && daysLeft <= 10 ? 'var(--accent-rose)' : 'var(--slate-500)',
          fontWeight: 600,
          borderTop: '1px dashed var(--slate-200)',
          paddingTop: '10px',
          marginBottom: '14px'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Calendar size={14} /> {scholarship.status === 'closed' ? `Past Cycle Ended: ${deadlineText}` : `Deadline: ${deadlineText}`}
          </span>
          {scholarship.status === 'live' && daysLeft !== null && (
            <span style={{
              backgroundColor: daysLeft <= 7 ? '#fee2e2' : '#f1f5f9',
              color: daysLeft <= 7 ? '#b91c1c' : 'var(--slate-700)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Clock size={12} />
              {daysLeft > 0 ? `${daysLeft} days left` : 'Ends today!'}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <Link
            to={`/scholarships/${scholarship.slug || scholarship.id}`}
            className="btn btn-outline btn-sm"
            style={{ width: '100%', fontSize: '0.84rem' }}
          >
            {scholarship.status === 'closed' ? 'Past Records' : 'View Details'}
          </Link>
          
          {scholarship.status === 'closed' ? (
            <button
              onClick={() => onNotify && onNotify(scholarship)}
              className="btn btn-sm"
              style={{
                width: '100%',
                fontSize: '0.84rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}
            >
              <Bell size={14} /> Notify Me
            </button>
          ) : scholarship.status === 'upcoming' ? (
            <button
              onClick={() => onNotify && onNotify(scholarship)}
              className="btn btn-sm"
              style={{
                width: '100%',
                fontSize: '0.84rem',
                backgroundColor: '#0284c7',
                color: 'white',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}
            >
              <Bell size={14} /> Get Alert
            </button>
          ) : (
            <button
              onClick={() => onApply && onApply(scholarship)}
              className="btn btn-primary btn-sm"
              style={{ width: '100%', fontSize: '0.84rem' }}
            >
              Apply Now <ArrowRight size={14} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
