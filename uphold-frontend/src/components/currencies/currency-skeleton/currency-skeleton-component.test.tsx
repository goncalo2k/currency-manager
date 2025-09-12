import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CurrencySkeletonComponent } from './currency-skeleton-component';

describe('CurrencySkeletonComponent', () => {
  it('renders the skeleton container', () => {
    const { container } = render(<CurrencySkeletonComponent />);
    expect(container.querySelector('.entry-item-container')).toBeTruthy();
  });

  it('renders skeleton amount, icon, and code', () => {
    const { container } = render(<CurrencySkeletonComponent />);
    expect(container.querySelector('.currency-skeleton-amount')).toBeTruthy();
    expect(container.querySelector('.currency-skeleton-icon')).toBeTruthy();
    expect(container.querySelector('.currency-skeleton-code')).toBeTruthy();
  });

  it('applies custom className if provided', () => {
    const { container } = render(<CurrencySkeletonComponent className="custom-class" />);
    expect(container.querySelector('.entry-item-container')?.className).toContain('custom-class');
  });
});
