$ErrorActionPreference = 'Stop'

$inputPath = Join-Path $PSScriptRoot '..\output\proposal_2026_kentech_sns_draft.rtf'
$inputPath = [System.IO.Path]::GetFullPath($inputPath)
$outputPath = Join-Path $PSScriptRoot '..\output\proposal_2026_kentech_sns_draft.hwp'
$outputPath = [System.IO.Path]::GetFullPath($outputPath)

if (-not (Test-Path $inputPath)) {
  throw "Input RTF not found: $inputPath"
}

$hwp = New-Object -ComObject 'HWPFrame.HwpObject'
$null = $hwp.RegisterModule('FilePathCheckDLL', 'FilePathCheckerModule')

try {
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
