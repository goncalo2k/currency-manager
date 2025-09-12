import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IconComponent } from './icon-component';

describe('IconComponent', () => {
  it('renders an img with the correct src and default size', () => {
    const { container } = render(<IconComponent src="/flags/test.png" alt="test" />);
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('/flags/test.png');
    expect(img?.getAttribute('alt')).toBe('test');
    expect(img?.getAttribute('width')).toBe('24');
    expect(img?.getAttribute('height')).toBe('24');
  });

  it('applies custom size', () => {
    const { container } = render(<IconComponent src="/flags/test.png" alt="test" size={32} />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('width')).toBe('32');
    expect(img?.getAttribute('height')).toBe('32');
  });

  it('passes through additional props', () => {
    const { container } = render(
      <IconComponent src="/flags/test.png" alt="test" data-testid="icon-img" />,
    );
    const img = container.querySelector('img[data-testid="icon-img"]');
    expect(img).toBeTruthy();
  });
});
