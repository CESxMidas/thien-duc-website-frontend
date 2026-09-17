
export type BuildEnv = Record<string, string | undefined>;

/** Ba biến bắt buộc phải có ĐỦ thì mới upload. */
export const REQUIRED_SENTRY_UPLOAD_VARS = [
  "SENTRY_AUTH_TOKEN",
  "SENTRY_ORG",
  "SENTRY_PROJECT",
] as const;

function isSet(value: string | undefined): boolean {
  return typeof value === "string" && value.trim() !== "";
}

export function isSentryUploadEnabled(env: BuildEnv): boolean {
  return REQUIRED_SENTRY_UPLOAD_VARS.every((name) => isSet(env[name]));
}

export function resolveSentryRelease(env: BuildEnv): string | undefined {
  for (const name of ["SENTRY_RELEASE", "VERCEL_GIT_COMMIT_SHA", "GITHUB_SHA"]) {
    if (isSet(env[name])) return env[name]!.trim();
  }
  return undefined;
}
