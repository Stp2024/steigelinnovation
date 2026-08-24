import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, BookOpen, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';
import { blogsData } from '../data/blogsData';
import './Blogs.css';

export const Blogs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Technology', 'SEO', 'Digital Marketing', 'Startup', 'React'];

  // Filter posts
  const filteredBlogs = blogsData.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const blogsSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'Steigel Innovations Insights',
    'description': 'Articles and strategy guides on React performance, technical SEO structure, UI/UX aesthetics, and growth marketing.',
    'publisher': {
      '@type': 'Organization',
      'name': 'Steigel Innovations'
    },
    'blogPost': filteredBlogs.map((post) => ({
      '@type': 'BlogPosting',
      'headline': post.title,
      'description': post.excerpt,
      'datePublished': post.date,
      'author': {
        '@type': 'Person',
        'name': post.author.split(',')[0]
      }
    }))
  };

  return (
    <>
      <SEO 
        title="Corporate Blogs & Technology Insights"
        description="Read articles from Steigel Innovations on React compiler setups, Technical SEO architectures, luxury glassmorphism styles, and conversion marketing."
        schemaMarkup={blogsSchema}
      />

      <section className="section-padding" style={{ background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)', textAlign: 'center' }}>
        <div className="container">
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <span style={{ color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>Publications</span>
            <h1 className="text-gradient-gold" style={{ marginTop: '0.75rem', marginBottom: '1.25rem', fontSize: '3.5rem', fontFamily: 'var(--font-heading)' }}>
              Steigel Knowledge Base
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Deep dive into code performance optimizations, design systems, and SEO metrics.
            </p>
          </div>
        </div>
      </section>

      {/* Main Blog Catalog Container */}
      <section className="section-padding" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="blogs-filters-container">
            {/* Live Search */}
            <div className="blogs-search-box">
              <Search className="blogs-search-icon" size={18} />
              <input
                type="text"
                className="blogs-search-input"
                placeholder="Search articles by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search Articles"
              />
            </div>

            {/* Category Chips */}
            <div className="blogs-category-chips" role="tablist" aria-label="Article categories">
              {categories.map((category) => (
                <button
                  key={category}
                  role="tab"
                  aria-selected={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                  className={`blogs-category-chip ${selectedCategory === category ? 'active' : ''}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blogs Grid */}
          {filteredBlogs.length > 0 ? (
            <div className="blogs-catalog-grid">
              {filteredBlogs.map((post) => (
                <article key={post.id} className="blog-catalog-card glass-card">
                  <div className="blog-catalog-badge">{post.category}</div>
                  <div className="blog-catalog-content">
                    <div className="blog-catalog-meta">
                      <span className="blog-meta-item"><Calendar size={14} /> {post.date}</span>
                      <span className="blog-meta-item"><BookOpen size={14} /> {post.readTime}</span>
                    </div>
                    <h2 className="blog-catalog-title">
                      <Link to={`/blogs/${post.id}`}>{post.title}</Link>
                    </h2>
                    <p className="blog-catalog-excerpt">{post.excerpt}</p>
                    <div className="blog-catalog-footer" style={{ justifyContent: 'flex-end' }}>
                      <Link to={`/blogs/${post.id}`} className="blog-read-more">
                        Read Article <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="blogs-no-results">
              <p>No articles matched your active filters or query. Please adjust your keywords.</p>
            </div>
          )}

          {/* crawlable SEO pagination links */}
          <nav className="blogs-pagination" aria-label="Pagination Navigation">
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Page 1 of 1</span>
          </nav>
        </div>
      </section>
    </>
  );
};
export default Blogs;
