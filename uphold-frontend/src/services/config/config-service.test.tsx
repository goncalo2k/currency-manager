import { afterEach, describe, expect, it } from 'vitest';
import { ConfigService } from './config-service';

describe('ConfigService', () => {
  const OLD_ENV = { ...import.meta.env };

  afterEach(() => {
    Object.assign(import.meta.env, OLD_ENV);
  });

  it('returns the correct property value', () => {
    import.meta.env.VITE_TEST_KEY = 'test-value';
    const config = new ConfigService();
    expect(config.getProperty('TEST_KEY')).toBe('test-value');
  });

  it('throws error if property is missing', () => {
    delete import.meta.env.VITE_MISSING_KEY;
    const config = new ConfigService();
    expect(() => config.getProperty('MISSING_KEY')).toThrow('Missing env for MISSING_KEY');
  });
});
