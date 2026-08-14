import React from 'react';
import { LinkedIn as Linkedin, GitHub as Github } from './SocialIcons';
import './TeamCard.css';

/**
 * TeamCard — pure CSS hover animations for performance.
 * Social overlay uses CSS transform instead of Framer Motion
 * to avoid JS-driven re-renders on every hover event.
 */
export const TeamCard = ({ name, role, image, linkedin, github }) => {
  return (
    <div className="team-card glass-card">
      <div className="team-image-wrapper">
        <img 
          src={image} 
          alt={name} 
          className="team-image" 
          width="300"
          height="300"
          loading="lazy"
          decoding="async"
        />
        <div className="team-overlay">
          <div className="team-socials">
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s LinkedIn Profile`}>
                <Linkedin size={20} />
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s GitHub Profile`}>
                <Github size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="team-info">
        <h4 className="team-name">{name}</h4>
        <p className="team-role">{role}</p>
      </div>
    </div>
  );
};

export default TeamCard;
