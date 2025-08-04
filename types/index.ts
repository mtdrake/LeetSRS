import type { Card as FsrsCard } from 'ts-fsrs';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Card {
  slug: string;
  name: string;
  createdAt: Date;
  fsrs: FsrsCard;
}
