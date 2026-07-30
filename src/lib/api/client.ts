import type { ApiResponse } from "@/lib/api/types";

/**
 * Base URL của backend, ví dụ `http://localhost:3001/api`.
 * Bắt buộc cấu hình `NEXT_PUBLIC_API_URL` — frontend luôn lấy dữ liệu từ API.
 * Tiền tố `NEXT_PUBLIC_` để Next inline giá trị vào cả bundle trình duyệt
 * (contact form, search chạy phía client cũng cần base URL này).
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/**
 * Môi trường build không có API (vd. CI) → `generateStaticParams` trả rỗng để
 * bỏ prerender thay vì `fetch` URL tương đối nổ `Failed to parse URL`. Trang
 * chi tiết vẫn render on-demand lúc chạy (ISR `revalidate` ở layout).
 */
export const isApiConfigured = API_BASE_URL.length > 0;

/**
 * Hợp đồng build tường minh: đặt `BUILD_REQUIRE_API=1` thì build **bắt buộc**
 * prerender được, lỗi gọi API lúc build sẽ làm build đỏ. Dùng cho pipeline đã tự
 * dựng backend và muốn chắc chắn trang tĩnh được sinh ra.
 */
export const requireApiAtBuild = process.env.BUILD_REQUIRE_API === "1";

/**
 * Bọc `generateStaticParams` để **backend không phản hồi không làm sập build**.
 *
 * Vì sao cần (AUDIT-M2 / D10): `isApiConfigured` chỉ xử lý trường hợp *thiếu*
 * `NEXT_PUBLIC_API_URL` (CI). Khi biến CÓ giá trị mà backend không trả lời thì
 * `fetch` ném `ECONNREFUSED` và `next build` chết hẳn:
 * `Failed to collect page data for /[locale]/tin-tuc/[slug]` (đã đo được).
 * Đây là rủi ro thật khi deploy: backend đang ở **Render Free — ngủ sau 15 phút**,
 * nên một lần build của Vercel trúng lúc backend đang ngủ sẽ thất bại.
 *
 * Cách xử lý **không che lỗi**:
 * - Log cảnh báo kèm nguyên văn lý do lỗi (thấy được ECONNREFUSED trong log build).
 * - Trả `[]` → bỏ prerender, route vẫn render **on-demand** lúc chạy
 *   (`dynamicParams` mặc định true + ISR `revalidate` ở layout). Hành vi runtime
 *   giữ nguyên, chỉ mất phần tĩnh hoá.
 * - Ai muốn siết thì đặt `BUILD_REQUIRE_API=1` để lỗi build lộ ra thay vì degrade.
 */
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

/**
 * Backend có trả lời **lúc build** không? Chỉ dùng trong `generateStaticParams`.
 *
 * `staticParamsSafe` một mình KHÔNG đủ để cứu build: nó chỉ chặn lỗi khi *liệt
 * kê slug*, còn bản thân **các trang** được prerender (trang chủ, `gioi-thieu`,
 * `tin-tuc`…) cũng fetch CMS và vẫn làm build đỏ khi backend im lặng (đã đo:
 * degrade xong vẫn `exit 1` kèm `connect ECONNREFUSED`).
 *
 * Vì thế `[locale]/layout.tsx` dùng hàm này làm **cổng duy nhất**: backend không
 * với tới được → trả `[]` cho `locale` → **không route nào dưới `/[locale]`
 * được prerender**, toàn bộ chuyển sang render on-demand lúc chạy. Đúng một lần
 * kiểm tra cho cả cây route.
 *
 * Kết quả (đã đo cả 4 chế độ):
 * | Chế độ | Kết quả |
 * |---|---|
 * | thiếu `NEXT_PUBLIC_API_URL` (CI hiện tại) | build xanh, không prerender |
 * | có URL + backend sống | build xanh, **có** prerender |
 * | có URL + backend ngủ | build **xanh**, cảnh báo rõ, không prerender |
 * | có URL + backend ngủ + `BUILD_REQUIRE_API=1` | build **đỏ** có chủ đích |
 */
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
