import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, BookOpen, ArrowLeft, Tag } from 'lucide-react';
import SEO from '../components/SEO';
import { blogsData } from '../data/blogsData';

export const BlogDetail = () => {
  const { id } = useParams();

  // Find the post
  const post = blogsData.find((item) => item.id === id);

  if (!post) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>Article Not Found</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          The publication you are trying to access does not exist or has been relocated.
        </p>
        <Link to="/blogs" className="btn btn-primary">
          Back to Knowledge Base
        </Link>
      </div>
    );
  }

  // Structured schemas
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.excerpt,
    'datePublished': post.date,
    'author': {
      '@type': 'Person',
      'name': post.author.split(',')[0],
      'jobTitle': post.author.split(',')[1] || 'Writer'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Steigel Innovations',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://steigel.com/assets/logo.png'
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${window.location.origin}/blogs/${post.id}`
    }
  };

  return (
    <>
      <SEO 
        title={post.title}
        description={post.excerpt}
        canonicalUrl={`${window.location.origin}/blogs/${post.id}`}
        ogType="article"
        schemaMarkup={blogPostingSchema}
      />

      <article className="section-padding" style={{ minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          {/* Back button */}
          <Link to="/blogs" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: '2.5rem',
            transition: 'color var(--transition-fast)'
          }}
          className="back-btn-hover"
          >
            <ArrowLeft size={16} /> Back to Publications
          </Link>

          {/* Article Header Metadata */}
          <header style={{ marginBottom: '3rem' }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: 'rgba(212, 175, 106, 0.15)',
              border: '1px solid rgba(212, 175, 106, 0.3)',
              color: 'var(--accent)',
              padding: '0.35rem 1rem',
              borderRadius: '30px',
              fontSize: '0.8rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1.5rem'
            }}>
              {post.category}
            </span>

            <h1 style={{ fontSize: '2.8rem', lineHeight: '1.2', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
              {post.title}
            </h1>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
              padding: '1rem 0'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Calendar size={15} /> {post.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><BookOpen size={15} /> {post.readTime}</span>
            </div>
          </header>

          {/* Article Body Content */}
          <div 
            style={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: 'var(--text-secondary)'
            }}
            className="blog-body-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Article Tags */}
          <footer style={{
            marginTop: '4rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <Tag size={16} color="var(--accent)" style={{ marginRight: '0.25rem' }} />
            {post.tags.map((tag) => (
              <span key={tag} style={{
                fontSize: '0.85rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                padding: '0.25rem 0.75rem',
                borderRadius: '6px',
                fontWeight: '500'
              }}>
                #{tag}
              </span>
            ))}
          </footer>
        </div>
      </article>

      {/* Styled Inline overrides for blog elements */}
      <style>{`
        .blog-body-content h3 {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          margin: 2.5rem 0 1rem;
          color: var(--text-primary);
        }
        .blog-body-content p {
          margin-bottom: 1.5rem;
          color: var(--text-secondary);
        }
        .blog-body-content pre {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.25rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .blog-body-content code {
          font-family: monospace;
          color: var(--accent);
          font-size: 0.95rem;
        }
        .back-btn-hover:hover {
          color: var(--accent) !important;
        }
      `}</style>
    </>
  );
};
export default BlogDetail;
