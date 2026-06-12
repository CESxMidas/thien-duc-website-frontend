import fs from "fs";

const mdPath = "docs/Bao-cao-trien-khai-chi-tiet-phuong-an-2.md";
const md = fs.readFileSync(mdPath, "utf8");

const txt = md
  .replace(/^#+ /gm, "")
  .replace(/\*\*(.*?)\*\*/g, "$1")
  .replace(/\*(.*?)\*/g, "$1")
  .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
  .replace(/^> /gm, "")
  .replace(/^---$/gm, "----------------------------------------");

fs.writeFileSync("docs/Bao-cao-trien-khai-chi-tiet-phuong-an-2.txt", "\uFEFF" + txt, "utf8");

function esc(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const lines = md.split("\n");
const html = [];
let inTable = false;
let inCode = false;

for (let rawLine of lines) {
  const line = rawLine.replace(/\r$/, "");
  if (line.startsWith("```")) {
    inCode = !inCode;
    html.push(inCode ? '<pre style="font-family:Consolas;font-size:10pt;">' : "</pre>");
    continue;
  }
  if (inCode) {
    html.push(esc(line) + "<br/>");
    continue;
  }

  if (/^\|.+\|$/.test(line)) {
    const cells = line
      .split("|")
      .filter((_, i, a) => i > 0 && i < a.length - 1)
      .map((c) => c.trim());
    if (cells.every((c) => /^[-:]+$/.test(c))) continue;
    if (!inTable) {
      html.push(
        '<table border="1" cellpadding="4" cellspacing="0" style="border-collapse:collapse;width:100%;">'
      );
      inTable = true;
    }
    html.push(
      "<tr>" +
        cells.map((c) => "<td>" + esc(c.replace(/\*\*(.*?)\*\*/g, "$1")) + "</td>").join("") +
        "</tr>"
    );
    continue;
  } else if (inTable) {
    html.push("</table>");
    inTable = false;
  }

  if (line.startsWith("# ")) html.push("<h1>" + esc(line.slice(2)) + "</h1>");
  else if (line.startsWith("## ")) html.push("<h2>" + esc(line.slice(3)) + "</h2>");
  else if (line.startsWith("### ")) html.push("<h3>" + esc(line.slice(4)) + "</h3>");
  else if (line.startsWith("> "))
    html.push('<p style="margin-left:20pt;font-style:italic;">' + esc(line.slice(2)) + "</p>");
  else if (line.trim() === "---") html.push("<hr/>");
  else if (line.trim() === "") html.push("<p>&nbsp;</p>");
  else {
    const rich = line
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\*(.*?)\*/g, "<i>$1</i>");
    html.push("<p>" + rich + "</p>");
  }
}
if (inTable) html.push("</table>");

const doc = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word"
xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="ProgId" content="Word.Document">
<meta name="Generator" content="Microsoft Word 15">
<!--[if gte mso 9]><xml>
<w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument>
</xml><![endif]-->
<style>
body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.5; margin: 2cm; }
h1 { font-size: 18pt; font-weight: bold; text-align: center; }
h2 { font-size: 14pt; font-weight: bold; margin-top: 12pt; }
h3 { font-size: 12pt; font-weight: bold; margin-top: 10pt; }
table { border-collapse: collapse; width: 100%; margin: 8pt 0; }
td, th { border: 1px solid #000; padding: 4pt 6pt; vertical-align: top; }
pre { background: #f5f5f5; padding: 8pt; font-size: 9pt; }
</style>
</head>
<body>
${html.join("\n")}
</body>
</html>`;

fs.writeFileSync("docs/Bao-cao-trien-khai-chi-tiet-phuong-an-2.doc", "\uFEFF" + doc, "utf8");
console.log("Generated .txt and .doc from .md");
