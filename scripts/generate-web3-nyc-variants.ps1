$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$outputDir = 'C:\Users\jyjy6\Documents\New project\output\web3-nyc-variants'
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$width = 1500
$height = 500

function New-Color([int]$a, [int]$r, [int]$g, [int]$b) {
    [System.Drawing.Color]::FromArgb($a, $r, $g, $b)
}

function Fill-Poly {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Drawing.Color]$Color,
        [System.Drawing.Point[]]$Points
    )

    $brush = New-Object System.Drawing.SolidBrush($Color)
    $Graphics.FillPolygon($brush, $Points)
    $brush.Dispose()
}

function Add-SkyGlow {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$X,
        [int]$Y,
        [int]$Width,
        [int]$Height,
        [System.Drawing.Color]$CenterColor
    )

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse($X, $Y, $Width, $Height)
    $brush = [System.Drawing.Drawing2D.PathGradientBrush]::new($path)
    $brush.CenterColor = $CenterColor
    $brush.SurroundColors = @((New-Color 0 $CenterColor.R $CenterColor.G $CenterColor.B))
    $Graphics.FillPath($brush, $path)
    $brush.Dispose()
    $path.Dispose()
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
    $glowPath.AddEllipse([int](-170 * $Scale), [int](-120 * $Scale), [int](340 * $Scale), [int](250 * $Scale))
    $glowBrush = [System.Drawing.Drawing2D.PathGradientBrush]::new($glowPath)
    $glowBrush.CenterColor = (New-Color 88 255 255 255)
    $glowBrush.SurroundColors = @((New-Color 0 255 255 255))
    $Graphics.FillPath($glowBrush, $glowPath)
    $glowBrush.Dispose()
    $glowPath.Dispose()

    Add-SharpBar -Graphics $Graphics -Color (New-Color 255 255 255 255) -CenterX 0 -CenterY 0 -BarWidth (264 * $Scale) -BarHeight (74 * $Scale) -Angle 38 -Slant (60 * $Scale)
    Add-SharpBar -Graphics $Graphics -Color (New-Color 255 255 255 255) -CenterX (18 * $Scale) -CenterY (-22 * $Scale) -BarWidth (264 * $Scale) -BarHeight (74 * $Scale) -Angle -38 -Slant (60 * $Scale)
    Add-SharpBar -Graphics $Graphics -Color (New-Color 255 255 255 255) -CenterX (104 * $Scale) -CenterY (-128 * $Scale) -BarWidth (228 * $Scale) -BarHeight (60 * $Scale) -Angle -36 -Slant (50 * $Scale)

    $Graphics.Restore($state)
}

function Add-Grid {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$VanishX,
        [int]$VanishY
    )

    $gridPen = New-Object System.Drawing.Pen((New-Color 100 76 132 232), 2)
    for ($i = 0; $i -le 12; $i++) {
        $y = 448 + [int]($i * 4.4 * $i / 2)
        $Graphics.DrawLine($gridPen, 0, $y, $width, $y)
    }
    for ($i = 0; $i -le 10; $i++) {
        $left = $VanishX - [int]($i * 90)
        $right = $VanishX + [int]($i * 90)
        $Graphics.DrawLine($gridPen, $left, 500, $VanishX, $VanishY)
        $Graphics.DrawLine($gridPen, $right, 500, $VanishX, $VanishY)
    }
    $gridPen.Dispose()
}

function Add-NetworkOrbs {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Drawing.Point[]]$Points
    )

    $pen = New-Object System.Drawing.Pen((New-Color 150 154 214 255), 4)
    for ($i = 0; $i -lt ($Points.Count - 1); $i++) {
        $Graphics.DrawLine($pen, $Points[$i], $Points[$i + 1])
    }
    $fill = New-Object System.Drawing.SolidBrush((New-Color 86 232 236 255))
    foreach ($point in $Points) {
        $Graphics.FillEllipse($fill, $point.X - 11, $point.Y - 11, 22, 22)
        $outline = New-Object System.Drawing.Pen((New-Color 170 176 230 255), 3)
        $Graphics.DrawEllipse($outline, $point.X - 42, $point.Y - 42, 84, 84)
        $outline.Dispose()
    }
    $fill.Dispose()
    $pen.Dispose()
}

