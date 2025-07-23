import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import AnimatedSection from '../../components/ui/AnimatedSection';
import useScrollToTop from '../../hooks/useScrollToTop';
const AboutPage = () => {
  useScrollToTop();
  const { theme } = useTheme();
  const [rotation, setRotation] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotation({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center px-6 py-24 font-['Space_Grotesk'] ${
        theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Blurred Circles & Grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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

      {/* SVG Animated Background Circles */}
      <svg className="absolute inset-0 w-full h-full -z-10" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="25%"
          cy="30%"
          r="100"
          fill={theme === 'dark' ? 'rgba(99,102,241,0.3)' : 'rgba(139,92,246,0.2)'}
          style={{
            transform: `translate3d(${rotation.rotateY * 5}px, ${rotation.rotateX * 5}px, 0)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
        <circle
          cx="75%"
          cy="70%"
          r="150"
          fill={theme === 'dark' ? 'rgba(99,102,241,0.2)' : 'rgba(139,92,246,0.15)'}
          style={{
            transform: `translate3d(${-rotation.rotateY * 3}px, ${-rotation.rotateX * 3}px, 0)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      </svg>

      {/* Profile Image */}
      <AnimatedSection>
        <div
          className="relative z-10 cursor-pointer"
          style={{
            transform: `perspective(600px) rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg)`,
            transition: 'transform 0.1s ease-out',
            width: 160,
            height: 160,
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/profil/img.jpg`}
            alt="Profile"
            className="w-40 h-40 rounded-full border-8 border-white shadow-lg"
            style={{
              filter: theme === 'dark'
                ? 'drop-shadow(0 0 10px rgba(99,102,241,0.7))'
                : 'drop-shadow(0 0 15px rgba(139,92,246,0.5))'
            }}
          />
        </div>
      </AnimatedSection>

      {/* Text Content */}
      <AnimatedSection delay={100}>
        <div className="mt-10 max-w-xl text-center space-y-6 relative z-10 px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-indigo-500">
            Yukinee, Full Stack Developer
          </h1>
          <p className="text-lg leading-relaxed">
            I'm a passionate full-stack developer currently studying at EMSI Rabat and trained at OFPPT Taza in Full Stack Development.
            <br /><br />
            With a strong background in JavaScript, React, Node.js, and more, I love crafting clean, performant, and beautiful web applications.
            <br /><br />
            Outside coding, I'm keen on design, open source, and constantly learning new tech to push my boundaries.
          </p>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default AboutPage;
