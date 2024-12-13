import { apiClient } from './client';
import { handleApiError } from './error-handler';

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(handleApiError(error))
);