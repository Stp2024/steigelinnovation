import fs from 'fs';
import path from 'path';

// Define static routes
const staticRoutes = [
  '',
  '/about',
  '/services',
  '/blogs',
  '/careers',
  '/contact',
  '/privacy-policy',
  '/terms-and-conditions'
];

// Define mock blog ids (duplicated here for offline build compilation)
const blogIds = [
  'scaling-react-performance-in-2026',
  'mastering-technical-seo-for-startups',
  'demystifying-glassmorphism-luxury-ui-design',
  'digital-marketing-funnels-that-convert'
];

const baseUrl = 'https://steigel.com';

const generateSitemap = () => {
  const dateStr = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add static routes
  staticRoutes.forEach((route) => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${route}</loc>\n`;
    xml += `    <lastmod>${dateStr}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  });

  // Add dynamic blog routes
  blogIds.forEach((id) => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/blogs/${id}</loc>\n`;
    xml += `    <lastmod>${dateStr}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.6</priority>\n';
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';

  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  
  // Ensure public folder exists
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(`[SEO SUCCESS] XML Sitemap successfully generated at: ${outputPath}`);
};

generateSitemap();
