/**
 * `npm run analyze` — build production KÈM phân tích kích thước bundle.
 *
 * Dùng cờ CÓ SẴN của Next 16: `next build --experimental-analyze`. Cờ này là
 * Turbopack-native, tức nó phân tích ĐÚNG bundle sẽ được deploy.
 *
 * Vì sao KHÔNG dùng `@next/bundle-analyzer`: đó là plugin webpack, mà Next 16
 * build bằng Turbopack mặc định nên plugin bị bỏ qua — đã đo: build xanh nhưng
 * không sinh báo cáo nào. Ép `--webpack` thì analyzer chạy nhưng phân tích một
 * bundle khác với bundle production thật → số liệu sai một cách khó thấy.
 *
 * TẮT MẶC ĐỊNH: analyzer là cờ CLI chỉ script này truyền, nên `npm run build`
 * (Vercel/CI) không bao giờ chạy nó — không đổi output, không chậm thêm.
 *
 * ĐẦU RA: Next in đường dẫn báo cáo ở cuối log build; artifact nằm trong
 * `.next/` (đã có trong `.gitignore`) nên không bị commit.
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

// Gọi CLI của Next bằng CHÍNH node, không qua `npx`/shell.
//   * `shell: true` khiến tham số bị nối chuỗi chứ không escape (Node cảnh báo
//     DEP0190) — đó là một đường chèn lệnh.
//   * Không shell thì trên Windows `spawn("npx.cmd")` lại ném `EINVAL`, vì Node
//     hiện đại từ chối chạy thẳng file .cmd.
// Giải thẳng đường dẫn JS của Next rồi chạy bằng `process.execPath` — không
// shell, không .cmd, hành xử giống nhau trên mọi hệ điều hành.
const require = createRequire(import.meta.url);
const nextCli = path.join(path.dirname(require.resolve("next/package.json")), "dist/bin/next");

const child = spawn(process.execPath, [nextCli, "build", "--experimental-analyze"], {
  stdio: "inherit",
  // Kế thừa môi trường hiện tại. Không in biến nào ra log.
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
