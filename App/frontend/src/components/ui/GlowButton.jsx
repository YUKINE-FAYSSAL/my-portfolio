import React from 'react';
import { Link } from 'react-router-dom';

const GlowButton = ({ 
  to, 
  text, 
  theme, 
  className = '', 
  onClick 
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative group ${className}`}
    >
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-all duration-500 ${theme === 'dark' ? '' : 'group-hover:from-indigo-500 group-hover:to-purple-500'}`}></div>
      <div className={`relative px-6 py-3 bg-gradient-to-r ${theme === 'dark' ? 'from-indigo-900/90 to-purple-900/90' : 'from-indigo-600 to-purple-600'} rounded-lg text-white font-medium group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300 flex items-center justify-center`}>
        <span className="relative z-10">
          {text}
        </span>
        <svg 
          className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </Link>
  );
};

export default GlowButton;