param(
  [string]$OutputRoot = 'C:\Users\jyjy6\Documents\New project\temp\generated-bloomberg-five'
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

function New-Dir([string]$path) {
  $null = New-Item -ItemType Directory -Path $path -Force
}

function Get-CoverRect($imgWidth, $imgHeight, $canvasWidth, $canvasHeight) {
  $scale = [Math]::Max($canvasWidth / $imgWidth, $canvasHeight / $imgHeight)
  $drawW = [int][Math]::Ceiling($imgWidth * $scale)
  $drawH = [int][Math]::Ceiling($imgHeight * $scale)
  $drawX = [int](($canvasWidth - $drawW) / 2)
  $drawY = [int](($canvasHeight - $drawH) / 2)
  return [System.Drawing.Rectangle]::new($drawX, $drawY, $drawW, $drawH)
}

function Draw-Background($graphics, $imagePath, $width, $height) {
  $img = [System.Drawing.Bitmap]::new($imagePath)
  $rect = Get-CoverRect $img.Width $img.Height $width $height
  $graphics.DrawImage($img, $rect)
  $img.Dispose()
}

function Draw-TopGradient($graphics, $width, $height) {
  $rect = [System.Drawing.RectangleF]::new(0, 0, $width, 360)
  $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $rect,
    [System.Drawing.Color]::FromArgb(225, 0, 0, 0),
    [System.Drawing.Color]::FromArgb(0, 0, 0, 0),
    [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
  )
  $graphics.FillRectangle($brush, $rect)
  $brush.Dispose()
}

function Draw-BottomGradient($graphics, $width, $height) {
  $rect = [System.Drawing.RectangleF]::new(0, 780, $width, 570)
  $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $rect,
    [System.Drawing.Color]::FromArgb(30, 0, 0, 0),
    [System.Drawing.Color]::FromArgb(240, 0, 0, 0),
    [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
  )
  $graphics.FillRectangle($brush, $rect)
  $brush.Dispose()
}

function Save-Slide($bitmap, $path) {
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
}

function Draw-Brand($graphics, $width) {
  $blue = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(51, 143, 255))
  $font = [System.Drawing.Font]::new('Segoe UI', 24, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $format = [System.Drawing.StringFormat]::new()
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $graphics.DrawString('BLUE STATE CLUB', $font, $blue, [System.Drawing.RectangleF]::new(0, 46, $width, 40), $format)
  $format.Dispose()
  $font.Dispose()
  $blue.Dispose()
}

function Draw-Logo($graphics, $logoPath) {
  $logoSrc = [System.Drawing.Bitmap]::new($logoPath)
  $graphics.DrawImage($logoSrc, [System.Drawing.Rectangle]::new(930, 1185, 120, 120))
  $logoSrc.Dispose()
}

function New-SlideBitmap() {
  $bmp = [System.Drawing.Bitmap]::new(1080, 1350)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  return @($bmp, $g)
}

function Build-Slide1($story, $folder, $logoPath) {
  $pair = New-SlideBitmap
  $bmp = $pair[0]; $g = $pair[1]
  Draw-Background $g $story.bgImage 1080 1350
  Draw-TopGradient $g 1080 1350
  Draw-BottomGradient $g 1080 1350
  Draw-Brand $g 1080

  $white = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(248,255,255,255))
  $font = [System.Drawing.Font]::new('Segoe UI', 58, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $format = [System.Drawing.StringFormat]::new()
  $format.Alignment = [System.Drawing.StringAlignment]::Near
  $g.DrawString($story.slide1Title, $font, $white, [System.Drawing.RectangleF]::new(45, 925, 930, 320), $format)
  $format.Dispose(); $font.Dispose(); $white.Dispose()
  Save-Slide $bmp (Join-Path $folder '01.png')
  $g.Dispose(); $bmp.Dispose()
}

function Build-Slide2($story, $folder, $logoPath) {
  $pair = New-SlideBitmap
  $bmp = $pair[0]; $g = $pair[1]
  Draw-Background $g $story.slide2Image 1080 1350
  Draw-TopGradient $g 1080 1350
  Draw-BottomGradient $g 1080 1350
  Draw-Brand $g 1080
  Draw-Logo $g $logoPath

  $white = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(248,255,255,255))
  $font = [System.Drawing.Font]::new('Segoe UI', 40, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $format = [System.Drawing.StringFormat]::new()
  $format.Alignment = [System.Drawing.StringAlignment]::Near
  $g.DrawString($story.slide2Summary, $font, $white, [System.Drawing.RectangleF]::new(42, 1015, 870, 220), $format)
  $format.Dispose(); $font.Dispose(); $white.Dispose()
  Save-Slide $bmp (Join-Path $folder '02.png')
  $g.Dispose(); $bmp.Dispose()
}

function Build-Slide3($story, $folder, $logoPath) {
  $pair = New-SlideBitmap
  $bmp = $pair[0]; $g = $pair[1]
  Draw-Background $g $story.bgImage 1080 1350
  Draw-TopGradient $g 1080 1350
  Draw-BottomGradient $g 1080 1350

  $midRect = [System.Drawing.RectangleF]::new(0, 420, 1080, 930)
  $midBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $midRect,
    [System.Drawing.Color]::FromArgb(80, 0, 0, 0),
    [System.Drawing.Color]::FromArgb(220, 0, 0, 0),
    [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
  )
  $g.FillRectangle($midBrush, $midRect)
  $midBrush.Dispose()

  Draw-Brand $g 1080
  Draw-Logo $g $logoPath

  $white = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(248,255,255,255))
  $headlineFont = [System.Drawing.Font]::new('Segoe UI', 56, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $subFont = [System.Drawing.Font]::new('Segoe UI', 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $bodyFont = [System.Drawing.Font]::new('Segoe UI', 24, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $center = [System.Drawing.StringFormat]::new()
  $center.Alignment = [System.Drawing.StringAlignment]::Center
  $left = [System.Drawing.StringFormat]::new()
  $left.Alignment = [System.Drawing.StringAlignment]::Near

  $g.DrawString($story.slide3Headline, $headlineFont, $white, [System.Drawing.RectangleF]::new(0, 185, 1080, 95), $center)
  $g.DrawString($story.slide3Subtitle, $subFont, $white, [System.Drawing.RectangleF]::new(0, 305, 1080, 45), $center)
  $pen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(51,143,255), 4)
  $g.DrawLine($pen, 130, 420, 950, 420)
  $g.DrawString($story.slide3Body, $bodyFont, $white, [System.Drawing.RectangleF]::new(60, 500, 880, 620), $left)

  $pen.Dispose(); $left.Dispose(); $center.Dispose()
  $bodyFont.Dispose(); $subFont.Dispose(); $headlineFont.Dispose(); $white.Dispose()
  Save-Slide $bmp (Join-Path $folder '03.png')
  $g.Dispose(); $bmp.Dispose()
}

function Build-Slide4($story, $folder, $slide4TemplatePath) {
  Copy-Item -LiteralPath $slide4TemplatePath -Destination (Join-Path $folder '04.png') -Force
}

function Build-Note($story, $folder) {
  $notePath = Join-Path $folder ($story.folderName + '.txt')
  $content = @(
    $story.noteTitle,
    '',
    $story.noteSummary,
    '',
    $story.noteTake,
    '',
    $story.noteTags
  ) -join [Environment]::NewLine
  Set-Content -LiteralPath $notePath -Value $content -Encoding UTF8
}

$logoPath = 'C:\Users\jyjy6\Documents\New project\assets\bluestateclub-logo-small.png'
if (-not (Test-Path -LiteralPath $logoPath)) {
  $logoSource = [System.Drawing.Bitmap]::new('C:\Users\jyjy6\Documents\New project\temp\output\Oil Traders Brace\03-clean.png')
  $logoRect = [System.Drawing.Rectangle]::new(940, 1180, 140, 140)
  $logoCrop = $logoSource.Clone($logoRect, $logoSource.PixelFormat)
  New-Dir 'C:\Users\jyjy6\Documents\New project\assets'
  $logoCrop.Save($logoPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $logoCrop.Dispose()
  $logoSource.Dispose()
}

$slide4TemplatePath = 'C:\Users\jyjy6\Documents\New project\temp\crop-auto\04.png'

$stories = @(
  [pscustomobject]@{
    folderName='DeepSeek Agentic AI'
    bgImage='C:\Users\jyjy6\Documents\New project\temp\licensed-serverroom.jpg'
    slide2Image='C:\Users\jyjy6\Documents\New project\temp\licensed-wafer.jpg'
    slide1Title="DeepSeek Hiring Hints At`nA Bigger Push Into`nAgentic AI."
    slide2Summary="New job listings suggest\rDeepSeek is shifting toward\rautonomous AI systems."
    slide3Headline='AGENTIC AI'
    slide3Subtitle='HIRING MOVES ARE SIGNALING A NEW AI RACE.'
    slide3Body="DeepSeek's latest hiring push suggests a broader move into agentic AI. Bloomberg's card highlights how talent demand is shifting from chat tools toward systems that can plan, act and automate more work. That raises the competitive pressure on global labs and cloud players."
    noteTitle='DeepSeek Hiring Hints At A Bigger Push Into Agentic AI.'
    noteSummary=@(
      'Bloomberg highlighted DeepSeek job postings as a signal of strategic change.',
      'The new roles point toward stronger work on agentic AI systems.',
      'That means software designed to plan, decide and act with less prompting.',
      'Hiring patterns often reveal where the next spending wave may go.',
      'The move adds pressure to a broader AI race already reshaping tech.'
    )
    noteTake='Hiring can reveal strategy before products do.'
    noteTags=@('#AgenticAI','#DeepSeek','#ArtificialIntelligence','#TechStrategy','#Bloomberg')
  },
  [pscustomobject]@{
    folderName='Trader Misconduct Flags'
    bgImage='C:\Users\jyjy6\Documents\New project\temp\licensed-tradingfloor.jpg'
    slide2Image='C:\Users\jyjy6\Documents\New project\temp\licensed-tradingfloor.jpg'
    slide1Title="Big Banks Look To`nCatch Trader Misconduct`nEarlier."
    slide2Summary="Bloomberg flagged fresh moves\rby Deutsche Bank and Goldman\rto better detect bad behavior."
    slide3Headline='TRADING WATCH'
    slide3Subtitle='BANK CONTROLS ARE MOVING CLOSER TO REAL TIME.'
    slide3Body="Bloomberg's roundup says major banks are looking for faster ways to flag trader misconduct. The logic is simple: waiting too long raises legal, reputational and financial risk. Better surveillance tools could make compliance more immediate, especially when markets are volatile."
    noteTitle='Big Banks Look To Catch Trader Misconduct Earlier.'
    noteSummary=@(
      'Bloomberg highlighted new scrutiny around trader misconduct controls.',
      'Deutsche Bank and Goldman were cited in the card.',
      'The focus is on spotting troubling behavior sooner, not later.',
      'Faster monitoring can reduce compliance and reputational damage.',
      'The theme points to surveillance becoming more central in markets.'
    )
    noteTake='Compliance speed is becoming a market advantage.'
    noteTags=@('#Trading','#Compliance','#WallStreet','#RiskManagement','#Bloomberg')
  },
  [pscustomobject]@{
    folderName='Nvidia Thinking Machines'
    bgImage='C:\Users\jyjy6\Documents\New project\temp\licensed-wafer.jpg'
    slide2Image='C:\Users\jyjy6\Documents\New project\temp\licensed-serverroom.jpg'
    slide1Title="Nvidia Backs Thinking`nMachines And Leans`nHarder Into AI."
    slide2Summary="Bloomberg says Nvidia is set\rto invest in Thinking Machines\rand support AI chip supply."
    slide3Headline='CHIP POWER'
    slide3Subtitle='AI CAPITAL AND AI HARDWARE ARE MOVING TOGETHER.'
    slide3Body="Bloomberg's card framed Nvidia's move as more than a simple funding bet. Investing in Thinking Machines while supplying chips ties capital directly to compute. That can deepen Nvidia's role not only as a hardware vendor, but as a strategic partner in the next generation of AI labs."
    noteTitle='Nvidia Backs Thinking Machines And Leans Harder Into AI.'
    noteSummary=@(
      'Bloomberg highlighted Nvidia investing in Thinking Machines.',
      'The card also pointed to Nvidia supporting AI chip supply.',
      'That links funding, infrastructure and distribution in one move.',
      'It strengthens Nvidia’s influence across the AI stack.',
      'The strategy reflects how compute and capital now move together.'
    )
    noteTake='In AI, chip supply and strategic funding now reinforce each other.'
    noteTags=@('#Nvidia','#AIChips','#ThinkingMachines','#Semiconductors','#Bloomberg')
  },
  [pscustomobject]@{
    folderName='Anthropic Billion Bet'
    bgImage='C:\Users\jyjy6\Documents\New project\temp\licensed-serverroom.jpg'
    slide2Image='C:\Users\jyjy6\Documents\New project\temp\licensed-tradingfloor.jpg'
    slide1Title="Blackstone Deepens`nIts Anthropic Bet`nTo $1 Billion."
    slide2Summary="Bloomberg says Blackstone joined\rAnthropic's round and raised\rits stake to $1 billion."
    slide3Headline='AI CAPITAL'
    slide3Subtitle='BIG MONEY IS STILL CHASING FRONTIER MODELS.'
    slide3Body="Bloomberg's post points to Blackstone increasing its Anthropic exposure to $1 billion. The message is that private capital still sees frontier AI as worth backing at scale. Even as the market matures, investors appear willing to keep paying for access to leading models and infrastructure."
    noteTitle='Blackstone Deepens Its Anthropic Bet To $1 Billion.'
    noteSummary=@(
      'Bloomberg highlighted a bigger Blackstone position in Anthropic.',
      'The new figure in the card reached a $1 billion stake.',
      'That shows private capital remains highly interested in top AI labs.',
      'The market is still rewarding scale, access and model leadership.',
      'Capital appetite has not disappeared despite a tougher funding climate.'
    )
    noteTake='The biggest AI checks are still being written.'
    noteTags=@('#Anthropic','#Blackstone','#AIInvestment','#PrivateCapital','#Bloomberg')
  },
  [pscustomobject]@{
    folderName='IPO Watch 2026'
    bgImage='C:\Users\jyjy6\Documents\New project\temp\licensed-tradingfloor.jpg'
    slide2Image='C:\Users\jyjy6\Documents\New project\temp\licensed-shanghai.jpg'
    slide1Title="Space, AI And Crypto`nLead The 2026 IPO`nWatchlist."
    slide2Summary="Bloomberg's market card said\rspace, AI and crypto names\rlead this year's IPO watch."
    slide3Headline='IPO WATCH'
    slide3Subtitle='RISKY SECTORS ARE STILL CHASING PUBLIC MONEY.'
    slide3Body="Bloomberg's list suggests 2026 IPO attention is clustering around space, AI and crypto. Those sectors promise growth, but they also carry volatility and story-driven pricing. If they dominate the pipeline, investors may be paying as much for narrative momentum as for fundamentals."
    noteTitle='Space, AI And Crypto Lead The 2026 IPO Watchlist.'
    noteSummary=@(
      'Bloomberg highlighted space, AI and crypto as IPO themes for 2026.',
      'Those sectors combine high growth expectations with high volatility.',
      'That can make IPO pricing especially sensitive to market mood.',
      'Narrative momentum may matter almost as much as business numbers.',
      'The lineup suggests risk appetite has not vanished from new listings.'
    )
    noteTake='The hottest IPO stories are still the most volatile ones.'
    noteTags=@('#IPO','#AIMarkets','#Crypto','#SpaceTech','#Bloomberg')
  }
)

New-Dir $OutputRoot

foreach ($story in $stories) {
  $folder = Join-Path $OutputRoot $story.folderName
  New-Dir $folder
  Build-Slide1 $story $folder $logoPath
  Build-Slide2 $story $folder $logoPath
  Build-Slide3 $story $folder $logoPath
  Build-Slide4 $story $folder $slide4TemplatePath
  Build-Note $story $folder
}

Get-ChildItem $OutputRoot -Directory | Select-Object Name,FullName
