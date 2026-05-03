$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$outputDir = 'C:\Users\jyjy6\Documents\New project\output\web3-city-variants'
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$width = 1500
$height = 500

function New-Color([int]$a, [int]$r, [int]$g, [int]$b) {
    [System.Drawing.Color]::FromArgb($a, $r, $g, $b)
}

function Fill-PolygonColor {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Drawing.Color]$Color,
        [System.Drawing.Point[]]$Points
    )

    $brush = New-Object System.Drawing.SolidBrush($Color)
    $Graphics.FillPolygon($brush, $Points)
    $brush.Dispose()
}

function Add-IsoBuilding {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$X,
        [int]$BaseY,
        [int]$FrontW,
        [int]$FrontH,
        [int]$DepthX,
        [int]$DepthY,
        [System.Drawing.Color]$Front,
        [System.Drawing.Color]$Side,
        [System.Drawing.Color]$Top,
        [System.Drawing.Color]$Window,
        [System.Random]$Random
    )

    $frontPts = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new($X, $BaseY - $FrontH),
        [System.Drawing.Point]::new($X + $FrontW, $BaseY - $FrontH),
        [System.Drawing.Point]::new($X + $FrontW, $BaseY),
        [System.Drawing.Point]::new($X, $BaseY)
    )
    $sidePts = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new($X + $FrontW, $BaseY - $FrontH),
        [System.Drawing.Point]::new($X + $FrontW + $DepthX, $BaseY - $FrontH - $DepthY),
        [System.Drawing.Point]::new($X + $FrontW + $DepthX, $BaseY - $DepthY),
        [System.Drawing.Point]::new($X + $FrontW, $BaseY)
    )
    $topPts = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new($X, $BaseY - $FrontH),
        [System.Drawing.Point]::new($X + $FrontW, $BaseY - $FrontH),
        [System.Drawing.Point]::new($X + $FrontW + $DepthX, $BaseY - $FrontH - $DepthY),
        [System.Drawing.Point]::new($X + $DepthX, $BaseY - $FrontH - $DepthY)
    )

    Fill-PolygonColor -Graphics $Graphics -Color $Side -Points $sidePts
    Fill-PolygonColor -Graphics $Graphics -Color $Top -Points $topPts
    Fill-PolygonColor -Graphics $Graphics -Color $Front -Points $frontPts

    $windowBrush = New-Object System.Drawing.SolidBrush($Window)
    $cols = [Math]::Max(2, [int]($FrontW / 24))
    $rows = [Math]::Max(4, [int]($FrontH / 30))
    $winW = [Math]::Max(5, [int]($FrontW / ($cols * 2.4)))
    $winH = [Math]::Max(6, [int]($FrontH / ($rows * 2.1)))
    for ($c = 0; $c -lt $cols; $c++) {
        for ($r = 0; $r -lt $rows; $r++) {
            if ($Random.Next(0, 100) -lt 70) {
                $wx = $X + 10 + [int]($c * (($FrontW - 20) / [Math]::Max(1, $cols)))
                $wy = ($BaseY - $FrontH) + 16 + [int]($r * (($FrontH - 24) / [Math]::Max(1, $rows)))
                if ($wx + $winW -lt $X + $FrontW - 8 -and $wy + $winH -lt $BaseY - 8) {
                    $Graphics.FillRectangle($windowBrush, $wx, $wy, $winW, $winH)
                }
            }
        }
    }
    $windowBrush.Dispose()

    $edgePen = New-Object System.Drawing.Pen((New-Color 85 176 214 255), 2)
    $Graphics.DrawPolygon($edgePen, $topPts)
    $Graphics.DrawPolygon($edgePen, $sidePts)
    $edgePen.Dispose()
}

