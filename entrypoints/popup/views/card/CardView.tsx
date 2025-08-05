import { useState } from 'react';
import { ViewLayout } from '../../components/ViewLayout';
import { StreakCounter } from '../../components/StreakCounter';
import { useCardsQuery } from '@/hooks/useBackgroundQueries';
import { Button } from 'react-aria-components';
import { State as FsrsState } from 'ts-fsrs';
import type { Card } from '@/shared/cards';

// Utility functions
const getStateLabel = (state: FsrsState) => {
  switch (state) {
    case FsrsState.New:
      return 'New';
    case FsrsState.Learning:
      return 'Learning';
    case FsrsState.Review:
      return 'Review';
    case FsrsState.Relearning:
      return 'Relearning';
    default:
      return 'Unknown';
  }
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return 'text-green-500';
    case 'Medium':
      return 'text-yellow-500';
    case 'Hard':
      return 'text-red-500';
    default:
      return 'text-secondary';
  }
};

// Sub-components
interface CardHeaderProps {
  card: Card;
  isExpanded: boolean;
}

function CardHeader({ card, isExpanded }: CardHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-xs text-secondary">#{card.leetcodeId}</span>
        <span className="text-sm">{card.name}</span>
        {card.paused && <span className="text-xs bg-warning text-white px-2 py-0.5 rounded">Paused</span>}
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs ${getDifficultyColor(card.difficulty)}`}>{card.difficulty}</span>
        <span className={`text-xs text-secondary transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
          ▶
        </span>
      </div>
    </>
  );
}

interface StatRowProps {
  label: string;
  value: string | number;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex justify-between">
      <span className="text-secondary">{label}:</span>
      <span>{value}</span>
    </div>
  );
}

interface CardStatsProps {
  card: Card;
}

function CardStats({ card }: CardStatsProps) {
  return (
    <div className="px-4 pb-3 border-t border-current">
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        <StatRow label="State" value={getStateLabel(card.fsrs.state)} />
        <StatRow label="Reviews" value={card.fsrs.reps} />
        <StatRow label="Stability" value={`${card.fsrs.stability.toFixed(1)}d`} />
        <StatRow label="Lapses" value={card.fsrs.lapses} />
        <StatRow label="Difficulty" value={card.fsrs.difficulty.toFixed(2)} />
        <StatRow label="Due" value={formatDate(card.fsrs.due)} />
        {card.fsrs.last_review && <StatRow label="Last" value={formatDate(card.fsrs.last_review)} />}
        <StatRow label="Added" value={formatDate(card.createdAt)} />
      </div>
    </div>
  );
}

interface CardItemProps {
  card: Card;
  isExpanded: boolean;
  onToggle: () => void;
}

function CardItem({ card, isExpanded, onToggle }: CardItemProps) {
  return (
    <div className="bg-secondary rounded-lg border border-current overflow-hidden">
      <Button
        className="w-full flex items-center justify-between p-3 hover:bg-tertiary transition-colors text-left"
        onPress={onToggle}
        aria-expanded={isExpanded}
      >
        <CardHeader card={card} isExpanded={isExpanded} />
      </Button>
      {isExpanded && <CardStats card={card} />}
    </div>
  );
}

export function CardView() {
  const { data: cards = [], isLoading } = useCardsQuery();
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const sortedCards = [...cards].sort((a, b) => {
    const aId = parseInt(a.leetcodeId);
    const bId = parseInt(b.leetcodeId);
    return aId - bId;
  });

  const toggleCard = (cardId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  return (
    <ViewLayout title="Cards" headerContent={<StreakCounter />}>
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <p className="text-secondary">Loading cards...</p>
        ) : sortedCards.length === 0 ? (
          <p className="text-secondary">No cards added yet.</p>
        ) : (
          <div className="space-y-2">
            {sortedCards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                isExpanded={expandedCards.has(card.id)}
                onToggle={() => toggleCard(card.id)}
              />
            ))}
          </div>
        )}
      </div>
    </ViewLayout>
  );
}
