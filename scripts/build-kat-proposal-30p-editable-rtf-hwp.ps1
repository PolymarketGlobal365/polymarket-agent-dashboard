$ErrorActionPreference = 'Stop'

$generatorPath = Join-Path $PSScriptRoot 'generate-kat-proposal-30p-rtf.mjs'
$generatorPath = [System.IO.Path]::GetFullPath($generatorPath)
$inputPath = Join-Path $PSScriptRoot '..\output\proposal_2026_korean_artist_today_30p_editable.rtf'
$inputPath = [System.IO.Path]::GetFullPath($inputPath)
$outputPath = Join-Path $PSScriptRoot '..\output\proposal_2026_korean_artist_today_30p_editable_rtf.hwp'
$outputPath = [System.IO.Path]::GetFullPath($outputPath)

node $generatorPath

if (-not (Test-Path $inputPath)) {
  throw "Input RTF not found: $inputPath"
}

$hwp = New-Object -ComObject 'HWPFrame.HwpObject'
$null = $hwp.RegisterModule('FilePathCheckDLL', 'FilePathCheckerModule')

try {
  try {
    $null = $hwp.XHwpWindows.Item(0).Visible = $false
  }
  catch {}

  $opened = $hwp.Open($inputPath, 'RTF', '')
  if (-not $opened) {
    throw "Failed to open RTF in HWP"
  }

  $hwp.SaveAs($outputPath, 'HWP', '')
  Write-Output "output=$outputPath"
  Write-Output "pages=$($hwp.PageCount)"
}
finally {
  try { $hwp.Quit() } catch {}
}
