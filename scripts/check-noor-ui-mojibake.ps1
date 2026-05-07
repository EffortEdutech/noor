$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$targets = @(
  "apps\web",
  "packages\noor-ui"
)

$patterns = @("Â", "Ã", "â€", "âœ", "�")
$hits = New-Object System.Collections.Generic.List[string]

foreach ($target in $targets) {
  $targetPath = Join-Path $root $target

  if (-not (Test-Path -LiteralPath $targetPath)) {
    continue
  }

  Get-ChildItem -LiteralPath $targetPath -Recurse -File -Include *.tsx, *.ts, *.css, *.md | ForEach-Object {
    $filePath = $_.FullName
    $lines = Get-Content -LiteralPath $filePath -ErrorAction Stop

    for ($i = 0; $i -lt $lines.Count; $i++) {
      foreach ($pattern in $patterns) {
        if ($lines[$i].Contains($pattern)) {
          $relativePath = $filePath.Substring($root.Length).TrimStart([char[]]@('\','/'))
          $lineNumber = $i + 1
          $hits.Add("${relativePath}:${lineNumber}: $($lines[$i])")
          break
        }
      }
    }
  }
}

if ($hits.Count -gt 0) {
  Write-Host "Potential mojibake fragments found:" -ForegroundColor Yellow
  $hits | ForEach-Object { Write-Host $_ }
  exit 1
}

Write-Host "No common mojibake fragments found in NOOR UI files." -ForegroundColor Green
