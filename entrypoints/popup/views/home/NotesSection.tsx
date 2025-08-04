import { useState, useEffect } from 'react';
import { useNoteQuery, useSaveNoteMutation } from '@/hooks/useBackgroundQueries';
import { NOTES_MAX_LENGTH } from '@/shared/notes';

interface NotesSectionProps {
  cardId: string;
}

export function NotesSection({ cardId }: NotesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [noteText, setNoteText] = useState('');

  const { data: note, isLoading, error } = useNoteQuery(cardId);
  const saveNoteMutation = useSaveNoteMutation(cardId);

  // Sync fetched note with local state
  useEffect(() => {
    const text = note?.text || '';
    setNoteText(text);
  }, [note]);

  const handleSave = async () => {
    try {
      await saveNoteMutation.mutateAsync(noteText);
    } catch (error) {
      console.error('Failed to save note:', error);
      // Revert to original text on error
      setNoteText(note?.text || '');
    }
  };

  const originalText = note?.text || '';
  const characterCount = noteText.length;
  const isOverLimit = characterCount > NOTES_MAX_LENGTH;
  const hasChanges = noteText !== originalText;
  const canSave = hasChanges && !isOverLimit && noteText.length > 0;

  if (error) {
    console.error('Failed to load note:', error);
  }

  return (
    <div className="border border-current rounded-lg bg-secondary overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-tertiary transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="text-sm font-semibold text-primary">Notes</span>
        <span className={`text-xs text-secondary transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
          ▶
        </span>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-current">
          <textarea
            className="w-full mt-3 p-2 rounded border border-current bg-tertiary text-primary text-sm resize-none focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder={isLoading ? 'Loading...' : 'Add your notes here...'}
            rows={4}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            disabled={isLoading || saveNoteMutation.isPending}
            maxLength={NOTES_MAX_LENGTH + 100} // Allow typing over limit to show error
          />
          <div className="mt-2 flex items-center justify-between">
            <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-secondary'}`}>
              {characterCount}/{NOTES_MAX_LENGTH}
            </span>
            <button
              className="px-4 py-1.5 rounded text-sm bg-accent text-white hover:opacity-90 transition-all shadow-sm hover:shadow-md active:shadow-none active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:shadow-none disabled:active:translate-y-0"
              onClick={handleSave}
              disabled={!canSave || saveNoteMutation.isPending}
            >
              {saveNoteMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
