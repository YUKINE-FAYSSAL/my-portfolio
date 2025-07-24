import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { FiClock, FiCalendar, FiHeart, FiShare2, FiBookmark } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollToTop from '../../hooks/useScrollToTop';
import { getBlogPosts, getBlogCategories, likeBlogPost } from '../../api/blogApi';

const BlogPage = () => {
  useScrollToTop();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const [postsData, categoriesData] = await Promise.all([
          getBlogPosts(),
          getBlogCategories()
        ]);

        setPosts(postsData);
        setCategories(['all', ...categoriesData]);
        
        if (postsData.length > 0) {
          setFeaturedPost(postsData[0]);
        }
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || 
      (post.categories && post.categories.includes(activeCategory));
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleBookmark = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post
    ));
  };

  const handleLike = async (postId) => {
    try {
      await likeBlogPost(postId);
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
      ));
      if (featuredPost?._id === postId) {
        setFeaturedPost({ 
          ...featuredPost, 
          likes: (featuredPost.likes || 0) + 1 
        });
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
          />
          <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-['Space_Grotesk'] ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Gradient Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      {/* Header Section */}
      <header className={`relative py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
              The Blog
            </h1>
            <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Thoughts, stories and ideas from our team
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                }`}
              />
              <svg
                className={`absolute right-3 top-3.5 h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? theme === 'dark'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-indigo-600 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              Featured Article
            </h2>
            <div className={`rounded-xl overflow-hidden shadow-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 h-64 lg:h-auto">
                  <img
                    src={featuredPost.featuredImage || 'https://source.unsplash.com/random/800x600/?technology'}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="lg:w-1/2 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      theme === 'dark' ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {featuredPost.categories?.[0] || 'General'}
                    </span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(featuredPost.date)}
                    </span>
                  </div>
                  <Link to={`/blog/${featuredPost.slug}`}>
                    <h3 className={`text-2xl font-bold mb-3 hover:text-indigo-500 transition-colors ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {featuredPost.title}
                    </h3>
                  </Link>
                  <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {featuredPost.excerpt || featuredPost.content.substring(0, 200) + '...'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm">
                        <FiClock className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          {featuredPost.readTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <FiHeart className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          {featuredPost.likes} likes
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleBookmark(featuredPost.id)}
                      className={`p-2 rounded-full ${
                        featuredPost.isBookmarked
                          ? 'text-indigo-500'
                          : theme === 'dark'
                            ? 'text-gray-400 hover:text-indigo-400'
                            : 'text-gray-500 hover:text-indigo-500'
                      }`}
                    >
                      <FiBookmark className={featuredPost.isBookmarked ? 'fill-current' : ''} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* All Posts */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            Latest Articles
          </h2>
          
          {filteredPosts.length === 0 ? (
            <div className={`text-center py-16 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
            }`}>
              <p className="text-lg">No articles found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    exit={{ opacity: 0 }}
                    layout
                  >
                    <article className={`h-full rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02] ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}>
                      <Link to={`/blog/${post.slug}`} className="block">
                        <div className="h-48">
                          <img
                            src={post.featuredImage || 'https://source.unsplash.com/random/600x400/?tech'}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              theme === 'dark' ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800'
                            }`}>
                              {post.categories?.[0] || 'General'}
                            </span>
                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {formatDate(post.date)}
                            </span>
                          </div>
                          <h3 className={`text-xl font-bold mb-2 hover:text-indigo-500 transition-colors ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {post.title}
                          </h3>
                          <p className={`mb-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {post.excerpt || post.content.substring(0, 120) + '...'}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm">
                              <FiClock className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                                {post.readTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`);
                                  // Add toast notification here
                                }}
                                className={`p-1.5 rounded-full ${
                                  theme === 'dark' 
                                    ? 'text-gray-400 hover:text-indigo-400 hover:bg-gray-700' 
                                    : 'text-gray-500 hover:text-indigo-500 hover:bg-gray-100'
                                }`}
                              >
                                <FiShare2 size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  toggleBookmark(post.id);
                                }}
                                className={`p-1.5 rounded-full ${
                                  post.isBookmarked
                                    ? 'text-indigo-500'
                                    : theme === 'dark'
                                      ? 'text-gray-400 hover:text-indigo-400 hover:bg-gray-700'
                                      : 'text-gray-500 hover:text-indigo-500 hover:bg-gray-100'
                                }`}
                              >
                                <FiBookmark size={16} className={post.isBookmarked ? 'fill-current' : ''} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Newsletter CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`rounded-xl p-8 md:p-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-indigo-50'}`}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Stay updated with our latest articles
            </h2>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Subscribe to our newsletter and never miss our latest articles, tips, and news.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className={`flex-grow px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                }`}
              />
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default BlogPage;