import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, ArrowRight, Clock, User, Calendar } from 'lucide-react';
import { api } from '../services/api';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Scholarship Guide', 'Application Tips', 'Career Advice', 'Exams'];

  useEffect(() => {
    setLoading(true);
    api.content.getArticles({ category: category === 'All' ? '' : category, search })
      .then((res) => {
        if (res.success) setArticles(res.data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '40px 0 80px 0', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ maxWidth: '720px', marginBottom: '36px' }}>
          <span style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            EduScholar Editorial & Knowledge Center
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-800)', marginTop: '4px' }}>
            Scholarship Articles & Guides
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1rem', marginTop: '6px' }}>
            Expert advice on National Scholarship Portal (NSP), essay writing, scholarship interviews, and financial aid strategies.
          </p>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  backgroundColor: category === c ? 'var(--primary-700)' : 'var(--white)',
                  color: category === c ? 'var(--white)' : 'var(--slate-600)',
                  border: category === c ? '1.5px solid var(--primary-700)' : '1px solid var(--slate-300)',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', fontSize: '0.88rem' }}
            />
            <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '26px' }}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ height: '340px', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)', animation: 'pulse 1.2s infinite' }} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <p style={{ color: 'var(--slate-500)', fontSize: '1rem' }}>No articles match your search criteria.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '26px' }}>
            {articles.map((art) => (
              <div key={art.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                {art.image_url && (
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img src={art.image_url} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                    <span className="badge badge-category">{art.category}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} /> {art.read_time}
                    </span>
                  </div>

                  <Link to={`/articles/${art.slug}`}>
                    <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '10px', lineHeight: 1.35 }}>
                      {art.title}
                    </h3>
                  </Link>

                  <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: 1.6, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {art.content.replace(/[#*`>]/g, '').slice(0, 160)}...
                  </p>

                  <div style={{ borderTop: '1px solid var(--slate-100)', marginTop: '18px', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>By {art.author}</span>
                    <Link to={`/articles/${art.slug}`} style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--primary-600)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Read More <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
