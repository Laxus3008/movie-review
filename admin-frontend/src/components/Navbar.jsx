import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const { setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(false);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <ul className="flex space-x-4">
          <li>
            <Link to="/home" className="hover:text-gray-400">All Movies</Link>
          </li>
          <li>
            <Link to="/add-movie" className="hover:text-gray-400">Add Movie</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="hover:text-gray-400">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
