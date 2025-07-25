import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SkillCard from '../../components/portfolio/SkillCard';
import ProjectCard from '../../components/portfolio/ProjectCard';
import ExperienceCard from '../../components/portfolio/ExperienceCard';
import EducationCard from '../../components/portfolio/EducationCard';
import CertificateCard from '../../components/portfolio/CertificateCard';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../../components/ui/AnimatedSection';
import AiBotLoader from '../../components/ui/loading/AiBotLoader';
import useScrollToTop from '../../hooks/useScrollToTop';
import ThreeBackground from '../../components/ui/home/ThreeBackground';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const PortfolioPage = () => {
  useScrollToTop();
  const [data, setData] = useState({
    skills: [],
    projects: [],
    experience: [],
    education: [],
    certificates: [],
  });
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const { language } = useLanguage();

  // References for all sections to enable horizontal scrolling
  const sectionRefs = {
    skills: useRef(null),
    featuredProjects: useRef(null),
    regularProjects: useRef(null),
    experience: useRef(null),
    education: useRef(null),
    certificates: useRef(null),
  };

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const api = axios.create({
          baseURL: 'http://localhost:5000/api',
          timeout: 10000,
        });

        const requests = [
          api.get('/public/skills'),
          api.get('/public/projects'),
          api.get('/public/experience'),
          api.get('/public/education'),
          api.get('/public/certificates'),
        ];

        const [
          { data: skills },
          { data: projects },
          { data: experience },
          { data: education },
          { data: certificates },
        ] = await Promise.all(requests);

        setData({
          skills: Array.isArray(skills) ? skills : skills?.data || [],
          projects: Array.isArray(projects) ? projects : projects?.data || [],
          experience: Array.isArray(experience) ? experience : experience?.data || [],
          education: Array.isArray(education) ? education : education?.data || [],
          certificates: Array.isArray(certificates) ? certificates : certificates?.data || [],
        });
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setData({
          skills: [],
          projects: [],
          experience: [],
          education: [],
          certificates: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  // Function to handle horizontal scrolling for any section
  const scrollSection = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Reusable Section component with horizontal scrolling
  const Section = ({ title, items, Component, sectionKey, isHighlighted }) => {
    const getPropName = () => {
      const lower = title.toLowerCase();
      if (lower.includes('skill')) return 'skill';
      if (lower.includes('project')) return 'project';
      if (lower.includes('experience')) return 'experience';
      if (lower.includes('education')) return 'education';
      if (lower.includes('certificate')) return 'certificate';
      return 'item';
    };

    const propName = getPropName();

    return (
      <section className={`mb-12 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} p-6 rounded-xl shadow-lg relative ${isHighlighted ? 'border-2 border-indigo-500' : ''}`}>
        <h2 className={`text-3xl font-bold mb-6 pb-2 border-b-2 ${theme === 'dark' ? 'text-teal-400 border-indigo-600' : 'text-teal-600 border-indigo-500'} font-['Comikax'] ${isHighlighted ? 'bg-gradient-to-r from-purple-400 to-teal-300 bg-clip-text text-transparent' : ''}`}>
          {title}
        </h2>
        {items.length === 0 ? (
          <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100/50 text-gray-500'}`}>
            No {title.toLowerCase()} available.
          </div>
        ) : (
          <div className="relative">
            <div 
              ref={sectionRefs[sectionKey]}
              className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onWheel={(e) => e.currentTarget.scrollLeft += e.deltaY}
            >
              {items.map((item) => (
                <div 
                  key={item._id?.$oid || item._id || Math.random().toString(36).substring(7)} 
                  className={`snap-start flex-shrink-0 ${isHighlighted ? 'w-[90%] sm:w-[50%] md:w-[35%] lg:w-[28%]' : 'w-[80%] sm:w-[40%] md:w-[30%] lg:w-[22%]'}`}
                >
                  <Component 
                    {...{ [propName]: item }}
                    className={`p-6 rounded-xl border transition-all duration-300 ${theme === 'dark' ? 'border-gray-700 bg-gray-800/90 hover:bg-gray-700/70 backdrop-blur-md' : 'border-gray-200 bg-white/90 hover:bg-gray-50'} ${isHighlighted ? 'hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:-translate-y-3 scale-105' : 'hover:shadow-2xl hover:-translate-y-2'} max-w-sm sm:max-w-md lg:max-w-lg ${isHighlighted ? 'h-72' : 'h-60'} flex items-center justify-center`}
                  />
                </div>
              ))}
            </div>
            {items.length > 3 && (
              <>
                <button
                  onClick={() => scrollSection(sectionRefs[sectionKey], 'left')}
                  className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700/80 text-white' : 'bg-white/80 text-gray-800'} hover:bg-opacity-100 transition-all duration-200 shadow-md ${isHighlighted ? 'bg-indigo-600/80 hover:bg-indigo-700 text-white scale-110' : ''}`}
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => scrollSection(sectionRefs[sectionKey], 'right')}
                  className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700/80 text-white' : 'bg-white/80 text-gray-800'} hover:bg-opacity-100 transition-all duration-200 shadow-md ${isHighlighted ? 'bg-indigo-600/80 hover:bg-indigo-700 text-white scale-110' : ''}`}
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        )}
      </section>
    );
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <AiBotLoader />
      </div>
    );
  }

  const content = {
    en: {
      title: "My Portfolio",
      subtitle: "Showcasing my skills, projects, and professional journey",
      noItems: "No {type} available.",
    },
    fr: {
      title: "Mon Portfolio",
      subtitle: "Mise en avant de mes compétences, projets et parcours professionnel",
      noItems: "Aucun {type} disponible.",
    },
    ar: {
      title: "محفظتي",
      subtitle: "عرض مهاراتي ومشاريعي ورحلتي المهنية",
      noItems: "لا {type} متاح.",
    },
  };

  const featuredProjects = data.projects.filter(project => project.featured);
  const regularProjects = data.projects.filter(project => !project.featured);

  return (
    <div className={`min-h-screen w-full font-['Space_Grotesk'] ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <ThreeBackground />
      <div className="content relative z-10">
        <div className="relative bg-black text-white font-['Space_Grotesk'] overflow-hidden min-h-screen flex items-center">
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center z-10">
            <AnimatedSection delay={100}>
              <h1 className={`text-6xl md:text-8xl font-extrabold mb-4 font-['Komigo'] ${theme === 'dark' ? 'bg-gradient-to-r from-purple-400 to-teal-300 bg-clip-text text-transparent drop-shadow-md' : 'text-white drop-shadow-lg'}`}>
                {content[language].title}
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <p className={`text-lg md:text-xl mb-12 max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-200' : 'text-white drop-shadow-sm'}`}>
                {content[language].subtitle}
              </p>
            </AnimatedSection>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          <AnimatedSection>
            <Section 
              title="Skills" 
              items={data.skills} 
              Component={SkillCard}
              sectionKey="skills"
            />
          </AnimatedSection>

          {featuredProjects.length > 0 && (
            <AnimatedSection>
              <Section 
                title="Featured Projects" 
                items={featuredProjects} 
                Component={ProjectCard}
                sectionKey="featuredProjects"
                isHighlighted={true}
              />
            </AnimatedSection>
          )}

          {regularProjects.length > 0 && (
            <AnimatedSection>
              <Section 
                title={featuredProjects.length > 0 ? "Other Projects" : "Projects"} 
                items={regularProjects} 
                Component={ProjectCard}
                sectionKey="regularProjects"
              />
            </AnimatedSection>
          )}

          <AnimatedSection>
            <Section 
              title="Experience" 
              items={data.experience} 
              Component={ExperienceCard}
              sectionKey="experience"
              isHighlighted={true}
            />
          </AnimatedSection>

          <AnimatedSection>
            <Section 
              title="Education" 
              items={data.education} 
              Component={EducationCard}
              sectionKey="education"
            />
          </AnimatedSection>

          <AnimatedSection>
            <Section 
              title="Certificates" 
              items={data.certificates} 
              Component={CertificateCard}
              sectionKey="certificates"
            />
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;