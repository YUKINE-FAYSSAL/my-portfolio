import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const StatsCard = ({ title, value, icon, onClick }) => {
  const { theme } = useTheme();

  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-xl transition-all hover:-translate-y-1 cursor-pointer border-l-4 ${
        theme === 'dark'
          ? 'bg-gray-800 hover:bg-gray-700/80 border-indigo-500'
          : 'bg-white hover:bg-gray-50 border-indigo-400'
      } shadow-sm hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium mb-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {title}
          </p>
          <h3 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
            {value}
          </h3>
        </div>
        <span className={`text-3xl ${
          theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
        }`}>
          {icon}
        </span>
      </div>
    </div>
  );
};

export default StatsCard;