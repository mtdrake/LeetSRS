export function StatsBar() {
  const stats = {
    reviews: 10,
    new: 3,
    again: 12,
  };

  return (
    <div 
      className="flex items-center justify-center gap-2 p-3"
      style={{ 
        backgroundColor: 'var(--current-bg-secondary)',
        color: 'var(--current-text-primary)'
      }}
    >
      <span className="flex items-center gap-1">
        <span className="font-semibold" style={{ color: 'var(--current-info)' }}>{stats.reviews}</span>
        <span style={{ color: 'var(--current-text-secondary)' }}>reviews</span>
      </span>
      <span style={{ color: 'var(--current-text-tertiary)' }}>•</span>
      <span className="flex items-center gap-1">
        <span className="font-semibold" style={{ color: 'var(--current-accent)' }}>{stats.new}</span>
        <span style={{ color: 'var(--current-text-secondary)' }}>new</span>
      </span>
      <span style={{ color: 'var(--current-text-tertiary)' }}>•</span>
      <span className="flex items-center gap-1">
        <span className="font-semibold" style={{ color: 'var(--current-danger)' }}>{stats.again}</span>
        <span style={{ color: 'var(--current-text-secondary)' }}>again</span>
      </span>
    </div>
  );
}