function Add-RealTower {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$X,
        [int]$BaseY,
        [int]$Width,
        [int]$Height,
        [int]$DepthX,
        [int]$DepthY,
        [System.Drawing.Color]$FrontColor,
        [System.Drawing.Color]$SideColor,
        [System.Drawing.Color]$TopColor,
        [System.Drawing.Color]$WindowColor,
        [System.Random]$Random,
        [switch]$Setback,
        [switch]$Spire
    )

    $mainHeight = $Height
    $topCut = if ($Setback) { [Math]::Max(20, [int]($Height * 0.18)) } else { 0 }
    $setbackWidth = if ($Setback) { [Math]::Max(26, [int]($Width * 0.26)) } else { 0 }

    if ($Setback) {
        $lowerPts = [System.Drawing.Point[]]@(
            [System.Drawing.Point]::new($X, $BaseY - $mainHeight),
            [System.Drawing.Point]::new($X + $Width, $BaseY - $mainHeight),
            [System.Drawing.Point]::new($X + $Width, $BaseY),
            [System.Drawing.Point]::new($X, $BaseY)
        )
        Fill-Poly -Graphics $Graphics -Color $FrontColor -Points $lowerPts

        $upperX = $X + [int]($setbackWidth / 2)
        $upperW = $Width - $setbackWidth
        $upperH = $mainHeight + [int]($topCut * 0.9)
        $upperPts = [System.Drawing.Point[]]@(
            [System.Drawing.Point]::new($upperX, $BaseY - $upperH),
            [System.Drawing.Point]::new($upperX + $upperW, $BaseY - $upperH),
            [System.Drawing.Point]::new($upperX + $upperW, $BaseY - ($mainHeight - $topCut)),
            [System.Drawing.Point]::new($upperX, $BaseY - ($mainHeight - $topCut))
        )
        Fill-Poly -Graphics $Graphics -Color (New-Color 255 ([Math]::Min(255, $FrontColor.R + 10)) ([Math]::Min(255, $FrontColor.G + 10)) ([Math]::Min(255, $FrontColor.B + 12))) -Points $upperPts
        $frontFaceX = $upperX
        $frontFaceW = $upperW
        $frontFaceTop = $BaseY - $upperH
        $frontFaceBottom = $BaseY
    } else {
        $frontPts = [System.Drawing.Point[]]@(
            [System.Drawing.Point]::new($X, $BaseY - $mainHeight),
            [System.Drawing.Point]::new($X + $Width, $BaseY - $mainHeight),
            [System.Drawing.Point]::new($X + $Width, $BaseY),
            [System.Drawing.Point]::new($X, $BaseY)
        )
        Fill-Poly -Graphics $Graphics -Color $FrontColor -Points $frontPts
        $frontFaceX = $X
        $frontFaceW = $Width
        $frontFaceTop = $BaseY - $mainHeight
        $frontFaceBottom = $BaseY
    }

    $sidePts = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new($frontFaceX + $frontFaceW, $frontFaceTop),
        [System.Drawing.Point]::new($frontFaceX + $frontFaceW + $DepthX, $frontFaceTop - $DepthY),
        [System.Drawing.Point]::new($frontFaceX + $frontFaceW + $DepthX, $frontFaceBottom - $DepthY),
        [System.Drawing.Point]::new($frontFaceX + $frontFaceW, $frontFaceBottom)
    )
    $topPts = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new($frontFaceX, $frontFaceTop),
        [System.Drawing.Point]::new($frontFaceX + $frontFaceW, $frontFaceTop),
        [System.Drawing.Point]::new($frontFaceX + $frontFaceW + $DepthX, $frontFaceTop - $DepthY),
        [System.Drawing.Point]::new($frontFaceX + $DepthX, $frontFaceTop - $DepthY)
    )
    Fill-Poly -Graphics $Graphics -Color $SideColor -Points $sidePts
    Fill-Poly -Graphics $Graphics -Color $TopColor -Points $topPts

    $windowBrush = New-Object System.Drawing.SolidBrush($WindowColor)
    $cols = [Math]::Max(2, [int]($frontFaceW / 22))
    $rows = [Math]::Max(4, [int](($frontFaceBottom - $frontFaceTop) / 26))
    $winW = [Math]::Max(5, [int]($frontFaceW / ($cols * 2.5)))
    $winH = [Math]::Max(7, [int](($frontFaceBottom - $frontFaceTop) / ($rows * 2.1)))
    for ($c = 0; $c -lt $cols; $c++) {
        for ($r = 0; $r -lt $rows; $r++) {
            if ($Random.Next(0, 100) -lt 72) {
                $wx = $frontFaceX + 8 + [int]($c * (($frontFaceW - 16) / [Math]::Max(1, $cols)))
                $wy = $frontFaceTop + 12 + [int]($r * (($frontFaceBottom - $frontFaceTop - 22) / [Math]::Max(1, $rows)))
                if ($wx + $winW -lt $frontFaceX + $frontFaceW - 6 -and $wy + $winH -lt $frontFaceBottom - 6) {
                    $Graphics.FillRectangle($windowBrush, $wx, $wy, $winW, $winH)
                }
            }
        }
    }
    $windowBrush.Dispose()

    if ($Spire) {
        $spirePen = New-Object System.Drawing.Pen((New-Color 160 220 235 255), 2)
        $sx = $frontFaceX + [int]($frontFaceW / 2)
        $Graphics.DrawLine($spirePen, $sx, $frontFaceTop - 2, $sx + [int]($DepthX * 0.2), $frontFaceTop - 32)
        $spirePen.Dispose()
    }

    $edgePen = New-Object System.Drawing.Pen((New-Color 92 166 206 255), 2)
    $Graphics.DrawPolygon($edgePen, $topPts)
    $Graphics.DrawPolygon($edgePen, $sidePts)
    $Graphics.DrawLine($edgePen, $frontFaceX, $frontFaceTop, $frontFaceX + $frontFaceW, $frontFaceTop)
    $edgePen.Dispose()
}

