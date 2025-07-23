import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import AnimatedSection from '../../../components/ui/AnimatedSection';

const EditSkillPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [form, setForm] = useState({ 
    name: '', 
    level: 'Beginner',
    category: 'Technical',
    years: 0,
    description: '',
    icon: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
const fetchSkill = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/skills/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    setForm(res.data);
    if (res.data.imageUrl) {
      setImagePreview(`http://localhost:5000${res.data.imageUrl}`);
    }
  } catch (err) {
    alert('Failed to load skill');
    navigate('/admin/skills');
  } finally {
    setLoading(false);
  }
};

    fetchSkill();
  }, [id, navigate]);

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  // Check if file is an image
  if (!file.type.match('image.*')) {
    alert('Please select an image file');
    return;
  }

  setImageFile(file);

  const reader = new FileReader();
  reader.onloadend = () => {
    setImagePreview(reader.result);
  };
  reader.readAsDataURL(file);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("level", form.level);
      data.append("category", form.category);
      data.append("years", form.years);
      data.append("description", form.description);
      data.append("icon", form.icon);
      if (imageFile) {
        data.append("image", imageFile);
      }

      await axios.put(`http://localhost:5000/api/skills/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/admin/skills');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update skill');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className={`flex justify-center items-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} font-semibold`}>
        Loading skill...
      </div>
    </div>
  );

  return (
    <div className={`max-w-2xl mx-auto p-6 rounded-lg shadow-lg mt-10 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <AnimatedSection>
        <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
          Edit Skill
        </h1>
      </AnimatedSection>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatedSection delay={100}>
          <div>
            <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Skill name"
            />
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedSection delay={150}>
            <div>
              <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Level
              </label>
              <select
                className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div>
              <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Category
              </label>
<select
  className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
  value={form.category}
  onChange={(e) => setForm({ ...form, category: e.target.value })}
>
  <option value="Software Engineering">Software Engineering</option>
  <option value="Cloud Computing">Cloud Computing</option>
  <option value="Data Engineering">Data Engineering</option>
  <option value="DevOps">DevOps</option>
  <option value="Frontend Development">Frontend Development</option>
  <option value="Backend Development">Backend Development</option>
  <option value="Full Stack Development">Full Stack Development</option>
  <option value="Mobile Development">Mobile Development</option>
  <option value="AI/ML Engineering">AI/ML Engineering</option>
  <option value="Cybersecurity">Cybersecurity</option>
  <option value="Embedded Systems">Embedded Systems</option>
  <option value="Other Engineering">Other Engineering</option>
</select>
            </div>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedSection delay={250}>
            <div>
              <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                value={form.years}
                onChange={(e) => setForm({ ...form, years: e.target.value })}
                placeholder="0"
              />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <div>
              <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Icon (FontAwesome class)
              </label>
              <input
                type="text"
                className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="fas fa-code"
              />
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={350}>
          <div>
            <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              rows="4"
              className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the skill and your experience with it"
            />
          </div>
        </AnimatedSection>

<AnimatedSection delay={400}>
  <div>
    <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
      Skill Image
    </label>
    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className={`w-full text-sm ${theme === 'dark' ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-white'} border rounded p-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
    />
    {(imagePreview || form.imageUrl) && (
      <div className="mt-4">
        <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Preview:</p>
        <img
          src={imagePreview || `http://localhost:5000${form.imageUrl}`}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-md border border-gray-300 dark:border-gray-600"
        />
      </div>
    )}
  </div>
</AnimatedSection>

        <AnimatedSection delay={450}>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/skills')}
              className={`flex-1 py-3 rounded-md font-semibold transition ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 py-3 rounded-md text-white font-semibold transition ${saving
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </AnimatedSection>
      </form>
    </div>
  );
};

export default EditSkillPage;