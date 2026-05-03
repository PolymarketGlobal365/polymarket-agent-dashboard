$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$outputDir = 'C:\Users\jyjy6\Documents\New project\output\web3-nyc-photo-variants'
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$width = 1500
$height = 500
$horizonY = 338

function New-Color([int]$a, [int]$r, [int]$g, [int]$b) {
    [System.Drawing.Color]::FromArgb($a, $r, $g, $b)
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
    $glowPath.AddEllipse([int](-160 * $Scale), [int](-110 * $Scale), [int](320 * $Scale), [int](230 * $Scale))
    $glowBrush = [System.Drawing.Drawing2D.PathGradientBrush]::new($glowPath)
    $glowBrush.CenterColor = (New-Color 76 255 255 255)
    $glowBrush.SurroundColors = @((New-Color 0 255 255 255))
    $Graphics.FillPath($glowBrush, $glowPath)
    $glowBrush.Dispose()
    $glowPath.Dispose()

    Add-SharpBar -Graphics $Graphics -Color (New-Color 255 255 255 255) -CenterX 0 -CenterY 0 -BarWidth (246 * $Scale) -BarHeight (70 * $Scale) -Angle 38 -Slant (56 * $Scale)
    Add-SharpBar -Graphics $Graphics -Color (New-Color 255 255 255 255) -CenterX (16 * $Scale) -CenterY (-20 * $Scale) -BarWidth (246 * $Scale) -BarHeight (70 * $Scale) -Angle -38 -Slant (56 * $Scale)
    Add-SharpBar -Graphics $Graphics -Color (New-Color 255 255 255 255) -CenterX (96 * $Scale) -CenterY (-118 * $Scale) -BarWidth (214 * $Scale) -BarHeight (56 * $Scale) -Angle -36 -Slant (46 * $Scale)

    $Graphics.Restore($state)
}

function Add-Grid {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$VanishX,
        [int]$VanishY
    )

    $gridPen = New-Object System.Drawing.Pen((New-Color 92 72 126 228), 2)
    for ($i = 0; $i -le 12; $i++) {
        $y = 450 + [int]($i * 4.4 * $i / 2)
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

function Add-NetworkOrbs {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Drawing.Point[]]$Points
    )

    $pen = New-Object System.Drawing.Pen((New-Color 140 150 198 220), 4)
    for ($i = 0; $i -lt ($Points.Count - 1); $i++) {
        $Graphics.DrawLine($pen, $Points[$i], $Points[$i + 1])
    }

    $fill = New-Object System.Drawing.SolidBrush((New-Color 90 232 238 244))
    foreach ($point in $Points) {
        $Graphics.FillEllipse($fill, $point.X - 10, $point.Y - 10, 20, 20)
        $outline = New-Object System.Drawing.Pen((New-Color 180 180 214 236), 3)
        $Graphics.DrawEllipse($outline, $point.X - 42, $point.Y - 42, 84, 84)
        $outline.Dispose()
    }
    $fill.Dispose()
    $pen.Dispose()
}

function Draw-Windows {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$X,
        [int]$Y,
        [int]$Width,
        [int]$Height,
        [System.Random]$Random,
        [int]$Density = 72
    )

    $cols = [Math]::Max(2, [int]($Width / 20))
    $rows = [Math]::Max(4, [int]($Height / 22))
    $windowW = [Math]::Max(4, [int]($Width / ($cols * 2.8)))
    $windowH = [Math]::Max(6, [int]($Height / ($rows * 2.3)))
    $warmBrush = New-Object System.Drawing.SolidBrush((New-Color 210 246 240 220))
    $coolBrush = New-Object System.Drawing.SolidBrush((New-Color 180 212 225 236))

    for ($c = 0; $c -lt $cols; $c++) {
        for ($r = 0; $r -lt $rows; $r++) {
            if ($Random.Next(0, 100) -lt $Density) {
                $wx = $X + 6 + [int]($c * (($Width - 14) / [Math]::Max(1, $cols)))
                $wy = $Y + 8 + [int]($r * (($Height - 18) / [Math]::Max(1, $rows)))
                $brush = if ($Random.Next(0, 100) -lt 58) { $warmBrush } else { $coolBrush }
                if ($wx + $windowW -lt $X + $Width - 4 -and $wy + $windowH -lt $Y + $Height - 4) {
                    $Graphics.FillRectangle($brush, $wx, $wy, $windowW, $windowH)
                }
            }
        }
    }

    $warmBrush.Dispose()
    $coolBrush.Dispose()
}

