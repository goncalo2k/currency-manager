// src/services/uphold.ts
import SDK, { RequestClient } from "@uphold/uphold-sdk-javascript";

/** Custom transport that strips browser-only headers and adds safe defaults */
export class FriendlyClient extends RequestClient {
  // SDK expects: (url, method, body, headers)
  request(
    url: string,
    method: string,
    body: any,
    headers: Record<string, string> = {}
  ) {
    // Start with a clean slate
    const safeHeaders: Record<string, string> = {
      Accept: "application/json",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "UpholdBFF/1.0 (+https://yourdomain.example)",
      ...headers,
    };

    // Remove anything browser-ish or leaky
    delete (safeHeaders as any).Origin;
    delete (safeHeaders as any).Referer;
    delete (safeHeaders as any).Cookie;
    delete (safeHeaders as any)["Sec-Fetch-Site"];
    delete (safeHeaders as any)["Sec-Fetch-Mode"];
    delete (safeHeaders as any)["Sec-Fetch-Dest"];
    delete (safeHeaders as any)["Sec-Ch-Ua"];
    delete (safeHeaders as any)["Sec-Ch-Ua-Platform"];
    delete (safeHeaders as any)["Sec-Ch-Ua-Mobile"];

    // Let the base client do the request with our sanitized headers
    return super.request(url, method, body, safeHeaders);
  }
}

export class NewSdk extends SDK {
  client: FriendlyClient;
  constructor() {
    // ✅ Pass required options to SDK constructor
    super({
      baseUrl: process.env.UPHOLD_API_BASE_URL, // e.g. https://api-sandbox.uphold.com
      clientId: process.env.UPHOLD_CLIENT_ID!,
      clientSecret: process.env.UPHOLD_CLIENT_SECRET!,
      version: "v0",
    });

    // ✅ Swap the transport
    this.client = new FriendlyClient();
  }
}
