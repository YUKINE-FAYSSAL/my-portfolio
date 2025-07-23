import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AnimatedSection from '../../components/ui/AnimatedSection';
import { useTheme } from '../../contexts/ThemeContext';
import { FaCode, FaPaintBrush, FaMobileAlt } from 'react-icons/fa';
import AiBotLoader from '../../components/ui/loading/AiBotLoader';
import useScrollToTop from '../../hooks/useScrollToTop';
import ThreeBackground from '../../components/ui/home/ThreeBackground';
import { gsap } from 'https://cdn.skypack.dev/gsap@3.11.0';
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap@3.11.0/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  useScrollToTop();
  const { theme } = useTheme();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/public/projects');
        const data = response.data; // Axios automatically parses JSON
        if (!Array.isArray(data)) {
          throw new Error('Expected an array of projects, received: ' + JSON.stringify(data));
        }
        setProjects(data.slice(0, 2));
      } catch (error) {
        console.error('Error loading projects:', error.message, error.response?.data || error);
        setError(`Failed to load projects: ${error.message}. Please ensure the server is running and try again.`);
      } finally {
        setLoading(false);
        if (window.ScrollTrigger) {
          ScrollTrigger.refresh();
        }
      }
    };
    loadProjects();
  }, []);

  // ScrollTrigger animations for sections
  useEffect(() => {
    const contentElement = document.querySelector('.content');
    if (!contentElement) return;

    const animateTextElements = () => {
      const titles = document.querySelectorAll('.title');
      const descriptions = document.querySelectorAll('.description');
      document.querySelectorAll('.section').forEach((section, index) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
            toggleActions: 'play none none reverse',
          },
        });
        tl.to(titles[index], { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0);
        tl.to(descriptions[index], { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 }, 0);
      });
    };

    animateTextElements();
  }, []);

  const services = [
    {
      title: 'Web Development',
      description: 'Building responsive, modern web applications with React, Node.js, and MongoDB.',
      icon: <FaCode className="text-indigo-500 w-10 h-10" />,
    },
    {
      title: 'UI/UX Design',
      description: 'Creating beautiful, intuitive user interfaces that enhance user experience.',
      icon: <FaPaintBrush className="text-pink-500 w-10 h-10" />,
    },
    {
      title: 'Mobile Apps',
      description: 'Developing cross-platform mobile applications with React Native.',
      icon: <FaMobileAlt className="text-green-500 w-10 h-10" />,
    },
  ];

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen w-full ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <AiBotLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen w-full ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ThreeBackground />
      <div className="content">
        {/* Hero Section */}
        <div className="relative bg-black text-white font-['Space_Grotesk'] overflow-hidden">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/home/big.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: theme === 'dark' ? 'brightness(0.4)' : 'brightness(0.95)',
              opacity: 0.3,
            }}
          />

          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-900/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-900/30 rounded-full blur-3xl"></div>
            <div className="absolute top-40 right-20 w-64 h-64 bg-cyan-900/30 rounded-full blur-3xl"></div>
            <div className="absolute inset-0 grid grid-cols-12 opacity-15 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="border-r border-cyan-500"></div>
              ))}
            </div>
            <div className="absolute inset-0 grid grid-rows-12 opacity-15 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="border-b border-cyan-500"></div>
              ))}
            </div>
          </div>

          <section className="section relative pt-32 pb-20 px-4 h-screen flex items-center z-10">
            <div className="max-w-6xl mx-auto text-center">
              <AnimatedSection delay={100}>
                <h1 className="title text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
                  Hi! I'm Fayssal
                </h1>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <h2 className="description text-xl md:text-2xl text-gray-300 mb-8">
                  Full Stack Developer
                </h2>
              </AnimatedSection>

              <AnimatedSection delay={300}>
                <div className="flex justify-center gap-4 mb-16 flex-wrap">
                  <Link to="/portfolio" className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600/50 to-purple-600/50 rounded-lg blur opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
                    <button className="px-8 py-3 bg-gradient-to-r from-indigo-900/90 to-purple-900/90 rounded-lg text-white font-medium relative z-10 group-hover:from-indigo-800/90 group-hover:to-purple-800/90 transition-all duration-300">
                      <span className={`${theme === 'dark' ? 'bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent' : 'text-white'}`}>
                        View Portfolio
                      </span>
                    </button>
                  </Link>
                  <Link
                    to="/blog"
                    className="px-8 py-3 border border-cyan-500/30 rounded-lg text-cyan-400 text-base font-medium hover:bg-cyan-900/10 hover:border-cyan-500/50 transition-all duration-300"
                  >
                    Read Blog
                  </Link>
                </div>
              </AnimatedSection>
            </div>

            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </section>
        </div>

        {/* Services Section */}
        <section className={`section py-16 px-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <h2 className="title text-3xl font-bold mb-12 text-center">
                <span className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>My Services</span>
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'} hover:shadow-lg transition-all`}>
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className={`description ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{service.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Projects */}
        <section className={`section py-16 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-indigo-50'}`}>
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <h2 className="title text-3xl font-bold mb-12 text-center">
                <span className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Recent Projects</span>
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} hover:shadow-lg transition-all`}>
                    <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                    <p className={`description mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {project.description || 'No description available'}
                    </p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tag, i) => (
                          <span
                            key={i}
                            className={`px-3 py-1 text-xs rounded-full ${theme === 'dark' ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* About Me */}
        <section className={`section py-16 px-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="max-w-6xl mx-auto">
            <div className={`p-8 rounded-xl border ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
              <AnimatedSection>
                <h2 className="title text-3xl font-bold mb-6">
                  <span className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>About Me</span>
                </h2>
              </AnimatedSection>
              <AnimatedSection delay={100}>
                <p className={`description mb-4 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  I'm a passionate full-stack developer currently studying at EMSI Rabat and trained at OFPPT Taza.
                  I craft clean, responsive, and performant web apps using React, Node.js, and modern tech.
                </p>
              </AnimatedSection>
              <AnimatedSection delay={200}>
                <p className={`description ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
                  Outside of coding, I enjoy UI/UX design, contributing to open source, and exploring new technologies.
                </p>
              </AnimatedSection>
              <AnimatedSection delay={300}>
                <Link
                  to="/portfolio"
                  className={`inline-block px-6 py-2 rounded-full font-medium ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                >
                  Learn More About My Work
                </Link>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Floating Contact Button */}
        <Link
          to="/contact"
          className={`fixed right-6 bottom-6 w-16 h-16 rounded-full flex items-center justify-center shadow-lg z-50 transition-all duration-300 hover:scale-110 ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          aria-label="Contact me"
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;