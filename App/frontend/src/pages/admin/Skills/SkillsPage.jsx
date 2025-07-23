import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiPlusCircle, FiSearch } from "react-icons/fi";
import { useTheme } from "../../../contexts/ThemeContext";
import AnimatedSection from "../../../components/ui/AnimatedSection";
import SkillLevelBar from "./SkillLevelBar";



const getCategoryIcon = (category) => {
  switch(category) {
    case 'Software Engineering': return 'fas fa-laptop-code';
    case 'Cloud Computing': return 'fas fa-cloud';
    case 'Data Engineering': return 'fas fa-database';
    case 'DevOps': return 'fas fa-server';
    case 'Frontend Development': return 'fab fa-html5';
    case 'Backend Development': return 'fas fa-code';
    case 'Full Stack Development': return 'fas fa-layer-group';
    case 'Mobile Development': return 'fas fa-mobile-alt';
    case 'AI/ML Engineering': return 'fas fa-robot';
    case 'Cybersecurity': return 'fas fa-shield-alt';
    case 'Embedded Systems': return 'fas fa-microchip';
    default: return 'fas fa-cog';
  }
};


const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const { theme } = useTheme();

  const fetchSkills = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/skills", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSkills(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/skills/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSkills((prev) => prev.filter((skill) => skill._id?.$oid !== id && skill._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete skill");
    }
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || skill.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = [...new Set(skills.map(skill => skill.category))];

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-indigo-600 font-semibold">Loading skills...</div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-600 dark:text-red-400 mt-10">{error}</div>
  );

  return (
    <div className={`max-w-7xl mx-auto p-6 rounded-lg pt-24 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <AnimatedSection>
          <h1 className={`text-3xl md:text-4xl font-extrabold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
            Skills Dashboard
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage your skills and expertise
          </p>
        </AnimatedSection>

        <button
          onClick={() => navigate("/admin/skills/add")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
        >
          <FiPlusCircle size={20} />
          Add Skill
        </button>
      </div>

      {/* Search and Filter */}
      <AnimatedSection delay={100}>
        <div className={`mb-8 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <FiSearch className={`absolute left-3 top-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
              />
            </div>
<select
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  className={`px-4 py-2 rounded-md ${
    theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white'
  } border ${
    theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
  }`}
>
  <option value="all">All Categories</option>
  <option value="Software Engineering">📊 Software Engineering</option>
  <option value="Cloud Computing">☁️ Cloud Computing</option>
  <option value="Data Engineering">🗃️ Data Engineering</option>
  <option value="DevOps">🔄 DevOps</option>
  <option value="Frontend Development">🖥️ Frontend Development</option>
  <option value="Backend Development">💻 Backend Development</option>
  <option value="Full Stack Development">🧩 Full Stack Development</option>
  <option value="Mobile Development">📱 Mobile Development</option>
  <option value="AI/ML Engineering">🤖 AI/ML Engineering</option>
  <option value="Cybersecurity">🛡️ Cybersecurity</option>
  <option value="Embedded Systems">⚙️ Embedded Systems</option>
</select>
          </div>
        </div>
      </AnimatedSection>

      {filteredSkills.length === 0 ? (
        <div className={`text-center p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
          No skills found. {searchTerm ? 'Try a different search term.' : 'Add your first skill!'}
        </div>
      ) : (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {filteredSkills.map((skill) => {
    const id = skill._id?.$oid || skill._id;
    
    return (
      <AnimatedSection key={id} delay={Math.min(200 * (skills.indexOf(skill) + 1), 1000)}>
        <div className={`rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
          
          {/* Image/Icon Section */}
          {skill.imageUrl ? (
            <div className="relative h-40 w-full">
              <img
                src={`http://localhost:5000${skill.imageUrl}`}
                alt={skill.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/300x200?text=${skill.name[0]}`;
                }}
              />
              {skill.icon && (
                <div className="absolute top-2 right-2">
                  <i className={`${skill.icon} text-2xl ${theme === 'dark' ? 'text-white bg-black/50 p-2 rounded-full' : 'text-indigo-600'}`} />
                </div>
              )}
            </div>
          ) : (
            <div className={`h-40 w-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
              {skill.icon ? (
                <i className={`${skill.icon} text-5xl ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
              ) : (
                <span className="text-4xl font-bold text-indigo-500">
                  {skill.name[0]}
                </span>
              )}
            </div>
          )}

                  <div className="p-4">
<div className="flex justify-between items-start">
  <div>
    <h2 className={`text-xl font-semibold ${
      theme === 'dark' ? 'text-white' : 'text-gray-800'
    }`}>
      {skill.name}
    </h2>
    <div className="flex items-center gap-2 mt-1">
      <i className={`${getCategoryIcon(skill.category)} text-xs ${
        theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
      }`} />
      <span className={`text-xs px-2 py-1 rounded-full ${
        theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
      }`}>
        {skill.category}
      </span>
    </div>
  </div>
  <span className={`text-sm font-semibold ${
    theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
  }`}>
    {skill.years > 0 ? `${skill.years} yrs` : ''}
  </span>
</div>

                    {/* Skill Level */}
                    <div className="mt-3">
                      <SkillLevelBar level={skill.level} theme={theme} />
                    </div>

                    {/* Description */}
                    {skill.description && (
                      <p className={`mt-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} line-clamp-3`}>
                        {skill.description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                      <button
                        onClick={() => navigate(`/admin/skills/edit/${id}`)}
                        className={`flex items-center gap-1 ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
                        title="Edit Skill"
                      >
                        <FiEdit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
                        className={`flex items-center gap-1 ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
                        title="Delete Skill"
                      >
                        <FiTrash2 size={16} />
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

export default SkillsPage;