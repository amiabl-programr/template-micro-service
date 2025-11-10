export function successResponse<T>(
  data: T,
  message = 'ok'
): {
  success: boolean;
  data: T;
  message: string;
  meta: any;
} {
  return {
    success: true,
    data,
    message,
    meta: {
      total: Array.isArray(data) ? data.length : 1,
      limit: 1,
      page: 1,
      total_pages: 1,
      has_next: false,
      has_previous: false
    }
  };
}
