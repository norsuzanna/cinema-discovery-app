'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar } from 'lucide-react';
import type { Movie } from '@/types';
import { getImageURL } from '@/lib/tmdb-client';
import { cn, formatNumber, getRatingColor } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const imageUrl = getImageURL(movie.poster_path, 'w500');
  const rating = movie.vote_average.toFixed(1);
  const ratingColor = getRatingColor(movie.vote_average);

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative overflow-hidden rounded-lg bg-card transition-all duration-300 hover:scale-105 hover:shadow-2xl"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 backdrop-blur-sm">
          <Star className={cn('h-4 w-4 fill-current', ratingColor)} />
          <span className={cn('text-sm font-bold', ratingColor)}>{rating}</span>
        </div>

        <div className="absolute left-2 top-2 rounded-full bg-primary/90 px-2 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
          {formatNumber(Math.round(movie.popularity))} 🔥
        </div>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
          {movie.title}
        </h3>
        
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <time dateTime={movie.release_date}>
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
          </time>
        </div>

        {movie.overview && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
            {movie.overview}
          </p>
        )}
      </div>
    </Link>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-card">
      <div className="relative aspect-[2/3] w-full animate-pulse bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}