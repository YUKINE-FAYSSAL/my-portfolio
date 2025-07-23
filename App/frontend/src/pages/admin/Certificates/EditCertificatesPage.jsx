import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchItem, updateItem } from '../../../api/api';
import { useToast } from '../../../contexts/ToastContext';

const EditCertificatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '',
    issuer: '',
    date: '',
    credentialId: ''
  });
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const loadCertificate = async () => {
      try {
        const { data } = await fetchItem('certificates', id);
        setForm(data);
      } catch (err) {
        showToast('error', 'Failed to load certificate');
      } finally {
        setLoading(false);
      }
    };
    loadCertificate();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.issuer || !form.date) {
      showToast('error', 'Required fields are missing');
      return;
    }

    try {
      await updateItem('certificates', id, form);
      showToast('success', 'Certificate updated successfully');
      navigate('/admin/certificates');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to update certificate');
    }
  };

  if (loading) return <div className="text-center py-10">Loading certificate...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Certificate</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields same as AddCertificatePage */}
        
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
        >
          Update Certificate
        </button>
      </form>
    </div>
  );
};

export default EditCertificatePage;