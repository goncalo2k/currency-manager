import axios from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let bootClient: any;
vi.mock('axios', () => {
  const create = vi.fn(() => {
    if (!bootClient) {
      bootClient = {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      };
    }
    return bootClient;
  });
  return { default: { create }, create };
});

describe('HttpService', () => {
  let HttpService: any;
  let http: any;
  let client: any;

  beforeEach(async () => {
    vi.resetModules();
    client = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    };
    (axios as any).create.mockImplementation(() => client);
    ({ HttpService } = await import('./http-service'));
    http = new HttpService('http://test');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls get and returns data', async () => {
    client.get.mockResolvedValue({ data: 'result' });
    const result = await http.get<string>('/test');
    expect(client.get).toHaveBeenCalledWith('/test', undefined);
    expect(result).toBe('result');
  });

  it('calls post and returns data', async () => {
    client.post.mockResolvedValue({ data: 'posted' });
    const result = await http.post<string>('/test', { foo: 'bar' });
    expect(client.post).toHaveBeenCalledWith('/test', { foo: 'bar' }, undefined);
    expect(result).toBe('posted');
  });

  it('calls put and returns data', async () => {
    client.put.mockResolvedValue({ data: 'updated' });
    const result = await http.put<string>('/test', { foo: 'baz' });
    expect(client.put).toHaveBeenCalledWith('/test', { foo: 'baz' }, undefined);
    expect(result).toBe('updated');
  });

  it('calls delete and returns data', async () => {
    client.delete.mockResolvedValue({ data: 'deleted' });
    const result = await http.delete<string>('/test');
    expect(client.delete).toHaveBeenCalledWith('/test', undefined);
    expect(result).toBe('deleted');
  });

  it('sets Authorization header if token exists', () => {
    const getItem = vi.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('mytoken');
    const addToken = client.interceptors.request.use.mock.calls[0][0];
    const cfg = addToken({ headers: {} });
    expect(cfg.headers.Authorization).toBe('Bearer mytoken');
    getItem.mockRestore();
  });

  it('does not set Authorization header if token missing', () => {
    const getItem = vi.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(null);
    const addToken = client.interceptors.request.use.mock.calls[0][0];
    const cfg = addToken({ headers: {} });
    expect(cfg.headers.Authorization).toBeUndefined();
    getItem.mockRestore();
  });

  it('warns on 401 in response interceptor and rethrows', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const onError = client.interceptors.response.use.mock.calls[0][1];
    const err = { response: { status: 401 } };
    await expect(onError(err)).rejects.toBe(err);
    expect(warn).toHaveBeenCalled();
  });

  it('passes through non-401 errors without warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const onError = client.interceptors.response.use.mock.calls[0][1];
    const err = { response: { status: 500 } };
    await expect(onError(err)).rejects.toBe(err);
    expect(warn).not.toHaveBeenCalled();
  });
});
