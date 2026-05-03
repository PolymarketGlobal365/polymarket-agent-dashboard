param(
  [Parameter(Mandatory = $true)]
  [string]$ScriptPath,

  [Parameter(Mandatory = $true)]
  [string]$ExpectedOutputPath,

  [int]$InitialWaitSeconds = 12,
  [int]$PollIntervalSeconds = 3,
  [int]$TimeoutSeconds = 120
)

$ErrorActionPreference = 'Stop'

$photoshopPath = 'C:\Program Files\Adobe\Adobe Photoshop 2026\Photoshop.exe'

if (-not (Test-Path -LiteralPath $photoshopPath)) {
  throw "Photoshop 2026 not found at: $photoshopPath"
}

if (-not (Test-Path -LiteralPath $ScriptPath)) {
  throw "JSX script not found: $ScriptPath"
}

Remove-Item -LiteralPath $ExpectedOutputPath -ErrorAction SilentlyContinue

& $photoshopPath -r $ScriptPath | Out-Null

Start-Sleep -Seconds $InitialWaitSeconds

$deadline = (Get-Date).AddSeconds($TimeoutSeconds)
while ((Get-Date) -lt $deadline) {
  if (Test-Path -LiteralPath $ExpectedOutputPath) {
    Get-Item -LiteralPath $ExpectedOutputPath
    exit 0
  }
  Start-Sleep -Seconds $PollIntervalSeconds
}

throw "Timed out waiting for Photoshop output: $ExpectedOutputPath"
