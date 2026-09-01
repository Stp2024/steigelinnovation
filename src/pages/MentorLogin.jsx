import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authenticateUser, setSession } from '../lib/systemStore';
import logo from '../assets/logo.webp';
import '../components/auth.css';

export const MentorLogin = () => {
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
      if (user.role !== 'mentor') {
        return setErrorMsg('Unauthorized. This portal is for Mentors only.');
      }
      user.ndaAccepted = true;
      setSession(user);
      navigate('/mentor-dashboard');
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  const fillDemo = () => {
    setEmail('mentor@gmail.com');
    setPassword('123456');
  };

  return (
    <div className="dashboard-theme auth-root">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={logo} alt="Steigel Logo" />
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Academic Center</div>
        </div>

        <h1 className="auth-title">Mentor Portal</h1>
        <p className="auth-subtitle">Sign in to coordinate cohorts and evaluate submissions.</p>

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
              placeholder="mentor@steigel.com"
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
            Enter Mentor Panel
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <button 
            type="button" 
            className="dash-btn dash-btn-secondary" 
            onClick={fillDemo}
            style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem' }}
          >
            Fill Demo Account
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
            <Link to="/admin-login" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>Admin Login</Link>
            <Link to="/user-login" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>Intern Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorLogin;
