import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { ExternalLink, Calendar, MapPin, Award, Star, GraduationCap } from 'lucide-react';

const EducationCard = ({ education }) => {
  const { theme } = useTheme();

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
    } catch {
      return dateString;
    }
  };

  const getEducationIcon = (degree) => {
    if (!degree) return <GraduationCap size={48} className="text-indigo-500" />;
    const degreeString = degree.toLowerCase();
    if (degreeString.includes('phd') || degreeString.includes('doctorate')) {
      return <Award size={48} className="text-indigo-500" />;
    }
    if (degreeString.includes('master')) {
      return <Award size={48} className="text-indigo-500" />;
    }
    if (degreeString.includes('bachelor') || degreeString.includes('diploma') || degreeString.includes('certificate')) {
      return <GraduationCap size={48} className="text-indigo-500" />;
    }
    return <GraduationCap size={48} className="text-indigo-500" />;
  };

  const getImageUrl = () => {
    if (!education.image_url) return null;
    if (education.image_url.startsWith('http')) {
      return education.image_url;
    }
    return `http://localhost:5000${education.image_url.startsWith('/') ? '' : '/'}${education.image_url}`;
  };

  const imageUrl = getImageUrl();

  return (
    <div className={`relative h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 hover:shadow-2xl group animate-bounce-in ${theme === 'dark' ? 'bg-gray-800/70 backdrop-blur-md border border-gray-700/50 text-gray-200' : 'bg-white/90 backdrop-blur-md border border-gray-200/50 text-gray-800'}`}>
      {/* Featured Badge */}
      {education.featured && (
        <div className="absolute top-4 right-4 z-10 animate-pulse">
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-lg transition-transform duration-300 group-hover:scale-110 ${theme === 'dark' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'} animate-glow`}>
            <Star size={12} />
            Featured
          </div>
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-52 w-full overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={education.institution || 'Institution'}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://via.placeholder.com/400x200/6366f1/ffffff?text=${(education.institution?.[0] || 'E')}`;
            }}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50' : 'bg-gradient-to-br from-indigo-100/70 to-blue-100/70'} group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50`}>
            {getEducationIcon(education.degree)}
          </div>
        )}
        
        {/* Overlay with view details link */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <Link 
            to={`/education/${education._id?.$oid || education._id}`}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md ${theme === 'dark' ? 'bg-indigo-600/80 text-white hover:bg-indigo-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'} backdrop-blur-sm flex items-center gap-2 animate-glow`}
          >
            View Details
            <ExternalLink size={16} />
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 flex flex-col space-y-4">
        {/* Title */}
        <h3 className={`text-xl font-bold line-clamp-2 transition-colors duration-300 ${theme === 'dark' ? 'text-white group-hover:text-indigo-300' : 'text-gray-900 group-hover:text-indigo-600'}`}>
          {education.degree || 'Education'}
        </h3>

        {/* Institution */}
        <div className="flex items-center gap-2">
          <MapPin size={16} className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} transition-transform duration-300 group-hover:scale-125`} />
          <p className={`font-semibold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'} transition-colors duration-300 group-hover:text-indigo-400`}>
            {education.institution || 'Institution not specified'}
          </p>
        </div>

        {/* Field of Study */}
        {education.field_of_study && (
          <p className={`text-sm font-medium line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300 group-hover:text-indigo-400`}>
            {education.field_of_study}
          </p>
        )}

        {/* Duration */}
        <div className="flex items-center gap-2">
          <Calendar size={16} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} transition-transform duration-300 group-hover:scale-125`} />
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300 group-hover:text-indigo-400`}>
            {formatDate(education.start_date)} - {formatDate(education.end_date)}
          </span>
        </div>

        {/* GPA */}
        {education.gpa && (
          <div className="flex items-center gap-2">
            <Award size={16} className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'} transition-transform duration-300 group-hover:scale-125`} />
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} transition-colors duration-300 group-hover:text-indigo-400`}>
              GPA: {education.gpa}
            </span>
          </div>
        )}

        {/* Description */}
        {education.description && (
          <p className={`text-sm line-clamp-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300 group-hover:text-indigo-400`}>
            {education.description}
          </p>
        )}

        {/* Courses */}
        {education.courses && education.courses.length > 0 && (
          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300 group-hover:text-indigo-400`}>
              Key Courses
            </h4>
            <div className="flex flex-wrap gap-2">
              {education.courses.slice(0, 3).map((course, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-700/50 text-gray-300 border border-gray-600 hover:bg-indigo-600/50 hover:border-indigo-500' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-indigo-100 hover:border-indigo-300'} animate-glow`}
                >
                  {course}
                </span>
              ))}
              {education.courses.length > 3 && (
                <span className={`px-3 py-1 text-xs rounded-full ${theme === 'dark' ? 'bg-gray-700/50 text-gray-500 border border-gray-600' : 'bg-gray-100 text-gray-500 border border-gray-200'} animate-glow`}>
                  +{education.courses.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* View Details Button */}
        <div className="mt-auto">
          <Link 
            to={`/education/${education._id?.$oid || education._id}`}
            className={`inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 group ${theme === 'dark' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-500/25' : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg hover:shadow-indigo-500/25'} animate-glow`}
          >
            Explore More
            <svg
              className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EducationCard;