import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authenticateUser, setSession } from '../lib/systemStore';
import logo from '../assets/logo.webp';
import '../components/auth.css';

export const InternLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      return setErrorMsg('Please enter both email and password.');
    }

    try {
      const user = authenticateUser(email, password);
      if (user.role !== 'intern') {
        return setErrorMsg('Unauthorized. This portal is for Interns and Associates only.');
      }
      setSession(user);

      // Check NDA Gate
      if (user.ndaAccepted === false) {
        navigate('/nda-agreement');
      } else {
        navigate('/user-dashboard');
      }
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('123456');
  };

  return (
    <div className="dashboard-theme auth-root">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={logo} alt="Steigel Logo" />
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Learning Center</div>
        </div>

        <h1 className="auth-title">Intern & Associate Portal</h1>
        <p className="auth-subtitle">Sign in to access workspace tools, milestones, and feedback.</p>

        {errorMsg && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 600, textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="dash-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="associate@steigel.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="dash-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="dash-btn dash-btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Enter Student Workspace
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Pre-filled Demo Accounts:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button 
              type="button" 
              className="dash-btn dash-btn-secondary" 
              onClick={() => fillDemo('student@gmail.com')}
              style={{ flexGrow: 1, fontSize: '0.7rem', padding: '0.4rem 0.6rem' }}
            >
              Associate 1
            </button>
            <button 
              type="button" 
              className="dash-btn dash-btn-secondary" 
              onClick={() => fillDemo('intern2@gmail.com')}
              style={{ flexGrow: 1, fontSize: '0.7rem', padding: '0.4rem 0.6rem' }}
            >
              Associate 2
            </button>
            <button 
              type="button" 
              className="dash-btn dash-btn-secondary" 
              onClick={() => fillDemo('intern3@gmail.com')}
              style={{ flexGrow: 1, fontSize: '0.7rem', padding: '0.4rem 0.6rem' }}
            >
              Associate 3
            </button>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.5rem' }}>
            <Link to="/admin-login" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>Admin Login</Link>
            <Link to="/mentor-login" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>Mentor Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternLogin;
