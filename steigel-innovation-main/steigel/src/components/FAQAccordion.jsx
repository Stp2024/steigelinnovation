import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './FAQAccordion.css';

const faqItems = [
  {
    question: 'What services does Steigel Innovations specialize in?',
    answer: 'Steigel Innovations specializes in high-performance Web Development, high-fidelity UI/UX Design, Graphic Design, Technical SEO optimization, Digital Marketing, Copywriting, and custom Enterprise Software Solutions (SaaS/ERPs).'
  },
  {
    question: 'How long does a typical website development project take?',
    answer: 'Project timelines vary based on complexity. A standard corporate website takes 4-6 weeks, while complex full-stack applications or custom SaaS software solutions take 8-12 weeks. We map out strict delivery timelines during our planning phase.'
  },
  {
    question: 'Do you offer post-launch support and hosting maintenance?',
    answer: 'Yes, we provide monthly maintenance retainers covering 24/7 technical assistance, scheduled database backups, security patches, plugin audits, speed optimizations, and dynamic content updates.'
  },
  {
    question: 'What technologies do you utilize for custom software?',
    answer: 'We build on high-performance frameworks including React, Vite, Node.js, Go, Python, PostgreSQL, and deploy using scalable cloud infrastructure (AWS/GCP) to guarantee speed, accessibility, and robust security.'
  }
];

export const FAQAccordion = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFaqs = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="faq-wrapper">
      {/* Live Search Bar */}
      <div className="faq-search-box">
        <Search className="faq-search-icon" size={20} />
        <input
          type="text"
          className="faq-search-input"
          placeholder="Search frequently asked questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search FAQs"
        />
      </div>

      {/* Accordion Group */}
      {filteredFaqs.length > 0 ? (
        <div className="accordion" role="presentation">
          {filteredFaqs.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div key={index} className={`accordion-item ${isOpen ? 'active' : ''}`}>
                <button
                  type="button"
                  className="accordion-header"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <span className="accordion-question">{item.question}</span>
                  <span className="accordion-icon">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="accordion-collapse"
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                    >
                      <div className="accordion-body">
                        <p>{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="faq-no-results">No questions matched your search query. Please try another keyword.</p>
      )}
    </div>
  );
};
export default FAQAccordion;
