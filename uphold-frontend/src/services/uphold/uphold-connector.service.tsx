import SDK from '@uphold/uphold-sdk-javascript';

import { HttpService } from '../http/http-service';
import { APIResponse } from './uphold.types';
import { ConfigService } from '../config/config-service';

export class UpholdConnectorService {
  private cfg: ConfigService;
  private httpService: HttpService;
  constructor() {
    this.cfg = new ConfigService();
    this.httpService = new HttpService(this.cfg.getProperty('BFF_URL'));
  }

  async getAuthorizeUrl(state?: string): Promise<string> {
    /* const url = new URL(`/authorize/${encodeURIComponent(this.cfg.getProperty('CLIENT_ID'))}`, this.cfg.getProperty('HOST_URL'));
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'accounts:read');
    url.searchParams.set('state', state || crypto.randomUUID());
    const finalUrl = url.toString(); */

    try {
      const resp = await this.httpService.get<APIResponse<string>>(
        `/api/authorize-url/${state || crypto.randomUUID()}`,
      );
      console.log('[Uphold] authorize URL ->', resp.result);
      return resp.result!;
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
  }
  
  async completeLogin(code: string): Promise<string> {
    try {
      const resp = await this.httpService.get<APIResponse<string>>(
        `/api/auth-callback/${code}`,
      );
      console.log('[Uphold] authorize URL ->', resp.result);
      return resp.result!;
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }

  }
}
