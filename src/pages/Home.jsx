import { useState, useEffect } from 'react';
import MovieList from '../components/MovieList';
import { getPopularMovies, getMoviesByGenres } from '../services/tmdb';
import { useAuth } from '../contexts/AuthContext';
import '../styles.css';

function Home() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingMoreRecommended, setLoadingMoreRecommended] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [recommendedPage, setRecommendedPage] = useState(1); // Novo estado para paginação de recomendações
  const { user } = useAuth();

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    console.log('Favoritos carregados:', parsedFavorites);
    return parsedFavorites;
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    console.log('Favoritos salvos:', favorites);
  }, [favorites]);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const movies = await getPopularMovies(1);
        setPopularMovies(movies);
        setLoadingPopular(false);
      } catch (err) {
        setError('Falha ao carregar filmes populares.');
        setLoadingPopular(false);
      }
    };
    fetchPopularMovies();
  }, []);

  const loadMoreMovies = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const newMovies = await getPopularMovies(nextPage);
      setPopularMovies((prevMovies) => [...prevMovies, ...newMovies]);
      setPage(nextPage);
      setLoadingMore(false);
    } catch (err) {
      setError('Falha ao carregar mais filmes.');
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const fetchRecommendedMovies = async (pageToFetch = 1, append = false) => {
      if (!user || favorites.length === 0) {
        console.log('Nenhum usuário ou favoritos, pulando recomendações.');
        setRecommendedMovies([]);
        setLoadingRecommended(false);
        return;
      }
      try {
        console.log('Iniciando fetchRecommendedMovies, append:', append, 'pageToFetch:', pageToFetch);
        setLoadingRecommended(!append); // Só mostra "Carregando..." na primeira carga
        setLoadingMoreRecommended(append); // Mostra "Carregando..." ao carregar mais
        const genreIds = Array.from(
          new Set(favorites.flatMap((movie) => movie.genre_ids || []))
        ).slice(0, 3); // Limita a 3 gêneros
        console.log('Gêneros extraídos dos favoritos (limitados a 3):', genreIds);
        if (genreIds.length > 0) {
          console.log('Chamando getMoviesByGenres com gêneros:', genreIds, 'e página:', pageToFetch);
          const moviesResponse = await getMoviesByGenres(genreIds, pageToFetch);
          console.log('Resposta completa da API:', moviesResponse);
          const movies = moviesResponse.results || moviesResponse;
          console.log('Filmes retornados pela API:', movies);
          const filteredMovies = movies.filter((movie) => {
            const isInFavorites = favorites.some((fav) => {
              const match = fav.id === movie.id;
              console.log(`Comparando IDs - Favorito: ${fav.id}, Filme: ${movie.id}, Match: ${match}`);
              return match;
            });
            return !isInFavorites;
          });
          console.log('Filmes após filtragem (excluindo favoritos):', filteredMovies);
          if (append) {
            setRecommendedMovies((prevMovies) => [...prevMovies, ...filteredMovies]);
          } else {
            setRecommendedMovies(filteredMovies);
          }
        } else {
          console.log('Nenhum genre_id válido encontrado.');
          setRecommendedMovies([]);
        }
        setLoadingRecommended(false);
        setLoadingMoreRecommended(false);
        console.log('Finalizando fetchRecommendedMovies, loadingMoreRecommended:', loadingMoreRecommended);
      } catch (err) {
        console.error('Erro ao carregar recomendações:', err);
        setError('Falha ao carregar filmes recomendados.');
        setLoadingRecommended(false);
        setLoadingMoreRecommended(false);
      }
    };
    fetchRecommendedMovies(1, false);
  }, [favorites, user]);

  const loadMoreRecommendations = async () => {
    console.log('Clicou em Carregar Mais Favoritos, recommendedPage:', recommendedPage);
    const nextPage = recommendedPage + 1;
    await fetchRecommendedMovies(nextPage, true);
    setRecommendedPage(nextPage);
    console.log('Após carregar mais, recommendedPage:', recommendedPage);
  };

  const handleFavorite = (movie) => {
    if (!user) {
      alert('Por favor, faça login para favoritar filmes!');
      return;
    }
    setFavorites((prevFavorites) => {
      const isFavorited = prevFavorites.some((fav) => fav.id === movie.id);
      if (isFavorited) {
        return prevFavorites.filter((fav) => fav.id !== movie.id);
      } else {
        const genreIds = Array.isArray(movie.genre_ids) ? movie.genre_ids : [];
        const updatedMovie = { ...movie, genre_ids: genreIds };
        console.log('Favoritando filme (Home):', updatedMovie);
        return [...prevFavorites, updatedMovie];
      }
    });
  };

  const isFavorited = (movieId) => {
    return favorites.some((fav) => fav.id === movieId);
  };

  return (
    <div className="home-container">
      <h2 className="section-title">Filmes Populares</h2>
      {loadingPopular ? (
        <p className="loading">Carregando filmes populares...</p>
      ) : error && !popularMovies.length ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <MovieList
            movies={popularMovies}
            onFavorite={handleFavorite}
            isFavorited={isFavorited}
          />
          <div className="load-more-container">
            <button
              onClick={loadMoreMovies}
              className="load-more-btn"
              disabled={loadingMore}
            >
              {loadingMore ? 'Carregando...' : 'Carregar Mais'}
            </button>
          </div>
        </>
      )}

      {user && (
        <>
          <h2 className="section-title">Filmes Recomendados</h2>
          {loadingRecommended ? (
            <p className="loading">Carregando filmes recomendados...</p>
          ) : error && !recommendedMovies.length && favorites.length > 0 ? (
            <p className="error">{error}</p>
          ) : recommendedMovies.length > 0 ? (
            <>
              <MovieList
                movies={recommendedMovies}
                onFavorite={handleFavorite}
                isFavorited={isFavorited}
              />
              <div className="load-more-container">
                <button
                  onClick={loadMoreRecommendations}
                  className="load-more-btn"
                  disabled={loadingMoreRecommended}
                >
                  {loadingMoreRecommended ? 'Carregando...' : 'Carregar Mais Favoritos'}
                </button>
              </div>
            </>
          ) : favorites.length === 0 ? (
            <p className="info">Favorite filmes para ver recomendações!</p>
          ) : (
            <p className="info">Nenhuma recomendação disponível no momento.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Home;