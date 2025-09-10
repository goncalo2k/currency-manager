// src/services/uphold-connector.service.ts
import SDK from "@uphold/uphold-sdk-javascript";
import axios from "axios";
import { FriendlyClient, NewSdk } from "./uphold";

export class UpholdConnectorService {
  private sdk: any;
  constructor() {
    const currSdk = new NewSdk(/* {
      baseUrl: process.env.UPHOLD_API_BASE_URL,
      clientId: process.env.UPHOLD_CLIENT_ID,
      clientSecret: process.env.UPHOLD_CLIENT_SECRET,
      version: "v0",
    } */); //makeUpholdSdk();
    (currSdk as any).requestClient = new FriendlyClient();
    this.sdk = currSdk;
  }

  getAuthorizeUrl(state?: string): string {
    const url = new URL(
      `/authorize/${encodeURIComponent(process.env.UPHOLD_CLIENT_ID!)}`,
      process.env.UPHOLD_API_BASE_URL!
    );
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "accounts:read");
    url.searchParams.set("state", state || crypto.randomUUID());
    const finalUrl = url.toString();
    console.log("[Uphold] authorize URL ->", finalUrl);
    return finalUrl;
  }

  async completeLogin(code: string): Promise<any> {
    console.log("code", code);
    try {
      return await this.sdk.authorize(code);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  async getRates(): Promise<string> {
    const http = axios.create({
      baseURL: "https://api-sandbox.uphold.com",
      timeout: 10000,
      headers: {
        Accept: "application/json",
        "User-Agent": "UpholdDemoBFF/1.0 (+https://example.com)",
      },
      // Let us inspect 4xx bodies (Cloudflare will send HTML)
      validateStatus: (s) => s < 500,
    });
    const resp = await http.get("/v0/ticker");
    return resp.data;
  }

  async getCountries(): Promise<string> {
    const http = axios.create({
      baseURL: "https://api-sandbox.uphold.com",
      timeout: 10000,
      headers: {
        Accept: "application/json",
        "User-Agent": "UpholdDemoBFF/1.0 (+https://example.com)",
      },
      // Let us inspect 4xx bodies (Cloudflare will send HTML)
      validateStatus: (s) => s < 500,
    });
    console.log("here");
    const resp = await http.get("/v0/countries");
    return resp.data;
  }
  async getCountriesSdk(): Promise<string> {
    const resp = this.sdk.getTicker();
    return resp;
  }
}
