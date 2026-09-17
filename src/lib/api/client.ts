import type { ApiResponse } from "@/lib/api/types";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
export const isApiConfigured = API_BASE_URL.length > 0;
export const requireApiAtBuild = process.env.BUILD_REQUIRE_API === "1";
export async function staticParamsSafe<T>(
  label: string,
  load: () => Promise<T[]>,
): Promise<T[]> {
  if (!isApiConfigured) return [];
  try {
    return await load();
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    if (requireApiAtBuild) {
      throw new Error(
        `[build] ${label}: BUILD_REQUIRE_API=1 nhưng không gọi được API — ${reason}`,
      );
    }
    console.warn(
      `[build] ${label}: không lấy được danh sách từ API (${reason}). ` +
        `Bỏ prerender — route sẽ render on-demand lúc chạy. ` +
        `Đặt BUILD_REQUIRE_API=1 nếu muốn build đỏ trong trường hợp này.`,
    );
    return [];
  }
}

export async function isApiReachableAtBuild(label: string): Promise<boolean> {
  if (!isApiConfigured) return false;
  try {
    const response = await fetch(API_BASE_URL, { cache: "no-store" });
    if (response.ok) return true;
    throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    if (requireApiAtBuild) {
      throw new Error(
        `[build] ${label}: BUILD_REQUIRE_API=1 nhưng backend không phản hồi — ${reason}`,
      );
    }
    console.warn(
      `[build] ${label}: backend không phản hồi (${reason}). ` +
        `BỎ prerender toàn bộ cây /[locale] — các trang sẽ render on-demand lúc chạy. ` +
        `Đặt BUILD_REQUIRE_API=1 nếu muốn build đỏ trong trường hợp này.`,
    );
    return false;
  }
}

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

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
