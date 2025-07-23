import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
    if (result.success) {
      showToast('success', 'Logged in successfully');
      navigate("/admin/dashboard");
    } else {
      setError(result.error);
      showToast('error', result.error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white font-['Space_Grotesk'] overflow-hidden">
      
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 hidden sm:block"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/home/big.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.4)',
          opacity: 0.25,
        }}
      />

      {/* Blur Light Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 hidden sm:block">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-cyan-900/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 grid grid-cols-12 opacity-5 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-cyan-500"></div>
          ))}
        </div>
        <div className="absolute inset-0 grid grid-rows-12 opacity-5 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-b border-cyan-500"></div>
          ))}
        </div>
      </div>

      {/* Login Form Card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-w-md w-full mx-auto p-8 bg-white bg-opacity-90 text-gray-800 shadow-xl rounded-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600">
          Admin Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* Password Field with Show/Hide */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full border p-3 rounded-md pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-indigo-600 hover:underline focus:outline-none"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {error && <p className="text-red-600 text-center">{error}</p>}

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md w-full transition-all"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
