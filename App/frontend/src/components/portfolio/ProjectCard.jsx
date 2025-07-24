import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FiExternalLink, FiGithub, FiCalendar, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const { theme } = useTheme();

  const getImageUrl = () => {
    if (!project.imageUrl && !project.image_url) return null;
    const imgUrl = project.imageUrl || project.image_url;
    if (imgUrl.startsWith('http')) {
      return imgUrl;
    }
    return `http://localhost:5000${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
  };

  const imageUrl = getImageUrl();

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      });
    } catch {
      return null;
    }
  };

  return (
    <div className={`relative h-full flex flex-col rounded-xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 group animate-bounce-in ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/70 hover:border-indigo-500/50 hover:shadow-indigo-500/30' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-indigo-300 hover:shadow-indigo-100/50'}`}>
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute -top-2 -right-2 z-10 animate-pulse">
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${theme === 'dark' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'} transition-transform duration-300 group-hover:scale-110 animate-glow`}>
            <FiStar className="w-3 h-3" />
            Featured
          </div>
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://via.placeholder.com/400x200/6366f1/ffffff?text=${encodeURIComponent(project.title?.[0] || 'P')}`;
            }}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30' : 'bg-gradient-to-br from-indigo-100 to-purple-100'} transition-all duration-300 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50`}>
            <span className={`text-6xl font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} transition-transform duration-300 group-hover:scale-125`}>
              {project.title?.[0] || 'P'}
            </span>
          </div>
        )}
        
        {/* Overlay with links */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-3">
            {project.link && (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/90 text-gray-800 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg animate-glow"
                onClick={(e) => e.stopPropagation()}
              >
                <FiExternalLink className="w-5 h-5" />
              </a>
            )}
            {project.github && (
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/90 text-gray-800 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg animate-glow"
                onClick={(e) => e.stopPropagation()}
              >
                <FiGithub className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Status Badge */}
        {project.status && (
          <div className="absolute top-3 left-3 animate-pulse">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? (project.status === 'active' ? 'bg-green-900/80 text-green-300 border border-green-700' : project.status === 'completed' ? 'bg-blue-900/80 text-blue-300 border border-blue-700' : 'bg-gray-700/80 text-gray-300 border border-gray-600') : (project.status === 'active' ? 'bg-green-100/90 text-green-800 border border-green-200' : project.status === 'completed' ? 'bg-blue-100/90 text-blue-800 border border-blue-200' : 'bg-gray-100/90 text-gray-700 border border-gray-200')} transition-transform duration-300 group-hover:scale-110 animate-glow`}>
              <div className={`w-2 h-2 rounded-full mr-1.5 ${project.status === 'active' ? 'bg-green-500' : project.status === 'completed' ? 'bg-blue-500' : 'bg-gray-500'}`} />
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Title */}
        <h3 className={`text-xl font-bold mb-3 line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} transition-colors duration-300 group-hover:text-indigo-500`}>
          {project.title || 'Untitled Project'}
        </h3>

        {/* Description */}
        <p className={`text-sm mb-4 line-clamp-3 leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300 group-hover:text-indigo-400`}>
          {project.description || 'No description available'}
        </p>

        {/* Technologies */}
        {project.technologies && Array.isArray(project.technologies) && project.technologies.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 4).map((tech, i) => (
                <span
                  key={i}
                  className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors duration-200 ${theme === 'dark' ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-800/50 hover:bg-indigo-800/50' : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'} animate-glow`}
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'} animate-glow`}>
                  +{project.technologies.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Date */}
        {project.created_at && (
          <div className={`flex items-center gap-2 mb-4 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} transition-colors duration-300 group-hover:text-indigo-400`}>
            <FiCalendar className="w-3 h-3" />
            <span>Created {formatDate(project.created_at)}</span>
          </div>
        )}

        {/* View Details Button */}
        <div className="mt-auto">
// In ProjectCard.jsx, modify the Link component:
<Link 
  to={`/project/${project._id?.$oid || project._id}`}
  className={`inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${theme === 'dark' ? 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25'} animate-glow`}
>
  View Details
  <svg
    className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
</Link>
        </div>

        {/* Quick Action Links */}
        {(project.link || project.github) && (
          <div className="flex gap-2 mt-3">
            {project.link && (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'} animate-glow`}
                onClick={(e) => e.stopPropagation()}
              >
                <FiExternalLink className="w-3 h-3 mr-1" />
                Live Demo
              </a>
            )}
            {project.github && (
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'} animate-glow`}
                onClick={(e) => e.stopPropagation()}
              >
                <FiGithub className="w-3 h-3 mr-1" />
                Code
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;