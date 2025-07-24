import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FiMail, FiMapPin, FiLinkedin, FiGithub, FiGlobe, FiPhone, FiAward, FiBriefcase, FiCode, FiBookOpen, FiUser, FiDatabase, FiLayers, FiCpu, FiServer, FiSmartphone, FiShield, FiTerminal } from 'react-icons/fi';
import useScrollToTop from '../../hooks/useScrollToTop';
import AnimatedSection from '../../components/ui/AnimatedSection';

const AboutPage = () => {
  useScrollToTop();
  const { theme } = useTheme();
  const [language, setLanguage] = useState('fr'); // Default to French

  const cvStyle = theme === 'dark'
    ? 'bg-gray-900 text-gray-100'
    : 'bg-white text-gray-900';
  const content = {
    en: {
      title: "Full Stack Web Developer",
      about: {
        title: "About Me",
        description: "Passionate Full Stack Developer with expertise in building modern, scalable web applications. Strong problem-solving skills and a keen eye for clean, efficient code. Specialized in JavaScript ecosystems (React, Node.js) with experience in Python frameworks. Currently pursuing Software Engineering while working on freelance projects. Committed to continuous learning and adopting best practices in software development."
      },
      skills: {
        title: "Skills & Technologies"
      },
      experience: {
        title: "Professional Experience",
        items: [
          {
            title: "Freelance Web Developer",
            period: "2023 - Present",
            description: "Created multiple full-stack web applications, personal portfolios, admin dashboards, and REST APIs using modern technologies.",
            achievements: [
              "Built responsive UIs with React and TailwindCSS",
              "Implemented authentication systems with JWT",
              "Developed RESTful APIs with Node.js and Express",
              "Optimized application performance and SEO"
            ]
          },
          {
            title: "Open Source Contributor",
            period: "2022 - Present",
            description: "Contributed to various open-source projects and maintained personal projects.",
            achievements: [
              "Published reusable React components library",
              "Created documentation for open-source projects",
              "Fixed bugs and implemented features in community projects"
            ]
          }
        ]
      },
      projects: {
        title: "Notable Projects",
        items: [
          {
            name: "Portfolio Website",
            tech: "React, Tailwind, Flask API",
            description: "A modern portfolio with dark mode, animations and contact form."
          },
          {
            name: "Blog Platform",
            tech: "MERN Stack (MongoDB, Express, React, Node)",
            description: "Full-featured blog with admin panel, JWT auth, and rich text editor."
          },
          {
            name: "Task Manager App",
            tech: "React, Redux, Firebase",
            description: "Productivity app with real-time updates, drag-and-drop interface."
          }
        ]
      },
      education: {
        title: "Education",
        items: [
          {
            institution: "EMSI Rabat",
            degree: "Engineering in Software Development – Ongoing",
            description: "Advanced coursework in algorithms, software architecture, and cloud computing"
          },
          {
            institution: "OFPPT Taza",
            degree: "Certified Full Stack Developer – 2023",
            description: "Intensive training in web development technologies and best practices"
          }
        ]
      },
      languages: {
        title: "Languages"
      }
    },
    fr: {
      title: "Développeur Web Full Stack",
      about: {
        title: "À propos de moi",
        description: "Développeur Full Stack passionné avec une expertise dans la création d'applications web modernes et évolutives. Fortes compétences en résolution de problèmes et un sens aigu pour un code propre et efficace. Spécialisé dans les écosystèmes JavaScript (React, Node.js) avec une expérience dans les frameworks Python. Actuellement en formation d'ingénieur en logiciel tout en travaillant sur des projets freelance. Engagé dans l'apprentissage continu et l'adoption des meilleures pratiques en développement logiciel."
      },
      skills: {
        title: "Compétences & Technologies"
      },
      experience: {
        title: "Expérience Professionnelle",
        items: [
          {
            title: "Développeur Web Freelance",
            period: "2023 - Présent",
            description: "Création de plusieurs applications web full-stack, portfolios personnels, tableaux de bord administratifs et API REST utilisant des technologies modernes.",
            achievements: [
              "Construction d'interfaces utilisateur réactives avec React et TailwindCSS",
              "Mise en œuvre de systèmes d'authentification avec JWT",
              "Développement d'API RESTful avec Node.js et Express",
              "Optimisation des performances des applications et SEO"
            ]
          },
          {
            title: "Contributeur Open Source",
            period: "2022 - Présent",
            description: "Contribution à divers projets open-source et maintenance de projets personnels.",
            achievements: [
              "Publication d'une bibliothèque de composants React réutilisables",
              "Création de documentation pour des projets open-source",
              "Correction de bugs et implémentation de fonctionnalités dans des projets communautaires"
            ]
          }
        ]
      },
      projects: {
        title: "Projets Notables",
        items: [
          {
            name: "Site Web de Portfolio",
            tech: "React, Tailwind, API Flask",
            description: "Un portfolio moderne avec mode sombre, animations et formulaire de contact."
          },
          {
            name: "Plateforme de Blog",
            tech: "Stack MERN (MongoDB, Express, React, Node)",
            description: "Blog complet avec panneau d'administration, authentification JWT et éditeur de texte enrichi."
          },
          {
            name: "Application de Gestion de Tâches",
            tech: "React, Redux, Firebase",
            description: "Application de productivité avec mises à jour en temps réel et interface de glisser-déposer."
          }
        ]
      },
      education: {
        title: "Éducation",
        items: [
          {
            institution: "EMSI Rabat",
            degree: "Ingénierie en Développement Logiciel – En cours",
            description: "Cours avancés en algorithmes, architecture logicielle et informatique en nuage"
          },
          {
            institution: "OFPPT Taza",
            degree: "Développeur Full Stack Certifié – 2023",
            description: "Formation intensive en technologies de développement web et meilleures pratiques"
          }
        ]
      },
      languages: {
        title: "Langues"
      }
    },
    ar: {
      title: "مطور ويب كامل التقنيات",
      about: {
        title: "عني",
        description: "مطور Full Stack شغوف بخبرة في بناء تطبيقات ويب حديثة وقابلة للتطوير. مهارات قوية في حل المشكلات وحس دقيق لكتابة كود نظيف وفعال. متخصص في بيئات JavaScript (React، Node.js) مع خبرة في أطر عمل Python. أتابع حاليًا دراسة هندسة البرمجيات بينما أعمل على مشاريع مستقلة. ملتزم بالتعلم المستمر وتبني أفضل الممارسات في تطوير البرمجيات."
      },
      skills: {
        title: "المهارات والتقنيات"
      },
      experience: {
        title: "الخبرة المهنية",
        items: [
          {
            title: "مطور ويب مستقل",
            period: "2023 - الحاضر",
            description: "إنشاء عدة تطبيقات ويب كاملة التقنيات، محافظ شخصية، لوحات تحكم إدارية، وواجهات برمجة تطبيقات REST باستخدام تقنيات حديثة.",
            achievements: [
              "بناء واجهات مستخدم متجاوبة باستخدام React و TailwindCSS",
              "تنفيذ أنظمة المصادقة باستخدام JWT",
              "تطوير واجهات برمجة تطبيقات RESTful باستخدام Node.js و Express",
              "تحسين أداء التطبيقات وتحسين محركات البحث"
            ]
          },
          {
            title: "مساهم في المصادر المفتوحة",
            period: "2022 - الحاضر",
            description: "المساهمة في مشاريع مفتوحة المصدر متنوعة وصيانة مشاريع شخصية.",
            achievements: [
              "نشر مكتبة مكونات React قابلة لإعادة الاستخدام",
              "إنشاء وثائق لمشاريع مفتوحة المصدر",
              "إصلاح الأخطاء وتنفيذ الميزات في مشاريع المجتمع"
            ]
          }
        ]
      },
      projects: {
        title: "المشاريع البارزة",
        items: [
          {
            name: "موقع المحفظة الشخصية",
            tech: "React، Tailwind، Flask API",
            description: "محفظة حديثة مع الوضع المظلم، الرسوم المتحركة ونموذج الاتصال."
          },
          {
            name: "منصة التدوين",
            tech: "MERN Stack (MongoDB، Express، React، Node)",
            description: "مدونة كاملة المزايا مع لوحة إدارة، مصادقة JWT، ومحرر نصوص غني."
          },
          {
            name: "تطبيق إدارة المهام",
            tech: "React، Redux، Firebase",
            description: "تطبيق إنتاجية مع تحديثات في الوقت الفعلي وواجهة السحب والإفلات."
          }
        ]
      },
      education: {
        title: "التعليم",
        items: [
          {
            institution: "EMSI الرباط",
            degree: "هندسة تطوير البرمجيات – جارية",
            description: "دورات متقدمة في الخوارزميات، هندسة البرمجيات، والحوسبة السحابية"
          },
          {
            institution: "OFPPT تازة",
            degree: "مطور Full Stack معتمد – 2023",
            description: "تدريب مكثف في تقنيات تطوير الويب وأفضل الممارسات"
          }
        ]
      },
      languages: {
        title: "اللغات"
      }
    }
  };

  const skillsCategories = [
    {
      title: content[language].skills.title,
      icon: <FiSmartphone className="text-indigo-500" />,
      skills: ["React / Redux", "Next.js", "TailwindCSS", "HTML / CSS", "JavaScript (ES6+)", "TypeScript", "Responsive Design"]
    },
    {
      title: content[language].skills.title,
      icon: <FiServer className="text-indigo-500" />,
      skills: ["Node.js / Express", "Python / Flask", "REST APIs", "GraphQL", "JWT / Auth", "WebSockets"]
    },
    {
      title: content[language].skills.title,
      icon: <FiDatabase className="text-indigo-500" />,
      skills: ["MongoDB", "PostgreSQL", "Firebase", "Redis", "ORM / ODM"]
    },
    {
      title: content[language].skills.title,
      icon: <FiTerminal className="text-indigo-500" />,
      skills: ["Git / GitHub", "Docker", "CI/CD", "Linux / CLI", "Agile & SCRUM", "Jest / Testing"]
    }
  ];

  return (
    <div className={`relative min-h-screen font-sans ${cvStyle}`}>
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

      {/* Blurred Circles & Grid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-cyan-900/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 grid grid-cols-12 opacity-5 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-cyan-500"></div>
          ))}
        </div>
        <div className="absolute inset-0 grid grid-rows-12 opacity-5 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-b border-cyan-500"></div>
          ))}
        </div>
      </div>

      {/* Page Content */}
      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className={`rounded-2xl overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Header Section */}
              <section className="relative p-8 md:p-10 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/profil/img.jpg`}
                      alt="Fayssal Abaibat"
                      className="w-44 h-44 rounded-full border-4 border-white shadow-xl transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-indigo-300 transition-all duration-300"></div>
                  </div>
                  <div className="text-center md:text-left space-y-3 flex-1">
                    <h1 className="text-4xl font-bold">Fayssal Abaibat</h1>
                    <h2 className="text-2xl font-semibold">{content[language].title}</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm mt-2">
                      <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                        <FiMapPin /> Rabat, Morocco
                      </span>
                      <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                        <FiMail /> fayssal@example.com
                      </span>
                      <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                        <FiPhone /> +212 6 00 00 00 00
                      </span>
                    </div>
                    <div className="flex gap-5 text-white text-2xl justify-center md:justify-start mt-4">
                      <a href="https://www.linkedin.com/in/fayssal-abaibat-28b5a3353/" 
                         target="_blank" 
                         rel="noreferrer"
                         className="hover:text-indigo-200 transition-colors">
                        <FiLinkedin />
                      </a>
                      <a href="https://github.com/username" 
                         target="_blank" 
                         rel="noreferrer"
                         className="hover:text-indigo-200 transition-colors">
                        <FiGithub />
                      </a>
                      <a href="https://your-portfolio.com" 
                         target="_blank" 
                         rel="noreferrer"
                         className="hover:text-indigo-200 transition-colors">
                        <FiGlobe />
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Main Content */}
              <div className="p-8 md:p-10 space-y-10">
                {/* Summary */}
                <AnimatedSection delay={100}>
                  <section className="space-y-4">
                    <h3 className="text-2xl font-bold text-indigo-600 flex items-center gap-3">
                      <FiUser className="text-indigo-500" /> {content[language].about.title}
                    </h3>
                    <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-indigo-50'}`}>
                      <p className="leading-relaxed">{content[language].about.description}</p>
                    </div>
                  </section>
                </AnimatedSection>

                {/* Skills */}
                <AnimatedSection delay={200}>
                  <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-indigo-600">
                      <FiCode className="inline mr-3 text-indigo-500" /> 
                      {content[language].skills.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {skillsCategories.map((category, index) => (
                        <div 
                          key={index}
                          className={`p-5 rounded-xl shadow-sm ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-indigo-50'}`}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            {category.icon}
                            <h4 className="font-semibold text-lg">{category.title}</h4>
                          </div>
                          <ul className="space-y-2">
                            {category.skills.map((skill, i) => (
                              <li key={i} className="flex items-center">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                                {skill}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                </AnimatedSection>

                {/* Experience */}
                <AnimatedSection delay={300}>
                  <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-indigo-600 flex items-center gap-3">
                      <FiBriefcase className="text-indigo-500" /> {content[language].experience.title}
                    </h3>
                    <div className="space-y-8">
                      {content[language].experience.items.map((exp, index) => (
                        <div 
                          key={index}
                          className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-indigo-50'}`}
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
                            <h4 className="font-bold text-lg">{exp.title}</h4>
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              {exp.period}
                            </span>
                          </div>
                          <p className="mb-4">{exp.description}</p>
                          <ul className="space-y-2 pl-5">
                            {exp.achievements.map((achievement, i) => (
                              <li key={i} className="relative before:absolute before:left-[-1rem] before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-indigo-500">
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                </AnimatedSection>

                {/* Projects */}
                <AnimatedSection delay={400}>
                  <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-indigo-600 flex items-center gap-3">
                      <FiLayers className="text-indigo-500" /> {content[language].projects.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {content[language].projects.items.map((project, index) => (
                        <div 
                          key={index}
                          className={`p-6 rounded-lg border ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200 shadow-sm'}`}
                        >
                          <h4 className="font-bold text-lg mb-2">{project.name}</h4>
                          <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>
                            {project.tech}
                          </p>
                          <p className="text-sm">{project.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </AnimatedSection>

                {/* Education */}
                <AnimatedSection delay={500}>
                  <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-indigo-600 flex items-center gap-3">
                      <FiAward className="text-indigo-500" /> {content[language].education.title}
                    </h3>
                    <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-indigo-50'}`}>
                      <div className="space-y-4">
                        {content[language].education.items.map((edu, index) => (
                          <div key={index} className={index > 0 ? "border-t border-gray-500/30 pt-4" : ""}>
                            <h4 className="font-bold">{edu.institution}</h4>
                            <p>{edu.degree}</p>
                            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              {edu.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </AnimatedSection>

                {/* Languages */}
                <AnimatedSection delay={600}>
                  <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-indigo-600">
                      <FiGlobe className="inline mr-3 text-indigo-500" /> 
                      {content[language].languages.title}
                    </h3>
                    <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-indigo-50'}`}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                            <span className="text-indigo-600 dark:text-indigo-300 font-bold">AR</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{language === 'fr' ? 'Arabe' : language === 'ar' ? 'العربية' : 'Arabic'}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{language === 'fr' ? 'Natif' : language === 'ar' ? 'أصلي' : 'Native'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                            <span className="text-indigo-600 dark:text-indigo-300 font-bold">FR</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{language === 'fr' ? 'Français' : language === 'ar' ? 'الفرنسية' : 'French'}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{language === 'fr' ? 'Professionnel' : language === 'ar' ? 'احترافي' : 'Professional'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                            <span className="text-indigo-600 dark:text-indigo-300 font-bold">EN</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{language === 'fr' ? 'Anglais' : language === 'ar' ? 'الإنجليزية' : 'English'}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{language === 'fr' ? 'Professionnel' : language === 'ar' ? 'احترافي' : 'Professional'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </AnimatedSection>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;