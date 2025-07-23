import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FiCalendar, 
  FiMapPin, 
  FiAward,
  FiExternalLink,
  FiChevronLeft,
  FiStar
} from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { useTheme } from '../../../contexts/ThemeContext';
import AnimatedSection from '../../../components/ui/AnimatedSection';
import AiBotLoader from '../../../components/ui/loading/AiBotLoader';
import useScrollToTop from '../../../hooks/useScrollToTop';

const EducationDetailsPage = () => {
  useScrollToTop();
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [education, setEducation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/public/education/${id}`);
        
        // Handle different response formats
        const eduData = typeof response.data === 'string' 
          ? JSON.parse(response.data) 
          : response.data;
        
        setEducation(eduData);
      } catch (err) {
        console.error('Error fetching education:', err);
        setError(err.response?.data?.message || 'Failed to load education details');
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    } catch {
      return dateString;
    }
  };

  const getImageUrl = () => {
    if (!education?.image_url) return null;
    
    if (education.image_url.startsWith('http')) {
      return education.image_url;
    }
    
    return `http://localhost:5000${education.image_url.startsWith('/') ? '' : '/'}${education.image_url}`;
  };

  const imageUrl = getImageUrl();

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <AiBotLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-8 rounded-xl text-center max-w-md ${theme === 'dark' ? 'bg-gray-800 text-red-400' : 'bg-white text-red-600'}`}>
          <h2 className="text-xl font-bold mb-4">Error Loading Education</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className={`px-6 py-2 rounded-lg font-medium ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!education) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-8 rounded-xl text-center max-w-md ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'}`}>
          <h2 className="text-xl font-bold mb-4">Education Not Found</h2>
          <p className="mb-6">The requested education entry could not be found.</p>
          <button
            onClick={() => navigate(-1)}
            className={`px-6 py-2 rounded-lg font-medium ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <AnimatedSection>
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-8 px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <FiChevronLeft size={20} />
            Back to Portfolio
          </button>
        </AnimatedSection>

        {/* Header */}
        <AnimatedSection delay={100}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={education.institution}
                className="w-24 h-24 object-contain rounded-lg border-2 border-gray-200 dark:border-gray-600"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/150/6366f1/ffffff?text=${(education.institution?.[0] || 'E')}`;
                }}
              />
            ) : (
              <div className={`w-24 h-24 flex items-center justify-center rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30 text-indigo-400' 
                  : 'bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-600'
              }`}>
                <FaGraduationCap size={40} />
              </div>
            )}
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {education.degree}
              </h1>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                {education.institution}
              </h2>
              {education.featured && (
                <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold">
                  <FiStar size={12} />
                  Featured
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Details */}
            <AnimatedSection delay={150}>
              <div className={`p-6 rounded-xl mb-8 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-sm'}`}>
                <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Education Details
                </h2>
                
                <div className="space-y-4">
                  {/* Field of Study */}
                  {education.field_of_study && (
                    <div>
                      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Field of Study
                      </h3>
                      <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {education.field_of_study}
                      </p>
                    </div>
                  )}

                  {/* Duration */}
                  <div>
                    <h3 className={`text-sm font-semibold uppercase tracking-wider mb-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Duration
                    </h3>
                    <div className="flex items-center gap-2">
                      <FiCalendar className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {formatDate(education.start_date)} - {formatDate(education.end_date)}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className={`text-sm font-semibold uppercase tracking-wider mb-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Location
                    </h3>
                    <div className="flex items-center gap-2">
                      <FiMapPin className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {education.location || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  {/* GPA */}
                  {education.gpa && (
                    <div>
                      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Academic Achievement
                      </h3>
                      <div className="flex items-center gap-2">
                        <FiAward className={`${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          GPA: {education.gpa}/4.0
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Website */}
                  {education.website && (
                    <div>
                      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Institution Website
                      </h3>
                      <div className="flex items-center gap-2">
                        <FiExternalLink className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                        <a 
                          href={education.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`hover:underline ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                        >
                          {education.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>

            {/* Description */}
            {education.description && (
              <AnimatedSection delay={200}>
                <div className={`p-6 rounded-xl mb-8 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-sm'}`}>
                  <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    About This Program
                  </h2>
                  <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
                    <p className={`whitespace-pre-line ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {education.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Courses */}
            {education.courses && education.courses.length > 0 && (
              <AnimatedSection delay={250}>
                <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-sm'}`}>
                  <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Key Courses
                  </h2>
                  <ul className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {education.courses.map((course, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{course}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Achievements */}
            {education.achievements && education.achievements.length > 0 && (
              <AnimatedSection delay={300}>
                <div className={`p-6 rounded-xl mb-8 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-sm'}`}>
                  <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Achievements
                  </h2>
                  <ul className="space-y-3">
                    {education.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className={`p-1 rounded-full mt-1 ${theme === 'dark' ? 'bg-indigo-600/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                          <FiAward size={14} />
                        </div>
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {achievement}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}

            {/* Skills Gained */}
            {education.skills_gained && education.skills_gained.length > 0 && (
              <AnimatedSection delay={350}>
                <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-sm'}`}>
                  <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Skills Gained
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {education.skills_gained.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1.5 text-sm rounded-full font-medium ${
                          theme === 'dark'
                            ? 'bg-indigo-900/30 text-indigo-300 border border-indigo-800/50'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationDetailsPage;