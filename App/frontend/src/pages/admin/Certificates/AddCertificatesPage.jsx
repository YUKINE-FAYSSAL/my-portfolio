import React, { useState } from 'react';
import { createItem } from '../../../api/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext';

const AddCertificatePage = () => {
  const [form, setForm] = useState({ 
    name: '',
    issuer: '',
    date: '',
    credentialId: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await createItem('certificates', form);
    showToast('success', 'Certificate added successfully');
    navigate('/admin/certificates');
  } catch (err) {
    showToast('error', err.response?.data?.message || 'Failed to add certificate');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add New Certificate</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Certificate Name*
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Issuer*
          </label>
          <input
            type="text"
            name="issuer"
            value={form.issuer}
            onChange={(e) => setForm({...form, issuer: e.target.value})}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date*
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={(e) => setForm({...form, date: e.target.value})}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Credential ID
          </label>
          <input
            type="text"
            name="credentialId"
            value={form.credentialId}
            onChange={(e) => setForm({...form, credentialId: e.target.value})}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white ${
            loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
          } transition`}
        >
          {loading ? 'Adding...' : 'Add Certificate'}
        </button>
      </form>
    </div>
  );
};

export default AddCertificatePage;