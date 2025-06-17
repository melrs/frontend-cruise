import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Notification from './components/Notification';
import { NotificationProvider, useNotification } from './contexts/NotificationContext';

import Home from './pages/Home';
import Reserve from './pages/Reserve';
import CancelReservation from './pages/CancelReservation';
import Promotions from './pages/Promotions';
import NotFound from './pages/NotFound';

function AppContent() {
  const { notification } = useNotification();

  return (
    <>
      <Header />
      {notification && <Notification message={notification.message} type={notification.type} />}
      <main className="app-main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reserve" element={<Reserve />} />
          <Route path="/cancel" element={<CancelReservation />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="*" element={<NotFound />} /> {/* Catch-all for undefined routes */}
        </Routes>
      </main>
      <Footer />
    </>
  );
}

// Wrapper for the whole application with necessary providers
function App() {
  return (
    <Router>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </Router>
  );
}

export default App;