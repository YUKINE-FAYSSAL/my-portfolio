import React, { useState, useEffect } from 'react';
import { fetchItems } from '../../api/api';
import SkillCard from '../../components/portfolio/SkillCard';
import ProjectCard from '../../components/portfolio/ProjectCard';
import ExperienceCard from '../../components/portfolio/ExperienceCard';
import EducationCard from '../../components/portfolio/EducationCard';
import CertificateCard from '../../components/portfolio/CertificateCard';
import { useTheme } from '../../contexts/ThemeContext';
import AnimatedSection from '../../components/ui/AnimatedSection';
import AiBotLoader from '../../components/ui/loading/AiBotLoader';
import useScrollToTop from '../../hooks/useScrollToTop';

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

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [skillsRes, projectsRes, experienceRes, educationRes, certificatesRes] = await Promise.all([
          fetchItems('skills'),
          fetchItems('public/projects'),
          fetchItems('public/experience'),
          fetchItems('public/education'),
          fetchItems('certificates'),
        ]);

        console.log('Education data received:', educationRes); // Keep as is

        setData({
          skills: skillsRes.data || skillsRes || [],
          projects: projectsRes.data || projectsRes || [],
          experience: experienceRes.data || experienceRes || [],
          education: educationRes.data || educationRes || [],
          certificates: certificatesRes.data || certificatesRes || [],
        });
      } catch (err) {
        console.error('Error loading portfolio data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  if (loading) return (
    <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} animate-pulse`}>
      <AiBotLoader />
    </div>
  );

  const Section = ({ title, items, Component, grid, className }) => {
    const propMap = {
      Skills: 'skill',
      Projects: 'project',
      'Featured Projects': 'project',
      'Other Projects': 'project',
      Experience: 'experience',
      Education: 'education',
      Certificates: 'certificate',
    };

    if (!Array.isArray(items)) {
      console.warn(`Invalid items for ${title} section:`, items);
      return null;
    }

    return (
      <section className={`mb-20 ${className || ''} animate-bounce-in`}>
        <AnimatedSection>
          <h2 className={`text-3xl font-bold mb-8 pb-2 border-b ${theme === 'dark' ? 'text-white border-indigo-500' : 'text-gray-800 border-indigo-300'} animate-slide-in-left transition-all duration-500 hover:text-indigo-500 hover:border-indigo-600`}>
            {title}
          </h2>
        </AnimatedSection>
        {items.length === 0 ? (
          <div className={`p-8 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500 shadow-sm'} animate-fade-in`}>
            No {title.toLowerCase()} available.
          </div>
        ) : (
          <div className={`grid ${grid || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
            {items.map((item, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="group relative animate-bounce-in transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/30">
                  <Component key={item._id?.$oid || item._id} {...{ [propMap[title]]: item }} />
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </section>
    );
  };

  // Separate featured and regular projects
  const featuredProjects = data.projects.filter(project => project.featured);
  const regularProjects = data.projects.filter(project => !project.featured);

  return (
    <div className={`relative min-h-screen w-full font-['Space_Grotesk'] ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} overflow-hidden`}>
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-full blur-3xl animate-pulse-slow delay-2000"></div>
        {/* Orbiting Particles */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-indigo-500/50 rounded-full animate-orbit"></div>
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-purple-500/50 rounded-full animate-orbit delay-1500"></div>
        <div className="absolute inset-0 grid grid-cols-12 opacity-5 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-cyan-500/50"></div>
          ))}
        </div>
        <div className="absolute inset-0 grid grid-rows-12 opacity-5 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-b border-cyan-500/50"></div>
          ))}
        </div>
      </div>

      {/* Page Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-16">
          <AnimatedSection>
            <h1 className={`text-4xl sm:text-5xl font-extrabold mb-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} animate-bounce-in transition-all duration-500 hover:text-indigo-500 hover:scale-105`}>
              My Portfolio
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} animate-slide-in-right transition-all duration-300 hover:text-indigo-400`}>
              Showcasing my skills, projects, and professional journey
            </p>
          </AnimatedSection>
        </div>

        <div className="space-y-20">
          {/* Skills Section */}
          <Section 
            title="Skills" 
            items={data.skills} 
            Component={SkillCard} 
            grid="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          />

          {/* Projects Section */}
          {featuredProjects.length > 0 && (
            <Section 
              title="Featured Projects" 
              items={featuredProjects} 
              Component={ProjectCard} 
              grid="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            />
          )}

          {regularProjects.length > 0 && (
            <Section 
              title={featuredProjects.length > 0 ? "Other Projects" : "Projects"} 
              items={regularProjects} 
              Component={ProjectCard} 
              grid="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            />
          )}

          {/* Experience Section */}
          <Section 
            title="Experience" 
            items={data.experience} 
            Component={ExperienceCard} 
            grid="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          />

          {/* Education Section */}
          <Section 
            title="Education" 
            items={data.education} 
            Component={EducationCard} 
            grid="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          />

          {/* Certificates Section */}
          <Section 
            title="Certificates" 
            items={data.certificates} 
            Component={CertificateCard} 
            grid="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          />
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;