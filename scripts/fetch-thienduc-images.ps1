$ErrorActionPreference = "Continue"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$publicRoot = Join-Path $root "public\images"
$legacyBase = "https://thienduccons.com"

$dirs = @("brand", "banners", "projects", "news")
foreach ($name in $dirs) {
  New-Item -ItemType Directory -Force -Path (Join-Path $publicRoot $name) | Out-Null
}

function Save-UrlImage {
  param(
    [string]$Url,
    [string]$OutPath
  )

  try {
    Write-Host "Downloading: $Url"
    Invoke-WebRequest -Uri $Url -OutFile $OutPath -UseBasicParsing -TimeoutSec 60
    $info = Get-Item $OutPath
    if ($info.Length -lt 1024) {
      throw "File too small ($($info.Length) bytes)"
    }
    Write-Host "  -> $($info.Length) bytes -> $OutPath"
    return $true
  } catch {
    Write-Host "  FAILED: $($_.Exception.Message)"
    if (Test-Path $OutPath) { Remove-Item -LiteralPath $OutPath -Force -ErrorAction SilentlyContinue }
    return $false
  }
}

function Resolve-LegacyUrl {
  param([string]$Path)
  if ($Path -match "^https?://") { return $Path }
  return ($legacyBase.TrimEnd("/") + "/" + $Path.TrimStart("/"))
}

# Brand assets from legacy website
Save-UrlImage -Url (Resolve-LegacyUrl "img/logo.png") -OutPath (Join-Path $publicRoot "brand\logo-thien-duc.png") | Out-Null
Save-UrlImage -Url (Resolve-LegacyUrl "img/icon.png") -OutPath (Join-Path $publicRoot "brand\favicon-thien-duc.png") | Out-Null

# Banner slides from legacy site (project / urban development imagery)
$legacyBanners = @(
  "img_data/images/218385095754.jpg",
  "img_data/images/329240560754.jpg",
  "img_data/images/684720114945.jpg",
  "img_data/images/491919024807.jpg"
)
for ($i = 0; $i -lt $legacyBanners.Count; $i++) {
  $name = "home-banner-{0:D2}.jpg" -f ($i + 1)
  $out = Join-Path $publicRoot "banners\$name"
  $ok = Save-UrlImage -Url (Resolve-LegacyUrl $legacyBanners[$i]) -OutPath $out
  if (-not $ok) {
    # Fallback stock imagery if legacy asset fails
    $fallbacks = @(
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=80"
    )
    Save-UrlImage -Url $fallbacks[$i] -OutPath $out | Out-Null
  }
}

# Project + news imagery (legacy first, then stock fallback)
$legacyProjects = @(
  "img_data/images/150400616470.jpg",
  "img_data/images/152146271795.jpg"
)
$projectNames = @("khu-do-thi-hung-phu-01.jpg", "khu-do-thi-hung-phu-02.jpg")
for ($i = 0; $i -lt $projectNames.Count; $i++) {
  $out = Join-Path $publicRoot "projects\$($projectNames[$i])"
  $ok = Save-UrlImage -Url (Resolve-LegacyUrl $legacyProjects[$i]) -OutPath $out
  if (-not $ok) {
    $stock = @(
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80"
    )
    Save-UrlImage -Url $stock[$i] -OutPath $out | Out-Null
  }
}

$newsOut = Join-Path $publicRoot "news\tin-tuc-thien-duc-01.jpg"
$newsOk = Save-UrlImage -Url (Resolve-LegacyUrl "img_data/images/898415670800.jpg") -OutPath $newsOut
if (-not $newsOk) {
  Save-UrlImage -Url "https://images.unsplash.com/photo-1582407947304-fd86fe028716?auto=format&fit=crop&w=1200&q=80" -OutPath $newsOut | Out-Null
}

Write-Host ""
Write-Host "=== Image inventory ==="
Get-ChildItem -Recurse $publicRoot -File | Where-Object { $_.Extension -match '\.(jpg|jpeg|png|webp)$' } |
  Sort-Object FullName |
  ForEach-Object { Write-Host ("{0,-55} {1,10} bytes" -f $_.Name, $_.Length) }

Write-Host "Done."
