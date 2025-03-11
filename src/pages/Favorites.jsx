import { useState, useEffect } from 'react';
import MovieList from '../components/MovieList';
import { useAuth } from '../contexts/AuthContext';
import '../styles.css';

function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleFavorite = (movie) => {
    if (!user) {
      alert('Por favor, faça login para gerenciar favoritos!');
      return;
    }
    setFavorites((prevFavorites) => {
      const isFavorited = prevFavorites.some((fav) => fav.id === movie.id);
      if (isFavorited) {
        return prevFavorites.filter((fav) => fav.id !== movie.id);
      } else {
        const genreIds = Array.isArray(movie.genre_ids) ? movie.genre_ids : [];
        const updatedMovie = { ...movie, genre_ids: genreIds };
        return [...prevFavorites, updatedMovie];
      }
    });
  };

  const isFavorited = (movieId) => {
    return favorites.some((fav) => fav.id === movieId);
  };

  if (!user) {
    return (
      <div className="home-container">
        <h2 className="section-title">Favoritos</h2>
        <p className="info">Faça login para ver seus filmes favoritos!</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h2 className="section-title">Favoritos</h2>
      {favorites.length > 0 ? (
        <MovieList
          movies={favorites}
          onFavorite={handleFavorite}
          isFavorited={isFavorited}
        />
      ) : (
        <p className="info">Você ainda não tem filmes favoritados.</p>
      )}
    </div>
  );
}

export default Favorites;