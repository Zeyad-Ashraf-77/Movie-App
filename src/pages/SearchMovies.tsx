import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import { Search, Search as SearchIcon } from "lucide-react";
import { searchMovies, Movie } from "@/services/tmdbApi";

const SearchMovies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popularity.desc");

  useEffect(() => {
    loadFavorites();
    if (searchQuery) {
      performSearch();
    }
  }, []);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const data = await searchMovies(searchQuery);
      setMovies(data.results);
      setSearchParams({ q: searchQuery });
    } catch (error) {
      console.error("Failed to search movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
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
    const matchesYear =
      selectedYear === "all-years" ||
      !selectedYear ||
      movie.release_date.startsWith(selectedYear);
    return matchesYear;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case "title.asc":
        return a.title.localeCompare(b.title);
      case "title.desc":
        return b.title.localeCompare(a.title);
      case "release_date.desc":
        return (
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime()
        );
      case "release_date.asc":
        return (
          new Date(a.release_date).getTime() -
          new Date(b.release_date).getTime()
        );
      case "vote_average.desc":
        return b.vote_average - a.vote_average;
      case "vote_average.asc":
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
          <SearchIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Search Movies</h1>
        </div>

        {/* Search Form */}
        <div className="bg-movie-card rounded-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="search"
                  placeholder="Search for movies, actors, directors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-background border-border focus:border-primary h-12"
                />
              </div>
              <Button
                type="submit"
                className="h-12 px-8 bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </form>
        </div>

        {/* Filters */}
        {movies.length > 0 && (
          <div className="bg-movie-card rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="bg-background border-border h-12">
                  <SelectValue placeholder="Filter by Year" />
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

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-background border-border h-12">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity.desc">Most Popular</SelectItem>
                  <SelectItem value="vote_average.desc">
                    Highest Rated
                  </SelectItem>
                  <SelectItem value="release_date.desc">
                    Newest First
                  </SelectItem>
                  <SelectItem value="release_date.asc">Oldest First</SelectItem>
                  <SelectItem value="title.asc">Title A-Z</SelectItem>
                  <SelectItem value="title.desc">Title Z-A</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSelectedYear("");
                  setSortBy("popularity.desc");
                }}
                className="h-12 border-border hover:bg-movie-hover"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {loading
                ? "Searching..."
                : `Search Results for "${searchQuery}" (${sortedMovies.length} found)`}
            </h2>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[2/3] bg-movie-card animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        ) : searchQuery && sortedMovies.length > 0 ? (
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
        ) : searchQuery && !loading ? (
          <div className="text-center py-16">
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No movies found
            </h2>
            <p className="text-muted-foreground mb-4">
              No movies found for "{searchQuery}". Try different keywords.
            </p>
            <Button
              onClick={() => setSearchQuery("")}
              className="bg-primary hover:bg-primary/90"
            >
              Clear Search
            </Button>
          </div>
        ) : !searchQuery ? (
          <div className="text-center py-16">
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Search for Movies
            </h2>
            <p className="text-muted-foreground">
              Enter a movie title, actor name, or director to start searching.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchMovies;
