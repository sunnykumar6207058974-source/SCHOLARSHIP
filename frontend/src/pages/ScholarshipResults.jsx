import React, { useState, useEffect } from 'react';
import { Award, Search, Download, Calendar, Users, CheckCircle, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

export default function ScholarshipResults() {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.content.getResults()
      .then((res) => {
        if (res.success) setResults(res.data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = results.filter((r) =>
    r.scholarshipTitle.toLowerCase().includes(search.toLowerCase()) ||
    r.batch.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '40px 0 80px 0', minHeight: '85vh' }}>
      <div className="container">
        
        <div style={{ maxWidth: '720px', marginBottom: '32px' }}>
          <span style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Official Selection Lists
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-800)', marginTop: '4px' }}>
            Latest Scholarship Results & Awardees
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.98rem', marginTop: '6px' }}>
            Check officially sanctioned merit lists and download selection notices for national and corporate programs.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '480px', marginBottom: '28px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by scholarship title or batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
          <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* Results List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filtered.map((item, idx) => (
            <div key={idx} className="card card-hover" style={{ padding: '28px', border: '1.5px solid var(--slate-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-live">
                      <CheckCircle size={12} /> Results Announced
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                      Announced: {new Date(item.announcementDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-800)', marginBottom: '4px' }}>
                    {item.scholarshipTitle}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: 'var(--primary-700)', fontWeight: 600, marginBottom: '10px' }}>
                    Batch: {item.batch}
                  </p>

                  <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', maxWidth: '640px', lineHeight: 1.5 }}>
                    {item.summary}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                    Total Sanctioned Awardees
                  </span>
                  <strong style={{ fontSize: '1.4rem', color: 'var(--accent-orange)' }}>
                    {item.totalAwardees.toLocaleString('en-IN')} Scholars
                  </strong>

                  <div style={{ marginTop: '14px' }}>
                    <button
                      onClick={() => alert(`Downloading verified official merit list PDF for: ${item.scholarshipTitle}`)}
                      className="btn btn-navy btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Download size={14} /> Download Merit List (PDF)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
