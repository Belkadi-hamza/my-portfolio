import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Toaster } from 'react-hot-toast';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserSettings from './components/UserSettings';
import EducationManager from './components/EducationManager';
import ExperienceManager from './components/ExperienceManager';
import ProjectManager from './components/ProjectManager';
import SkillsManager from './components/SkillsManager';
import SocialLinksManager from './components/SocialLinksManager';
import AdminLayout from './components/AdminLayout';

export default function AdminApp() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        
        {!user ? (
          <Login />
        ) : (
          <AdminLayout>
            <Routes>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/settings" element={<UserSettings />} />
              <Route path="/admin/education" element={<EducationManager />} />
              <Route path="/admin/experience" element={<ExperienceManager />} />
              <Route path="/admin/projects" element={<ProjectManager />} />
              <Route path="/admin/skills" element={<SkillsManager />} />
              <Route path="/admin/social-links" element={<SocialLinksManager />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </AdminLayout>
        )}
      </div>
    </Router>
  );
}