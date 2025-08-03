export function HomeView() {
  return (
    <div className="home-view">
      <div className="view-header">
        <h1>LeetReps</h1>
        <span className="subtitle">Daily Practice Tracker</span>
      </div>

      <div className="placeholder-content">
        <div className="placeholder-card">
          <h3>Today&apos;s Stats</h3>
          <p>Stats will appear here</p>
        </div>

        <div className="placeholder-card">
          <h3>Current Review</h3>
          <p>Review card will appear here</p>
        </div>

        <div className="placeholder-card">
          <h3>Quick Actions</h3>
          <p>Action buttons will appear here</p>
        </div>
      </div>
    </div>
  );
}
