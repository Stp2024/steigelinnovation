import React, { useState, useEffect } from 'react';

export const StatCounter = ({ target, duration = 2000, suffix = '', title }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    // Check if target is a number
    const targetNum = parseInt(target, 10);
    if (isNaN(targetNum)) {
      setCount(target);
      return;
    }

    const incrementTime = Math.floor(duration / targetNum);
    const step = Math.ceil(targetNum / (duration / 30)); // Step size for smooth animation

    const timer = setInterval(() => {
      start += step;
      if (start >= targetNum) {
        setCount(targetNum);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <div className="stat-card glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
      <h3 className="text-gradient-gold" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem' }}>
        {count}
        {suffix}
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </p>
    </div>
  );
};
export default StatCounter;
