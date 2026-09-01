import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, LogIn, LogOut, ArrowRight, Sparkles, CheckCircle, Code,
  Cpu, Database, Cloud, Award, Calendar, FileText, Send, User
} from 'lucide-react';
import SEO from '../components/SEO';
import { getSession, setSession, clearSession, authenticateUser, getSystemData } from '../lib/systemStore';

export const Careers = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  // Intern Login Portal State
  const [portalEmail, setPortalEmail] = useState('student@gmail.com');
  const [portalPassword, setPortalPassword] = useState('123456');
  const [portalError, setPortalError] = useState('');
  const [currentSession, setCurrentSession] = useState(getSession());

  useEffect(() => {
    const session = getSession();
    setCurrentSession(session);
  }, []);

  const handleInternLoginSubmit = (e) => {
    e.preventDefault();
    setPortalError('');
    try {
      const user = authenticateUser(portalEmail, portalPassword);
      if (user.role !== 'intern') {
        throw new Error('Unauthorized. This portal is specifically for Interns and Associates.');
      }
      user.ndaAccepted = true;
      setSession(user);
      navigate('/user-dashboard');
    } catch (err) {
      setPortalError(err.message || 'Authentication failed');
    }
  };

  const fastInternLogin = () => {
    const data = getSystemData();
    const user = data.users.find((u) => u.role === 'intern');
    if (user) {
      user.ndaAccepted = true;
      setSession(user);
      navigate('/user-dashboard');
    }
  };

  const handleLogout = () => {
    clearSession();
    setCurrentSession(null);
  };

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = () => {
    setSubmitted(true);
    reset();
    setTimeout(() => {
      setSubmitted(false);
    }, 8000);
  };

  const careersSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': 'Steigel Innovations Internship Program',
    'description': 'Apply for the Steigel Internship & Associate Program. Learn Web Engineering, AI Systems, Data Engineering, and Cloud Infrastructure with direct mentorship.'
  };

  const internshipTracks = [
    {
      title: 'Frontend Web & System Aesthetics',
      icon: Code,
      desc: 'Master React 19, Framer Motion animations, responsive design systems, and modern web architecture.'
    },
    {
      title: 'AI & Machine Learning Engineering',
      icon: Cpu,
      desc: 'Build intelligent LLM integrations, semantic vector embeddings, and contextual copilot workflows.'
    },
    {
      title: 'Data Science & High-Throughput Analytics',
      icon: Database,
      desc: 'Construct scalable ETL data lakes, PySpark pipelines, and real-time analytical query layers.'
    },
    {
      title: 'Cloud Operations & Infrastructure',
      icon: Cloud,
      desc: 'Configure AWS environments, automated CI/CD deployment pipelines, and microservice monitoring.'
    }
  ];

  return (
    <>
      <SEO 
        title="Internship & Associate Program"
        description="Join the Steigel Innovations Internship Program. Gain hands-on project experience, faculty mentorship, and verifiable credentials."
        schemaMarkup={careersSchema}
      />

      {/* Hero Banner */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)', textAlign: 'center', paddingTop: '6rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span style={{ color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.9rem' }}>
              Steigel Talent Development
            </span>
            <h1 className="text-gradient-gold" style={{ marginTop: '0.75rem', marginBottom: '1.5rem', fontSize: '3.5rem', fontFamily: 'var(--font-heading)' }}>
              Internship & Associate Program
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              Accelerate your engineering journey. Gain hands-on experience on live production systems, receive direct mentorship from senior leads, and build a verifiable portfolio.
            </p>
          </div>
        </div>
      </section>

      {/* INTERN PORTAL LOGIN SECTION */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: '750px' }}>
          <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '16px', border: '1.5px solid var(--accent)', backgroundColor: '#FFFFFF', boxShadow: 'var(--shadow-md)' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', padding: '0.4rem 1rem', borderRadius: '20px', backgroundColor: 'rgba(184, 146, 61, 0.12)', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: '600' }}>
                <GraduationCap size={18} /> Student & Associate Portal
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                Intern Portal Login
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '550px', margin: '0 auto' }}>
                Sign in to access your allocated projects, task deliverables, gradebook metrics, and digital certificates.
              </p>
            </div>

            {/* Active Session Notice */}
            {currentSession && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10B981', padding: '0.85rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#10B981', fontWeight: 600 }}>
                  Active Session: <strong>{currentSession.name}</strong> ({currentSession.role.toUpperCase()})
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (currentSession.role === 'admin') navigate('/admin-dashboard');
                      else if (currentSession.role === 'mentor') navigate('/mentor-dashboard');
                      else navigate('/user-dashboard');
                    }}
                    className="btn btn-primary"
                    style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
                  >
                    Open Workspace <ArrowRight size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', color: '#EF4444', borderColor: '#EF4444' }}
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            )}

            {/* Intern Login Form */}
            <form onSubmit={handleInternLoginSubmit} style={{ maxWidth: '480px', margin: '0 auto' }}>
              {portalError && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600, textAlign: 'center' }}>
                  {portalError}
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  INTERN EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={portalEmail}
                  onChange={(e) => setPortalEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px' }}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  PASSWORD
                </label>
                <input
                  type="password"
                  className="form-input"
                  value={portalPassword}
                  onChange={(e) => setPortalPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px' }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', borderRadius: '8px' }}
              >
                <LogIn size={18} /> Launch Intern Workspace
              </button>
            </form>

            {/* Fast Intern Test Login Button */}
            <div style={{ marginTop: '1.75rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem', textAlign: 'center' }}>
              <button
                type="button"
                onClick={fastInternLogin}
                style={{ padding: '0.6rem 1.4rem', borderRadius: '6px', backgroundColor: 'rgba(184, 146, 61, 0.12)', color: 'var(--accent)', border: '1px solid var(--accent)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Sparkles size={16} /> 1-Click Fast Launch: Intern Portal
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* INTERNSHIP TRACKS SECTION */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="section-header">
            <h2 style={{ fontFamily: 'var(--font-heading)' }}>Internship Specialization Tracks</h2>
            <p>Choose an area of focus to work on production-grade engineering problems.</p>
          </div>

          <div className="grid-2" style={{ gap: '2rem' }}>
            {internshipTracks.map((track, idx) => {
              const TrackIcon = track.icon;
              return (
                <div key={idx} className="glass-card" style={{ padding: '2rem', backgroundColor: '#FFFFFF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'rgba(184, 146, 61, 0.12)', color: 'var(--accent)' }}>
                      <TrackIcon size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>{track.title}</h3>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{track.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTERNSHIP BENEFITS */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border)', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="section-header">
            <h2 style={{ fontFamily: 'var(--font-heading)' }}>Program Benefits</h2>
            <p>Our internship framework provides structural growth and industry verification.</p>
          </div>

          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {[
              { title: '1-on-1 Faculty Mentorship', desc: 'Direct guidance from experienced technical leads with weekly review sessions.' },
              { title: 'Live Project Allocation', desc: 'Contribute directly to live software repositories, APIs, and data transformation lakes.' },
              { title: 'Performance Radar Analytics', desc: 'Track your growth across technical skill, attendance, and assignment quality.' },
              { title: 'Flexible Learning Schedule', desc: 'Structured hybrid & remote participation options tailored to your academic timeline.' },
              { title: 'Cryptographic Credentials', desc: 'Receive verifiable digital completion certificates with SHA-256 blockchain proof.' },
              { title: 'Fast-Track Career Hire', desc: 'Top-performing associates are recommended for full-time junior developer positions.' }
            ].map((benefit, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '2rem', backgroundColor: '#FFFFFF' }}>
                <CheckCircle size={24} color="var(--accent)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>{benefit.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERNSHIP COHORT APPLICATION FORM */}
      <section id="application-form-section" className="section-padding" style={{ backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border)', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="glass-card" style={{ backgroundColor: '#FFFFFF', padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <FileText size={24} color="var(--accent)" />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem' }}>Apply for Internship Cohort 2026</h2>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: '1.6' }}>
              Submit your details to enroll in the upcoming Steigel Internship Cohort. Applications are evaluated within 48 business hours.
            </p>

            <AnimatePresence>
              {submitted ? (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  style={{
                    backgroundColor: 'rgba(184, 146, 61, 0.12)',
                    border: '1px solid var(--accent)',
                    padding: '2rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    marginBottom: '2rem'
                  }}
                >
                  <CheckCircle size={44} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Application Submitted</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    Thank you for applying to the Steigel Internship Program! Our academic coordinator will reach out to you via email shortly.
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid-2" style={{ gap: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">Full Name *</label>
                  <input
                    id="fullName"
                    type="text"
                    className="form-input"
                    {...register('fullName', { required: 'Full name is required' })}
                  />
                  {errors.fullName && <span className="form-error">{errors.fullName.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    {...register('email', { 
                      required: 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.email && <span className="form-error">{errors.email.message}</span>}
                </div>
              </div>

              <div className="grid-2" style={{ gap: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    className="form-input"
                    {...register('phone', { required: 'Phone number is required' })}
                  />
                  {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="track">Specialization Track *</label>
                  <select
                    id="track"
                    className="form-input"
                    style={{ appearance: 'none', WebkitAppearance: 'none' }}
                    {...register('track', { required: 'Please select a track' })}
                  >
                    <option value="">Select track...</option>
                    <option value="Frontend & Web Systems">Frontend & Web Systems</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Data Science & Analytics">Data Science & Analytics</option>
                    <option value="Cloud Infrastructure & DevOps">Cloud Infrastructure & DevOps</option>
                  </select>
                  {errors.track && <span className="form-error">{errors.track.message}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="github">GitHub / Portfolio URL *</label>
                <input
                  id="github"
                  type="url"
                  className="form-input"
                  placeholder="https://github.com/..."
                  {...register('github', { 
                    required: 'GitHub or portfolio link is required',
                    pattern: {
                      value: /^https?:\/\/[^\s$.?#].[^\s]*$/i,
                      message: 'Please enter a valid URL'
                    }
                  })}
                />
                {errors.github && <span className="form-error">{errors.github.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="statement">Brief Statement / Motivation *</label>
                <textarea
                  id="statement"
                  className="form-textarea"
                  rows="4"
                  placeholder="Tell us about your technical skills and why you want to join this cohort..."
                  {...register('statement', { 
                    required: 'Motivation statement is required',
                    minLength: {
                      value: 30,
                      message: 'Statement must be at least 30 characters'
                    }
                  })}
                />
                {errors.statement && <span className="form-error">{errors.statement.message}</span>}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyItems: 'center', justifyContent: 'center' }}
              >
                Submit Internship Application <Send size={18} style={{ marginLeft: '4px' }} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Careers;
