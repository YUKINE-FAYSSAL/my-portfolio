import React, { useState, useEffect } from 'react';
import { fetchItems, deleteItem } from '../../../api/api';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext';

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
const loadCertificates = async () => {
  try {
    const { data } = await fetchItems('certificates');
    setCertificates(data);
  } catch (err) {
    showToast('error', 'Failed to load certificates');
  } finally {
    setLoading(false);
  }
};
    loadCertificates();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await deleteItem('certificates', id);
        setCertificates(certificates.filter(cert => cert._id !== id));
        showToast('success', 'Certificate deleted successfully');
      } catch (err) {
        showToast('error', 'Failed to delete certificate');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading certificates...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Certificates</h1>
        <Link
          to="/admin/certificates/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Add New Certificate
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((certificate) => (
          <div key={certificate._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{certificate.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Issuer: {certificate.issuer}</p>
            <p className="text-gray-600 dark:text-gray-300">Date: {certificate.date}</p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => navigate(`/admin/certificates/edit/${certificate._id}`)}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(certificate._id)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificatesPage;