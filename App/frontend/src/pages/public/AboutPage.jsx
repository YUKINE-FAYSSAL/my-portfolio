import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FiMail, FiMapPin, FiPhone, FiLinkedin, FiGithub, FiGlobe, FiAward, FiBriefcase, FiCode, FiUser, FiDatabase, FiLayers, FiServer, FiSmartphone, FiTerminal } from 'react-icons/fi';
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';
import useScrollToTop from '../../hooks/useScrollToTop';
import AnimatedSection from '../../components/ui/AnimatedSection';

const AboutPage = () => {
  useScrollToTop();
  const { theme } = useTheme();
  const { language } = useLanguage();

  const cvStyle = theme === 'dark'
    ? 'bg-gray-900 text-gray-100'
    : 'bg-white text-gray-900';

  // Define contact information
  const contact_info = {
    email: 'abaibat.fayssal@hotmail.com',
    phone: '+212694487224',
    address: 'Rabat, Morocco'
  };

  // Define social media links
  const social = {
    github: 'https://github.com/YUKINE-FAYSSAL/',
    linkedin: 'https://www.linkedin.com/in/fayssal-abaibat-28b5a3353/',
    facebook: 'https://www.facebook.com/fayssal.abaibat/',
    whatsapp: 'https://wa.me/212694487224',
    instagram: 'https://instagram.com/fay55al'
  };

  const content = {
    en: {
      title: "Full Stack Web Developer",
      about: {
        title: "About Me",
        description: "Full Stack Developer passionate about crafting modern and scalable web applications. Started my journey at ISTA Taza, where I studied Full Stack Development, Problem Solving, Algorithms, and Entrepreneurship. I’ve built real-world applications using Laravel, Flask, and Node.js for the backend, with React and Angular on the frontend, along with MySQL and MongoDB for data management. Currently continuing my engineering studies in Software Engineering & Network Systems in Rabat, while working on freelance projects and contributing to open-source. I’m deeply committed to clean code, best practices, and continuous learning."
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
            description: "Built full-stack apps, admin dashboards, portfolios, and REST APIs.",
            achievements: [
              "Integrated authentication (JWT) and role-based access",
              "Designed responsive UIs using React, TailwindCSS, Bootstrap",
              "Ensured SEO optimization and performance enhancement"
            ]
          },
          {
            title: "Open Source Contributor",
            period: "2022 - Present",
            description: "Contributed to various open-source projects and maintained personal projects.",
            achievements: [
              "Published reusable React component libraries",
              "Fixed bugs and added new features in community-driven projects",
              "Wrote documentation and improved UX for OSS projects"
            ]
          }
        ]
      },
      projects: {
        title: "Notable Projects",
        items: [
          {
            name: "Car Rental App",
            tech: "Laravel / MySQL / React",
            description: "Complete system for car rental management with user dashboards and admin features."
          },
          {
            name: "Library Management System",
            tech: "Flask / MongoDB / React",
            description: "App created during OFPPT studies to manage books, borrowing, and user roles."
          },
          {
            name: "Portfolio Website",
            tech: "React / Tailwind / Flask API",
            description: "Modern, animated portfolio with dark mode and contact form integration."
          },
          {
            name: "Blog Platform",
            tech: "MERN Stack (MongoDB, Express, React, Node)",
            description: "Full-featured blog with admin panel, JWT auth, and rich text editing."
          },
          {
            name: "Task Manager",
            tech: "React / Redux / Firebase",
            description: "Real-time productivity app with drag-and-drop and notification system."
          }
        ]
      },
      education: {
        title: "Education",
        items: [
          {
            institution: "EMSI Rabat",
            degree: "Engineering in Software Development & Network Systems – Ongoing",
            description: "Advanced studies in algorithms, software architecture, networks, and cloud computing"
          },
          {
            institution: "OFPPT Taza (ISTA)",
            degree: "Certified Full Stack Developer – 2023",
            description: "Intensive training in full stack web development, problem-solving, and entrepreneurship"
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
        description: "Développeur Full Stack passionné par la création d'applications web modernes et évolutives. J'ai commencé mon parcours à ISTA Taza, où j'ai étudié le développement Full Stack, la résolution de problèmes, les algorithmes et l'entrepreneuriat. J'ai construit des applications réelles en utilisant Laravel, Flask et Node.js pour le backend, avec React et Angular pour le frontend, ainsi que MySQL et MongoDB pour la gestion des données. Actuellement, je poursuis mes études d'ingénieur en génie logiciel et systèmes réseau à Rabat, tout en travaillant sur des projets freelance et en contribuant à des projets open-source. Je suis profondément engagé dans l'écriture de code propre, les meilleures pratiques et l'apprentissage continu."
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
            description: "Création d'applications full-stack, de tableaux de bord administratifs, de portfolios et d'API REST.",
            achievements: [
              "Intégration de l'authentification (JWT) et de l'accès basé sur les rôles",
              "Conception d'interfaces utilisateur réactives avec React, TailwindCSS, Bootstrap",
              "Optimisation du SEO et amélioration des performances"
            ]
          },
          {
            title: "Contributeur Open Source",
            period: "2022 - Présent",
            description: "Contribution à divers projets open-source et maintenance de projets personnels.",
            achievements: [
              "Publication de bibliothèques de composants React réutilisables",
              "Correction de bugs et ajout de nouvelles fonctionnalités dans des projets communautaires",
              "Rédaction de documentation et amélioration de l'UX pour des projets OSS"
            ]
          }
        ]
      },
      projects: {
        title: "Projets Notables",
        items: [
          {
            name: "Application de Location de Voitures",
            tech: "Laravel / MySQL / React",
            description: "Système complet pour la gestion de la location de voitures avec tableaux de bord utilisateur et fonctionnalités administratives."
          },
          {
            name: "Système de Gestion de Bibliothèque",
            tech: "Flask / MongoDB / React",
            description: "Application développée pendant les études à OFPPT pour gérer les livres, les emprunts et les rôles des utilisateurs."
          },
          {
            name: "Site Web de Portfolio",
            tech: "React / Tailwind / API Flask",
            description: "Portfolio moderne avec mode sombre, animations et formulaire de contact."
          },
          {
            name: "Plateforme de Blog",
            tech: "Stack MERN (MongoDB, Express, React, Node)",
            description: "Blog complet avec panneau d'administration, authentification JWT et édition de texte enrichi."
          },
          {
            name: "Gestionnaire de Tâches",
            tech: "React / Redux / Firebase",
            description: "Application de productivité en temps réel avec glisser-déposer et système de notifications."
          }
        ]
      },
      education: {
        title: "Éducation",
        items: [
          {
            institution: "EMSI Rabat",
            degree: "Ingénierie en Génie Logiciel et Systèmes Réseaux – En cours",
            description: "Études avancées en algorithmes, architecture logicielle, réseaux et informatique en nuage."
          },
          {
            institution: "OFPPT Taza (ISTA)",
            degree: "Développeur Full Stack Certifié – 2023",
            description: "Formation intensive en développement web full stack, résolution de problèmes et entrepreneuriat."
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
        description: "مطور Full Stack شغوف ببناء تطبيقات ويب حديثة وقابلة للتطوير. بدأت رحلتي في ISTA Taza، حيث درست تطوير Full Stack، حل المشكلات، الخوارزميات، وريادة الأعمال. قمت ببناء تطبيقات واقعية باستخدام Laravel، Flask، و Node.js للخلفية، مع React و Angular للواجهة، إلى جانب MySQL و MongoDB لإدارة البيانات. حاليًا، أواصل دراستي في هندسة البرمجيات وأنظمة الشبكات في الرباط، بينما أعمل على مشاريع مستقلة وأساهم في المصادر المفتوحة. أنا ملتزم بشدة بكتابة كود نظيف، واتباع أفضل الممارسات، والتعلم المستمر."
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
            description: "بناء تطبيقات كاملة، لوحات تحكم إدارية، محافظ شخصية، وواجهات برمجة تطبيقات REST.",
            achievements: [
              "دمج المصادقة (JWT) والوصول بناءً على الأدوار",
              "تصميم واجهات مستخدم متجاوبة باستخدام React، TailwindCSS، Bootstrap",
              "تحسين محركات البحث وتحسين الأداء"
            ]
          },
          {
            title: "مساهم في المصادر المفتوحة",
            period: "2022 - الحاضر",
            description: "المساهمة في مشاريع مفتوحة المصدر وصيانة مشاريع شخصية.",
            achievements: [
              "نشر مكتبات مكونات React قابلة لإعادة الاستخدام",
              "إصلاح الأخطاء وإضافة ميزات جديدة في مشاريع المجتمع",
              "كتابة وثائق وتحسين تجربة المستخدم في مشاريع OSS"
            ]
          }
        ]
      },
      projects: {
        title: "المشاريع البارزة",
        items: [
          {
            name: "تطبيق تأجير السيارات",
            tech: "Laravel / MySQL / React",
            description: "نظام كامل لإدارة تأجير السيارات مع لوحات تحكم للمستخدمين وميزات إدارية."
          },
          {
            name: "نظام إدارة المكتبة",
            tech: "Flask / MongoDB / React",
            description: "تطبيق تم تطويره أثناء دراسات OFPPT لإدارة الكتب، الاستعارة، وأدوار المستخدمين."
          },
          {
            name: "موقع المحفظة الشخصية",
            tech: "React / Tailwind / Flask API",
            description: "محفظة حديثة مع وضع مظلم، رسوم متحركة، وتكامل نموذج الاتصال."
          },
          {
            name: "منصة التدوين",
            tech: "MERN Stack (MongoDB، Express، React، Node)",
            description: "مدونة كاملة المزايا مع لوحة إدارة، مصادقة JWT، وتحرير نصوص غني."
          },
          {
            name: "مدير المهام",
            tech: "React / Redux / Firebase",
            description: "تطبيق إنتاجية في الوقت الفعلي مع السحب والإفلات ونظام الإشعارات."
          }
        ]
      },
      education: {
        title: "التعليم",
        items: [
          {
            institution: "EMSI الرباط",
            degree: "هندسة تطوير البرمجيات وأنظمة الشبكات – جارية",
            description: "دراسات متقدمة في الخوارزميات، هندسة البرمجيات، الشبكات، والحوسبة السحابية"
          },
          {
            institution: "OFPPT تازة (ISTA)",
            degree: "مطور Full Stack معتمد – 2023",
            description: "تدريب مكثف في تطوير الويب الكامل، حل المشكلات، وريادة الأعمال"
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
      skills: ["React / Redux", "Angular", "Next.js", "Tailwind CSS / Bootstrap", "HTML / CSS", "JavaScript (ES6+)", "TypeScript", "Responsive Design"]
    },
    {
      title: content[language].skills.title,
      icon: <FiServer className="text-indigo-500" />,
      skills: ["Node.js / Express", "Python / Flask", "PHP / Laravel", "REST APIs / GraphQL", "JWT Authentication", "WebSockets"]
    },
    {
      title: content[language].skills.title,
      icon: <FiDatabase className="text-indigo-500" />,
      skills: ["MySQL", "MongoDB", "PostgreSQL", "Firebase", "Redis", "ORM / ODM (Sequelize, Mongoose)"]
    },
    {
      title: content[language].skills.title,
      icon: <FiTerminal className="text-indigo-500" />,
      skills: ["Git / GitHub", "Docker", "CI/CD", "Linux / CLI", "Agile / SCRUM", "Testing (Jest, Postman)"]
    }
  ];

  return (
    <div className={`relative min-h-screen font-sans ${cvStyle}`}>
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
                        <FiMapPin /> {contact_info.address}
                      </span>
                      <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                        <FiMail /> {contact_info.email}
                      </span>
                      <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                        <FiPhone /> {contact_info.phone}
                      </span>
                    </div>
                    <div className="flex gap-5 text-white text-2xl justify-center md:justify-start mt-4">
                      <a href={social.linkedin} target="_blank" rel="noreferrer" className="hover:text-indigo-200 transition-colors">
                        <FiLinkedin />
                      </a>
                      <a href={social.github} target="_blank" rel="noreferrer" className="hover:text-indigo-200 transition-colors">
                        <FiGithub />
                      </a>
                      <a href={social.whatsapp} target="_blank" rel="noreferrer" className="hover:text-indigo-200 transition-colors">
                        <FaWhatsapp className="w-5 h-5" />
                      </a>
                      <a href={social.facebook} target="_blank" rel="noreferrer" className="hover:text-indigo-200 transition-colors">
                        <FaFacebook className="w-5 h-5" />
                      </a>
                      <a href={social.instagram} target="_blank" rel="noreferrer" className="hover:text-indigo-200 transition-colors">
                        <FaInstagram className="w-5 h-5" />
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