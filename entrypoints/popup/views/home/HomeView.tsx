import { ViewLayout } from '../../components/ViewLayout';
import { useAnimations } from '../../contexts/AnimationsContext';
import { StatsBar } from './StatsBar';
import { ReviewQueue } from './ReviewQueue';

export function HomeView() {
  const { animationsEnabled } = useAnimations();

  return (
    <ViewLayout headerContent={<StatsBar />}>
      <ReviewQueue disableAnimations={!animationsEnabled} />
    </ViewLayout>
  );
}
