import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ScrollManager from './components/ScrollManager';
import PageTransition from './components/PageTransition';
import CursorGlow from './components/CursorGlow';

// Lazy-loaded Page Views for Code Splitting
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Services = React.lazy(() => import('./pages/Services'));
const Blogs = React.lazy(() => import('./pages/Blogs'));
const BlogDetail = React.lazy(() => import('./pages/BlogDetail'));
const Careers = React.lazy(() => import('./pages/Careers'));
const Contact = React.lazy(() => import('./pages/Contact'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = React.lazy(() => import('./pages/TermsConditions'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Maintenance = React.lazy(() => import('./pages/Maintenance'));

// New Protected Submodule Views
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const MentorLogin = React.lazy(() => import('./pages/MentorLogin'));
const InternLogin = React.lazy(() => import('./pages/InternLogin'));
const NdaAgreement = React.lazy(() => import('./pages/NdaAgreement'));
const VerifyCertificate = React.lazy(() => import('./pages/VerifyCertificate'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const MentorDashboard = React.lazy(() => import('./pages/MentorDashboard'));
const InternDashboard = React.lazy(() => import('./pages/InternDashboard'));

// Premium loading screen with spinner
const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)'
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      border: '2px solid var(--border)',
      borderTop: '2px solid var(--accent)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      marginBottom: '1.5rem'
    }} />
    <p style={{
      fontFamily: 'var(--font-heading)',
      fontWeight: '500',
      letterSpacing: '0.12em',
      fontSize: '0.8rem',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      opacity: 0.7
    }}>
      Steigel Innovations
    </p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// AnimatePresence requires useLocation inside Router
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Website Routes */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/blogs" element={<PageTransition><Blogs /></PageTransition>} />
        <Route path="/blogs/:id" element={<PageTransition><BlogDetail /></PageTransition>} />
        <Route path="/careers" element={<PageTransition><Careers /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/terms-and-conditions" element={<PageTransition><TermsConditions /></PageTransition>} />
        <Route path="/maintenance" element={<PageTransition><Maintenance /></PageTransition>} />

        {/* Authentication & Protected Dashboard Routes */}
        <Route path="/admin-login" element={<PageTransition><AdminLogin /></PageTransition>} />
        <Route path="/mentor-login" element={<PageTransition><MentorLogin /></PageTransition>} />
        <Route path="/user-login" element={<PageTransition><InternLogin /></PageTransition>} />
        <Route path="/intern-login" element={<PageTransition><InternLogin /></PageTransition>} />
        
        <Route path="/nda-agreement" element={<PageTransition><NdaAgreement /></PageTransition>} />
        <Route path="/verify/:token" element={<PageTransition><VerifyCertificate /></PageTransition>} />
        
        <Route path="/admin-dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
        <Route path="/mentor-dashboard" element={<PageTransition><MentorDashboard /></PageTransition>} />
        <Route path="/user-dashboard" element={<PageTransition><InternDashboard /></PageTransition>} />
        <Route path="/intern-dashboard" element={<PageTransition><InternDashboard /></PageTransition>} />

        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

// Helper container to inspect paths and hide Header/Footer on Protected routes
function AppContent() {
  const location = useLocation();
  const pathname = location.pathname;

  const hideLayout =
    pathname.startsWith('/admin-') ||
    pathname.startsWith('/mentor-') ||
    pathname.startsWith('/user-') ||
    pathname.startsWith('/intern-') ||
    pathname === '/nda-agreement' ||
    pathname.startsWith('/verify/');

  if (hideLayout) {
    return (
      <main id="main-content" style={{ minHeight: '100vh' }}>
        <Suspense fallback={<LoadingScreen />}>
          <AnimatedRoutes />
        </Suspense>
      </main>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main id="main-content" style={{ flexGrow: 1 }}>
        <Suspense fallback={<LoadingScreen />}>
          <AnimatedRoutes />
        </Suspense>
      </main>
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollManager />
      <CursorGlow />
      {/* Cursor glow DOM element — tracked by CursorGlow */}
      <div id="cursor-glow" aria-hidden="true" />
      <AppContent />
    </Router>
  );
}

export default App;
