import { useState } from 'react';

export function NotesSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="notes-section">
      <button className="notes-header" onClick={() => setIsExpanded(!isExpanded)} aria-expanded={isExpanded}>
        <span className="notes-title">Notes</span>
        <span className="notes-toggle">{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className="notes-content">
          <textarea className="notes-textarea" placeholder="Add your notes here..." rows={4} />
          <div className="notes-footer">
            <button className="notes-save-btn">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
