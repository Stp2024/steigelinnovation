import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, CheckCircle, ChevronDown, ChevronUp, FileText, Send } from 'lucide-react';
import SEO from '../components/SEO';
import { careersData } from '../data/careersData';

export const Careers = () => {
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [appliedJobTitle, setAppliedJobTitle] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const toggleJobDetails = (id) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  const handleApplyClick = (jobTitle) => {
    setAppliedJobTitle(jobTitle);
    setValue('position', jobTitle);
    // Smooth scroll to form
    const formElement = document.getElementById('application-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const onSubmit = () => {
    // Simulate API submission
    setSubmitted(true);
    reset();
    setTimeout(() => {
      // Clear submission state after 8 seconds
      setSubmitted(false);
    }, 8000);
  };

  // Structured Schema markup
  const careersSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': 'Steigel Innovations Careers',
    'description': 'Browse open engineering, design, and marketing positions at Steigel Innovations and submit your application.'
  };

  return (
    <>
      <SEO 
        title="Careers & Open Positions"
        description="Join the team at Steigel Innovations. Browse open positions for Frontend Web Engineers, UI/UX Designers, SEO analysts, and submit your application."
        schemaMarkup={careersSchema}
      />

      {/* Hero Banner */}
      <section className="section-padding" style={{ background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)', textAlign: 'center' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span style={{ color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>Join the team</span>
            <h1 className="text-gradient-gold" style={{ marginTop: '0.75rem', marginBottom: '1.5rem', fontSize: '3.5rem', fontFamily: 'var(--font-heading)' }}>
              Build the Future of Digital Aesthetics
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              At Steigel, we invest in talent. We provide high-end equipment, structural mentorship, and a premium workspace optimized for creativity and career growth.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <h2 style={{ fontFamily: 'var(--font-heading)' }}>Employee Benefits</h2>
            <p>We create an environment where you can deliver your best engineering work.</p>
          </div>

          <div className="grid-3">
            {[
              { title: 'Flexible Hybrid & Remote', desc: 'Coordinate with directors to work from home or connect in our high-end Bangalore creative hub.' },
              { title: 'High-End Gear', desc: 'Get outfitted with premium hardware configurations: Apple M-Series Macs and large dual-4K setups.' },
              { title: 'Health & Wellness', desc: 'Comprehensive medical insurance cards covering you and your primary dependents.' },
              { title: 'Continuous Learning', desc: 'Monthly learning allowances for professional courses, books, and technological workshops.' },
              { title: 'Generous PTO', desc: 'Enjoy structured annual leaves, mental health rest days, and national holiday observances.' },
              { title: 'Performance Bonuses', desc: 'Annual profit-sharing metrics that reward high-quality product delivery and client reviews.' }
            ].map((benefit, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '2rem' }}>
                <CheckCircle size={24} color="var(--accent)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>{benefit.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions List */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="section-header">
            <h2 style={{ fontFamily: 'var(--font-heading)' }}>Open Positions</h2>
            <p>Select a career track below to read specific requirements and initiate your application.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {careersData.map((job) => {
              const isExpanded = expandedJobId === job.id;
              return (
                <div 
                  key={job.id} 
                  className="glass-card" 
                  style={{ 
                    padding: '1.75rem 2rem', 
                    borderRadius: '16px',
                    borderColor: isExpanded ? 'var(--accent)' : 'var(--border)'
                  }}
                >
                  <div 
                    onClick={() => toggleJobDetails(job.id)}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      cursor: 'pointer' 
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Briefcase size={20} color="var(--accent)" /> {job.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {job.location}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {job.type}</span>
                      </div>
                    </div>
                    <div>
                      {isExpanded ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                          <h4 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Role Description</h4>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                            {job.description}
                          </p>

                          <h4 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Job Requirements</h4>
                          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                            {job.requirements.map((req, idx) => (
                              <li key={idx} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                <span style={{ color: 'var(--accent)' }}>•</span> <span>{req}</span>
                              </li>
                            ))}
                          </ul>

                          <button 
                            onClick={() => handleApplyClick(job.title)}
                            className="btn btn-primary"
                            style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                          >
                            Apply For This Role
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Application Form Section */}
      <section id="application-form-section" className="section-padding" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <FileText size={24} color="var(--accent)" />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem' }}>Submit Application</h2>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
              Fill in your details below. Our team reviews all applications within 48 business hours.
            </p>

            <AnimatePresence>
              {submitted ? (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  style={{
                    backgroundColor: 'rgba(212, 175, 106, 0.1)',
                    border: '1px solid var(--accent)',
                    padding: '2rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    marginBottom: '2rem'
                  }}
                >
                  <CheckCircle size={44} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Application Transmitted</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    Your application for the <strong>{appliedJobTitle || 'selected'}</strong> role was submitted successfully. Our human resources department will connect with you via email shortly.
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid-2" style={{ gap: '0.5rem' }}>
                {/* Full Name */}
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

                {/* Email */}
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Corporate Email *</label>
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
                {/* Phone */}
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

                {/* Applying Position */}
                <div className="form-group">
                  <label className="form-label" htmlFor="position">Position Applied For *</label>
                  <select
                    id="position"
                    className="form-input"
                    style={{ appearance: 'none', WebkitAppearance: 'none' }}
                    {...register('position', { required: 'Please select a position' })}
                  >
                    <option value="">Select a role...</option>
                    {careersData.map((job) => (
                      <option key={job.id} value={job.title}>{job.title}</option>
                    ))}
                  </select>
                  {errors.position && <span className="form-error">{errors.position.message}</span>}
                </div>
              </div>

              {/* Portfolio / LinkedIn */}
              <div className="form-group">
                <label className="form-label" htmlFor="portfolio">Portfolio / LinkedIn Profile *</label>
                <input
                  id="portfolio"
                  type="url"
                  className="form-input"
                  {...register('portfolio', { 
                    required: 'Portfolio or profile link is required',
                    pattern: {
                      value: /^https?:\/\/[^\s$.?#].[^\s]*$/i,
                      message: 'Please enter a valid URL'
                    }
                  })}
                />
                {errors.portfolio && <span className="form-error">{errors.portfolio.message}</span>}
              </div>

              {/* Cover Letter */}
              <div className="form-group">
                <label className="form-label" htmlFor="coverLetter">Brief Statement / Cover Letter *</label>
                <textarea
                  id="coverLetter"
                  className="form-textarea"
                  rows="4"
                  {...register('coverLetter', { 
                    required: 'Statement statement is required',
                    minLength: {
                      value: 50,
                      message: 'Statement must be at least 50 characters'
                    }
                  })}
                />
                {errors.coverLetter && <span className="form-error">{errors.coverLetter.message}</span>}
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyItems: 'center', justifyContent: 'center' }}
              >
                Submit Application <Send size={18} style={{ marginLeft: '4px' }} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
export default Careers;
