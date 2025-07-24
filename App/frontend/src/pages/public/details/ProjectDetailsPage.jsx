import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchItem } from '../../../api/api';
import axios from 'axios';
import { useTheme } from '../../../contexts/ThemeContext';
import AnimatedSection from '../../../components/ui/AnimatedSection';
import { FiArrowLeft, FiExternalLink, FiGithub } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'prism-react-renderer';
import { motion } from 'framer-motion';
import useScrollToTop from '../../../hooks/useScrollToTop';

const ProjectDetailsPage = () => {
  useScrollToTop();
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();




// In ProjectDetailsPage.jsx, modify the useEffect hook:
useEffect(() => {
  const loadProject = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/public/projects/${id}`);
      setProject(response.data);
    } catch (err) {
      setError('Failed to load project');
      console.error('Error loading project:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };
  loadProject();
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

  if (error || !project) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`min-h-screen flex flex-col justify-center items-center gap-4 ${theme === 'dark' ? 'bg-gray-900 text-red-400' : 'bg-white text-red-600'}`}
      >
        <p>{error || 'Project not found'}</p>
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
                {project.title}
              </motion.h1>
              
              {project.subtitle && (
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={`text-lg mb-6 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {project.subtitle}
                </motion.p>
              )}
            </div>
            
            {(project.link || project.github) && (
              <div className="flex flex-wrap gap-3">
                {project.link && (
                  <motion.a
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                      theme === 'dark' 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    } transition-colors`}
                  >
                    <FiExternalLink /> Live Demo
                  </motion.a>
                )}
                {project.github && (
                  <motion.a
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                      theme === 'dark' 
                        ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    } transition-colors`}
                  >
                    <FiGithub /> View Code
                  </motion.a>
                )}
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
                }`}>Project Overview</h2>
                <div className={`markdown-content ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            language={match[1]}
                            style={theme === 'dark' ? darkTheme : lightTheme}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
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

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <AnimatedSection delay={200}>
                <div>
                  <h2 className={`text-2xl font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>Key Features</h2>
                  <ul className={`space-y-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {project.features.map((feature, index) => (
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
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}

            {/* Challenges & Solutions */}
            {project.challenges && (
              <AnimatedSection delay={300}>
                <div>
                  <h2 className={`text-2xl font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>Challenges & Solutions</h2>
                  <div className={`prose max-w-none ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {project.challenges}
                    </ReactMarkdown>
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Images/Gallery */}
            {project.images && project.images.length > 0 && (
              <AnimatedSection delay={400}>
                <div>
                  <h2 className={`text-2xl font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>Screenshots</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.images.map((imgUrl, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="overflow-hidden rounded-lg shadow-lg"
                      >
                        <img
                          src={imgUrl}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                          onClick={() => window.open(imgUrl, '_blank')}
                        />
                      </motion.div>
                    ))}
                  </div>
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
                  {project.technologies.map((tech, index) => (
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

            {/* Project Details */}
            <AnimatedSection delay={200}>
              <div className={`p-6 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <h3 className={`text-xl font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Project Details</h3>
                <div className="space-y-4">
                  {project.date && (
                    <div>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Date</p>
                      <p className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>{new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                    </div>
                  )}
                  {project.category && (
                    <div>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Category</p>
                      <p className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>{project.category}</p>
                    </div>
                  )}
                  {project.duration && (
                    <div>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Duration</p>
                      <p className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>{project.duration}</p>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>

            {/* Related Links */}
            {(project.documentation || project.relatedLinks) && (
              <AnimatedSection delay={300}>
                <div className={`p-6 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <h3 className={`text-xl font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>Resources</h3>
                  <div className="space-y-3">
                    {project.documentation && (
                      <a
                        href={project.documentation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 ${
                          theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
                        } transition-colors`}
                      >
                        <FiExternalLink /> Documentation
                      </a>
                    )}
                    {project.relatedLinks && project.relatedLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 ${
                          theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
                        } transition-colors`}
                      >
                        <FiExternalLink /> {link.label || `Resource ${index + 1}`}
                      </a>
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

// Syntax highlighting themes
const darkTheme = {
  plain: {
    color: "#f8f8f2",
    backgroundColor: "#282a36",
  },
  styles: [
    {
      types: ["comment"],
      style: {
        color: "rgb(98, 114, 164)",
      },
    },
    {
      types: ["string", "char", "constant"],
      style: {
        color: "rgb(241, 250, 140)",
      },
    },
    {
      types: ["number"],
      style: {
        color: "rgb(189, 147, 249)",
      },
    },
    {
      types: ["keyword", "operator"],
      style: {
        color: "rgb(255, 121, 198)",
      },
    },
    {
      types: ["function"],
      style: {
        color: "rgb(80, 250, 123)",
      },
    },
  ]
};

const lightTheme = {
  plain: {
    color: "#383a42",
    backgroundColor: "#fafafa",
  },
  styles: [
    {
      types: ["comment"],
      style: {
        color: "rgb(160, 161, 167)",
      },
    },
    {
      types: ["string", "char", "constant"],
      style: {
        color: "rgb(152, 104, 1)",
      },
    },
    {
      types: ["number"],
      style: {
        color: "rgb(152, 104, 1)",
      },
    },
    {
      types: ["keyword", "operator"],
      style: {
        color: "rgb(166, 38, 164)",
      },
    },
    {
      types: ["function"],
      style: {
        color: "rgb(64, 120, 242)",
      },
    },
  ]
};

export default ProjectDetailsPage;