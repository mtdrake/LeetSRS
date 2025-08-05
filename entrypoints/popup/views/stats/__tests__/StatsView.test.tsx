/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsView } from '../StatsView';
import { State as FsrsState, Rating } from 'ts-fsrs';
import { createTestWrapper } from '@/test/utils/test-wrapper';
import { createQueryMock } from '@/test/utils/query-mocks';
import { useCardStateStatsQuery, useLastNDaysStatsQuery, useNextNDaysStatsQuery } from '@/hooks/useBackgroundQueries';
import type { UseQueryResult } from '@tanstack/react-query';
import type { DailyStats, UpcomingReviewStats } from '@/services/stats';

// Mock react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Doughnut: ({ data, options }: { data: unknown; options: unknown }) => (
    <div
      data-testid="doughnut-chart"
      data-chart-data={JSON.stringify(data)}
      data-chart-options={JSON.stringify(options)}
    >
      Doughnut Chart
    </div>
  ),
  Bar: ({ data, options }: { data: unknown; options: unknown }) => (
    <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)} data-chart-options={JSON.stringify(options)}>
      Bar Chart
    </div>
  ),
  Line: ({ data, options }: { data: unknown; options: unknown }) => (
    <div data-testid="line-chart" data-chart-data={JSON.stringify(data)} data-chart-options={JSON.stringify(options)}>
      Line Chart
    </div>
  ),
}));

