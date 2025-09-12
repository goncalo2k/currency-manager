import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CurrencyListContainerComponent } from './currency-container-component';

const mockFlagMap = new Map([
  ['USD', '/flags/us.png'],
  ['EUR', '/flags/eu.png'],
  ['BTC', '/flags/btc.png'],
]);
const mockCurrencyMap = new Map([
  ['USD', 1],
  ['EUR', 0.9],
  ['BTC', 0.00002],
]);

describe('CurrencyListContainerComponent', () => {
  it('renders skeletons when loading', () => {
    const { container } = render(
      <CurrencyListContainerComponent
        loading={true}
        currencyMap={mockCurrencyMap}
        flagMap={mockFlagMap}
        value={100}
        selectedCurrency={{ currency: 'USD' }}
      />,
    );
    expect(container.querySelectorAll('.entry-item-container').length).toBe(10);
  });

  it('renders currency entries when not loading', () => {
    render(
      <CurrencyListContainerComponent
        loading={false}
        currencyMap={mockCurrencyMap}
        flagMap={mockFlagMap}
        value={100}
        selectedCurrency={{ currency: 'USD' }}
      />,
    );
    expect(screen.queryByText('USD')).not.toBeInTheDocument();
    expect(screen.getByText('EUR')).toBeInTheDocument();
    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByText((100 * 0.9).toFixed(6))).toBeInTheDocument();
    expect(screen.getByText((100 * 0.00002).toFixed(6))).toBeInTheDocument();
  });

  it('filters out selectedCurrency from entries', () => {
    render(
      <CurrencyListContainerComponent
        loading={false}
        currencyMap={mockCurrencyMap}
        flagMap={mockFlagMap}
        value={100}
        selectedCurrency={{ currency: 'EUR' }}
      />,
    );
    expect(screen.queryByText('EUR')).not.toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('BTC')).toBeInTheDocument();
  });

  it('renders flag icons if flagMap has url', () => {
    render(
      <CurrencyListContainerComponent
        loading={false}
        currencyMap={mockCurrencyMap}
        flagMap={mockFlagMap}
        value={100}
        selectedCurrency={{ currency: 'USD' }}
      />,
    );
    expect(document.querySelectorAll('img[src="/flags/eu.png"]').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('img[src="/flags/btc.png"]').length).toBeGreaterThan(0);
  });
});
