import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../../contexts/ThemeContext';
import AnimatedSection from '../../../components/ui/AnimatedSection';
import { FiArrowLeft, FiExternalLink, FiGithub, FiTag, FiUser, FiCheckCircle } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'prism-react-renderer';
import { motion } from 'framer-motion';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  // Function to check if URL is a GitHub repository
  const isGitHubRepo = (url) => {
    if (!url) return false;
    return url.includes('github.com') && !url.includes('github.io');
  };

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/public/projects/${id}`);
        setProject(response.data);
      } catch (err) {
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    loadProject();
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

  if (error || !project) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`min-h-screen flex flex-col justify-center items-center gap-4 p-4 pt-20 ${theme === 'dark' ? 'bg-gray-900 text-red-400' : 'bg-indigo-50 text-red-600'}`}
      >
        <p className="text-lg font-semibold">{error || 'Project not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className={`px-6 py-3 rounded-lg flex items-center gap-2 ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
        >
          <FiArrowLeft /> Back to Projects
        </button>
      </motion.div>
    );
  }

  return (
    <div className={`relative min-h-screen font-['Space_Grotesk'] transition-colors duration-300 pt-20 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-indigo-50 text-gray-900'}`}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <AnimatedSection>
          <button
            onClick={() => navigate(-1)}
            className={`mb-8 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
          >
            <FiArrowLeft /> Back to Projects
          </button>
        </AnimatedSection>

        {/* Project Header */}
        <AnimatedSection>
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
            <div className="flex-1">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4"
              >
                {project.title}
              </motion.h1>
              
              {/* Status Badge */}
              {project.status && (
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                    : project.status === 'inactive'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  <FiCheckCircle className="inline mr-1" />
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 self-start">
              {project.link && (
                <motion.a
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 shadow-lg ${
                    theme === 'dark' 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
                  }`}
                >
                  {isGitHubRepo(project.link) ? (
                    <>
                      <FiGithub className="text-lg" /> 
                      Go to Repository
                    </>
                  ) : (
                    <>
                      <FiExternalLink className="text-lg" /> 
                      Visit Project
                    </>
                  )}
                </motion.a>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Project Image */}
        {project.image_url && (
          <AnimatedSection>
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-12 rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-auto max-h-[500px] object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/1200x600?text=${encodeURIComponent(project.title)}`;
                }}
              />
            </motion.div>
          </AnimatedSection>
        )}

        {/* Project Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <AnimatedSection>
              <div className={`p-6 sm:p-8 rounded-2xl shadow-xl backdrop-blur-sm border ${
                theme === 'dark' 
                  ? 'bg-gray-800/70 border-gray-700/50' 
                  : 'bg-white/70 border-gray-200/50'
              }`}>
                <h2 className={`text-2xl sm:text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600`}>
                  Project Overview
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
                    {project.description}
                  </ReactMarkdown>
                </div>
              </div>
            </AnimatedSection>

            {/* Featured Badge */}
            {project.featured && (
              <AnimatedSection>
                <div className={`p-6 sm:p-8 rounded-2xl shadow-xl backdrop-blur-sm border ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700/50' 
                    : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      theme === 'dark' ? 'bg-green-800/50' : 'bg-green-100'
                    }`}>
                      <FiCheckCircle className="text-green-500 text-xl" />
                    </div>
                    <div>
                      <p className={`text-lg font-semibold ${
                        theme === 'dark' ? 'text-green-300' : 'text-green-700'
                      }`}>
                        Featured Project
                      </p>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-green-400/80' : 'text-green-600/80'
                      }`}>
                        This project is highlighted in our portfolio
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <AnimatedSection>
                <div className={`p-6 rounded-2xl shadow-xl backdrop-blur-sm border ${
                  theme === 'dark' 
                    ? 'bg-gray-800/70 border-gray-700/50' 
                    : 'bg-white/70 border-gray-200/50'
                }`}>
                  <h3 className={`text-xl font-semibold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600`}>
                    <FiTag className="inline mr-2 text-indigo-500" />
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech, index) => (
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

            {/* Project Details */}
            <AnimatedSection>
              <div className={`p-6 rounded-2xl shadow-xl backdrop-blur-sm border ${
                theme === 'dark' 
                  ? 'bg-gray-800/70 border-gray-700/50' 
                  : 'bg-white/70 border-gray-200/50'
              }`}>
                <h3 className={`text-xl font-semibold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600`}>
                  <FiUser className="inline mr-2 text-indigo-500" />
                  Project Details
                </h3>
                <div className="space-y-4">
                  {/* Status */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-opacity-50">
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Status
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      project.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                        : project.status === 'inactive'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Project Link Type */}
                  {project.link && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-opacity-50">
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Link Type
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                        theme === 'dark' 
                          ? 'bg-indigo-900/50 text-indigo-300' 
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {isGitHubRepo(project.link) ? (
                          <>
                            <FiGithub className="text-xs" />
                            Repository
                          </>
                        ) : (
                          <>
                            <FiExternalLink className="text-xs" />
                            Live Site
                          </>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Created Date */}
                  {project.created_at && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-opacity-50">
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Created
                      </span>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {new Date(project.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}

                  {/* Updated Date */}
                  {project.updated_at && project.updated_at !== project.created_at && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-opacity-50">
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Last Updated
                      </span>
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {new Date(project.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>

            {/* Quick Actions */}
            {project.link && (
              <AnimatedSection>
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
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25'
                    }`}
                  >
                    {isGitHubRepo(project.link) ? (
                      <>
                        <FiGithub className="text-lg" /> 
                        View on GitHub
                      </>
                    ) : (
                      <>
                        <FiExternalLink className="text-lg" /> 
                        Open Project
                      </>
                    )}
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

export default ProjectDetailsPage;