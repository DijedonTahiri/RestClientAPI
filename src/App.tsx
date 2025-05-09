import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Layout from './components/Layout/Layout';
import SettingsPage from './pages/SettingsPage';
import MonitoringPage from './pages/MonitoringPage';

function AppContent() {
  const { state } = useAppContext();
  
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Routes>
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/monitoring" element={<MonitoringPage />} />
        <Route path="/" element={<Layout />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;