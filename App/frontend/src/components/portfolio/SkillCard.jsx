import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FiExternalLink } from 'react-icons/fi';
import SkillLevelBar from '../../pages/admin/Skills/SkillLevelBar';

const getCategoryIcon = (category) => {
  switch(category) {
    case 'Software Engineering': return 'fas fa-laptop-code';
    case 'Cloud Computing': return 'fas fa-cloud';
    case 'Data Engineering': return 'fas fa-database';
    case 'DevOps': return 'fas fa-server';
    case 'Frontend Development': return 'fab fa-html5';
    case 'Backend Development': return 'fas fa-code';
    case 'Full Stack Development': return 'fas fa-layer-group';
    case 'Mobile Development': return 'fas fa-mobile-alt';
    case 'AI/ML Engineering': return 'fas fa-robot';
    case 'Cybersecurity': return 'fas fa-shield-alt';
    case 'Embedded Systems': return 'fas fa-microchip';
    default: return 'fas fa-cog';
  }
};

const SkillCard = ({ skill }) => {
  const { theme } = useTheme();

  const getImageUrl = () => {
    if (!skill.imageUrl) return null;
    if (skill.imageUrl.startsWith('http')) {
      return skill.imageUrl;
    }
    return `http://localhost:5000${skill.imageUrl.startsWith('/') ? '' : '/'}${skill.imageUrl}`;
  };

  const imageUrl = getImageUrl();

  return (
    <div className={`relative h-full flex flex-col rounded-xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 hover:shadow-indigo-500/30 group animate-bounce-in ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/70' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
      {/* Image Section */}
      <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-gray-200 dark:bg-gray-700">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={skill.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://via.placeholder.com/300x200?text=${skill.name[0]}`;
            }}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-indigo-900/30' : 'bg-indigo-100'} transition-all duration-300 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50`}>
            {skill.icon ? (
              <i className={`${skill.icon} text-2xl ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} transition-transform duration-300 group-hover:scale-125`} />
            ) : (
              <span className={`text-4xl font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'} transition-transform duration-300 group-hover:scale-125`}>
                {skill.name[0]}
              </span>
            )}
          </div>
        )}
        {skill.documentationUrl && (
          <a 
            href={skill.documentationUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-indigo-600/80 hover:scale-110 transition-all duration-200 animate-glow"
          >
            <FiExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} transition-colors duration-300 group-hover:text-indigo-500`}>
            {skill.name}
          </h3>
          {skill.icon && imageUrl && (
            <i className={`${skill.icon} text-2xl ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} transition-transform duration-300 group-hover:scale-125`} />
          )}
        </div>

        {/* Category */}
        {skill.category && (
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <i className={`${getCategoryIcon(skill.category)} text-sm ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} transition-transform duration-300 group-hover:scale-125`} />
              <span className={`inline-block px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-indigo-600/50' : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'} transition-colors duration-200 animate-glow`}>
                {skill.category}
              </span>
            </div>
          </div>
        )}
        {/* Skill Level Bar */}
        <div className="my-3">
          <SkillLevelBar level={skill.level} theme={theme} />
        </div>

        {/* Years of Experience */}
        {skill.years > 0 && (
          <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300 group-hover:text-indigo-400`}>
            {skill.years} {skill.years === 1 ? 'year' : 'years'} of experience
          </p>
        )}

        {/* Description */}
        {skill.description && (
          <p className={`mt-auto text-sm line-clamp-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300 group-hover:text-indigo-400`}>
            {skill.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default SkillCard;