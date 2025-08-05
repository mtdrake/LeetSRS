import { ViewLayout } from '../../components/ViewLayout';
import { StreakCounter } from '../../components/StreakCounter';

export function CardView() {
  return (
    <ViewLayout title="Cards" headerContent={<StreakCounter />}>
      <div className="flex flex-col gap-4">
        <p className="text-secondary">Card view coming soon...</p>
      </div>
    </ViewLayout>
  );
}
