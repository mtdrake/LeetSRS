export function Header() {
  const now = new Date();
  const timestamp = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="header">
      <h1>LeetReps</h1>
      <span className="timestamp">{timestamp}</span>
    </div>
  );
}
