'use client';

import { useEffect, useState } from 'react';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { MovieCard, MovieCardSkeleton } from './MovieCard';
import { useMovies } from '@/hooks/useMovies';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import type { SortOption } from '@/types';
import { cn } from '@/lib/utils';

interface MovieListProps {
  sortBy: SortOption;
}

export function MovieList({ sortBy }: MovieListProps) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useMovies(sortBy);

  const [loadMoreRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: '100px',
  });

  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    let startY = 0;
    let currentY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].pageY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && startY > 0) {
        currentY = e.touches[0].pageY;
        const distance = currentY - startY;
        
        if (distance > 0 && distance < 150) {
          setPullDistance(distance);
        }
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance > 80) {
        setIsPullRefreshing(true);
        await refetch();
        setTimeout(() => {
          setIsPullRefreshing(false);
          setPullDistance(0);
        }, 500);
      } else {
        setPullDistance(0);
      }
      startY = 0;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, refetch]);

  const movies = data?.pages.flatMap((page) => page.results) ?? [];

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-bold">Failed to load movies</h2>
        <p className="text-muted-foreground">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'fixed left-0 right-0 top-0 z-50 flex items-center justify-center bg-primary/10 backdrop-blur-sm transition-all',
          pullDistance > 0 ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          height: `${Math.min(pullDistance, 80)}px`,
        }}
      >
        <RefreshCw
          className={cn(
            'h-6 w-6 text-primary transition-transform',
            isPullRefreshing && 'animate-spin',
            pullDistance > 80 && 'rotate-180'
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <MovieCardSkeleton key={i} />)
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>

      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="flex items-center justify-center py-8"
        >
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading more movies...</span>
            </div>
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Load More
            </button>
          )}
        </div>
      )}

      {!hasNextPage && movies.length > 0 && (
        <div className="py-8 text-center text-muted-foreground">
          You&apos;ve reached the end! 🎬
        </div>
      )}

      {!isLoading && movies.length === 0 && (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <p className="text-xl text-muted-foreground">No movies found</p>
        </div>
      )}
    </>
  );
}