import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../assets/logo.webp';
import './Header.css';

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 50;
          setScrolled((prev) => {
            if (prev !== isScrolled) {
              return isScrolled;
            }
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
      }
    };
    if (drawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      {/* Skip Navigation for Screen Readers */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          {/* Logo */}
          <Link to="/" className="logo-link" aria-label="Steigel Innovations Home">
            <img src={logo} alt="Steigel Innovations Logo" width={81} height={45} style={{ height: '45px', width: 'auto', objectFit: 'contain' }} />
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="nav-menu-desktop" role="menubar">
            {navLinks.map((link) => (
              <li key={link.name} className="nav-item" role="none">
                <NavLink
                  to={link.path}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  role="menuitem"
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Action Tools: CTA, Hamburger */}
          <div className="nav-actions">
            {/* CTA Button */}
            <Link to="/contact" className="btn btn-primary" style={{ padding: '0.6rem 1.4rem' }}>
              Get Started
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="mobile-nav-toggle"
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              aria-label="Toggle navigation menu"
            >
              {drawerOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="mobile-drawer-overlay"
              aria-hidden="true"
            />

            {/* Drawer Body */}
            <motion.div
              id="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
            >
              <div className="drawer-header">
                <Link to="/" className="logo-link" onClick={() => setDrawerOpen(false)}>
                  <img src={logo} alt="Steigel Innovations Logo" width={72} height={40} style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
                </Link>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="drawer-close-btn"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Menu Links */}
              <ul className="nav-menu-mobile">
                {navLinks.map((link) => (
                  <li key={link.name} className="nav-item">
                    <NavLink
                      to={link.path}
                      className={({ isActive }) => (isActive ? 'active' : '')}
                      onClick={() => setDrawerOpen(false)}
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
              </ul>

              {/* Action items inside Drawer */}
              <div className="drawer-actions">
                <Link
                  to="/contact"
                  className="btn btn-primary"
                  onClick={() => setDrawerOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
export default Header;