$variants = @(
    [pscustomobject]@{
        Name = 'nyc-web3-01'
        Seed = 101
        BottomBlue = (New-Color 255 18 54 170)
        GlowX = 1110
        GlowY = 22
        VanishX = 750
        VanishY = 340
        LogoX = 1120
        LogoY = 160
        LogoScale = 0.96
        LogoRotation = -2
        Orbs = @([System.Drawing.Point]::new(190,95),[System.Drawing.Point]::new(308,126),[System.Drawing.Point]::new(438,92))
        Buildings = @(
            @(0,420,82,146,18,14,$false,$false), @(92,420,86,182,18,16,$false,$false), @(178,420,110,228,22,18,$true,$false),
            @(292,420,102,168,20,16,$false,$false), @(404,420,116,242,22,20,$true,$false), @(530,420,118,272,24,20,$true,$true),
            @(652,420,86,190,18,16,$false,$false), @(748,420,102,214,20,16,$false,$false), @(866,420,94,194,18,16,$false,$false),
            @(968,420,120,276,24,22,$true,$true), @(1098,420,96,176,18,16,$false,$false), @(1202,420,102,230,22,18,$true,$false),
            @(1314,420,88,198,18,16,$false,$false), @(1406,420,74,218,16,14,$false,$false)
        )
    },
    [pscustomobject]@{
        Name = 'nyc-web3-02'
        Seed = 202
        BottomBlue = (New-Color 255 20 58 176)
        GlowX = 1180
        GlowY = 18
        VanishX = 790
        VanishY = 336
        LogoX = 1205
        LogoY = 148
        LogoScale = 0.9
        LogoRotation = 6
        Orbs = @([System.Drawing.Point]::new(168,106),[System.Drawing.Point]::new(294,128),[System.Drawing.Point]::new(424,100),[System.Drawing.Point]::new(522,138))
        Buildings = @(
            @(0,420,70,140,16,14,$false,$false), @(78,420,94,196,18,16,$false,$false), @(176,420,88,168,18,16,$false,$false),
            @(270,420,120,254,22,20,$true,$true), @(398,420,92,184,18,16,$false,$false), @(496,420,84,148,16,14,$false,$false),
            @(586,420,132,292,26,22,$true,$true), @(726,420,98,206,20,18,$true,$false), @(830,420,84,176,16,14,$false,$false),
            @(922,420,110,230,22,18,$true,$false), @(1042,420,108,270,22,20,$true,$true), @(1156,420,92,172,18,16,$false,$false),
            @(1254,420,112,238,22,18,$true,$false), @(1370,420,84,208,18,16,$false,$false), @(1458,420,42,182,12,12,$false,$false)
        )
    },
    [pscustomobject]@{
        Name = 'nyc-web3-03'
        Seed = 303
        BottomBlue = (New-Color 255 17 56 172)
        GlowX = 760
        GlowY = 16
        VanishX = 750
        VanishY = 334
        LogoX = 760
        LogoY = 130
        LogoScale = 0.76
        LogoRotation = -4
        Orbs = @([System.Drawing.Point]::new(186,98),[System.Drawing.Point]::new(326,126),[System.Drawing.Point]::new(452,90))
        Buildings = @(
            @(0,420,86,152,18,14,$false,$false), @(94,420,102,210,20,18,$true,$false), @(200,420,88,174,18,16,$false,$false),
            @(294,420,122,250,22,20,$true,$false), @(420,420,84,160,18,14,$false,$false), @(510,420,110,226,20,18,$true,$false),
            @(626,420,88,188,18,16,$false,$false), @(718,420,76,144,16,14,$false,$false), @(800,420,92,190,18,16,$false,$false),
            @(898,420,126,270,24,20,$true,$true), @(1030,420,88,172,18,14,$false,$false), @(1124,420,106,226,20,18,$true,$false),
            @(1236,420,96,210,18,16,$false,$false), @(1338,420,88,184,18,16,$false,$false), @(1432,420,68,170,14,12,$false,$false)
        )
    },
    [pscustomobject]@{
        Name = 'nyc-web3-04'
        Seed = 404
        BottomBlue = (New-Color 255 22 60 180)
        GlowX = 1070
        GlowY = 20
        VanishX = 710
        VanishY = 338
        LogoX = 1080
        LogoY = 158
        LogoScale = 0.93
        LogoRotation = -8
        Orbs = @([System.Drawing.Point]::new(128,92),[System.Drawing.Point]::new(260,120),[System.Drawing.Point]::new(386,88),[System.Drawing.Point]::new(522,134))
        Buildings = @(
            @(0,420,74,138,16,14,$false,$false), @(82,420,86,172,18,16,$false,$false), @(174,420,112,236,22,18,$true,$false),
            @(292,420,88,164,18,14,$false,$false), @(386,420,126,264,24,20,$true,$true), @(518,420,94,184,18,16,$false,$false),
            @(618,420,84,154,16,14,$false,$false), @(706,420,100,216,20,18,$true,$false), @(812,420,90,176,18,16,$false,$false),
            @(908,420,116,244,22,20,$true,$false), @(1030,420,126,282,24,22,$true,$true), @(1164,420,90,170,18,16,$false,$false),
            @(1260,420,98,214,20,18,$true,$false), @(1364,420,88,194,18,16,$false,$false), @(1456,420,44,176,12,12,$false,$false)
        )
    },
    [pscustomobject]@{
        Name = 'nyc-web3-05'
        Seed = 505
        BottomBlue = (New-Color 255 24 64 184)
        GlowX = 1200
        GlowY = 16
        VanishX = 770
        VanishY = 336
        LogoX = 1218
        LogoY = 146
        LogoScale = 0.88
        LogoRotation = 10
        Orbs = @([System.Drawing.Point]::new(174,92),[System.Drawing.Point]::new(302,126),[System.Drawing.Point]::new(432,88))
        Buildings = @(
            @(0,420,70,140,16,14,$false,$false), @(78,420,96,198,18,16,$true,$false), @(180,420,86,170,18,14,$false,$false),
            @(270,420,122,252,22,20,$true,$true), @(398,420,84,156,18,14,$false,$false), @(488,420,112,222,20,18,$true,$false),
            @(606,420,90,188,18,16,$false,$false), @(702,420,118,252,22,20,$true,$true), @(828,420,82,162,18,14,$false,$false),
            @(918,420,104,226,20,18,$true,$false), @(1028,420,116,270,22,20,$true,$true), @(1150,420,88,170,18,16,$false,$false),
            @(1244,420,100,232,20,18,$true,$false), @(1350,420,84,204,18,16,$false,$false), @(1440,420,60,184,14,12,$false,$false)
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

    $bgRect = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
    $skyBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bgRect, (New-Color 255 2 4 10), $variant.BottomBlue, 90)
    $graphics.FillRectangle($skyBrush, $bgRect)
    $skyBrush.Dispose()

    Add-SkyGlow -Graphics $graphics -X ($variant.GlowX - 220) -Y ($variant.GlowY - 20) -Width 420 -Height 300 -CenterColor (New-Color 84 132 168 220)
    Add-SkyGlow -Graphics $graphics -X 240 -Y 88 -Width 540 -Height 180 -CenterColor (New-Color 24 120 150 220)

    $horizonMist = New-Object System.Drawing.Drawing2D.LinearGradientBrush([System.Drawing.Rectangle]::new(0, 220, $width, 180), (New-Color 0 255 255 255), (New-Color 36 170 190 220), 90)
    $graphics.FillRectangle($horizonMist, 0, 220, $width, 180)
    $horizonMist.Dispose()

    $starBrush = New-Object System.Drawing.SolidBrush((New-Color 180 255 255 255))
    for ($i = 0; $i -lt 34; $i++) {
        $x = $random.Next(18, 1480)
        $y = $random.Next(18, 180)
        $r = $random.Next(1, 4)
        $graphics.FillEllipse($starBrush, $x, $y, $r, $r)
    }
    $starBrush.Dispose()

    Add-NetworkOrbs -Graphics $graphics -Points $variant.Orbs

    $chartPen = New-Object System.Drawing.Pen((New-Color 170 170 210 235), 4)
    $chartPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $chartPts = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new(60, 202),
        [System.Drawing.Point]::new(170, 182),
        [System.Drawing.Point]::new(246, 214),
        [System.Drawing.Point]::new(350, 158),
        [System.Drawing.Point]::new(438, 170),
        [System.Drawing.Point]::new(520, 132)
    )
    $graphics.DrawLines($chartPen, $chartPts)
    $chartPen.Dispose()

    foreach ($building in $variant.Buildings) {
        Add-RealTower -Graphics $graphics -X $building[0] -BaseY $building[1] -Width $building[2] -Height $building[3] -DepthX $building[4] -DepthY $building[5] -FrontColor (New-Color 255 28 42 108) -SideColor (New-Color 255 14 24 76) -TopColor (New-Color 255 64 90 186) -WindowColor (New-Color 185 223 236 245) -Random $random -Setback:([bool]$building[6]) -Spire:([bool]$building[7])
    }

    $groundBrush = New-Object System.Drawing.SolidBrush((New-Color 255 7 12 46))
    $groundPts = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new(0, 500),
        [System.Drawing.Point]::new($variant.VanishX - 190, 500),
        [System.Drawing.Point]::new($variant.VanishX, $variant.VanishY),
        [System.Drawing.Point]::new($variant.VanishX + 210, 500),
        [System.Drawing.Point]::new(1500, 500),
        [System.Drawing.Point]::new(1500, 450),
        [System.Drawing.Point]::new(0, 450)
    )
    $graphics.FillPolygon($groundBrush, $groundPts)
    $groundBrush.Dispose()

    Add-Grid -Graphics $graphics -VanishX $variant.VanishX -VanishY $variant.VanishY

    $lanePen = New-Object System.Drawing.Pen((New-Color 180 112 235 255), 4)
    $graphics.DrawLine($lanePen, $variant.VanishX, $variant.VanishY + 10, $variant.VanishX, 500)
    $graphics.DrawLine($lanePen, $variant.VanishX - 42, $variant.VanishY + 40, $variant.VanishX - 42, 500)
    $graphics.DrawLine($lanePen, $variant.VanishX + 42, $variant.VanishY + 40, $variant.VanishX + 42, 500)
    $lanePen.Dispose()

    $ribbonPen = New-Object System.Drawing.Pen((New-Color 88 166 220 255), 3)
    $graphics.DrawBezier($ribbonPen, 58, 252, 220, 178, 360, 196, 520, 132)
    $graphics.DrawBezier($ribbonPen, 972, 162, 1124, 110, 1244, 134, 1442, 212)
    $ribbonPen.Dispose()

    Add-LogoMark -Graphics $graphics -CenterX $variant.LogoX -CenterY $variant.LogoY -Scale $variant.LogoScale -Rotation $variant.LogoRotation

    $ringPen = New-Object System.Drawing.Pen((New-Color 85 255 255 255), 2)
    $graphics.DrawArc($ringPen, $variant.LogoX - 150, $variant.LogoY - 120, 360, 210, 198, 110)
    $graphics.DrawArc($ringPen, $variant.LogoX - 184, $variant.LogoY - 102, 430, 200, 208, 88)
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