function Add-SharpBar {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Drawing.Color]$Color,
        [float]$CenterX,
        [float]$CenterY,
        [float]$BarWidth,
        [float]$BarHeight,
        [float]$Angle,
        [float]$Slant
    )

    $halfW = $BarWidth / 2.0
    $halfH = $BarHeight / 2.0
    $points = New-Object 'System.Drawing.PointF[]' 4
    $points[0] = [System.Drawing.PointF]::new([single]((-1 * $halfW) + $Slant), [single](-1 * $halfH))
    $points[1] = [System.Drawing.PointF]::new([single]$halfW, [single](-1 * $halfH))
    $points[2] = [System.Drawing.PointF]::new([single]($halfW - $Slant), [single]$halfH)
    $points[3] = [System.Drawing.PointF]::new([single](-1 * $halfW), [single]$halfH)

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddPolygon($points)
    $matrix = New-Object System.Drawing.Drawing2D.Matrix
    $matrix.Rotate($Angle)
    $matrix.Translate($CenterX, $CenterY, [System.Drawing.Drawing2D.MatrixOrder]::Append)
    $path.Transform($matrix)
    $brush = New-Object System.Drawing.SolidBrush($Color)
    $Graphics.FillPath($brush, $path)
    $brush.Dispose()
    $matrix.Dispose()
    $path.Dispose()
}

function Add-LogoMark {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$CenterX,
        [int]$CenterY,
        [double]$Scale,
        [double]$Rotation
    )

    $state = $Graphics.Save()
    $Graphics.TranslateTransform($CenterX, $CenterY)
    $Graphics.RotateTransform([single]$Rotation)

    $glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $glowPath.AddEllipse([int](-175 * $Scale), [int](-120 * $Scale), [int](350 * $Scale), [int](250 * $Scale))
    $glowBrush = [System.Drawing.Drawing2D.PathGradientBrush]::new($glowPath)
    $glowBrush.CenterColor = (New-Color 88 255 255 255)
    $glowBrush.SurroundColors = @((New-Color 0 255 255 255))
    $Graphics.FillPath($glowBrush, $glowPath)
    $glowBrush.Dispose()
    $glowPath.Dispose()

    Add-SharpBar -Graphics $Graphics -Color (New-Color 255 255 255 255) -CenterX 0 -CenterY 0 -BarWidth (284 * $Scale) -BarHeight (78 * $Scale) -Angle 38 -Slant (62 * $Scale)
    Add-SharpBar -Graphics $Graphics -Color (New-Color 255 255 255 255) -CenterX (20 * $Scale) -CenterY (-23 * $Scale) -BarWidth (284 * $Scale) -BarHeight (78 * $Scale) -Angle -38 -Slant (62 * $Scale)
    Add-SharpBar -Graphics $Graphics -Color (New-Color 255 255 255 255) -CenterX (112 * $Scale) -CenterY (-138 * $Scale) -BarWidth (242 * $Scale) -BarHeight (64 * $Scale) -Angle -36 -Slant (54 * $Scale)

    $Graphics.Restore($state)
}

function Add-NetworkOrbs {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Drawing.Point[]]$Points
    )

    $pen = New-Object System.Drawing.Pen((New-Color 165 154 220 255), 4)
    for ($i = 0; $i -lt ($Points.Count - 1); $i++) {
        $Graphics.DrawLine($pen, $Points[$i], $Points[$i + 1])
    }
    $brush = New-Object System.Drawing.SolidBrush((New-Color 86 255 255 255))
    foreach ($point in $Points) {
        $Graphics.FillEllipse($brush, $point.X - 12, $point.Y - 12, 24, 24)
        $outline = New-Object System.Drawing.Pen((New-Color 170 171 230 255), 3)
        $Graphics.DrawEllipse($outline, $point.X - 42, $point.Y - 42, 84, 84)
        $outline.Dispose()
    }
    $brush.Dispose()
    $pen.Dispose()
}

