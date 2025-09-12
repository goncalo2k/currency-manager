import { fireEvent, render, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CurrencyDropdownComponent } from './currency-dropdown-component';

const mockSetSelectedCurrency = vi.fn();
const mockCurrencies = [
  { currency: 'USD', ask: 1, bid: 1, pair: 'USD/USD' },
  { currency: 'EUR', ask: 0.9, bid: 0.9, pair: 'EUR/USD' },
];
const mockOptions = [
  { label: 'USD', value: 'USD', iconUrl: '/flags/us.png' },
  { label: 'EUR', value: 'EUR', iconUrl: '/flags/eu.png' },
];
const mockFlagMap = new Map([
  ['USD', '/flags/us.png'],
  ['EUR', '/flags/eu.png'],
]);

describe('CurrencyDropdownComponent', () => {
  it('renders with default USD option', () => {
    const { container } = render(
      <CurrencyDropdownComponent
        className="currency-dropdown"
        options={[]}
        currencies={mockCurrencies}
        selectedCurrency={undefined}
        setSelectedCurrency={mockSetSelectedCurrency}
        flagMap={mockFlagMap}
      />,
    );
    const usdLabels = within(container).getAllByText('USD');
    expect(usdLabels.length).toBeGreaterThan(0);
  });

  it('renders all provided options', () => {
    const { container, getAllByText } = render(
      <CurrencyDropdownComponent
        className="currency-dropdown"
        options={mockOptions}
        currencies={mockCurrencies}
        selectedCurrency={undefined}
        setSelectedCurrency={mockSetSelectedCurrency}
        flagMap={mockFlagMap}
      />,
    );
    const trigger = container.querySelector('.p-dropdown-trigger');
    if (trigger) {
      fireEvent.click(trigger);
      const usdLabels = getAllByText((content) => content.trim() === 'USD');
      expect(usdLabels.length).toBeGreaterThan(0);
      const eurLabels = getAllByText((content) => content.trim() === 'EUR');
      expect(eurLabels.length).toBeGreaterThan(0);
    }
  });

  it('calls setSelectedCurrency on change', () => {
    const { container, getAllByText } = render(
      <CurrencyDropdownComponent
        className="currency-dropdown"
        options={mockOptions}
        currencies={mockCurrencies}
        selectedCurrency={undefined}
        setSelectedCurrency={mockSetSelectedCurrency}
        flagMap={mockFlagMap}
      />,
    );
    const trigger = container.querySelector('.p-dropdown-trigger');
    if (trigger) {
      fireEvent.click(trigger);
      const eurOptions = getAllByText('EUR');
      fireEvent.click(eurOptions[eurOptions.length - 1]);
      expect(mockSetSelectedCurrency).toHaveBeenCalled();
    }
  });
});
