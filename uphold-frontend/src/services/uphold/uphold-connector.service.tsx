import SDK from '@uphold/uphold-sdk-javascript';

import { HttpService } from '../http/http-service';
import { APIResponse } from './uphold.types';
import { ConfigService } from '../config/config-service';

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
      //version: "v0",
    });
  }

  async getAuthorizeUrl(state?: string): Promise<string> {
    /* const url = new URL(`/authorize/${encodeURIComponent(this.cfg.getProperty('CLIENT_ID'))}`, this.cfg.getProperty('HOST_URL'));
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'accounts:read');
    url.searchParams.set('state', state || crypto.randomUUID());
    const finalUrl = url.toString(); */

    state = state || crypto.randomUUID();
    try {
      /*       const resp = await this.httpService.get<APIResponse<string>>(`/api/authorize-url/${state}`);
      console.log('[Uphold] authorize URL ->', resp.result);
      return resp.result!; */
      sessionStorage.setItem('state', state);
      const url = new URL(
        `/authorize/${encodeURIComponent(this.cfg.getProperty('CLIENT_ID')!)}`,
        this.cfg.getProperty('API_BASE_URL')!,
      );
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('scope', 'accounts:read');
      url.searchParams.set('state', state || crypto.randomUUID());
      const finalUrl = url.toString();
      console.log('[Uphold] authorize URL ->', finalUrl);
      return finalUrl;
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
  }

  async completeLogin(code: string): Promise<string> {
    try {
      debugger;
      //const resp= await this.sdk.authorize(code);
      /* const form = new FormData();
      form.append('grant_type', 'authorization_code');
      form.append('client_id', this.cfg.getProperty('CLIENT_ID')!);
      form.append('client_secret', this.cfg.getProperty('CLIENT_SECRET')!);
      form.append('code', code);
    

      const resp = await this.httpService.post('https://api-sandbox.uphold.com/oauth2/token', form); */

      const resp = await this.httpService.get<APIResponse<any>>(`/api/auth-callback/${code}`);
      console.log('[Uphold] authorize URL ->', resp);
      const token = resp.result.access_token as string;
      sessionStorage.setItem('token', token);
      this.sdk.setToken(token);
      return token
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
  }

  async getCurrencies(curreny: string = 'USD'): Promise<APIResponse<any>> {
    const resp = await this.httpService.get<APIResponse<any>>(`/api/sdk/rates/${curreny}`);
    return resp.result;
  }
}
