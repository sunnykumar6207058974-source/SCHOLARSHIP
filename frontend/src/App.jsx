import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Scholarships from './pages/Scholarships';
import ScholarshipDetail from './pages/ScholarshipDetail';
import EligibilityChecker from './pages/EligibilityChecker';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import ScholarshipResults from './pages/ScholarshipResults';
import Videos from './pages/Videos';
import QnA from './pages/QnA';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          
          {/* Universal Header */}
          <Navbar onOpenSearch={() => setSearchModalOpen(true)} />

          {/* Quick Search Modal */}
          <SearchModal
            isOpen={searchModalOpen}
            onClose={() => setSearchModalOpen(false)}
          />

          {/* Main Routing View */}
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/scholarships" element={<Scholarships />} />
              <Route path="/scholarships/:idOrSlug" element={<ScholarshipDetail />} />
              <Route path="/eligibility-checker" element={<EligibilityChecker />} />
              
              {/* Content & Community Routes */}
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:slug" element={<ArticleDetail />} />
              <Route path="/results" element={<ScholarshipResults />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/qna" element={<QnA />} />
              <Route path="/contact" element={<Contact />} />

              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Student Portal */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Portal */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Universal Detailed Footer */}
          <Footer />

        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
