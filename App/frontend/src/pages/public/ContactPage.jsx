import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedSection from '../../components/ui/AnimatedSection';
import useScrollToTop from '../../hooks/useScrollToTop';
import { FiGithub, FiPhone, FiTwitter } from 'react-icons/fi';
import { FaFacebook, FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';


const ContactPage = () => {
  useScrollToTop();
  const [form, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    platform: 'website',
  });
  const [status, setStatus] = useState(null);
  const [socialLinks, setSocialLinks] = useState({});
  const { theme } = useTheme();
  const { language } = useLanguage();

  const content = {
    en: {
      title: 'Contact Me',
      form: {
        name: 'Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
        platform: 'How did you find me?',
        submit: 'Send Message',
        platformOptions: {
          website: 'Website',
          phone: 'Phone',
          github: 'GitHub',
          other: 'Other',
        },
      },
social: {
  github: 'GitHub',
  phone: 'Phone',
  whatsapp: 'WhatsApp',
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn'
},


      status: {
        success: 'Message sent successfully!',
        error: 'Failed to send message. Please try again.',
      },
    },
    fr: {
      title: 'Contactez-moi',
      form: {
        name: 'Nom',
        email: 'Email',
        subject: 'Sujet',
        message: 'Message',
        platform: 'Comment m\'avez-vous trouvé ?',
        submit: 'Envoyer le Message',
        platformOptions: {
          website: 'Site Web',
          phone: 'Téléphone',
          github: 'GitHub',
          other: 'Autre',
        },
      },
social: {
  title: 'Connectez-vous avec moi',
  github: 'GitHub',
  phone: 'Téléphone',
  whatsapp: 'WhatsApp',
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn'
},

      status: {
        success: 'Message envoyé avec succès !',
        error: 'Échec de l\'envoi du message. Veuillez réessayer.',
      },
    },
    ar: {
      title: 'تواصل معي',
      form: {
        name: 'الاسم',
        email: 'البريد الإلكتروني',
        subject: 'الموضوع',
        message: 'الرسالة',
        platform: 'كيف وجدتني؟',
        submit: 'إرسال الرسالة',
        platformOptions: {
          website: 'الموقع الإلكتروني',
          phone: 'الهاتف',
          github: 'جيت هب',
          other: 'آخر',
        },
      },
social: {
  title: 'تواصل معي',
  github: 'جيت هب',
  phone: 'الهاتف',
  whatsapp: 'واتساب',
  facebook: 'فيسبوك',
  instagram: 'إنستغرام',
  linkedin: 'لينكد إن'
},

      status: {
        success: 'تم إرسال الرسالة بنجاح!',
        error: 'فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
      },
    },
  };

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/public/contact-info');
        setSocialLinks(response.data.social || {});
      } catch (error) {
        console.error('Error fetching social links:', error);
      }
    };
    fetchSocialLinks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/messages', form);
      setStatus({ type: 'success', message: content[language].status.success });
      setFormData({ name: '', email: '', subject: '', message: '', platform: 'website' });
    } catch (error) {
      setStatus({ type: 'error', message: content[language].status.error });
    }
  };

  return (
    <div className={`relative min-h-screen font-['Space_Grotesk'] ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} ${language === 'ar' ? 'font-amiri' : ''}`}>
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
      <div className={`relative z-10 pt-24 px-4 pb-16 flex justify-center ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        <div className="w-full max-w-4xl">
          <AnimatedSection>
            <h1 className={`text-4xl font-bold text-center ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-700'}`}>
              {content[language].title}
            </h1>
          </AnimatedSection>

          {status && (
            <AnimatedSection delay={100}>
              <div className={`mb-6 p-4 rounded-lg text-center ${
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <form onSubmit={handleSubmit} className={`space-y-4 p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {content[language].form.name}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={(e) => setFormData({ ...form, name: e.target.value })}
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
                    onChange={(e) => setFormData({ ...form, email: e.target.value })}
                    className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {content[language].form.subject}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={(e) => setFormData({ ...form, subject: e.target.value })}
                    className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {content[language].form.platform}
                  </label>
                  <select
                    name="platform"
                    value={form.platform}
                    onChange={(e) => setFormData({ ...form, platform: e.target.value })}
                    className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
                    }`}
                  >
                    {Object.entries(content[language].form.platformOptions).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {content[language].form.message}
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={(e) => setFormData({ ...form, message: e.target.value })}
                    rows="5"
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

              {/* Social Links */}
              <div className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-700'}`}>
                  {content[language].social.title}
                </h2>
               <div className="space-y-4">
  {socialLinks.github && (
    <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className={`flex items-center space-x-2 hover:text-indigo-400 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
      <FiGithub className="w-6 h-6" />
      <span>{content[language].social.github}</span>
    </a>
  )}
  {socialLinks.linkedin && (
  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className={`flex items-center space-x-2 hover:text-blue-600 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
    <FaLinkedin className="w-6 h-6" />
    <span>{content[language].social.linkedin}</span>
  </a>
)}


  {socialLinks.phone && (
    <a href={`tel:${socialLinks.phone}`} className={`flex items-center space-x-2 hover:text-indigo-400 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
      <FiPhone className="w-6 h-6" />
      <span>{content[language].social.phone}</span>
    </a>
  )}

  {socialLinks.whatsapp && (
    <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className={`flex items-center space-x-2 hover:text-green-400 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
      <FaWhatsapp className="w-6 h-6" />
      <span>{content[language].social.whatsapp}</span>
    </a>
  )}

  {socialLinks.facebook && (
    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className={`flex items-center space-x-2 hover:text-blue-500 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
      <FaFacebook className="w-6 h-6" />
      <span>{content[language].social.facebook}</span>
    </a>
  )}

  {socialLinks.instagram && (
    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className={`flex items-center space-x-2 hover:text-pink-500 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
      <FaInstagram className="w-6 h-6" />
      <span>{content[language].social.instagram}</span>
    </a>
  )}
</div>

              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;