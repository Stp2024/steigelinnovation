import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import stp1 from '../assets/stp1.webp';
import stp2 from '../assets/stp2.webp';
import stp3 from '../assets/stp3.webp';
import { 
  Code, Layers, Search, Megaphone, PenTool, Palette, Cpu, Settings, 
  ArrowRight, CheckCircle, Mail, ExternalLink 
} from 'lucide-react';
import SEO from '../components/SEO';
import TeamCard from '../components/TeamCard';
import FAQAccordion from '../components/FAQAccordion';
import { servicesData } from '../data/servicesData';
import { blogsData } from '../data/blogsData';
import logo from '../assets/logo.webp';
import { fadeUp, fadeLeft, fadeRight, staggerContainer, staggerSlow, scaleIn, viewport } from '../utils/animations';
import './Home.css';

// Lucide icon mapping
const iconMap = { Code, Layers, Search, Megaphone, PenTool, Palette, Cpu, Settings };

// Shared whileHover for cards
const cardHover = {
  y: -6,
  scale: 1.015,
  boxShadow: '0 20px 40px rgba(0,0,0,0.25), 0 0 24px rgba(212,175,106,0.12)',
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
};

export const Home = () => {
  // Structured schemas
  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Steigel Innovations',
    'url': window.location.origin,
    'description': 'Premium technology startup specializing in Web Development, UI/UX Design, SEO, and custom software.',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${window.location.origin}/blogs?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Steigel Innovations',
    'image': 'https://steigel.com/assets/logo.png',
    'email': 'STPCA2024@GMAIL.COM',
    'telephone': '+919449446793',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'XG76+2MW, NH 206, Sagar Road, Virupina Koppa',
      'addressLocality': 'Shivamogga',
      'addressRegion': 'Karnataka',
      'postalCode': '577204',
      'addressCountry': 'IN'
    },
    'priceRange': '$$$'
  };

  return (
    <>
      <SEO 
        title="Engineering Next-Gen Digital Products"
        description="Steigel Innovations is a premium technology startup engineering futuristic web development, UI/UX designs, and technical SEO operations for worldwide enterprises."
        schemaMarkup={[homeSchema, businessSchema]}
      />

      {/* ── Hero Section ── */}
      <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>

        <div className="container hero-grid">
          <motion.div 
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.span className="hero-tag" variants={fadeUp}>
              Future-Proof Technologies
            </motion.span>

            <motion.h1 
              className="hero-title text-gradient" 
              variants={fadeUp}
              style={{ willChange: 'opacity, transform' }}
            >
              Engineering Next-Gen Digital Products
            </motion.h1>

            <motion.p className="hero-desc" variants={fadeUp}>
              We build premium, modern web applications, high-fidelity UI/UX design architectures, and Technical SEO infrastructures that elevate corporate brands on a global scale.
            </motion.p>

            <motion.div className="hero-btns" variants={fadeUp}>
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link to="/contact" className="btn btn-primary">
                  Get Started <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link to="/services" className="btn btn-secondary">
                  Our Services
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated scroll indicator */}
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            Scroll Down
          </motion.span>
          <div className="mouse-icon">
            <div className="mouse-wheel" style={{ animation: 'scroll-wheel 1.5s ease-in-out infinite' }} />
          </div>
        </motion.div>
      </section>

      {/* ── Who We Are ── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', overflow: 'hidden' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeLeft}
          >
            <span style={{ color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>Who We Are</span>
            <h2 style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Forging the Horizon of Enterprise Software</h2>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
              At Steigel Innovations, we merge cutting-edge technology with high-end aesthetic values. Our mission is to engineer software platforms and brand systems that evoke trust, innovation, and unmatched user delight.
            </p>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.7' }}>
              We partner with forward-thinking start-ups and established leaders alike to deploy modular, responsive, and SEO-optimized structures that dominate modern organic search indexes.
            </p>
            <motion.div whileHover={{ scale: 1.04, x: 4 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
              <Link to="/about" className="btn btn-secondary">Read Our Story</Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeRight}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1.5rem' }}
          >
            <motion.img 
              src={logo} 
              alt="Steigel Innovations Logo Symbol" 
              style={{ 
                width: '100%', maxWidth: '320px', height: 'auto', 
                objectFit: 'contain',
                filter: 'drop-shadow(0 10px 40px rgba(212,175,106,0.15))'
              }}
              width="320" height="178" loading="lazy"
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
          >
            <span style={{ color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>Core Capabilities</span>
            <h2 style={{ marginTop: '0.5rem' }}>Our Specialized Divisions</h2>
            <p>We provide a comprehensive ecosystem of design and technical solutions designed for modern enterprise scaling.</p>
          </motion.div>

          <motion.div 
            className="grid-3"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            {servicesData.slice(0, 6).map((service) => {
              const ServiceIcon = iconMap[service.iconName] || Code;
              return (
                <motion.div 
                  key={service.id} 
                  className="glass-card" 
                  variants={fadeUp}
                  whileHover={cardHover}
                  style={{ cursor: 'default' }}
                >
                  <motion.div
                    style={{
                      width: '50px', height: '50px',
                      backgroundColor: 'rgba(212, 175, 106, 0.1)',
                      borderRadius: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--accent)', marginBottom: '1.5rem'
                    }}
                    whileHover={{ rotate: 8, scale: 1.1, backgroundColor: 'rgba(212, 175, 106, 0.18)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <ServiceIcon size={24} />
                  </motion.div>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>{service.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    {service.shortDesc}
                  </p>
                  <Link to="/services" className="blog-preview-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    Explore Features
                    <motion.span
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <ArrowRight size={16} />
                    </motion.span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
          >
            <span style={{ color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>Steigel Advantage</span>
            <h2 style={{ marginTop: '0.5rem' }}>Why Brands Trust Steigel</h2>
            <p>Our operational framework ensures elite output speeds, pristine codebases, and continuous post-launch support.</p>
          </motion.div>

          <motion.div
            className="grid-4"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerSlow}
          >
            {[
              { title: 'Experienced Team', desc: 'Managed by senior engineers and designers.' },
              { title: 'Fast Delivery', desc: 'Strict milestone tracking and prompt output.' },
              { title: 'Latest Technologies', desc: 'React, Vite, Node, and advanced clouds.' },
              { title: 'SEO Optimized', desc: 'Structured schema files and high core vitals.' },
              { title: 'Secure Development', desc: 'End-to-end encryption protocols and NDAs.' },
              { title: 'Affordable Solutions', desc: 'Clear billing breakdowns and pricing.' },
              { title: 'Client Satisfaction', desc: 'Client communication and transparency.' },
              { title: '24/7 Support', desc: 'Dedicated maintenance pipelines.' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="glass-card"
                variants={fadeUp}
                whileHover={{ y: -5, scale: 1.02, borderColor: 'var(--accent)' }}
                transition={{ duration: 0.25 }}
                style={{ padding: '1.75rem', borderRadius: '12px' }}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ duration: 0.25 }}
                  style={{ marginBottom: '1rem', display: 'inline-block' }}
                >
                  <CheckCircle size={20} color="var(--accent)" />
                </motion.div>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '1.05rem' }}>{item.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Development Process ── */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
          >
            <span style={{ color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>Workflow Lifecycle</span>
            <h2 style={{ marginTop: '0.5rem' }}>Our Structured Process</h2>
            <p>We execute projects following a chronological workflow that guarantees premium results.</p>
          </motion.div>

          <motion.div
            className="process-timeline"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            {[
              { num: '01', title: 'Requirement', desc: 'Defining goal targets, deliverables, and budgets.' },
              { num: '02', title: 'Planning & Setup', desc: 'Structuring software frameworks and NDAs.' },
              { num: '03', title: 'Research & UX', desc: 'Competitive analysis, keyword maps, and user paths.' },
              { num: '04', title: 'UI Design', desc: 'Luxury style guides, visual screens, and layouts.' },
              { num: '05', title: 'Development', desc: 'React code orchestration and backend setup.' },
              { num: '06', title: 'System Testing', desc: 'Checking responsive viewport sizes, forms, and W3C code.' },
              { num: '07', title: 'Deployment', desc: 'Deploying secure HTTPS code onto optimized hosts.' },
              { num: '08', title: 'Maintenance', desc: 'Automated database backups and monthly health checks.' }
            ].map((step, idx) => (
              <motion.div
                key={step.num}
                className="process-card"
                variants={fadeUp}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                custom={idx}
              >
                <div className="process-step">{step.num}</div>
                <h4 className="process-title">{step.title}</h4>
                <p className="process-desc">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Leadership Team ── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
          >
            <span style={{ color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>Expert Directors</span>
            <h2 style={{ marginTop: '0.5rem' }}>Our Leadership Team</h2>
            <p>Meet the operations managers guiding our technical development and design strategies.</p>
          </motion.div>

          <motion.div
            className="grid-3"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            {[
              { name: 'PADMANABHA M', role: 'Founder', image: stp1 },
              { name: 'Thanushree N', role: 'Consulting Manager', image: stp2 },
              { name: 'CHARAN D R', role: 'Technical Manager', image: stp3 },
            ].map((member, idx) => (
              <motion.div key={idx} variants={fadeUp}>
                <TeamCard
                  name={member.name}
                  role={member.role}
                  image={member.image}
                  linkedin="https://linkedin.com"
                  github="https://github.com"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Latest Blogs ── */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
          >
            <span style={{ color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>Knowledge Center</span>
            <h2 style={{ marginTop: '0.5rem' }}>Latest Publications</h2>
            <p>Stay informed with web design methodologies, SEO analysis, and framework performance tips.</p>
          </motion.div>

          <motion.div
            className="blog-preview-grid"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            {blogsData.slice(0, 3).map((blog) => (
              <motion.div
                key={blog.id}
                className="blog-preview-card glass-card"
                style={{ padding: '2rem' }}
                variants={fadeUp}
                whileHover={cardHover}
              >
                <div className="blog-preview-meta">
                  <span style={{ color: 'var(--accent)', fontWeight: '600' }}>{blog.category}</span>
                  <span>{blog.date}</span>
                </div>
                <h3 className="blog-preview-title">{blog.title}</h3>
                <p className="blog-preview-desc">{blog.excerpt}</p>
                <Link to={`/blogs/${blog.id}`} className="blog-preview-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  Read Article
                  <motion.span
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <ExternalLink size={16} />
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            style={{ textAlign: 'center', marginTop: '3.5rem' }}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
              <Link to="/blogs" className="btn btn-secondary">View All Articles</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
          >
            <span style={{ color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>Frictionless Details</span>
            <h2 style={{ marginTop: '0.5rem' }}>Frequently Asked Questions</h2>
            <p>Quick answers to our common working processes, timelines, support, and services.</p>
          </motion.div>
          <FAQAccordion />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-padding" style={{ borderTop: '1px solid var(--border)', background: 'linear-gradient(180deg, var(--bg-primary) 0%, rgba(27, 42, 74, 0.2) 100%)' }}>
        <div className="container">
          <motion.div
            className="glass-card"
            style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={scaleIn}
            whileHover={{ boxShadow: '0 0 60px rgba(212,175,106,0.08)' }}
          >
            <h2 className="text-gradient-gold" style={{ fontSize: '2.5rem', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>
              Let's Co-Create Something Legendary
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
              Ready to construct a luxury website or custom software system? Reach out today to schedule a consulting briefing with our technical directors.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link to="/contact" className="btn btn-primary">Inquire Now</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                <a href="mailto:STPCA2024@GMAIL.COM" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={18} /> STPCA2024@GMAIL.COM
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
