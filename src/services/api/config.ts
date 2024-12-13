import { APP_CONSTANTS } from '@/utils/constants';

export const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com',
  timeout: APP_CONSTANTS.API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
};