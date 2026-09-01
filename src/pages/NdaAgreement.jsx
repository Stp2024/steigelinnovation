import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, getSystemData, updateSystemData, setSession, logAudit } from '../lib/systemStore';
import logo from '../assets/logo.webp';
import '../components/auth.css';

export const NdaAgreement = () => {
  const navigate = useNavigate();
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState(null);
  const textContainerRef = useRef(null);

  useEffect(() => {
    const activeSession = getSession();
    if (!activeSession) {
      navigate('/user-login');
      return;
    }
    setUser(activeSession);
  }, [navigate]);

  const handleScroll = () => {
    const el = textContainerRef.current;
    if (!el) return;
    
    // Check if scrolled near the bottom (with a 10px tolerance)
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 10;
    if (isAtBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAccept = () => {
    if (!checked || !user) return;

    const data = getSystemData();
    const updatedUsers = data.users.map(u => {
      if (u.id === user.id) {
        return { ...u, ndaAccepted: true };
      }
      return u;
    });

    data.users = updatedUsers;
    updateSystemData(data);

    // Update active session memory
    const updatedSession = { ...user, ndaAccepted: true };
    setSession(updatedSession);

    // Audit Log
    logAudit('NDA_ACCEPTED', updatedSession.name, updatedSession.id, 'NDA Signature Agreement');

    // Route redirects
    if (updatedSession.role === 'mentor') {
      navigate('/mentor-dashboard');
    } else {
      navigate('/user-dashboard');
    }
  };

  return (
    <div className="dashboard-theme auth-root">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <div className="auth-logo">
          <img src={logo} alt="Steigel Logo" />
        </div>

        <h1 className="auth-title" style={{ fontSize: '1.25rem' }}>Nondisclosure & Proprietary Rights Agreement</h1>
        <p className="auth-subtitle">Please read this agreement in full. Scroll to the bottom to confirm acceptance.</p>

        {/* NDA Scrollable Terms Container */}
        <div 
          className="nda-content-box" 
          ref={textContainerRef}
          onScroll={handleScroll}
          style={{ marginBottom: '1.5rem' }}
        >
          <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>1. Confidential Information</p>
          <p style={{ marginBottom: '1rem' }}>
            During the course of your engagement or internship with Steigel Innovations Hub, you will have access to sensitive materials, proprietary source code, software architecture nodes, client coordinates, and developmental products. You agree to treat all such information as strictly confidential.
          </p>
          
          <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>2. Intellectual Property</p>
          <p style={{ marginBottom: '1rem' }}>
            All tools, scripts, software frameworks, websites, sitemaps, data transformation models, and written reports produced or modified by you during the internship period are the sole intellectual property of Steigel Innovations Hub. No duplication or transfer to external folders is permitted without express written consent.
          </p>

          <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>3. Access Control and System Security</p>
          <p style={{ marginBottom: '1rem' }}>
            You agree not to bypass dashboard login guards, share user credentials, or deploy unapproved updates. Any files downloaded from the Steigel Vault must remain on authorized local hardware and are logged in audit tracks.
          </p>

          <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>4. Term and Enforceability</p>
          <p style={{ marginBottom: '1rem' }}>
            This nondisclosure contract remains active during the term of your cohort participation and indefinitely following your exit date. Breach of these guidelines will result in immediate termination, revocation of all issued training certificates, and legal action.
          </p>
          
          <p style={{ fontWeight: 700, color: 'var(--success)', textAlign: 'center', margin: '1.5rem 0 0.5rem' }}>
            *** END OF DOCUMENT — YOU MAY NOW SCROLL AND ACCEPT ***
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <input
              type="checkbox"
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
              style={{ marginTop: '3px', cursor: 'pointer' }}
            />
            <span>I have read the agreement in full and unconditionally accept the legal frameworks and intellectual property rights clauses of Steigel Innovations.</span>
          </label>

          <button
            type="button"
            className="dash-btn dash-btn-primary"
            onClick={handleAccept}
            disabled={!checked}
            style={{ width: '100%', opacity: checked ? 1 : 0.5, cursor: checked ? 'pointer' : 'not-allowed' }}
          >
            Agree and Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default NdaAgreement;
