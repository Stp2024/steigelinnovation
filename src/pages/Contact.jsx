import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    setSubmittedEmail(data.email);
    setSubmitted(true);
    reset();
    setTimeout(() => {
      setSubmitted(false);
    }, 8000);
  };

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'name': 'Contact Steigel Innovations',
    'description': 'Submit your software requests, contact our corporate office in Bangalore, or verify working hours.',
    'mainEntity': {
      '@type': 'LocalBusiness',
      'name': 'Steigel Innovations',
      'email': 'STPCA2024@GMAIL.COM',
      'telephone': '+919449446793'
    }
  };

  return (
    <>
      <SEO 
        title="Contact Us & Request Consultation"
        description="Get in touch with Steigel Innovations. Reach our Bangalore corporate office, email our directors, or submit your software project details."
        schemaMarkup={contactSchema}
      />

      {/* Page Header */}
      <section className="section-padding" style={{ background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)', textAlign: 'center' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span style={{ color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>Get in touch</span>
            <h1 className="text-gradient-gold" style={{ marginTop: '0.75rem', marginBottom: '1.5rem', fontSize: '3.5rem', fontFamily: 'var(--font-heading)' }}>
              Let's Coordinate Your Next Venture
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              Have a product briefing or need a dedicated software team? Submit details below to schedule an onboarding interview.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid Contact & Form */}
      <section className="section-padding" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container grid-2" style={{ alignItems: 'flex-start', gap: '3.5rem' }}>
          
          {/* Coordinates Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>Corporate Office</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Connect directly with our consulting directors or visit our design hub located in the technological capital of India.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Email */}
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(212, 175, 106, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                  <Mail size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Email Inquiries</h4>
                  <a href="mailto:STPCA2024@GMAIL.COM" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem' }}>STPCA2024@GMAIL.COM</a>
                </div>
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(212, 175, 106, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                  <Phone size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Consulting Desk</h4>
                  <a href="tel:+919449446793" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem' }}>+91 94494 46793</a>
                </div>
              </div>

              {/* Address */}
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(212, 175, 106, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Creative Hub</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    XG76+2MW, NH 206, Sagar Road, Shivamogga, Virupina Koppa, Karnataka 577204
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(212, 175, 106, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                  <Clock size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Business Hours</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Monday – Saturday: 10:00 AM – 5:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Google Map Embed */}
            <div style={{
              borderRadius: '16px',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              marginTop: '1.5rem',
              boxShadow: 'var(--shadow-md)',
              height: '300px'
            }}>
              <iframe
                title="Steigel Innovations HQ Location Map"
                src="https://maps.google.com/maps?q=XG76%2B2MW%2C%20NH%20206%2C%20Sagar%20Road%2C%20Shivamogga%2C%20Virupina%20Koppa%2C%20Karnataka%20577204&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form Column */}
          <div className="glass-card">
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: '1.5rem' }}>Send Message</h2>
            
            <AnimatePresence>
              {submitted && (
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
                  <h3 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Transmission Complete</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    Thank you for reaching out! A Steigel Innovations consultant will contact you at <strong>{submittedEmail}</strong> within 12 business hours.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>

              {/* Row 1: Full Name + Email */}
              <div className="grid-2" style={{ gap: '1rem' }}>
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

              {/* Row 2: Phone + Subject */}
              <div className="grid-2" style={{ gap: '1rem' }}>
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
                  <label className="form-label" htmlFor="subject">Subject *</label>
                  <input
                    id="subject"
                    type="text"
                    className="form-input"
                    {...register('subject', { required: 'Subject line is required' })}
                  />
                  {errors.subject && <span className="form-error">{errors.subject.message}</span>}
                </div>
              </div>

              {/* Row 3: Message — full width */}
              <div className="form-group">
                <label className="form-label" htmlFor="message">Project Requirements / Message *</label>
                <textarea
                  id="message"
                  className="form-textarea"
                  rows="5"
                  {...register('message', { required: 'Message body is required' })}
                />
                {errors.message && <span className="form-error">{errors.message.message}</span>}
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyItems: 'center', justifyContent: 'center' }}
              >
                Transmit Query <Send size={18} style={{ marginLeft: '4px' }} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
export default Contact;
