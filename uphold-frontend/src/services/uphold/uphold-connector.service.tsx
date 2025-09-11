import SDK from '@uphold/uphold-sdk-javascript';

import { HttpService } from '../http/http-service';
import { APIResponse } from './uphold.types';
import { ConfigService } from '../config/config-service';
import { Currency } from '@/components/currencies/currency-utils';

export class UpholdConnectorService {
  private cfg: ConfigService;
  private httpService: HttpService;
  private sdk: SDK;
  constructor() {
    this.cfg = new ConfigService();
    this.httpService = new HttpService(this.cfg.getProperty('BFF_URL'));
    this.sdk = new SDK({
      baseUrl: this.cfg.getProperty('HOST_URL'),
      clientId: this.cfg.getProperty('CLIENT_ID'),
      clientSecret: this.cfg.getProperty('CLIENT_SECRET'),
    });
  }

  async getAuthorizeUrl(state?: string): Promise<string> {
    state = state || crypto.randomUUID();
    try {
      sessionStorage.setItem('state', state);
      const url = new URL(
        `/authorize/${encodeURIComponent(this.cfg.getProperty('CLIENT_ID')!)}`,
        this.cfg.getProperty('API_BASE_URL')!,
      );
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('scope', 'accounts:read');
      url.searchParams.set('state', state || crypto.randomUUID());
      const finalUrl = url.toString();
      return finalUrl;
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
  }

  async completeLogin(code: string): Promise<string> {
    try {
      const resp = await this.httpService.get<APIResponse<{access_token: string}>>(`/api/auth-callback/${code}`);
      const token = resp.result.access_token as string;
      sessionStorage.setItem('token', token);
      this.sdk.setToken(token);
      return token
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
  }

  async getCurrencies(curreny: string = 'USD'): Promise<Currency[]> {
    const resp = await this.httpService.get<APIResponse<Currency[]>>(`/api/sdk/rates/${curreny}`);
    return resp.result;
  }
}
