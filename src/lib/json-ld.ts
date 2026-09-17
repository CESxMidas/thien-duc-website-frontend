
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);


const BACKSLASH = String.fromCharCode(92);

const ESCAPES: Record<string, string> = {
  "<": BACKSLASH + "u003c",
  ">": BACKSLASH + "u003e",
  "&": BACKSLASH + "u0026",
  [LINE_SEPARATOR]: BACKSLASH + "u2028",
  [PARAGRAPH_SEPARATOR]: BACKSLASH + "u2029",
};

const UNSAFE = new RegExp(
  "[<>&" + LINE_SEPARATOR + PARAGRAPH_SEPARATOR + "]",
  "g",
);

/** Chuoi JSON da an toan de dat truc tiep vao than script ld+json. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(UNSAFE, (char) => ESCAPES[char] ?? char);
}
