param(
  [string]$TemplatePsdPath = 'F:\bluestateclub\bluestateclub_instagram_cardnews_form.psd',
  [string]$OutputRoot = 'F:\bluestateclub'
)

$ErrorActionPreference = 'Stop'

function New-Dir([string]$path) {
  $null = New-Item -ItemType Directory -Path $path -Force
}

function Write-StoryJsx {
  param(
    [pscustomobject]$Story,
    [string]$WorkingPsdPath,
    [string]$StripOutputPath,
    [string]$JsxPath
  )

  $slide1 = ($Story.slide1Title | ConvertTo-Json -Compress)
  $slide2 = ($Story.slide2Summary | ConvertTo-Json -Compress)
  $slide3Headline = ($Story.slide3Headline | ConvertTo-Json -Compress)
  $slide3Subtitle = ($Story.slide3Subtitle | ConvertTo-Json -Compress)
  $slide3Body = ($Story.slide3Body | ConvertTo-Json -Compress)
  $bg1 = ($Story.bgImage -replace '\\','/')
  $bg2 = ($Story.slide2Image -replace '\\','/')
  $working = ($WorkingPsdPath -replace '\\','/')
  $strip = ($StripOutputPath -replace '\\','/')

  $jsx = @"
app.displayDialogs = DialogModes.NO;

function px(n) { return UnitValue(n, "px"); }
function savePng(doc, pathStr) {
  var pngFile = new File(pathStr);
  var opts = new PNGSaveOptions();
  doc.saveAs(pngFile, opts, true, Extension.LOWERCASE);
}
function fitLayerToRect(layer, left, top, right, bottom) {
  var b = layer.bounds;
  var currentW = b[2].as("px") - b[0].as("px");
  var currentH = b[3].as("px") - b[1].as("px");
  var targetW = right - left;
  var targetH = bottom - top;
  var scale = Math.max(targetW / currentW, targetH / currentH) * 100;
  layer.resize(scale, scale, AnchorPosition.MIDDLECENTER);
  b = layer.bounds;
  var cx = (b[0].as("px") + b[2].as("px")) / 2;
  var cy = (b[1].as("px") + b[3].as("px")) / 2;
  layer.translate(px(left + targetW / 2 - cx), px(top + targetH / 2 - cy));
}
function placeImage(doc, artboard, imagePath, left, top, right, bottom) {
  var imgDoc = app.open(new File(imagePath));
  imgDoc.activeLayer.duplicate(doc, ElementPlacement.PLACEATBEGINNING);
  imgDoc.close(SaveOptions.DONOTSAVECHANGES);
  var layer = doc.activeLayer;
  layer.move(artboard, ElementPlacement.PLACEATEND);
  fitLayerToRect(layer, left, top, right, bottom);
}
function findTextLayerInRange(container, minTop, maxTop) {
  for (var i = 0; i < container.layers.length; i++) {
    var layer = container.layers[i];
    if (layer.typename === "ArtLayer" && layer.kind === LayerKind.TEXT) {
      var top = layer.bounds[1].as("px");
      if (top >= minTop && top <= maxTop) return layer;
    }
  }
  return null;
}

var doc = app.open(new File("$working"));
var artboard4 = doc.layerSets[0];
var artboard3 = doc.layerSets[1];
var artboard2 = doc.layerSets[2];
var artboard1 = doc.layerSets[3];

placeImage(doc, artboard1, "$bg1", -46, 0, 1106, 1350);
placeImage(doc, artboard2, "$bg2", 1144, 0, 2296, 1350);
placeImage(doc, artboard3, "$bg1", 2324, 0, 3476, 1350);

var titleLayer = findTextLayerInRange(artboard1, 850, 1250);
var summaryLayer = findTextLayerInRange(artboard2, 950, 1250);
var headlineLayer = findTextLayerInRange(artboard3, 200, 320);
var subtitleLayer = findTextLayerInRange(artboard3, 320, 420);
var bodyLayer = findTextLayerInRange(artboard3, 500, 1150);

titleLayer.textItem.contents = $slide1;
titleLayer.textItem.justification = Justification.CENTER;

summaryLayer.textItem.contents = $slide2;
summaryLayer.textItem.justification = Justification.LEFT;

headlineLayer.textItem.contents = $slide3Headline;
subtitleLayer.textItem.contents = $slide3Subtitle;

// Match the Oil Traders Brace slide 3 layout: wider left-aligned paragraph box.
bodyLayer.textItem.kind = TextType.PARAGRAPHTEXT;
bodyLayer.textItem.width = px(880);
bodyLayer.textItem.height = px(660);
bodyLayer.textItem.position = [px(2430), px(500)];
bodyLayer.textItem.justification = Justification.LEFT;
bodyLayer.textItem.contents = $slide3Body;

var dup = doc.duplicate();
savePng(dup, "$strip");
dup.close(SaveOptions.DONOTSAVECHANGES);
doc.close(SaveOptions.DONOTSAVECHANGES);
app.quit();
"@

  Set-Content -LiteralPath $JsxPath -Value $jsx -Encoding UTF8
}

