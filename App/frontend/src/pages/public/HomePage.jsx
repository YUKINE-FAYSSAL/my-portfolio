import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AnimatedSection from '../../components/ui/AnimatedSection';
import { useTheme } from '../../contexts/ThemeContext';
import { FaCode, FaPaintBrush, FaMobileAlt, FaRocket, FaBrain, FaServer } from 'react-icons/fa';
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
  const [language, setLanguage] = useState('fr'); // Default to French

  const content = {
    en: {
      hero: {
        title: "Hi! I'm Fayssal",
        subtitle: "Full Stack Developer & Digital Craftsman",
        description: "I build exceptional digital experiences that are fast, accessible, and visually stunning.",
        portfolioButton: "View Portfolio",
        blogButton: "Read Blog"
      },
      projects: {
        title: "Recent Projects"
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
            description: "Developing cross-platform mobile applications with React Native."
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
            description: "Implementing machine learning models and AI features into your applications."
          }
        ]
      },
      about: {
        title: "About Me",
        description1: "I'm a passionate full-stack developer currently studying at EMSI Rabat and trained at OFPPT Taza. With over 3 years of experience, I specialize in crafting clean, responsive, and performant web applications using modern technologies.",
        description2: "My approach combines technical excellence with creative problem-solving. I believe in writing maintainable code, designing intuitive interfaces, and delivering solutions that exceed expectations.",
        workButton: "View My Work",
        contactButton: "Get In Touch"
      },
      error: "Failed to load projects: {error}. Please ensure the server is running."
    },
    fr: {
      hero: {
        title: "Salut ! Je suis Fayssal",
        subtitle: "Développeur Full Stack & Artisan Numérique",
        description: "Je crée des expériences numériques exceptionnelles, rapides, accessibles et visuellement époustouflantes.",
        portfolioButton: "Voir le Portfolio",
        blogButton: "Lire le Blog"
      },
      projects: {
        title: "Projets Récents"
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
            description: "Développement d'applications mobiles multiplateformes avec React Native."
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
            description: "Implémentation de modèles d'apprentissage automatique et de fonctionnalités IA dans vos applications."
          }
        ]
      },
      about: {
        title: "À Propos de Moi",
        description1: "Je suis un développeur full-stack passionné, actuellement étudiant à EMSI Rabat et formé à OFPPT Taza. Avec plus de 3 ans d'expérience, je me spécialise dans la création d'applications web propres, réactives et performantes en utilisant des technologies modernes.",
        description2: "Mon approche combine l'excellence technique avec une résolution créative des problèmes. Je crois en l'écriture de code maintenable, la conception d'interfaces intuitives et la livraison de solutions qui dépassent les attentes.",
        workButton: "Voir Mon Travail",
        contactButton: "Contactez-Moi"
      },
      error: "Échec du chargement des projets : {error}. Veuillez vous assurer que le serveur est en cours d'exécution."
    },
    ar: {
      hero: {
        title: "مرحبًا! أنا فيصل",
        subtitle: "مطور Full Stack وحرفي رقمي",
        description: "أبني تجارب رقمية استثنائية سريعة، متاحة، ومذهلة بصريًا.",
        portfolioButton: "عرض المحفظة",
        blogButton: "قراءة المدونة"
      },
      projects: {
        title: "المشاريع الأخيرة"
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
            description: "تطوير تطبيقات الهاتف المحمول متعددة المنصات باستخدام React Native."
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
            description: "تنفيذ نماذج التعلم الآلي وميزات الذكاء الاصطناعي في تطبيقاتك."
          }
        ]
      },
      about: {
        title: "عني",
        description1: "أنا مطور full-stack شغوف، أدرس حاليًا في EMSI الرباط وتدربت في OFPPT تازة. مع أكثر من 3 سنوات من الخبرة، أتخصص في صياغة تطبيقات ويب نظيفة ومتجاوبة وذات أداء عالٍ باستخدام تقنيات حديثة.",
        description2: "نهجي يجمع بين التميز التقني وحل المشكلات بإبداع. أؤمن بكتابة كود قابل للصيانة، تصميم واجهات بديهية، وتقديم حلول تتجاوز التوقعات.",
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
        setProjects(normalizedProjects.slice(0, 2));
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

  const services = content[language].expertise.services.map((service, index) => ({
    ...service,
    icon: [
      <FaCode className="text-indigo-500 w-10 h-10" />,
      <FaPaintBrush className="text-pink-500 w-10 h-10" />,
      <FaMobileAlt className="text-green-500 w-10 h-10" />,
      <FaServer className="text-purple-500 w-10 h-10" />,
      <FaRocket className="text-yellow-500 w-10 h-10" />,
      <FaBrain className="text-cyan-500 w-10 h-10" />
    ][index]
  }));

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
      {/* Language Selector */}
      <div className="fixed top-4 right-4 z-50">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </div>

      <div className="content">
        <div className="relative bg-black text-white font-['Space_Grotesk'] overflow-hidden">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/home/big.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: theme === 'dark' ? 'brightness(0.4)' : 'brightness(0.95)',
              opacity: 1,
            }}
          />

          <section className="section relative pt-32 pb-20 px-4 h-screen flex items-center z-10">
            <div className="max-w-6xl mx-auto text-center">
              <AnimatedSection delay={100}>
                <h1 className="title text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
                  {content[language].hero.title}
                </h1>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <h2 className="description text-xl md:text-2xl text-gray-300 mb-8">
                  {content[language].hero.subtitle}
                </h2>
              </AnimatedSection>

              <AnimatedSection delay={300}>
                <p className="description text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
                  {content[language].hero.description}
                </p>
              </AnimatedSection>

              <AnimatedSection delay={400}>
                <div className="flex justify-center gap-4 mb-16 flex-wrap">
                  <Link to="/portfolio" className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600/50 to-purple-600/50 rounded-lg blur opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
                    <button className="px-8 py-3 bg-gradient-to-r from-indigo-900/90 to-purple-900/90 rounded-lg text-white font-medium relative z-10 group-hover:from-indigo-800/90 group-hover:to-purple-800/90 transition-all duration-300">
                      <span className={`${theme === 'dark' ? 'bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent' : 'text-white'}`}>
                        {content[language].hero.portfolioButton}
                      </span>
                    </button>
                  </Link>
                  <Link
                    to="/blog"
                    className="px-8 py-3 border border-cyan-500/30 rounded-lg text-cyan-400 text-base font-medium hover:bg-cyan-900/10 hover:border-cyan-500/50 transition-all duration-300"
                  >
                    {content[language].hero.blogButton}
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </section>
        </div>

        <section className={`section py-16 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-indigo-50'}`}>
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <h2 className="title text-3xl font-bold mb-12 text-center">
                <span className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>{content[language].projects.title}</span>
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <div className={`relative p-6 rounded-xl border transition-all duration-300 group ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} hover:shadow-lg hover:-translate-y-2 hover:scale-105`}>
                    <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                      <img
                        src={project.image_url || project.imageUrl || 'https://via.placeholder.com/400x200'}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/400x200?text=${encodeURIComponent(project.title)}`;
                        }}
                      />
                    </div>
                    <h3 className={`text-xl font-bold mt-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} transition-colors duration-300 group-hover:text-indigo-500`}>
                      {project.title || 'Untitled Project'}
                    </h3>
                    <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300 group-hover:text-indigo-400`}>
                      {project.description || content[language].projects.noDescription || 'No description available'}
                    </p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tag, i) => (
                          <span key={i} className={`px-2.5 py-1 text-xs rounded-full ${theme === 'dark' ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link to={`/project/${project._id}`} className={`inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${theme === 'dark' ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'} animate-glow`}>
                      {content[language].projects.viewDetails || 'View Details'}
                      <svg className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section className={`section py-16 px-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <h2 className="title text-3xl font-bold mb-6">
                <span className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>{content[language].expertise.title}</span>
              </h2>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {services.map((service, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <div className={`p-6 rounded-xl border transition-all duration-300 ${theme === 'dark' ? 'border-gray-700 bg-gray-700/30 hover:bg-gray-700/50' : 'border-gray-200 bg-indigo-50/50 hover:bg-indigo-100/50'} hover:shadow-lg hover:-translate-y-1`}>
                    <div className="flex items-center mb-4">
                      <div className="mr-4">
                        {service.icon}
                      </div>
                      <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        {service.title}
                      </h3>
                    </div>
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {service.description}
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
              <h2 className="title text-3xl font-bold mb-6">
                <span className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>{content[language].about.title}</span>
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