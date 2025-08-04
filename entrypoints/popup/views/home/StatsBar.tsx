import { useReviewQueueQuery } from '@/hooks/useBackgroundQueries';
import { State } from 'ts-fsrs';

interface StatItemProps {
  count: number;
  label: string;
  colorClass: string;
  testId: string;
}

function StatItem({ count, label, colorClass, testId }: StatItemProps) {
  return (
    <span className="flex items-center gap-1" data-testid={`stat-${testId}`}>
      <span className={`font-semibold ${colorClass}`} data-testid={`stat-${testId}-count`}>
        {count}
      </span>
      <span className="text-secondary" data-testid={`stat-${testId}-label`}>
        {label}
      </span>
    </span>
  );
}

export function StatsBar() {
  const { data: cards = [] } = useReviewQueueQuery();

  const stats = cards.reduce(
    (acc, card) => {
      if (card.fsrs.state === State.Review) acc.reviews++;
      else if (card.fsrs.state === State.New) acc.new++;
      else if (card.fsrs.state === State.Learning || card.fsrs.state === State.Relearning) acc.learn++;
      return acc;
    },
    { reviews: 0, new: 0, learn: 0 }
  );

  return (
    <div className="flex items-center gap-2 text-sm">
      <StatItem count={stats.reviews} label="review" colorClass="text-info" testId="review" />
      <span className="text-tertiary">•</span>
      <StatItem count={stats.new} label="new" colorClass="text-accent" testId="new" />
      <span className="text-tertiary">•</span>
      <StatItem count={stats.learn} label="learn" colorClass="text-danger" testId="learn" />
    </div>
  );
}
