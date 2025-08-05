import { ViewLayout } from '../../components/ViewLayout';
import { StreakCounter } from '../../components/StreakCounter';
import { CardDistributionChart } from './CardDistributionChart';
import { ReviewHistoryChart } from './ReviewHistoryChart';
import { UpcomingReviewsChart } from './UpcomingReviewsChart';

export function StatsView() {
  return (
    <ViewLayout headerContent={<StreakCounter />}>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">Statistics</h1>
        </div>

        <CardDistributionChart />
        <ReviewHistoryChart />
        <UpcomingReviewsChart />
      </div>
    </ViewLayout>
  );
}
