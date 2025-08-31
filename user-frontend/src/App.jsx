import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Watchlist from './pages/Watchlist';

function App() {
  return (
    
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <ToastContainer/>
          <Navbar />
          
          
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/watchlist" element={<Watchlist />} />
            </Routes>
          
          

          
        </div>
  );
}

export default App;
