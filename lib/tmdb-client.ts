import type { MoviesResponse, MovieDetails, SortOption, TMDBError } from '@/types';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY!;
const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL!;

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

class TMDBClient {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = TMDB_BASE_URL;
    this.apiKey = TMDB_API_KEY;

    if (!this.apiKey) {
      throw new Error('TMDB API key is required');
    }
  }

  private async fetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    url.searchParams.append('api_key', this.apiKey);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString(), {
        next: {
          revalidate: 3600,
        },
      });

      if (!response.ok) {
        const error: TMDBError = await response.json();
        throw new Error(error.status_message || 'Failed to fetch from TMDB');
      }

      return response.json();
    } catch (error) {
      console.error('TMDB API Error:', error);
      throw error;
    }
  }

  async discoverMovies(options: {
    sortBy?: SortOption;
    page?: number;
    releaseDateLte?: string;
  } = {}): Promise<MoviesResponse> {
    const {
      sortBy = 'release_date.desc',
      page = 1,
      releaseDateLte = new Date().toISOString().split('T')[0],
    } = options;

    return this.fetch<MoviesResponse>('/discover/movie', {
      sort_by: sortBy,
      page: page.toString(),
      'primary_release_date.lte': releaseDateLte,
      'vote_count.gte': '10',
    });
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.fetch<MovieDetails>(`/movie/${movieId}`);
  }

  async searchMovies(query: string, page: number = 1): Promise<MoviesResponse> {
    return this.fetch<MoviesResponse>('/search/movie', {
      query,
      page: page.toString(),
    });
  }

  getImageURL(path: string | null, size: 'w200' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!path) return '/placeholder-movie.svg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }

  formatRuntime(minutes: number | null): string {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

export const tmdbClient = new TMDBClient();

export const getImageURL = (path: string | null, size?: 'w200' | 'w500' | 'w780' | 'original') =>
  tmdbClient.getImageURL(path, size);

export const formatRuntime = (minutes: number | null) => tmdbClient.formatRuntime(minutes);

export const formatDate = (dateString: string) => tmdbClient.formatDate(dateString);