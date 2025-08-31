import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const Watchlist = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [movies, setMovies] = useState([]); // New state to hold movie details

  const fetchWatchlist = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/user/get-user-watchlist`  , {
        params: {
          page,
          limit: 10,
          sortBy: "dateAdded",
          sortOrder: "desc",
        },
        headers: { token },
      });

      if (response.data.success) {
        // console.log("Fetched watchlist:", response.data.watchlist);
        setWatchlist(response.data.watchlist);
        setPagination(response.data.pagination);
      } else {
        alert("Failed to fetch watchlist: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching watchlist:", error.message);
      alert("Something went wrong while fetching the watchlist.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieDetails = async () => {
    try {
      const movieDetails = [];

      console.log( "watchlist to be displayed" + watchlist);

      for (const item of watchlist) {
        console.log("Fetching details for movieId: ", item.movie);
        const response = await axios.get(`${backendUrl}/api/movie/${item.movie}`);
        if (response.data.success) {
          console.log("Fetched movie details:", response.data.movie);
          movieDetails.push({
            ...response.data.movie,
            watchlistId: item._id, // Include watchlist item ID for uniqueness
          });
        } else {
          console.error("Failed to fetch movie details for:", item.movie);
        }
      }
      console.log("All fetched movie details:", movieDetails);
      // Store the movie details in a new state
      setMovies(movieDetails);
    } catch (error) {
      console.error("Error fetching movie details:", error.message);
      alert("Something went wrong while fetching movie details.");
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/user/remove-from-watchlist/${movieId}`, {
        headers: { token },
      });

      if (response.data.success) {
        console.log("Movie removed from watchlist:", response.data.removedMovie);
        alert("Movie removed from watchlist successfully!");

        setMovies((prev) => prev.filter((m) => m._id !== movieId));
      setWatchlist((prev) => prev.filter((w) => w.movie !== movieId));
        // fetchWatchlist(); // Re-fetch the watchlist to update the UI
      } else {
        alert("Failed to remove movie from watchlist: " + response.data.message);
      }
    } catch (error) {
      console.error("Error removing movie from watchlist:", error.message);
      alert("Something went wrong while removing the movie from the watchlist.");
    }
  };

  // First effect: fetch watchlist when component mounts
useEffect(() => {
  fetchWatchlist();
}, []);

// Second effect: whenever watchlist changes, fetch movies
useEffect(() => {
  if (watchlist.length > 0) {
    fetchMovieDetails();
  }
}, [watchlist]);

//   useEffect(() => {
//     fetchWatchlist().then(() => fetchMovieDetails());
//   }, []);

  return (
    <div className="p-5 font-sans">
      <h1 className="text-center text-3xl font-bold mb-5">My Watchlist</h1>
      {loading ? (
        <p className="text-center text-xl text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {movies.map((movie) => (
            <div key={movie.watchlistId} className="border border-gray-300 rounded-lg p-4 shadow-md relative">
              <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
              <p className="text-sm text-gray-600">Genre: {Array.isArray(movie.genre) ? movie.genre.join(", ") : "N/A"}</p>
              <p className="text-sm text-gray-600">Release Year: {movie.releaseYear}</p>
              <p className="text-sm text-gray-600">Director: {movie.director}</p>
              <p className="text-sm text-gray-600">Rating: {movie.averageRating}</p>
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
                onClick={() => removeFromWatchlist(movie._id)}
              >
                remove
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center items-center mt-5">
        {pagination.hasPrevPage && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mx-2 hover:bg-blue-700"
            onClick={() => fetchWatchlist(pagination.currentPage - 1)}
          >
            Previous
          </button>
        )}
        <span className="text-gray-700 mx-2">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        {pagination.hasNextPage && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mx-2 hover:bg-blue-700"
            onClick={() => fetchWatchlist(pagination.currentPage + 1)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
