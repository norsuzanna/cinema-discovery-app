import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  getRatingColor,
  cn,
} from '../lib/utils';

describe('Utils', () => {
  describe('formatNumber', () => {
    it('should format large numbers with K suffix', () => {
      expect(formatNumber(1500)).toBe('1.5K');
      expect(formatNumber(50000)).toBe('50.0K');
    });

    it('should format millions with M suffix', () => {
      expect(formatNumber(1500000)).toBe('1.5M');
    });

    it('should return original number if less than 1000', () => {
      expect(formatNumber(500)).toBe('500');
    });
  });

  describe('getRatingColor', () => {
    it('should return green for high ratings', () => {
      expect(getRatingColor(8.5)).toBe('text-green-500');
      expect(getRatingColor(7.0)).toBe('text-green-500');
    });

    it('should return yellow for medium ratings', () => {
      expect(getRatingColor(6.5)).toBe('text-yellow-500');
      expect(getRatingColor(5.0)).toBe('text-yellow-500');
    });

    it('should return red for low ratings', () => {
      expect(getRatingColor(4.5)).toBe('text-red-500');
    });
  });

  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
    });
  });
});