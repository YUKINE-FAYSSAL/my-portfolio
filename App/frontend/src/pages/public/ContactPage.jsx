import React, { useState } from 'react';
import { sendContactMessage } from '../../api/api';
import { useTheme } from '../../contexts/ThemeContext';
import AnimatedSection from '../../components/ui/AnimatedSection';
import useScrollToTop from '../../hooks/useScrollToTop';

const ContactPage = () => {
  useScrollToTop();
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState(null);
  const { theme } = useTheme();
  const [language, setLanguage] = useState('fr'); // Default to French

  const content = {
    en: {
      title: "Contact Me",
      form: {
        name: "Name",
        email: "Email",
        message: "Message",
        submit: "Send Message"
      },
      status: {
        success: "Message sent successfully!",
        error: "Failed to send message. Please try again."
      }
    },
    fr: {
      title: "Contactez-Moi",
      form: {
        name: "Nom",
        email: "Email",
        message: "Message",
        submit: "Envoyer le Message"
      },
      status: {
        success: "Message envoyé avec succès !",
        error: "Échec de l'envoi du message. Veuillez réessayer."
      }
    },
    ar: {
      title: "تواصلوا معي",
      form: {
        name: "الاسم",
        email: "البريد الإلكتروني",
        message: "الرسالة",
        submit: "إرسال الرسالة"
      },
      status: {
        success: "تم إرسال الرسالة بنجاح!",
        error: "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى."
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendContactMessage(form);
      setStatus({ type: 'success', message: content[language].status.success });
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: content[language].status.error });
    }
  };

  return (
    <div className={`relative min-h-screen font-['Space_Grotesk'] ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Language Selector */}
      <div className="fixed top-4 right-4 z-50">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </div>

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

      {/* Page Content */}
      <div className="relative z-10 pt-24 px-4 pb-16 flex justify-center">
        <div className="w-full max-w-xl">
          <AnimatedSection>
            <h1 className={`text-4xl font-bold text-center mb-6 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-700'}`}>
              {content[language].title}
            </h1>
          </AnimatedSection>

          {status && (
            <AnimatedSection delay={100}>
              <div className={`mb-4 p-3 rounded ${
                status.type === 'success'
                  ? theme === 'dark'
                    ? 'bg-green-900 text-green-200'
                    : 'bg-green-100 text-green-700'
                  : theme === 'dark'
                    ? 'bg-red-900 text-red-200'
                    : 'bg-red-100 text-red-700'
              }`}>
                {status.message}
              </div>
            </AnimatedSection>
          )}

          <AnimatedSection delay={200}>
            <form onSubmit={handleSubmit} className={`space-y-4 p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {content[language].form.name}
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {content[language].form.email}
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {content[language].form.message}
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows="4"
                  className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
                  }`}
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition ${
                  theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'
                }`}
              >
                {content[language].form.submit}
              </button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;