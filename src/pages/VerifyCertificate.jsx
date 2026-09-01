import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { getSystemData } from '../lib/systemStore';
import logo from '../assets/logo.webp';

export const VerifyCertificate = () => {
  const { token } = useParams();
  const data = getSystemData();

  // Find certificate by token
  const certificate = data.certificates.find(c => c.token === token);

  return (
    <div className="dashboard-theme" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* Mini public header for verification */}
      <header style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border-color)', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Website
        </Link>
        <img src={logo} alt="Steigel Logo" style={{ height: '35px', width: 'auto' }} />
      </header>

      <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        {certificate ? (
          <div className="dash-card" style={{ maxWidth: '650px', width: '100%', padding: '2.5rem', gap: '1.5rem', textAlign: 'center', alignItems: 'center', borderColor: 'var(--success)' }}>
            <div style={{ color: 'var(--success)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={56} />
              <span className="status-badge active" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>Verified Credential</span>
            </div>

            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Steigel Innovations Hub</h1>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Certificate of Internship Verification</p>
            </div>

            <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Recipient Name:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{certificate.internName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Internship Title:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{certificate.title}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Duration:</span>
                <span style={{ color: 'var(--text-primary)' }}>{certificate.startDate} to {certificate.endDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Date of Issue:</span>
                <span style={{ color: 'var(--text-primary)' }}>{certificate.issueDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Certificate ID:</span>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontWeight: 600 }}>{certificate.id}</span>
              </div>
            </div>

            {/* QR Code and Cryptographic Hash */}
            <div style={{ display: 'flex', gap: '1.5rem', width: '100%', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              {/* Simulated QR Code SVG */}
              <div style={{ width: '100px', height: '100px', padding: '6px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                  <rect x="0" y="0" width="25" height="25" fill="#2A3036" />
                  <rect x="5" y="5" width="15" height="15" fill="#FFFFFF" />
                  <rect x="8" y="8" width="9" height="9" fill="#2A3036" />
                  
                  <rect x="75" y="0" width="25" height="25" fill="#2A3036" />
                  <rect x="80" y="5" width="15" height="15" fill="#FFFFFF" />
                  <rect x="83" y="8" width="9" height="9" fill="#2A3036" />
                  
                  <rect x="0" y="75" width="25" height="25" fill="#2A3036" />
                  <rect x="5" y="80" width="15" height="15" fill="#FFFFFF" />
                  <rect x="8" y="83" width="9" height="9" fill="#2A3036" />
                  
                  <rect x="40" y="40" width="20" height="20" fill="#2A3036" />
                  <rect x="45" y="45" width="10" height="10" fill="#FFFFFF" />
                  
                  <rect x="75" y="75" width="10" height="10" fill="#2A3036" />
                  <rect x="90" y="90" width="10" height="10" fill="#2A3036" />
                  <rect x="35" y="15" width="10" height="15" fill="#2A3036" />
                  <rect x="15" y="45" width="15" height="10" fill="#2A3036" />
                  <rect x="55" y="75" width="10" height="15" fill="#2A3036" />
                  <rect x="75" y="40" width="15" height="10" fill="#2A3036" />
                </svg>
              </div>

              <div style={{ flexGrow: 1, textAlign: 'left', minWidth: '200px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cryptographic Hash</div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', wordBreak: 'break-all', backgroundColor: 'var(--bg-primary)', padding: '0.5rem', borderRadius: '6px', marginTop: '0.25rem', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  {certificate.hash}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Securely generated via Steigel Ledger Protocol.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="dash-card" style={{ maxWidth: '450px', width: '100%', padding: '2.5rem', gap: '1.5rem', textAlign: 'center', alignItems: 'center' }}>
            <div style={{ color: 'var(--error)' }}><AlertTriangle size={56} /></div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Invalid Token</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              The certificate verification link you followed is invalid, or the credential token has been revoked by the Steigel Innovations Hub administration.
            </p>
            <Link to="/" className="dash-btn dash-btn-primary" style={{ width: '100%' }}>
              Return to Homepage
            </Link>
          </div>
        )}
      </div>
      
      <footer style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', backgroundColor: '#FFFFFF', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        © 2026 Steigel Innovations Hub. All rights reserved.
      </footer>
    </div>
  );
};

export default VerifyCertificate;
