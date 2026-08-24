import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Search } from 'lucide-react';
import SEO from '../components/SEO';

export const NotFound = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/blogs?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <>
      <SEO 
        title="Page Not Found"
        description="The page you are looking for does not exist or has been moved."
        robots="noindex, nofollow"
      />

      <section className="section-padding" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="glass-card" style={{ padding: '3.5rem 2.5rem', borderColor: 'rgba(255, 90, 90, 0.2)' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: 'rgba(255, 90, 90, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FF5A5A',
              margin: '0 auto 1.5rem'
            }}>
              <ShieldAlert size={28} />
            </div>

            <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
              Page Not Found
            </h1>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
              The coordinate you requested does not map to an active page. It might have been relocated, or temporary server updates might be active.
            </p>

            {/* Quick Helper Search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
              <input
                type="text"
                className="form-input"
                style={{ flexGrow: 1 }}
                placeholder="Search resources..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search resources"
              />
              <button type="submit" className="btn btn-secondary" style={{ padding: '0.75rem 1.25rem' }}>
                <Search size={16} />
              </button>
            </form>

            {/* Navigational Links */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowLeft size={16} /> Return to Home
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Contact Desk
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default NotFound;
