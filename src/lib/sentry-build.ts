/**
 * Cổng quyết định CÓ upload source map lên Sentry hay không, tách riêng khỏi
 * `next.config.ts` để test được mà **không cần build và không gọi mạng**.
 *
 * Quy tắc: chỉ bật khi có ĐỦ ba biến `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` +
 * `SENTRY_PROJECT`. Thiếu bất kỳ cái nào → tắt, build vẫn xanh. Không có giá
 * trị mặc định, không đoán tên org/project: đoán sai nghĩa là bắn source map
 * sang nhầm project của người khác.
 */
export type BuildEnv = Record<string, string | undefined>;

/** Ba biến bắt buộc phải có ĐỦ thì mới upload. */
export const REQUIRED_SENTRY_UPLOAD_VARS = [
  "SENTRY_AUTH_TOKEN",
  "SENTRY_ORG",
  "SENTRY_PROJECT",
] as const;

/** Chuỗi rỗng / chỉ khoảng trắng bị coi như KHÔNG đặt (CI hay export biến rỗng). */
function isSet(value: string | undefined): boolean {
  return typeof value === "string" && value.trim() !== "";
}

export function isSentryUploadEnabled(env: BuildEnv): boolean {
  return REQUIRED_SENTRY_UPLOAD_VARS.every((name) => isSet(env[name]));
}

/**
 * Định danh release — ưu tiên biến đặt tay, sau đó SHA commit của Vercel, rồi
 * của GitHub Actions. Trả `undefined` nếu không suy được (để Sentry tự quyết),
 * KHÔNG bịa ra một chuỗi ngẫu nhiên: release sai còn tệ hơn không có release.
 */
export function resolveSentryRelease(env: BuildEnv): string | undefined {
  for (const name of ["SENTRY_RELEASE", "VERCEL_GIT_COMMIT_SHA", "GITHUB_SHA"]) {
    if (isSet(env[name])) return env[name]!.trim();
  }
  return undefined;
}
