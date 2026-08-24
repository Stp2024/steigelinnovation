import React from 'react';
import SEO from '../components/SEO';

export const PrivacyPolicy = () => {
  const policySchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Privacy Policy | Steigel Innovations',
    'description': 'Read the official privacy policy and data protection guidelines of Steigel Innovations.'
  };

  return (
    <>
      <SEO 
        title="Privacy Policy"
        description="Learn how Steigel Innovations handles and protects your corporate data, cookies, project files, and contact queries."
        schemaMarkup={policySchema}
      />

      <section className="section-padding" style={{ minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'left' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1rem' }} className="text-gradient-gold">
            Privacy Policy
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
            Last Updated: July 10, 2026
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
            <section>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>1. Information We Collect</h2>
              <p>
                We collect information directly provided by you when filling out contact forms, careers portal applications, or newsletter subscription inputs. This includes your name, email address, phone number, company credentials, and resume attachments.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>2. How We Use Information</h2>
              <p>
                We utilize your contact details to reply to consultation proposals, review job applications, and send weekly newsletter reports. We do not sell or lease client datasets to third-party advertisers.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>3. Code & Asset Protection</h2>
              <p>
                All proprietary client files, project credentials, database keys, and draft wireframes shared with Steigel Innovations are protected by strict role-based access tokens and encrypted servers.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>4. Security Compliance</h2>
              <p>
                We enforce secure HTTPS encryption, sanitization of form queries, header protection, and regular package audits to protect our databases from unauthorized interception or SQL injections.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>5. Contact Us</h2>
              <p>
                For questions regarding data records or cookie settings, email our security compliance officers at <a href="mailto:info@steigel.com" style={{ color: 'var(--accent)' }}>info@steigel.com</a>.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
};
export default PrivacyPolicy;
