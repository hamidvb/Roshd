import { describe, it, expect } from 'vitest';
import { toPersianNumbers, toEnglishNumbers, getTimeAgoPersian } from '../src/lib/persian-utils';

describe('persian utils', () => {
  it('converts english numbers to persian', () => {
    expect(toPersianNumbers('1234567890')).toBe('۱۲۳۴۵۶۷۸۹۰');
    expect(toPersianNumbers(9870)).toBe('۹۸۷۰');
  });

  it('converts persian numbers to english', () => {
    expect(toEnglishNumbers('۱۲۳۴۵۶۷۸۹۰')).toBe('1234567890');
    expect(toEnglishNumbers('۱۲۳abc۴۵')).toBe('123abc45');
  });

  describe('getTimeAgoPersian', () => {
    it('handles recent times', () => {
      const date = new Date(Date.now() - 30 * 60 * 1000);
      expect(getTimeAgoPersian(date)).toBe('اکنون');
    });

    it('handles hours and days', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      expect(getTimeAgoPersian(twoHoursAgo)).toBe('۲ ساعت پیش');

      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(getTimeAgoPersian(yesterday)).toBe('دیروز');
    });

    it('handles weeks and months', () => {
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
      expect(getTimeAgoPersian(tenDaysAgo)).toBe('۱ هفته پیش');

      const fortyFiveDaysAgo = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000);
      expect(getTimeAgoPersian(fortyFiveDaysAgo)).toBe('۱ ماه پیش');
    });
  });
});
