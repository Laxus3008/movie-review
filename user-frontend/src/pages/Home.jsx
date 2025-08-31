import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext"; // Adjust the import based on your folder structure

const Home = () => {
  const {  backendUrl,token, userData } = useContext(AppContext);
  const [movies, setMovies] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(""); // Add rating state

  const fetchMovies = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/movie`, {
        params: {
          page,
          limit: 10, // Number of movies per page
          sortBy: "title",
          sortOrder: "asc",
        },
      });

      if (response.data.success) {
        console.log("Fetched movies:", response.data.movies);
        setMovies(response.data.movies);
        setPagination(response.data.pagination);
      } else {
        console.error("Failed to fetch movies:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching movies:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (movieId) => {
    try {
      const movie = movies.find((m) => m._id === movieId); // Find the clicked movie

      if (!movie) {
        alert("Movie not found!");
        return;
      }

      if (!review || !rating || isNaN(rating) || rating < 1 || rating > 5) {
        alert("Please enter a valid rating between 1 and 5 and a review text.");
        return;
      }

      const response = await axios.post(`${backendUrl}/api/review/submit`, {
        movieId: movie._id,
         // Use user ID from context
        rating: parseInt(rating), // Convert rating to a number
        reviewText: review, // Use the review text from state
      },  {headers: {token}});

      if (response.data.success) {
        console.log("Review submitted:", response.data.review);
        alert("Review submitted successfully!");
        setReview(""); // Clear the review input
        setRating(""); // Clear the rating input
      } else {
        alert("Failed to submit review: " + response.data.message);
      }
    } catch (error) {
      console.error("Error submitting review:", error.message);
      alert("Something went wrong while submitting the review.");
    }
  };

  const addToWatchlist = async (movieId) => {
    try {
        const movie = movies.find((m) => m._id === movieId); 
      const response = await axios.post(`${backendUrl}/api/user/add-to-watchlist`, {
        movieId : movie._id,
      }, {
        headers: { token }, // Include the token for authentication
      });

      if (response.data.success) {
        console.log("Movie added to watchlist:", response.data.watchlistItem);
        alert("Movie added to watchlist successfully!");
      } else {
        alert("Failed to add movie to watchlist: " + response.data.message);
      }
    } catch (error) {
      console.error("Error adding movie to watchlist:", error.message);
      alert("Something went wrong while adding the movie to the watchlist.");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Add Tailwind CSS classes to the JSX elements
  return (
    <div className="p-5 font-sans">
      <h1 className="text-center text-3xl font-bold mb-5">Movies</h1>
      {loading ? (
        <p className="text-center text-xl text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {movies.map((movie) => (
              <div key={movie._id} className="border border-gray-300 rounded-lg p-4 shadow-md hover:scale-105 transform transition duration-200 relative">
                <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
                <p className="text-sm text-gray-600">Genre: {movie.genre.join(", ")}</p>
                <p className="text-sm text-gray-600">Release Year: {movie.releaseYear}</p>
                <p className="text-sm text-gray-600">Director: {movie.director}</p>
                <p className="text-sm text-gray-600">Rating: {movie.averageRating}</p>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2 mt-2"
                  placeholder="Write your review here..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                ></textarea>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md p-2 mt-2"
                  placeholder="Enter rating (1-5)"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  min="1"
                  max="5"
                />
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-green-700"
                  onClick={() => submitReview(movie._id)}
                >
                  Submit Review
                </button>
                <button
                  className="absolute top-2 right-2 text-blue-500 hover:text-blue-700 text-xl font-bold"
                  onClick={() => addToWatchlist(movie._id)}
                >
                  +
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center mt-5">
            {pagination.hasPrevPage && (
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md mx-2 hover:bg-blue-700" onClick={() => fetchMovies(pagination.currentPage - 1)}>
                Previous
              </button>
            )}
            <span className="text-gray-700 mx-2">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            {pagination.hasNextPage && (
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md mx-2 hover:bg-blue-700" onClick={() => fetchMovies(pagination.currentPage + 1)}>
                Next
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Home
