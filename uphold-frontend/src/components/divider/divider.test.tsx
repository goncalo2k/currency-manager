import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Divider from './divider';

vi.mock('./divider.css', () => ({}), { virtual: true });

describe('Divider', () => {
  it('renders a div with class "divider"', () => {
    const { container } = render(<Divider />);
    const el = container.querySelector('.divider') as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.tagName).toBe('DIV');
  });

  it('has no children and no text content', () => {
    const { container } = render(<Divider />);
    const el = container.querySelector('.divider') as HTMLElement;
    expect(el.childElementCount).toBe(0);
    expect(el.textContent).toBe('');
  });
});
