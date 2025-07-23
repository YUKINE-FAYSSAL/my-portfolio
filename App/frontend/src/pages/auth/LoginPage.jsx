import React, { useContext } from 'react';
import LoginForm from '../../components/auth/LoginForm';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';

const LoginPage = () => {
  const { theme } = useTheme();
  const { login } = useContext(AuthContext);

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center px-4 font-['Space_Grotesk'] overflow-hidden ${
        theme === 'dark'
          ? 'bg-black text-white'
          : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-white text-gray-800'
      }`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 hidden sm:block"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/home/big.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: theme === 'dark' ? 'brightness(0.4)' : 'brightness(0.95)',
          opacity: 0.25,
        }}
      />

      {/* Blur Background Lights */}
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
      <div className="relative z-10 w-full max-w-md">
        <LoginForm onLogin={login} />
      </div>
    </div>
  );
};

export default LoginPage;
