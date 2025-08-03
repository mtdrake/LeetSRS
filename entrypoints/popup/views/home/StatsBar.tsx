interface StatCardProps {
  label: string;
  value: number;
  color?: string;
}

function StatCard({ label, value, color = '#888' }: StatCardProps) {
  return (
    <div className="stat-card-mini" style={{ borderColor: color }}>
      <div className="stat-value-mini" style={{ color }}>
        {value}
      </div>
      <div className="stat-label-mini">{label}</div>
    </div>
  );
}

export function StatsBar() {
  return (
    <div className="stats-bar">
      <StatCard label="New" value={0} color="#54bc4a" />
      <StatCard label="Review" value={0} color="#4a9fbc" />
      <StatCard label="Again" value={0} color="#bc4a4a" />
    </div>
  );
}
