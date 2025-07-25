import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Language options with flag emojis
  const languageOptions = [
    { value: 'fr', label: 'Français 🇫🇷' },
    { value: 'en', label: 'English 🇺🇸' },
    { value: 'ar', label: 'العربية 🇸🇦' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${theme === 'dark' ? 'bg-gray-900/70 border-cyan-500/30 text-white' : 'bg-white/70 border-indigo-300 text-indigo-900'} backdrop-blur-md`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20 relative">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center group relative z-10">
            <div className="relative w-16 h-16">
              <div className={`absolute inset-0 rounded-xl ${theme === 'dark' ? 'bg-cyan-400/20' : 'bg-indigo-400/20'} blur-md animate-pulse`}></div>
              <div className={`w-full h-full rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-[2px] bg-gradient-to-br from-indigo-500 via-cyan-400 to-purple-500 shadow-lg`}>
                <div className={`w-full h-full rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center overflow-hidden`}>
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-purple-900/10" />
                    <img 
                      src="/assets/images/logo/logo.png" 
                      alt="Logo" 
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                </div>
              </div>
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-cyan-400' : 'bg-indigo-500'} animate-bounce`}></div>
              <div className={`absolute -bottom-1 -left-1 w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'} animate-bounce delay-100`}></div>
            </div>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-10 absolute left-1/2 transform -translate-x-1/2">
            {["/", "/portfolio", "/about", "/contact"].map((path, i) => {
              const name = path === "/" ? "Home" : path.slice(1).charAt(0).toUpperCase() + path.slice(2);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`relative text-lg font-light tracking-wide transition-colors duration-300 hover:text-cyan-400`}
                >
                  {name}
                  <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-indigo-400 transition-all duration-300 transform -translate-x-1/2 group-hover:w-3/4"></span>
                </Link>
              );
            })}
            {user && (
              <Link to="/admin/dashboard" className="relative text-lg font-light tracking-wide transition-colors duration-300 hover:text-cyan-400">
                Dashboard
                <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-indigo-400 transition-all duration-300 transform -translate-x-1/2 group-hover:w-3/4"></span>
              </Link>
            )}
          </div>

          {/* Right Section with Language Selector */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`appearance-none pl-10 pr-8 py-2 rounded-full border shadow-md font-medium transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700'
                    : 'bg-white text-gray-900 border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {/* Custom Dropdown Arrow */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-indigo-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {/* Globe Icon */}
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-indigo-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden relative">
            <div className="flex flex-col space-y-6 px-6 py-4">
              {["/", "/portfolio", "/about", "/contact"].map((path) => {
                const name = path === "/" ? "Home" : path.slice(1).charAt(0).toUpperCase() + path.slice(2);
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-light tracking-wide py-2 border-b border-cyan-500/20 hover:text-cyan-400 transition-colors"
                  >
                    {name}
                  </Link>
                );
              })}
              {user && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-light tracking-wide py-2 border-b border-cyan-500/20 hover:text-cyan-400 transition-colors"
                >
                  Dashboard
                </Link>
              )}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`appearance-none pl-12 pr-8 py-3 rounded-full border shadow-md font-medium transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700'
                      : 'bg-white text-gray-900 border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {/* Custom Dropdown Arrow */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-indigo-600'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {/* Globe Icon */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className={`w-6 h-6 ${theme === 'dark' ? 'text-cyan-400' : 'text-indigo-600'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-4 p-2"
              aria-label="Close menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;