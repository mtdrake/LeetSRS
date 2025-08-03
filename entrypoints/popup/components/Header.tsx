export function Header() {
  const now = new Date();
  const timestamp = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-secondary border-b border-current">
      <h1 className="text-xl font-bold text-primary">LeetReps</h1>
      <span className="text-sm text-secondary">{timestamp}</span>
    </div>
  );
}