// Mock the ViewLayout component
vi.mock('../../../components/ViewLayout', () => ({
  ViewLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock the query hooks
vi.mock('@/hooks/useBackgroundQueries', () => ({
  useCardStateStatsQuery: vi.fn(),
  useLastNDaysStatsQuery: vi.fn(),
  useNextNDaysStatsQuery: vi.fn(),
}));

describe('StatsView', () => {
  const { wrapper } = createTestWrapper();

  // Default mock data
  const mockCardStateStats: Record<FsrsState, number> = {
    [FsrsState.New]: 5,
    [FsrsState.Learning]: 3,
    [FsrsState.Review]: 8,
    [FsrsState.Relearning]: 2,
  };

  const mockLast30DaysStats: DailyStats[] = [
    {
      date: '2024-05-15',
      totalReviews: 10,
      gradeBreakdown: {
        [Rating.Again]: 1,
        [Rating.Hard]: 2,
        [Rating.Good]: 5,
        [Rating.Easy]: 2,
      },
      newCards: 2,
      reviewedCards: 8,
      streak: 1,
    },
    {
      date: '2024-05-16',
      totalReviews: 15,
      gradeBreakdown: {
        [Rating.Again]: 2,
        [Rating.Hard]: 3,
        [Rating.Good]: 7,
        [Rating.Easy]: 3,
      },
      newCards: 3,
      reviewedCards: 12,
      streak: 2,
    },
  ];

  const mockNext14DaysStats: UpcomingReviewStats[] = [
    {
      date: '2024-05-15',
      count: 5,
    },
    {
      date: '2024-05-16',
      count: 3,
    },
    {
      date: '2024-05-17',
      count: 8,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock - return stats data
    vi.mocked(useCardStateStatsQuery).mockReturnValue(
      createQueryMock(mockCardStateStats) as UseQueryResult<Record<FsrsState, number>>
    );

    vi.mocked(useLastNDaysStatsQuery).mockReturnValue(
      createQueryMock(mockLast30DaysStats) as UseQueryResult<DailyStats[]>
    );

    vi.mocked(useNextNDaysStatsQuery).mockReturnValue(
      createQueryMock(mockNext14DaysStats) as UseQueryResult<UpcomingReviewStats[]>
    );
  });

  const renderStatsView = () => {
    return render(<StatsView />, { wrapper });
  };

  it('should render the statistics heading', () => {
    renderStatsView();

    expect(screen.getByRole('heading', { name: 'Statistics' })).toBeInTheDocument();
  });

  it('should render the card distribution section', () => {
    renderStatsView();

    expect(screen.getByRole('heading', { name: 'Card Distribution' })).toBeInTheDocument();
  });

  it('should render the doughnut chart', () => {
    renderStatsView();

    const chart = screen.getByTestId('doughnut-chart');
    expect(chart).toBeInTheDocument();
  });

  it('should pass correct data to the doughnut chart', () => {
    renderStatsView();

    const chart = screen.getByTestId('doughnut-chart');
    const chartData = JSON.parse(chart.getAttribute('data-chart-data') || '{}');

    expect(chartData.labels).toEqual(['New', 'Learning', 'Review', 'Relearning']);
    expect(chartData.datasets[0].data).toEqual([5, 3, 8, 2]);
  });

  it('should use correct colors for chart segments', () => {
    renderStatsView();

    const chart = screen.getByTestId('doughnut-chart');
    const chartData = JSON.parse(chart.getAttribute('data-chart-data') || '{}');

    expect(chartData.datasets[0].backgroundColor).toEqual([
      '#3b82f6', // blue for New
      '#f59e0b', // amber for Learning
      '#10b981', // emerald for Review
      '#ef4444', // red for Relearning
    ]);
  });

  it('should render chart with correct options', () => {
    renderStatsView();

    const chart = screen.getByTestId('doughnut-chart');
    const chartOptions = JSON.parse(chart.getAttribute('data-chart-options') || '{}');

    expect(chartOptions.responsive).toBe(true);
    expect(chartOptions.maintainAspectRatio).toBe(false);
    expect(chartOptions.plugins.legend.position).toBe('top');
  });

  it('should render zeros when no stats data is available', () => {
    vi.mocked(useCardStateStatsQuery).mockReturnValue(
      createQueryMock<Record<FsrsState, number> | undefined>(undefined) as UseQueryResult<Record<FsrsState, number>>
    );

    renderStatsView();

    const chart = screen.getByTestId('doughnut-chart');
    const chartData = JSON.parse(chart.getAttribute('data-chart-data') || '{}');

    expect(chartData.datasets[0].data).toEqual([0, 0, 0, 0]);
  });

  it('should apply correct CSS classes', () => {
    renderStatsView();

    // Check for main heading styles
    const heading = screen.getByRole('heading', { name: 'Statistics' });
    expect(heading).toHaveClass('text-2xl', 'font-bold', 'text-primary');

    // Check for card distribution container
    const distributionSection = screen.getByRole('heading', { name: 'Card Distribution' }).parentElement;
    expect(distributionSection).toHaveClass('mb-6', 'p-4', 'rounded-lg', 'bg-secondary', 'text-primary');

    // Check for section heading styles
    const sectionHeading = screen.getByRole('heading', { name: 'Card Distribution' });
    expect(sectionHeading).toHaveClass('text-lg', 'font-semibold', 'mb-4');
  });

  it('should set chart container height', () => {
    renderStatsView();

    const chartContainer = screen.getByTestId('doughnut-chart').parentElement;
    expect(chartContainer).toHaveStyle({ height: '200px' });
  });

  describe('loading state', () => {
    it('should handle loading state gracefully', () => {
      vi.mocked(useCardStateStatsQuery).mockReturnValue(
        createQueryMock<Record<FsrsState, number> | undefined>(undefined, {
          isLoading: true,
          isPending: true,
          isSuccess: false,
          isFetching: true,
          isFetched: false,
          status: 'pending',
          fetchStatus: 'fetching',
          dataUpdatedAt: 0,
        }) as UseQueryResult<Record<FsrsState, number>>
      );

      renderStatsView();

      // Chart should still render with default data
      const chart = screen.getByTestId('doughnut-chart');
      expect(chart).toBeInTheDocument();

      const chartData = JSON.parse(chart.getAttribute('data-chart-data') || '{}');
      expect(chartData.datasets[0].data).toEqual([0, 0, 0, 0]);
    });
  });

  describe('error state', () => {
    it('should handle error state gracefully', () => {
      const error = new Error('Failed to fetch stats');
      vi.mocked(useCardStateStatsQuery).mockReturnValue(
        createQueryMock<Record<FsrsState, number> | undefined>(undefined, {
          error,
          isError: true,
          isSuccess: false,
          isLoadingError: true,
          status: 'error',
          errorUpdatedAt: Date.now(),
          dataUpdatedAt: 0,
          failureReason: error,
          failureCount: 1,
          errorUpdateCount: 1,
        }) as UseQueryResult<Record<FsrsState, number>>
      );

      renderStatsView();

      // Chart should still render with default data
      const chart = screen.getByTestId('doughnut-chart');
      expect(chart).toBeInTheDocument();

      const chartData = JSON.parse(chart.getAttribute('data-chart-data') || '{}');
      expect(chartData.datasets[0].data).toEqual([0, 0, 0, 0]);
    });
  });

  describe('data edge cases', () => {
    it('should handle all zero values', () => {
      vi.mocked(useCardStateStatsQuery).mockReturnValue(
        createQueryMock({
          [FsrsState.New]: 0,
          [FsrsState.Learning]: 0,
          [FsrsState.Review]: 0,
          [FsrsState.Relearning]: 0,
        }) as UseQueryResult<Record<FsrsState, number>>
      );

      renderStatsView();

      const chart = screen.getByTestId('doughnut-chart');
      const chartData = JSON.parse(chart.getAttribute('data-chart-data') || '{}');

      expect(chartData.datasets[0].data).toEqual([0, 0, 0, 0]);
    });

    it('should handle large numbers', () => {
      vi.mocked(useCardStateStatsQuery).mockReturnValue(
        createQueryMock({
          [FsrsState.New]: 1000,
          [FsrsState.Learning]: 500,
          [FsrsState.Review]: 2500,
          [FsrsState.Relearning]: 100,
        }) as UseQueryResult<Record<FsrsState, number>>
      );

      renderStatsView();

      const chart = screen.getByTestId('doughnut-chart');
      const chartData = JSON.parse(chart.getAttribute('data-chart-data') || '{}');

      expect(chartData.datasets[0].data).toEqual([1000, 500, 2500, 100]);
    });
  });

  describe('Bar Chart (Last 30 Days Review History)', () => {
    it('should render the review history section', () => {
      renderStatsView();

      expect(screen.getByRole('heading', { name: 'Last 30 Days Review History' })).toBeInTheDocument();
    });

    it('should render the bar chart', () => {
      renderStatsView();

      const chart = screen.getByTestId('bar-chart');
      expect(chart).toBeInTheDocument();
    });

    it('should pass correct data to the bar chart', () => {
      renderStatsView();

      const chart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(chart.getAttribute('data-chart-data') || '{}');

      // Check labels exist and are formatted as MM/DD
      expect(chartData.labels).toHaveLength(2);
      expect(chartData.labels[0]).toMatch(/^\d{1,2}\/\d{1,2}$/);
      expect(chartData.labels[1]).toMatch(/^\d{1,2}\/\d{1,2}$/);

      // Check datasets
      expect(chartData.datasets).toHaveLength(4);
      expect(chartData.datasets[0].label).toBe('Again');
      expect(chartData.datasets[0].data).toEqual([1, 2]);
      expect(chartData.datasets[1].label).toBe('Hard');
      expect(chartData.datasets[1].data).toEqual([2, 3]);
      expect(chartData.datasets[2].label).toBe('Good');
      expect(chartData.datasets[2].data).toEqual([5, 7]);
      expect(chartData.datasets[3].label).toBe('Easy');
      expect(chartData.datasets[3].data).toEqual([2, 3]);
    });

    it('should use correct colors for grade levels', () => {
      renderStatsView();

      const chart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(chart.getAttribute('data-chart-data') || '{}');

      expect(chartData.datasets[0].backgroundColor).toBe('#ef4444'); // Again - red
      expect(chartData.datasets[1].backgroundColor).toBe('#f59e0b'); // Hard - amber
      expect(chartData.datasets[2].backgroundColor).toBe('#10b981'); // Good - emerald
      expect(chartData.datasets[3].backgroundColor).toBe('#3b82f6'); // Easy - blue
    });

    it('should configure bar chart as stacked', () => {
      renderStatsView();

      const chart = screen.getByTestId('bar-chart');
      const chartOptions = JSON.parse(chart.getAttribute('data-chart-options') || '{}');

      expect(chartOptions.scales.x.stacked).toBe(true);
      expect(chartOptions.scales.y.stacked).toBe(true);
    });

    it('should handle empty data gracefully', () => {
      vi.mocked(useLastNDaysStatsQuery).mockReturnValue(
        createQueryMock<DailyStats[] | undefined>(undefined) as UseQueryResult<DailyStats[]>
      );
      vi.mocked(useNextNDaysStatsQuery).mockReturnValue(
        createQueryMock<UpcomingReviewStats[] | undefined>(undefined) as UseQueryResult<UpcomingReviewStats[]>
      );

      renderStatsView();

      const chart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(chart.getAttribute('data-chart-data') || '{}');

      expect(chartData.labels).toEqual([]);
      expect(chartData.datasets[0].data).toEqual([]);
      expect(chartData.datasets[1].data).toEqual([]);
      expect(chartData.datasets[2].data).toEqual([]);
      expect(chartData.datasets[3].data).toEqual([]);
    });

    it('should request exactly 30 days of data', () => {
      renderStatsView();

      expect(useLastNDaysStatsQuery).toHaveBeenCalledWith(30);
    });

    it('should apply correct CSS classes to review history section', () => {
      renderStatsView();

      const reviewSection = screen.getByRole('heading', { name: 'Last 30 Days Review History' }).parentElement;
      expect(reviewSection).toHaveClass('mb-6', 'p-4', 'rounded-lg', 'bg-secondary', 'text-primary');
    });

    it('should set bar chart container height', () => {
      renderStatsView();

      const chartContainer = screen.getByTestId('bar-chart').parentElement;
      expect(chartContainer).toHaveStyle({ height: '250px' });
    });
  });
});
