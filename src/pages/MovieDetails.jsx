import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails } from '../services/tmdb';
import { useAuth } from '../contexts/AuthContext';
import '../styles.css';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
        setLoading(false);
      } catch (err) {
        setError('Falha ao carregar os detalhes do filme.');
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleFavorite = (movie) => {
    if (!user) {
      alert('Por favor, faça login para favoritar filmes!');
      navigate('/login');
      return;
    }
    setFavorites((prevFavorites) => {
      const isFavorited = prevFavorites.some((fav) => fav.id === movie.id);
      if (isFavorited) {
        return prevFavorites.filter((fav) => fav.id !== movie.id);
      } else {
        // Converte genres em genre_ids
        const genreIds = movie.genres.map((genre) => genre.id);
        const updatedMovie = { ...movie, genre_ids: genreIds };
        console.log('Favoritando filme (MovieDetails):', updatedMovie);
        return [...prevFavorites, updatedMovie];
      }
    });
  };

  const isMovieFavorited = (movieId) => {
    return favorites.some((fav) => fav.id === movieId);
  };

  if (loading) return <p className="loading">Carregando detalhes...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!movie) return <p className="error">Filme não encontrado.</p>;

  return (
    <div className="movie-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>Voltar</button>
      <div className="movie-details">
        <div className="poster-container">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="movie-details-poster"
          />
          <button
            onClick={() => handleFavorite(movie)}
            className={`favorite-btn ${isMovieFavorited(movie.id) ? 'favorited' : ''}`}
          >
            {isMovieFavorited(movie.id) ? '★ Favoritado' : '☆ Favoritar'}
          </button>
        </div>
        <div className="movie-info">
          <h1 className="movie-details-title">{movie.title}</h1>
          <p className="movie-genres">
            <strong>Gêneros:</strong> {movie.genres.map((genre) => genre.name).join(', ')}
          </p>
          <p className="movie-overview">
            <strong>Sinopse:</strong> {movie.overview || 'Sinopse não disponível.'}
          </p>
          <p className="movie-release">
            <strong>Lançamento:</strong> {new Date(movie.release_date).toLocaleDateString('pt-BR')}
          </p>
          <p className="movie-rating">
            <strong>Avaliação:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;