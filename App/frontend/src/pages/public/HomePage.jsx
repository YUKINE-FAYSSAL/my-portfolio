import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AnimatedSection from '../../components/ui/AnimatedSection';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AiBotLoader from '../../components/ui/loading/AiBotLoader';
import useScrollToTop from '../../hooks/useScrollToTop';
import ThreeBackground from '../../components/ui/home/ThreeBackground';
import { gsap } from 'https://cdn.skypack.dev/gsap@3.11.0';
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap@3.11.0/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  useScrollToTop();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const content = {
    en: {
      hero: {
        title: "Welcome.",
        subtitle: "Hi! I'm Fayssal",
        description: "Full Stack Developer & Digital Craftsman building exceptional digital experiences.",
        portfolioButton: "View Portfolio"
      },
      projects: {
        title: "My Work",
        subtitle: "A collection of projects I've worked on."
      },
      expertise: {
        title: "My Expertise",
        services: [
          {
            title: "Web Development",
            description: "Building responsive, modern web applications with React, Node.js, and MongoDB."
          },
          {
            title: "UI/UX Design",
            description: "Creating beautiful, intuitive user interfaces that enhance user experience."
          },
          {
            title: "Mobile Apps",
            description: "Aspiring to develop cross-platform mobile applications with React Native in the future."
          },
          {
            title: "API Development",
            description: "Robust RESTful and GraphQL APIs with proper documentation and security."
          },
          {
            title: "Performance Optimization",
            description: "Making your applications blazing fast with modern optimization techniques."
          },
          {
            title: "AI Integration",
            description: "Building innovative AI-powered solutions using machine learning models."
          }
        ]
      },
      education: {
        title: "Education",
        ofppt: "OFPPT Taza - Full Stack Development",
        emsi: "EMSI Rabat"
      },
      about: {
        title: "About Me",
        description1: "I'm a full-stack developer studying at EMSI Rabat, skilled in Laravel, MongoDB, MySQL, Python, React, REST APIs, Node.js, and Express. I'm passionate about creating innovative AI-powered web and mobile applications.",
        description2: "My goal is to build scalable, user-centric solutions that push the boundaries of technology. Let's create the future of digital experiences together!",
        workButton: "View My Work",
        contactButton: "Get In Touch"
      },
      error: "Failed to load projects: {error}. Please ensure the server is running."
    },
    fr: {
      hero: {
        title: "Bienvenue.",
        subtitle: "Salut ! Je suis Fayssal",
        description: "Développeur Full Stack & Artisan Numérique créant des expériences numériques exceptionnelles.",
        portfolioButton: "Voir le Portfolio"
      },
      projects: {
        title: "Mon Travail",
        subtitle: "Une collection de projets sur lesquels j'ai travaillé."
      },
      expertise: {
        title: "Mon Expertise",
        services: [
          {
            title: "Développement Web",
            description: "Construction d'applications web modernes et réactives avec React, Node.js et MongoDB."
          },
          {
            title: "Conception UI/UX",
            description: "Création d'interfaces utilisateur belles et intuitives qui améliorent l'expérience utilisateur."
          },
          {
            title: "Applications Mobiles",
            description: "Aspiration à développer des applications mobiles multiplateformes avec React Native à l'avenir."
          },
          {
            title: "Développement d'API",
            description: "API RESTful et GraphQL robustes avec une documentation et une sécurité appropriées."
          },
          {
            title: "Optimisation des Performances",
            description: "Rendre vos applications extrêmement rapides avec des techniques d'optimisation modernes."
          },
          {
            title: "Intégration IA",
            description: "Construction de solutions innovantes alimentées par l'IA en utilisant des modèles d'apprentissage automatique."
          }
        ]
      },
      education: {
        title: "Éducation",
        ofppt: "OFPPT Taza - Développement Full Stack",
        emsi: "EMSI Rabat"
      },
      about: {
        title: "À Propos de Moi",
        description1: "Je suis un développeur full-stack étudiant à EMSI Rabat, compétent en Laravel, MongoDB, MySQL, Python, React, APIs REST, Node.js et Express. Je suis passionné par la création d'applications web et mobiles innovantes alimentées par l'IA.",
        description2: "Mon objectif est de construire des solutions évolutives et centrées sur l'utilisateur qui repoussent les limites de la technologie. Créons ensemble l'avenir des expériences numériques !",
        workButton: "Voir Mon Travail",
        contactButton: "Contactez-Moi"
      },
      error: "Échec du chargement des projets : {error}. Veuillez vous assurer que le serveur est en cours d'exécution."
    },
    ar: {
      hero: {
        title: "مرحبًا.",
        subtitle: "مرحبًا! أنا فيصل",
        description: "مطور Full Stack وحرفي رقمي يبني تجارب رقمية استثنائية.",
        portfolioButton: "عرض المحفظة"
      },
      projects: {
        title: "أعمالي",
        subtitle: "مجموعة من المشاريع التي عملت عليها."
      },
      expertise: {
        title: "خبرتي",
        services: [
          {
            title: "تطوير الويب",
            description: "بناء تطبيقات ويب حديثة ومتجاوبة باستخدام React و Node.js و MongoDB."
          },
          {
            title: "تصميم واجهة/تجربة المستخدم",
            description: "إنشاء واجهات مستخدم جميلة وبديهية تعزز تجربة المستخدم."
          },
          {
            title: "تطبيقات الهاتف المحمول",
            description: "الطموح لتطوير تطبيقات الهاتف المحمول متعددة المنصات باستخدام React Native في المستقبل."
          },
          {
            title: "تطوير واجهات برمجة التطبيقات",
            description: "واجهات برمجة تطبيقات RESTful و GraphQL قوية مع توثيق وأمان مناسبين."
          },
          {
            title: "تحسين الأداء",
            description: "جعل تطبيقاتك سريعة للغاية باستخدام تقنيات التحسين الحديثة."
          },
          {
            title: "تكامل الذكاء الاصطناعي",
            description: "بناء حلول مبتكرة مدعومة بالذكاء الاصطناعي باستخدام نماذج التعلم الآلي."
          }
        ]
      },
      education: {
        title: "التعليم",
        ofppt: "OFPPT تازة - تطوير Full Stack",
        emsi: "EMSI الرباط"
      },
      about: {
        title: "عني",
        description1: "أنا مطور full-stack أدرس في EMSI الرباط، ماهر في Laravel، MongoDB، MySQL، Python، React، واجهات برمجة التطبيقات REST، Node.js و Express. أنا شغوف بإنشاء تطبيقات ويب وهواتف محمولة مبتكرة مدعومة بالذكاء الاصطناعي.",
        description2: "هدفي هو بناء حلول قابلة للتطوير وموجهة للمستخدم تدفع حدود التكنولوجيا. دعونا نبني مستقبل التجارب الرقمية معًا!",
        workButton: "عرض أعمالي",
        contactButton: "تواصلوا معي"
      },
      error: "فشل تحميل المشاريع: {error}. يرجى التأكد من أن الخادم يعمل."
    }
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/public/projects');
        const data = response.data;
        if (!Array.isArray(data)) {
          throw new Error('Expected an array of projects');
        }
        const normalizedProjects = data.map(project => ({
          ...project,
          imageUrl: project.image_url || project.imageUrl
        }));
        setProjects(normalizedProjects.slice(0, 6));
      } catch (error) {
        console.error('Error loading projects:', error.message);
        setError(content[language].error.replace('{error}', error.message));
      } finally {
        setLoading(false);
        ScrollTrigger.refresh();
      }
    };
    loadProjects();
  }, [language]);

  useEffect(() => {
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
        <div className="relative bg-black text-white font-['Space_Grotesk'] overflow-hidden min-h-screen flex items-center">
          {/* Background image with light blur */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/home/big.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: theme === 'dark' ? 'brightness(0.4) blur(4px)' : 'brightness(0.9) blur(4px)',
              opacity: 1,
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Hero Section */}
          <section className="section relative px-4 z-10 text-center w-full">
            <div className="max-w-6xl mx-auto py-24">
              <AnimatedSection delay={100}>
                <h1
                  className={`title text-6xl md:text-8xl font-extrabold mb-4 font-['Komigo'] ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-purple-400 to-teal-300 bg-clip-text text-transparent drop-shadow-md'
                      : 'text-white drop-shadow-lg'
                  }`}
                >
                  {content[language].hero.title}
                </h1>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <h2
                  className={`description text-2xl md:text-3xl font-bold mb-6 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-white drop-shadow-md'
                  }`}
                >
                  {content[language].hero.subtitle}
                </h2>
              </AnimatedSection>

              <AnimatedSection delay={300}>
                <p
                  className={`description text-lg md:text-xl mb-12 max-w-3xl mx-auto ${
                    theme === 'dark' ? 'text-gray-400' : 'text-white drop-shadow-sm'
                  }`}
                >
                  {content[language].hero.description}
                </p>
              </AnimatedSection>

              <AnimatedSection delay={400}>
                <div className="flex justify-center gap-4">
                  <Link to="/portfolio" className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600/50 to-purple-600/50 rounded-lg blur opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
                    <button
                      className={`px-8 py-3 rounded-lg text-white font-medium relative z-10 transition-all duration-300
                        ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-indigo-900/90 to-purple-900/90 group-hover:from-indigo-800/90 group-hover:to-purple-800/90'
                            : 'bg-gradient-to-r from-indigo-700 to-purple-700 group-hover:from-indigo-600 group-hover:to-purple-600'
                        }`}
                    >
                      <span
                        className={`${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent'
                            : 'text-white'
                        }`}
                      >
                        {content[language].hero.portfolioButton}
                      </span>
                    </button>
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </section>
        </div>
        
{/* Projects Section */}
<section className={`section py-16 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-indigo-50'}`}>
  <div className="max-w-7xl mx-auto">
    <AnimatedSection>
      <div className="text-center mb-12">
        <h2 className="title text-4xl md:text-5xl font-bold font-['Comikax']">
          <span className={`${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>
            {content[language].projects.title}
          </span>
        </h2>
        <p className={`description mt-4 text-lg md:text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
          {content[language].projects.subtitle}
        </p>
      </div>
    </AnimatedSection>

    {/* Mobile swipeable container - NOW VISIBLE */}
    <div className="block lg:hidden relative"> {/* Changed from lg:hidden to block lg:hidden */}
      <div 
        id="projects-slider"
        className="flex overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 no-scrollbar"
        style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
      >
        {projects.slice(0, 3).map((project, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 w-10/12 px-2 snap-center"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className={`relative p-6 rounded-xl border transition-all duration-300 group ${theme === 'dark' ? 'border-gray-700 bg-gray-800 hover:bg-gray-700/70' : 'border-gray-200 bg-white hover:bg-gray-50'} hover:shadow-lg h-full`}>
              <div className="relative h-40 w-full overflow-hidden rounded-lg">
                <img
                  src={project.imageUrl || 'https://via.placeholder.com/400x200'}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/400x200?text=${encodeURIComponent(project.title)}`;
                  }}
                />
              </div>
              <h3 className={`text-xl font-bold mt-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} transition-colors duration-300 group-hover:text-indigo-500`}>
                {project.title || 'Untitled Project'}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3 line-clamp-2`}>
                {project.description || 'No description available'}
              </p>
              {project.technologies && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tag, i) => (
                    <span key={i} className={`px-2 py-1 text-xs rounded-full ${theme === 'dark' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <Link to={`/project/${project._id}`} className={`inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${theme === 'dark' ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                View Details
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation buttons */}
      {projects.length > 1 && ( // Only show buttons if there are multiple projects
        <>
          <button 
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 z-10 hover:bg-black/70 transition-all"
            onClick={() => {
              const slider = document.getElementById('projects-slider');
              slider.scrollBy({ left: -slider.offsetWidth * 0.8, behavior: 'smooth' });
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 z-10 hover:bg-black/70 transition-all"
            onClick={() => {
              const slider = document.getElementById('projects-slider');
              slider.scrollBy({ left: slider.offsetWidth * 0.8, behavior: 'smooth' });
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>

    {/* Enhanced Desktop Grid */}
    <div className="hidden lg:block">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {projects.slice(0, 6).map((project, index) => (
          <AnimatedSection key={index} delay={index * 100}>
            <div className={`relative p-6 rounded-xl border transition-all duration-300 group ${theme === 'dark' ? 'border-gray-700 bg-gray-800 hover:bg-gray-700/70' : 'border-gray-200 bg-white hover:bg-gray-50'} hover:shadow-lg hover:-translate-y-2 h-full flex flex-col`}>
              <div className="relative h-48 w-full overflow-hidden rounded-lg mb-4">
                <img
                  src={project.imageUrl || 'https://via.placeholder.com/600x400'}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/600x400?text=${encodeURIComponent(project.title)}`;
                  }}
                />
              </div>
              <div className="flex-grow">
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2 group-hover:text-indigo-500 transition-colors`}>
                  {project.title || 'Untitled Project'}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4 line-clamp-3`}>
                  {project.description || 'No description available'}
                </p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tag, i) => (
                      <span key={i} className={`px-2 py-1 text-xs rounded-full ${theme === 'dark' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Link 
                to={`/project/${project._id}`} 
                className={`mt-auto inline-flex items-center justify-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${theme === 'dark' ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              >
                View Details
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>

       {/* View All Button */}
    <div className="text-center mt-12 lg:mt-16">
      <Link 
        to="/portfolio" 
        className={`px-8 py-3.5 rounded-lg font-medium transition-all duration-300 inline-flex items-center text-lg ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} hover:shadow-lg hover:-translate-y-1`}
      >
        {language === 'en' ? 'View All Projects' : language === 'fr' ? 'Voir Tous les Projets' : 'عرض جميع المشاريع'}
        <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  </div>
</section>

        {/* Expertise Section */}
<section className={`section py-16 px-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
  <div className="max-w-6xl mx-auto">
    <AnimatedSection>
      <h2 className="title text-4xl md:text-5xl font-bold mb-12 font-['Comikax']">
        <span className={`${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>{content[language].expertise.title}</span>
      </h2>
    </AnimatedSection>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
      {content[language].expertise.services.map((service, index) => (
        <AnimatedSection key={index} delay={index * 100}>
          <div className={`p-6 rounded-xl border transition-all duration-300 h-full flex flex-col ${theme === 'dark' ? 'border-gray-700 bg-gray-700/30 hover:bg-gray-700/50' : 'border-gray-200 bg-indigo-50/50 hover:bg-indigo-100/50'} hover:shadow-lg hover:-translate-y-1`}>
            <div className="flex items-center mb-4">
              <div className="mr-4">
                {[
                  <svg className="w-10 h-10 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>,
                  <svg className="w-10 h-10 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>,
                  <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>,
                  <svg className="w-10 h-10 text-purple-500" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14h-8V4h8v12zm-3-7l-4 4h3v6h2v-6h3l-4-4z"/></svg>,
                  <svg className="w-10 h-10 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 8l-4 4h3c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-6c0-1.1.9-2 2-2h3l-4-4V4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v4z"/></svg>,
                  <svg className="w-10 h-10 text-cyan-500" fill="currentColor" viewBox="0 0 24 24"><path d="M11 9h2v6h-2zm0-4h2v2h-2zm4 8h2v2h-2zm-8 0h2v2H7zm4-12C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S15.52 1 11 1zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                ][index]}
              </div>
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {service.title}
              </h3>
            </div>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} flex-grow`}>
              {service.title === "AI Integration" ? 
                (language === 'en' ? "Planning to develop AI-powered solutions in the future as I expand my machine learning expertise." :
                 language === 'fr' ? "Prévoit de développer des solutions alimentées par l'IA à l'avenir au fur et à mesure que j'approfondis mon expertise en apprentissage automatique." :
                 "التخطيط لتطوير حلول مدعومة بالذكاء الاصطناعي في المستقبل مع توسيع خبرتي في التعلم الآلي.") 
                : service.description}
            </p>
          </div>
        </AnimatedSection>
      ))}
    </div>
  </div>
</section>

<section className={`section py-16 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-indigo-50'}`}>
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <h2 className="title text-4xl md:text-5xl font-bold mb-12 font-['Comikax']">
                <span className={`${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>{content[language].education.title}</span>
              </h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-1 lg:gap-8">
              <AnimatedSection delay={100}>
                <div className={`p-6 rounded-xl border transition-all duration-300 ${theme === 'dark' ? 'border-gray-700 bg-gray-800 hover:bg-gray-700/70' : 'border-gray-200 bg-white hover:bg-gray-50'} hover:shadow-lg hover:-translate-y-1 max-w-sm mx-auto lg:max-w-3xl lg:p-8`}>
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} lg:text-2xl`}>
                    {content[language].education.emsi}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-2 lg:text-base`}>
                    Diving into Ingénierie Informatique et Réseaux, mastering AI, cybersecurity, and cloud platforms.
                    <br />
                    Aiming to excel in C++, network architecture, and data science projects for 2025–2026 in Rabat.
                  </p>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={200}>
                <div className={`p-6 rounded-xl border transition-all duration-300 ${theme === 'dark' ? 'border-gray-700 bg-gray-800 hover:bg-gray-700/70' : 'border-gray-200 bg-white hover:bg-gray-50'} hover:shadow-lg hover:-translate-y-1 max-w-sm mx-auto lg:max-w-3xl lg:p-8`}>
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} lg:text-2xl`}>
                    {content[language].education.ofppt}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-2 lg:text-base`}>
                    Trained in Web Full Stack, mastering React, Node.js, Agile, and cloud-native development.
                    <br />
                    Completed hands-on projects with SQL/NoSQL databases and internships from 2023–2025 in Taza.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className={`section py-16 px-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <h2 className="title text-4xl md:text-5xl font-bold mb-12 font-['Comikax']">
                <span className={`${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>{content[language].about.title}</span>
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <p className={`description mb-4 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {content[language].about.description1}
              </p>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <p className={`description ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
                {content[language].about.description2}
              </p>
            </AnimatedSection>
            <AnimatedSection delay={300}>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/portfolio"
                  className={`px-6 py-2 rounded-full font-medium ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                >
                  {content[language].about.workButton}
                </Link>
                <Link
                  to="/contact"
                  className={`px-6 py-2 rounded-full font-medium ${theme === 'dark' ? 'bg-transparent border border-indigo-500 hover:bg-indigo-900/30 text-indigo-400' : 'bg-transparent border border-indigo-600 hover:bg-indigo-100 text-indigo-700'}`}
                >
                  {content[language].about.contactButton}
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <Link
          to="/contact"
          className={`fixed right-6 bottom-6 w-16 h-16 rounded-full flex items-center justify-center shadow-lg z-50 transition-all duration-300 hover:scale-110 ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          aria-label={content[language].about.contactButton}
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