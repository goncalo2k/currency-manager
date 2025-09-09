// src/services/uphold-connector.service.ts
import SDK from "@uphold/uphold-sdk-javascript";

export class UpholdConnectorService {
  private sdk: any;
  constructor() {
    this.sdk = new SDK({
      baseUrl: process.env.UPHOLD_API_BASE_URL,
      clientId: process.env.UPHOLD_CLIENT_ID,
      clientSecret: process.env.UPHOLD_CLIENT_SECRET,
      version: "v0",
    });
  }

  getAuthorizeUrl(state?: string): string {
    const url = new URL(
      `/authorize/${encodeURIComponent(process.env.UPHOLD_CLIENT_ID!)}`,
      process.env.UPHOLD_API_BASE_URL!
    );url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'accounts:read');
    url.searchParams.set('state', state || crypto.randomUUID());
    const finalUrl = url.toString();
    console.log("[Uphold] authorize URL ->", finalUrl);
    return finalUrl;
  }

  async completeLogin(code: string): Promise<any> {
    console.log('code',code);
    return await this.sdk.authorize(code).then(() => this.sdk.getMe())
    .then(user => {
      console.log(user);
    });;
  }
}
