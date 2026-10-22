import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, User, Calendar, ArrowLeft, Share2, CheckCircle, BookOpen } from 'lucide-react';
import { api } from '../services/api';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    api.content.getArticleDetail(slug)
      .then((res) => {
        if (res.success) setArticle(res.data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--slate-500)' }}>Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Article Not Found</h2>
        <Link to="/articles" className="btn btn-navy" style={{ marginTop: '16px' }}>
          Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '40px 0 80px 0' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        
        {/* Back link */}
        <Link to="/articles" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem', color: 'var(--primary-700)', fontWeight: 600, marginBottom: '20px' }}>
          <ArrowLeft size={16} /> All Articles
        </Link>

        {/* Article Header Card */}
        <div className="card" style={{ padding: '36px', border: '1.5px solid var(--slate-200)', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span className="badge badge-category">{article.category}</span>
            <span style={{ fontSize: '0.84rem', color: 'var(--slate-500)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} /> {article.read_time}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', fontWeight: 800, color: 'var(--primary-800)', lineHeight: 1.25, marginBottom: '16px' }}>
            {article.title}
          </h1>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--slate-100)', paddingTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {article.author.charAt(0)}
              </div>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-800)', display: 'block' }}>{article.author}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>EduScholar Editorial</span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              {copied ? <CheckCircle size={15} color="#059669" /> : <Share2 size={15} />}
              {copied ? 'Link Copied' : 'Share Article'}
            </button>
          </div>
        </div>

        {/* Feature Image */}
        {article.image_url && (
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '30px', boxShadow: 'var(--shadow-md)' }}>
            <img src={article.image_url} alt={article.title} style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }} />
          </div>
        )}

        {/* Article Body Content */}
        <div className="card" style={{ padding: '36px', border: '1.5px solid var(--slate-200)', lineHeight: 1.8, fontSize: '1.02rem', color: 'var(--slate-700)', marginBottom: '40px' }}>
          <div style={{ whiteSpace: 'pre-line' }}>
            {article.content}
          </div>
        </div>

        {/* Related Articles */}
        {article.related && article.related.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-800)', marginBottom: '18px' }}>
              Related Guides
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
              {article.related.map((rel) => (
                <Link key={rel.id} to={`/articles/${rel.slug}`} className="card card-hover" style={{ padding: '18px', border: '1px solid var(--slate-200)' }}>
                  <span className="badge badge-category" style={{ fontSize: '0.72rem', marginBottom: '8px' }}>{rel.category}</span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-800)', lineHeight: 1.35 }}>
                    {rel.title}
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '8px', display: 'block' }}>
                    {rel.read_time}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