function Add-ReflectionStripe {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$CenterX,
        [int]$TopY,
        [int]$Width,
        [int]$Height,
        [System.Drawing.Color]$Color
    )

    $rect = [System.Drawing.Rectangle]::new($CenterX - [int]($Width / 2), $TopY, $Width, $Height)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $Color, (New-Color 0 $Color.R $Color.G $Color.B), 90)
    $Graphics.FillEllipse($brush, $rect)
    $brush.Dispose()
}

function Draw-Building {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$X,
        [int]$BaseY,
        [int]$Width,
        [int]$Height,
        [string]$Style,
        [System.Random]$Random,
        [int]$Tone = 0
    )

    $dark = New-Color 255 (26 + $Tone) (28 + $Tone) (38 + $Tone)
    $mid = New-Color 255 (44 + $Tone) (48 + $Tone) (64 + $Tone)
    $light = New-Color 255 (86 + $Tone) (94 + $Tone) (122 + $Tone)
    $glass = New-Color 255 (178 + $Tone) (185 + $Tone) (196 + $Tone)

    switch ($Style) {
        'oneworld' {
            $pts = [System.Drawing.Point[]]@(
                [System.Drawing.Point]::new($X + [int]($Width * 0.22), $BaseY),
                [System.Drawing.Point]::new($X + [int]($Width * 0.78), $BaseY),
                [System.Drawing.Point]::new($X + [int]($Width * 0.70), $BaseY - [int]($Height * 0.84)),
                [System.Drawing.Point]::new($X + [int]($Width * 0.52), $BaseY - $Height),
                [System.Drawing.Point]::new($X + [int]($Width * 0.30), $BaseY - [int]($Height * 0.84))
            )
            $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush([System.Drawing.Rectangle]::new($X, $BaseY - $Height, $Width, $Height), $glass, $mid, 90)
            $Graphics.FillPolygon($brush, $pts)
            $brush.Dispose()
            $shine = New-Object System.Drawing.Pen((New-Color 205 248 248 246), 3)
            $Graphics.DrawLine($shine, $X + [int]($Width * 0.51), $BaseY - $Height + 8, $X + [int]($Width * 0.46), $BaseY - 10)
            $shine.Dispose()
            $spirePen = New-Object System.Drawing.Pen((New-Color 180 224 224 228), 2)
            $Graphics.DrawLine($spirePen, $X + [int]($Width * 0.52), $BaseY - $Height, $X + [int]($Width * 0.54), $BaseY - $Height - 46)
            $spirePen.Dispose()
        }
        'rounded' {
            $rect = [System.Drawing.Rectangle]::new($X, $BaseY - $Height, $Width, $Height)
            $path = New-Object System.Drawing.Drawing2D.GraphicsPath
            $path.AddArc($X, $BaseY - $Height, $Width, [int]($Width * 0.55), 180, 180)
            $path.AddLine($X + $Width, $BaseY - [int]($Height * 0.78), $X + $Width, $BaseY)
            $path.AddLine($X + $Width, $BaseY, $X, $BaseY)
            $path.CloseFigure()
            $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $light, $mid, 90)
            $Graphics.FillPath($brush, $path)
            $brush.Dispose()
            $path.Dispose()
        }
        'setback' {
            $lowerRect = [System.Drawing.Rectangle]::new($X, $BaseY - [int]($Height * 0.78), $Width, [int]($Height * 0.78))
            $upperRect = [System.Drawing.Rectangle]::new($X + [int]($Width * 0.12), $BaseY - $Height, [int]($Width * 0.76), [int]($Height * 0.30))
            $lowerBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($lowerRect, $mid, $dark, 90)
            $upperBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($upperRect, $light, $mid, 90)
            $Graphics.FillRectangle($lowerBrush, $lowerRect)
            $Graphics.FillRectangle($upperBrush, $upperRect)
            $lowerBrush.Dispose()
            $upperBrush.Dispose()
        }
        'glass' {
            $rect = [System.Drawing.Rectangle]::new($X, $BaseY - $Height, $Width, $Height)
            $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $glass, $mid, 90)
            $Graphics.FillRectangle($brush, $rect)
            $brush.Dispose()
            $highlight = New-Object System.Drawing.SolidBrush((New-Color 100 255 255 255))
            $Graphics.FillRectangle($highlight, $X + [int]($Width * 0.16), $BaseY - $Height + 10, [int]($Width * 0.12), $Height - 22)
            $highlight.Dispose()
        }
        default {
            $rect = [System.Drawing.Rectangle]::new($X, $BaseY - $Height, $Width, $Height)
            $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $mid, $dark, 90)
            $Graphics.FillRectangle($brush, $rect)
            $brush.Dispose()
        }
    }

    $outline = New-Object System.Drawing.Pen((New-Color 90 125 140 170), 2)
    $Graphics.DrawRectangle($outline, $X, $BaseY - $Height, $Width, $Height)
    $outline.Dispose()

    Draw-Windows -Graphics $Graphics -X ($X + 4) -Y ($BaseY - $Height + 4) -Width ($Width - 8) -Height ($Height - 8) -Random $Random
    Add-ReflectionStripe -Graphics $Graphics -CenterX ($X + [int]($Width / 2)) -TopY ($horizonY + 28) -Width ([Math]::Max(22, [int]($Width * 0.8))) -Height ([Math]::Max(70, [int]($Height * 0.36))) -Color (New-Color 44 255 240 220)
}

