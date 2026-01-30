import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MovieDetailContent } from './MovieDetailContent';
import { tmdbClient } from '@/lib/tmdb-client';

interface MovieDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: MovieDetailPageProps): Promise<Metadata> {
  try {
    const movie = await tmdbClient.getMovieDetails(parseInt(params.id));

    return {
      title: `${movie.title} - Cinema Discovery`,
      description: movie.overview || `Watch ${movie.title}`,
    };
  } catch (error) {
    return {
      title: 'Movie Not Found - Cinema Discovery',
    };
  }
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const movieId = parseInt(params.id);

  if (isNaN(movieId)) {
    notFound();
  }

  let initialMovie;
  try {
    initialMovie = await tmdbClient.getMovieDetails(movieId);
  } catch (error) {
    notFound();
  }

  return (
    <Suspense fallback={<MovieDetailSkeleton />}>
      <MovieDetailContent movieId={movieId} initialMovie={initialMovie} />
    </Suspense>
  );
}

function MovieDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[50vh] animate-pulse bg-muted" />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="h-12 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
          <div className="mt-8 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}