import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEO = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = 'website',
  schemaMarkup,
  robots = 'index, follow'
}) => {
  const siteName = 'Steigel Innovations';
  const defaultDescription = 'Steigel Innovations is a premium technology startup offering expert Web Development, UI/UX Design, SEO, Digital Marketing, and Software Solutions.';
  const defaultKeywords = 'Web Development, UI/UX Design, Graphic Design, SEO, Digital Marketing, Software Solutions, Steigel, Startup, Luxury Tech';
  
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const currentUrl = canonicalUrl || window.location.href;

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <meta name="robots" content={robots} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content="https://steigel.com/assets/og-image.jpg" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content="https://steigel.com/assets/og-image.jpg" />

      {/* Security Headers (Simulated via meta tags where supported) */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests;" />

      {/* Structured Schema Markup */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      )}
    </Helmet>
  );
};
export default SEO;
