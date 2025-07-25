import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FiEdit, FiCalendar, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CertificateCard = ({ certificate, isAdmin = false }) => {
  const { theme } = useTheme();

  const getImageUrl = () => {
    const img = certificate.imageUrl || certificate.image_url || certificate.image || '';
    if (!img) return null;
    if (img.startsWith('http')) return img;
    if (img.startsWith('/uploads/')) return `http://localhost:5000${img}`;
    if (img.includes('uploads/')) return `http://localhost:5000/${img}`;
    return `http://localhost:5000/uploads/${img.startsWith('/') ? img.slice(1) : img}`;
  };

  const imageUrl = getImageUrl();

  const formatDate = (dateInput) => {
    if (!dateInput) return 'Present';
    try {
      let date;
      if (typeof dateInput === 'object' && dateInput.$date) {
        date = new Date(dateInput.$date);
      } else if (typeof dateInput === 'string') {
        date = new Date(dateInput);
      } else if (dateInput instanceof Date) {
        date = dateInput;
      } else {
        return 'Invalid Date';
      }
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return 'Invalid Date';
    }
  };

  const isExpiringSoon = (expiryDateInput) => {
    if (!expiryDateInput) return false;
    try {
      let expiryDate;
      if (typeof expiryDateInput === 'object' && expiryDateInput.$date) {
        expiryDate = new Date(expiryDateInput.$date);
      } else if (typeof expiryDateInput === 'string') {
        expiryDate = new Date(expiryDateInput);
      } else if (expiryDateInput instanceof Date) {
        expiryDate = expiryDateInput;
      } else {
        return false;
      }
      if (isNaN(expiryDate.getTime())) return false;
      const today = new Date();
      const diffTime = expiryDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    } catch {
      return false;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800',
      'Expired': theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800',
      'Pending': theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
      'Archived': theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
    };
    return colors[status] || colors['Active'];
  };

  const getLevelColor = (level) => {
    const colors = {
      'Foundation': theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800',
      'Associate': theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800',
      'Professional': theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
      'Expert': theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800',
      'Specialty': theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'
    };
    return colors[level] || colors['Professional'];
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Cloud Computing': return 'fas fa-cloud';
      case 'Software Development': return 'fas fa-laptop-code';
      case 'DevOps': return 'fas fa-server';
      case 'Cybersecurity': return 'fas fa-shield-alt';
      case 'Data & Analytics': return 'fas fa-chart-bar';
      case 'Project Management': return 'fas fa-tasks';
      case 'AI/ML': return 'fas fa-robot';
      case 'Mobile Development': return 'fas fa-mobile-alt';
      case 'Database': return 'fas fa-database';
      case 'Networking': return 'fas fa-network-wired';
      default: return 'fas fa-certificate';
    }
  };

  return (
    <Link
      to={`/certificates/${certificate._id?.$oid || certificate._id}`}
      className="block"
    >
      <div className={`relative w-full max-w-sm mx-auto h-full flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] group ${theme === 'dark' ? 'bg-gray-800/70 border-gray-700 text-gray-200' : 'bg-white/90 border-gray-200 text-gray-800'}`}>
        {/* Status Badges */}
        {(certificate.status === 'Expired' || isExpiringSoon(certificate.expiryDate)) && (
          <div className="absolute top-3 right-3 z-10 animate-pulse">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${certificate.status === 'Expired' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'}`}>
              {certificate.status === 'Expired' ? 'Expired' : 'Expiring Soon'}
            </span>
          </div>
        )}

        {/* Image Section */}
        <div className="relative h-48 w-full overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={certificate.name || 'Certificate'}
              className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://via.placeholder.com/400x200/${theme === 'dark' ? '4b5563' : 'e5e7eb'}/6366f1?text=${encodeURIComponent((certificate.name || 'C')[0].toUpperCase())}`;
              }}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50' : 'bg-gradient-to-br from-indigo-100/70 to-purple-100/70'} transition-all duration-300 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50`}>
              <i className={`${certificate.icon || 'fas fa-certificate'} text-4xl ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} transition-transform duration-300 group-hover:scale-110`} />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 flex flex-col space-y-3 max-h-[19rem]">
          <h3 className={`text-lg font-semibold line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} group-hover:text-indigo-500 transition-colors duration-300`}>
            {certificate.name || 'Professional Certificate'}
          </h3>
          <p className={`text-base font-medium ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'} group-hover:text-indigo-400 transition-colors duration-300`}>
            {certificate.issuer || 'Issuing Organization'}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${getStatusColor(certificate.status)}`}>
              {certificate.status || 'Active'}
            </span>
            <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${getLevelColor(certificate.level)}`}>
              {certificate.level || 'Professional'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 group-hover:text-indigo-400 transition-colors duration-300">
            <i className={`${getCategoryIcon(certificate.category)} text-sm ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <span>{certificate.category || 'Professional Certification'}</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 group-hover:text-indigo-400 transition-colors duration-300">
              <FiCalendar className="w-3 h-3" />
              <span>Issued: {formatDate(certificate.issueDate) || 'N/A'}</span>
            </div>
            {certificate.expiryDate && (
              <div className="flex items-center gap-2 text-xs text-gray-500 group-hover:text-indigo-400 transition-colors duration-300">
                <FiCalendar className={`w-3 h-3 ${isExpiringSoon(certificate.expiryDate) ? 'text-yellow-500' : ''}`} />
                <span className={isExpiringSoon(certificate.expiryDate) ? 'text-yellow-500 font-semibold' : ''}>
                  Expires: {formatDate(certificate.expiryDate)}
                </span>
              </div>
            )}
          </div>
          {certificate.skills && certificate.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {certificate.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className={`px-2 py-0.5 text-xs rounded-full ${theme === 'dark' ? 'bg-gray-700/50 text-gray-300 border border-gray-600' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}
                >
                  {skill}
                </span>
              ))}
              {certificate.skills.length > 3 && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                  +{certificate.skills.length - 3}
                </span>
              )}
            </div>
          )}
          {isAdmin && (
            <div className="mt-auto pt-3 border-t border-gray-600 flex justify-between">
              <Link
                to={`/admin/certificates/edit/${certificate._id?.$oid || certificate._id}`}
                className={`flex items-center gap-1 text-sm ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
              >
                <FiEdit size={14} />
                Edit
              </Link>
              <button
                className={`flex items-center gap-1 text-sm ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
              >
                <FiTrash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CertificateCard;