import { ViewLayout } from '../../components/ViewLayout';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useCardStateStatsQuery, useLastNDaysStatsQuery } from '@/hooks/useBackgroundQueries';
import { State as FsrsState, Rating } from 'ts-fsrs';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function StatsView() {
  const { data: cardStateStats } = useCardStateStatsQuery();
  const { data: last30DaysStats } = useLastNDaysStatsQuery(30);

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

  // Prepare data for stacked bar chart
  const barChartData = {
    labels:
      last30DaysStats?.map((stat) => {
        const date = new Date(stat.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }) || [],
    datasets: [
      {
        label: 'Again',
        data: last30DaysStats?.map((stat) => stat.gradeBreakdown[Rating.Again]) || [],
        backgroundColor: '#ef4444',
      },
      {
        label: 'Hard',
        data: last30DaysStats?.map((stat) => stat.gradeBreakdown[Rating.Hard]) || [],
        backgroundColor: '#f59e0b',
      },
      {
        label: 'Good',
        data: last30DaysStats?.map((stat) => stat.gradeBreakdown[Rating.Good]) || [],
        backgroundColor: '#10b981',
      },
      {
        label: 'Easy',
        data: last30DaysStats?.map((stat) => stat.gradeBreakdown[Rating.Easy]) || [],
        backgroundColor: '#3b82f6',
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
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

        <div className="mb-6 p-4 rounded-lg bg-secondary text-primary">
          <h3 className="text-lg font-semibold mb-4">Last 30 Days Review History</h3>
          <div style={{ height: '250px' }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </ViewLayout>
  );
}
