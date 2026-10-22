import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Award, ExternalLink, BookOpen } from 'lucide-react';
import { api } from '../services/api';

export default function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      api.scholarships.getAll({ search: searchTerm, limit: 5 })
        .then((res) => {
          if (res.success) {
            setResults(res.data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '80px',
        paddingLeft: '20px',
        paddingRight: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--white)',
          width: '100%',
          maxWidth: '640px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          border: '1px solid var(--slate-200)',
          animation: 'fadeInDown 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--slate-200)', gap: '12px' }}>
          <Search size={22} color="var(--primary-600)" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by scholarship title, provider (e.g. Tata, Reliance), course..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1.05rem',
              fontWeight: 500,
              color: 'var(--slate-800)'
            }}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={{ color: 'var(--slate-400)' }}>
              <X size={18} />
            </button>
          )}
          <button onClick={onClose} style={{ color: 'var(--slate-500)', fontSize: '0.82rem', padding: '4px 8px', borderRadius: '4px', backgroundColor: 'var(--slate-100)' }}>
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '12px 0' }}>
          {loading && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.9rem' }}>
              Searching active scholarships database...
            </div>
          )}

          {!loading && searchTerm.trim() && results.length === 0 && (
            <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--slate-500)' }}>
              <p style={{ fontWeight: 600, color: 'var(--slate-700)', marginBottom: '4px' }}>No scholarships found for "{searchTerm}"</p>
              <p style={{ fontSize: '0.85rem' }}>Try searching with broader terms like "Engineering", "Medical", or "Merit".</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div>
              <div style={{ padding: '6px 20px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase' }}>
                Scholarships ({results.length})
              </div>
              {results.map((sch) => (
                <div
                  key={sch.id}
                  onClick={() => {
                    navigate(`/scholarships/${sch.slug || sch.id}`);
                    onClose();
                  }}
                  style={{
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                    borderBottom: '1px solid var(--slate-100)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-50)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      <Award size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.92rem', color: 'var(--primary-800)', fontWeight: 600 }}>{sch.title}</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                        {sch.provider_name} • <strong style={{ color: 'var(--accent-orange)' }}>{sch.award_amount}</strong>
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-category" style={{ fontSize: '0.7rem' }}>
                    {sch.scholarship_type}
                  </span>
                </div>
              ))}
            </div>
          )}

          {!searchTerm.trim() && (
            <div style={{ padding: '20px', color: 'var(--slate-500)', fontSize: '0.88rem' }}>
              <p style={{ fontWeight: 600, color: 'var(--slate-700)', marginBottom: '10px' }}>Popular Searches:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Tata Trust', 'Reliance Foundation', 'Girls Only', 'Medical MBBS', 'Engineering STEM', 'Government NSP'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--slate-100)',
                      fontSize: '0.82rem',
                      color: 'var(--slate-700)',
                      border: '1px solid var(--slate-200)',
                      cursor: 'pointer'
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '12px 20px', backgroundColor: 'var(--slate-50)', borderTop: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
          <span>Search verified scholarships instantly</span>
          <button
            onClick={() => {
              navigate(`/scholarships?search=${encodeURIComponent(searchTerm)}`);
              onClose();
            }}
            style={{ color: 'var(--primary-700)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            View all results →
          </button>
        </div>
      </div>
    </div>
  );
}
