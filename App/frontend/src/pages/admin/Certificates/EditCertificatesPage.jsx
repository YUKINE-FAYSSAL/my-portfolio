import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../../../contexts/ThemeContext";
import AnimatedSection from "../../../components/ui/AnimatedSection";

const EditCertificatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [form, setForm] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    credentialId: "",
    credentialUrl: "",
    category: "Technical",
    status: "Active",
    description: "",
    skills: [],
    level: "Professional",
    icon: "",
    priority: "Medium"
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/certificates/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        
        const data = res.data;
        setForm({
          name: data.name || "",
          issuer: data.issuer || "",
          issueDate: data.issueDate ? data.issueDate.split('T')[0] : "",
          expiryDate: data.expiryDate ? data.expiryDate.split('T')[0] : "",
          credentialId: data.credentialId || "",
          credentialUrl: data.credentialUrl || "",
          category: data.category || "Technical",
          status: data.status || "Active",
          description: data.description || "",
          skills: data.skills || [],
          level: data.level || "Professional",
          icon: data.icon || "",
          priority: data.priority || "Medium"
        });
        
        if (data.imageUrl) {
          setCurrentImage(`http://localhost:5000${data.imageUrl}`);
        }
      } catch (err) {
        alert(err.response?.data?.message || "Failed to load certificate");
        navigate("/admin/certificates");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm({
        ...form,
        skills: [...form.skills, skillInput.trim()]
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setForm({
      ...form,
      skills: form.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.issuer.trim()) {
      alert("Name and Issuer are required");
      return;
    }

    setSaving(true);

    try {
      const data = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'skills') {
          data.append(key, JSON.stringify(form[key]));
        } else {
          data.append(key, form[key]);
        }
      });
      
      if (imageFile) {
        data.append("image", imageFile);
      }

      await axios.put(`http://localhost:5000/api/certificates/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Certificate updated successfully!");
      navigate("/admin/certificates");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update certificate");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-indigo-600 font-semibold">Loading certificate...</div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 rounded-lg shadow-lg mt-10 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <AnimatedSection>
        <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
          Edit Certificate
        </h1>
      </AnimatedSection>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Certificate Name & Issuer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedSection delay={100}>
            <div>
              <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Certificate Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="AWS Certified Solutions Architect"
              />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={150}>
            <div>
              <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Issuer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                required
                placeholder="Amazon Web Services"
              />
            </div>
          </AnimatedSection>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedSection delay={200}>
            <div>
              <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Issue Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                value={form.issueDate}
                onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                required
              />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={250}>
            <div>
              <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Expiry Date
              </label>
              <input
                type="date"
                className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              />
            </div>
          </AnimatedSection>
        </div>

        {/* Credential Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedSection delay={300}>
            <div>
              <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Credential ID
              </label>
              <input
                type="text"
                className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                value={form.credentialId}
                onChange={(e) => setForm({ ...form, credentialId: e.target.value })}
                placeholder="SAA-C03-123456789"
              />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={350}>
            <div>
              <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Credential URL
              </label>
              <input
                type="url"
                className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                value={form.credentialUrl}
                onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
                placeholder="https://credly.com/badges/..."
              />
            </div>
          </AnimatedSection>
        </div>

        {/* Category, Status, Level, Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedSection delay={400}>
            <div>
              <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Category
              </label>
              <select
                className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Cloud Computing">☁️ Cloud Computing</option>
                <option value="Software Development">💻 Software Development</option>
                <option value="DevOps">🔄 DevOps</option>
                <option value="Cybersecurity">🛡️ Cybersecurity</option>
                <option value="Data & Analytics">📊 Data & Analytics</option>
                <option value="Project Management">📋 Project Management</option>
                <option value="AI/ML">🤖 AI/ML</option>
                <option value="Mobile Development">📱 Mobile Development</option>
                <option value="Database">🗄️ Database</option>
                <option value="Networking">🌐 Networking</option>
                <option value="Other">🔧 Other</option>
              </select>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={450}>
            <div>
              <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Status
              </label>
              <select
                className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Active">✅ Active</option>
                <option value="Expired">⏰ Expired</option>
                <option value="Pending">🔄 Pending</option>
                <option value="Archived">📦 Archived</option>
              </select>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={500}>
            <div>
              <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Level
              </label>
              <select
                className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              >
                <option value="Foundation">🟢 Foundation</option>
                <option value="Associate">🔵 Associate</option>
                <option value="Professional">🟡 Professional</option>
                <option value="Expert">🔴 Expert</option>
                <option value="Specialty">⭐ Specialty</option>
              </select>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={550}>
            <div>
              <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Priority
              </label>
              <select
                className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
                <option value="Critical">⚡ Critical</option>
              </select>
            </div>
          </AnimatedSection>
        </div>

        {/* Icon */}
        <AnimatedSection delay={600}>
          <div>
            <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Icon (FontAwesome class)
            </label>
            <input
              type="text"
              className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="fas fa-award"
            />
          </div>
        </AnimatedSection>

        {/* Skills */}
        <AnimatedSection delay={650}>
          <div>
            <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Related Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className={`flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skills.map((skill, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'} flex items-center gap-2`}
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Description */}
        <AnimatedSection delay={700}>
          <div>
            <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              rows="4"
              className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe what this certificate covers and your achievements..."
            />
          </div>
        </AnimatedSection>

        {/* Certificate Image */}
        <AnimatedSection delay={750}>
          <div>
            <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Certificate Image/Badge
            </label>
            
            {/* Current Image */}
            {currentImage && !imagePreview && (
              <div className="mb-4">
                <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Current Image:</p>
                <img
                  src={currentImage}
                  alt="Current certificate"
                  className="w-32 h-32 object-cover rounded-md border border-gray-300 dark:border-gray-600 shadow-md"
                />
              </div>
            )}
            
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`w-full text-sm ${theme === 'dark' ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-white'} border rounded p-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
            />
            
            {/* New Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>New Image Preview:</p>
                <img
                  src={imagePreview}
                  alt="New preview"
                  className="w-32 h-32 object-cover rounded-md border border-gray-300 dark:border-gray-600 shadow-md"
                />
              </div>
            )}
          </div>
        </AnimatedSection>

        {/* Action Buttons */}
        <AnimatedSection delay={800}>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 py-3 rounded-md text-white font-semibold transition ${saving
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              {saving ? "Updating Certificate..." : "Update Certificate"}
            </button>
            
            <button
              type="button"
              onClick={() => navigate("/admin/certificates")}
              className={`px-6 py-3 rounded-md font-semibold transition ${theme === 'dark' 
                ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Cancel
            </button>
          </div>
        </AnimatedSection>
      </form>
    </div>
  );
};

export default EditCertificatePage;