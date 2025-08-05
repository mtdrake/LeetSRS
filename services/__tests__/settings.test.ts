import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fakeBrowser } from 'wxt/testing';
import { storage } from 'wxt/utils/storage';
import { getMaxNewCardsPerDay, setMaxNewCardsPerDay } from '../settings';
import { STORAGE_KEYS } from '../storage-keys';
import { DEFAULT_MAX_NEW_CARDS_PER_DAY, MIN_NEW_CARDS_PER_DAY, MAX_NEW_CARDS_PER_DAY } from '@/shared/settings';

describe('Settings Service', () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getMaxNewCardsPerDay', () => {
    it('should return the stored value when it exists', async () => {
      // Set a custom value in storage
      await storage.setItem(STORAGE_KEYS.maxNewCardsPerDay, 5);

      const result = await getMaxNewCardsPerDay();
      expect(result).toBe(5);
    });

    it('should return the default value when no stored value exists', async () => {
      const result = await getMaxNewCardsPerDay();
      expect(result).toBe(DEFAULT_MAX_NEW_CARDS_PER_DAY);
    });

    it('should handle zero value correctly', async () => {
      // Even though setMaxNewCardsPerDay doesn't allow 0, test that get handles it
      await storage.setItem(STORAGE_KEYS.maxNewCardsPerDay, 0);

      const result = await getMaxNewCardsPerDay();
      expect(result).toBe(0);
    });

    it('should handle maximum allowed value', async () => {
      await storage.setItem(STORAGE_KEYS.maxNewCardsPerDay, MAX_NEW_CARDS_PER_DAY);

      const result = await getMaxNewCardsPerDay();
      expect(result).toBe(MAX_NEW_CARDS_PER_DAY);
    });
  });

  describe('setMaxNewCardsPerDay', () => {
    it('should store valid values correctly', async () => {
      await setMaxNewCardsPerDay(10);

      const storedValue = await storage.getItem(STORAGE_KEYS.maxNewCardsPerDay);
      expect(storedValue).toBe(10);
    });

    it('should accept minimum allowed value', async () => {
      await setMaxNewCardsPerDay(MIN_NEW_CARDS_PER_DAY);

      const storedValue = await storage.getItem(STORAGE_KEYS.maxNewCardsPerDay);
      expect(storedValue).toBe(MIN_NEW_CARDS_PER_DAY);
    });

    it('should accept maximum allowed value', async () => {
      await setMaxNewCardsPerDay(MAX_NEW_CARDS_PER_DAY);

      const storedValue = await storage.getItem(STORAGE_KEYS.maxNewCardsPerDay);
      expect(storedValue).toBe(MAX_NEW_CARDS_PER_DAY);
    });

    it('should throw error for values less than minimum', async () => {
      await expect(setMaxNewCardsPerDay(MIN_NEW_CARDS_PER_DAY - 1)).rejects.toThrow(
        `Max new cards per day must be between ${MIN_NEW_CARDS_PER_DAY} and ${MAX_NEW_CARDS_PER_DAY}`
      );
      await expect(setMaxNewCardsPerDay(-10)).rejects.toThrow(
        `Max new cards per day must be between ${MIN_NEW_CARDS_PER_DAY} and ${MAX_NEW_CARDS_PER_DAY}`
      );
    });

    it('should throw error for values greater than maximum', async () => {
      await expect(setMaxNewCardsPerDay(MAX_NEW_CARDS_PER_DAY + 1)).rejects.toThrow(
        `Max new cards per day must be between ${MIN_NEW_CARDS_PER_DAY} and ${MAX_NEW_CARDS_PER_DAY}`
      );
    });

    it('should not modify storage when validation fails', async () => {
      // Set an initial valid value
      await setMaxNewCardsPerDay(5);

      // Try to set an invalid value
      await expect(setMaxNewCardsPerDay(MIN_NEW_CARDS_PER_DAY - 1)).rejects.toThrow();

      // Verify the original value is still there
      const storedValue = await storage.getItem(STORAGE_KEYS.maxNewCardsPerDay);
      expect(storedValue).toBe(5);
    });

    it('should reject decimal values', async () => {
      // All decimal values should be rejected
      await expect(setMaxNewCardsPerDay(5.5)).rejects.toThrow('Max new cards per day must be a whole number');
      await expect(setMaxNewCardsPerDay(1.1)).rejects.toThrow('Max new cards per day must be a whole number');
      await expect(setMaxNewCardsPerDay(99.9)).rejects.toThrow('Max new cards per day must be a whole number');

      // Even decimals outside range should fail with whole number error first
      await expect(setMaxNewCardsPerDay(0.5)).rejects.toThrow('Max new cards per day must be a whole number');
      await expect(setMaxNewCardsPerDay(100.1)).rejects.toThrow('Max new cards per day must be a whole number');
    });
  });

  describe('Integration tests', () => {
    it('should work correctly when setting and then getting a value', async () => {
      // Initially should return default
      let value = await getMaxNewCardsPerDay();
      expect(value).toBe(DEFAULT_MAX_NEW_CARDS_PER_DAY);

      // Set a new value
      await setMaxNewCardsPerDay(15);

      // Should return the new value
      value = await getMaxNewCardsPerDay();
      expect(value).toBe(15);
    });

    it('should handle multiple updates correctly', async () => {
      await setMaxNewCardsPerDay(5);
      expect(await getMaxNewCardsPerDay()).toBe(5);

      await setMaxNewCardsPerDay(10);
      expect(await getMaxNewCardsPerDay()).toBe(10);

      await setMaxNewCardsPerDay(20);
      expect(await getMaxNewCardsPerDay()).toBe(20);
    });
  });
});
