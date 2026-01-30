export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  video: boolean;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number | null;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  homepage: string | null;
  imdb_id: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface TMDBError {
  status_code: number;
  status_message: string;
  success: boolean;
}

export type SortOption = 'release_date.desc' | 'release_date.asc' | 'title.asc' | 'title.desc' | 'vote_average.desc';

export interface SortOptionConfig {
  value: SortOption;
  label: string;
}

export interface MovieFilters {
  sortBy: SortOption;
  page: number;
}

export interface CachedMovie {
  data: MovieDetails;
  timestamp: number;
}

export interface CachedMovies {
  data: MoviesResponse;
  timestamp: number;
  filters: MovieFilters;
}

export interface MovieCardProps {
  movie: Movie;
}

export interface MovieListProps {
  initialMovies?: Movie[];
}

export interface MovieDetailProps {
  params: {
    id: string;
  };
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface AnalyticsEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
}