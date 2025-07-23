import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const QuickActions = () => {
  const { theme } = useTheme();
  const actions = [
    { title: 'Add Skill', path: '/admin/skills/add', icon: '🎯' },
    { title: 'Add Project', path: '/admin/projects/add', icon: '🚀' },
    { title: 'Add Certificate', path: '/admin/certificates/add', icon: '🏆' },
    { title: 'Add Experience', path: '/admin/experience/add', icon: '💼' }
  ];

  return (
    <div className={`p-6 rounded-xl shadow-sm transition-all ${
      theme === 'dark' 
        ? 'bg-gray-800 hover:shadow-gray-700/50' 
        : 'bg-white hover:shadow-gray-300/50'
    }`}>
      <h2 className={`text-xl font-semibold mb-6 ${
        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
      }`}>
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
              theme === 'dark'
                ? 'hover:bg-gray-700/80 border-gray-700'
                : 'hover:bg-indigo-50 border-gray-200'
            } border`}
          >
            <span className="text-2xl mb-3">{action.icon}</span>
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {action.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;