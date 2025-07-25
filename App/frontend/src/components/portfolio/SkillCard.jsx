import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FiExternalLink } from 'react-icons/fi';
import SkillLevelBar from '../../pages/admin/Skills/SkillLevelBar';

const SkillCard = ({ skill }) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const getImageUrl = () => {
    if (!skill.imageUrl) return null;
    if (skill.imageUrl.startsWith('http')) return skill.imageUrl;
    return `http://localhost:5000${skill.imageUrl.startsWith('/') ? '' : '/'}${skill.imageUrl}`;
  };

  const imageUrl = getImageUrl();

  const getCategoryColor = () => {
    const colors = {
      'Software Engineering': 'bg-blue-500',
      'Cloud Computing': 'bg-purple-500',
      'Data Engineering': 'bg-red-500',
      'DevOps': 'bg-green-500',
      'Frontend Development': 'bg-yellow-500',
      'Backend Development': 'bg-indigo-500',
      'Full Stack Development': 'bg-pink-500',
      'Mobile Development': 'bg-teal-500',
      'AI/ML Engineering': 'bg-orange-500',
      'Cybersecurity': 'bg-cyan-500',
      'Embedded Systems': 'bg-amber-500',
    };
    return colors[skill.category] || 'bg-gray-500';
  };

  return (
    <div 
      className={`relative h-full flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-300 hover:shadow-xl ${theme === 'dark' ? 'bg-gray-800/50 border border-gray-700 text-gray-200' : 'bg-white border border-gray-200 text-gray-800'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon/Image Section */}
      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${getCategoryColor()} bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300 overflow-hidden ${isHovered ? 'scale-90' : 'scale-100'}`}>
        {skill.icon ? (
          <i className={`${skill.icon} text-4xl ${theme === 'dark' ? 'text-white' : 'text-gray-800'} transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`} />
        ) : imageUrl ? (
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt={skill.name} 
              className={`w-full h-full object-contain p-2 transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://via.placeholder.com/150/${theme === 'dark' ? '374151' : 'e5e7eb'}/6366f1?text=${skill.name[0]}`;
              }}
            />
          </div>
        ) : (
          <span className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
            {skill.name[0]}
          </span>
        )}
      </div>

      {/* Skill Name */}
      <h3 className={`text-xl font-bold mb-2 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        {skill.name}
      </h3>

      {/* Description (shown on hover) */}
      {skill.description && (
        <div className={`absolute inset-0 flex items-center justify-center p-4 rounded-xl bg-black bg-opacity-80 text-white text-sm text-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {skill.description}
        </div>
      )}

      {/* Category */}
      {skill.category && (
        <span className={`text-xs px-3 py-1 rounded-full mb-3 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
          {skill.category}
        </span>
      )}

      {/* Skill Level */}
      <div className="w-full mb-2">
        <SkillLevelBar level={skill.level} theme={theme} />
      </div>

      {/* Documentation Link */}
      {skill.documentationUrl && (
        <a 
          href={skill.documentationUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`mt-2 text-sm flex items-center ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
        >
          <FiExternalLink className="mr-1" />
          Documentation
        </a>
      )}
    </div>
  );
};

export default SkillCard;