import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getMovieTrailer } from '../services/tmdb';
import '../styles.css';

function MovieList({ movies, onFavorite, isFavorited }) {
  const [hoveredMovieId, setHoveredMovieId] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  let hoverTimeout;

  const handleMouseEnter = async (movieId) => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(async () => {
      setHoveredMovieId(movieId);
      try {
        const url = await getMovieTrailer(movieId);
        setTrailerUrl(url);
      } catch (error) {
        console.error('Erro ao carregar trailer:', error);
        setTrailerUrl(null);
      }
    }, 500);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setHoveredMovieId(null);
    setTrailerUrl(null);
  };

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="movie-card"
          onMouseEnter={() => handleMouseEnter(movie.id)}
          onMouseLeave={handleMouseLeave}
        >
          <Link to={`/movie/${movie.id}`}>
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
          </Link>
          {hoveredMovieId === movie.id && trailerUrl && (
            <div className="trailer-overlay">
              <iframe
                src={trailerUrl}
                title={`${movie.title} Trailer`}
                className="movie-trailer"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          )}
          <h3 className="movie-title">{movie.title}</h3>
          <button
            onClick={() => onFavorite(movie)}
            className={`favorite-btn ${isFavorited(movie.id) ? 'favorited' : ''}`}
          >
            {isFavorited(movie.id) ? '★' : '☆'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default MovieList;