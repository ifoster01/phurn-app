import { AxiosError } from 'axios';
import { ApiError, ApiErrorCode } from './error-types';

export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof AxiosError) {
    const status = error.response?.status || 500;
    
    switch (status) {
      case 401:
        return new ApiError(
          'Unauthorized access',
          ApiErrorCode.UNAUTHORIZED,
          status
        );
      case 404:
        return new ApiError(
          'Resource not found',
          ApiErrorCode.NOT_FOUND,
          status
        );
      case 422:
        return new ApiError(
          'Validation error',
          ApiErrorCode.VALIDATION_ERROR,
          status,
          error.response?.data
        );
      default:
        return new ApiError(
          'Server error',
          ApiErrorCode.SERVER_ERROR,
          status
        );
    }
  }

  return new ApiError(
    'Network error',
    ApiErrorCode.NETWORK_ERROR,
    0
  );
}