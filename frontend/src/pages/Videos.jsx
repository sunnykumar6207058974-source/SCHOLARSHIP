import React, { useState, useEffect } from 'react';
import { Video, Play, Clock, Eye, X } from 'lucide-react';
import { api } from '../services/api';

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    api.content.getVideos()
      .then((res) => {
        if (res.success) setVideos(res.data);
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '40px 0 80px 0', minHeight: '85vh' }}>
      <div className="container">
        
        <div style={{ maxWidth: '720px', marginBottom: '36px' }}>
          <span style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Video Tutorials & Masterclasses
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-800)', marginTop: '4px' }}>
            Scholarship Application Video Guides
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.98rem', marginTop: '6px' }}>
            Watch detailed step-by-step walkthroughs on portal registration, document formatting, and interview preparation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '26px' }}>
          {videos.map((vid, idx) => (
            <div
              key={idx}
              className="card card-hover"
              onClick={() => setActiveVideo(vid)}
              style={{ cursor: 'pointer', overflow: 'hidden', border: '1.5px solid var(--slate-200)' }}
            >
              <div style={{ position: 'relative', height: '200px', backgroundColor: '#000' }}>
                <img src={vid.thumbnail} alt={vid.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(249, 115, 22, 0.9)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
                  }}>
                    <Play size={22} fill="#fff" />
                  </div>
                </div>
                <span style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '12px',
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {vid.duration}
                </span>
              </div>

              <div style={{ padding: '20px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                  {vid.channel} • {vid.views}
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-800)', marginTop: '4px', lineHeight: 1.35 }}>
                  {vid.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--white)', width: '100%', maxWidth: '720px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ padding: '16px 20px', backgroundColor: 'var(--primary-800)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{activeVideo.title}</h4>
              <button onClick={() => setActiveVideo(null)} style={{ color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, backgroundColor: '#000' }}>
              <iframe
                title={activeVideo.title}
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
