import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code, Layers, Search, Megaphone, PenTool, Palette, Cpu, Settings, 
  CheckCircle, ArrowRight 
} from 'lucide-react';
import SEO from '../components/SEO';
import { servicesData } from '../data/servicesData';

// Icon mapper helper
const iconMap = {
  Code,
  Layers,
  Search,
  Megaphone,
  PenTool,
  Palette,
  Cpu,
  Settings
};

export const Services = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  // JSON-LD Service List Schema
  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'Steigel Innovations'
    },
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Technology & Marketing Offerings',
      'itemListElement': servicesData.map((service) => ({
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': service.title,
          'description': service.shortDesc
        }
      }))
    }
  };

  return (
    <>
      <SEO 
        title="Our Services & Capability Verticals"
        description="Explore the technological capabilities of Steigel Innovations: Full Stack Web Development, UI/UX Product Design, Technical SEO, SaaS solutions, and hosting support."
        schemaMarkup={servicesSchema}
      />

      {/* Page Header */}
      <section className="section-padding" style={{ background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)', textAlign: 'center' }}>
        <div className="container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            style={{ maxWidth: '800px', margin: '0 auto' }}
          >
            <motion.span 
              variants={fadeUp}
              style={{ color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}
            >
              Core Capabilities
            </motion.span>
            <motion.h1 
              variants={fadeUp}
              className="text-gradient-gold"
              style={{ marginTop: '0.75rem', marginBottom: '1.5rem', fontSize: '3.5rem', fontFamily: 'var(--font-heading)' }}
            >
              Enterprise Engineering & Creative Execution
            </motion.h1>
            <motion.p 
              variants={fadeUp}
              style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}
            >
              We combine elite web architecture, structured search parameters, and elegant user visual screens to launch products that outperform competitors.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Detail Grid */}
      <section className="section-padding" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div 
            className="grid-2" 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {servicesData.map((service, index) => {
              const ServiceIcon = iconMap[service.iconName] || Code;
              return (
                <motion.div 
                  key={service.id} 
                  className="glass-card" 
                  variants={fadeUp}
                  style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}
                >
                  {/* Floating card index number */}
                  <div style={{
                    position: 'absolute',
                    top: '2.5rem',
                    right: '2.5rem',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    color: 'var(--accent)',
                    opacity: 0.18,
                    pointerEvents: 'none',
                    letterSpacing: '-0.02em'
                  }}>
                    {`0${index + 1}`}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: 'rgba(184, 146, 61, 0.08)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent)',
                      flexShrink: 0
                    }}>
                      <ServiceIcon size={22} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', margin: 0 }}>{service.title}</h3>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    {service.longDesc}
                  </p>

                  {/* Bullet features */}
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem', flexGrow: 1, padding: 0 }}>
                    {service.features.map((feature, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        <CheckCircle size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Call to action */}
                  <div style={{ marginTop: 'auto' }}>
                    <Link to="/contact" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                      Request Consultation <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* bottom CTA Banner */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Need a Tailored Software Configuration?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            We understand that enterprise demands are unique. If you require specialized cloud setups, custom API gateways, or dedicated engineering retainers, consult our director team.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Speak to a Consultant
          </Link>
        </div>
      </section>
    </>
  );
};
export default Services;
