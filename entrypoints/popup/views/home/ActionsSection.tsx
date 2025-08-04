import { useState } from 'react';
import { Button } from 'react-aria-components';
import { bounceButton } from '@/shared/styles';

interface ActionsSectionProps {
  cardId: string;
}

export function ActionsSection({ cardId: _cardId }: ActionsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-current rounded-lg bg-secondary overflow-hidden">
      <Button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-tertiary transition-colors"
        onPress={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="text-sm font-semibold text-primary">Actions</span>
        <span className={`text-xs text-secondary transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
          ▶
        </span>
      </Button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-current">
          <div className="mt-3 space-y-2">
            <p className="text-sm text-secondary mb-2">Delay card</p>
            <div className="flex gap-2">
              <Button
                className={`flex-1 px-4 py-2 rounded text-sm bg-tertiary text-primary hover:bg-accent hover:text-white transition-colors ${bounceButton}`}
                onPress={() => console.log('Delay 1 day')}
              >
                1 day
              </Button>
              <Button
                className={`flex-1 px-4 py-2 rounded text-sm bg-tertiary text-primary hover:bg-accent hover:text-white transition-colors ${bounceButton}`}
                onPress={() => console.log('Delay 5 days')}
              >
                5 days
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
