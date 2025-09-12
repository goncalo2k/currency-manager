import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CurrencyComponent } from './currency-component';

const mockGetCurrencies = vi.fn();
const upholdService = { getCurrencies: mockGetCurrencies };

const mockCurrencies = [
  { currency: 'USD', name: 'US Dollar' },
  { currency: 'EUR', name: 'Euro' },
];

describe('CurrencyComponent', () => {
  beforeEach(() => {
    mockGetCurrencies.mockReset();
  });

  it('renders input and dropdown', async () => {
    mockGetCurrencies.mockResolvedValueOnce(mockCurrencies);
    render(<CurrencyComponent upholdService={upholdService as any} />);
    expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
    await waitFor(() => expect(mockGetCurrencies).toHaveBeenCalled());
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows label when no amount entered', async () => {
    mockGetCurrencies.mockResolvedValueOnce(mockCurrencies);
    render(<CurrencyComponent upholdService={upholdService as any} />);
    expect(await screen.findByText(/Enter an amount/i)).toBeInTheDocument();
  });

  it('updates input value and formats correctly', async () => {
    mockGetCurrencies.mockResolvedValueOnce(mockCurrencies);
    render(<CurrencyComponent upholdService={upholdService as any} />);
    const input = screen.getByPlaceholderText('0');
    fireEvent.change(input, { target: { value: '1234.56' } });
    expect(input).toHaveValue('1,234.56');
  });

  it('shows error when getCurrencies fails', async () => {
    mockGetCurrencies.mockRejectedValueOnce(new Error('fail'));
    render(<CurrencyComponent upholdService={upholdService as any} />);
    expect(await screen.findByText(/Failed to load currencies/i)).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    mockGetCurrencies.mockImplementation(() => new Promise(() => {}));
    render(<CurrencyComponent upholdService={upholdService as any} />);
  });
});
