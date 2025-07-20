import { useState, useEffect } from 'react';
import { Play, Info, Star } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
}

interface HeroSectionProps {
  movie?: Movie;
}

const HeroSection = ({ movie }: HeroSectionProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  if (!movie) {
    return (
      <div className="relative h-[70vh] bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading featured movie...</p>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : '';

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const rating = movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : 0;

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Background Image */}
      {backdropUrl && (
        <div className="absolute inset-0">
          <img
            src={backdropUrl}
            alt={movie.title}
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              imageLoaded ? 'opacity-40' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="mb-4 animate-fade-in">
              <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full border border-primary/30">
                Featured Movie
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {movie.title}
            </h1>

            <div className="flex items-center gap-4 mb-6 text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <span>{year}</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-rating-gold text-rating-gold" />
                <span className="text-foreground font-medium">{rating}</span>
              </div>
            </div>

            <p className="text-lg text-muted-foreground mb-8 line-clamp-3 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              {movie.overview}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <Button 
                variant="hero" 
                size="hero"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Now
              </Button>
              <Button 
                variant="outline" 
                size="hero"
                className="border-border hover:bg-movie-hover"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <Info className="w-5 h-5 mr-2" />
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;