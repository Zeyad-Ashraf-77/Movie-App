import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import {
  getPopularMovies,
  Movie,
} from "@/services/tmdbApi";

const Home = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    loadMovies();
    loadFavorites();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const data = await getPopularMovies();
      setMovies(data.results);
      if (data.results.length > 0) {
        setFeaturedMovie(data.results[0]);
      }
    } catch (error) {
      console.error("Failed to load movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem("movieFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  };

  const toggleFavorite = (movieId: number) => {
    const newFavorites = favorites.includes(movieId)
      ? favorites.filter((id) => id !== movieId)
      : [...favorites, movieId];

    setFavorites(newFavorites);
    localStorage.setItem("movieFavorites", JSON.stringify(newFavorites));
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesYear =
      selectedYear === "all-years" ||
      !selectedYear ||
      movie.release_date.startsWith(selectedYear);

    // Filter by genre
    const genreMap: { [key: string]: number[] } = {
      action: [28],
      comedy: [35],
      drama: [18],
      horror: [27],
      "sci-fi": [878],
    };

    const matchesGenre =
      selectedGenre === "all-genres" ||
      !selectedGenre ||
      (genreMap[selectedGenre] &&
        movie.genre_ids.some((id) => genreMap[selectedGenre].includes(id)));

    return matchesSearch && matchesYear && matchesGenre;
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection movie={featuredMovie} />

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Key Notice */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="search"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-movie-card border-border focus:border-primary h-12"
            />
          </div>

          <div className="flex gap-4">
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-[140px] bg-movie-card border-border h-12">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Genre" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-genres">All Genres</SelectItem>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="comedy">Comedy</SelectItem>
                <SelectItem value="drama">Drama</SelectItem>
                <SelectItem value="horror">Horror</SelectItem>
                <SelectItem value="sci-fi">Sci-Fi</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px] bg-movie-card border-border h-12">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-years">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Movies Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : "Popular Movies"}
            </h2>
            <Button
              variant="outline"
              className="border-border hover:bg-movie-hover"
            >
              View All
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[2/3] bg-movie-card animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favorites.includes(movie.id)}
                />
              ))}
            </div>
          )}

          {!loading && filteredMovies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No movies found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
