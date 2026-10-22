import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Send, CheckCircle, Shield, Heart } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 5000);
    }
  };

  return (
    <footer style={{ backgroundColor: 'var(--primary-900)', color: '#94a3b8', paddingTop: '60px', paddingBottom: '30px', marginTop: '60px', borderTop: '4px solid var(--accent-orange)' }}>
      <div className="container">
        
        {/* Top Newsletter & Mission Bar */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-lg)',
          padding: '30px',
          marginBottom: '50px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <GraduationCap size={28} color="var(--accent-orange)" />
              <h3 style={{ color: 'var(--white)', fontSize: '1.35rem', fontWeight: 800 }}>Never Miss a Scholarship Deadline</h3>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>
              Join 1,00,000+ students receiving weekly curated scholarship alerts, eligibility guidance, and direct application notifications.
            </p>
          </div>

          <div>
            {subscribed ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 600, padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)' }}>
                <CheckCircle size={20} />
                <span>Thank you! You are now subscribed to verified scholarship alerts.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '10px', maxWidth: '480px' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your student email..."
                  required
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: 'var(--white)',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '12px 20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Send size={16} /> Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4-Column Directory Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '36px', marginBottom: '45px' }}>
          
          {/* Col 1: Class-wise */}
          <div>
            <h4 style={{ color: 'var(--white)', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '18px', borderLeft: '3px solid var(--accent-orange)', paddingLeft: '8px' }}>
              Scholarships by Class
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li><Link to="/scholarships?education_level=Class 1-10" style={{ color: '#cbd5e1' }}>Class 1 to 10 (Pre-Matric)</Link></li>
              <li><Link to="/scholarships?education_level=Class 11-12" style={{ color: '#cbd5e1' }}>Class 11 & 12 (Post-Matric)</Link></li>
              <li><Link to="/scholarships?education_level=Graduation" style={{ color: '#cbd5e1' }}>Undergraduate / Graduation</Link></li>
              <li><Link to="/scholarships?education_level=Post-Graduation" style={{ color: '#cbd5e1' }}>Post-Graduation & Masters</Link></li>
              <li><Link to="/scholarships?education_level=Diploma" style={{ color: '#cbd5e1' }}>Polytechnic & Diploma</Link></li>
              <li><Link to="/scholarships?education_level=PhD" style={{ color: '#cbd5e1' }}>PhD & Doctoral Fellowships</Link></li>
            </ul>
          </div>

          {/* Col 2: Type-based */}
          <div>
            <h4 style={{ color: 'var(--white)', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '18px', borderLeft: '3px solid var(--accent-orange)', paddingLeft: '8px' }}>
              Top Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li><Link to="/scholarships?gender=Female" style={{ color: '#cbd5e1' }}>Top Scholarships for Girls</Link></li>
              <li><Link to="/scholarships?category=merit-cum-means" style={{ color: '#cbd5e1' }}>Merit-cum-Means Based</Link></li>
              <li><Link to="/scholarships?category=engineering-stem" style={{ color: '#cbd5e1' }}>Engineering / B.Tech Grants</Link></li>
              <li><Link to="/scholarships?category=medical-healthcare" style={{ color: '#cbd5e1' }}>Medical & MBBS Grants</Link></li>
              <li><Link to="/scholarships?category=minority-inclusion" style={{ color: '#cbd5e1' }}>Minority Community Schemes</Link></li>
              <li><Link to="/scholarships?scholarship_type=Government" style={{ color: '#cbd5e1' }}>NSP Government Schemes</Link></li>
              <li><Link to="/scholarships?category=study-abroad" style={{ color: '#cbd5e1' }}>Study Abroad Fellowships</Link></li>
            </ul>
          </div>

          {/* Col 3: State-wise */}
          <div>
            <h4 style={{ color: 'var(--white)', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '18px', borderLeft: '3px solid var(--accent-orange)', paddingLeft: '8px' }}>
              State Domicile Schemes
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li><Link to="/scholarships?state=Uttar Pradesh" style={{ color: '#cbd5e1' }}>Uttar Pradesh Scholarships</Link></li>
              <li><Link to="/scholarships?state=Maharashtra" style={{ color: '#cbd5e1' }}>Maharashtra Scholarships</Link></li>
              <li><Link to="/scholarships?state=Bihar" style={{ color: '#cbd5e1' }}>Bihar State Schemes</Link></li>
              <li><Link to="/scholarships?state=Karnataka" style={{ color: '#cbd5e1' }}>Karnataka Scholarships</Link></li>
              <li><Link to="/scholarships?state=Gujarat" style={{ color: '#cbd5e1' }}>Gujarat State Schemes</Link></li>
              <li><Link to="/scholarships?state=Tamil Nadu" style={{ color: '#cbd5e1' }}>Tamil Nadu Scholarships</Link></li>
              <li><Link to="/scholarships?state=West Bengal" style={{ color: '#cbd5e1' }}>West Bengal Scholarships</Link></li>
            </ul>
          </div>

          {/* Col 4: Quick links & Contact */}
          <div>
            <h4 style={{ color: 'var(--white)', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '18px', borderLeft: '3px solid var(--accent-orange)', paddingLeft: '8px' }}>
              Student Services & Help
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', marginBottom: '20px' }}>
              <li><Link to="/eligibility-checker" style={{ color: '#cbd5e1' }}>Rule-Based Eligibility Checker</Link></li>
              <li><Link to="/results" style={{ color: '#cbd5e1' }}>Latest Selection Results</Link></li>
              <li><Link to="/articles" style={{ color: '#cbd5e1' }}>NSP & Scholarship Articles</Link></li>
              <li><Link to="/videos" style={{ color: '#cbd5e1' }}>Application Video Guides</Link></li>
              <li><Link to="/qna" style={{ color: '#cbd5e1' }}>Student Discussion Forum (Q&A)</Link></li>
              <li><Link to="/contact" style={{ color: '#cbd5e1' }}>Contact Student Desk</Link></li>
            </ul>

            <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <MapPin size={15} color="var(--accent-orange)" />
                <span>EduScholar Academic Center, Technology Park, Pune – 411014</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar & Disclaimer */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '25px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          fontSize: '0.82rem',
          color: '#64748b'
        }}>
          <p style={{ lineHeight: 1.6 }}>
            <strong style={{ color: '#94a3b8' }}>Educational Project Disclaimer:</strong> EduScholar is an original college project platform built for scholarly discovery and educational facilitation. All scholarship provider trademarks, including Tata Trusts, Reliance Foundation, and AICTE, are acknowledged as property of their respective legal entities. Links point to public information sources.
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              © 2026 <strong>EduScholar Platform</strong>. All Rights Reserved. Made for Indian Students.
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link to="/contact" style={{ color: '#94a3b8' }}>Privacy Policy</Link>
              <Link to="/contact" style={{ color: '#94a3b8' }}>Terms & Conditions</Link>
              <Link to="/contact" style={{ color: '#94a3b8' }}>Disclaimer</Link>
              <Link to="/contact" style={{ color: '#94a3b8' }}>Sitemap</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
