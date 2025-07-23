import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlusCircle, FiSearch } from 'react-icons/fi';
import { useTheme } from '../../../contexts/ThemeContext';
import AnimatedSection from '../../../components/ui/AnimatedSection';

const getIndustryIcon = (industry) => {
  switch(industry) {
    case 'Technology': return 'fas fa-laptop-code';
    case 'Finance': return 'fas fa-chart-line';
    case 'Healthcare': return 'fas fa-heartbeat';
    case 'Education': return 'fas fa-graduation-cap';
    case 'Manufacturing': return 'fas fa-industry';
    case 'Retail': return 'fas fa-shopping-bag';
    case 'Entertainment': return 'fas fa-film';
    case 'Telecommunications': return 'fas fa-phone-alt';
    case 'Automotive': return 'fas fa-car';
    case 'Energy': return 'fas fa-bolt';
    default: return 'fas fa-briefcase';
  }
};

const ExperiencePage = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const { theme } = useTheme();

  const industries = [...new Set(experiences.map(exp => exp.industry))];

  const fetchExperiences = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/experience?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setExperiences(response.data.data || []);
      setTotalPages(response.data.total_pages || 1);
      setCurrentPage(response.data.page || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load experiences');
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/experience/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setExperiences(prev => prev.filter(exp => exp._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete experience');
      }
    }
  };

  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = 
      exp.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || exp.industry === filter;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-indigo-600 font-semibold">Loading experiences...</div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-600 dark:text-red-400 mt-10">{error}</div>
  );

  return (
    <div className={`max-w-7xl mx-auto p-6 rounded-lg pt-24 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <AnimatedSection>
          <h1 className={`text-3xl md:text-4xl font-extrabold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
            Experience Dashboard
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage your professional experience
          </p>
        </AnimatedSection>
        
        <button
          onClick={() => navigate('/admin/experience/add')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
        >
          <FiPlusCircle size={20} />
          Add Experience
        </button>
      </div>

      {/* Search and Filter */}
      <AnimatedSection delay={100}>
        <div className={`mb-8 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <FiSearch className={`absolute left-3 top-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search experiences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
            >
              <option value="all">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
        </div>
      </AnimatedSection>

      {filteredExperiences.length === 0 ? (
        <div className={`text-center p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
          No experiences found. {searchTerm ? 'Try a different search term.' : 'Add your first experience!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredExperiences.map((exp) => (
            <AnimatedSection key={exp._id} delay={Math.min(200 * (experiences.indexOf(exp) + 1), 1000)}>
              <div className={`rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
                {/* Image Section */}
                {exp.image_url ? (
                  <div className="relative h-48 w-full">
                    <img 
                      src={`http://localhost:5000${exp.image_url}`} 
                      alt={exp.position} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/600x400?text=${exp.company[0]}`;
                      }}
                    />
                    {exp.industry && (
                      <div className="absolute top-2 right-2">
                        <i className={`${getIndustryIcon(exp.industry)} text-2xl ${theme === 'dark' ? 'text-white bg-black/50 p-2 rounded-full' : 'text-indigo-600'}`} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`h-48 w-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
                    <span className="text-4xl font-bold text-indigo-500">
                      {exp.company[0]}
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        {exp.position}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <i className={`${getIndustryIcon(exp.industry)} text-xs ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                        <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                          {exp.company}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                          {exp.industry || 'Unspecified'}
                        </span>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                      {exp.duration}
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {exp.location}
                    </p>
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <p className={`mt-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} line-clamp-3`}>
                      {exp.description}
                    </p>
                  )}

                  {/* Technologies */}
                  {exp.technologies?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {exp.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded-full ${theme === 'dark' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-800'}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => navigate(`/admin/experience/edit/${exp._id}`)}
                      className={`flex items-center gap-1 ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
                      title="Edit Experience"
                    >
                      <FiEdit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className={`flex items-center gap-1 ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
                      title="Delete Experience"
                    >
                      <FiTrash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`mt-8 flex justify-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => fetchExperiences(page)}
                className={`px-3 py-1 rounded-md ${
                  page === currentPage 
                    ? theme === 'dark' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-indigo-100 text-indigo-800'
                    : theme === 'dark' 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperiencePage;