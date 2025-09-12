import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Header from './header-component';

describe('Header', () => {
  it('renders all navigation links', () => {
    render(<Header user={null} onSignIn={vi.fn()} />);
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('Business')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });

  it('renders Uphold logo with link', () => {
    render(<Header user={null} onSignIn={vi.fn()} />);
    const logo = screen.getByAltText('Uphold logo');
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', 'https://uphold.com');
  });

  it('shows Log In button when user is not present', () => {
    const onSignIn = vi.fn();
    render(<Header user={null} onSignIn={onSignIn} />);
    const loginBtn = screen.getByText('Log In');
    expect(loginBtn).toBeInTheDocument();
    fireEvent.click(loginBtn);
    expect(onSignIn).toHaveBeenCalled();
  });

  it('shows Log Out when user is present', () => {
    render(<Header user={{ name: 'Test' }} onSignIn={vi.fn()} />);
    expect(screen.getByText('Log Out')).toBeInTheDocument();
  });
});
