import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import { useTheme } from '../../../contexts/ThemeContext';
import AnimatedSection from '../../../components/ui/AnimatedSection';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const fetchProjects = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/projects?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Ensure we're working with an array
      const projectsData = Array.isArray(response.data.data) 
        ? response.data.data 
        : Array.isArray(response.data) 
          ? response.data 
          : [];
      
      setProjects(projectsData);
      setTotalPages(response.data.total_pages || 1);
      setCurrentPage(response.data.page || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
      setProjects([]); // Ensure projects is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProjects(prev => Array.isArray(prev) ? prev.filter(project => project._id !== id) : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  // Ensure filteredProjects is always an array
  const filteredProjects = Array.isArray(projects) 
    ? projects.filter(project => 
        (project.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.description?.toLowerCase().includes(searchTerm.toLowerCase())))
    : [];

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-red-500">{error}</div>
    </div>
  );

  return (
    <div className={`pt-20 p-6 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <AnimatedSection>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Projects Management</h1>
          <p className="text-sm opacity-75">Manage your portfolio projects</p>
        </AnimatedSection>
        
        <button
          onClick={() => navigate('/admin/projects/add')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            theme === 'dark' 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <FiPlus /> Add Project
        </button>
      </div>

      {/* Search */}
      <AnimatedSection delay={100}>
        <div className={`mb-6 p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <div className="relative">
            <FiSearch className={`absolute left-3 top-3 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-md ${
                theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
              } border ${
                theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
              }`}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className={`col-span-full text-center py-10 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
          }`}>
            {searchTerm ? 'No matching projects found' : 'No projects available'}
          </div>
        ) : (
          filteredProjects.map((project) => (
            <AnimatedSection key={project._id} delay={100 * (projects.indexOf(project) + 1)}>
              <div
                className={`rounded-lg overflow-hidden shadow-md transition-transform hover:scale-[1.02] ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } border`}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={project.image_url ? `http://localhost:5000${project.image_url}` : 'https://via.placeholder.com/400x225?text=Project'}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x225?text=Project';
                    }}
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className={`text-lg font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      {project.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/projects/edit/${project._id}`)}
                        className={`p-1.5 rounded-md ${
                          theme === 'dark' 
                            ? 'text-indigo-400 hover:bg-gray-700' 
                            : 'text-indigo-600 hover:bg-gray-100'
                        }`}
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className={`p-1.5 rounded-md ${
                          theme === 'dark' 
                            ? 'text-red-400 hover:bg-gray-700' 
                            : 'text-red-600 hover:bg-gray-100'
                        }`}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  
                  <p className={`mt-2 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  } line-clamp-2`}>
                    {project.description}
                  </p>
                  
                  {project.technologies?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded-full ${
                            theme === 'dark' 
                              ? 'bg-indigo-900/50 text-indigo-300' 
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`mt-8 flex justify-center ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => fetchProjects(page)}
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

export default ProjectsPage;