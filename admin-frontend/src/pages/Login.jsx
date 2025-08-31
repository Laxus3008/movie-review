import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        navigate('/home');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
