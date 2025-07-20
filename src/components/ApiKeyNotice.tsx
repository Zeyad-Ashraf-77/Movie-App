import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

const ApiKeyNotice = () => {
  return (
    <div className="bg-movie-card border border-primary/20 rounded-lg p-6 mb-8">
      <div className="flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            TMDB API Key Required
          </h3>
          <p className="text-muted-foreground mb-4">
            To see real movie data, you need to get a free API key from The Movie Database (TMDB) 
            and update the API_KEY in <code className="bg-background px-2 py-1 rounded text-sm">src/services/tmdbApi.ts</code>
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="movie"
              asChild
            >
              <a 
                href="https://www.themoviedb.org/settings/api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Get Free API Key
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-border hover:bg-movie-hover"
            >
              <a 
                href="https://developers.themoviedb.org/3/getting-started/introduction" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                API Documentation
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyNotice;