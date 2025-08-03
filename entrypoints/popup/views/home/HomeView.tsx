import { StatsBar } from './StatsBar';
import { ReviewCard } from './ReviewCard';
import { NotesSection } from './NotesSection';

export function HomeView() {
  return (
    <div className="home-view">
      <div className="view-header">
        <h1>LeetReps</h1>
        <span className="subtitle">Daily Practice Tracker</span>
      </div>

      <StatsBar />
      <ReviewCard />
      <NotesSection />
    </div>
  );
}
