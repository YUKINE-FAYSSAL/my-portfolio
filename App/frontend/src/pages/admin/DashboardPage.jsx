import React, { useState, useEffect } from 'react';
import { fetchItems } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

import StatsCard from '../../components/dashboard/StatsCard';
import QuickActions from '../../components/dashboard/QuickActions';
import RecentBlogPosts from '../../components/dashboard/RecentBlogPosts';
import Sidebar from '../../components/common/Sidebar';
import AnimatedSection from '../../components/ui/AnimatedSection';
import AiBotLoader from '../../components/ui/loading/AiBotLoader';
import PortfolioAnalytics from '../../components/dashboard/PortfolioAnalytics';
import { FiCode, FiLayers, FiAward, FiBriefcase, FiFileText, FiMail } from 'react-icons/fi';
import useScrollToTop from '../../hooks/useScrollToTop';

const DashboardPage = () => {
  useScrollToTop();
  const [stats, setStats] = useState({
    skills: [],
    projects: [],
    certificates: [],
    experiences: [],
    blogPosts: [],
    messages: []
  });
  const [counts, setCounts] = useState({
    skills: 0,
    projects: 0,
    certificates: 0,
    experiences: 0,
    blogPosts: 0,
    messages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch counts for stats cards
        const entities = ['skills', 'projects', 'certificates', 'experience', 'blog', 'messages'];
const countsData = await Promise.all(
  entities.map(entity =>
    fetchItems(entity)
      .then(res => {
        // Handle different response structures
        const data = res.data?.data || res.data || [];
        return Array.isArray(data) ? data.length : 0;
      })
      .catch(err => {
        console.error(`Error fetching ${entity} count:`, err);
        return 0;
      })
  )
);

        setCounts({
          skills: countsData[0],
          projects: countsData[1],
          certificates: countsData[2],
          experiences: countsData[3],
          blogPosts: countsData[4],
          messages: countsData[5]
        });

        // Fetch actual data for analytics
        const [skills, projects] = await Promise.all([
          fetchItems('skills').then(res => res.data),
          fetchItems('projects').then(res => res.data)
        ]);

        setStats({
          skills,
          projects,
          certificates: [],
          experiences: [],
          blogPosts: [],
          messages: []
        });

      } catch (error) {
        setError('Failed to load dashboard data');
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <AiBotLoader />
    </div>
  );

  if (error) return (
    <div className={`text-center py-10 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
      {error}
    </div>
  );

  return (
    <div className={`relative min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} font-['Space_Grotesk']`}>
      {/* Background visuals */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* ... existing background elements ... */}
      </div>

      {/* Main content */}
      <div className="flex flex-col min-h-screen relative z-10">
        <div className="flex flex-1 pt-24">
          <Sidebar />
          <div className="flex-1 pt-24 p-4 md:p-8 pb-32">
            <AnimatedSection>
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-indigo-400">
                Dashboard Overview
              </h1>
            </AnimatedSection>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
              <AnimatedSection delay={100}>
                <StatsCard 
                  title="Skills" 
                  value={counts.skills} 
                  icon={<FiCode className="text-xl" />} 
                  onClick={() => navigate('/admin/skills')} 
                />
              </AnimatedSection>
              <AnimatedSection delay={200}>
                <StatsCard title="Projects" value={counts.projects} icon={<FiLayers className="text-xl" />} onClick={() => navigate('/admin/projects')} />
              </AnimatedSection>
              <AnimatedSection delay={300}>
                <StatsCard title="Certificates" value={counts.certificates} icon={<FiAward className="text-xl" />} onClick={() => navigate('/admin/certificates')} />
              </AnimatedSection>
              <AnimatedSection delay={400}>
                <StatsCard title="Experiences" value={counts.experiences} icon={<FiBriefcase className="text-xl" />} onClick={() => navigate('/admin/experience')} />
              </AnimatedSection>
              <AnimatedSection delay={500}>
                <StatsCard title="Blog Posts" value={counts.blogPosts} icon={<FiFileText className="text-xl" />} onClick={() => navigate('/admin/blog')} />
              </AnimatedSection>
              <AnimatedSection delay={600}>
                <StatsCard title="Messages" value={counts.messages} icon={<FiMail className="text-xl" />} onClick={() => navigate('/admin/messages')} />
              </AnimatedSection>
            </div>

            {/* Analytics and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
              <AnimatedSection delay={200}>
                <div className={`p-6 rounded-xl shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <h2 className="text-xl font-bold mb-4">Portfolio Analytics</h2>
                  <PortfolioAnalytics theme={theme} stats={stats} />
                </div>
              </AnimatedSection>
              <AnimatedSection delay={200}>
                <div className={`p-6 rounded-xl shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                  <QuickActions theme={theme} />
                </div>
              </AnimatedSection>
            </div>

            {/* Recent Blog Posts */}
            <AnimatedSection delay={300}>
              <div className={`p-6 rounded-xl shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h2 className="text-xl font-bold mb-4">Recent Content</h2>
                <RecentBlogPosts theme={theme} />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;