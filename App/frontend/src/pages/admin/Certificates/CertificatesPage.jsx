import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiPlusCircle, FiSearch, FiExternalLink, FiCalendar, FiAward } from "react-icons/fi";
import { useTheme } from "../../../contexts/ThemeContext";
import AnimatedSection from "../../../components/ui/AnimatedSection";

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

const getStatusColor = (status, theme) => {
  const colors = {
    'Active': theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800',
    'Expired': theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800',
    'Pending': theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
    'Archived': theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
  };
  return colors[status] || colors['Active'];
};

const getLevelColor = (level, theme) => {
  const colors = {
    'Foundation': theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800',
    'Associate': theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800',
    'Professional': theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
    'Expert': theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800',
    'Specialty': theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'
  };
  return colors[level] || colors['Professional'];
};

const getPriorityColor = (priority, theme) => {
  const colors = {
    'Low': theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800',
    'Medium': theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
    'High': theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800',
    'Critical': theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'
  };
  return colors[priority] || colors['Medium'];
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const isExpiringSoon = (expiryDate) => {
  if (!expiryDate) return false;
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 30 && diffDays > 0;
};

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("issueDate");
  const navigate = useNavigate();
  const { theme } = useTheme();

  const fetchCertificates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/certificates", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCertificates(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this certificate?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/certificates/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCertificates((prev) => prev.filter((cert) => cert._id?.$oid !== id && cert._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete certificate");
    }
  };

  const filteredCertificates = certificates
    .filter(cert => {
      const matchesSearch = cert.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           cert.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cert.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filter === "all" || cert.category === filter;
      const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'issuer':
          return a.issuer.localeCompare(b.issuer);
        case 'issueDate':
          return new Date(b.issueDate || 0) - new Date(a.issueDate || 0);
        case 'expiryDate':
          return new Date(a.expiryDate || '9999-12-31') - new Date(b.expiryDate || '9999-12-31');
        case 'priority':
          const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          return (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
        default:
          return 0;
      }
    });

  const categories = [...new Set(certificates.map(cert => cert.category))];
  const statuses = [...new Set(certificates.map(cert => cert.status))];

  // Statistics
  const stats = {
    total: certificates.length,
    active: certificates.filter(c => c.status === 'Active').length,
    expired: certificates.filter(c => c.status === 'Expired').length,
    expiringSoon: certificates.filter(c => isExpiringSoon(c.expiryDate)).length
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-indigo-600 font-semibold">Loading certificates...</div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-600 dark:text-red-400 mt-10">{error}</div>
  );

  return (
    <div className={`max-w-7xl mx-auto p-6 rounded-lg pt-24 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <AnimatedSection>
          <h1 className={`text-3xl md:text-4xl font-extrabold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
            Certificates Dashboard
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage your professional certifications and credentials
          </p>
        </AnimatedSection>

        <button
          onClick={() => navigate("/admin/certificates/add")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
        >
          <FiPlusCircle size={20} />
          Add Certificate
        </button>
      </div>

      {/* Statistics Cards */}
      <AnimatedSection delay={100}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {stats.total}
            </div>
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Active Certificates
            </div>
          </div>
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className="text-2xl font-bold text-red-600">
              {stats.expired}
            </div>
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Expired
            </div>
          </div>
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.expiringSoon}
            </div>
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Expiring Soon
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Search and Filters */}
      <AnimatedSection delay={150}>
        <div className={`mb-8 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <FiSearch className={`absolute left-3 top-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>

            {/* Category Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="issueDate">Sort by Issue Date</option>
              <option value="name">Sort by Name</option>
              <option value="issuer">Sort by Issuer</option>
              <option value="expiryDate">Sort by Expiry Date</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>
        </div>
      </AnimatedSection>

      {/* Certificates Grid */}
      {filteredCertificates.length === 0 ? (
        <div className={`text-center p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'} shadow-md`}>
          <FiAward size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No certificates found</p>
          <p className="text-sm">{searchTerm ? 'Try a different search term.' : 'Add your first certificate!'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((certificate) => {
            const id = certificate._id?.$oid || certificate._id;
            const isExpiring = isExpiringSoon(certificate.expiryDate);
            
            return (
              <AnimatedSection key={id} delay={Math.min(200 * (certificates.indexOf(certificate) + 1), 1000)}>
                <div className={`rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} ${isExpiring ? 'ring-2 ring-yellow-400' : ''}`}>
                  
                  {/* Certificate Image/Icon */}
                  {certificate.imageUrl ? (
                    <div className="relative h-40 w-full">
                      <img
                        src={`http://localhost:5000${certificate.imageUrl}`}
                        alt={certificate.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=${certificate.name[0]}`;
                        }}
                      />
                      {isExpiring && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          Expiring Soon
                        </div>
                      )}
                      {certificate.priority === 'Critical' && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          Critical
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`h-40 w-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} relative`}>
                      {certificate.icon ? (
                        <i className={`${certificate.icon} text-5xl ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      ) : (
                        <i className={`${getCategoryIcon(certificate.category)} text-5xl ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      )}
                      {isExpiring && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          Expiring Soon
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4">
                    {/* Certificate Name & Issuer */}
                    <div className="mb-3">
                      <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} leading-tight`}>
                        {certificate.name}
                      </h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} font-medium`}>
                        {certificate.issuer}
                      </p>
                    </div>

                    {/* Status & Level & Priority */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(certificate.status, theme)}`}>
                        {certificate.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(certificate.level, theme)}`}>
                        {certificate.level}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(certificate.priority, theme)}`}>
                        {certificate.priority}
                      </span>
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-2 mb-3">
                      <i className={`${getCategoryIcon(certificate.category)} text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {certificate.category}
                      </span>
                    </div>

                    {/* Dates */}
                    <div className="mb-3 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <FiCalendar className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={14} />
                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          Issued: {formatDate(certificate.issueDate)}
                        </span>
                      </div>
                      {certificate.expiryDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <FiCalendar className={`${isExpiring ? 'text-yellow-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={14} />
                          <span className={`${isExpiring ? 'text-yellow-500 font-semibold' : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Expires: {formatDate(certificate.expiryDate)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    {certificate.skills && certificate.skills.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {certificate.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                            >
                              {skill}
                            </span>
                          ))}
                          {certificate.skills.length > 3 && (
                            <span className={`px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                              +{certificate.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {certificate.description && (
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-3 line-clamp-2`}>
                        {certificate.description}
                      </p>
                    )}

                    {/* Credential Info */}
                    {(certificate.credentialId || certificate.credentialUrl) && (
                      <div className="mb-3 space-y-1">
                        {certificate.credentialId && (
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            ID: {certificate.credentialId}
                          </p>
                        )}
                        {certificate.credentialUrl && (
                          <a
                            href={certificate.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-1 text-xs ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
                          >
                            <FiExternalLink size={12} />
                            View Credential
                          </a>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                      <button
                        onClick={() => navigate(`/admin/certificates/edit/${id}`)}
                        className={`flex items-center gap-1 text-sm ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} transition-colors`}
                        title="Edit Certificate"
                      >
                        <FiEdit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
                        className={`flex items-center gap-1 text-sm ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'} transition-colors`}
                        title="Delete Certificate"
                      >
                        <FiTrash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;