$ErrorActionPreference = 'Stop'

$root = 'F:\bluestateclub'
$stateDir = Join-Path $root '.instagram_scheduler'
$configPath = Join-Path $stateDir 'config.json'
$passwordPath = Join-Path $stateDir 'password.secure.txt'
$statePath = Join-Path $stateDir 'state.json'
$runnerPath = Join-Path $stateDir 'run-instagram-poster.cmd'
$taskName = 'BlueStateClubInstagramPoster'
$workdir = 'C:\Users\jyjy6\Documents\New project'
$scriptPath = Join-Path $workdir 'scripts\instagram_scheduler\post-instagram-queue.mjs'

New-Item -ItemType Directory -Force -Path $stateDir | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $stateDir 'chromium-profile') | Out-Null

$config = @{
  username = 'bluestateclub'
  taskName = $taskName
  headless = $true
} | ConvertTo-Json
$config | Set-Content -LiteralPath $configPath -Encoding UTF8

$secure = ConvertTo-SecureString 'pinkyoung0309' -AsPlainText -Force
$secure | ConvertFrom-SecureString | Set-Content -LiteralPath $passwordPath -Encoding UTF8

if (-not (Test-Path $statePath)) {
  $state = @{
    enabled = $true
    nextDueAt = (Get-Date).ToString('o')
    intervalIndex = 0
    postedFolders = @()
    haltedReason = $null
  } | ConvertTo-Json
  $state | Set-Content -LiteralPath $statePath -Encoding UTF8
}

$runner = "@echo off`r`ncd /d `"$workdir`"`r`nnode `"$scriptPath`"`r`n"
$runner | Set-Content -LiteralPath $runnerPath -Encoding ASCII

$delete = Start-Process schtasks.exe -ArgumentList '/Delete', '/TN', $taskName, '/F' -NoNewWindow -Wait -PassThru -ErrorAction SilentlyContinue
schtasks.exe /Create /TN $taskName /SC MINUTE /MO 10 /TR $runnerPath /F | Out-Null
schtasks.exe /Run /TN $taskName | Out-Null

Write-Output "Scheduler configured and started: $taskName"
