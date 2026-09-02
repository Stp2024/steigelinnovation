/**
 * SEO Schema.org JSON-LD Builders
 * Connected graph structure for Steigel Innovations
 */

export const SITE_DOMAIN = 'https://steigel.com';

export const ORGANIZATION_ID = `${SITE_DOMAIN}/#organization`;
export const WEBSITE_ID = `${SITE_DOMAIN}/#website`;

/**
 * 1. Organization Schema
 */
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  'name': 'Steigel Innovations',
  'url': `${SITE_DOMAIN}/`,
  'logo': {
    '@type': 'ImageObject',
    'url': `${SITE_DOMAIN}/assets/logo.webp`
  },
  'description': 'Steigel Innovations is a premium technology startup engineering futuristic web development, UI/UX designs, and technical SEO operations for worldwide enterprises.',
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
  'sameAs': [
    'https://linkedin.com',
    'https://github.com',
    'https://www.instagram.com/steigel_innovations?igsh=bWlwNWRlZXhoNW9h',
    'https://youtube.com/@steigelinnovations?si=C0AliH9Z6vTkIJtP'
  ]
});

/**
 * 2. WebSite Schema
 */
export const getWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  'url': `${SITE_DOMAIN}/`,
  'name': 'Steigel Innovations',
  'description': 'Steigel Innovations is a premium technology startup specializing in Web Development, UI/UX Design, SEO, and custom software.',
  'publisher': {
    '@id': ORGANIZATION_ID
  }
});

/**
 * 3. WebPage Schema (Generic)
 */
export const getWebPageSchema = ({ path = '', name, description, pageType = 'WebPage' }) => {
  const url = `${SITE_DOMAIN}${path}`;
  const pageId = `${url}#webpage`;

  return {
    '@context': 'https://schema.org',
    '@type': pageType,
    '@id': pageId,
    'url': url,
    'name': name,
    'description': description,
    'isPartOf': {
      '@id': WEBSITE_ID
    },
    'about': {
      '@id': ORGANIZATION_ID
    }
  };
};

/**
 * 4. AboutPage Schema
 */
export const getAboutPageSchema = ({ name, description }) => {
  return getWebPageSchema({
    path: '/about',
    name: name || 'About Us & Corporate Mission | Steigel Innovations',
    description: description || 'Learn about Steigel Innovations, our core mission, vision, corporate motto, and meet the leadership team driving our digital solutions.',
    pageType: 'AboutPage'
  });
};

/**
 * 5. ContactPage Schema
 */
export const getContactPageSchema = ({ name, description }) => {
  const pageSchema = getWebPageSchema({
    path: '/contact',
    name: name || 'Contact Us & Request Consultation | Steigel Innovations',
    description: description || 'Get in touch with Steigel Innovations. Reach our corporate office, email our directors, or submit your software project details.',
    pageType: 'ContactPage'
  });

  pageSchema.mainEntity = {
    '@id': ORGANIZATION_ID
  };

  return pageSchema;
};

/**
 * BlogPosting Schema (for detail pages)
 */
export const getBlogPostingSchema = ({ id, title, excerpt, date }) => {
  const url = `${SITE_DOMAIN}/blogs/${id}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    'url': url,
    'headline': title,
    'description': excerpt,
    'datePublished': date,
    'isPartOf': {
      '@id': WEBSITE_ID
    },
    'publisher': {
      '@id': ORGANIZATION_ID
    },
    'author': {
      '@type': 'Organization',
      'name': 'Steigel Innovations',
      '@id': ORGANIZATION_ID
    }
  };
};
