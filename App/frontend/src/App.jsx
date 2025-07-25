import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { LanguageProvider } from './contexts/LanguageContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/auth/LoginPage';
import PortfolioPage from './pages/public/PortfolioPage';
import ContactPage from './pages/public/ContactPage';
import AboutPage from './pages/public/AboutPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Detail Pages
import ProjectDetailsPage from './pages/public/details/ProjectDetailsPage';
import ExperienceDetailsPage from './pages/public/details/ExperienceDetailsPage';
import EducationDetailsPage from './pages/public/details/EducationDetailsPage';
import SkillDetailsPage from './pages/public/details/SkillDetailsPage';
import CertificateDetailsPage from './pages/public/details/CertificateDetailsPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SkillsPage from './pages/admin/Skills/SkillsPage';
import AddSkillPage from './pages/admin/Skills/AddSkillPage';
import EditSkillPage from './pages/admin/Skills/EditSkillPage';
import ProjectsPage from './pages/admin/Project/ProjectsPage';
import AddProjectPage from './pages/admin/Project/AddProjectPage';
import EditProjectPage from './pages/admin/Project/EditProjectPage';
import ExperiencePage from './pages/admin/Experience/ExperiencePage';
import AddExperiencePage from './pages/admin/Experience/AddExperiencePage';
import EditExperiencePage from './pages/admin/Experience/EditExperiencePage';
import EducationPage from './pages/admin/Education/EducationPage';
import AddEducationPage from './pages/admin/Education/AddEducationPage';
import EditEducationPage from './pages/admin/Education/EditEducationPage';
import CertificatesPage from './pages/admin/Certificates/CertificatesPage';
import AddCertificatesPage from './pages/admin/Certificates/AddCertificatesPage';
import EditCertificatesPage from './pages/admin/Certificates/EditCertificatesPage';
import MessagesPage from './pages/admin/Messages/MessagesPage'; // Added MessagesPage import

const AppContent = () => {
  const location = useLocation();
  const { user, loading } = useAuth();

  const hideFooter = location.pathname.startsWith('/admin') || location.pathname === '/login';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-lg text-indigo-600">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Detail Pages */}
          <Route path="/project/:id" element={<ProjectDetailsPage />} />
          <Route path="/experience/:id" element={<ExperienceDetailsPage />} />
          <Route path="/education/:id" element={<EducationDetailsPage />} />
          <Route path="/skill/:id" element={<SkillDetailsPage />} />
          <Route path="/certificates/:id" element={<CertificateDetailsPage />} />

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/skills" element={<SkillsPage />} />
            <Route path="/admin/skills/add" element={<AddSkillPage />} />
            <Route path="/admin/skills/edit/:id" element={<EditSkillPage />} />
            <Route path="/admin/projects" element={<ProjectsPage />} />
            <Route path="/admin/projects/add" element={<AddProjectPage />} />
            <Route path="/admin/projects/edit/:id" element={<EditProjectPage />} />
            <Route path="/admin/experience" element={<ExperiencePage />} />
            <Route path="/admin/experience/add" element={<AddExperiencePage />} />
            <Route path="/admin/experience/edit/:id" element={<EditExperiencePage />} />
            <Route path="/admin/education" element={<EducationPage />} />
            <Route path="/admin/education/add" element={<AddEducationPage />} />
            <Route path="/admin/education/edit/:id" element={<EditEducationPage />} />
            <Route path="/admin/certificates" element={<CertificatesPage />} />
            <Route path="/admin/certificates/add" element={<AddCertificatesPage />} />
            <Route path="/admin/certificates/edit/:id" element={<EditCertificatesPage />} />
            <Route path="/admin/messages" element={<MessagesPage />} /> {/* Added Messages Route */}
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
                <AppContent />
              </div>
            </Router>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;