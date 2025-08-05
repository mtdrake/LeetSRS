import { ViewLayout } from '../../components/ViewLayout';
import { StreakCounter } from '../../components/StreakCounter';
import { useCardsQuery } from '@/hooks/useBackgroundQueries';

export function CardView() {
  const { data: cards = [], isLoading } = useCardsQuery();

  const sortedCards = [...cards].sort((a, b) => {
    const aId = parseInt(a.leetcodeId);
    const bId = parseInt(b.leetcodeId);
    return aId - bId;
  });

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
              <div key={card.id} className="p-3 bg-secondary rounded-lg border border-current">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-secondary">#{card.leetcodeId}</span>
                  <span className="text-sm">{card.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ViewLayout>
  );
}
