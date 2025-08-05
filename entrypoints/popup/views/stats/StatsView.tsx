import { ViewLayout } from '../../components/ViewLayout';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useCardStateStatsQuery, useLastNDaysStatsQuery, useNextNDaysStatsQuery } from '@/hooks/useBackgroundQueries';
import { State as FsrsState, Rating } from 'ts-fsrs';
import { StreakCounter } from '../../components/StreakCounter';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export function StatsView() {
  const { data: cardStateStats } = useCardStateStatsQuery();
  const { data: last30DaysStats } = useLastNDaysStatsQuery(30);
  const { data: next14DaysStats } = useNextNDaysStatsQuery(14);

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
        // Parse YYYY-MM-DD format explicitly to avoid timezone issues
        const [, month, day] = stat.date.split('-').map(Number);
        return `${month}/${day}`;
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

  // Prepare data for line chart (upcoming reviews)
  const lineChartData = {
    labels:
      next14DaysStats?.map((stat) => {
        // Parse YYYY-MM-DD format explicitly to avoid timezone issues
        const [, month, day] = stat.date.split('-').map(Number);
        return `${month}/${day}`;
      }) || [],
    datasets: [
      {
        label: 'Cards Due',
        data: next14DaysStats?.map((stat) => stat.count) || [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
  };

  return (
    <ViewLayout headerContent={<StreakCounter />}>
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

        <div className="mb-6 p-4 rounded-lg bg-secondary text-primary">
          <h3 className="text-lg font-semibold mb-4">Upcoming Reviews (Next 14 Days)</h3>
          <div style={{ height: '250px' }}>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>
    </ViewLayout>
  );
}
