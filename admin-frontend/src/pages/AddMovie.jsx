import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const AddMovie = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    releaseYear: '',
    director: '',
    cast: '',
    synopsis: '',
    posterURL: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/movie/add`,
        {
          ...formData,
          genre: formData.genre.split(','), // Convert genre to array
          cast: formData.cast.split(',') // Convert cast to array
        },
        {
          headers: { token }
        }
      );

      if (response.data.success) {
        setMessage('Movie added successfully!');
        setFormData({
          title: '',
          genre: '',
          releaseYear: '',
          director: '',
          cast: '',
          synopsis: '',
          posterURL: ''
        });
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error adding movie:', error);
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Add Movie</h1>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Genre (comma-separated)</label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Release Year</label>
          <input
            type="number"
            name="releaseYear"
            value={formData.releaseYear}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Director</label>
          <input
            type="text"
            name="director"
            value={formData.director}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cast (comma-separated)</label>
          <input
            type="text"
            name="cast"
            value={formData.cast}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Synopsis</label>
          <textarea
            name="synopsis"
            value={formData.synopsis}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Poster URL</label>
          <input
            type="url"
            name="posterURL"
            value={formData.posterURL}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Movie
        </button>
      </form>
    </div>
  );
};

export default AddMovie;
