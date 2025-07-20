import { useState, useEffect } from 'react';
import MovieCard from '@/components/MovieCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Film } from 'lucide-react';
import { getPopularMovies, Movie } from '@/services/tmdbApi';

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popularity.desc');

  useEffect(() => {
    loadMovies();
    loadFavorites();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const data = await getPopularMovies();
      setMovies(data.results);
    } catch (error) {
      console.error('Failed to load movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('movieFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  };

  const toggleFavorite = (movieId: number) => {
    const newFavorites = favorites.includes(movieId)
      ? favorites.filter(id => id !== movieId)
      : [...favorites, movieId];
    
    setFavorites(newFavorites);
    localStorage.setItem('movieFavorites', JSON.stringify(newFavorites));
  };

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = selectedYear === 'all-years' || !selectedYear || movie.release_date.startsWith(selectedYear);
    
    // Filter by genre
    const genreMap: { [key: string]: number[] } = {
      'action': [28],
      'adventure': [12],
      'comedy': [35],
      'drama': [18],
      'horror': [27],
      'sci-fi': [878],
      'thriller': [53]
    };
    
    const matchesGenre = selectedGenre === 'all-genres' || 
      !selectedGenre || 
      (genreMap[selectedGenre] && movie.genre_ids.some(id => genreMap[selectedGenre].includes(id)));
    
    return matchesSearch && matchesYear && matchesGenre;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case 'title.asc':
        return a.title.localeCompare(b.title);
      case 'title.desc':
        return b.title.localeCompare(a.title);
      case 'release_date.desc':
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
      case 'release_date.asc':
        return new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
      case 'vote_average.desc':
        return b.vote_average - a.vote_average;
      case 'vote_average.asc':
        return a.vote_average - b.vote_average;
      default:
        return b.popularity - a.popularity;
    }
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Film className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">All Movies</h1>
        </div>

        {/* Search and Filters */}
        <div className="bg-movie-card rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="search"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-background border-border focus:border-primary h-12"
              />
            </div>
            
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="bg-background border-border h-12">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Genre" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-genres">All Genres</SelectItem>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="comedy">Comedy</SelectItem>
                <SelectItem value="drama">Drama</SelectItem>
                <SelectItem value="horror">Horror</SelectItem>
                <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                <SelectItem value="thriller">Thriller</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="bg-background border-border h-12">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-years">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-background border-border h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity.desc">Most Popular</SelectItem>
                <SelectItem value="vote_average.desc">Highest Rated</SelectItem>
                <SelectItem value="release_date.desc">Newest First</SelectItem>
                <SelectItem value="release_date.asc">Oldest First</SelectItem>
                <SelectItem value="title.asc">Title A-Z</SelectItem>
                <SelectItem value="title.desc">Title Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            {searchQuery 
              ? `Search Results for "${searchQuery}" (${sortedMovies.length} found)`
              : `All Movies (${sortedMovies.length} movies)`
            }
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 24 }).map((_, index) => (
              <div key={index} className="aspect-[2/3] bg-movie-card animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {sortedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onToggleFavorite={toggleFavorite}
                isFavorite={favorites.includes(movie.id)}
              />
            ))}
          </div>
        )}

        {!loading && sortedMovies.length === 0 && (
          <div className="text-center py-16">
            <Film className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No movies found</h2>
            <p className="text-muted-foreground">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;