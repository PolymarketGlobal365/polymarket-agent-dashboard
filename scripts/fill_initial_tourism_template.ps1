$ErrorActionPreference = "Stop"

$src = "C:\Users\jyjy6\Documents\New project\tmp_initial_tourism_template.pptx"
$out = "C:\Users\jyjy6\Documents\New project\drafts\unitmedia_initial_tourism_venture_filled_draft.pptx"
$dataPath = "C:\Users\jyjy6\Documents\New project\scripts\fill_initial_tourism_template_data.json"

Copy-Item -LiteralPath $src -Destination $out -Force
$data = Get-Content -LiteralPath $dataPath -Raw -Encoding UTF8 | ConvertFrom-Json

function Set-ShapeText {
    param(
        $slide,
        [int]$shapeId,
        [string]$text,
        [int]$fontSize = 14
    )
    $shape = $slide.Shapes | Where-Object { $_.Id -eq $shapeId } | Select-Object -First 1
    if (-not $shape) { throw "Shape $shapeId not found on slide $($slide.SlideIndex)" }
    $shape.TextFrame.TextRange.Text = $text
    $shape.TextFrame.TextRange.Font.Size = $fontSize
}

function Set-TableCell {
    param(
        $slide,
        [int]$shapeId,
        [int]$row,
        [int]$col,
        [string]$text,
        [int]$fontSize = 11
    )
    $shape = $slide.Shapes | Where-Object { $_.Id -eq $shapeId } | Select-Object -First 1
    if (-not $shape) { throw "Table shape $shapeId not found on slide $($slide.SlideIndex)" }
    $cell = $shape.Table.Cell($row, $col).Shape.TextFrame.TextRange
    $cell.Text = $text
    $cell.Font.Size = $fontSize
}

$pp = New-Object -ComObject PowerPoint.Application
$pp.Visible = -1
$pres = $pp.Presentations.Open($out, $false, $false, $false)

try {
    foreach ($entry in $data.shapeTexts) {
        $slide = $pres.Slides.Item([int]$entry.slide)
        Set-ShapeText $slide ([int]$entry.shapeId) ([string]$entry.text) ([int]$entry.fontSize)
    }

    foreach ($cell in $data.tableCells) {
        $slide = $pres.Slides.Item([int]$cell.slide)
        Set-TableCell $slide ([int]$cell.shapeId) ([int]$cell.row) ([int]$cell.col) ([string]$cell.text) ([int]$cell.fontSize)
    }

    $pres.Save()
}
finally {
    $pres.Close()
    $pp.Quit()
}

Write-Output "Filled draft created: $out"
