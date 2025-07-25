import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FiExternalLink, FiCalendar, FiMapPin, FiBriefcase } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ExperienceCard = ({ experience }) => {
  const { theme } = useTheme();

  const getImageUrl = () => {
    if (!experience.imageUrl && !experience.image_url) return null;
    const imgUrl = experience.imageUrl || experience.image_url;
    if (imgUrl.startsWith('http')) return imgUrl;
    return `http://localhost:5000${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
  };

  const getExperienceId = () => {
    if (experience._id?.$oid) return experience._id.$oid;
    if (typeof experience._id === 'string') return experience._id;
    if (experience._id) return experience._id.toString();
    if (experience.id) return experience.id;
    return null;
  };

  const imageUrl = getImageUrl();
  const experienceId = getExperienceId();

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch {
      return null;
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return null;
    if (typeof duration === 'string') return duration;
    if (duration.start && duration.end) {
      return `${formatDate(duration.start)} - ${formatDate(duration.end)}`;
    }
    return null;
  };

  if (!experienceId) {
    console.warn('ExperienceCard: No valid ID found for experience:', experience);
    return null;
  }

  return (
    <Link
      to={`/experience/${experienceId}`}
      className="block"
    >
      <div className={`relative w-full max-w-sm mx-auto h-[28rem] flex flex-col rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700 text-gray-200' : 'bg-white/90 border-gray-200 text-gray-800'}`}>
        {/* Current Position Badge */}
        {experience.current && (
          <div className="absolute top-3 right-3 z-10">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-emerald-500/90 text-white' : 'bg-emerald-400/90 text-white'}`}>
              Current
            </span>
          </div>
        )}

        {/* Image Section */}
        <div className="relative h-40 w-full overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={experience.company}
              className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://via.placeholder.com/300x160/${theme === 'dark' ? '374151' : 'e5e7eb'}/6366f1?text=${encodeURIComponent((experience.company || 'E')[0].toUpperCase())}`;
              }}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                {(experience.company || 'E')[0].toUpperCase()}
              </span>
            </div>
          )}
          {experience.website && (
            <a
              href={experience.website}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white transition-all duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <FiExternalLink className="w-3 h-3" />
            </a>
          )}
          {experience.employmentType && (
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? (experience.employmentType === 'Full-time' ? 'bg-blue-900/80 text-blue-300' : experience.employmentType === 'Part-time' ? 'bg-purple-900/80 text-purple-300' : 'bg-gray-700/80 text-gray-300') : (experience.employmentType === 'Full-time' ? 'bg-blue-100/90 text-blue-800' : experience.employmentType === 'Part-time' ? 'bg-purple-100/90 text-purple-800' : 'bg-gray-100/90 text-gray-700')}`}>
                <FiBriefcase className="w-3 h-3 mr-1" />
                {experience.employmentType}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 flex flex-col space-y-2">
          <h3 className={`text-lg font-semibold line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {experience.position || 'Professional Experience'}
          </h3>
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>
            {experience.company || 'Company'}
          </p>
          <p className={`text-xs line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {experience.description || 'No description available'}
          </p>
          {(experience.duration || experience.startDate) && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FiCalendar className="w-3 h-3" />
              <span>
                {formatDuration(experience.duration) || (experience.startDate && formatDate(experience.startDate))}
              </span>
            </div>
          )}
          {experience.location && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FiMapPin className="w-3 h-3" />
              <span>{experience.location}</span>
            </div>
          )}
          {experience.technologies && Array.isArray(experience.technologies) && experience.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {experience.technologies.slice(0, 3).map((tech, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 text-xs rounded-full ${theme === 'dark' ? 'bg-gray-700/50 text-gray-300 border border-gray-600' : 'bg-gray-100/50 text-gray-700 border border-gray-200'}`}
                >
                  {tech}
                </span>
              ))}
              {experience.technologies.length > 3 && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${theme === 'dark' ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100/50 text-gray-600'}`}>
                  +{experience.technologies.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ExperienceCard;