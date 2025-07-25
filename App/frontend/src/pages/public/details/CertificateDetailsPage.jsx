import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FiCalendar, 
  FiExternalLink,
  FiChevronLeft,
  FiStar,
  FiAward
} from 'react-icons/fi';
import { FaCertificate } from 'react-icons/fa';
import { useTheme } from '../../../contexts/ThemeContext';
import AnimatedSection from '../../../components/ui/AnimatedSection';
import AiBotLoader from '../../../components/ui/loading/AiBotLoader';
import useScrollToTop from '../../../hooks/useScrollToTop';

const CertificateDetailsPage = () => {
  useScrollToTop();
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/public/certificates/${id}`);
        
        // Handle different response formats
        const certData = typeof response.data === 'string' 
          ? JSON.parse(response.data) 
          : response.data;
        
        setCertificate(certData);
      } catch (err) {
        console.error('Error fetching certificate:', err);
        setError(err.response?.data?.message || 'Failed to load certificate details');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getImageUrl = () => {
    if (!certificate?.imageUrl && !certificate?.image_url) return null;
    
    const imgUrl = certificate.imageUrl || certificate.image_url;
    if (imgUrl.startsWith('http')) {
      return imgUrl;
    }
    
    return `http://localhost:5000${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
  };

  const imageUrl = getImageUrl();

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <AiBotLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-8 rounded-xl text-center max-w-md ${theme === 'dark' ? 'bg-gray-800 text-red-400' : 'bg-white text-red-600'}`}>
          <h2 className="text-xl font-bold mb-4">Error Loading Certificate</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className={`px-6 py-2 rounded-lg font-medium ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-8 rounded-xl text-center max-w-md ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'}`}>
          <h2 className="text-xl font-bold mb-4">Certificate Not Found</h2>
          <p className="mb-6">The requested certificate could not be found.</p>
          <button
            onClick={() => navigate(-1)}
            className={`px-6 py-2 rounded-lg font-medium ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <AnimatedSection>
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-8 px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <FiChevronLeft size={20} />
            Back to Portfolio
          </button>
        </AnimatedSection>

        {/* Header */}
        <AnimatedSection delay={100}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={certificate.name}
                className="w-24 h-24 object-contain rounded-lg border-2 border-gray-200 dark:border-gray-600"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/150/6366f1/ffffff?text=${(certificate.name?.[0] || 'C')}`;
                }}
              />
            ) : (
              <div className={`w-24 h-24 flex items-center justify-center rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30 text-indigo-400' 
                  : 'bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-600'
              }`}>
                <FaCertificate size={40} />
              </div>
            )}
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {certificate.name}
              </h1>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                {certificate.issuer}
              </h2>
              {certificate.priority === 'High' && (
                <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold">
                  <FiStar size={12} />
                  Featured
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Details */}
            <AnimatedSection delay={150}>
              <div className={`p-6 rounded-xl mb-8 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-sm'}`}>
                <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Certificate Details
                </h2>
                
                <div className="space-y-4">
                  {/* Category */}
                  {certificate.category && (
                    <div>
                      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Category
                      </h3>
                      <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {certificate.category}
                      </p>
                    </div>
                  )}

                  {/* Issue Date */}
                  <div>
                    <h3 className={`text-sm font-semibold uppercase tracking-wider mb-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Issue Date
                    </h3>
                    <div className="flex items-center gap-2">
                      <FiCalendar className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {formatDate(certificate.issueDate)}
                      </p>
                    </div>
                  </div>

                  {/* Expiry Date */}
                  {certificate.expiryDate && (
                    <div>
                      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Expiry Date
                      </h3>
                      <div className="flex items-center gap-2">
                        <FiCalendar className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {formatDate(certificate.expiryDate)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Credential ID */}
                  {certificate.credentialId && (
                    <div>
                      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Credential ID
                      </h3>
                      <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {certificate.credentialId}
                      </p>
                    </div>
                  )}

                  {/* Credential URL */}
                  {certificate.credentialUrl && (
                    <div>
                      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Credential URL
                      </h3>
                      <div className="flex items-center gap-2">
                        <FiExternalLink className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                        <a 
                          href={certificate.credentialUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`hover:underline ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                        >
                          {certificate.credentialUrl.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Level */}
                  {certificate.level && (
                    <div>
                      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Level
                      </h3>
                      <div className="flex items-center gap-2">
                        <FiAward className={`${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {certificate.level}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  {certificate.status && (
                    <div>
                      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Status
                      </h3>
                      <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {certificate.status}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>

            {/* Description */}
            {certificate.description && (
              <AnimatedSection delay={200}>
                <div className={`p-6 rounded-xl mb-8 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-sm'}`}>
                  <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    About This Certificate
                  </h2>
                  <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
                    <p className={`whitespace-pre-line ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {certificate.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Skills */}
            {certificate.skills && certificate.skills.length > 0 && (
              <AnimatedSection delay={250}>
                <div className={`p-6 rounded-xl mb-8 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-sm'}`}>
                  <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Skills Covered
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {certificate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1.5 text-sm rounded-full font-medium ${
                          theme === 'dark'
                            ? 'bg-indigo-900/30 text-indigo-300 border border-indigo-800/50'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Expiry Warning */}
            {certificate.isExpiringSoon && (
              <AnimatedSection delay={300}>
                <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-orange-900/20 border border-orange-800/50' : 'bg-orange-50 border border-orange-200'}`}>
                  <h2 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-orange-300' : 'text-orange-600'}`}>
                    Expiry Warning
                  </h2>
                  <p className={`${theme === 'dark' ? 'text-orange-200' : 'text-orange-700'}`}>
                    This certificate will expire in {certificate.daysUntilExpiry} days.
                  </p>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetailsPage;