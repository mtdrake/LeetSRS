import { storage } from '#imports';
import { STORAGE_KEYS } from './storage-keys';
import { DEFAULT_MAX_NEW_CARDS_PER_DAY, MIN_NEW_CARDS_PER_DAY, MAX_NEW_CARDS_PER_DAY } from '@/shared/settings';

export async function getMaxNewCardsPerDay(): Promise<number> {
  const value = await storage.getItem<number>(STORAGE_KEYS.maxNewCardsPerDay);
  return value ?? DEFAULT_MAX_NEW_CARDS_PER_DAY;
}

export async function setMaxNewCardsPerDay(value: number): Promise<void> {
  if (!Number.isInteger(value)) {
    throw new Error('Max new cards per day must be a whole number');
  }
  if (value < MIN_NEW_CARDS_PER_DAY || value > MAX_NEW_CARDS_PER_DAY) {
    throw new Error(`Max new cards per day must be between ${MIN_NEW_CARDS_PER_DAY} and ${MAX_NEW_CARDS_PER_DAY}`);
  }
  await storage.setItem(STORAGE_KEYS.maxNewCardsPerDay, value);
}
