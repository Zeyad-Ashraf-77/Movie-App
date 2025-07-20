import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  Home,
  Film,
  Tv,
  Heart,
  TrendingUp,
  Star,
  Calendar,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoviesDropdownOpen, setIsMoviesDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMoviesDropdownOpen &&
        !(event.target as Element).closest(".movies-dropdown")
      ) {
        setIsMoviesDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMoviesDropdownOpen]);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Favorites", href: "/favorites", icon: Heart },
  ];

  const movieItems = [
    { name: "All Movies", href: "/movies", icon: Film },
    { name: "Trending", href: "/trending", icon: TrendingUp },
    { name: "Top Rated", href: "/top-rated", icon: Star },
    { name: "Upcoming", href: "/upcoming", icon: Calendar },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-2xl font-bold text-primary">
              Watchly
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </div>
                </NavLink>
              ))}

              {/* Movies Dropdown */}
              <div className="relative movies-dropdown">
                <button
                  onClick={() => setIsMoviesDropdownOpen(!isMoviesDropdownOpen)}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 text-foreground/80 hover:text-primary hover:bg-primary/5 flex items-center gap-2"
                >
                  <Film className="w-4 h-4" />
                  Movies
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isMoviesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-movie-card border border-border rounded-lg shadow-lg z-50">
                    {movieItems.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-300 ${
                            isActive
                              ? "text-primary bg-primary/10"
                              : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                          }`
                        }
                        onClick={() => setIsMoviesDropdownOpen(false)}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/search"
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 text-foreground/80 hover:text-primary hover:bg-primary/5 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}

            {/* Movies Section */}
            <div className="px-3 py-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Movies
              </h3>
              <div className="space-y-1">
                {movieItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="px-3 py-2">
              <NavLink
                to="/search"
                className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 text-foreground/80 hover:text-primary hover:bg-primary/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Search className="w-5 h-5" />
                Search Movies
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
