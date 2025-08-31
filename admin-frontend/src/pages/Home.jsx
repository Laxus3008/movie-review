import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/movie`);
        if (response.data.success) {
          setMovies(response.data.movies);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">All Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {movies.map((movie) => (
          <div key={movie._id} className="border border-gray-300 rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
            <p className="text-sm text-gray-600">Genre: {movie.genre.join(', ')}</p>
            <p className="text-sm text-gray-600">Release Year: {movie.releaseYear}</p>
            <p className="text-sm text-gray-600">Director: {movie.director}</p>
            <p className="text-sm text-gray-600">Rating: {movie.averageRating}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
