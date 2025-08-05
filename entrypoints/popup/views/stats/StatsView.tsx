import { ViewLayout } from '../../components/ViewLayout';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useCardStateStatsQuery } from '@/hooks/useBackgroundQueries';
import { State as FsrsState } from 'ts-fsrs';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function StatsView() {
  const { data: cardStateStats } = useCardStateStatsQuery();

  const doughnutData = {
    labels: ['New', 'Learning', 'Review', 'Relearning'],
    datasets: [
      {
        data: cardStateStats
          ? [
              cardStateStats[FsrsState.New],
              cardStateStats[FsrsState.Learning],
              cardStateStats[FsrsState.Review],
              cardStateStats[FsrsState.Relearning],
            ]
          : [0, 0, 0, 0],
        backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'],
        borderColor: ['#2563eb', '#d97706', '#059669', '#dc2626'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <ViewLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">Statistics</h1>
        </div>

        <div className="mb-6 p-4 rounded-lg bg-secondary text-primary">
          <h3 className="text-lg font-semibold mb-4">Card Distribution</h3>
          <div style={{ height: '200px' }}>
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        </div>
      </div>
    </ViewLayout>
  );
}
