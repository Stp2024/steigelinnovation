import React from 'react';

/**
 * Reusable Structured Data (JSON-LD) Component
 * Renders one or multiple Schema.org JSON-LD scripts
 */
export const StructuredData = ({ data }) => {
  if (!data) return null;
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      ))}
    </>
  );
};

export default StructuredData;
