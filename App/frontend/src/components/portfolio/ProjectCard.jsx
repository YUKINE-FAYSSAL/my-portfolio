import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FiExternalLink, FiGithub, FiCalendar, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProjectCard = ({ project }) => {
  const { theme } = useTheme();

  const getImageUrl = () => {
    if (!project.imageUrl && !project.image_url) return null;
    const imgUrl = project.imageUrl || project.image_url;
    if (imgUrl.startsWith('http')) return imgUrl;
    return `http://localhost:5000${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
  };

  const imageUrl = getImageUrl();

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Date not specified' : 
        date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short',
          day: 'numeric'
        });
    } catch {
      return 'Date not specified';
    }
  };

  return (
    <Link
      to={`/project/${project._id?.$oid || project._id}`}
      className="block"
    >
      <motion.div 
        whileHover={{ y: -5 }}
        className={`relative w-full h-full flex flex-col rounded-xl border overflow-hidden transition-all duration-300 group cursor-pointer ${
          theme === 'dark' 
            ? 'bg-gray-800/80 border-gray-700 text-gray-200' 
            : 'bg-white/90 border-gray-200 text-gray-800'
        }`}
      >
        {/* Featured Badge */}
        {project.featured && (
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ 
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 1.5
            }}
            className="absolute top-3 right-3 z-10"
          >
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              theme === 'dark' 
                ? 'bg-yellow-500/90 text-white' 
                : 'bg-yellow-400/90 text-white'
            }`}>
              <FiStar className="w-3 h-3 mr-1" />
              Featured
            </span>
          </motion.div>
        )}

        {/* Image Section */}
        <div className="relative h-40 w-full overflow-hidden">
          {imageUrl ? (
            <motion.img
              src={imageUrl}
              alt={project.title || 'Project image'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              initial={{ opacity: 0.9 }}
              whileHover={{ opacity: 1 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://via.placeholder.com/300x160/${
                  theme === 'dark' ? '374151' : 'e5e7eb'
                }/6366f1?text=${encodeURIComponent(
                  (project.title || 'P')[0].toUpperCase()
                )}`;
              }}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <span className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
              }`}>
                {(project.title || 'P')[0].toUpperCase()}
              </span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            {project.link && (
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white transition-all duration-200 shadow-sm"
                title="Visit Project"
                onClick={(e) => e.stopPropagation()}
              >
                <FiExternalLink className="w-3 h-3" />
              </motion.a>
            )}
            {project.github && (
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white transition-all duration-200 shadow-sm"
                title="GitHub Repository"
                onClick={(e) => e.stopPropagation()}
              >
                <FiGithub className="w-3 h-3" />
              </motion.a>
            )}
          </div>
          
          {/* Status Badge */}
          {project.status && (
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                theme === 'dark'
                  ? project.status === 'active'
                    ? 'bg-green-900/80 text-green-300'
                    : project.status === 'completed'
                    ? 'bg-blue-900/80 text-blue-300'
                    : 'bg-gray-700/80 text-gray-300'
                  : project.status === 'active'
                  ? 'bg-green-100/90 text-green-800'
                  : project.status === 'completed'
                  ? 'bg-blue-100/90 text-blue-800'
                  : 'bg-gray-100/90 text-gray-700'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-1 ${
                  project.status === 'active'
                    ? 'bg-green-500'
                    : project.status === 'completed'
                    ? 'bg-blue-500'
                    : 'bg-gray-500'
                }`} />
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 flex flex-col space-y-3">
          <h3 className={`text-lg font-semibold line-clamp-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {project.title || 'Untitled Project'}
          </h3>
          
          <p className={`text-sm line-clamp-[2.5] ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {project.description || 'No description available'}
          </p>
          
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {project.technologies.slice(0, 3).map((tech, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    theme === 'dark'
                      ? 'bg-gray-700/50 text-gray-300 border border-gray-600'
                      : 'bg-gray-100/50 text-gray-700 border border-gray-200'
                  }`}
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  theme === 'dark'
                    ? 'bg-gray-700/50 text-gray-400'
                    : 'bg-gray-100/50 text-gray-600'
                }`}>
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          )}
          
          <div className={`flex items-center gap-2 text-xs mt-auto pt-2 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <FiCalendar className="w-3 h-3 flex-shrink-0" />
            <span>{formatDate(project.created_at)}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProjectCard;