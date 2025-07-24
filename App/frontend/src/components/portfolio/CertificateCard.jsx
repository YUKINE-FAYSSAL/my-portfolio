import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FiExternalLink, FiCalendar, FiAward, FiEdit, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CertificateCard = ({ certificate, isAdmin = false }) => {
  const { theme } = useTheme();

  const getImageUrl = () => {
    // Check multiple possible field names for backward compatibility
    const img = certificate.imageUrl || certificate.image_url || certificate.image || '';
    
    if (!img) return null;
    
    // If it's already a full URL, return as is
    if (img.startsWith('http')) return img;
    
    // Handle different path formats
    if (img.startsWith('/uploads/')) {
      return `http://localhost:5000${img}`;
    }
    
    // Handle paths that might have already included uploads/
    if (img.includes('uploads/')) {
      return `http://localhost:5000/${img}`;
    }
    
    // Default case - assume it's just a filename
    return `http://localhost:5000/uploads/${img.startsWith('/') ? img.slice(1) : img}`;
  };

  console.log("🔥 CERTIFICATE DATA:", certificate);
  
  const imageUrl = getImageUrl();
  console.log("✅ Final Image URL:", imageUrl);

  const formatDate = (dateInput) => {
    if (!dateInput) return 'Present';
    
    try {
      let date;
      
      // Handle MongoDB date objects with $date property
      if (typeof dateInput === 'object' && dateInput.$date) {
        date = new Date(dateInput.$date);
      } else if (typeof dateInput === 'string') {
        date = new Date(dateInput);
      } else if (dateInput instanceof Date) {
        date = dateInput;
      } else {
        return 'Invalid Date';
      }
      
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error, dateInput);
      return 'Invalid Date';
    }
  };

  const isExpiringSoon = (expiryDateInput) => {
    if (!expiryDateInput) return false;
    
    try {
      let expiryDate;
      
      // Handle MongoDB date objects with $date property
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
    } catch (error) {
      console.error('Date comparison error:', error, expiryDateInput);
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
    <div className={`relative h-full flex flex-col rounded-xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 group animate-bounce-in ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/70 hover:border-indigo-500/50 hover:shadow-indigo-500/30' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-indigo-300 hover:shadow-indigo-100/50'}`}>
      
      {/* Status badges */}
      {certificate.status === 'Expired' && (
        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          Expired
        </div>
      )}
      
      {isExpiringSoon(certificate.expiryDate) && (
        <div className="absolute top-2 right-2 z-10 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          Expiring Soon
        </div>
      )}

      {/* Image Section - Fixed with better error handling */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={certificate.name || 'Certificate'}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            style={{ 
              backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
            }}
            onLoad={() => console.log("✅ Image loaded successfully:", imageUrl)}
            onError={(e) => {
              console.error("❌ Image failed to load:", imageUrl);
              e.target.onerror = null; // Prevent infinite loop
              // Create a fallback placeholder
              const placeholderColor = theme === 'dark' ? '4b5563' : 'e5e7eb';
              const textColor = theme === 'dark' ? 'ffffff' : '6366f1';
              const firstLetter = (certificate.name || 'C')[0].toUpperCase();
              e.target.src = `https://via.placeholder.com/400x200/${placeholderColor}/${textColor}?text=${encodeURIComponent(firstLetter)}`;
              e.target.className = "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110";
            }}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30' : 'bg-gradient-to-br from-indigo-100 to-purple-100'} transition-all duration-300 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50`}>
            {certificate.icon ? (
              <i className={`${certificate.icon} text-5xl ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} transition-transform duration-300 group-hover:scale-125`} />
            ) : (
              <i className={`fas fa-certificate text-5xl ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} transition-transform duration-300 group-hover:scale-125`} />
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Title */}
        <h3 className={`text-xl font-bold mb-2 line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} transition-colors duration-300 group-hover:text-indigo-500`}>
          {certificate.name || 'Professional Certificate'}
        </h3>

        {/* Issuer */}
        <p className={`text-lg mb-3 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} transition-colors duration-300 group-hover:text-indigo-400`}>
          {certificate.issuer || 'Issuing Organization'}
        </p>

        {/* Status, Level, Priority */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(certificate.status)}`}>
            {certificate.status || 'Active'}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(certificate.level)}`}>
            {certificate.level || 'Professional'}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
            {certificate.priority || 'Medium'}
          </span>
        </div>

        {/* Category */}
        <div className="flex items-center gap-2 mb-3">
          <i className={`${getCategoryIcon(certificate.category)} text-sm ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} transition-transform duration-300 group-hover:scale-125`} />
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300 group-hover:text-indigo-400`}>
            {certificate.category || 'Professional Certification'}
          </span>
        </div>

        {/* Dates */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <FiCalendar className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} transition-transform duration-300 group-hover:scale-125`} />
            <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300 group-hover:text-indigo-400`}>
              Issued: {formatDate(certificate.issueDate) || 'N/A'}
            </span>
          </div>
          {certificate.expiryDate && (
            <div className="flex items-center gap-2 text-sm">
              <FiCalendar className={`${isExpiringSoon(certificate.expiryDate) ? 'text-yellow-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} transition-transform duration-300 group-hover:scale-125`} />
              <span className={`${isExpiringSoon(certificate.expiryDate) ? 'text-yellow-500 font-semibold' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300 group-hover:text-indigo-400`}>
                Expires: {formatDate(certificate.expiryDate)}
              </span>
            </div>
          )}
        </div>

        {/* Credential Info */}
        {(certificate.credentialId || certificate.credentialUrl) && (
          <div className="mb-4 space-y-1">
            {certificate.credentialId && (
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300 group-hover:text-indigo-400`}>
                ID: <span className="font-mono">{certificate.credentialId}</span>
              </p>
            )}
            {certificate.credentialUrl && (
              <a
                href={certificate.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center text-sm font-medium ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'} transition-colors duration-200 animate-glow`}
              >
                <FiExternalLink className="w-3 h-3 mr-1" />
                Verify Credential
              </a>
            )}
          </div>
        )}

        {/* Skills */}
        {certificate.skills && certificate.skills.length > 0 && (
          <div className="mb-4">
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300 group-hover:text-indigo-400`}>
              Skills Covered
            </h4>
            <div className="flex flex-wrap gap-2">
              {certificate.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs rounded-full transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-700/50 text-gray-300 border border-gray-600 hover:bg-indigo-600/50 hover:border-indigo-500' : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-indigo-100 hover:border-indigo-300'} animate-glow`}
                >
                  {skill}
                </span>
              ))}
              {certificate.skills.length > 3 && (
                <span className={`px-2 py-1 text-xs rounded-full ${theme === 'dark' ? 'bg-gray-700/50 text-gray-500 border border-gray-600' : 'bg-gray-100 text-gray-500 border border-gray-200'} animate-glow`}>
                  +{certificate.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Admin Actions */}
        {isAdmin && (
          <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-600 flex justify-between">
            <Link
              to={`/admin/certificates/edit/${certificate._id?.$oid || certificate._id}`}
              className={`flex items-center gap-1 text-sm ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} transition-colors`}
            >
              <FiEdit size={14} />
              Edit
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle delete here
              }}
              className={`flex items-center gap-1 text-sm ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'} transition-colors`}
            >
              <FiTrash2 size={14} />
              Delete
            </button>
          </div>
        )}

        {/* View Details Button */}
        {!isAdmin && (
          <div className="mt-auto">
            <Link 
              to={`/certificates/${certificate._id?.$oid || certificate._id}`}
              className={`inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${theme === 'dark' ? 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25'} animate-glow`}
            >
              View Details
              <svg
                className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateCard;