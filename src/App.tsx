import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import MedicalRecordForm from './pages/MedicalRecordForm';
import Appointments from './pages/Appointments';
import Login from './pages/Login';
import Reports from './pages/Reports';
import EducationLibrary from './pages/EducationLibrary';
import Integration from './pages/Integration';
import Security from './pages/Security';
import AccountSettings from './pages/AccountSettings';
import Referrals from './pages/Referrals';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const handleLogin = (role: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  const canAccess = (path: string) => {
    if (!userRole) return false;
    const role = userRole.toLowerCase();
    if (role === 'admin') return true;
    
    if (role === 'operator') {
      const excluded = ['/patients', '/security', '/reports'];
      return !excluded.includes(path);
    }
    
    if (role === 'pasien') {
      return path === '/appointments' || path === '/';
    }
    
    if (role === 'dosen pembimbing') {
      const excluded = ['/settings', '/security'];
      return !excluded.includes(path);
    }
    
    return ['/', '/education', '/appointments'].includes(path);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-baby-pink font-sans text-slate-900">
        <Sidebar onLogout={handleLogout} userRole={userRole || ''} />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/patients" element={canAccess('/patients') ? <PatientList /> : <Navigate to="/" />} />
                <Route path="/medical-records" element={canAccess('/medical-records') ? <MedicalRecordForm /> : <Navigate to="/" />} />
                <Route path="/medical-records/:patientId" element={canAccess('/medical-records') ? <MedicalRecordForm /> : <Navigate to="/" />} />
                <Route path="/education" element={canAccess('/education') ? <EducationLibrary /> : <Navigate to="/" />} />
                <Route path="/referrals" element={canAccess('/referrals') ? <Referrals /> : <Navigate to="/" />} />
                <Route path="/appointments" element={canAccess('/appointments') ? <Appointments /> : <Navigate to="/" />} />
                <Route path="/reports" element={canAccess('/reports') ? <Reports /> : <Navigate to="/" />} />
                <Route path="/security" element={canAccess('/security') ? <Security /> : <Navigate to="/" />} />
                <Route path="/integration" element={canAccess('/integration') ? <Integration /> : <Navigate to="/" />} />
                <Route path="/settings" element={canAccess('/settings') ? <AccountSettings /> : <Navigate to="/" />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </Router>
  );
}
