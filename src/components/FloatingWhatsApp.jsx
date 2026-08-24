import React from 'react';
import { MessageSquareText } from 'lucide-react';
import './FloatingWhatsApp.css';

export const FloatingWhatsApp = () => {
  const whatsappNumber = '919449446793'; // Real company contact
  const message = encodeURIComponent("Hello Steigel Innovations! I would like to inquire about your web development and design services.");
  const waUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float-btn"
      aria-label="Contact Steigel Innovations on WhatsApp"
      title="Contact Steigel Innovations on WhatsApp"
    >
      <MessageSquareText size={24} />
      <span className="whatsapp-tooltip">Chat with us</span>
      <span className="whatsapp-pulse" aria-hidden="true" />
    </a>
  );
};
export default FloatingWhatsApp;
