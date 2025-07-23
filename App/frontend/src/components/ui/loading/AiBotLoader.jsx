// src/components/ui/loading/AiBotLoader.jsx
import React from 'react';
import './AiBotLoader.css';
import { useTheme } from '../../../contexts/ThemeContext'; // Adjust path if needed

const AiBotLoader = () => {
  const { theme } = useTheme(); // expects "dark" or "light"

  return (
    <div className={`${theme === 'dark' ? 'dark' : 'light'}`}>
      <div className="ai-bot">
        <div className="head">
          <div className="face">
            <div className="eyes"></div>
            <div className="mouth"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiBotLoader;
