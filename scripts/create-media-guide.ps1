$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$docsDir = Join-Path $root "docs"
New-Item -ItemType Directory -Force -Path $docsDir | Out-Null

$outputPath = Join-Path $docsDir "huong-dan-luu-anh-video-thien-duc.docx"
$pdfPath = Join-Path $docsDir "huong-dan-luu-anh-video-thien-duc.pdf"

function Get-WordColor($hex) {
  $clean = $hex.TrimStart("#")
  $r = [Convert]::ToInt32($clean.Substring(0, 2), 16)
  $g = [Convert]::ToInt32($clean.Substring(2, 2), 16)
  $b = [Convert]::ToInt32($clean.Substring(4, 2), 16)
  return $r + ($g * 256) + ($b * 65536)
}

$primary = Get-WordColor "#B06613"
$accent = Get-WordColor "#FDCD04"
$dark = Get-WordColor "#191919"
$muted = Get-WordColor "#666666"
$light = Get-WordColor "#F2F2F2"
$white = Get-WordColor "#FFFFFF"

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
  $doc = $word.Documents.Add()
  $selection = $word.Selection

  $doc.PageSetup.TopMargin = 72
  $doc.PageSetup.BottomMargin = 72
  $doc.PageSetup.LeftMargin = 72
  $doc.PageSetup.RightMargin = 72

  $normal = $doc.Styles.Item("Normal")
  $normal.Font.Name = "Arial"
  $normal.Font.Size = 10
  $normal.Font.Color = $dark
  $normal.ParagraphFormat.SpaceAfter = 8
  $normal.ParagraphFormat.LineSpacingRule = 0

  function Add-Paragraph($text, $size = 10, $color = $dark, $bold = $false, $spaceAfter = 8) {
    $script:selection.Font.Name = "Arial"
    $script:selection.Font.Size = $size
    $script:selection.Font.Color = $color
    $script:selection.Font.Bold = [int]$bold
    $script:selection.ParagraphFormat.SpaceAfter = $spaceAfter
    $script:selection.TypeText($text)
    $script:selection.TypeParagraph()
  }

  function Add-Heading($text) {
    Add-Paragraph $text 16 $primary $true 8
  }

  function Add-Subheading($text) {
    Add-Paragraph $text 12 $dark $true 5
  }

  function Format-Table($table) {
    $table.Range.Font.Name = "Arial"
    $table.Range.Font.Size = 9.5
    $table.Borders.Enable = $true
    foreach ($border in 1..6) {
      $table.Borders.Item($border).Color = Get-WordColor "#DDDDDD"
      $table.Borders.Item($border).LineWidth = 2
    }
    for ($c = 1; $c -le $table.Columns.Count; $c++) {
      $cell = $table.Cell(1, $c)
      $cell.Range.Font.Bold = $true
      $cell.Range.Font.Color = $white
      $cell.Shading.BackgroundPatternColor = $primary
    }
    foreach ($row in $table.Rows) {
      foreach ($cell in $row.Cells) {
        $cell.TopPadding = 6
        $cell.BottomPadding = 6
        $cell.LeftPadding = 7
        $cell.RightPadding = 7
        $cell.VerticalAlignment = 1
      }
    }
  }

  Add-Paragraph "THIEN DUC CONS" 9 $primary $true 2
  Add-Paragraph "Hướng dẫn lưu hình ảnh và video cho website" 24 $dark $true 4
  Add-Paragraph "Tài liệu này giúp gom media đúng chỗ trước khi bắt đầu thiết kế UI/UX và code giao diện." 11 $muted $false 16

  $selection.InlineShapes.AddHorizontalLineStandard() | Out-Null
  Add-Paragraph "" 1 $dark $false 4

  Add-Heading "1. Lưu file ở đâu?"
  Add-Paragraph "Toàn bộ hình ảnh và video dùng cho website nên lưu trong thư mục public của project frontend. Những file trong public có thể được gọi trực tiếp bằng đường dẫn bắt đầu bằng dấu /."

  $table = $doc.Tables.Add($selection.Range, 7, 3)
  $table.Cell(1,1).Range.Text = "Loại file"
  $table.Cell(1,2).Range.Text = "Thư mục lưu"
  $table.Cell(1,3).Range.Text = "Ví dụ đường dẫn khi code"
  $rows = @(
    @("Logo, favicon, brand", "frontend/public/images/brand", "/images/brand/logo-thien-duc.png"),
    @("Hình dự án", "frontend/public/images/projects", "/images/projects/khu-do-thi-hung-phu-01.jpg"),
    @("Hình tin tức", "frontend/public/images/news", "/images/news/tin-tuc-thien-duc-01.jpg"),
    @("Video dự án", "frontend/public/videos/projects", "/videos/projects/hung-phu-overview.mp4"),
    @("Video giới thiệu công ty", "frontend/public/videos/company", "/videos/company/gioi-thieu-thien-duc.mp4"),
    @("Tài liệu khác nếu có", "frontend/public/files", "/files/ho-so-nang-luc.pdf")
  )
  for ($r = 0; $r -lt $rows.Count; $r++) {
    for ($c = 0; $c -lt 3; $c++) {
      $table.Cell($r + 2, $c + 1).Range.Text = $rows[$r][$c]
    }
  }
  Format-Table $table
  $selection.EndKey(6) | Out-Null
  $selection.TypeParagraph()

  Add-Heading "2. Cấu trúc thư mục nên dùng"
  Add-Paragraph "Cây thư mục bên dưới là cấu trúc chuẩn để bạn kéo thả file vào đúng vị trí."
  Add-Paragraph "frontend/public/`r`n  images/`r`n    brand/        logo, favicon, hình nhận diện`r`n    projects/     hình dự án, phối cảnh, tiến độ`r`n    news/         hình bài viết, tin tức`r`n  videos/`r`n    projects/     video dự án`r`n    company/      video giới thiệu công ty" 10 $dark $false 12

  Add-Heading "3. Quy tắc đặt tên file"
  Add-Paragraph "Nên đặt tên file không dấu, không khoảng trắng, viết thường và dùng dấu gạch ngang."
  Add-Subheading "Đặt đúng"
  Add-Paragraph "logo-thien-duc.png`r`ndu-an-hung-phu-01.jpg`r`ntien-do-hung-phu-2026-06.jpg`r`nhung-phu-overview.mp4" 10 $dark $false 8
  Add-Subheading "Không nên đặt"
  Add-Paragraph "Dự án Hưng Phú Ảnh 1.jpg`r`nHình mới (1).png`r`nVideo Công Ty Final Final.mp4" 10 $dark $false 12

  Add-Heading "4. Checklist trước khi gửi mình làm UI"
  $checkItems = @(
    "[ ] Đã có logo rõ nét, ưu tiên PNG nền trong hoặc SVG.",
    "[ ] Đã có ít nhất 3-5 hình đẹp cho trang chủ.",
    "[ ] Mỗi dự án có thư mục/hình riêng hoặc tên file có slug dự án.",
    "[ ] Hình ảnh không bị mờ, vỡ, méo hoặc có watermark không mong muốn.",
    "[ ] Video đã nén vừa phải, không quá nặng nếu dùng trực tiếp trên web.",
    "[ ] Tên file không dấu, không khoảng trắng.",
    "[ ] Ghi chú rõ hình nào dùng cho banner, hình nào dùng cho dự án/tin tức."
  )
  foreach ($item in $checkItems) {
    Add-Paragraph $item 10 $dark $false 5
  }

  Add-Heading "5. Gợi ý kích thước"
  $sizeTable = $doc.Tables.Add($selection.Range, 5, 3)
  $sizeTable.Cell(1,1).Range.Text = "Vị trí"
  $sizeTable.Cell(1,2).Range.Text = "Kích thước gợi ý"
  $sizeTable.Cell(1,3).Range.Text = "Ghi chú"
  $sizeRows = @(
    @("Banner trang chủ", "1920 x 900 px trở lên", "Ảnh ngang, rõ chủ thể công trình/dự án."),
    @("Card dự án", "1200 x 800 px", "Tỷ lệ ổn định, dễ cắt responsive."),
    @("Ảnh tin tức", "1200 x 675 px", "Tỷ lệ 16:9 phù hợp chia sẻ mạng xã hội."),
    @("Logo", "SVG hoặc PNG lớn", "Nên có bản nền trong.")
  )
  for ($r = 0; $r -lt $sizeRows.Count; $r++) {
    for ($c = 0; $c -lt 3; $c++) {
      $sizeTable.Cell($r + 2, $c + 1).Range.Text = $sizeRows[$r][$c]
    }
  }
  Format-Table $sizeTable
  $selection.EndKey(6) | Out-Null
  $selection.TypeParagraph()

  Add-Heading "6. Ghi chú cho giai đoạn UI/UX"
  Add-Paragraph "Nếu có ảnh thật của công trình, dự án, văn phòng hoặc đội ngũ, nên ưu tiên dùng ảnh thật thay vì ảnh minh họa. Website bất động sản và xây dựng phụ thuộc rất nhiều vào chất lượng hình ảnh."
  Add-Paragraph "Tông màu thương hiệu đang giữ: trắng, xám sáng, nâu vàng #B06613, vàng nhấn #FDCD04 và chữ đen xám #191919." 10 $dark $false 8

  if (Test-Path $outputPath) { Remove-Item -LiteralPath $outputPath -Force }
  $doc.SaveAs($outputPath)

  try {
    if (Test-Path $pdfPath) { Remove-Item -LiteralPath $pdfPath -Force }
    $doc.ExportAsFixedFormat($pdfPath, 17)
  } catch {
    Write-Host "PDF export skipped: $($_.Exception.Message)"
  }

  $doc.Close($false)
} finally {
  try {
    $word.Quit()
  } catch {
    Write-Host "Word quit warning: $($_.Exception.Message)"
  }
}

Write-Host $outputPath

