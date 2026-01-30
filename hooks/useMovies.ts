'use client';

import { useQuery, useInfiniteQuery, UseQueryResult } from '@tanstack/react-query';
import type { MovieDetails, SortOption } from '@/types';
import { tmdbClient } from '@/lib/tmdb-client';

export function useMovies(sortBy: SortOption = 'release_date.desc') {
  return useInfiniteQuery({
    queryKey: ['movies', sortBy],
    queryFn: async ({ pageParam = 1 }) => {
      return tmdbClient.discoverMovies({
        sortBy,
        page: pageParam,
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useMovieDetails(movieId: number): UseQueryResult<MovieDetails, Error> {
  return useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => tmdbClient.getMovieDetails(movieId),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
}

export function useSearchMovies(query: string, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: ['search', query],
    queryFn: async ({ pageParam = 1 }) => {
      return tmdbClient.searchMovies(query, pageParam);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}