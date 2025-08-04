/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsBar } from '../StatsBar';
import { useReviewQueueQuery } from '@/hooks/useBackgroundQueries';
import { State } from 'ts-fsrs';
import type { Card } from '@/types';
import { createTestWrapper } from '@/test/utils/test-wrapper';

// Mock the useReviewQueueQuery hook
vi.mock('@/hooks/useBackgroundQueries', () => ({
  useReviewQueueQuery: vi.fn(),
}));

describe('StatsBar', () => {
  const { wrapper: TestWrapper } = createTestWrapper();

  const renderWithProviders = () => {
    return render(<StatsBar />, { wrapper: TestWrapper });
  };

  const createMockCard = (state: State): Partial<Card> => ({
    fsrs: {
      state,
    } as Card['fsrs'],
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all three stat categories', () => {
      vi.mocked(useReviewQueueQuery).mockReturnValue({
        data: [] as Card[],
      } as ReturnType<typeof useReviewQueueQuery>);

      renderWithProviders();

      expect(screen.getByText('review')).toBeInTheDocument();
      expect(screen.getByText('new')).toBeInTheDocument();
      expect(screen.getByText('learn')).toBeInTheDocument();
    });

    it('should display zero counts when no cards', () => {
      vi.mocked(useReviewQueueQuery).mockReturnValue({
        data: [] as Card[],
      } as ReturnType<typeof useReviewQueueQuery>);

      renderWithProviders();

      const zeros = screen.getAllByText('0');
      expect(zeros).toHaveLength(3);
    });

    it('should display zero counts when data is undefined', () => {
      vi.mocked(useReviewQueueQuery).mockReturnValue({
        data: undefined,
      } as ReturnType<typeof useReviewQueueQuery>);

      renderWithProviders();

      const zeros = screen.getAllByText('0');
      expect(zeros).toHaveLength(3);
    });
  });

  describe('State Counting', () => {
    it('should count Review state cards correctly', () => {
      const mockCards = [
        createMockCard(State.Review),
        createMockCard(State.Review),
        createMockCard(State.Review),
        createMockCard(State.New),
        createMockCard(State.Learning),
      ];

      vi.mocked(useReviewQueueQuery).mockReturnValue({
        data: mockCards as Card[],
      } as ReturnType<typeof useReviewQueueQuery>);

      renderWithProviders();

      // Find the review count (first occurrence of '3')
      const reviewSection = screen.getByText('review').parentElement;
      expect(reviewSection?.querySelector('.text-info')).toHaveTextContent('3');
    });

    it('should count New state cards correctly', () => {
      const mockCards = [
        createMockCard(State.New),
        createMockCard(State.New),
        createMockCard(State.Review),
        createMockCard(State.Learning),
      ];

      vi.mocked(useReviewQueueQuery).mockReturnValue({
        data: mockCards as Card[],
      } as ReturnType<typeof useReviewQueueQuery>);

      renderWithProviders();

      // Find the new count
      const newSection = screen.getByText('new').parentElement;
      expect(newSection?.querySelector('.text-accent')).toHaveTextContent('2');
    });

    it('should count Learning state cards correctly', () => {
      const mockCards = [
        createMockCard(State.Learning),
        createMockCard(State.Learning),
        createMockCard(State.Learning),
        createMockCard(State.New),
        createMockCard(State.Review),
      ];

      vi.mocked(useReviewQueueQuery).mockReturnValue({
        data: mockCards as Card[],
      } as ReturnType<typeof useReviewQueueQuery>);

      renderWithProviders();

      // Find the learn count
      const learnSection = screen.getByText('learn').parentElement;
      expect(learnSection?.querySelector('.text-danger')).toHaveTextContent('3');
    });

    it('should count Relearning state cards correctly', () => {
      const mockCards = [
        createMockCard(State.Relearning),
        createMockCard(State.Relearning),
        createMockCard(State.New),
        createMockCard(State.Review),
      ];

      vi.mocked(useReviewQueueQuery).mockReturnValue({
        data: mockCards as Card[],
      } as ReturnType<typeof useReviewQueueQuery>);

      renderWithProviders();

      // Find the learn count (Relearning should be counted as learn)
      const learnSection = screen.getByText('learn').parentElement;
      expect(learnSection?.querySelector('.text-danger')).toHaveTextContent('2');
    });

    it('should count mixed Learning and Relearning states together', () => {
      const mockCards = [
        createMockCard(State.Learning),
        createMockCard(State.Relearning),
        createMockCard(State.Learning),
        createMockCard(State.Relearning),
        createMockCard(State.New),
      ];

      vi.mocked(useReviewQueueQuery).mockReturnValue({
        data: mockCards as Card[],
      } as ReturnType<typeof useReviewQueueQuery>);

      renderWithProviders();

      // Find the learn count (Learning + Relearning)
      const learnSection = screen.getByText('learn').parentElement;
      expect(learnSection?.querySelector('.text-danger')).toHaveTextContent('4');
    });

    it('should handle all states correctly in one dataset', () => {
      const mockCards = [
        // 5 Review
        createMockCard(State.Review),
        createMockCard(State.Review),
        createMockCard(State.Review),
        createMockCard(State.Review),
        createMockCard(State.Review),
        // 3 New
        createMockCard(State.New),
        createMockCard(State.New),
        createMockCard(State.New),
        // 2 Learning + 1 Relearning = 3 learn
        createMockCard(State.Learning),
        createMockCard(State.Learning),
        createMockCard(State.Relearning),
      ];

      vi.mocked(useReviewQueueQuery).mockReturnValue({
        data: mockCards as Card[],
      } as ReturnType<typeof useReviewQueueQuery>);

      renderWithProviders();

      const reviewSection = screen.getByText('review').parentElement;
      expect(reviewSection?.querySelector('.text-info')).toHaveTextContent('5');

      const newSection = screen.getByText('new').parentElement;
      expect(newSection?.querySelector('.text-accent')).toHaveTextContent('3');

      const learnSection = screen.getByText('learn').parentElement;
      expect(learnSection?.querySelector('.text-danger')).toHaveTextContent('3');
    });

    it('should ignore cards with unknown states', () => {
      const mockCards = [
        createMockCard(State.Review),
        createMockCard(State.New),
        createMockCard(State.Learning),
        { fsrs: { state: 999 } as unknown as Card['fsrs'] } as Partial<Card>, // Unknown state
        { fsrs: { state: null } as unknown as Card['fsrs'] } as Partial<Card>, // Null state
        { fsrs: {} as unknown as Card['fsrs'] } as Partial<Card>, // No state
      ];

      vi.mocked(useReviewQueueQuery).mockReturnValue({
        data: mockCards as Card[],
      } as ReturnType<typeof useReviewQueueQuery>);

      renderWithProviders();

      // Should only count the valid states
      const reviewSection = screen.getByText('review').parentElement;
      expect(reviewSection?.querySelector('.text-info')).toHaveTextContent('1');

      const newSection = screen.getByText('new').parentElement;
      expect(newSection?.querySelector('.text-accent')).toHaveTextContent('1');

      const learnSection = screen.getByText('learn').parentElement;
      expect(learnSection?.querySelector('.text-danger')).toHaveTextContent('1');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty array gracefully', () => {
      vi.mocked(useReviewQueueQuery).mockReturnValue({
        data: [] as Card[],
      } as ReturnType<typeof useReviewQueueQuery>);

      renderWithProviders();

      const zeros = screen.getAllByText('0');
      expect(zeros).toHaveLength(3);
    });

    it('should handle large numbers correctly', () => {
      const mockCards = Array(999)
        .fill(null)
        .map(() => createMockCard(State.Review));

      vi.mocked(useReviewQueueQuery).mockReturnValue({
        data: mockCards as Card[],
      } as ReturnType<typeof useReviewQueueQuery>);

      renderWithProviders();

      const reviewSection = screen.getByText('review').parentElement;
      expect(reviewSection?.querySelector('.text-info')).toHaveTextContent('999');
    });
  });
});
