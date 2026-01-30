import type { AnalyticsEvent } from '@/types';

class Analytics {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = typeof window !== 'undefined';
  }

  trackPageView(url: string): void {
    if (!this.isEnabled) return;

    this.track({
      event: 'page_view',
      category: 'navigation',
      label: url,
    });
  }

  track(event: AnalyticsEvent): void {
    if (!this.isEnabled) return;

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event);
    }

    if (typeof window !== 'undefined' && 'gtag' in window) {
      // @ts-ignore
      window.gtag('event', event.event, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }
  }

  trackMovieView(movieId: number, movieTitle: string): void {
    this.track({
      event: 'movie_view',
      category: 'engagement',
      label: movieTitle,
      value: movieId,
    });
  }

  trackBookingClick(movieId: number, movieTitle: string): void {
    this.track({
      event: 'booking_click',
      category: 'conversion',
      label: movieTitle,
      value: movieId,
    });
  }

  trackSort(sortOption: string): void {
    this.track({
      event: 'sort_change',
      category: 'engagement',
      label: sortOption,
    });
  }

  trackError(error: Error, context?: string): void {
    this.track({
      event: 'error',
      category: 'error',
      label: `${context ? context + ': ' : ''}${error.message}`,
    });

    console.error('[Error]', context, error);
  }

  trackPWAInstall(): void {
    this.track({
      event: 'pwa_install',
      category: 'engagement',
      label: 'PWA installed',
    });
  }

  trackOfflineUsage(): void {
    this.track({
      event: 'offline_usage',
      category: 'engagement',
      label: 'App used offline',
    });
  }
}

export const analytics = new Analytics();

export const trackPageView = (url: string) => analytics.trackPageView(url);
export const trackMovieView = (movieId: number, movieTitle: string) =>
  analytics.trackMovieView(movieId, movieTitle);
export const trackBookingClick = (movieId: number, movieTitle: string) =>
  analytics.trackBookingClick(movieId, movieTitle);
export const trackSort = (sortOption: string) => analytics.trackSort(sortOption);
export const trackError = (error: Error, context?: string) =>
  analytics.trackError(error, context);
export const trackPWAInstall = () => analytics.trackPWAInstall();
export const trackOfflineUsage = () => analytics.trackOfflineUsage();