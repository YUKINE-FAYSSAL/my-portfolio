import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const CertificateCard = ({ certificate }) => {
  const { theme } = useTheme();
  const format = (d) => new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });

  return (
    <div className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:scale-105 animate-bounce-in ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:shadow-indigo-500/30' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-white hover:shadow-indigo-100/50'}`}>
      <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} transition-colors duration-300 hover:text-indigo-500`}>
        {certificate.name}
      </h3>

      <p className="text-sm mb-1">
        <span className={`${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'} font-medium transition-colors duration-300 hover:text-indigo-400 animate-glow`}>
          {certificate.issuer}
        </span>
      </p>

      <div className="text-xs mb-2 transition-colors duration-300 hover:text-indigo-400">
        <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Issued: {format(certificate.issueDate)}
        </span>
        {certificate.expirationDate && (
          <span className={`ml-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Expires: {format(certificate.expirationDate)}
          </span>
        )}
      </div>

      {certificate.credentialId && (
        <div className={`text-xs mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300 hover:text-indigo-400`}>
          Credential ID: <span className="font-mono">{certificate.credentialId}</span>
        </div>
      )}

      {certificate.credentialUrl && (
        <a
          href={certificate.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center text-sm font-medium mt-3 ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'} transition-colors duration-200 animate-glow`}
        >
          Verify Credential
          <svg className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      )}
    </div>
  );
};

export default CertificateCard;