function Add-Grid {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$VanishX,
        [int]$VanishY
    )

    $gridPen = New-Object System.Drawing.Pen((New-Color 116 98 170 255), 2)
    for ($i = 0; $i -le 12; $i++) {
        $y = 450 + [int]($i * 4.3 * $i / 2)
        $Graphics.DrawLine($gridPen, 0, $y, $width, $y)
    }
    for ($i = 0; $i -le 10; $i++) {
        $left = $VanishX - [int]($i * 92)
        $right = $VanishX + [int]($i * 92)
        $Graphics.DrawLine($gridPen, $left, 500, $VanishX, $VanishY)
        $Graphics.DrawLine($gridPen, $right, 500, $VanishX, $VanishY)
    }
    $gridPen.Dispose()
}

$variants = @(
    [pscustomobject]@{
        Name = 'web3-city-01-core'
        Seed = 101
        Top = (New-Color 255 8 20 86)
        Bottom = (New-Color 255 46 92 228)
        GlowX = 1080
        GlowY = 24
        VanishX = 750
        VanishY = 340
        LogoX = 1110
        LogoY = 175
        LogoScale = 1.0
        LogoRotation = 0
        Buildings = @(
            @(20,420,70,120,18,18), @(100,420,85,170,22,20), @(198,420,92,210,24,22), @(308,420,86,150,22,18),
            @(410,420,110,220,28,22), @(536,420,96,190,24,18), @(650,420,104,240,30,24), @(772,420,82,170,22,18),
            @(870,420,92,210,26,22), @(982,420,110,250,32,28), @(1110,420,86,165,22,16), @(1210,420,92,205,24,20),
            @(1320,420,82,160,20,16), @(1412,420,64,198,18,18)
        )
        Orbs = @(
            [System.Drawing.Point]::new(194,96),
            [System.Drawing.Point]::new(308,126),
            [System.Drawing.Point]::new(438,92)
        )
    },
    [pscustomobject]@{
        Name = 'web3-city-02-tower'
        Seed = 202
        Top = (New-Color 255 12 24 92)
        Bottom = (New-Color 255 52 100 232)
        GlowX = 1160
        GlowY = 18
        VanishX = 790
        VanishY = 334
        LogoX = 1190
        LogoY = 158
        LogoScale = 0.9
        LogoRotation = 6
        Buildings = @(
            @(12,420,76,138,18,16), @(100,420,92,178,24,22), @(212,420,80,160,22,18), @(308,420,100,226,28,24),
            @(424,420,88,186,22,20), @(528,420,96,164,24,18), @(640,420,120,272,34,28), @(780,420,74,154,20,16),
            @(870,420,110,224,28,24), @(1002,420,80,176,22,18), @(1098,420,90,202,24,20), @(1208,420,110,238,28,22),
            @(1338,420,94,200,24,20), @(1442,420,56,168,16,14)
        )
        Orbs = @(
            [System.Drawing.Point]::new(158,108),
            [System.Drawing.Point]::new(292,132),
            [System.Drawing.Point]::new(412,100),
            [System.Drawing.Point]::new(520,142)
        )
    },
    [pscustomobject]@{
        Name = 'web3-city-03-center-logo'
        Seed = 303
        Top = (New-Color 255 10 22 90)
        Bottom = (New-Color 255 49 94 224)
        GlowX = 760
        GlowY = 16
        VanishX = 750
        VanishY = 332
        LogoX = 760
        LogoY = 132
        LogoScale = 0.78
        LogoRotation = -4
        Buildings = @(
            @(8,420,80,142,18,16), @(102,420,86,188,22,18), @(204,420,96,214,26,22), @(318,420,88,176,22,18),
            @(420,420,110,236,28,24), @(548,420,82,170,22,18), @(646,420,92,184,24,20), @(762,420,94,200,24,22),
            @(876,420,88,174,22,18), @(980,420,110,240,30,26), @(1108,420,84,168,22,18), @(1206,420,96,210,24,20),
            @(1320,420,86,188,22,18), @(1422,420,62,168,18,14)
        )
        Orbs = @(
            [System.Drawing.Point]::new(214,98),
            [System.Drawing.Point]::new(328,126),
            [System.Drawing.Point]::new(450,90)
        )
    },
    [pscustomobject]@{
        Name = 'web3-city-04-wide-network'
        Seed = 404
        Top = (New-Color 255 9 24 96)
        Bottom = (New-Color 255 54 108 236)
        GlowX = 1040
        GlowY = 20
        VanishX = 710
        VanishY = 338
        LogoX = 1085
        LogoY = 168
        LogoScale = 0.95
        LogoRotation = -8
        Buildings = @(
            @(0,420,68,118,16,14), @(80,420,92,190,24,20), @(190,420,84,156,22,18), @(290,420,108,212,26,24),
            @(416,420,76,148,20,16), @(506,420,118,246,30,24), @(644,420,92,180,24,18), @(754,420,84,164,22,16),
            @(854,420,116,230,28,24), @(988,420,88,170,22,18), @(1090,420,104,216,28,22), @(1212,420,76,154,20,16),
            @(1304,420,102,206,24,20), @(1424,420,70,174,18,16)
        )
        Orbs = @(
            [System.Drawing.Point]::new(124,90),
            [System.Drawing.Point]::new(256,120),
            [System.Drawing.Point]::new(384,88),
            [System.Drawing.Point]::new(524,132)
        )
    },
    [pscustomobject]@{
        Name = 'web3-city-05-horizon'
        Seed = 505
        Top = (New-Color 255 14 28 104)
        Bottom = (New-Color 255 58 112 240)
        GlowX = 1180
        GlowY = 18
        VanishX = 770
        VanishY = 336
        LogoX = 1220
        LogoY = 150
        LogoScale = 0.88
        LogoRotation = 10
        Buildings = @(
            @(10,420,70,136,16,16), @(92,420,86,176,22,18), @(194,420,100,224,26,22), @(312,420,82,160,22,18),
            @(410,420,116,244,30,24), @(544,420,78,150,20,16), @(636,420,106,216,28,24), @(760,420,84,166,22,18),
            @(858,420,92,206,24,20), @(968,420,116,248,30,26), @(1102,420,82,162,22,16), @(1198,420,96,220,26,22),
            @(1312,420,84,184,22,18), @(1414,420,70,200,18,18)
        )
        Orbs = @(
            [System.Drawing.Point]::new(174,92),
            [System.Drawing.Point]::new(302,126),
            [System.Drawing.Point]::new(430,88)
        )
    }
)

