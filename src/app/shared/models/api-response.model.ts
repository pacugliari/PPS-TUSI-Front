export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  payload: T | null;
  errors: ApiError;
}

export type ApiError = Array<Record<string, string>>
