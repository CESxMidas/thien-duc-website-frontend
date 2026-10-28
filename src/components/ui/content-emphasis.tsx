import type { ReactNode } from "react";

// Mỗi mảng con là các tên gọi của CÙNG một đối tượng, chỉ nhấn một lần mỗi đoạn.
// Thêm keyword độc lập bằng một mảng con mới, không ghép vào nhóm tên công ty.
// Chỉ khớp các cụm đã khai báo; không diễn giải nội dung CMS thành HTML.
const editorialTerms = [
  [
    "Công ty TNHH Đầu tư Xây dựng Thương mại Thiên Đức",
    "Công ty TNHH Đầu tư Xây dựng - Thương mại Thiên Đức",
    "Công ty TNHH Đầu tư - Xây dựng - Thương mại Thiên Đức",
    "Thien Duc Investment Construction Trading Co., Ltd",
    "Thien Duc Investment - Construction - Trading Co., Ltd",
    "Thiên Đức",
    "Thien Duc",
  ],
  [
    "Tinh hoa Ẩm thực Xứ Dừa 2026",
    "“Tinh hoa Ẩm thực Xứ Dừa” 2026",
    '"Tinh hoa Ẩm thực Xứ Dừa" 2026',
    "Tinh hoa Ẩm thực Xứ Dừa",
  ],
  ["Nhà tài trợ Kim Cương"],
  ["Kỷ lục Việt Nam"],
  ["Gỏi củ hủ dừa tôm thịt"],
  ["Bến Tre"],
  ["Xứ Dừa"],
  ["Khu Đô Thị Hưng Phú", "Hung Phu Urban Area", "Hưng Phú", "Hung Phu"],
  ["Cannes Hotel"],
  ["Khách sạn 3 sao", "Cột mốc 3 sao"],
  [
    "Đồng hành kiến tạo giá trị, bền vững cùng thời gian",
    "Đồng hành kiến tạo giá trị",
  ],
  ["2026"],
];

type ContentEmphasisProps = {
  text: string;
  names?: string[];
};

export function ContentEmphasis({ text, names = [] }: ContentEmphasisProps) {
  const normalized = text.toLocaleLowerCase();
  const terms = [
    ...editorialTerms,
    ...names.filter(Boolean).map((name) => [name]),
  ];
  const candidates: { start: number; end: number; group: number }[] = [];

  terms.forEach((aliases, group) => {
    aliases.forEach((alias) => {
      const term = alias.toLocaleLowerCase();
      let start = normalized.indexOf(term);
      while (start !== -1) {
        const end = start + alias.length;
        // Ranh giới Unicode tránh khớp bên trong tên, mã định danh hoặc năm dài hơn.
        const before = Array.from(text.slice(0, start)).at(-1) ?? "";
        const after = Array.from(text.slice(end))[0] ?? "";
        if (!/[\p{L}\p{N}_]/u.test(before) && !/[\p{L}\p{N}_]/u.test(after)) {
          candidates.push({ start, end, group });
        }
        start = normalized.indexOf(term, start + term.length);
      }
    });
  });

  // Xét cả lần xuất hiện sau nếu lần đầu nằm trong cụm dài đã được chọn.
  // Ưu tiên cụm đầy đủ thay vì tên viết tắt hoặc năm nằm bên trong cụm đó.
  // Mỗi đối tượng chỉ nhấn một lần, tối đa bốn cụm trong một đoạn.
  candidates.sort((a, b) => a.start - b.start || b.end - a.end);
  const used = new Set<number>();
  const output: ReactNode[] = [];
  let cursor = 0;
  for (const match of candidates) {
    if (match.start < cursor || used.has(match.group) || used.size >= 4)
      continue;
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
