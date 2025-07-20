import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import TrendingMovies from "./pages/TrendingMovies";
import TopRatedMovies from "./pages/TopRatedMovies";
import UpcomingMovies from "./pages/UpcomingMovies";
import SearchMovies from "./pages/SearchMovies";
import TVShows from "./pages/TVShows";
import Favorites from "./pages/Favorites";
import MovieDetails from "./pages/MovieDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/trending" element={<TrendingMovies />} />
            <Route path="/top-rated" element={<TopRatedMovies />} />
            <Route path="/upcoming" element={<UpcomingMovies />} />
            <Route path="/search" element={<SearchMovies />} />
            <Route path="/tv-shows" element={<TVShows />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
