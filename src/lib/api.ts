import { apiClient } from './axios';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: any;
  params?: Record<string, any>;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { method = 'GET', data, params } = options;

  const config = {
    method,
    url: endpoint,
    data,
    params,
  };

  const response = await apiClient.request(config);
  return response.data;
}