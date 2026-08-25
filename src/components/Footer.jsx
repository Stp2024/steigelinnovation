import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { LinkedIn as Linkedin, GitHub as Github, Instagram, Youtube } from './SocialIcons';
import logo from '../assets/logo.webp';
import { fadeUp, staggerContainer } from '../utils/animations';
import './Footer.css';

const socialLinks = [
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://github.com', icon: Github, label: 'GitHub' },
  { href: 'https://www.instagram.com/steigel_innovations?igsh=bWlwNWRlZXhoNW9h', icon: Instagram, label: 'Instagram' },
  { href: 'https://youtube.com/@steigelinnovations?si=C0AliH9Z6vTkIJtP', icon: Youtube, label: 'YouTube' },
];

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      setStatus('error');
      setStatusMessage('Please enter an email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setStatusMessage('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setStatusMessage('Thank you for subscribing to our newsletter!');
      setEmail('');
    }, 1000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className="footer-wrapper"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer}
    >
      <div className="container">
        <motion.div className="footer-grid" variants={staggerContainer}>

          {/* Brand Info */}
          <motion.div className="footer-brand-col" variants={fadeUp}>
            <Link to="/" className="logo-link" style={{ marginBottom: '0.5rem' }}>
              <motion.img
                src={logo} alt="Steigel Innovations Logo"
                width={81} height={45}
                style={{ height: '45px', width: 'auto', objectFit: 'contain' }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            <p className="footer-brand-desc">
              Steigel Innovations is a premium technology startup engineering futuristic web development, UI/UX designs, and technical SEO operations for worldwide enterprises.
            </p>
            <div className="footer-socials">
              {socialLinks.map(({ href, icon: Icon, label }, idx) => (
                <motion.a
                  key={label}
                  href={href} target="_blank" rel="noopener noreferrer"
                  className="footer-social-icon" aria-label={label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  whileHover={{ y: -4, scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeUp}>
            <h4 className="footer-title">Company</h4>
            <ul className="footer-links">
              {['/', '/about', '/careers', '/contact'].map((path, idx) => (
                <li key={path}>
                  <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                    <Link to={path}>{['Home', 'About Us', 'Careers', 'Contact'][idx]}</Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={fadeUp}>
            <h4 className="footer-title">Services</h4>
            <ul className="footer-links">
              {['Web Development', 'UI/UX Design', 'SEO Optimization', 'Digital Marketing', 'Graphic Design', 'Software Solutions'].map((s) => (
                <li key={s}>
                  <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                    <Link to="/services">{s}</Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div className="footer-newsletter-col" variants={fadeUp}>
            <h4 className="footer-title">Newsletter</h4>
            <p className="footer-newsletter-desc">
              Subscribe to receive weekly digital strategy reports and technology trends.
            </p>
            <form onSubmit={handleSubscribe} className="footer-newsletter-form" noValidate>
              <div className="newsletter-input-group">
                <input
                  type="email"
                  className="newsletter-input"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status) setStatus(''); }}
                  aria-label="Corporate Email Address"
                />
                <motion.button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 1.25rem', borderRadius: '8px' }}
                  aria-label="Subscribe"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRight size={18} />
                </motion.button>
              </div>
              {status === 'error' && <p className="form-error">{statusMessage}</p>}
              {status === 'success' && <p className="newsletter-success">{statusMessage}</p>}
            </form>
          </motion.div>

        </motion.div>

        {/* Bottom Section */}
        <motion.div className="footer-bottom" variants={fadeUp}>
          <p className="footer-copyright">
            © {currentYear} Steigel Innovations Private Limited. All rights reserved.
          </p>
          <div className="footer-legal-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms & Conditions</Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
