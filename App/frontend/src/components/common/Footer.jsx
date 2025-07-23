import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { FiGithub, FiLinkedin, FiMail, FiPhone, FiFacebook, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast('success', 'Logged out successfully');
  };

  return (
    <footer className={`mt-auto ${theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-indigo-900 text-white'} pb-20 md:pb-0`}>
      <div className="container mx-auto px-4 max-w-6xl py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Left Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-light leading-snug">
              Let's create something<br />
              <span className="font-medium">extraordinary</span> together.
            </h3>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                <FiMail size={18} />
                Get In Touch
              </Link>
              <Link
                to="/portfolio"
                className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 border-gray-600'
                    : 'bg-white hover:bg-gray-100 border-indigo-200 text-indigo-800'
                }`}
              >
                View My Work
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="grid grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Contact</h4>
              <div className="space-y-2 text-sm">
                <a href="tel:+212694487224" className="flex items-center gap-2 hover:text-indigo-300 transition-colors">
                  <FiPhone size={16} />
                  +212 694 487 224
                </a>
                <a href="mailto:abaibat.fayssal@hotmail.com" className="flex items-center gap-2 hover:text-indigo-300 transition-colors">
                  <FiMail size={16} />
                  abaibat.fayssal@hotmail.com
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Connect</h4>
              <div className="flex gap-4 flex-wrap">
                <a
                  href="https://github.com/YUKINE-FAYSSAL"
                  className="p-2 rounded-full hover:bg-indigo-800 transition-colors"
                  aria-label="GitHub"
                >
                  <FiGithub size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/fayssal-abaibat-28b5a3353/"
                  className="p-2 rounded-full hover:bg-indigo-800 transition-colors"
                  aria-label="LinkedIn"
                >
                  <FiLinkedin size={20} />
                </a>
                <a
                  href="https://www.facebook.com/fayssal.abaibat"
                  className="p-2 rounded-full hover:bg-indigo-800 transition-colors"
                  aria-label="Facebook"
                >
                  <FiFacebook size={20} />
                </a>
                <a
                  href="https://www.instagram.com/fay55al/"
                  className="p-2 rounded-full hover:bg-indigo-800 transition-colors"
                  aria-label="Instagram"
                >
                  <FiInstagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© {new Date().getFullYear()} YUKINEE. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            {user ? (
              <button
                onClick={handleLogout}
                className="hover:text-indigo-300 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="hover:text-indigo-300 transition-colors">
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
