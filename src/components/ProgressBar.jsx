import React from 'react';

export const ProgressBar = ({ progress, label, color = 'var(--text-primary)' }) => {
  const percentage = Math.min(Math.max(Math.round(progress), 0), 100);

  return (
    <div style={{ margin: '0.75rem 0', width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8rem', fontWeight: 600 }}>
          <span>{label}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: 'var(--hover-bg)',
        borderRadius: '4px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: '4px',
          transition: 'width 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
        }} />
      </div>
    </div>
  );
};

export default ProgressBar;
