import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../../contexts/ThemeContext';
import AnimatedSection from '../../../components/ui/AnimatedSection';
import { FiArrowLeft, FiExternalLink, FiCalendar, FiMapPin, FiCode, FiBriefcase, FiTrendingUp, FiAward } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'prism-react-renderer';
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
      <div className={`min-h-screen flex justify-center items-center pt-20 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-indigo-50 text-gray-800'}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"
        ></motion.div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`min-h-screen flex flex-col justify-center items-center gap-4 p-4 pt-20 ${theme === 'dark' ? 'bg-gray-900 text-red-400' : 'bg-indigo-50 text-red-600'}`}
      >
        <p className="text-lg font-semibold">{error || 'Experience not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className={`px-6 py-3 rounded-lg flex items-center gap-2 ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
        >
          <FiArrowLeft /> Back to Experience
        </button>
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

      {/* Page Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <AnimatedSection>
          <button
            onClick={() => navigate(-1)}
            className={`mb-8 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 ${
              theme === 'dark' 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <FiArrowLeft /> Back to Experience
          </button>
        </AnimatedSection>

        {/* Header Section */}
        <AnimatedSection>
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
            <div className="flex-1">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4"
              >
                {experience.position}
              </motion.h1>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`text-2xl font-semibold mb-6 ${
                  theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                }`}
              >
                {experience.company}
              </motion.p>

              <div className="flex flex-wrap gap-6 mt-4">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
                } backdrop-blur-sm`}>
                  <FiCalendar className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {experience.duration}
                  </span>
                </div>
                {experience.location && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
                  } backdrop-blur-sm`}>
                    <FiMapPin className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {experience.location}
                    </span>
                  </div>
                )}
                {experience.employmentType && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
                  } backdrop-blur-sm`}>
                    <FiBriefcase className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {experience.employmentType}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {experience.website && (
              <div className="flex gap-3 self-start">
                <motion.a
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  href={experience.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 shadow-lg ${
                    theme === 'dark' 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
                  }`}
                >
                  <FiExternalLink className="text-lg" /> Company Website
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
              <div className={`p-6 sm:p-8 rounded-2xl shadow-xl backdrop-blur-sm border ${
                theme === 'dark' 
                  ? 'bg-gray-800/70 border-gray-700/50' 
                  : 'bg-white/70 border-gray-200/50'
              }`}>
                <h2 className={`text-2xl sm:text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600`}>
                  <FiCode className="inline mr-2 text-indigo-500" />
                  Role Overview
                </h2>
                <div className={`prose max-w-none ${
                  theme === 'dark' ? 'prose-invert text-gray-300' : 'text-gray-700'
                }`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            language={match[1]}
                            style={theme === 'dark' ? darkTheme : lightTheme}
                            PreTag="div"
                            className="rounded-lg text-sm sm:text-base"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={`${className} ${
                            theme === 'dark' 
                              ? 'bg-gray-700 text-indigo-300' 
                              : 'bg-gray-200 text-indigo-700'
                          } px-2 py-1 rounded`} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {experience.description}
                  </ReactMarkdown>
                </div>
              </div>
            </AnimatedSection>

            {/* Responsibilities */}
            {experience.responsibilities && experience.responsibilities.length > 0 && (
              <AnimatedSection delay={200}>
                <div className={`p-6 sm:p-8 rounded-2xl shadow-xl backdrop-blur-sm border ${
                  theme === 'dark' 
                    ? 'bg-gray-800/70 border-gray-700/50' 
                    : 'bg-white/70 border-gray-200/50'
                }`}>
                  <h2 className={`text-2xl sm:text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600`}>
                    <FiBriefcase className="inline mr-2 text-indigo-500" />
                    Key Responsibilities
                  </h2>
                  <ul className={`space-y-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {experience.responsibilities.map((responsibility, index) => (
                      <motion.li 
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start gap-4 p-3 rounded-lg bg-opacity-30 hover:bg-opacity-50 transition-all duration-200"
                      >
                        <span className={`mt-2 flex-shrink-0 w-2 h-2 rounded-full ${
                          theme === 'dark' ? 'bg-indigo-400' : 'bg-indigo-600'
                        }`}></span>
                        <span className="leading-relaxed">{responsibility}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}

            {/* Achievements */}
            {experience.achievements && experience.achievements.length > 0 && (
              <AnimatedSection delay={300}>
                <div className={`p-6 sm:p-8 rounded-2xl shadow-xl backdrop-blur-sm border ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700/50' 
                    : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50'
                }`}>
                  <h2 className={`text-2xl sm:text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600`}>
                    <FiAward className="inline mr-2 text-green-500" />
                    Notable Achievements
                  </h2>
                  <ul className={`space-y-4 ${
                    theme === 'dark' ? 'text-green-300' : 'text-green-800'
                  }`}>
                    {experience.achievements.map((achievement, index) => (
                      <motion.li 
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start gap-4 p-3 rounded-lg bg-opacity-30 hover:bg-opacity-50 transition-all duration-200"
                      >
                        <span className={`mt-2 flex-shrink-0 w-2 h-2 rounded-full ${
                          theme === 'dark' ? 'bg-green-400' : 'bg-green-600'
                        }`}></span>
                        <span className="leading-relaxed font-medium">{achievement}</span>
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
            {experience.technologies && experience.technologies.length > 0 && (
              <AnimatedSection delay={100}>
                <div className={`p-6 rounded-2xl shadow-xl backdrop-blur-sm border ${
                  theme === 'dark' 
                    ? 'bg-gray-800/70 border-gray-700/50' 
                    : 'bg-white/70 border-gray-200/50'
                }`}>
                  <h3 className={`text-xl font-semibold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600`}>
                    <FiCode className="inline mr-2 text-indigo-500" />
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {experience.technologies.map((tech, index) => (
                      <motion.span
                        key={tech}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 hover:scale-105 ${
                          theme === 'dark' 
                            ? 'bg-indigo-900/30 text-indigo-300 border-indigo-700/50 hover:bg-indigo-800/40' 
                            : 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100'
                        }`}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Experience Details */}
            <AnimatedSection delay={200}>
              <div className={`p-6 rounded-2xl shadow-xl backdrop-blur-sm border ${
                theme === 'dark' 
                  ? 'bg-gray-800/70 border-gray-700/50' 
                  : 'bg-white/70 border-gray-200/50'
              }`}>
                <h3 className={`text-xl font-semibold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600`}>
                  <FiBriefcase className="inline mr-2 text-indigo-500" />
                  Experience Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-opacity-50">
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Duration
                    </span>
                    <span className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {experience.duration}
                    </span>
                  </div>
                  
                  {experience.location && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-opacity-50">
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Location
                      </span>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {experience.location}
                      </span>
                    </div>
                  )}
                  
                  {experience.employmentType && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-opacity-50">
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Employment Type
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        theme === 'dark' 
                          ? 'bg-indigo-900/50 text-indigo-300' 
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {experience.employmentType}
                      </span>
                    </div>
                  )}
                  
                  {experience.industry && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-opacity-50">
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Industry
                      </span>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {experience.industry}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>

            {/* Skills Gained */}
            {experience.skillsGained && experience.skillsGained.length > 0 && (
              <AnimatedSection delay={300}>
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
                    {experience.skillsGained.map((skill, index) => (
                      <motion.span
                        key={skill}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 hover:scale-105 ${
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

            {/* Quick Actions */}
            {experience.website && (
              <AnimatedSection delay={350}>
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
                    href={experience.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25'
                    }`}
                  >
                    <FiExternalLink className="text-lg" /> 
                    Visit Company Website
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

// Syntax highlighting themes
const darkTheme = {
  plain: { color: "#f8f8f2", backgroundColor: "#282a36" },
  styles: [
    { types: ["comment"], style: { color: "rgb(98, 114, 164)" } },
    { types: ["string", "char", "constant"], style: { color: "rgb(241, 250, 140)" } },
    { types: ["number"], style: { color: "rgb(189, 147, 249)" } },
    { types: ["keyword", "operator"], style: { color: "rgb(255, 121, 198)" } },
    { types: ["function"], style: { color: "rgb(80, 250, 123)" } },
  ]
};

const lightTheme = {
  plain: { color: "#383a42", backgroundColor: "#fafafa" },
  styles: [
    { types: ["comment"], style: { color: "rgb(160, 161, 167)" } },
    { types: ["string", "char", "constant"], style: { color: "rgb(152, 104, 1)" } },
    { types: ["number"], style: { color: "rgb(152, 104, 1)" } },
    { types: ["keyword", "operator"], style: { color: "rgb(166, 38, 164)" } },
    { types: ["function"], style: { color: "rgb(64, 120, 242)" } },
  ]
};

export default ExperienceDetailsPage;