$variants = @(
    [pscustomobject]@{
        Name = 'photo-nyc-01'
        Seed = 101
        GlowX = 1110
        GlowY = 26
        LogoX = 1120
        LogoY = 150
        LogoScale = 0.92
        LogoRotation = 0
        Orbs = @([System.Drawing.Point]::new(194,95),[System.Drawing.Point]::new(308,126),[System.Drawing.Point]::new(438,92))
        Skyline = @(
            @(0, 360, 88, 104, 'block', 0), @(94, 360, 78, 118, 'block', 0), @(178, 360, 92, 210, 'setback', 6),
            @(276, 360, 76, 92, 'block', 0), @(358, 360, 78, 142, 'block', 2), @(444, 360, 108, 248, 'rounded', 12),
            @(558, 360, 82, 152, 'glass', 6), @(646, 360, 74, 126, 'block', 0), @(726, 360, 138, 322, 'oneworld', 10),
            @(876, 360, 90, 212, 'setback', 6), @(972, 360, 84, 244, 'glass', 12), @(1064, 360, 66, 196, 'block', 2),
            @(1136, 360, 102, 212, 'setback', 6), @(1246, 360, 76, 176, 'block', 2), @(1328, 360, 62, 156, 'block', 0), @(1396, 360, 54, 142, 'block', 0)
        )
    },
    [pscustomobject]@{
        Name = 'photo-nyc-02'
        Seed = 202
        GlowX = 1180
        GlowY = 18
        LogoX = 1200
        LogoY = 144
        LogoScale = 0.88
        LogoRotation = 7
        Orbs = @([System.Drawing.Point]::new(164,106),[System.Drawing.Point]::new(294,128),[System.Drawing.Point]::new(424,100),[System.Drawing.Point]::new(520,138))
        Skyline = @(
            @(0, 360, 74, 96, 'block', 0), @(80, 360, 82, 140, 'block', 0), @(168, 360, 64, 108, 'block', 0),
            @(238, 360, 100, 224, 'setback', 6), @(344, 360, 86, 150, 'block', 2), @(436, 360, 110, 258, 'rounded', 10),
            @(552, 360, 78, 146, 'glass', 8), @(636, 360, 72, 128, 'block', 0), @(714, 360, 142, 314, 'oneworld', 12),
            @(862, 360, 94, 228, 'setback', 6), @(962, 360, 80, 240, 'glass', 12), @(1048, 360, 70, 198, 'block', 0),
            @(1124, 360, 108, 226, 'setback', 6), @(1240, 360, 74, 168, 'block', 0), @(1320, 360, 58, 144, 'block', 0), @(1384, 360, 70, 176, 'block', 0)
        )
    },
    [pscustomobject]@{
        Name = 'photo-nyc-03'
        Seed = 303
        GlowX = 760
        GlowY = 18
        LogoX = 760
        LogoY = 124
        LogoScale = 0.74
        LogoRotation = -4
        Orbs = @([System.Drawing.Point]::new(184,98),[System.Drawing.Point]::new(326,126),[System.Drawing.Point]::new(452,90))
        Skyline = @(
            @(0, 360, 86, 108, 'block', 0), @(92, 360, 72, 126, 'block', 0), @(170, 360, 96, 214, 'setback', 6),
            @(272, 360, 84, 112, 'block', 0), @(362, 360, 80, 148, 'block', 0), @(448, 360, 104, 240, 'rounded', 10),
            @(558, 360, 76, 144, 'glass', 8), @(640, 360, 64, 114, 'block', 0), @(710, 360, 136, 318, 'oneworld', 12),
            @(852, 360, 88, 214, 'setback', 6), @(946, 360, 82, 246, 'glass', 12), @(1034, 360, 70, 190, 'block', 2),
            @(1110, 360, 104, 218, 'setback', 6), @(1220, 360, 80, 172, 'block', 0), @(1306, 360, 66, 156, 'block', 0), @(1378, 360, 68, 168, 'block', 0)
        )
    },
    [pscustomobject]@{
        Name = 'photo-nyc-04'
        Seed = 404
        GlowX = 1085
        GlowY = 18
        LogoX = 1085
        LogoY = 148
        LogoScale = 0.9
        LogoRotation = -8
        Orbs = @([System.Drawing.Point]::new(128,92),[System.Drawing.Point]::new(260,120),[System.Drawing.Point]::new(386,88),[System.Drawing.Point]::new(522,134))
        Skyline = @(
            @(0, 360, 82, 104, 'block', 0), @(88, 360, 74, 132, 'block', 0), @(168, 360, 102, 220, 'setback', 6),
            @(276, 360, 72, 108, 'block', 0), @(354, 360, 86, 164, 'block', 2), @(446, 360, 112, 254, 'rounded', 10),
            @(564, 360, 84, 148, 'glass', 8), @(654, 360, 70, 120, 'block', 0), @(730, 360, 138, 322, 'oneworld', 12),
            @(874, 360, 92, 220, 'setback', 6), @(972, 360, 86, 248, 'glass', 12), @(1064, 360, 66, 194, 'block', 2),
            @(1136, 360, 110, 226, 'setback', 6), @(1252, 360, 82, 176, 'block', 2), @(1340, 360, 62, 148, 'block', 0), @(1408, 360, 54, 138, 'block', 0)
        )
    },
    [pscustomobject]@{
        Name = 'photo-nyc-05'
        Seed = 505
        GlowX = 1210
        GlowY = 16
        LogoX = 1218
        LogoY = 140
        LogoScale = 0.86
        LogoRotation = 10
        Orbs = @([System.Drawing.Point]::new(174,92),[System.Drawing.Point]::new(302,126),[System.Drawing.Point]::new(432,88))
        Skyline = @(
            @(0, 360, 76, 96, 'block', 0), @(82, 360, 86, 138, 'block', 0), @(174, 360, 70, 114, 'block', 0),
            @(250, 360, 104, 226, 'setback', 6), @(360, 360, 82, 146, 'block', 2), @(448, 360, 114, 260, 'rounded', 10),
            @(568, 360, 78, 150, 'glass', 8), @(652, 360, 72, 118, 'block', 0), @(730, 360, 140, 320, 'oneworld', 12),
            @(876, 360, 92, 216, 'setback', 6), @(974, 360, 86, 244, 'glass', 12), @(1066, 360, 70, 188, 'block', 2),
            @(1142, 360, 108, 224, 'setback', 6), @(1256, 360, 78, 170, 'block', 0), @(1340, 360, 64, 154, 'block', 0), @(1410, 360, 62, 164, 'block', 0)
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

    $skyRect = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
    $sky = New-Object System.Drawing.Drawing2D.LinearGradientBrush($skyRect, (New-Color 255 2 4 10), (New-Color 255 36 50 96), 90)
    $graphics.FillRectangle($sky, $skyRect)
    $sky.Dispose()

    Add-SkyGlow -Graphics $graphics -X ($variant.GlowX - 190) -Y ($variant.GlowY - 10) -Width 360 -Height 250 -CenterColor (New-Color 40 255 255 255)
    Add-SkyGlow -Graphics $graphics -X 420 -Y 120 -Width 300 -Height 120 -CenterColor (New-Color 18 140 170 240)

    $mistBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush([System.Drawing.Rectangle]::new(0, 210, $width, 160), (New-Color 0 255 255 255), (New-Color 24 180 186 205), 90)
    $graphics.FillRectangle($mistBrush, 0, 210, $width, 160)
    $mistBrush.Dispose()

    $starBrush = New-Object System.Drawing.SolidBrush((New-Color 200 255 255 255))
    for ($i = 0; $i -lt 22; $i++) {
        $x = $random.Next(18, 1480)
        $y = $random.Next(18, 150)
        $r = $random.Next(1, 3)
        $graphics.FillEllipse($starBrush, $x, $y, $r, $r)
    }
    $starBrush.Dispose()

    Add-NetworkOrbs -Graphics $graphics -Points $variant.Orbs

    $linePen = New-Object System.Drawing.Pen((New-Color 125 166 204 220), 4)
    $linePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $chartPts = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new(60, 202),
        [System.Drawing.Point]::new(170, 182),
        [System.Drawing.Point]::new(246, 214),
        [System.Drawing.Point]::new(350, 158),
        [System.Drawing.Point]::new(438, 170),
        [System.Drawing.Point]::new(520, 132)
    )
    $graphics.DrawLines($linePen, $chartPts)
    $linePen.Dispose()

    foreach ($spec in $variant.Skyline) {
        Draw-Building -Graphics $graphics -X $spec[0] -BaseY $spec[1] -Width $spec[2] -Height $spec[3] -Style $spec[4] -Random $random -Tone $spec[5]
    }

    $waterRect = [System.Drawing.Rectangle]::new(0, $horizonY, $width, $height - $horizonY)
    $waterBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($waterRect, (New-Color 255 16 20 34), (New-Color 255 6 8 18), 90)
    $graphics.FillRectangle($waterBrush, $waterRect)
    $waterBrush.Dispose()

    $horizonPen = New-Object System.Drawing.Pen((New-Color 110 255 236 220), 2)
    $graphics.DrawLine($horizonPen, 0, $horizonY + 3, $width, $horizonY + 3)
    $horizonPen.Dispose()

    $groundBrush = New-Object System.Drawing.SolidBrush((New-Color 230 8 10 24))
    $groundPts = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new(0, 500),
        [System.Drawing.Point]::new($variant.GlowX - 350, 500),
        [System.Drawing.Point]::new(770, 336),
        [System.Drawing.Point]::new(980, 500),
        [System.Drawing.Point]::new(1500, 500),
        [System.Drawing.Point]::new(1500, 448),
        [System.Drawing.Point]::new(0, 448)
    )
    $graphics.FillPolygon($groundBrush, $groundPts)
    $groundBrush.Dispose()

    Add-Grid -Graphics $graphics -VanishX 770 -VanishY 336

    $lanePen = New-Object System.Drawing.Pen((New-Color 165 112 235 255), 4)
    $graphics.DrawLine($lanePen, 770, 344, 770, 500)
    $graphics.DrawLine($lanePen, 726, 374, 726, 500)
    $graphics.DrawLine($lanePen, 814, 374, 814, 500)
    $lanePen.Dispose()

    Add-LogoMark -Graphics $graphics -CenterX $variant.LogoX -CenterY $variant.LogoY -Scale $variant.LogoScale -Rotation $variant.LogoRotation

    $ringPen = New-Object System.Drawing.Pen((New-Color 74 255 255 255), 2)
    $graphics.DrawArc($ringPen, $variant.LogoX - 144, $variant.LogoY - 112, 340, 200, 196, 108)
    $graphics.DrawArc($ringPen, $variant.LogoX - 172, $variant.LogoY - 98, 404, 188, 208, 84)
    $ringPen.Dispose()

    $file = Join-Path $outputDir ($variant.Name + '.png')
    $bitmap.Save($file, [System.Drawing.Imaging.ImageFormat]::Png)
    $files += $file

    $graphics.Dispose()
    $bitmap.Dispose()
}

$files | ForEach-Object { Write-Output $_ }