function Crop-TemplateStripToSlides {
  param(
    [string]$StripPath,
    [string]$OutputFolder
  )

  Add-Type -AssemblyName System.Drawing
  $deadline = (Get-Date).AddSeconds(60)
  $img = $null
  while (-not $img -and (Get-Date) -lt $deadline) {
    try {
      $img = [System.Drawing.Bitmap]::new($StripPath)
    } catch {
      Start-Sleep -Seconds 2
    }
  }
  if (-not $img) {
    throw "Unable to open rendered strip as an image: $StripPath"
  }
  $map = @{
    '01.png' = 0
    '02.png' = 25
    '03.png' = 50
    '04.png' = 75
  }
  foreach ($name in $map.Keys) {
    $rect = New-Object System.Drawing.Rectangle($map[$name], 0, 1080, 1350)
    $clone = $img.Clone($rect, $img.PixelFormat)
    $clone.Save((Join-Path $OutputFolder $name), [System.Drawing.Imaging.ImageFormat]::Png)
    $clone.Dispose()
  }
  $img.Dispose()
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

$stories = @(
  [pscustomobject]@{
    folderName='DeepSeek Agentic AI'
    bgImage='C:\Users\jyjy6\Documents\New project\temp\licensed-serverroom.jpg'
    slide2Image='C:\Users\jyjy6\Documents\New project\temp\licensed-wafer.jpg'
    slide1Title="DeepSeek Hiring Hints At.`rA Bigger Push Into`rAgentic AI."
    slide2Summary="DeepSeek job listings hint at`ra bigger move toward agentic AI`rand more autonomous systems."
    slide3Headline='AGENTIC AI'
    slide3Subtitle='HIRING MOVES ARE SIGNALING A NEW AI RACE.'
    slide3Body="DeepSeek's latest hiring push suggests a broader move into agentic AI.`rBloomberg's card highlights how talent demand is shifting from chat tools`rtoward systems that can plan, act and automate more work.`r`rThat raises competitive pressure on global labs and cloud players.`r`rA faster shift toward agentic systems could reshape the next AI spending cycle."
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
    slide1Title="Big Banks Look To`rCatch Trader Misconduct`rEarlier."
    slide2Summary="Deutsche Bank and Goldman are`rlooking for faster ways to spot`rtrader misconduct."
    slide3Headline='TRADING WATCH'
    slide3Subtitle='BANK CONTROLS ARE MOVING CLOSER TO REAL TIME.'
    slide3Body="Bloomberg says major banks are looking for faster ways to flag trader misconduct.`rThe goal is to catch troubling behavior earlier, before legal and reputational costs grow.`r`rBetter surveillance tools could make compliance more immediate.`r`rThat matters even more when markets turn volatile and decision pressure rises."
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
    slide1Title="Nvidia Backs Thinking`rMachines And Leans`rHarder Into AI."
    slide2Summary="Nvidia is investing in Thinking`rMachines while helping support`rAI chip supply."
    slide3Headline='CHIP POWER'
    slide3Subtitle='AI CAPITAL AND AI HARDWARE ARE MOVING TOGETHER.'
    slide3Body="Bloomberg's card framed Nvidia's move as more than a simple funding bet.`rInvesting in Thinking Machines while supplying chips ties capital directly to compute.`r`rThat can deepen Nvidia's role not only as a hardware vendor.`r`rIt also strengthens its position as a strategic partner for the next wave of AI labs."
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
    slide1Title="Blackstone Deepens`rIts Anthropic Bet`rTo `$1 Billion."
    slide2Summary="Blackstone joined Anthropic's`rround and raised its stake`rto `$1 billion."
    slide3Headline='AI CAPITAL'
    slide3Subtitle='BIG MONEY IS STILL CHASING FRONTIER MODELS.'
    slide3Body="Bloomberg says Blackstone raised its Anthropic exposure to `$1 billion.`rThe message is that private capital still sees frontier AI as worth backing at scale.`r`rEven as the market matures, investors are still paying for access to leading models.`r`rThe biggest checks suggest confidence in long-term AI demand has not faded."
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
    slide1Title="Space, AI And Crypto`rLead The 2026 IPO`rWatchlist."
    slide2Summary="Bloomberg says space, AI and`rcrypto candidates are leading`rthis year's IPO watch."
    slide3Headline='IPO WATCH'
    slide3Subtitle='RISKY SECTORS ARE STILL CHASING PUBLIC MONEY.'
    slide3Body="Bloomberg's list suggests 2026 IPO attention is clustering around space, AI and crypto.`rThose sectors promise growth, but they also carry volatility and story-driven pricing.`r`rIf they dominate the pipeline, investors may be paying as much for momentum as fundamentals.`r`rThat makes the coming IPO window important for broader market risk appetite."
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
$tempRoot = Join-Path $env:TEMP 'bluestateclub-psd-runs'
New-Dir $tempRoot

foreach ($story in $stories) {
  $folder = Join-Path $OutputRoot $story.folderName
  New-Dir $folder

  $workingPsd = Join-Path $tempRoot ($story.folderName + '.psd')
  $stripPath = Join-Path $tempRoot ($story.folderName + '-strip.png')
  $jsxPath = Join-Path $tempRoot ($story.folderName + '.jsx')

  Copy-Item -LiteralPath $TemplatePsdPath -Destination $workingPsd -Force
  Write-StoryJsx -Story $story -WorkingPsdPath $workingPsd -StripOutputPath $stripPath -JsxPath $jsxPath

  & 'C:\Users\jyjy6\Documents\New project\scripts\invoke-photoshop-2026-job.ps1' -ScriptPath $jsxPath -ExpectedOutputPath $stripPath -InitialWaitSeconds 12 -PollIntervalSeconds 4 -TimeoutSeconds 180 | Out-Null

  Crop-TemplateStripToSlides -StripPath $stripPath -OutputFolder $folder
  Build-Note $story $folder
}

Get-ChildItem $OutputRoot -Directory | Select-Object Name,FullName
