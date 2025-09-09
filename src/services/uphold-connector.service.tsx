import SDK from '@uphold/uphold-sdk-javascript';
import { ConfigService } from './config-service';

export class UpholdConnectorService {
  private sdk: any;
  constructor(private cfg: ConfigService) {
    this.sdk = new SDK({
      baseUrl: this.cfg.getProperty('API_HOST_URI'),
      clientId: this.cfg.getProperty('CLIENT_ID'),
      clientSecret: this.cfg.getProperty('CLIENT_SECRET'),
    });
  }

  getAuthorizeUrl(state?: string) {
    const url = new URL('/authorize', this.cfg.getProperty('HOST_URL'));
    url.searchParams.set('client_id', this.cfg.getProperty('CLIENT_ID'));
    url.searchParams.set('redirect_uri', this.cfg.getProperty('REDIRECT_URI'));
    url.searchParams.set('response_type', 'code');
    if (state) url.searchParams.set('state', state);
    const finalUrl = url.toString();
    console.log('[Uphold] authorize URL ->', finalUrl);
    return finalUrl;
  }

  async completeLogin(code: string) {
    await this.sdk.authorize(code);
    return this.sdk.getMe();
  }

  async getCurrenciesFromTicker(): Promise<string[]> {
    const data = await this.sdk.getTicker();
    const set = new Set<string>();
    for (const it of Array.isArray(data) ? data : []) {
      const pair = it?.pair;
      if (typeof pair === 'string') {
        const parts = pair.includes('-') ? pair.split('-') : (pair.match(/[A-Z]{2,5}/g) ?? []);
        parts.forEach(p => set.add(p));
      }
    }
    return Array.from(set).sort();
  }
}