$files = @()

foreach ($variant in $variants) {
    $random = [System.Random]::new($variant.Seed)
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $canvas = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
    $background = New-Object System.Drawing.Drawing2D.LinearGradientBrush($canvas, $variant.Top, $variant.Bottom, 90)
    $graphics.FillRectangle($background, $canvas)
    $background.Dispose()

    $skyGlowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $skyGlowPath.AddEllipse($variant.GlowX - 250, $variant.GlowY - 30, 420, 340)
    $skyGlowBrush = [System.Drawing.Drawing2D.PathGradientBrush]::new($skyGlowPath)
    $skyGlowBrush.CenterColor = (New-Color 110 150 185 255)
    $skyGlowBrush.SurroundColors = @((New-Color 0 150 185 255))
    $graphics.FillPath($skyGlowBrush, $skyGlowPath)
    $skyGlowBrush.Dispose()
    $skyGlowPath.Dispose()

    $mist = New-Object System.Drawing.Drawing2D.LinearGradientBrush([System.Drawing.Rectangle]::new(0, 250, $width, 170), (New-Color 0 255 255 255), (New-Color 50 140 180 255), 90)
    $graphics.FillRectangle($mist, 0, 250, $width, 170)
    $mist.Dispose()

    $starBrush = New-Object System.Drawing.SolidBrush((New-Color 120 255 255 255))
    for ($i = 0; $i -lt 28; $i++) {
        $x = $random.Next(20, 1480)
        $y = $random.Next(20, 180)
        $r = $random.Next(2, 5)
        $graphics.FillEllipse($starBrush, $x, $y, $r, $r)
    }
    $starBrush.Dispose()

    Add-NetworkOrbs -Graphics $graphics -Points $variant.Orbs

    $chartPen = New-Object System.Drawing.Pen((New-Color 165 188 230 255), 4)
    $chartPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $chart = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new(60, 202),
        [System.Drawing.Point]::new(170, 182),
        [System.Drawing.Point]::new(246, 214),
        [System.Drawing.Point]::new(350, 158),
        [System.Drawing.Point]::new(438, 170),
        [System.Drawing.Point]::new(520, 132)
    )
    $graphics.DrawLines($chartPen, $chart)
    $chartPen.Dispose()

    foreach ($building in $variant.Buildings) {
        Add-IsoBuilding -Graphics $graphics -X $building[0] -BaseY $building[1] -FrontW $building[2] -FrontH $building[3] -DepthX $building[4] -DepthY $building[5] -Front (New-Color 255 36 49 148) -Side (New-Color 255 18 28 102) -Top (New-Color 255 82 108 214) -Window (New-Color 180 214 238 255) -Random $random
    }

    $groundBrush = New-Object System.Drawing.SolidBrush((New-Color 255 9 14 62))
    $groundPoints = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new(0, 500),
        [System.Drawing.Point]::new($variant.VanishX - 190, 500),
        [System.Drawing.Point]::new($variant.VanishX, $variant.VanishY),
        [System.Drawing.Point]::new($variant.VanishX + 210, 500),
        [System.Drawing.Point]::new(1500, 500),
        [System.Drawing.Point]::new(1500, 450),
        [System.Drawing.Point]::new(0, 450)
    )
    $graphics.FillPolygon($groundBrush, $groundPoints)
    $groundBrush.Dispose()

    Add-Grid -Graphics $graphics -VanishX $variant.VanishX -VanishY $variant.VanishY

    $lanePen = New-Object System.Drawing.Pen((New-Color 180 120 230 255), 4)
    $graphics.DrawLine($lanePen, $variant.VanishX, $variant.VanishY + 8, $variant.VanishX, 500)
    $graphics.DrawLine($lanePen, $variant.VanishX - 44, $variant.VanishY + 36, $variant.VanishX - 44, 500)
    $graphics.DrawLine($lanePen, $variant.VanishX + 44, $variant.VanishY + 36, $variant.VanishX + 44, 500)
    $lanePen.Dispose()

    $ribbonPen = New-Object System.Drawing.Pen((New-Color 96 188 225 255), 3)
    $graphics.DrawBezier($ribbonPen, 60, 254, 220, 176, 362, 196, 520, 132)
    $graphics.DrawBezier($ribbonPen, 972, 162, 1126, 112, 1244, 132, 1442, 212)
    $ribbonPen.Dispose()

    Add-LogoMark -Graphics $graphics -CenterX $variant.LogoX -CenterY $variant.LogoY -Scale $variant.LogoScale -Rotation $variant.LogoRotation

    $ringPen = New-Object System.Drawing.Pen((New-Color 92 255 255 255), 2)
    $graphics.DrawArc($ringPen, $variant.LogoX - 150, $variant.LogoY - 130, 360, 220, 198, 110)
    $graphics.DrawArc($ringPen, $variant.LogoX - 185, $variant.LogoY - 110, 430, 210, 208, 88)
    $ringPen.Dispose()

    $scanPen = New-Object System.Drawing.Pen((New-Color 56 255 255 255), 1)
    for ($i = 0; $i -lt 7; $i++) {
        $yy = 54 + ($i * 18)
        $graphics.DrawLine($scanPen, $variant.LogoX - 120, $yy, $variant.LogoX + 250, $yy)
    }
    $scanPen.Dispose()

    $file = Join-Path $outputDir ($variant.Name + '.png')
    $bitmap.Save($file, [System.Drawing.Imaging.ImageFormat]::Png)
    $files += $file

    $graphics.Dispose()
    $bitmap.Dispose()
}

$files | ForEach-Object { Write-Output $_ }
