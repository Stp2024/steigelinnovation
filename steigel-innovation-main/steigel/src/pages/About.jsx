import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';
import SEO from '../components/SEO';
import TeamCard from '../components/TeamCard';
import stp1 from '../assets/stp1.webp';
import stp2 from '../assets/stp2.webp';
import stp3 from '../assets/stp3.webp';
import { fadeUp, fadeLeft, fadeRight, staggerContainer, scaleIn, viewport } from '../utils/animations';

const cardHover = {
  y: -6, scale: 1.015,
  boxShadow: '0 20px 40px rgba(0,0,0,0.25), 0 0 24px rgba(212,175,106,0.12)',
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
};

export const About = () => {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': 'About Steigel Innovations',
    'description': 'Understand our story, core vision, mission, corporate motto, and meet our leadership team.',
    'publisher': {
      '@type': 'Organization',
      'name': 'Steigel Innovations',
      'logo': { '@type': 'ImageObject', 'url': 'https://steigel.com/assets/logo.png' }
    }
  };

  return (
    <>
      <SEO 
        title="Our Story & Core Values"
        description="Learn about Steigel Innovations, our core mission, vision, corporate motto, and meet the leadership team driving our digital solutions."
        schemaMarkup={aboutSchema}
      />

      {/* Hero Banner */}
      <section className="section-padding" style={{ background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)', textAlign: 'center' }}>
        <div className="container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            style={{ maxWidth: '800px', margin: '0 auto' }}
          >
            <motion.span variants={fadeUp} style={{ color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>
              Company Overview
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-gradient-gold" style={{ marginTop: '0.75rem', marginBottom: '1.5rem', fontSize: '3.5rem', fontFamily: 'var(--font-heading)' }}>
              Innovation Engineered, Aesthetics Perfected
            </motion.h1>
            <motion.p variants={fadeUp} style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              Steigel Innovations is a luxury technology startup founded on a single premise: digital software must be as visually breathtaking as it is structurally robust.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="section-padding" style={{ borderTop: '1px solid var(--border)', overflow: 'hidden' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={fadeLeft}>
            <span style={{ color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>Our Heritage</span>
            <h2 style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Constructing the Digital Renaissance</h2>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
              At STEIGEL, we are a passionate team of web developers, designers, and digital marketers dedicated to crafting exceptional online experiences. With years of experience, we understand the unique needs of businesses and deliver customized solutions that bring tangible results.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
              By merging advanced development environments with custom design components, we help our clients establish absolute digital command in their markets. Today, Steigel serves clients with products that set benchmarks for speed, accessibility, and elegance.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={viewport} variants={fadeRight}
            style={{ borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}
            whileHover={{ scale: 1.02, boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}
            transition={{ duration: 0.4 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600&h=400&fm=webp" 
              alt="Steigel Innovations corporate building facade"
              style={{ width: '100%', display: 'block' }}
              width="600" height="400" loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* Vision / Mission / Motto */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div
            className="grid-3"
            initial="hidden" whileInView="visible" viewport={viewport} variants={staggerContainer}
          >
            {[
              { Icon: Target, title: 'Our Mission', content: (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  To engineer pristine frontend frameworks and custom business software that help global corporations digitize their operations without sacrificing visual quality or search engine visibility.
                </p>
              )},
              { Icon: Eye, title: 'Our Vision', content: (
                <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                  <li>• Urging students to learn in an efficient way</li>
                  <li>• Developing critical thinking and problem solving skills</li>
                  <li>• Create a supportive community for inclusive learning</li>
                </ul>
              )},
              { Icon: Award, title: 'Our Motto', content: (
                <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                  <li>• Learn, grow, explore, repeat</li>
                  <li>• Empowering Minds, Enriching Futures</li>
                  <li>• Unleash your potential, unlock your dreams</li>
                  <li>• Learn with passion, lead with purpose</li>
                  <li>• Cultivate curiosity and foster creativity.</li>
                </ul>
              )}
            ].map(({ Icon, title, content }, idx) => (
              <motion.div key={idx} className="glass-card" variants={fadeUp} whileHover={cardHover}>
                <motion.div
                  style={{
                    width: '44px', height: '44px',
                    backgroundColor: 'rgba(212, 175, 106, 0.1)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent)', marginBottom: '1.5rem'
                  }}
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ duration: 0.25 }}
                >
                  <Icon size={20} />
                </motion.div>
                <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>{title}</h3>
                {content}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding">
        <div className="container">
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
            <span style={{ color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>Operational Pillars</span>
            <h2 style={{ marginTop: '0.5rem' }}>Our Core Values</h2>
            <p>Our work is driven by a deep commitment to excellence, transparency, and product integrity.</p>
          </motion.div>

          <motion.div className="grid-3" initial="hidden" whileInView="visible" viewport={viewport} variants={staggerContainer}>
            {[
              { Icon: ShieldCheck, title: 'Uncompromised Integrity', desc: 'We enforce strict security and NDA agreements, protecting our clients IP with robust access keys and hosting safety protocols.' },
              { Icon: Sparkles, title: 'Aesthetic Precision', desc: 'Every border radius, box shadow, transition timing, and font weight is meticulously refined to project corporate elegance.' },
              { Icon: Heart, title: 'Client Centricity', desc: 'We construct systems centered around user journeys, providing 24/7 post-launch assistance and real-time sprint updates.' }
            ].map(({ Icon, title, desc }, idx) => (
              <motion.div key={idx} className="glass-card" variants={scaleIn} whileHover={cardHover} style={{ padding: '2rem' }}>
                <motion.div whileHover={{ scale: 1.15, rotate: 6 }} transition={{ duration: 0.25 }}>
                  <Icon size={32} color="var(--accent)" style={{ marginBottom: '1.25rem' }} />
                </motion.div>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '1.15rem' }}>{title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
            <span style={{ color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>The Directors</span>
            <h2 style={{ marginTop: '0.5rem' }}>Meet Our Leadership</h2>
            <p>The technical leads and corporate strategists driving success at Steigel Innovations.</p>
          </motion.div>

          <motion.div className="grid-3" initial="hidden" whileInView="visible" viewport={viewport} variants={staggerContainer}>
            {[
              { name: 'PADMANABHA M', role: 'Founder', image: stp1 },
              { name: 'Thanushree N', role: 'Consulting Manager', image: stp2 },
              { name: 'CHARAN D R', role: 'Technical Manager', image: stp3 },
            ].map((member, idx) => (
              <motion.div key={idx} variants={fadeUp}>
                <TeamCard name={member.name} role={member.role} image={member.image} linkedin="https://linkedin.com" github="https://github.com" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;
