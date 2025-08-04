import {
  FSRS,
  State as FsrsState,
  createEmptyCard,
  generatorParameters,
  type Card as FsrsCard,
  type Grade,
} from 'ts-fsrs';
import { STORAGE_KEYS } from './storage-keys';
import { storage } from '#imports';
import { interleaveArrays } from './utils';
import { updateStats, getTodayStats } from './stats';
import { type Card, type Difficulty } from '@/types';

export const MAX_NEW_CARDS_PER_DAY = 3;
const params = generatorParameters({ maximum_interval: 1000 });
const fsrs = new FSRS(params);

export interface StoredCard extends Omit<Card, 'createdAt' | 'fsrs'> {
  createdAt: number;
  fsrs: Omit<FsrsCard, 'due' | 'last_review'> & {
    due: number;
    last_review?: number;
  };
}

async function getCards(): Promise<Record<string, StoredCard>> {
  const cards = await storage.getItem<Record<string, StoredCard>>(STORAGE_KEYS.cards);
  return cards ?? {};
}

export function serializeCard(card: Card): StoredCard {
  return {
    ...card,
    createdAt: card.createdAt.getTime(),
    fsrs: {
      ...card.fsrs,
      due: card.fsrs.due.getTime(),
      last_review: card.fsrs.last_review?.getTime(),
    },
  };
}

export function deserializeCard(stored: StoredCard): Card {
  const { due, last_review, ...rest } = stored.fsrs;
  return {
    ...stored,
    createdAt: new Date(stored.createdAt),
    fsrs: {
      ...rest,
      due: new Date(due),
      last_review: last_review ? new Date(last_review) : undefined,
    },
  };
}

function createCard(slug: string, name: string, leetcodeId: string, difficulty: Difficulty): Card {
  return {
    id: crypto.randomUUID(),
    slug,
    name,
    leetcodeId,
    difficulty,
    createdAt: new Date(),
    fsrs: createEmptyCard(),
  };
}

export async function addCard(slug: string, name: string, leetcodeId: string, difficulty: Difficulty): Promise<Card> {
  const cards = await getCards();
  if (slug in cards) {
    return deserializeCard(cards[slug]);
  }

  const card = createCard(slug, name, leetcodeId, difficulty);
  cards[slug] = serializeCard(card);
  await storage.setItem(STORAGE_KEYS.cards, cards);
  return card;
}

export async function getAllCards(): Promise<Card[]> {
  const cards = await getCards();
  return Object.values(cards).map(deserializeCard);
}

export async function removeCard(slug: string): Promise<void> {
  const cards = await getCards();
  delete cards[slug];
  await storage.setItem(STORAGE_KEYS.cards, cards);
}

export async function rateCard(slug: string, rating: Grade, leetcodeId: string, difficulty: Difficulty): Promise<Card> {
  const cards = await getCards();

  let card: Card;
  let isNewCard = true;
  if (slug in cards) {
    card = deserializeCard(cards[slug]);
    isNewCard = card.fsrs.state === FsrsState.New;
  } else {
    card = createCard(slug, slug, leetcodeId, difficulty);
  }

  const now = new Date();
  const schedulingResult = fsrs.next(card.fsrs, now, rating);
  card.fsrs = schedulingResult.card;
  cards[slug] = serializeCard(card);
  await storage.setItem(STORAGE_KEYS.cards, cards);

  // Update stats tracking
  await updateStats(rating, isNewCard);

  return card;
}

export async function getReviewQueue(): Promise<Card[]> {
  const allCards = await getAllCards();
  const now = new Date();
  const reviewCards = allCards.filter((card) => card.fsrs.state !== FsrsState.New && card.fsrs.due <= now);

  // Get today's stats to determine how many new cards have already been done
  const todayStats = await getTodayStats();
  const newCardsCompletedToday = todayStats?.newCards ?? 0;
  const remainingNewCards = Math.max(0, MAX_NEW_CARDS_PER_DAY - newCardsCompletedToday);

  const newCards = allCards.filter((card) => card.fsrs.state === FsrsState.New).slice(0, remainingNewCards);
  return interleaveArrays(reviewCards, newCards);
}
