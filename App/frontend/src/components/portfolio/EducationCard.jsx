import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { FiExternalLink, FiCalendar, FiMapPin, FiAward, FiStar } from 'react-icons/fi';

const EducationCard = ({ education }) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch {
      return dateString;
    }
  };

  const getEducationIcon = (degree) => {
    if (!degree) return 'fas fa-graduation-cap';
    const degreeString = degree.toLowerCase();
    if (degreeString.includes('phd') || degreeString.includes('doctorate') || degreeString.includes('master')) {
      return 'fas fa-award';
    }
    return 'fas fa-graduation-cap';
  };

  const getImageUrl = () => {
    if (!education.image_url) return null;
    if (education.image_url.startsWith('http')) return education.image_url;
    return `http://localhost:5000${education.image_url.startsWith('/') ? '' : '/'}${education.image_url}`;
  };

  const imageUrl = getImageUrl();

  return (
    <Link
      to={`/education/${education._id?.$oid || education._id}`}
      className="block"
    >
      <div 
        className={`relative w-full max-w-sm mx-auto h-[28rem] flex flex-col rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group max-h-[24rem] ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700 text-gray-200' : 'bg-white/90 border-gray-200 text-gray-800'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {education.featured && (
          <div className="absolute top-3 right-3 z-10">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-yellow-500/90 text-white' : 'bg-yellow-400/90 text-white'}`}>
              <FiStar className="w-3 h-3 mr-1" />
              Featured
            </span>
          </div>
        )}

        <div className="relative h-40 w-full overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={education.institution || 'Institution'}
              className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://via.placeholder.com/300x160/${theme === 'dark' ? '374151' : 'e5e7eb'}/6366f1?text=${encodeURIComponent((education.institution || 'E')[0].toUpperCase())}`;
              }}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <i className={`${getEducationIcon(education.degree)} text-3xl ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
          )}
        </div>

        <div className="flex-1 p-4 flex flex-col space-y-2 ">
          <h3 className={`text-lg font-semibold line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {education.degree || 'Education'}
          </h3>
          <div className="flex items-center gap-2 ">
            <FiMapPin className={`w-3 h-3 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>
              {education.institution || 'Institution not specified'}
            </p>
          </div>
          {education.field_of_study && (
            <p className={`text-xs line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {education.field_of_study}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiCalendar className="w-3 h-3" />
            <span>{formatDate(education.start_date)} - {formatDate(education.end_date)}</span>
          </div>
          {education.gpa && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FiAward className={`w-3 h-3 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              <span>GPA: {education.gpa}</span>
            </div>
          )}
          {education.courses && education.courses.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {education.courses.slice(0, 3).map((course, index) => (
                <span
                  key={index}
                  className={`px-2 py-0.5 text-xs rounded-full ${theme === 'dark' ? 'bg-gray-700/50 text-gray-300 border border-gray-600' : 'bg-gray-100/50 text-gray-700 border border-gray-200'}`}
                >
                  {course}
                </span>
              ))}
              {education.courses.length > 3 && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${theme === 'dark' ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100/50 text-gray-600'}`}>
                  +{education.courses.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {education.description && (
          <div className={`absolute inset-0 bg-black bg-opacity-80 text-white p-4 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <p className="text-sm text-center">{education.description}</p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default EducationCard;