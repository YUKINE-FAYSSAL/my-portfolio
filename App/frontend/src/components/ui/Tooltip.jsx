import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Tooltip = ({ text, children, position = 'top' }) => {
  const [visible, setVisible] = useState(false);
  const { theme } = useTheme();

  const positionClasses = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="inline-block"
      >
        {children}
      </div>
      {visible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm rounded-md shadow-lg transition-all ${
            theme === 'dark'
              ? 'bg-gray-700 text-gray-100'
              : 'bg-gray-800 text-white'
          } ${positionClasses[position]}`}
        >
          {text}
          <div
            className={`absolute w-2 h-2 transform rotate-45 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-800'
            } ${getArrowPosition(position)}`}
          ></div>
        </div>
      )}
    </div>
  );
};

function getArrowPosition(position) {
  switch(position) {
    case 'top': return '-bottom-1 left-1/2 -translate-x-1/2';
    case 'right': return '-left-1 top-1/2 -translate-y-1/2';
    case 'bottom': return '-top-1 left-1/2 -translate-x-1/2';
    case 'left': return '-right-1 top-1/2 -translate-y-1/2';
    default: return '';
  }
}

export default Tooltip;