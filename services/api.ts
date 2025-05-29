import { MD5 } from 'crypto-js';

const BASE_URL = 'https://test-giftcard8-api.gcard8.com';
const APP_KEY = 'f55b967cad863f21a385e904dceae165';
const APP_ID = 'ios-v1';

export interface Country {
  id: number;
  name: string;
  short_name: string;
  currency_name: string;
  currency_symbol: string;
  national_flag: string;
  withdrawal_method: number;
  money_detail: number;
  image: string;
  area_number: string;
  code: string;
  rebate_money: string;
  rebate_money_register: string;
}

interface ApiResponse<T> {
  success: boolean;
  code: string;
  msg: string;
  data: T;
}

class ApiService {
  private static instance: ApiService;

  private constructor() {}

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private generateSignature(params: Record<string, string>): string {
    // Sort parameters alphabetically
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc: Record<string, string>, key: string) => {
        acc[key] = params[key];
        return acc;
      }, {});

    // Create parameter string
    const paramString = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Generate MD5 hash
    return MD5(paramString + APP_KEY).toString();
  }

  private async request<T>(
    endpoint: string,
    method: string = 'GET',
    params: Record<string, string> = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Add appid to params
      const allParams = {
        ...params,
        appid: APP_ID,
      };

      // Generate signature
      const md5sign = this.generateSignature(allParams);

      // Construct URL with parameters and signature
      const queryString = Object.entries({ ...allParams, md5sign })
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

      const url = `${BASE_URL}${endpoint}?${queryString}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<T> = await response.json();
      
      if (!data.success) {
        throw new Error(data.msg || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getCountryList(): Promise<Country[]> {
    try {
      const response = await this.request<Country[]>('/gc/public/countrylist', 'POST');
      
      if (!Array.isArray(response.data)) {
        console.warn('Country list data is not an array:', response.data);
        return [];
      }

      return response.data;
    } catch (error) {
      console.error('Failed to fetch country list:', error);
      return [];
    }
  }
}

export const api = ApiService.getInstance();