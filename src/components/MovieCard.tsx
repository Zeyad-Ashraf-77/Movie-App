import { useState } from 'react';
import { Heart, Star, Play, Film } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
}

interface MovieCardProps {
  movie: Movie;
  onToggleFavorite?: (movieId: number) => void;
  isFavorite?: boolean;
}

const MovieCard = ({ movie, onToggleFavorite, isFavorite = false }: MovieCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder.svg';

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : 0;

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="group relative cursor-pointer">
      <div 
        className="bg-movie-card rounded-lg overflow-hidden shadow-movie transition-all duration-300 hover:shadow-glow hover:scale-105"
        onClick={handleCardClick}
      >
        {/* Movie Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={movie.title}
            className={`w-full h-full object-cover transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-110`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-movie-hover animate-pulse flex items-center justify-center">
              <Film className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button variant="movie" size="icon" className="rounded-full">
              <Play className="w-5 h-5" />
            </Button>
          </div>

          {/* Favorite button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(movie.id);
            }}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-primary text-primary' : 'text-white'}`} />
          </Button>
        </div>

        {/* Movie Info */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{year}</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-rating-gold text-rating-gold" />
              <span className="text-foreground font-medium">{rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;