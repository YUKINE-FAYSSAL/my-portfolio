import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    const fetchPortfolioData = async () => {
      try {
        const api = axios.create({
          baseURL: 'http://localhost:5000/api',
          timeout: 10000,
        });

        // Make all requests in parallel
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

        // Ensure we have valid arrays even if the response structure differs
        setData({
          skills: Array.isArray(skills) ? skills : skills?.data || [],
          projects: Array.isArray(projects) ? projects : projects?.data || [],
          experience: Array.isArray(experience) ? experience : experience?.data || [],
          education: Array.isArray(education) ? education : education?.data || [],
          certificates: Array.isArray(certificates) ? certificates : certificates?.data || [],
        });

      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        // Set empty arrays if there's an error
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

const Section = ({ title, items, Component, grid, className }) => {
  const getPropName = () => {
    const lower = title.toLowerCase();
    if (lower.includes('skill')) return 'skill';
    if (lower.includes('project')) return 'project';
    if (lower.includes('experience')) return 'experience';
    if (lower.includes('education')) return 'education';
    if (lower.includes('certificate')) return 'certificate';
    return 'item'; // fallback
  };

  const propName = getPropName();

    return (
      <section className={`mb-20 ${className || ''}`}>
        <h2 className={`text-3xl font-bold mb-8 pb-2 border-b ${theme === 'dark' ? 'text-white border-indigo-500' : 'text-gray-800 border-indigo-300'}`}>
          {title}
        </h2>
        
        {items.length === 0 ? (
          <div className={`p-8 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500 shadow-sm'}`}>
            No {title.toLowerCase()} available.
          </div>
        ) : (
          <div className={`grid ${grid || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
            {items.map((item) => (
              <Component 
                key={item._id?.$oid || item._id || Math.random().toString(36).substring(7)}
                {...{ 
                  [title.toLowerCase().includes('skill') ? 'skill' : 
                  title.toLowerCase().includes('project') ? 'project' : 
                  title.toLowerCase().includes('experience') ? 'experience' : 
                  title.toLowerCase().includes('education') ? 'education' : 
                  'certificate']: item 
                }}
              />
            ))}
          </div>
        )}
      </section>
    );
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <AiBotLoader />
      </div>
    );
  }

  const featuredProjects = data.projects.filter(project => project.featured);
  const regularProjects = data.projects.filter(project => !project.featured);

  return (
    <div className={`relative min-h-screen w-full font-['Space_Grotesk'] ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} overflow-hidden`}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-16">
          <h1 className={`text-4xl sm:text-5xl font-extrabold mb-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
            My Portfolio
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Showcasing my skills, projects, and professional journey
          </p>
        </div>

        <div className="space-y-20">
          <Section 
            title="Skills" 
            items={data.skills} 
            Component={SkillCard} 
            grid="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          />

          {featuredProjects.length > 0 && (
            <Section 
              title="Featured Projects" 
              items={featuredProjects} 
              Component={ProjectCard}
            />
          )}

          {regularProjects.length > 0 && (
            <Section 
              title={featuredProjects.length > 0 ? "Other Projects" : "Projects"} 
              items={regularProjects} 
              Component={ProjectCard}
            />
          )}

          <Section 
            title="Experience" 
            items={data.experience} 
            Component={ExperienceCard}
          />

          <Section 
            title="Education" 
            items={data.education} 
            Component={EducationCard}
          />

          <Section 
            title="Certificates" 
            items={data.certificates} 
            Component={CertificateCard}
          />
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;