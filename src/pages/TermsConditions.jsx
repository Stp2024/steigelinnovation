import React from 'react';
import SEO from '../components/SEO';
import { getWebPageSchema } from '../utils/seoSchemas';

export const TermsConditions = () => {
  const termsSchema = getWebPageSchema({
    path: '/terms-and-conditions',
    name: 'Terms & Conditions | Steigel Innovations',
    description: 'Review the master service terms, legal governance, and usage conditions of Steigel Innovations.'
  });

  return (
    <>
      <SEO 
        title="Terms & Conditions"
        description="Review the corporate terms and conditions of service for web engineering, design retainer billing, and client copyright deliverables at Steigel Innovations."
        canonicalUrl="https://steigel.com/terms-and-conditions"
        schemaMarkup={termsSchema}
      />

      <section className="section-padding" style={{ minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'left' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1rem' }} className="text-gradient-gold">
            Terms & Conditions
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
            Last Updated: July 10, 2026
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
            <section>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>1. Client Engagement & Estimates</h2>
              <p>
                All project estimates, development quotes, and timeline scopes provided by Steigel Innovations are valid for a period of thirty (30) days from delivery. Work commences only upon the receipt of a signed Service Agreement and required setup deposit payments.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>2. Copyright & Code Ownership</h2>
              <p>
                Upon complete clearance of final invoices, full intellectual property ownership and copyright of custom UI designs, graphics, and source codes are transferred to the Client. Steigel Innovations retains the right to display design screens in agency case studies unless otherwise specified in a signed NDA.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>3. Digital NDAs & Verification</h2>
              <p>
                Any digital NDA signed using our online portal constitutes a legally binding document. Similarly, our certificate validation system serves as an official verification tool; falsifying certificate codes or status information is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>4. Code Warranty & Limitations</h2>
              <p>
                We construct software to satisfy Google Web Vitals speed rules and WCAG 2.1 accessibility laws at launch. We provide a thirty (30) day free post-launch bug warranty. Steigel Innovations is not liable for software disruptions caused by third-party hosting, API shifts, or user theme edits.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>5. Governing Law</h2>
              <p>
                These terms are governed and construed in accordance with the laws of Karnataka, India. Any disputes arising from developer contracts shall be subject to the exclusive jurisdiction of the courts in Bengaluru, India.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
};
export default TermsConditions;
