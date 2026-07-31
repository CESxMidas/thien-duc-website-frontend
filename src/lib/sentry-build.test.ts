/**
 * Kiểm cổng upload source map Sentry mà KHÔNG build, KHÔNG gọi mạng, KHÔNG
 * cần token thật. Điều quan trọng nhất phải khoá: **thiếu token thì build vẫn
 * chạy** và **không bao giờ upload nhầm project**.
 */
import {
  REQUIRED_SENTRY_UPLOAD_VARS,
  isSentryUploadEnabled,
  resolveSentryRelease,
} from "./sentry-build";

const full = {
  SENTRY_AUTH_TOKEN: "token-gia-dinh",
  SENTRY_ORG: "thien-duc",
  SENTRY_PROJECT: "frontend",
};

describe("isSentryUploadEnabled", () => {
  it("đủ ba biến → bật", () => {
    expect(isSentryUploadEnabled(full)).toBe(true);
  });

  it("môi trường rỗng (máy dev) → TẮT, build không phụ thuộc Sentry", () => {
    expect(isSentryUploadEnabled({})).toBe(false);
  });

  it.each(REQUIRED_SENTRY_UPLOAD_VARS)("thiếu %s → tắt", (missing) => {
    const env: Record<string, string | undefined> = { ...full };
    delete env[missing];
    expect(isSentryUploadEnabled(env)).toBe(false);
  });

  it.each(REQUIRED_SENTRY_UPLOAD_VARS)("%s rỗng/khoảng trắng cũng coi như thiếu", (name) => {
    expect(isSentryUploadEnabled({ ...full, [name]: "" })).toBe(false);
    expect(isSentryUploadEnabled({ ...full, [name]: "   " })).toBe(false);
  });

  it("có token nhưng thiếu org/project → TẮT (không đoán, tránh bắn nhầm project)", () => {
    expect(isSentryUploadEnabled({ SENTRY_AUTH_TOKEN: "x" })).toBe(false);
  });
});

describe("resolveSentryRelease", () => {
  it("không có biến nào → undefined, KHÔNG bịa chuỗi", () => {
    expect(resolveSentryRelease({})).toBeUndefined();
  });

  it("ưu tiên SENTRY_RELEASE đặt tay", () => {
    expect(
      resolveSentryRelease({
        SENTRY_RELEASE: "v1",
        VERCEL_GIT_COMMIT_SHA: "abc",
        GITHUB_SHA: "def",
      }),
    ).toBe("v1");
  });

  it("không có SENTRY_RELEASE thì dùng SHA của Vercel", () => {
    expect(resolveSentryRelease({ VERCEL_GIT_COMMIT_SHA: "abc", GITHUB_SHA: "def" })).toBe("abc");
  });

  it("cuối cùng mới tới GITHUB_SHA", () => {
    expect(resolveSentryRelease({ GITHUB_SHA: "def" })).toBe("def");
  });

  it("bỏ khoảng trắng thừa quanh SHA", () => {
    expect(resolveSentryRelease({ GITHUB_SHA: "  def  " })).toBe("def");
  });

  it("biến rỗng bị bỏ qua, rơi xuống nguồn kế tiếp", () => {
    expect(resolveSentryRelease({ SENTRY_RELEASE: "", GITHUB_SHA: "def" })).toBe("def");
  });
});
