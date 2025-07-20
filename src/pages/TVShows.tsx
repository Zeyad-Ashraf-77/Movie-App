import { Tv } from 'lucide-react';

const TVShows = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Tv className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">TV Shows</h1>
        </div>

        <div className="text-center py-16">
          <Tv className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            TV Shows section is under development. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TVShows;