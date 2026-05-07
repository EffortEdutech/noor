$ErrorActionPreference = "Stop"

$root = "C:\Users\user\Documents\00 Combo3\Noor"

$cssFiles = @(
  Join-Path $root "apps\web\app\learn\tafseer\TafseerPage.module.css",
  Join-Path $root "apps\web\components\FloatingTafseerNavigator.module.css"
)

foreach ($file in $cssFiles) {
  if (Test-Path $file) {
    $content = Get-Content $file -Raw
    $content = $content.Replace("align-items: start;", "align-items: flex-start;")
    Set-Content -Path $file -Value $content -Encoding utf8
  }
}

Write-Host "CSS autoprefixer start-value fixes applied."
