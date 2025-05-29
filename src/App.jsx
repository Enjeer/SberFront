import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MainPage from './pages/mainPage';
import Chat from './pages/Chat';

const App = () => {
useEffect(() => {
  const isMobile = window.innerWidth < 630;
  const mockup = document.querySelector('.mockup');
  if (mockup && isMobile) {
    mockup.style.display = 'none';
  }
}, []);

  return(  
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <Header />
    <div style={{ flexGrow: 1, overflow: 'hidden' }}>
      <Routes>
        <Route path="*" element={<MainPage />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  </div>
  );

};

export default App;
