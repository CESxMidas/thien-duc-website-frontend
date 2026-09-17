
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const nextCli = path.join(path.dirname(require.resolve("next/package.json")), "dist/bin/next");

const child = spawn(process.execPath, [nextCli, "build", "--experimental-analyze"], {
  stdio: "inherit",
  env: process.env,
});

child.on("error", (err) => {
  console.error("[analyze] không chạy được next build:", err.message);
  process.exit(1);
});

child.on("exit", (code) => {
  if (code !== 0) process.exit(code ?? 1);
  console.log(
    "\n[analyze] xong. Xem báo cáo Turbopack ở log phía trên — bundle phía " +
      "client là thứ ảnh hưởng TBT/hydrate của người dùng.",
  );
});
