import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../../contexts/ToastContext';
import { useTheme } from '../../../contexts/ThemeContext';
import AnimatedSection from '../../../components/ui/AnimatedSection';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  ExternalLink,
  Star,
  AlertCircle,
  GraduationCap
} from 'lucide-react';

const EducationPage = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { theme } = useTheme();

  const fetchEducations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await axios.get('http://localhost:5000/api/education', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Log response for debugging
      console.log('API Response:', response.data);

      // Handle stringified data field
      let educationData = response.data.data;
      if (typeof educationData === 'string') {
        try {
          educationData = JSON.parse(educationData);
        } catch (parseError) {
          throw new Error('Failed to parse education data: Invalid JSON format');
        }
      }

      // Ensure educationData is an array
      educationData = Array.isArray(educationData) ? educationData : [];
      if (!educationData.length) {
        setEducations([]);
        setError('No education entries found.');
      } else {
        // Sanitize education data
        const sanitizedData = educationData.map(edu => ({
          _id: edu._id?.$oid || edu._id || '',
          degree: edu.degree || 'Unknown Degree',
          institution: edu.institution || 'Unknown Institution',
          field_of_study: edu.field_of_study || '',
          start_date: edu.start_date || '',
          end_date: edu.end_date || '',
          description: edu.description || '',
          courses: Array.isArray(edu.courses) ? edu.courses : [],
          gpa: edu.gpa || '',
          website: edu.website || '',
          image_url: edu.image_url || '',
          featured: !!edu.featured
        }));
        setEducations(sanitizedData);
        setError('');
      }
    } catch (err) {
      console.error('Error fetching educations:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch education data';
      setError(errorMessage);
      showToast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  const handleDelete = async (id) => {
    if (!id) {
      showToast('error', 'Invalid education ID');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this education entry?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      await axios.delete(`http://localhost:5000/api/education/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setEducations(prev => prev.filter(edu => edu._id !== id));
      showToast('success', 'Education deleted successfully');
    } catch (err) {
      console.error('Error deleting education:', err);
      showToast('error', err.response?.data?.message || 'Failed to delete education');
    }
  };

  const getEducationIcon = (degree) => {
    if (!degree) return <GraduationCap size={48} />;
    const degreeString = degree.toLowerCase();
    if (degreeString.includes('phd') || degreeString.includes('doctorate')) return <Award size={48} />;
    if (degreeString.includes('master')) return <Award size={48} />;
    if (degreeString.includes('bachelor')) return <GraduationCap size={48} />;
    if (degreeString.includes('diploma') || degreeString.includes('certificate')) return <Award size={48} />;
    return <BookOpen size={48} />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
    } catch {
      return dateString;
    }
  };

  const filteredEducations = educations.filter(edu => {
    if (!edu) return false;

    const matchesSearch =
      (edu.degree && edu.degree.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (edu.institution && edu.institution.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (edu.field_of_study && edu.field_of_study.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || (filter === 'featured' && edu.featured);
    return matchesSearch && matchesFilter;
  });

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <div className={`text-lg font-semibold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
          Loading education data...
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className={`text-center p-8 rounded-lg ${theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'}`}>
        <AlertCircle className="mx-auto text-4xl mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Education</h2>
        <p>{error}</p>
        <button
          onClick={fetchEducations}
          className={`mt-4 px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'} text-white transition-colors`}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-7xl mx-auto p-6 pt-24`}>
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <AnimatedSection>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-indigo-600/20' : 'bg-indigo-100'}`}>
                <GraduationCap className={`text-2xl ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
              <div>
                <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Education Dashboard
                </h1>
                <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage your academic journey • {educations.length} entries
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <button
              onClick={() => navigate('/admin/education/add')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                  : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white'
              }`}
            >
              <Plus size={20} />
              Add Education
            </button>
          </AnimatedSection>
        </div>

        {/* Search and Filter Section */}
        <AnimatedSection delay={150}>
          <div className={`mb-8 p-6 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-gray-800/50 backdrop-blur' : 'bg-white/70 backdrop-blur'}`}>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search by degree, institution, or field..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-indigo-500/20 ${
                    theme === 'dark'
                      ? 'bg-gray-700/50 text-white border-gray-600 focus:border-indigo-500'
                      : 'bg-white border-gray-200 focus:border-indigo-500'
                  }`}
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`px-4 py-3 rounded-xl border-2 min-w-[180px] transition-all duration-300 focus:ring-4 focus:ring-indigo-500/20 ${
                  theme === 'dark'
                    ? 'bg-gray-700/50 text-white border-gray-600 focus:border-indigo-500'
                    : 'bg-white border-gray-200 focus:border-indigo-500'
                }`}
              >
                <option value="all">All Education</option>
                <option value="featured">⭐ Featured Only</option>
              </select>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                <BookOpen size={16} />
                <span className="text-sm font-medium">{filteredEducations.length} Results</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-yellow-600/20 text-yellow-400' : 'bg-yellow-50 text-yellow-600'}`}>
                <Star size={16} />
                <span className="text-sm font-medium">{educations.filter(edu => edu.featured).length} Featured</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Education Grid */}
        {filteredEducations.length === 0 ? (
          <AnimatedSection delay={200}>
            <div className={`text-center p-12 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/50 text-gray-400' : 'bg-white text-gray-600'} shadow-lg`}>
              <GraduationCap className="mx-auto text-6xl mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm ? 'No matching education found' : 'No education entries yet'}
              </h3>
              <p className="mb-6">
                {searchTerm
                  ? 'Try adjusting your search terms or filters.'
                  : 'Start building your academic portfolio by adding your first education entry!'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate('/admin/education/add')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  Add Your First Education
                </button>
              )}
            </div>
          </AnimatedSection>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredEducations.map((edu, index) => {
              const id = edu._id;

              return (
                <AnimatedSection key={id || index} delay={200 + (index * 50)}>
                  <div className={`group rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                    theme === 'dark' ? 'bg-gray-800/80 backdrop-blur' : 'bg-white'
                  }`}>
                    {/* Header Image/Icon */}
                    <div className="relative h-48 overflow-hidden">
                      {edu.image_url ? (
                        <img
                          src={`http://localhost:5000${edu.image_url}`}
                          alt={`${edu.institution || 'Institution'} logo`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://via.placeholder.com/400x200/6366f1/ffffff?text=${(edu.institution || 'Edu')[0]}`;
                          }}
                        />
                      ) : (
                        <div className={`h-full w-full flex items-center justify-center transition-colors duration-300 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-br from-indigo-600/20 to-purple-600/20'
                            : 'bg-gradient-to-br from-indigo-100 to-blue-100'
                        }`}>
                          {getEducationIcon(edu.degree)}
                        </div>
                      )}

                      {/* Featured Badge */}
                      {edu.featured && (
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            <Star size={12} />
                            Featured
                          </div>
                        </div>
                      )}

                      {/* Overlay for actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <button
                          onClick={() => navigate(`/admin/education/edit/${id}`)}
                          className="p-3 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                          title="Edit Education"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          className="p-3 bg-red-500/80 backdrop-blur rounded-full text-white hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
                          title="Delete Education"
                        >
                          <Trash2 size={18} />
                        </button>
                        {edu.website && (
                          <a
                            href={edu.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-blue-500/80 backdrop-blur rounded-full text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                            title="Visit Website"
                          >
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Header */}
                      <div className="mb-4">
                        <h2 className={`text-xl font-bold mb-2 line-clamp-2 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {edu.degree}
                        </h2>

                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className={`text-sm ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                          <p className={`font-semibold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>
                            {edu.institution}
                          </p>
                        </div>

                        {edu.field_of_study && (
                          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {edu.field_of_study}
                          </p>
                        )}
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                        </span>
                      </div>

                      {/* Description */}
                      {edu.description && (
                        <p className={`text-sm mb-4 line-clamp-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {edu.description}
                        </p>
                      )}

                      {/* Courses */}
                      {edu.courses && edu.courses.length > 0 && (
                        <div className="mb-4">
                          <h4 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Key Courses
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {edu.courses.slice(0, 3).map((course, index) => (
                              <span
                                key={index}
                                className={`text-xs px-3 py-1 rounded-full ${
                                  theme === 'dark'
                                    ? 'bg-gray-700/50 text-gray-300 border-gray-600'
                                    : 'bg-gray-100 text-gray-700 border-gray-200'
                                } border`}
                              >
                                {course}
                              </span>
                            ))}
                            {edu.courses.length > 3 && (
                              <span className={`text-xs px-3 py-1 rounded-full ${
                                theme === 'dark'
                                  ? 'bg-gray-700/50 text-gray-300 border-gray-600'
                                  : 'bg-gray-100 text-gray-700 border-gray-200'
                              } border`}>
                                +{edu.courses.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* GPA */}
                      {edu.gpa && (
                        <div className="flex items-center gap-2">
                          <Award className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            GPA: {edu.gpa}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationPage;