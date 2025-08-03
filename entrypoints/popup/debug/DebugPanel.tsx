import { useState } from 'react';
import { MessageType } from '@/services/messages';
import { useBackgroundQuery, useBackgroundMutation } from '@/hooks/useBackgroundQuery';
import { DebugCard } from './DebugCard';
import { ReviewQueue } from './ReviewQueue';
import { TodayStats } from './TodayStats';
import './DebugPanel.css';

export function DebugPanel() {
  const [slug, setSlug] = useState('');
  const [isCardsCollapsed, setIsCardsCollapsed] = useState(false);

  // Query hook for fetching all cards
  const {
    data: cards,
    isLoading: isLoadingCards,
    error: cardsError,
    refetch: refetchCards,
  } = useBackgroundQuery({ type: MessageType.GET_ALL_CARDS });

  const cardsList = cards ?? [];

  // Mutation hooks for add and remove operations
  const addCardMutation = useBackgroundMutation();
  const removeCardMutation = useBackgroundMutation();

  const handleAddCard = async () => {
    if (!slug.trim()) return;

    try {
      const card = await addCardMutation.mutate({
        type: MessageType.ADD_CARD,
        slug: slug.trim(),
        name: slug.trim(), // Using slug as name for debug purposes
      });

      if (card) {
        setSlug('');
        await refetchCards(); // Reload cards after adding
      }
    } catch (error) {
      console.error('Failed to add card:', error);
    }
  };

  const handleRemoveCard = async (slug: string) => {
    try {
      await removeCardMutation.mutate({
        type: MessageType.REMOVE_CARD,
        slug: slug,
      });
      await refetchCards(); // Reload cards after removing
    } catch (error) {
      console.error('Failed to remove card:', error);
    }
  };

  const handleUpdateCard = async () => {
    // Since we're using the query hook, we need to refetch after updates
    // The update happens in the child component
    await refetchCards();
  };

  return (
    <div className="debug-panel">
      <h2 className="debug-panel-title">🔧 DEBUG PANEL</h2>

      <div className="debug-panel-input-container">
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddCard()}
          placeholder="Enter card slug (e.g., two-sum)"
          className="debug-panel-input"
        />
        <button
          onClick={handleAddCard}
          disabled={addCardMutation.isLoading || !slug.trim()}
          className="debug-panel-button"
        >
          {addCardMutation.isLoading ? 'Adding...' : 'Add Card'}
        </button>
      </div>

      <div>
        <h3
          className="debug-panel-cards-header"
          style={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={() => setIsCardsCollapsed(!isCardsCollapsed)}
        >
          <span style={{ marginRight: '8px' }}>{isCardsCollapsed ? '▶' : '▼'}</span>
          Cards in Storage ({cardsList.length})
        </h3>
        {!isCardsCollapsed &&
          (isLoadingCards ? (
            <p className="debug-panel-empty-state">Loading cards...</p>
          ) : cardsError ? (
            <p className="debug-panel-empty-state">Error loading cards: {cardsError.message}</p>
          ) : cardsList.length === 0 ? (
            <p className="debug-panel-empty-state">No cards in storage</p>
          ) : (
            <div className="debug-panel-cards-container">
              {cardsList.map((card) => (
                <DebugCard key={card.slug} card={card} onRemove={handleRemoveCard} onUpdate={handleUpdateCard} />
              ))}
            </div>
          ))}
      </div>

      <ReviewQueue style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '20px' }} />

      <TodayStats style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '20px' }} />
    </div>
  );
}
