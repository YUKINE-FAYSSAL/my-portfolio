import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const NotFoundPage = () => {
  const { theme } = useTheme();
  const letters = ['N', 'O', 'T', ' ', 'F', 'O', 'U', 'N', 'D'];

  return (
    <div className={`relative min-h-screen w-full font-grotesk flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} overflow-hidden`}>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-full blur-3xl animate-pulse-slow delay-2000"></div>
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-indigo-500/50 rounded-full animate-orbit"></div>
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-purple-500/50 rounded-full animate-orbit delay-1500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8 perspective-700">
          {letters.map((letter, index) => (
            <span
              key={index}
              className={`inline-block text-6xl sm:text-8xl md:text-9xl font-extrabold animate-flip transform-origin-[0%_70%] ${theme === 'dark' ? (index % 2 === 0 ? 'text-indigo-400' : 'text-white') : (index % 2 === 0 ? 'text-indigo-600' : 'text-gray-800')} transition-all duration-300 hover:scale-110 hover:text-indigo-500`}
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              {letter}
            </span>
          ))}
        </div>
        <p className={`text-lg sm:text-xl mb-8 animate-fade-in ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-all duration-300 hover:text-indigo-400`}>
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className={`inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 animate-glow ${theme === 'dark' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-500/25' : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg hover:shadow-indigo-500/25'}`}
        >
          Back to Home
          <svg
            className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;