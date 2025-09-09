// src/services/http.service.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export class HttpService {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000, // 10s timeout
      headers: {
        "Content-Type": "application/json"
      }
    });

    // Interceptors for auth, logging, etc.
    this.client.interceptors.request.use(
      (config) => {
        // Example: attach auth token if stored
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        // Central error handling (401, 500, etc.)
        if (error.response?.status === 401) {
          console.warn("Unauthorized — maybe redirect to login");
        }
        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get<T>(url, config).then((res) => res.data);
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post<T>(url, data, config).then((res) => res.data);
  }

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put<T>(url, data, config).then((res) => res.data);
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete<T>(url, config).then((res) => res.data);
  }
}

// Export a singleton with your backend’s base URL
export const httpService = new HttpService(
  import.meta.env.VITE_API_URL || "http://localhost:4000"
);
