import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext';
import { FiSave, FiArrowLeft, FiImage, FiTrash2, FiUpload } from 'react-icons/fi';
import { useTheme } from '../../../contexts/ThemeContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getBlogPost, updateBlogPost, uploadBlogImage } from '../../../api/blogApi';

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    title: '',
    content: '',
    excerpt: '',
    categories: [],
    featuredImage: '',
    featured: false,
    date: new Date().toISOString().split('T')[0],
    media: []
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { theme } = useTheme();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const post = await getBlogPost(id);
        setForm({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || '',
          categories: post.categories || [],
          featuredImage: post.featuredImage || '',
          featured: post.featured || false,
          date: post.date ? new Date(post.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          media: post.media || []
        });
      } catch (err) {
        showToast('error', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (value) => {
    setForm(prev => ({ ...prev, content: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsSubmitting(true);
      const { url } = await uploadBlogImage(file);
      setForm(prev => ({ ...prev, featuredImage: url }));
      showToast('success', 'Image uploaded successfully');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      setIsSubmitting(true);
      const uploadPromises = files.map(file => uploadBlogImage(file));
      const results = await Promise.all(uploadPromises);
      const newMedia = results.map(res => ({
        url: res.url,
        type: res.url.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image'
      }));

      setForm(prev => ({ 
        ...prev, 
        media: [...prev.media, ...newMedia] 
      }));
      showToast('success', 'Media uploaded successfully');
    } catch (err) {
      showToast('error', 'Failed to upload media');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeMedia = (index) => {
    setForm(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await updateBlogPost(id, form);
      showToast('success', 'Post updated successfully');
      navigate('/admin/blog');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Blog Post</h2>
          <button
            onClick={() => navigate('/admin/blog')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <FiArrowLeft size={18} />
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Title*
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
              required
            />
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Content*
            </label>
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={handleContentChange}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  ['blockquote', 'code-block'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['link', 'image', 'video'],
                  ['clean']
                ]
              }}
              className={`mb-4 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
            />
          </div>

          {/* Media Upload */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Upload Media (Images/Videos)
            </label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              className="hidden"
              id="mediaUpload"
            />
            <label 
              htmlFor="mediaUpload"
              className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer mb-4 ${
                theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <FiUpload size={16} />
              Select Files
            </label>

            {/* Display Media */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {form.media.map((item, index) => (
                <div key={index} className="relative group">
                  {item.type === 'image' ? (
                    <img 
                      src={item.url} 
                      alt={`Media ${index}`}
                      className="w-full h-40 object-cover rounded-md"
                    />
                  ) : (
                    <video 
                      src={item.url}
                      className="w-full h-40 object-cover rounded-md"
                      controls
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <FiImage size={16} />
              Featured Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="featuredImageUpload"
            />
            <div className="flex items-center gap-4">
              <label 
                htmlFor="featuredImageUpload"
                className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <FiUpload size={16} />
                Upload
              </label>
              {form.featuredImage && (
                <img 
                  src={form.featuredImage} 
                  alt="Featured" 
                  className="h-20 w-20 object-cover rounded-md"
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-md transition ${
              isSubmitting 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white font-medium`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              <>
                <FiSave size={18} />
                Update Post
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBlogPage;