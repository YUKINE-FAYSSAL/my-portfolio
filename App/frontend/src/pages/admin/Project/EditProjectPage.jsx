import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUpload, FiX, FiSave, FiArrowLeft } from 'react-icons/fi';
import { useTheme } from '../../../contexts/ThemeContext';
import AnimatedSection from '../../../components/ui/AnimatedSection';

const EditProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    link: '',
    technologies: [],
    status: 'active',
    featured: false,
    imageUrl: ''
  });
  const [techInput, setTechInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setForm(response.data);
        if (response.data.image_url) {
          setImagePreview(`http://localhost:5000${response.data.image_url}`);
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to load project');
        navigate('/admin/projects');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id, navigate]);

  const handleAddTech = () => {
    if (techInput && !form.technologies.includes(techInput)) {
      setForm({ ...form, technologies: [...form.technologies, techInput] });
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech) => {
    setForm({ ...form, technologies: form.technologies.filter(t => t !== tech) });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      alert('Title and description are required');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Append all form data
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'technologies') {
          value.forEach(tech => formData.append('technologies[]', tech));
        } else if (key !== 'imageUrl' && key !== 'image_url') {
          formData.append(key, value);
        }
      });
      
      // Append image if exists
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await axios.put(`http://localhost:5000/api/projects/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/admin/projects');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Edit Project</h1>
          <button
            onClick={() => navigate('/admin/projects')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <FiArrowLeft /> Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <AnimatedSection>
            <div>
              <label className={`block mb-2 font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Project Image
              </label>
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className={`absolute top-2 right-2 p-2 rounded-full ${
                      theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                    } shadow-md`}
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer ${
                  theme === 'dark' 
                    ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' 
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUpload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF (MAX. 5MB)
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              )}
            </div>
          </AnimatedSection>

          {/* Title */}
          <AnimatedSection delay={100}>
            <div>
              <label className={`block mb-2 font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Project Title*
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                className={`w-full px-4 py-2 rounded-md border ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
                required
              />
            </div>
          </AnimatedSection>

          {/* Description */}
          <AnimatedSection delay={150}>
            <div>
              <label className={`block mb-2 font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Description*
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                rows="5"
                className={`w-full px-4 py-2 rounded-md border ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
                required
              />
            </div>
          </AnimatedSection>

          {/* Link */}
          <AnimatedSection delay={200}>
            <div>
              <label className={`block mb-2 font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Project Link
              </label>
              <input
                type="url"
                value={form.link}
                onChange={(e) => setForm({...form, link: e.target.value})}
                className={`w-full px-4 py-2 rounded-md border ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
            </div>
          </AnimatedSection>

          {/* Technologies */}
          <AnimatedSection delay={250}>
            <div>
              <label className={`block mb-2 font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Technologies
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTech()}
                  className={`flex-1 px-4 py-2 rounded-md border ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  placeholder="Add technology"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className={`px-4 py-2 rounded-md ${
                    theme === 'dark' 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  Add
                </button>
              </div>
              {form.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                        theme === 'dark' 
                          ? 'bg-indigo-900/50 text-indigo-300' 
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="hover:text-red-500"
                      >
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Status and Featured */}
          <AnimatedSection delay={300}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block mb-2 font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({...form, status: e.target.value})}
                  className={`w-full px-4 py-2 rounded-md border ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({...form, featured: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    Featured Project
                  </span>
                </label>
              </div>
            </div>
          </AnimatedSection>

          {/* Submit Button */}
          <AnimatedSection delay={350}>
            <button
              type="submit"
              disabled={saving}
              className={`w-full py-3 px-4 rounded-md flex items-center justify-center gap-2 ${
                saving 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white`}
            >
              <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </AnimatedSection>
        </form>
      </div>
    </div>
  );
};

export default EditProjectPage;