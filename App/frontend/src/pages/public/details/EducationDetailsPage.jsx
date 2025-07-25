import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FiCalendar, 
  FiMapPin, 
  FiAward,
  FiExternalLink,
  FiArrowLeft,
  FiStar,
  FiBookOpen,
  FiTrendingUp,
  FiUser
} from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { useTheme } from '../../../contexts/ThemeContext';
import AnimatedSection from '../../../components/ui/AnimatedSection';
import AiBotLoader from '../../../components/ui/loading/AiBotLoader';
import { motion } from 'framer-motion';
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
      <div className={`flex items-center justify-center min-h-screen pt-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-indigo-50'}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex items-center justify-center min-h-screen pt-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-indigo-50'}`}
      >
        <div className={`p-8 rounded-xl text-center max-w-md shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-red-400' : 'bg-white text-red-600'}`}>
          <h2 className="text-xl font-bold mb-4">Error Loading Education</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
          >
            <FiArrowLeft /> Go Back
          </button>
        </div>
      </motion.div>
    );
  }

  if (!education) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex items-center justify-center min-h-screen pt-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-indigo-50'}`}
      >
        <div className={`p-8 rounded-xl text-center max-w-md shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'}`}>
          <h2 className="text-xl font-bold mb-4">Education Not Found</h2>
          <p className="mb-6">The requested education entry could not be found.</p>
          <button
            onClick={() => navigate(-1)}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
          >
            <FiArrowLeft /> Go Back
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`relative min-h-screen font-['Space_Grotesk'] transition-colors duration-300 pt-20 ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-indigo-50 text-gray-900'
    }`}>
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1 }}
          className="absolute top-20 left-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute top-40 right-20 w-64 h-64 bg-cyan-500 rounded-full blur-3xl"
        ></motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <AnimatedSection>
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-8 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              theme === 'dark' 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <FiArrowLeft size={20} />
            Back to Education
          </button>
        </AnimatedSection>

        {/* Header */}
        <AnimatedSection delay={100}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12">
            {imageUrl ? (
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={imageUrl}
                alt={education.institution}
                className={`w-32 h-32 object-contain rounded-2xl shadow-xl border-2 ${
                  theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                }`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/150/6366f1/ffffff?text=${(education.institution?.[0] || 'E')}`;
                }}
              />
            ) : (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`w-32 h-32 flex items-center justify-center rounded-2xl shadow-xl ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30 text-indigo-400 border-2 border-gray-700' 
                    : 'bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-600 border-2 border-gray-200'
                }`}
              >
                <FaGraduationCap size={48} />
              </motion.div>
            )}
            
            <div className="flex-1">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4"
              >
                {education.degree}
              </motion.h1>
              
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}
              >
                {education.institution}
              </motion.h2>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
                } backdrop-blur-sm`}>
                  <FiCalendar className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {formatDate(education.start_date)} - {formatDate(education.end_date)}
                  </span>
                </div>
                
                {education.location && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
                  } backdrop-blur-sm`}>
                    <FiMapPin className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {education.location}
                    </span>
                  </div>
                )}

                {education.gpa && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-50'
                  } backdrop-blur-sm`}>
                    <FiAward className={`${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    <span className={`font-medium ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>
                      GPA: {education.gpa}/4.0
                    </span>
                  </div>
                )}
              </div>

              {education.featured && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold shadow-lg"
                >
                  <FiStar size={16} />
                  Featured Education
                </motion.div>
              )}
            </div>

            {education.website && (
              <div className="flex gap-3 self-start">
                <motion.a
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  href={education.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 shadow-lg ${
                    theme === 'dark' 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
                  }`}
                >
                  <FiExternalLink className="text-lg" /> Visit Institution
                </motion.a>
              </div>
            )}
          </div>
        </AnimatedSection>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Education Details */}
            <AnimatedSection delay={150}>
              <div className={`p-6 sm:p-8 rounded-2xl shadow-xl backdrop-blur-sm border ${
                theme === 'dark' 
                  ? 'bg-gray-800/70 border-gray-700/50' 
                  : 'bg-white/70 border-gray-200/50'
              }`}>
                <h2 className={`text-2xl sm:text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600`}>
                  <FaGraduationCap className="inline mr-2 text-indigo-500" />
                  Education Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Field of Study */}
                  {education.field_of_study && (
                    <div className="p-4 rounded-lg bg-opacity-50">
                      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Field of Study
                      </h3>
                      <p className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {education.field_of_study}
                      </p>
                    </div>
                  )}

                  {/* Duration */}
                  <div className="p-4 rounded-lg bg-opacity-50">
                    <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Duration
                    </h3>
                    <p className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {formatDate(education.start_date)} - {formatDate(education.end_date)}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="p-4 rounded-lg bg-opacity-50">
                    <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Location
                    </h3>
                    <p className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {education.location || 'Not specified'}
                    </p>
                  </div>

                  {/* GPA */}
                  {education.gpa && (
                    <div className="p-4 rounded-lg bg-opacity-50">
                      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Academic Achievement
                      </h3>
                      <div className="flex items-center gap-2">
                        <FiAward className={`${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                        <p className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          GPA: {education.gpa}/4.0
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>

            {/* Description */}
            {education.description && (
              <AnimatedSection delay={200}>
                <div className={`p-6 sm:p-8 rounded-2xl shadow-xl backdrop-blur-sm border ${
                  theme === 'dark' 
                    ? 'bg-gray-800/70 border-gray-700/50' 
                    : 'bg-white/70 border-gray-200/50'
                }`}>
                  <h2 className={`text-2xl sm:text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600`}>
                    <FiBookOpen className="inline mr-2 text-indigo-500" />
                    About This Program
                  </h2>
                  <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert text-gray-300' : 'text-gray-700'}`}>
                    <p className="whitespace-pre-line leading-relaxed">
                      {education.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Courses */}
            {education.courses && education.courses.length > 0 && (
              <AnimatedSection delay={250}>
                <div className={`p-6 sm:p-8 rounded-2xl shadow-xl backdrop-blur-sm border ${
                  theme === 'dark' 
                    ? 'bg-gray-800/70 border-gray-700/50' 
                    : 'bg-white/70 border-gray-200/50'
                }`}>
                  <h2 className={`text-2xl sm:text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600`}>
                    <FiBookOpen className="inline mr-2 text-indigo-500" />
                    Key Courses
                  </h2>
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {education.courses.map((course, index) => (
                      <motion.div 
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-opacity-50 transition-all duration-200"
                      >
                        <span className={`mt-2 flex-shrink-0 w-2 h-2 rounded-full ${
                          theme === 'dark' ? 'bg-indigo-400' : 'bg-indigo-600'
                        }`}></span>
                        <span className="leading-relaxed">{course}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            {education.achievements && education.achievements.length > 0 && (
              <AnimatedSection delay={300}>
                <div className={`p-6 rounded-2xl shadow-xl backdrop-blur-sm border ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-700/50' 
                    : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200/50'
                }`}>
                  <h3 className={`text-xl font-semibold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-orange-600`}>
                    <FiAward className="inline mr-2 text-yellow-500" />
                    Achievements
                  </h3>
                  <ul className="space-y-4">
                    {education.achievements.map((achievement, index) => (
                      <motion.li 
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-opacity-50 transition-all duration-200"
                      >
                        <div className={`p-1 rounded-full mt-1 ${theme === 'dark' ? 'bg-yellow-600/30 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}>
                          <FiAward size={14} />
                        </div>
                        <p className={`leading-relaxed font-medium ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'}`}>
                          {achievement}
                        </p>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}

            {/* Skills Gained */}
            {education.skills_gained && education.skills_gained.length > 0 && (
              <AnimatedSection delay={350}>
                <div className={`p-6 rounded-2xl shadow-xl backdrop-blur-sm border ${
                  theme === 'dark' 
                    ? 'bg-gray-800/70 border-gray-700/50' 
                    : 'bg-white/70 border-gray-200/50'
                }`}>
                  <h3 className={`text-xl font-semibold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600`}>
                    <FiTrendingUp className="inline mr-2 text-green-500" />
                    Skills Gained
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {education.skills_gained.map((skill, index) => (
                      <motion.span
                        key={index}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`px-4 py-2 text-sm rounded-full font-medium border transition-all duration-200 hover:scale-105 ${
                          theme === 'dark'
                            ? 'bg-green-900/30 text-green-300 border-green-700/50 hover:bg-green-800/40'
                            : 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'
                        }`}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Education Summary */}
            <AnimatedSection delay={400}>
              <div className={`p-6 rounded-2xl shadow-xl backdrop-blur-sm border ${
                theme === 'dark' 
                  ? 'bg-gray-800/70 border-gray-700/50' 
                  : 'bg-white/70 border-gray-200/50'
              }`}>
                <h3 className={`text-xl font-semibold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600`}>
                  <FiUser className="inline mr-2 text-indigo-500" />
                  Education Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-opacity-50">
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Institution
                    </span>
                    <span className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {education.institution}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-opacity-50">
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Degree Level
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      theme === 'dark' 
                        ? 'bg-indigo-900/50 text-indigo-300' 
                        : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {education.degree}
                    </span>
                  </div>

                  {education.featured && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-opacity-50">
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Status
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>

            {/* Quick Actions */}
            {education.website && (
              <AnimatedSection delay={450}>
                <div className={`p-6 rounded-2xl shadow-xl backdrop-blur-sm border ${
                  theme === 'dark' 
                    ? 'bg-gray-800/70 border-gray-700/50' 
                    : 'bg-white/70 border-gray-200/50'
                }`}>
                  <h3 className={`text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600`}>
                    Quick Actions
                  </h3>
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={education.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25'
                    }`}
                  >
                    <FiExternalLink className="text-lg" /> 
                    Visit Institution Website
                  </motion.a>
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