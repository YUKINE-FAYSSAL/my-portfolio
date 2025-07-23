import React, { useState, useEffect } from 'react';
import { fetchItems } from '../../api/api';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const RecentBlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const { data } = await fetchItems('blog');
        const lastTen = data.slice(-10);
        const shuffled = [...lastTen].sort(() => 0.5 - Math.random());
        setPosts(shuffled.slice(0, 3));
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <Skeleton height={20} width="70%" />
            <Skeleton count={2} className="mt-2" />
            <Skeleton width="50%" className="mt-2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className={`p-4 text-center rounded-lg ${
          theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
        }`}>
          No blog posts available
        </div>
      ) : (
        posts.map(post => (
          <Link 
            key={post._id} 
            to={`/admin/blog/edit/${post._id}`}
            className={`block p-4 rounded-lg transition-all ${
              theme === 'dark'
                ? 'hover:bg-gray-700/80 bg-gray-800' 
                : 'hover:bg-gray-100 bg-white'
            } shadow-sm`}
          >
            <h3 className={`font-medium ${
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
            }`}>
              {post.title}
            </h3>
            <p className={`text-sm mt-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {post.excerpt || post.content.substring(0, 100)}...
            </p>
            <div className={`flex justify-between items-center text-xs mt-3 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              <span>{new Date(post.date || post.createdAt).toLocaleDateString()}</span>
              <span>{post.readTime || '5 min read'}</span>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default RecentBlogPosts;