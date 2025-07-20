// TMDB API configuration and service functions
// You'll need to get your API key from https://www.themoviedb.org/settings/api

const API_KEY = 'your_tmdb_api_key_here'; // Replace with your actual API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
  vote_count: number;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string; logo_path: string }[];
  budget: number;
  revenue: number;
  tagline: string;
  imdb_id: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string;
}

export interface Credits {
  cast: Cast[];
  crew: Crew[];
}

// API helper function
const apiCall = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}`);
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
};

// Get trending movies
export const getTrendingMovies = async (): Promise<{ results: Movie[] }> => {
  return apiCall('/trending/movie/week');
};

// Get popular movies
export const getPopularMovies = async (): Promise<{ results: Movie[] }> => {
  return apiCall('/movie/popular');
};

// Get top rated movies
export const getTopRatedMovies = async (): Promise<{ results: Movie[] }> => {
  return apiCall('/movie/top_rated');
};

// Get upcoming movies
export const getUpcomingMovies = async (): Promise<{ results: Movie[] }> => {
  return apiCall('/movie/upcoming');
};

// Get movie details
export const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  return apiCall(`/movie/${movieId}`);
};

// Get movie credits (cast and crew)
export const getMovieCredits = async (movieId: number): Promise<Credits> => {
  return apiCall(`/movie/${movieId}/credits`);
};

// Get similar movies
export const getSimilarMovies = async (movieId: number): Promise<{ results: Movie[] }> => {
  return apiCall(`/movie/${movieId}/similar`);
};

// Search movies
export const searchMovies = async (query: string): Promise<{ results: Movie[] }> => {
  const encodedQuery = encodeURIComponent(query);
  return apiCall(`/search/movie?query=${encodedQuery}`);
};

// Get movie genres
export const getGenres = async (): Promise<{ genres: { id: number; name: string }[] }> => {
  return apiCall('/genre/movie/list');
};

// Discover movies with filters
export const discoverMovies = async (params: {
  genre?: number;
  year?: number;
  sortBy?: string;
  page?: number;
}): Promise<{ results: Movie[] }> => {
  const searchParams = new URLSearchParams();
  
  if (params.genre) searchParams.append('with_genres', params.genre.toString());
  if (params.year) searchParams.append('year', params.year.toString());
  if (params.sortBy) searchParams.append('sort_by', params.sortBy);
  if (params.page) searchParams.append('page', params.page.toString());
  
  const queryString = searchParams.toString();
  return apiCall(`/discover/movie${queryString ? `&${queryString}` : ''}`);
};

// Get image URL
export const getImageUrl = (path: string, size: string = 'w500'): string => {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : '';
};

// Mock data for development (remove when you have API key)
export const getMockTrendingMovies = (): Promise<{ results: Movie[] }> => {
  const mockMovies: Movie[] = [
    {
      id: 1,
      title: "Avengers: Endgame",
      overview: "After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos.",
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
    },
    {
      id: 2,
      title: "The Dark Knight",
      overview: "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop_path: "/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
      release_date: "2008-07-18",
      vote_average: 9.0,
      genre_ids: [18, 28, 80, 53],
      adult: false,
      original_language: "en",
      original_title: "The Dark Knight",
      popularity: 75.123,
      video: false,
      vote_count: 25000
    }
  ];
  
  return Promise.resolve({ results: mockMovies });
};