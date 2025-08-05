/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CardView } from '../CardView';
import { createMockCard } from '@/test/utils/card-mocks';
import { createQueryMock } from '@/test/utils/query-mocks';
import { State } from 'ts-fsrs';
import type { Card } from '@/shared/cards';
import type { UseQueryResult } from '@tanstack/react-query';

// Mock the hooks
vi.mock('@/hooks/useBackgroundQueries', () => ({
  useCardsQuery: vi.fn(),
  useTodayStatsQuery: vi.fn(() => ({ data: { streak: 5 } })),
  usePauseCardMutation: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  useRemoveCardMutation: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}));

import { useCardsQuery } from '@/hooks/useBackgroundQueries';
const mockedUseCardsQuery = vi.mocked(useCardsQuery);

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);
};

describe('CardView', () => {
  it('should render loading state', () => {
    mockedUseCardsQuery.mockReturnValue(
      createQueryMock<Card[] | undefined>(undefined, {
        isLoading: true,
        isSuccess: false,
        isPending: true,
        status: 'pending',
        fetchStatus: 'fetching',
      }) as UseQueryResult<Card[]>
    );

    renderWithQueryClient(<CardView />);
    expect(screen.getByText('Loading cards...')).toBeInTheDocument();
  });

  it('should render empty state when no cards', () => {
    mockedUseCardsQuery.mockReturnValue(createQueryMock<Card[]>([]) as UseQueryResult<Card[]>);

    renderWithQueryClient(<CardView />);
    expect(screen.getByText('No cards added yet.')).toBeInTheDocument();
  });

  it('should render cards sorted by leetcode ID', () => {
    const cards = [
      createMockCard(State.New, { leetcodeId: '42', name: 'Problem 42' }),
      createMockCard(State.New, { leetcodeId: '1', name: 'Problem 1' }),
      createMockCard(State.New, { leetcodeId: '100', name: 'Problem 100' }),
    ];

    mockedUseCardsQuery.mockReturnValue(createQueryMock(cards) as UseQueryResult<Card[]>);

    renderWithQueryClient(<CardView />);

    const cardElements = screen.getAllByRole('button');
    expect(within(cardElements[0]).getByText('#1')).toBeInTheDocument();
    expect(within(cardElements[0]).getByText('Problem 1')).toBeInTheDocument();
    expect(within(cardElements[1]).getByText('#42')).toBeInTheDocument();
    expect(within(cardElements[2]).getByText('#100')).toBeInTheDocument();
  });

  it('should display difficulty with appropriate color', () => {
    const cards = [
      createMockCard(State.New, { difficulty: 'Easy' }),
      createMockCard(State.New, { difficulty: 'Medium' }),
      createMockCard(State.New, { difficulty: 'Hard' }),
    ];

    mockedUseCardsQuery.mockReturnValue(createQueryMock(cards) as UseQueryResult<Card[]>);

    renderWithQueryClient(<CardView />);

    const easyCard = screen.getByText('Easy');
    expect(easyCard).toHaveClass('text-green-500');

    const mediumCard = screen.getByText('Medium');
    expect(mediumCard).toHaveClass('text-yellow-500');

    const hardCard = screen.getByText('Hard');
    expect(hardCard).toHaveClass('text-red-500');
  });

  it('should show pause indicator for paused cards', () => {
    const cards = [
      createMockCard(State.New, { paused: true, name: 'Paused Problem' }),
      createMockCard(State.New, { paused: false, name: 'Active Problem' }),
    ];

    mockedUseCardsQuery.mockReturnValue(createQueryMock(cards) as UseQueryResult<Card[]>);

    renderWithQueryClient(<CardView />);

    // Check for pause icon on paused card
    const pausedCard = screen.getByText('Paused Problem').closest('button');
    expect(within(pausedCard!).getByTitle('Card is paused')).toBeInTheDocument();

    // Check no pause icon on active card
    const activeCard = screen.getByText('Active Problem').closest('button');
    expect(within(activeCard!).queryByTitle('Card is paused')).not.toBeInTheDocument();
  });

  it('should expand and collapse card details', () => {
    const card = createMockCard(State.Learning, {
      name: 'Test Problem',
      fsrs: {
        state: State.Learning,
        due: new Date('2024-01-01'),
        stability: 2.5,
        difficulty: 1.3,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: 5,
        lapses: 1,
        last_review: new Date('2023-12-31'),
        learning_steps: 0,
      },
    });

    mockedUseCardsQuery.mockReturnValue(createQueryMock([card]) as UseQueryResult<Card[]>);

    renderWithQueryClient(<CardView />);

    // Initially, stats should not be visible
    expect(screen.queryByText('State:')).not.toBeInTheDocument();

    // Click to expand
    const cardButton = screen.getByRole('button');
    fireEvent.click(cardButton);

    // Stats should now be visible
    expect(screen.getByText('State:')).toBeInTheDocument();
    expect(screen.getByText('Learning')).toBeInTheDocument();
    expect(screen.getByText('Reviews:')).toBeInTheDocument();
    // Use more specific query to avoid conflict with streak counter
    const reviewsRow = screen.getByText('Reviews:').parentElement;
    expect(within(reviewsRow!).getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Stability:')).toBeInTheDocument();
    expect(screen.getByText('2.5d')).toBeInTheDocument();
    expect(screen.getByText('Lapses:')).toBeInTheDocument();
    const lapsesRow = screen.getByText('Lapses:').parentElement;
    expect(within(lapsesRow!).getByText('1')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(cardButton);
    expect(screen.queryByText('State:')).not.toBeInTheDocument();
  });

  it('should handle multiple cards expanded simultaneously', () => {
    const cards = [
      createMockCard(State.New, { name: 'Problem 1', leetcodeId: '1' }),
      createMockCard(State.New, { name: 'Problem 2', leetcodeId: '2' }),
    ];

    mockedUseCardsQuery.mockReturnValue(createQueryMock(cards) as UseQueryResult<Card[]>);

    renderWithQueryClient(<CardView />);

    const cardButtons = screen.getAllByRole('button');

    // Expand first card
    fireEvent.click(cardButtons[0]);
    expect(screen.getAllByText('State:').length).toBe(1);

    // Expand second card
    fireEvent.click(cardButtons[1]);
    expect(screen.getAllByText('State:').length).toBe(2);

    // Collapse first card
    fireEvent.click(cardButtons[0]);
    expect(screen.getAllByText('State:').length).toBe(1);
  });

  it('should format dates correctly', () => {
    const card = createMockCard(State.Review, {
      createdAt: new Date('2024-01-15T12:00:00Z'),
      fsrs: {
        state: State.Review,
        due: new Date('2024-02-01T12:00:00Z'),
        stability: 1,
        difficulty: 1,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: 1,
        lapses: 0,
        last_review: new Date('2024-01-20T12:00:00Z'),
        learning_steps: 0,
      },
    });

    mockedUseCardsQuery.mockReturnValue(createQueryMock([card]) as UseQueryResult<Card[]>);

    renderWithQueryClient(<CardView />);

    // Expand card
    fireEvent.click(screen.getByRole('button'));

    // Check that the dates are present (just check that they're formatted, not exact values due to timezone)
    const addedRow = screen.getByText('Added:').parentElement;
    expect(within(addedRow!).getByText(/\w{3} \d{1,2}, \d{4}/)).toBeInTheDocument();

    const dueRow = screen.getByText('Due:').parentElement;
    expect(within(dueRow!).getByText(/\w{3} \d{1,2}, \d{4}/)).toBeInTheDocument();

    const lastRow = screen.getByText('Last:').parentElement;
    expect(within(lastRow!).getByText(/\w{3} \d{1,2}, \d{4}/)).toBeInTheDocument();
  });

  it('should show all FSRS states correctly', () => {
    const cards = [
      createMockCard(State.New, { name: 'New Card' }),
      createMockCard(State.Learning, { name: 'Learning Card' }),
      createMockCard(State.Review, { name: 'Review Card' }),
      createMockCard(State.Relearning, { name: 'Relearning Card' }),
    ];

    mockedUseCardsQuery.mockReturnValue(createQueryMock(cards) as UseQueryResult<Card[]>);

    renderWithQueryClient(<CardView />);

    // Verify all cards are rendered
    expect(screen.getByText('New Card')).toBeInTheDocument();
    expect(screen.getByText('Learning Card')).toBeInTheDocument();
    expect(screen.getByText('Review Card')).toBeInTheDocument();
    expect(screen.getByText('Relearning Card')).toBeInTheDocument();
  });

  describe('filter functionality', () => {
    it('should filter cards by name', () => {
      const cards = [
        createMockCard(State.New, { name: 'Two Sum', leetcodeId: '1' }),
        createMockCard(State.New, { name: 'Add Two Numbers', leetcodeId: '2' }),
        createMockCard(State.New, { name: 'Longest Substring', leetcodeId: '3' }),
      ];

      mockedUseCardsQuery.mockReturnValue(createQueryMock(cards) as UseQueryResult<Card[]>);

      renderWithQueryClient(<CardView />);

      // All cards should be visible initially
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
      expect(screen.getByText('Add Two Numbers')).toBeInTheDocument();
      expect(screen.getByText('Longest Substring')).toBeInTheDocument();

      // Type in filter
      const filterInput = screen.getByPlaceholderText('Filter by name or ID...');
      fireEvent.change(filterInput, { target: { value: 'two' } });

      // Only cards with "two" in name should be visible
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
      expect(screen.getByText('Add Two Numbers')).toBeInTheDocument();
      expect(screen.queryByText('Longest Substring')).not.toBeInTheDocument();
    });

    it('should filter cards by ID', () => {
      const cards = [
        createMockCard(State.New, { name: 'Problem A', leetcodeId: '123' }),
        createMockCard(State.New, { name: 'Problem B', leetcodeId: '456' }),
        createMockCard(State.New, { name: 'Problem C', leetcodeId: '789' }),
      ];

      mockedUseCardsQuery.mockReturnValue(createQueryMock(cards) as UseQueryResult<Card[]>);

      renderWithQueryClient(<CardView />);

      const filterInput = screen.getByPlaceholderText('Filter by name or ID...');
      fireEvent.change(filterInput, { target: { value: '45' } });

      // Only card with "45" in ID should be visible
      expect(screen.queryByText('Problem A')).not.toBeInTheDocument();
      expect(screen.getByText('Problem B')).toBeInTheDocument();
      expect(screen.queryByText('Problem C')).not.toBeInTheDocument();
    });

    it('should show "No cards match your filter" when filter returns no results', () => {
      const cards = [
        createMockCard(State.New, { name: 'Two Sum', leetcodeId: '1' }),
        createMockCard(State.New, { name: 'Add Two Numbers', leetcodeId: '2' }),
      ];

      mockedUseCardsQuery.mockReturnValue(createQueryMock(cards) as UseQueryResult<Card[]>);

      renderWithQueryClient(<CardView />);

      const filterInput = screen.getByPlaceholderText('Filter by name or ID...');
      fireEvent.change(filterInput, { target: { value: 'xyz' } });

      expect(screen.getByText('No cards match your filter.')).toBeInTheDocument();
      expect(screen.queryByText('Two Sum')).not.toBeInTheDocument();
      expect(screen.queryByText('Add Two Numbers')).not.toBeInTheDocument();
    });

    it('should clear filter when clear button is clicked', () => {
      const cards = [
        createMockCard(State.New, { name: 'Two Sum', leetcodeId: '1' }),
        createMockCard(State.New, { name: 'Add Two Numbers', leetcodeId: '2' }),
        createMockCard(State.New, { name: 'Longest Substring', leetcodeId: '3' }),
      ];

      mockedUseCardsQuery.mockReturnValue(createQueryMock(cards) as UseQueryResult<Card[]>);

      renderWithQueryClient(<CardView />);

      const filterInput = screen.getByPlaceholderText('Filter by name or ID...');

      // Filter to show only some cards
      fireEvent.change(filterInput, { target: { value: 'two' } });
      expect(screen.queryByText('Longest Substring')).not.toBeInTheDocument();

      // Clear button should be visible when there's text
      const clearButton = screen.getByLabelText('Clear filter');
      fireEvent.click(clearButton);

      // All cards should be visible again
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
      expect(screen.getByText('Add Two Numbers')).toBeInTheDocument();
      expect(screen.getByText('Longest Substring')).toBeInTheDocument();

      // Filter input should be empty
      expect(filterInput).toHaveValue('');
    });

    it('should perform case-insensitive filtering', () => {
      const cards = [
        createMockCard(State.New, { name: 'Two Sum', leetcodeId: '1' }),
        createMockCard(State.New, { name: 'ADD TWO NUMBERS', leetcodeId: '2' }),
        createMockCard(State.New, { name: 'Longest Substring', leetcodeId: '3' }),
      ];

      mockedUseCardsQuery.mockReturnValue(createQueryMock(cards) as UseQueryResult<Card[]>);

      renderWithQueryClient(<CardView />);

      const filterInput = screen.getByPlaceholderText('Filter by name or ID...');
      fireEvent.change(filterInput, { target: { value: 'TWO' } });

      // Both cards with "two" (case-insensitive) should be visible
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
      expect(screen.getByText('ADD TWO NUMBERS')).toBeInTheDocument();
      expect(screen.queryByText('Longest Substring')).not.toBeInTheDocument();
    });

    it('should not show filter input when there are no cards', () => {
      mockedUseCardsQuery.mockReturnValue(createQueryMock([]) as UseQueryResult<Card[]>);

      renderWithQueryClient(<CardView />);

      expect(screen.queryByPlaceholderText('Filter by name or ID...')).not.toBeInTheDocument();
      expect(screen.getByText('No cards added yet.')).toBeInTheDocument();
    });

    it('should not show filter input during loading', () => {
      mockedUseCardsQuery.mockReturnValue(
        createQueryMock<Card[] | undefined>(undefined, {
          isLoading: true,
          isSuccess: false,
          isPending: true,
          status: 'pending',
          fetchStatus: 'fetching',
        }) as UseQueryResult<Card[]>
      );

      renderWithQueryClient(<CardView />);

      expect(screen.queryByPlaceholderText('Filter by name or ID...')).not.toBeInTheDocument();
      expect(screen.getByText('Loading cards...')).toBeInTheDocument();
    });
  });
});
