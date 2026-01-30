'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import type { Movie, SortOption } from '@/types';

interface MoviesState {
  movies: Movie[];
  sortBy: SortOption;
  page: number;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
}

type MoviesAction =
  | { type: 'SET_MOVIES'; payload: Movie[] }
  | { type: 'APPEND_MOVIES'; payload: Movie[] }
  | { type: 'SET_SORT'; payload: SortOption }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'INCREMENT_PAGE' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

const initialState: MoviesState = {
  movies: [],
  sortBy: 'release_date.desc',
  page: 1,
  isLoading: false,
  hasMore: true,
  error: null,
};

function moviesReducer(state: MoviesState, action: MoviesAction): MoviesState {
  switch (action.type) {
    case 'SET_MOVIES':
      return {
        ...state,
        movies: action.payload,
        error: null,
      };

    case 'APPEND_MOVIES':
      return {
        ...state,
        movies: [...state.movies, ...action.payload],
        error: null,
      };

    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.payload,
        page: 1,
        movies: [],
      };

    case 'SET_PAGE':
      return {
        ...state,
        page: action.payload,
      };

    case 'INCREMENT_PAGE':
      return {
        ...state,
        page: state.page + 1,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_HAS_MORE':
      return {
        ...state,
        hasMore: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

interface MoviesContextValue extends MoviesState {
  setMovies: (movies: Movie[]) => void;
  appendMovies: (movies: Movie[]) => void;
  setSortBy: (sortBy: SortOption) => void;
  setPage: (page: number) => void;
  incrementPage: () => void;
  setLoading: (isLoading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const MoviesContext = createContext<MoviesContextValue | undefined>(undefined);

interface MoviesProviderProps {
  children: ReactNode;
}

export function MoviesProvider({ children }: MoviesProviderProps) {
  const [state, dispatch] = useReducer(moviesReducer, initialState);

  const setMovies = useCallback((movies: Movie[]) => {
    dispatch({ type: 'SET_MOVIES', payload: movies });
  }, []);

  const appendMovies = useCallback((movies: Movie[]) => {
    dispatch({ type: 'APPEND_MOVIES', payload: movies });
  }, []);

  const setSortBy = useCallback((sortBy: SortOption) => {
    dispatch({ type: 'SET_SORT', payload: sortBy });
  }, []);

  const setPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  const incrementPage = useCallback(() => {
    dispatch({ type: 'INCREMENT_PAGE' });
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  }, []);

  const setHasMore = useCallback((hasMore: boolean) => {
    dispatch({ type: 'SET_HAS_MORE', payload: hasMore });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const value: MoviesContextValue = {
    ...state,
    setMovies,
    appendMovies,
    setSortBy,
    setPage,
    incrementPage,
    setLoading,
    setHasMore,
    setError,
    reset,
  };

  return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>;
}

export function useMoviesContext() {
  const context = useContext(MoviesContext);

  if (context === undefined) {
    throw new Error('useMoviesContext must be used within a MoviesProvider');
  }

  return context;
}