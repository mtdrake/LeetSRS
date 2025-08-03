/**
 * @vitest-environment happy-dom
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from '../Header';

describe('Header', () => {
  it('renders the LeetReps title', () => {
    render(<Header />);

    const title = screen.getByText('LeetReps');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-xl', 'font-bold', 'text-primary');
  });

  it('renders children when provided', () => {
    render(
      <Header>
        <button>Test Button</button>
      </Header>
    );

    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
  });
});
