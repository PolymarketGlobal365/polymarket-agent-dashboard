$ErrorActionPreference = 'Stop'

$generatorPath = Join-Path $PSScriptRoot 'generate-kat-proposal-30p-html.mjs'
$generatorPath = [System.IO.Path]::GetFullPath($generatorPath)
$inputPath = Join-Path $PSScriptRoot '..\output\proposal_2026_korean_artist_today_30p_editable.html'
$inputPath = [System.IO.Path]::GetFullPath($inputPath)
$outputPath = Join-Path $PSScriptRoot '..\output\proposal_2026_korean_artist_today_30p_editable.hwp'
$outputPath = [System.IO.Path]::GetFullPath($outputPath)

node $generatorPath

if (-not (Test-Path $inputPath)) {
  throw "Input HTML not found: $inputPath"
}

$hwp = New-Object -ComObject 'HWPFrame.HwpObject'
$null = $hwp.RegisterModule('FilePathCheckDLL', 'FilePathCheckerModule')

try {
  try {
    $null = $hwp.XHwpWindows.Item(0).Visible = $false
  }
  catch {}

  $opened = $hwp.Open($inputPath, 'HTML', '')
  if (-not $opened) {
    throw "Failed to open HTML in HWP"
  }

  $hwp.SaveAs($outputPath, 'HWP', '')
  Write-Output "output=$outputPath"
  Write-Output "pages=$($hwp.PageCount)"
}
finally {
  try { $hwp.Quit() } catch {}
}
