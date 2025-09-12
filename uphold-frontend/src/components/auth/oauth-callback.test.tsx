import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OAuthCallback } from './oauth-callback';

describe('OAuthCallback', () => {
  it('resolves to an element with expected heading text', async () => {
    const element = await OAuthCallback();
    render(element);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toBe("resp ? 'Success' : 'Error'");
  });

  it('returns a promise', () => {
    const result: Promise<React.ReactElement> = OAuthCallback();
    expect(typeof result.then).toBe('function');
  });
});
