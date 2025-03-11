import { useState } from 'react';

function MovieCard({ movie, onFavorite }) {
    const [isFavorite, setIsFavorite] = useState(false);

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
        onFavorite(movie);
    };

    return (
        <div className="movie-card">
            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
            <h3>{movie.title}</h3>
            <button onClick={handleFavorite}>{isFavorite? 'Remover dos favoritos' : 'Adicionar aos favorito'}</button>
      </div>
    );
}

export default MovieCard;