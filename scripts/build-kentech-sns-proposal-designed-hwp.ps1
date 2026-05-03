$ErrorActionPreference = 'Stop'

$inputDir = Join-Path $PSScriptRoot '..\output\kentech_hwp_pages'
$inputDir = [System.IO.Path]::GetFullPath($inputDir)
$outputPath = Join-Path $PSScriptRoot '..\output\proposal_2026_kentech_sns_designed.hwp'
$outputPath = [System.IO.Path]::GetFullPath($outputPath)

$images = Get-ChildItem -Path $inputDir -Filter 'page-*.png' | Sort-Object Name
if ($images.Count -eq 0) {
  throw "No rendered page images found in $inputDir"
}

$hwp = New-Object -ComObject 'HWPFrame.HwpObject'
$null = $hwp.RegisterModule('FilePathCheckDLL','FilePathCheckerModule')
$hwp.Clear(3)

$hwp.HAction.GetDefault('PageSetup', $hwp.HParameterSet.HSecDef.HSet)
$hwp.HParameterSet.HSecDef.PageDef.PaperWidth = $hwp.MiliToHwpUnit(210.0)
$hwp.HParameterSet.HSecDef.PageDef.PaperHeight = $hwp.MiliToHwpUnit(297.0)
$hwp.HParameterSet.HSecDef.PageDef.LeftMargin = $hwp.MiliToHwpUnit(5.0)
$hwp.HParameterSet.HSecDef.PageDef.RightMargin = $hwp.MiliToHwpUnit(5.0)
$hwp.HParameterSet.HSecDef.PageDef.TopMargin = $hwp.MiliToHwpUnit(5.0)
$hwp.HParameterSet.HSecDef.PageDef.BottomMargin = $hwp.MiliToHwpUnit(5.0)
$hwp.HParameterSet.HSecDef.PageDef.HeaderLen = $hwp.MiliToHwpUnit(0.0)
$hwp.HParameterSet.HSecDef.PageDef.FooterLen = $hwp.MiliToHwpUnit(0.0)
$hwp.HAction.Execute('PageSetup', $hwp.HParameterSet.HSecDef.HSet)

for ($i = 0; $i -lt $images.Count; $i++) {
  $img = $images[$i].FullName
  $null = $hwp.InsertPicture($img, $true, 1, $false, $false, 0, 200, 287)
  if ($i -lt ($images.Count - 1)) {
    $null = $hwp.Run('BreakPage')
  }
}

$hwp.SaveAs($outputPath, 'HWP', '')
$pageCount = $hwp.PageCount
$hwp.Quit()

Write-Output "output=$outputPath"
Write-Output "pages=$pageCount"
