import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MobileHeader from './mobile-header';

vi.mock('./mobile-header.css', () => ({}), { virtual: true });
vi.mock('../../assets/small-logo.svg', () => ({ default: '/small-logo.svg' }), { virtual: true });

describe('MobileHeader', () => {
  it('renders hamburger and logo, menu closed by default', () => {
    const { container } = render(<MobileHeader />);
    expect(container.querySelector('.hamburger')).toBeTruthy();
    expect(screen.getByAltText('Uphold logo')).toBeInTheDocument();
    expect(container.querySelector('.mobile-modal-backdrop')).toBeNull();
  });

  it('opens menu when hamburger is clicked', () => {
    const { container } = render(<MobileHeader />);
    fireEvent.click(container.querySelector('.hamburger')!);
    expect(container.querySelector('.mobile-modal-backdrop')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
    const list = within(container.querySelector('.mobile-modal')!).getByRole('list');
    expect(within(list).getByText('Personal')).toBeInTheDocument();
    expect(within(list).getByText('Business')).toBeInTheDocument();
    expect(within(list).getByText('Partners')).toBeInTheDocument();
  });

  it('closes when close button is clicked', () => {
    const { container } = render(<MobileHeader />);
    fireEvent.click(container.querySelector('.hamburger')!);
    fireEvent.click(screen.getByRole('button', { name: /close menu/i }));
    expect(container.querySelector('.mobile-modal-backdrop')).toBeNull();
  });

  it('closes when backdrop is clicked', () => {
    const { container } = render(<MobileHeader />);
    fireEvent.click(container.querySelector('.hamburger')!);
    fireEvent.click(container.querySelector('.mobile-modal-backdrop')!);
    expect(container.querySelector('.mobile-modal-backdrop')).toBeNull();
  });

  it('does not close when clicking inside the modal', async () => {
    const { container } = render(<MobileHeader />);
    fireEvent.click(container.querySelector('.hamburger')!);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument(),
    );
    fireEvent.mouseDown(container.querySelector('.mobile-modal')!);
    expect(container.querySelector('.mobile-modal-backdrop')).toBeInTheDocument();
  });

  it('closes on outside mousedown (document) when menu is open', async () => {
    const { container } = render(<MobileHeader />);
    fireEvent.click(container.querySelector('.hamburger')!);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument(),
    );
    fireEvent.mouseDown(document.body);
    await waitFor(() => expect(container.querySelector('.mobile-modal-backdrop')).toBeNull());
  });
});
