import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const getPopularMovies = async (page = 1) => {
  const response = await axios.get(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${page}`
  );
  return response.data.results;
};

export const getMovieDetails = async (movieId) => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`);
  return response.data;
};

export const getMovieTrailer = async (movieId) => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=pt-BR`);
  const videos = response.data.results;
  const trailer = videos.find((video) => video.type === 'Trailer' && video.site === 'YouTube');
  return trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0` : null;
};

export const getMoviesByGenres = async (genreIds, page = 1) => {
  if (!genreIds || genreIds.length === 0) return [];
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=${genreIds.join(',')}&sort_by=popularity.desc&page=${page}`;
  console.log('URL da requisição para getMoviesByGenres:', url);
  try {
    const response = await axios.get(url);
    console.log('Resposta bruta da API (getMoviesByGenres):', response.data);
    return response.data.results || [];
  } catch (error) {
    console.error('Erro na chamada getMoviesByGenres:', error.response?.data || error.message);
    return [];
  }
};

export const getRecommendations = async (movieId) => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}&language=pt-BR`);
  return response.data.results;
};