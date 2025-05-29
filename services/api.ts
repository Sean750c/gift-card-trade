import { MD5 } from 'crypto-js';

const BASE_URL = 'https://test-giftcard8-api.gcard8.com';
const APP_KEY = 'f55b967cad863f21a385e904dceae165';
const APP_ID = 'web-v1';

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
      // 合并参数（包含 appid）
      const allParams = { ...params, appid: APP_ID };

      // 生成签名（根据 API 要求用 sign 或 md5sign）
      const sign = this.generateSignature(allParams);

      // 基础请求配置
      const headers = new Headers({
        'User-Agent': 'Your-App-Name/1.0.0', // 按需修改
      });

      const requestOptions: RequestInit = { method, headers };

      // 区分 GET 和其他方法
      if (method.toUpperCase() === 'GET') {
        // GET：参数拼接到 URL
        const query = new URLSearchParams({ ...allParams, sign });
        endpoint += `?${query.toString()}`;
      } else {
        // POST/PUT 等：参数放 body
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        const body = new URLSearchParams({ ...allParams, sign });
        requestOptions.body = body;
      }

      // 发送请求
      const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP 错误！状态码: ${response.status}`);
      }

      const data: ApiResponse<T> = await response.json();
      
      if (!data.success) {
        throw new Error(data.msg || 'API 请求失败');
      }

      return data;
    } catch (error) {
      console.error('请求失败:', error);
      throw error; // 或返回统一错误格式
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