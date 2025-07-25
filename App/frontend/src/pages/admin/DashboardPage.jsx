import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiCode, 
  FiLayers, 
  FiAward, 
  FiBriefcase, 
  FiMail,
  FiTrendingUp,
  FiPlus,
  FiSettings,
  FiDownload,
  FiBarChart
} from 'react-icons/fi';
import { AreaChart, Area,Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const monthlyData = [
  { name: 'Jan', projects: 4, skills: 12, messages: 5 },
  { name: 'Feb', projects: 6, skills: 15, messages: 7 },
  { name: 'Mar', projects: 8, skills: 18, messages: 10 },
  { name: 'Apr', projects: 10, skills: 22, messages: 12 },
  { name: 'May', projects: 12, skills: 25, messages: 15 },
  { name: 'Jun', projects: 15, skills: 28, messages: 20 }
];

const projectStatus = [
  { name: 'Completed', value: 15, color: '#10b981' },
  { name: 'In Progress', value: 8, color: '#f59e0b' },
  { name: 'Planning', value: 3, color: '#6b7280' }
];

const DashboardPage = () => {
  const [stats, setStats] = useState({
    skills: 0,
    projects: 0,
    certificates: 0,
    experiences: 0,
    messages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('6m');

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        skillsRes,
        projectsRes,
        certificatesRes,
        experienceRes,
        messagesRes
      ] = await Promise.allSettled([
        api.get('/skills'),
        api.get('/projects'),
        api.get('/certificates'),
        api.get('/experience'),
        api.get('/messages')
      ]);

      const getCount = (result) => {
        if (result.status === 'fulfilled') {
          const data = result.value.data;
          if (Array.isArray(data)) return data.length;
          if (data?.data && Array.isArray(data.data)) return data.data.length;
          if (typeof data === 'object' && data.total) return data.total;
        }
        return 0;
      };

      setStats({
        skills: getCount(skillsRes),
        projects: getCount(projectsRes),
        certificates: getCount(certificatesRes),
        experiences: getCount(experienceRes),
        messages: getCount(messagesRes)
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin" style={{ animationDelay: '0.15s', animationDuration: '1s' }}></div>
        <div className="mt-4 text-center">
          <div className="text-purple-300 font-semibold">Loading Dashboard...</div>
          <div className="text-sm text-purple-400 mt-1">Analyzing your portfolio</div>
        </div>
      </div>
    </div>
  );

  const StatsCard = ({ title, value, icon, trend, trendValue, color, onClick }) => (
    <div 
      onClick={onClick}
      className={`relative p-6 rounded-2xl bg-gradient-to-br ${color} backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
          {icon}
        </div>
        <div className={`flex items-center space-x-1 text-sm ${trend === 'up' ? 'text-green-300' : 'text-red-300'}`}>
          <FiTrendingUp className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
          <span>+{trendValue}%</span>
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-white/80 text-sm font-medium">{title}</div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );

  const QuickActionButton = ({ icon, label, onClick, color }) => (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl bg-gradient-to-br ${color} text-white font-semibold hover:scale-105 transition-all duration-300 flex items-center space-x-3 group hover:shadow-lg`}
    >
      <div className="p-2 rounded-lg bg-white/20 group-hover:bg-white/30 transition-all duration-300">
        {icon}
      </div>
      <span>{label}</span>
    </button>
  );

  const AnalyticsCard = ({ title, children, className = "" }) => (
    <div className={`p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 ${className}`}>
      <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
        <FiBarChart className="text-purple-400" />
        <span>{title}</span>
      </h3>
      {children}
    </div>
  );

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center p-8 rounded-2xl bg-red-500/10 backdrop-blur-sm border border-red-500/20">
          <div className="text-red-400 text-xl font-semibold mb-2">Error Loading Dashboard</div>
          <div className="text-red-300">{error}</div>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 p-6 md:p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Portfolio Dashboard
              </h1>
              <p className="text-slate-300 text-lg">Welcome back! Here's what's happening with your portfolio.</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-purple-500 transition-colors duration-300"
              >
                <option value="1m">Last Month</option>
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
              </select>
              <button className="p-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300">
                <FiDownload className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Skills"
            value={stats.skills}
            icon={<FiCode className="w-6 h-6 text-white" />}
            trend="up"
            trendValue="12"
            color="from-purple-600 to-purple-700"
            onClick={() => window.location.href = '/admin/skills'}
          />
          <StatsCard
            title="Projects"
            value={stats.projects}
            icon={<FiLayers className="w-6 h-6 text-white" />}
            trend="up"
            trendValue="8"
            color="from-cyan-600 to-cyan-700"
            onClick={() => window.location.href = '/admin/projects'}
          />
          <StatsCard
            title="Certificates"
            value={stats.certificates}
            icon={<FiAward className="w-6 h-6 text-white" />}
            trend="up"
            trendValue="25"
            color="from-emerald-600 to-emerald-700"
            onClick={() => window.location.href = '/admin/certificates'}
          />
          <StatsCard
            title="Experience"
            value={stats.experiences}
            icon={<FiBriefcase className="w-6 h-6 text-white" />}
            trend="up"
            trendValue="5"
            color="from-orange-600 to-orange-700"
            onClick={() => window.location.href = '/admin/experience'}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Messages"
            value={stats.messages}
            icon={<FiMail className="w-6 h-6 text-white" />}
            trend="up"
            trendValue="20"
            color="from-indigo-600 to-indigo-700"
            onClick={() => window.location.href = '/admin/messages'}
          />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <FiBarChart className="text-yellow-400" />
            <span>Quick Actions</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionButton
              icon={<FiPlus className="w-5 h-5" />}
              label="Add Skill"
              color="from-purple-600 to-purple-700"
              onClick={() => window.location.href = '/admin/skills/new'}
            />
            <QuickActionButton
              icon={<FiLayers className="w-5 h-5" />}
              label="New Project"
              color="from-cyan-600 to-cyan-700"
              onClick={() => window.location.href = '/admin/projects/new'}
            />
            <QuickActionButton
              icon={<FiAward className="w-5 h-5" />}
              label="Add Certificate"
              color="from-emerald-600 to-emerald-700"
              onClick={() => window.location.href = '/admin/certificates/new'}
            />
            <QuickActionButton
              icon={<FiSettings className="w-5 h-5" />}
              label="Settings"
              color="from-orange-600 to-orange-700"
              onClick={() => window.location.href = '/admin/settings'}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnalyticsCard title="Portfolio Growth">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorSkills" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Area type="monotone" dataKey="projects" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorProjects)" strokeWidth={2} />
                <Area type="monotone" dataKey="skills" stroke="#06b6d4" fillOpacity={1} fill="url(#colorSkills)" strokeWidth={2} />
                <Area type="monotone" dataKey="messages" stroke="#f59e0b" fillOpacity={1} fill="url(#colorMessages)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </AnalyticsCard>

          <AnalyticsCard title="Project Status">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={projectStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {projectStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </AnalyticsCard>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-400">
            Dashboard last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;