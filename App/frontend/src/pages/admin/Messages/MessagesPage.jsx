import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiMail, 
  FiTrash2, 
  FiUser, 
  FiClock, 
  FiGlobe,
  FiSearch,
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';

import { FiMailOpen } from 'react-icons/fi';



const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // all, read, unread
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });

  useEffect(() => {
    fetchMessages();
  }, [page, filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/messages?page=${page}&per_page=10`);
      
      let messagesData = [];
      if (response.data.data) {
        messagesData = typeof response.data.data === 'string' 
          ? JSON.parse(response.data.data) 
          : response.data.data;
      }

      // Apply filter
      if (filter !== 'all') {
        messagesData = messagesData.filter(msg => 
          filter === 'read' ? msg.read : !msg.read
        );
      }

      // Apply search
      if (searchTerm) {
        messagesData = messagesData.filter(msg =>
          msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.message.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setMessages(messagesData);
      setTotalPages(Math.ceil((response.data.total || messagesData.length) / 10));
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await api.put(`/messages/${messageId}/read`);
      setMessages(messages.map(msg => 
        msg._id === messageId ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await api.delete(`/messages/${messageId}`);
        setMessages(messages.filter(msg => msg._id !== messageId));
        setSelectedMessage(null);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const MessageCard = ({ message, onClick, isSelected }) => (
    <div 
      onClick={onClick}
      className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected 
          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
          : message.read 
            ? 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700' 
            : 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {message.read ? (
            <FiMail  className="w-4 h-4 text-gray-500" />
          ) : (
            <FiMail className="w-4 h-4 text-blue-500" />
          )}
          <span className="font-semibold text-gray-900 dark:text-white">
            {message.name}
          </span>
          {!message.read && (
            <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
              New
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FiGlobe className="w-3 h-3" />
          <span>{message.platform || 'website'}</span>
        </div>
      </div>
      
      <div className="mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {message.email}
        </span>
      </div>
      
      <div className="mb-3">
        <span className="font-medium text-gray-900 dark:text-white">
          {message.subject || 'General Inquiry'}
        </span>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-3">
        {message.message}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <FiClock className="w-3 h-3" />
          <span>{formatDate(message.created_at)}</span>
        </div>
      </div>
    </div>
  );

  const MessageDetail = ({ message }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Message Details
        </h2>
        <div className="flex items-center space-x-2">
          {!message.read && (
            <button
              onClick={() => markAsRead(message._id)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2"
            >
              <FiMail  className="w-4 h-4" />
              <span>Mark as Read</span>
            </button>
          )}
          <button
            onClick={() => deleteMessage(message._id)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center space-x-2"
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <FiUser className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900 dark:text-white">{message.name}</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <FiMail className="w-4 h-4 text-gray-500" />
                <a 
                  href={`mailto:${message.email}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {message.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-900 dark:text-white">
                {message.subject || 'General Inquiry'}
              </span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Platform
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <FiGlobe className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900 dark:text-white">
                  {message.platform || 'website'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message
          </label>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
              {message.message}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Received
          </label>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <FiClock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-900 dark:text-white">
                {formatDate(message.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Messages
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your contact form messages
              </p>
            </div>
            
            <button
              onClick={fetchMessages}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 flex items-center space-x-2"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-400 w-5 h-5" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {messages.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Messages</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600">
                {messages.filter(m => !m.read).length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Unread Messages</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">
                {messages.filter(m => m.read).length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Read Messages</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <FiMail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No messages found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filter === 'all' ? 'You haven\'t received any messages yet.' : `No ${filter} messages found.`}
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <MessageCard
                  key={message._id}
                  message={message}
                  onClick={() => setSelectedMessage(message)}
                  isSelected={selectedMessage?._id === message._id}
                />
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:sticky lg:top-6 lg:h-fit">
            {selectedMessage ? (
              <MessageDetail message={selectedMessage} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <FiMail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select a message
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a message from the list to view its details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;