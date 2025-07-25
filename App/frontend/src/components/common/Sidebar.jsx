import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import {
  FiGrid,
  FiCode,
  FiLayers,
  FiBriefcase,
  FiBook,
  FiAward,
  FiMail, // Added for Messages
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiX,
} from 'react-icons/fi';

const Sidebar = () => {
  const { theme } = useTheme();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsCollapsed(false);
        setIsExpanded(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { path: '/admin/dashboard', icon: <FiGrid />, name: 'Dashboard' },
    { path: '/admin/skills', icon: <FiCode />, name: 'Skills' },
    { path: '/admin/projects', icon: <FiLayers />, name: 'Projects' },
    { path: '/admin/experience', icon: <FiBriefcase />, name: 'Experience' },
    { path: '/admin/education', icon: <FiBook />, name: 'Education' },
    { path: '/admin/certificates', icon: <FiAward />, name: 'Certificates' },
    { path: '/admin/messages', icon: <FiMail />, name: 'Messages' }, // Added Messages
  ];

  const getNavItemClass = (isActive) => {
    if (theme === 'dark') {
      return isActive
        ? 'bg-indigo-600 text-white'
        : 'hover:bg-gray-700 text-gray-300';
    } else {
      return isActive
        ? 'bg-indigo-100 text-indigo-700'
        : 'hover:bg-gray-100 text-gray-700';
    }
  };

  const renderNavItemDesktop = (item) => {
    const isActive = location.pathname === item.path;
    const baseClasses = 'flex items-center p-3 rounded-lg transition-all cursor-pointer select-none';
    const classes = getNavItemClass(isActive);

    return (
      <NavLink
        to={item.path}
        className={`${baseClasses} ${classes}`}
        key={item.path}
      >
        <span className={`flex-shrink-0 text-lg ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
          {item.icon}
        </span>
        {!isCollapsed && <span className="font-medium truncate">{item.name}</span>}
      </NavLink>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`
          fixed top-20 left-0 bottom-0 z-30
          ${isCollapsed ? 'w-20' : 'w-64'}
          hidden md:flex flex-col
          transition-width duration-300 ease-in-out
        `}
        style={{ height: 'calc(100vh - 5rem)' }}
      >
        <div
          className={`h-full flex flex-col relative overflow-hidden
            ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}
            border-r shadow-xl
          `}
        >
          {/* Background Image + Effects */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/sidebar/bg.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: theme === 'dark' ? 'brightness(0.3)' : 'brightness(0.8)',
              opacity: 0.15
            }}
          />
          <div className="absolute top-10 left-5 w-48 h-48 bg-indigo-800/10 rounded-full blur-3xl z-0" />
          <div className="absolute bottom-10 right-5 w-32 h-32 bg-purple-800/10 rounded-full blur-3xl z-0" />
          <div className="absolute inset-0 grid grid-cols-6 opacity-5 pointer-events-none z-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-r border-cyan-500"></div>
            ))}
          </div>
          <div className="absolute inset-0 grid grid-rows-12 opacity-5 pointer-events-none z-0">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-b border-cyan-500"></div>
            ))}
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto py-4 px-2 relative z-10">
            <ul className="space-y-1">
              {navItems.map(renderNavItemDesktop)}
            </ul>
          </nav>

          <div
            className="p-4 border-t flex justify-end border-gray-200 dark:border-gray-700 relative z-10"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-2 rounded-full transition-colors
                ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}
              `}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobile && (
        <div
          className={`
            fixed bottom-0 left-0 z-50
            flex flex-col items-center
            ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}
            border-t shadow-xl
            transition-all duration-300
            ${isExpanded ? 'w-64 h-screen pt-10' : 'w-16 h-16 rounded-t-lg'}
          `}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {/* Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              mb-4 p-2 rounded-full focus:outline-none
              bg-indigo-600 text-white hover:bg-indigo-700 transition-colors
            `}
            aria-label={isExpanded ? 'Collapse menu' : 'Expand menu'}
          >
            {isExpanded ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Nav Items */}
          <nav className="flex flex-col space-y-2 w-full relative z-10">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center cursor-pointer rounded-lg px-3 py-2 transition-colors
                    ${getNavItemClass(isActive)}
                    ${isExpanded ? 'justify-start' : 'justify-center'}
                  `}
                  onClick={() => setIsExpanded(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isExpanded && (
                    <span className="ml-3 font-medium truncate">{item.name}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
};

export default Sidebar;