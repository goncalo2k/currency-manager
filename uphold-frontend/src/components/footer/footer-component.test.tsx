import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Footer from './footer-component';

describe('Footer', () => {
  it('renders the divider', () => {
    render(<Footer />);
    expect(document.querySelector('.divider')).toBeTruthy();
  });

  it('renders the Uphold logo', () => {
    render(<Footer />);
    expect(screen.getByAltText('Uphold Logo')).toBeInTheDocument();
  });

  it('renders all section headings', () => {
    render(<Footer />);
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByText('Social')).toBeInTheDocument();
  });

  it('renders all product links', () => {
    render(<Footer />);
    expect(screen.getByText('Consumers')).toBeInTheDocument();
    expect(screen.getByText('Business')).toBeInTheDocument();
    expect(screen.getByText('Partners')).toBeInTheDocument();
  });

  it('renders all company links', () => {
    render(<Footer />);
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Careers')).toBeInTheDocument();
    expect(screen.getByText('Press')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it('renders all help links', () => {
    render(<Footer />);
    expect(screen.getByText('FAQ & Support')).toBeInTheDocument();
    expect(screen.getByText('Platform Status')).toBeInTheDocument();
    expect(screen.getByText('Criptionary')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
  });

  it('renders all social links', () => {
    render(<Footer />);
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
  });

  it('renders app store and play store logos', () => {
    render(<Footer />);
    expect(screen.getByAltText('Apple Logo')).toBeInTheDocument();
    expect(screen.getByAltText('Google Play Logo')).toBeInTheDocument();
  });

  it('renders language selector', () => {
    render(<Footer />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Portuguese')).toBeInTheDocument();
  });
});
