import { useState, useEffect } from 'react';
import MovieCard from '@/components/MovieCard';
import { Heart } from 'lucide-react';
import { Movie } from '@/services/tmdbApi';

const Favorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('movieFavorites');
    if (savedFavorites) {
      const favoriteIds = JSON.parse(savedFavorites);
      setFavorites(favoriteIds);
      
      // Mock favorite movies - in real app, fetch from API
      const mockFavoriteMovies: Movie[] = [
        {
          id: 1,
          title: "Avengers: Endgame",
          overview: "After the devastating events of Avengers: Infinity War...",
          poster_path: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
          backdrop_path: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
          release_date: "2019-04-24",
          vote_average: 8.3,
          genre_ids: [12, 878, 28],
          adult: false,
          original_language: "en",
          original_title: "Avengers: Endgame",
          popularity: 84.482,
          video: false,
          vote_count: 20000
        }
      ].filter(movie => favoriteIds.includes(movie.id));
      
      setFavoriteMovies(mockFavoriteMovies);
    }
    setLoading(false);
  };

  const removeFavorite = (movieId: number) => {
    const newFavorites = favorites.filter(id => id !== movieId);
    setFavorites(newFavorites);
    setFavoriteMovies(favoriteMovies.filter(movie => movie.id !== movieId));
    localStorage.setItem('movieFavorites', JSON.stringify(newFavorites));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-primary fill-primary" />
          <h1 className="text-3xl font-bold text-foreground">Your Favorites</h1>
        </div>

        {favoriteMovies.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Start adding movies to your favorites to see them here!
            </p>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow h-10 px-4 py-2"
            >
              Browse Movies
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {favoriteMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onToggleFavorite={removeFavorite}
                isFavorite={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;