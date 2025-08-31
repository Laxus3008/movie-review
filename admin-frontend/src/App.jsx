import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from '../../admin-frontend/src/pages/Home';
import AddMovie from './pages/AddMovie';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login page if token is empty
    }
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add-movie" element={<AddMovie />} />
        {/* Define other routes here */}
      </Routes>
    </div>
  );
}

export default App
