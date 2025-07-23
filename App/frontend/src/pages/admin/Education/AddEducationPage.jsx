import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { ChevronLeft, Upload, X, Plus, Calendar, BookOpen, Award, Globe, Star, GraduationCap, Building, FileText, Users } from 'lucide-react';
import axios from 'axios';

const AddEducationPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { theme } = useTheme();

  const [form, setForm] = useState({
    degree: '',
    institution: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    description: '',
    courses: [],
    gpa: '',
    website: '',
    featured: false
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentCourse, setCurrentCourse] = useState('');
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setErrors({ ...errors, image: 'Please select an image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: 'Image size should be less than 5MB' });
      return;
    }

    setImageFile(file);
    setErrors({ ...errors, image: '' });

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddCourse = () => {
    if (currentCourse.trim() && !form.courses.includes(currentCourse.trim())) {
      setForm({
        ...form,
        courses: [...form.courses, currentCourse.trim()]
      });
      setCurrentCourse('');
    }
  };

  const handleRemoveCourse = (courseToRemove) => {
    setForm({
      ...form,
      courses: form.courses.filter(course => course !== courseToRemove)
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.degree.trim()) newErrors.degree = 'Degree is required';
    if (!form.institution.trim()) newErrors.institution = 'Institution is required';
    if (!form.start_date) newErrors.start_date = 'Start date is required';

    if (form.end_date && form.start_date && new Date(form.end_date) < new Date(form.start_date)) {
      newErrors.end_date = 'End date cannot be before start date';
    }

    if (form.gpa && (parseFloat(form.gpa) < 0 || parseFloat(form.gpa) > 4)) {
      newErrors.gpa = 'GPA must be between 0.0 and 4.0';
    }

    if (form.website && !form.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Please enter a valid URL (starting with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('degree', form.degree);
      formData.append('institution', form.institution);
      formData.append('field_of_study', form.field_of_study);
      formData.append('start_date', form.start_date);
      formData.append('end_date', form.end_date);
      formData.append('description', form.description);
      form.courses.forEach(course => formData.append('courses[]', course));
      if (form.gpa) formData.append('gpa', form.gpa);
      formData.append('website', form.website);
      formData.append('featured', form.featured.toString());
      if (imageFile) formData.append('image', imageFile);

      const response = await axios.post('http://localhost:5000/api/education', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      showToast('success', response.data.message || 'Education added successfully!');

      setForm({
        degree: '',
        institution: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        description: '',
        courses: [],
        gpa: '',
        website: '',
        featured: false
      });
      setImageFile(null);
      setImagePreview(null);
      setCurrentCourse('');
      setErrors({});

      navigate('/admin/education');
    } catch (err) {
      console.error('Error adding education:', err);
      showToast('error', err.response?.data?.message || 'Failed to add education');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/admin/education');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setErrors({ ...errors, image: '' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={20} />
            Back to Education
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-indigo-600/20' : 'bg-indigo-100'}`}>
              <GraduationCap className={`text-2xl ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
            <div>
              <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Add New Education
              </h1>
              <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Add your academic achievements and qualifications
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className={`p-8 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-gray-800/50 backdrop-blur' : 'bg-white'}`}>
            {/* Basic Information Section */}
            <div className="mb-8">
              <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <BookOpen className="text-indigo-500" size={24} />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Degree */}
                <div>
                  <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Degree <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Award className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
                    <input
                      type="text"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-indigo-500/20 ${
                        theme === 'dark'
                          ? 'bg-gray-700/50 text-white border-gray-600 focus:border-indigo-500'
                          : 'bg-white border-gray-200 focus:border-indigo-500'
                      } ${errors.degree ? 'border-red-500' : ''}`}
                      value={form.degree}
                      onChange={(e) => setForm({ ...form, degree: e.target.value })}
                      placeholder="Bachelor of Science, Master of Arts, etc."
                    />
                  </div>
                  {errors.degree && <p className="text-red-500 text-sm mt-1">{errors.degree}</p>}
                </div>

                {/* Institution */}
                <div>
                  <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Institution <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
                    <input
                      type="text"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-indigo-500/20 ${
                        theme === 'dark'
                          ? 'bg-gray-700/50 text-white border-gray-600 focus:border-indigo-500'
                          : 'bg-white border-gray-200 focus:border-indigo-500'
                      } ${errors.institution ? 'border-red-500' : ''}`}
                      value={form.institution}
                      onChange={(e) => setForm({ ...form, institution: e.target.value })}
                      placeholder="University name, College name, etc."
                    />
                  </div>
                  {errors.institution && <p className="text-red-500 text-sm mt-1">{errors.institution}</p>}
                </div>

                {/* Field of Study */}
                <div className="md:col-span-2">
                  <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Field of Study
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-indigo-500/20 ${
                      theme === 'dark'
                        ? 'bg-gray-700/50 text-white border-gray-600 focus:border-indigo-500'
                        : 'bg-white border-gray-200 focus:border-indigo-500'
                    }`}
                    value={form.field_of_study}
                    onChange={(e) => setForm({ ...form, field_of_study: e.target.value })}
                    placeholder="Computer Science, Business Administration, etc."
                  />
                </div>
              </div>
            </div>

            {/* Duration Section */}
            <div className="mb-8">
              <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <Calendar className="text-indigo-500" size={24} />
                Duration
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div>
                  <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-indigo-500/20 ${
                      theme === 'dark'
                        ? 'bg-gray-700/50 text-white border-gray-600 focus:border-indigo-500'
                        : 'bg-white border-gray-200 focus:border-indigo-500'
                    } ${errors.start_date ? 'border-red-500' : ''}`}
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  />
                  {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                </div>

                {/* End Date */}
                <div>
                  <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    End Date <span className="text-sm text-gray-500">(leave blank if current)</span>
                  </label>
                  <input
                    type="date"
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-indigo-500/20 ${
                      theme === 'dark'
                        ? 'bg-gray-700/50 text-white border-gray-600 focus:border-indigo-500'
                        : 'bg-white border-gray-200 focus:border-indigo-500'
                    } ${errors.end_date ? 'border-red-500' : ''}`}
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  />
                  {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
                </div>
              </div>
            </div>

            {/* Additional Details Section */}
            <div className="mb-8">
              <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <FileText className="text-indigo-500" size={24} />
                Additional Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GPA */}
                <div>
                  <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    GPA <span className="text-sm text-gray-500">(0.0 - 4.0)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-indigo-500/20 ${
                      theme === 'dark'
                        ? 'bg-gray-700/50 text-white border-gray-600 focus:border-indigo-500'
                        : 'bg-white border-gray-200 focus:border-indigo-500'
                    } ${errors.gpa ? 'border-red-500' : ''}`}
                    value={form.gpa}
                    onChange={(e) => setForm({ ...form, gpa: e.target.value })}
                    placeholder="3.8"
                  />
                  {errors.gpa && <p className="text-red-500 text-sm mt-1">{errors.gpa}</p>}
                </div>

                {/* Website */}
                <div>
                  <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Institution Website
                  </label>
                  <div className="relative">
                    <Globe className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
                    <input
                      type="url"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-indigo-500/20 ${
                        theme === 'dark'
                          ? 'bg-gray-700/50 text-white border-gray-600 focus:border-indigo-500'
                          : 'bg-white border-gray-200 focus:border-indigo-500'
                      } ${errors.website ? 'border-red-500' : ''}`}
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      placeholder="https://university.edu"
                    />
                  </div>
                  {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  rows="4"
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-indigo-500/20 resize-none ${
                    theme === 'dark'
                      ? 'bg-gray-700/50 text-white border-gray-600 focus:border-indigo-500'
                      : 'bg-white border-gray-200 focus:border-indigo-500'
                  }`}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your education experience, achievements, honors, extracurricular activities, etc."
                />
              </div>
            </div>

            {/* Courses Section */}
            <div className="mb-8">
              <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <Users className="text-indigo-500" size={24} />
                Key Courses
              </h2>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    className={`flex-1 px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-indigo-500/20 ${
                      theme === 'dark'
                        ? 'bg-gray-700/50 text-white border-gray-600 focus:border-indigo-500'
                        : 'bg-white border-gray-200 focus:border-indigo-500'
                    }`}
                    value={currentCourse}
                    onChange={(e) => setCurrentCourse(e.target.value)}
                    placeholder="Enter course name (e.g., Data Structures, Machine Learning)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCourse())}
                  />
                  <button
                    type="button"
                    onClick={handleAddCourse}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors duration-300 flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>

                {form.courses.length > 0 && (
                  <div className="space-y-3">
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Added Courses ({form.courses.length})
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {form.courses.map((course, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-colors ${
                            theme === 'dark'
                              ? 'bg-gray-700/50 text-white border-gray-600'
                              : 'bg-gray-50 text-gray-800 border-gray-200'
                          }`}
                        >
                          <span className="font-medium">{course}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCourse(course)}
                            className={`p-1 rounded-full transition-colors ${
                              theme === 'dark'
                                ? 'text-red-400 hover:text-red-300 hover:bg-red-600/20'
                                : 'text-red-600 hover:text-red-800 hover:bg-red-100'
                            }`}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="mb-8">
              <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <Upload className="text-indigo-500" size={24} />
                Institution Logo/Image
              </h2>

              <div className="space-y-4">
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  theme === 'dark'
                    ? 'border-gray-600 hover:border-indigo-500'
                    : 'border-gray-300 hover:border-indigo-500'
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-4"
                  >
                    <Upload className={`text-4xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    <div>
                      <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Click to upload image
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </label>
                </div>

                {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}

                {imagePreview && (
                  <div className="relative">
                    <div className={`p-4 rounded-xl border-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Image Preview
                        </p>
                        <button
                          type="button"
                          onClick={removeImage}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark'
                              ? 'text-red-400 hover:text-red-300 hover:bg-red-600/20'
                              : 'text-red-600 hover:text-red-800 hover:bg-red-100'
                          }`}
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-contain rounded-lg border-2 border-gray-200 dark:border-gray-600 mx-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Featured Toggle */}
            <div className="mb-8">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-200 dark:border-yellow-600/30">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-5 h-5 text-yellow-600 bg-transparent border-2 border-yellow-400 rounded focus:ring-yellow-500 focus:ring-2"
                  />
                  <Star className="text-yellow-500" size={20} />
                  <label htmlFor="featured" className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Mark as Featured
                  </label>
                </div>
                <p className={`text-sm ml-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Featured education will be highlighted on your profile
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleCancel}
                className={`flex-1 py-4 px-6 font-semibold rounded-xl transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-4 px-6 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving Education...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <GraduationCap size={20} />
                    Save Education
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEducationPage;