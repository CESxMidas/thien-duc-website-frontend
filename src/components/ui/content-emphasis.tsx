import type { ReactNode } from "react";

// Explicit editorial terms, shared by VI/EN detail content only. Do not infer
// arbitrary dates or entities from CMS prose, or interpret CMS strings as HTML.
const editorialTerms = [
  [
    "Công ty TNHH Đầu tư Xây dựng Thương mại Thiên Đức",
    "Công ty TNHH Đầu tư - Xây dựng - Thương mại Thiên Đức",
    "Thien Duc Investment Construction Trading Co., Ltd",
    "Thien Duc Investment - Construction - Trading Co., Ltd",
    "Thiên Đức",
    "Thien Duc",
    "Tinh hoa Ẩm thực Xứ Dừa 2026",
    "Nhà tài trợ Kim Cương"
  ],
  ["Khu Đô Thị Hưng Phú", "Hung Phu Urban Area", "Hưng Phú", "Hung Phu"],
  ["Cannes Hotel"],
  ["2026"],
];

type ContentEmphasisProps = {
  text: string;
  names?: string[];
};

export function ContentEmphasis({ text, names = [] }: ContentEmphasisProps) {
  const normalized = text.toLocaleLowerCase();
  const terms = [...editorialTerms, ...names.filter(Boolean).map((name) => [name])];
  const candidates: { start: number; end: number; group: number }[] = [];

  terms.forEach((aliases, group) => {
    aliases.forEach((alias) => {
      const term = alias.toLocaleLowerCase();
      let start = normalized.indexOf(term);
      while (start !== -1) {
        const end = start + alias.length;
        // Unicode boundaries prevent matches within names, identifiers and years.
        const before = Array.from(text.slice(0, start)).at(-1) ?? "";
        const after = Array.from(text.slice(end))[0] ?? "";
        if (!/[\p{L}\p{N}_]/u.test(before) && !/[\p{L}\p{N}_]/u.test(after)) {
          candidates.push({ start, end, group });
          break;
        }
        start = normalized.indexOf(term, start + term.length);
      }
    });
  });

  // Prefer full legal/project names to their shorter aliases. Limit emphasis
  // to one mention per entity and at most four spans in a paragraph.
  candidates.sort((a, b) => a.start - b.start || b.end - a.end);
  const used = new Set<number>();
  const output: ReactNode[] = [];
  let cursor = 0;
  for (const match of candidates) {
    if (match.start < cursor || used.has(match.group) || used.size >= 4) continue;
    output.push(text.slice(cursor, match.start));
    output.push(
      <strong className="content-emphasis" key={match.start}>
        {text.slice(match.start, match.end)}
      </strong>,
    );
    cursor = match.end;
    used.add(match.group);
  }
  output.push(text.slice(cursor));
  return <>{output}</>;
}
