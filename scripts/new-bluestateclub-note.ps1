param(
  [Parameter(Mandatory = $true)]
  [string]$FolderPath,

  [Parameter(Mandatory = $true)]
  [string]$FileBaseName,

  [Parameter(Mandatory = $true)]
  [string]$Title,

  [Parameter(Mandatory = $true)]
  [string[]]$SummaryLines,

  [Parameter(Mandatory = $true)]
  [string]$OneLineTake,

  [Parameter(Mandatory = $true)]
  [string[]]$Hashtags
)

$ErrorActionPreference = 'Stop'

if ($SummaryLines.Count -ne 5) {
  throw "SummaryLines must contain exactly 5 lines."
}

if ($Hashtags.Count -ne 5) {
  throw "Hashtags must contain exactly 5 items."
}

$null = New-Item -ItemType Directory -Path $FolderPath -Force

$path = Join-Path $FolderPath ($FileBaseName + '.txt')
$content = @(
  $Title,
  '',
  $SummaryLines,
  '',
  $OneLineTake,
  '',
  $Hashtags
) -join [Environment]::NewLine

Set-Content -LiteralPath $path -Value $content -Encoding UTF8
Get-Item -LiteralPath $path
