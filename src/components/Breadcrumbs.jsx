import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './Breadcrumbs.css';

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  // Format link text (capitalize and replace hyphens)
  const formatName = (str) => {
    return decodeURIComponent(str)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Build JSON-LD Breadcrumb List schema
  const breadcrumbListSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': window.location.origin
      },
      ...pathnames.map((name, index) => {
        const url = `${window.location.origin}/${pathnames.slice(0, index + 1).join('/')}`;
        return {
          '@type': 'ListItem',
          'position': index + 2,
          'name': formatName(name),
          'item': url
        };
      })
    ]
  };

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs-nav">
      <div className="container">
        <ol className="breadcrumbs-list" role="list">
          <li className="breadcrumbs-item">
            <Link to="/">Home</Link>
          </li>
          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const label = formatName(value);

            return (
              <li key={to} className="breadcrumbs-item" aria-current={last ? 'page' : undefined}>
                <ChevronRight size={14} className="breadcrumbs-separator" />
                {last ? (
                  <span className="breadcrumbs-current">{label}</span>
                ) : (
                  <Link to={to}>{label}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Structured SEO Schema */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbListSchema)}
      </script>
    </nav>
  );
};
export default Breadcrumbs;
