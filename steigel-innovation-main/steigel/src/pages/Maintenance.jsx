import React from 'react';
import { Settings, Mail, Phone } from 'lucide-react';
import SEO from '../components/SEO';

export const Maintenance = () => {
  return (
    <>
      <SEO 
        title="Under Scheduled Maintenance"
        description="Our platform is currently undergoing a scheduled system upgrade. We will return online shortly."
        robots="noindex, nofollow"
      />

      <section className="section-padding" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="glass-card" style={{ padding: '3.5rem 2.5rem', borderColor: 'var(--accent)' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: 'rgba(212, 175, 106, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
              margin: '0 auto 1.5rem',
              animation: 'spin 4s linear infinite'
            }}>
              <Settings size={28} />
            </div>

            <h1 className="text-gradient-gold" style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
              Scheduled Maintenance
            </h1>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
              We are currently executing critical software and server node upgrades to optimize our core web vitals. The platform will return online within a few hours.
            </p>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Need urgent consulting assistance? Direct channels remain active:
            </p>

            {/* Offline Coordinates */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <a href="mailto:STPCA2024@GMAIL.COM" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem' }}>
                <Mail size={16} color="var(--accent)" /> STPCA2024@GMAIL.COM
              </a>
              <a href="tel:+919449446793" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem' }}>
                <Phone size={16} color="var(--accent)" /> +91 94494 46793
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};
export default Maintenance;
