Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => 'uuid-123',
    subtle: {} as unknown,
    getRandomValues: (arr: unknown) => arr,
  } as unknown as Crypto,
});
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UpholdConnectorService } from './uphold-connector.service';

vi.mock('../config/config-service', () => ({
  ConfigService: vi.fn().mockImplementation(() => ({
    getProperty: vi.fn((key: string) => {
      const map: Record<string, string> = {
        BFF_URL: 'http://bff',
        HOST_URL: 'http://host',
        CLIENT_ID: 'clientid',
        CLIENT_SECRET: 'secret',
        API_BASE_URL: 'http://api',
      };
      return map[key];
    }),
  })),
}));

vi.mock('../http/http-service', () => ({
  HttpService: vi.fn().mockImplementation(() => ({
    get: vi.fn(async (url: string) => {
      if (url.startsWith('/api/auth-callback/')) {
        return { result: { access_token: 'token123' } };
      }
      if (url.startsWith('/api/sdk/rates/')) {
        return { result: [{ code: 'USD', name: 'US Dollar' }] };
      }
      return { result: {} };
    }),
  })),
}));

describe('UpholdConnectorService', () => {
  let service: UpholdConnectorService;

  beforeEach(() => {
    service = new UpholdConnectorService();
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('getAuthorizeUrl returns correct URL and sets state', async () => {
    const url = await service.getAuthorizeUrl('test-state');
    expect(url).toContain('authorize/clientid');
    expect(url).toContain('response_type=code');
    expect(url).toMatch(/scope=accounts%3Aread/);
    expect(url).toContain('state=test-state');
    expect(sessionStorage.getItem('state')).toBe('test-state');
  });

  it('getAuthorizeUrl generates state if not provided', async () => {
    const url = await service.getAuthorizeUrl();
    expect(url).toMatch(/state=uuid-123/);
    expect(sessionStorage.getItem('state')).toBe('uuid-123');
  });

  it('completeLogin sets token and returns it', async () => {
    const token = await service.completeLogin('code123');
    expect(token).toBe('token123');
    expect(sessionStorage.getItem('token')).toBe('token123');
  });

  it('getCurrencies returns currency list', async () => {
    const result = await service.getCurrencies('USD');
    expect(result).toEqual([{ code: 'USD', name: 'US Dollar' }]);
  });
});
