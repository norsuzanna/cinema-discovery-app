'use client';

import { useState } from 'react';
import { Film } from 'lucide-react';
import { MovieList } from '@/components/MovieList';
import { SortDropdown } from '@/components/SortDropdown';
import type { SortOption } from '@/types';

export default function HomePage() {
  const [sortBy, setSortBy] = useState<SortOption>('release_date.desc');

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Film className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              Cinema Discovery
            </h1>
          </div>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <MovieList sortBy={sortBy} />
      </div>

      <footer className="border-t border-border bg-muted/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by The Movie Database (TMDB)</p>
          <p className="mt-2">© 2026 Cinema Discovery. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}