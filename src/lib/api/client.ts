import type { ApiResponse } from "@/lib/api/types";

/**
 * Base URL của backend, ví dụ `http://localhost:3001/api`.
 * Bắt buộc cấu hình `NEXT_PUBLIC_API_URL` — frontend luôn lấy dữ liệu từ API.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    /** HTTP status — 404 phân biệt "không có nội dung" với lỗi thật. */
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Gọi backend và bóc envelope `{success, data}` / `{success:false, error}`. */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const body = (await response.json()) as ApiResponse<T>;
  if (!body.success) {
    throw new ApiError(
      body.error.code,
      body.error.message,
      response.status,
      body.error.details,
    );
  }
  return body.data;
}

/** `undefined` khi backend trả 404; lỗi khác vẫn ném ra để trang báo lỗi thật. */
export async function apiFetchOptional<T>(
  path: string,
  init?: RequestInit,
): Promise<T | undefined> {
  try {
    return await apiFetch<T>(path, init);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}
