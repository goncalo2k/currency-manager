import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockUpholdService = vi.hoisted(() => ({
  completeLogin: vi.fn(async () => 'user'),
  getAuthorizeUrl: vi.fn(async () => 'http://auth-url'),
}));

vi.mock('./components/currencies/currency-component/currency-component', () => ({
  CurrencyComponent: vi.fn(() => <div data-testid="currency-component" />),
}));
vi.mock('./components/footer/footer-component', () => ({
  default: vi.fn(() => <footer data-testid="footer" />),
}));
vi.mock('./components/header/header-component', () => ({
  default: vi.fn(({ user, onSignIn }: any) => (
    <header data-testid="header">
      <span>{user ? 'Signed In' : 'Not Signed In'}</span>
      <button onClick={onSignIn}>Sign In</button>
    </header>
  )),
}));
vi.mock('./components/mobile-header/mobile-header', () => ({
  default: vi.fn(() => <div data-testid="mobile-header" />),
}));
vi.mock('./services/uphold/uphold-connector.service', () => ({
  UpholdConnectorService: vi.fn(() => mockUpholdService),
}));

import App from './App';

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'location', {
      value: new URL('http://localhost/'),
      writable: true,
    });
    sessionStorage.clear();
  });

  it('renders main layout and components', () => {
    render(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-header')).toBeInTheDocument();
    expect(screen.getByTestId('currency-component')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('Currency Converter')).toBeInTheDocument();
    expect(screen.getByText(/competitive and transparent pricing/i)).toBeInTheDocument();
  });

  it('calls signIn and redirects to authorize url', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Sign In'));
    await waitFor(() => {
      expect(String(window.location)).toBe('http://auth-url/');
    });
  });

  it('handles login callback and sets user', async () => {
    Object.defineProperty(window, 'location', {
      value: new URL('http://localhost/?code=abc&state=xyz'),
      writable: true,
    });
    sessionStorage.setItem('state', 'xyz');
    render(<App />);
    await waitFor(() => {
      expect(mockUpholdService.completeLogin).toHaveBeenCalledWith('abc');
    });
  });
});
