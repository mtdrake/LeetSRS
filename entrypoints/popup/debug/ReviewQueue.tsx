import { useState } from 'react';
import type { Card } from '@/services/cards';
import { MessageType } from '@/services/messages';
import { useBackgroundQuery } from '@/hooks/useBackgroundQuery';
import { State as FsrsState } from 'ts-fsrs';

interface ReviewQueueProps {
  style?: React.CSSProperties;
}

export function ReviewQueue({ style }: ReviewQueueProps) {
  const [queryEnabled, setQueryEnabled] = useState(false);

  const {
    data: reviewQueue,
    isLoading,
    error,
    refetch,
  } = useBackgroundQuery({ type: MessageType.GET_REVIEW_QUEUE }, { enabled: queryEnabled });

  const queueList = reviewQueue ?? [];

  const handleLoadQueue = () => {
    if (!queryEnabled) {
      setQueryEnabled(true);
    } else {
      refetch();
    }
  };

  return (
    <div style={style}>
      <h3 className="debug-panel-cards-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        Review Queue ({queueList.length})
        <button
          onClick={handleLoadQueue}
          className="debug-panel-button"
          style={{ marginLeft: 'auto' }}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Load Queue'}
        </button>
      </h3>
      {error ? (
        <p className="debug-panel-empty-state">Error loading queue: {error.message}</p>
      ) : queueList.length === 0 ? (
        <p className="debug-panel-empty-state">No cards in review queue</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {queueList.map((card, index) => (
            <ReviewQueueCard key={`${card.slug}-${index}`} card={card} position={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface ReviewQueueCardProps {
  card: Card;
  position: number;
}

function ReviewQueueCard({ card, position }: ReviewQueueCardProps) {
  const isNew = card.fsrs.state === FsrsState.New;

  return (
    <div
      style={{
        padding: '10px',
        backgroundColor: '#2a2a2a',
        borderRadius: '4px',
        border: '1px solid #444',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>{position}.</strong> {card.name}
          <span style={{ marginLeft: '10px', color: '#888', fontSize: '0.9em' }}>({card.slug})</span>
        </div>
        <div
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: isNew ? '#1e4620' : '#1e3a4a',
            color: isNew ? '#4ade80' : '#60a5fa',
            fontSize: '0.85em',
          }}
        >
          {isNew ? 'NEW' : 'REVIEW'}
        </div>
      </div>
      <div style={{ marginTop: '5px', fontSize: '0.85em', color: '#999' }}>
        Reps: {card.fsrs.reps} | Lapses: {card.fsrs.lapses} | Difficulty: {card.fsrs.difficulty.toFixed(2)} | Stability:{' '}
        {card.fsrs.stability.toFixed(2)}
      </div>
      <div style={{ marginTop: '3px', fontSize: '0.85em', color: '#777' }}>
        Due: {new Date(card.fsrs.due).toLocaleString()} | Last Review:{' '}
        {card.fsrs.last_review ? new Date(card.fsrs.last_review).toLocaleString() : 'Never'}
      </div>
    </div>
  );
}
