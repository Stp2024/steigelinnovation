import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import './TestimonialSlider.css';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'CEO',
    company: 'NovaSphere',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120&fm=webp',
    review: 'Steigel Innovations transformed our outdated platform into a high-performance, glassmorphic SaaS interface. Their development team demonstrates incredible speed and code cleanliness. A truly premium partnership!'
  },
  {
    name: 'Rajiv Patel',
    role: 'Product Director',
    company: 'Fintech India',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120&fm=webp',
    review: 'The technical SEO and structured schema optimizations delivered by Steigel boosted our organic search acquisitions by 240% within four months. Their attention to Google Core Web Vitals is outstanding.'
  },
  {
    name: 'Elena Rostova',
    role: 'Founder',
    company: 'ArtHaus Gallery',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120&fm=webp',
    review: 'Steigels graphic designers created a breathtaking brand identity system that translates perfectly across print and web mediums. They capture luxury, minimalist corporate aesthetics like no other agency.'
  },
  {
    name: 'Marcus Aurel',
    role: 'VP of Engineering',
    company: 'CloudFlux Systems',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120&fm=webp',
    review: 'From drafting standard NDA agreements to writing modular React repositories, Steigel Innovations functions with a level of rigor and organization that makes outsourcing a breeze. High recommended!'
  }
];

export const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, autoplay]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div 
      className="testimonial-container"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      {/* Testimonial Card */}
      <div className="testimonial-card glass-card">
        <div className="testimonial-header">
          <div className="testimonial-client-info">
            <img 
              src={testimonials[currentIndex].image} 
              alt={testimonials[currentIndex].name} 
              className="testimonial-image"
              width="60"
              height="60"
              loading="lazy"
            />
            <div>
              <h4 className="testimonial-name">{testimonials[currentIndex].name}</h4>
              <p className="testimonial-company">{testimonials[currentIndex].role}, {testimonials[currentIndex].company}</p>
            </div>
          </div>
          <div className="testimonial-rating" aria-label={`Rated ${testimonials[currentIndex].rating} out of 5 stars`}>
            {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
              <Star key={i} size={16} fill="var(--accent)" stroke="var(--accent)" />
            ))}
          </div>
        </div>
        <blockquote className="testimonial-quote">
          "{testimonials[currentIndex].review}"
        </blockquote>
      </div>

      {/* Navigational Controls */}
      <div className="testimonial-controls">
        <button 
          onClick={handlePrev} 
          className="testimonial-control-btn" 
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`testimonial-dot ${currentIndex === index ? 'active' : ''}`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        <button 
          onClick={handleNext} 
          className="testimonial-control-btn" 
          aria-label="Next testimonial"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
export default TestimonialSlider;
