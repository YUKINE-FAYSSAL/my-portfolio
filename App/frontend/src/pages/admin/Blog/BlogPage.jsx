import React, { useState, useEffect } from 'react';
import { fetchItems, deleteItem } from '../../../api/api';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext';
import { FiEdit2, FiTrash2, FiPlus, FiClock, FiCalendar } from 'react-icons/fi';
import { useTheme } from '../../../contexts/ThemeContext';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { theme } = useTheme();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const { data } = await fetchItems('blog');
        setPosts(data);
      } catch (err) {
        showToast('error', 'Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

const handleDeleteConfirm = async () => {
  try {
    const response = await deleteItem('blog', postToDelete._id);
    if (response.ok) {
      setPosts(posts.filter(post => post._id !== postToDelete._id));
      showToast('success', 'Post deleted successfully');
    } else {
      throw new Error('Failed to delete post');
    }
  } catch (err) {
    showToast('error', err.message);
  } finally {
    setShowDeleteModal(false);
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
    <div className="container mx-auto px-4 py-8">
      {/* Header with Add New button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Blog Posts</h1>
        <Link
          to="/admin/blog/add"
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
            theme === 'dark' 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <FiPlus size={18} />
          Add New Post
        </Link>
      </div>

      {/* Blog Posts List */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className={`text-center py-10 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-600'
          }`}>
            No blog posts found. Create your first post!
          </div>
        ) : (
          posts.map((post) => (
            <div 
              key={post._id} 
              className={`p-6 rounded-lg shadow-md transition ${
                theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{post.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <FiCalendar size={14} />
                      <span>{new Date(post.date || post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock size={14} />
                      <span>{post.readTime || '5 min read'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/blog/edit/${post._id}`)}
                    className={`p-2 rounded-md transition ${
                      theme === 'dark' 
                        ? 'text-indigo-400 hover:bg-gray-700' 
                        : 'text-indigo-600 hover:bg-gray-100'
                    }`}
                    aria-label="Edit post"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(post)}
                    className={`p-2 rounded-md transition ${
                      theme === 'dark' 
                        ? 'text-red-400 hover:bg-gray-700' 
                        : 'text-red-600 hover:bg-gray-100'
                    }`}
                    aria-label="Delete post"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
              <p className={`mt-3 line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {post.excerpt || post.content.substring(0, 150) + '...'}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`p-6 rounded-lg shadow-xl max-w-md w-full ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Confirm Deletion
            </h3>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to delete the post "{postToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`px-4 py-2 rounded-md ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;