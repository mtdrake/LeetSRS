import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { type Card } from '@/types';

type ReviewCardProps = {
  card: Pick<Card, 'slug' | 'leetcodeId' | 'name' | 'difficulty'>;
};

export function ReviewCard({ card }: ReviewCardProps) {
  const difficultyColorMap = {
    Easy: 'bg-difficulty-easy',
    Medium: 'bg-difficulty-medium',
    Hard: 'bg-difficulty-hard',
  };

  const difficultyColor =
    difficultyColorMap[card.difficulty as keyof typeof difficultyColorMap] || 'bg-difficulty-hard';

  return (
    <div className="border border-current rounded-lg bg-secondary p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-secondary">#{card.leetcodeId}</span>
        <span className={`text-xs px-2 py-1 rounded text-white ${difficultyColor}`}>{card.difficulty}</span>
      </div>

      <div className="flex justify-center pb-3 -mt-1">
        <a
          href={`https://leetcode.com/problems/${card.slug}/description/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold text-primary flex items-center gap-1 hover:text-accent transition-colors"
        >
          {card.name}
          <FaArrowUpRightFromSquare className="text-xs" />
        </a>
      </div>

      <div className="flex gap-2 justify-center">
        <button className="w-16 py-1.5 rounded text-sm bg-rating-again text-white hover:opacity-80 transition-opacity">
          Again
        </button>
        <button className="w-16 py-1.5 rounded text-sm bg-rating-hard text-white hover:opacity-80 transition-opacity">
          Hard
        </button>
        <button className="w-16 py-1.5 rounded text-sm bg-rating-good text-white hover:opacity-80 transition-opacity">
          Good
        </button>
        <button className="w-16 py-1.5 rounded text-sm bg-rating-easy text-white hover:opacity-80 transition-opacity">
          Easy
        </button>
      </div>
    </div>
  );
}
