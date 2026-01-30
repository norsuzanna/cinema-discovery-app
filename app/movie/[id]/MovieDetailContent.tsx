'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  Star,
  Ticket,
  AlertCircle,
} from 'lucide-react';
import type { MovieDetails } from '@/types';
import { useMovieDetails } from '@/hooks/useMovies';
import { getImageURL, formatRuntime, formatDate } from '@/lib/tmdb-client';
import { cn, getRatingColor, formatNumber } from '@/lib/utils';
import { trackMovieView, trackBookingClick } from '@/lib/analytics';

interface MovieDetailContentProps {
  movieId: number;
  initialMovie: MovieDetails;
}

export function MovieDetailContent({ movieId, initialMovie }: MovieDetailContentProps) {
  const { data: movie = initialMovie, isLoading, error } = useMovieDetails(movieId);

  useEffect(() => {
    if (movie) {
      trackMovieView(movie.id, movie.title);
    }
  }, [movie]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <AlertCircle className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-bold">Failed to load movie details</h2>
        <p className="text-muted-foreground">{error.message}</p>
        <Link
          href="/"
          className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const backdropUrl = getImageURL(movie.backdrop_path, 'original');
  const posterUrl = getImageURL(movie.poster_path, 'w500');
  const rating = movie.vote_average.toFixed(1);
  const ratingColor = getRatingColor(movie.vote_average);

  const handleBookClick = () => {
    trackBookingClick(movie.id, movie.title);
    window.location.href = 'https://www.google.com/';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[50vh] overflow-hidden">
        {movie.backdrop_path && (
          <>
            <Image
              src={backdropUrl}
              alt={movie.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </>
        )}

        <Link
          href="/"
          className="absolute left-4 top-4 flex items-center gap-2 rounded-lg bg-black/50 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <div className="relative mx-auto aspect-[2/3] w-full max-w-[300px] overflow-hidden rounded-lg shadow-2xl lg:mx-0">
            <Image
              src={posterUrl}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 300px"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground">{movie.title}</h1>
              {movie.tagline && (
                <p className="mt-2 text-lg italic text-muted-foreground">"{movie.tagline}"</p>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className={cn('h-5 w-5 fill-current', ratingColor)} />
                <span className={cn('font-bold', ratingColor)}>
                  {rating}
                </span>
                <span className="text-muted-foreground">
                  ({formatNumber(movie.vote_count)} votes)
                </span>
              </div>

              {movie.release_date && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>
              )}

              {movie.runtime && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}

              {movie.spoken_languages.length > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-5 w-5" />
                  <span>{movie.spoken_languages[0].english_name}</span>
                </div>
              )}
            </div>

            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-foreground">Synopsis</h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {movie.overview || 'No synopsis available.'}
              </p>
            </div>

            <button
              onClick={handleBookClick}
              className="flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
            >
              <Ticket className="h-6 w-6" />
              <span>Book Tickets</span>
            </button>

            <div className="grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold text-foreground">Status</h3>
                <p className="mt-1 text-muted-foreground">{movie.status}</p>
              </div>

              {movie.budget > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground">Budget</h3>
                  <p className="mt-1 text-muted-foreground">
                    ${movie.budget.toLocaleString()}
                  </p>
                </div>
              )}

              {movie.revenue > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground">Revenue</h3>
                  <p className="mt-1 text-muted-foreground">
                    ${movie.revenue.toLocaleString()}
                  </p>
                </div>
              )}

              {movie.homepage && (
                <div>
                  <h3 className="font-semibold text-foreground">Official Website</h3>
                  <a
                    href={movie.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}