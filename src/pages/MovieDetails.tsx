import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Heart, Play, ArrowLeft, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import MovieCard from "@/components/MovieCard";
import {
  Movie,
  MovieDetails as MovieDetailsType,
  Credits,
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
} from "@/services/tmdbApi";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      loadMovieDetails(parseInt(id));
      checkFavoriteStatus(parseInt(id));
    }
  }, [id]);

  const loadMovieDetails = async (movieId: number) => {
    try {
      setLoading(true);

      // Load movie details, credits, and similar movies in parallel
      const [movieData, creditsData, similarData] = await Promise.all([
        getMovieDetails(movieId),
        getMovieCredits(movieId),
        getSimilarMovies(movieId),
      ]);

      setMovie(movieData);
      setCredits(creditsData);
      setSimilarMovies(similarData.results);
    } catch (error) {
      console.error("Failed to load movie details:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = (movieId: number) => {
    const favorites = JSON.parse(
      localStorage.getItem("movieFavorites") || "[]"
    );
    setIsFavorite(favorites.includes(movieId));
  };

  const toggleFavorite = () => {
    if (!movie) return;

    const favorites = JSON.parse(
      localStorage.getItem("movieFavorites") || "[]"
    );
    const newFavorites = isFavorite
      ? favorites.filter((id: number) => id !== movie.id)
      : [...favorites, movie.id];

    localStorage.setItem("movieFavorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  if (loading || !movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading movie details...</p>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "";
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";
  const rating = movie.vote_average
    ? Math.round(movie.vote_average * 10) / 10
    : 0;
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "";

  const director = credits?.crew.find((person) => person.job === "Director");
  const mainCast = credits?.cast.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[90vh] overflow-hidden">
        {backdropUrl && (
          <div className="absolute inset-0">
            <img
              src={backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover opacity-30"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6 hover:bg-movie-hover"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Poster */}
              <div className="flex-shrink-0">
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="w-64 h-96 object-cover rounded-lg shadow-movie"
                />
              </div>

              {/* Movie Info */}
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  {movie.title}
                </h1>

                {movie.tagline && (
                  <p className="text-xl text-muted-foreground mb-6 italic">
                    "{movie.tagline}"
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-6 mb-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{year}</span>
                  </div>
                  {runtime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{runtime}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-rating-gold text-rating-gold" />
                    <span className="text-foreground font-medium">
                      {rating}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-movie-card text-foreground text-sm rounded-full border border-border"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                  {movie.overview}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Button
                    variant="hero"
                    size="hero"
                    onClick={() => {
                      // يمكن إضافة رابط الفيلم هنا أو فتح في نافذة جديدة
                      if (movie.imdb_id) {
                        window.open(
                          `https://www.imdb.com/title/${movie.imdb_id}`,
                          "_blank"
                        );
                      } else {
                        alert(
                          "Sorry, this movie is not available for streaming yet."
                        );
                      }
                    }}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Now
                  </Button>
                  <Button
                    variant={isFavorite ? "default" : "outline"}
                    size="hero"
                    onClick={toggleFavorite}
                    className={
                      isFavorite ? "" : "border-border hover:bg-movie-hover"
                    }
                  >
                    <Heart
                      className={`w-5 h-5 mr-2 ${
                        isFavorite ? "fill-current" : ""
                      }`}
                    />
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast and Crew */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Cast & Crew
          </h2>

          {director && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Director
              </h3>
              <p className="text-muted-foreground">{director.name}</p>
            </div>
          )}

          <h3 className="text-lg font-semibold text-foreground mb-4">
            Top Cast
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mainCast.map((actor) => (
              <div key={actor.id} className="text-center">
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : "/placeholder.svg"
                  }
                  alt={actor.name}
                  className="w-full aspect-[2/3] object-cover rounded-lg mb-2 bg-movie-card"
                />
                <h4 className="font-semibold text-foreground text-sm">
                  {actor.name}
                </h4>
                <p className="text-muted-foreground text-xs">
                  {actor.character}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Similar Movies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {similarMovies.map((similarMovie) => (
                <MovieCard
                  key={similarMovie.id}
                  movie={similarMovie}
                  onToggleFavorite={() => {}}
                  isFavorite={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
