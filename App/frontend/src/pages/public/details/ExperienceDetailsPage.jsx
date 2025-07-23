import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../../contexts/ThemeContext';
import AnimatedSection from '../../../components/ui/AnimatedSection';
import { FiArrowLeft, FiExternalLink, FiCalendar, FiMapPin, FiCode } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import useScrollToTop from '../../../hooks/useScrollToTop';

const ExperienceDetailsPage = () => {
  useScrollToTop();
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
  const loadExperience = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/public/experience/${id}`);
      const experienceData = res.data;

      if (!experienceData) {
        throw new Error('Experience data not found');
      }

      const formattedExperience = {
        ...experienceData,
        position: experienceData.position || 'Position not specified',
        company: experienceData.company || 'Company not specified',
        description: experienceData.description || 'No description available',
        technologies: experienceData.technologies || [],
        responsibilities: experienceData.responsibilities || [],
        achievements: experienceData.achievements || [],
        skillsGained: experienceData.skillsGained || []
      };

      setExperience(formattedExperience);
    } catch (err) {
      setError('Failed to load experience');
      console.error('Error loading experience:', err);
    } finally {
      setLoading(false);
    }
  };
  loadExperience();
}, [id]);

  if (loading) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"
        ></motion.div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`min-h-screen flex flex-col justify-center items-center gap-4 ${theme === 'dark' ? 'bg-gray-900 text-red-400' : 'bg-white text-red-600'}`}
      >
        <p>{error || 'Experience not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className={`px-4 py-2 rounded-md flex items-center gap-2 ${
            theme === 'dark' 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          <FiArrowLeft /> Go Back
        </button>
      </motion.div>
    );
  }

  return (
    <div className={`relative min-h-screen font-['Space_Grotesk'] transition-colors duration-300 pt-16 ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
    }`}>
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute top-20 left-10 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-10 right-10 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute top-40 right-20 w-64 h-64 bg-cyan-900/10 rounded-full blur-3xl"
        ></motion.div>
        
        {/* Grid */}
        <div className="absolute inset-0 grid grid-cols-12 opacity-5 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`border-r ${theme === 'dark' ? 'border-cyan-500' : 'border-gray-300'}`}></div>
          ))}
        </div>
        <div className="absolute inset-0 grid grid-rows-12 opacity-5 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`border-b ${theme === 'dark' ? 'border-cyan-500' : 'border-gray-300'}`}></div>
          ))}
        </div>
      </div>

      {/* Page Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <AnimatedSection>
          <button
            onClick={() => navigate(-1)}
            className={`mb-8 px-4 py-2 rounded-md flex items-center gap-2 ${
              theme === 'dark' 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            } transition-colors`}
          >
            <FiArrowLeft /> Back
          </button>
        </AnimatedSection>

        {/* Header Section */}
        <AnimatedSection>
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
            <div className="flex-1">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
              >
                {experience.position}
              </motion.h1>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`text-2xl font-semibold mb-2 ${
                  theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                }`}
              >
                {experience.company}
              </motion.p>

              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <FiCalendar className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {experience.duration}
                  </span>
                </div>
                {experience.location && (
                  <div className="flex items-center gap-2">
                    <FiMapPin className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {experience.location}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {experience.website && (
              <div className="flex gap-3">
                <motion.a
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  href={experience.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                    theme === 'dark' 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  } transition-colors`}
                >
                  <FiExternalLink /> Company Website
                </motion.a>
              </div>
            )}
          </div>
        </AnimatedSection>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <AnimatedSection delay={100}>
              <div className="prose max-w-none">
                <h2 className={`text-2xl font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Role Description</h2>
                <div className={`markdown-content ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {experience.description}
                  </ReactMarkdown>
                </div>
              </div>
            </AnimatedSection>

            {/* Responsibilities */}
            {experience.responsibilities && experience.responsibilities.length > 0 && (
              <AnimatedSection delay={200}>
                <div>
                  <h2 className={`text-2xl font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>Key Responsibilities</h2>
                  <ul className={`space-y-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {experience.responsibilities.map((responsibility, index) => (
                      <motion.li 
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <span className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${
                          theme === 'dark' ? 'bg-indigo-500' : 'bg-indigo-600'
                        }`}></span>
                        <span>{responsibility}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}

            {/* Achievements */}
            {experience.achievements && experience.achievements.length > 0 && (
              <AnimatedSection delay={300}>
                <div>
                  <h2 className={`text-2xl font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>Notable Achievements</h2>
                  <ul className={`space-y-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {experience.achievements.map((achievement, index) => (
                      <motion.li 
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <span className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${
                          theme === 'dark' ? 'bg-indigo-500' : 'bg-indigo-600'
                        }`}></span>
                        <span>{achievement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            {/* Technologies */}
            <AnimatedSection delay={100}>
              <div className={`p-6 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <h3 className={`text-xl font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        theme === 'dark' 
                          ? 'bg-indigo-900/50 text-indigo-300' 
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Experience Details */}
            <AnimatedSection delay={200}>
              <div className={`p-6 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <h3 className={`text-xl font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Experience Details</h3>
                <div className="space-y-4">
                  {experience.employmentType && (
                    <div>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Employment Type</p>
                      <p className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>{experience.employmentType}</p>
                    </div>
                  )}
                  {experience.industry && (
                    <div>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Industry</p>
                      <p className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>{experience.industry}</p>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>

            {/* Skills Gained */}
            {experience.skillsGained && experience.skillsGained.length > 0 && (
              <AnimatedSection delay={300}>
                <div className={`p-6 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <h3 className={`text-xl font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>Skills Gained</h3>
                  <div className="flex flex-wrap gap-2">
                    {experience.skillsGained.map((skill, index) => (
                      <motion.span
                        key={skill}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                          theme === 'dark' 
                            ? 'bg-green-900/50 text-green-300' 
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {skill}
                      </motion.span>
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

export default ExperienceDetailsPage;