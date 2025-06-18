import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Notification from './components/Notification';
import { NotificationProvider, useNotification } from './contexts/NotificationContext';

import Home from './pages/Home';
import MyReservations from './pages/MyReservations'; 
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
          <Route path="/my-reservations" element={<MyReservations />} /> {/* Nova rota */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

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