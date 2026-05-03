$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$logoPath = 'C:\Users\jyjy6\Downloads\polymarket-inspired-logo-final-blue-bg-white-mark.png'
$outputDir = 'C:\Users\jyjy6\Documents\New project\output\twitter-surreal-crew'
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$width = 1500
$height = 500
$logoSource = [System.Drawing.Bitmap]::new($logoPath)

function Get-TransparentLogo([System.Drawing.Bitmap]$Source) {
    $bitmap = New-Object System.Drawing.Bitmap($Source.Width, $Source.Height)
    for ($x = 0; $x -lt $Source.Width; $x++) {
        for ($y = 0; $y -lt $Source.Height; $y++) {
            $pixel = $Source.GetPixel($x, $y)
            if ($pixel.B -gt 150 -and $pixel.R -lt 120 -and $pixel.G -lt 150) {
                $bitmap.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, $pixel.R, $pixel.G, $pixel.B))
            }
            else {
                $bitmap.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 255, 255))
            }
        }
    }
    return $bitmap
}

$logoImage = Get-TransparentLogo $logoSource

function New-Color([int]$a, [int]$r, [int]$g, [int]$b) {
    [System.Drawing.Color]::FromArgb($a, $r, $g, $b)
}

function Fill-EllipseGradient {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$X,
        [int]$Y,
        [int]$Width,
        [int]$Height,
        [System.Drawing.Color]$Center,
        [System.Drawing.Color]$Outer
    )

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse($X, $Y, $Width, $Height)
    $brush = [System.Drawing.Drawing2D.PathGradientBrush]::new($path)
    $brush.CenterColor = $Center
    $brush.SurroundColors = @($Outer)
    $Graphics.FillPath($brush, $path)
    $brush.Dispose()
    $path.Dispose()
}

function Draw-Bubble {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$X,
        [int]$Y,
        [int]$Size
    )

    Fill-EllipseGradient -Graphics $Graphics -X $X -Y $Y -Width $Size -Height $Size -Center (New-Color 48 255 255 255) -Outer (New-Color 0 255 255 255)
    $outline = New-Object System.Drawing.Pen((New-Color 90 255 255 255), 2)
    $Graphics.DrawEllipse($outline, $X, $Y, $Size, $Size)
    $outline.Dispose()

    $highlight = New-Object System.Drawing.SolidBrush((New-Color 70 255 255 255))
    $Graphics.FillEllipse($highlight, $X + [int]($Size * 0.18), $Y + [int]($Size * 0.12), [int]($Size * 0.18), [int]($Size * 0.18))
    $highlight.Dispose()
}

function Draw-Mushroom {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$BaseX,
        [int]$BaseY,
        [int]$StemHeight,
        [int]$CapWidth,
        [System.Drawing.Color]$CapColor,
        [System.Drawing.Color]$StemColor
    )

    $stemBrush = New-Object System.Drawing.SolidBrush($StemColor)
    $Graphics.FillEllipse($stemBrush, $BaseX - 7, $BaseY - $StemHeight, 14, $StemHeight + 10)
    $stemBrush.Dispose()

    $capRect = [System.Drawing.Rectangle]::new(
        [int]($BaseX - [int]($CapWidth / 2)),
        [int]($BaseY - $StemHeight - [int]($CapWidth * 0.42)),
        [int]$CapWidth,
        [int]($CapWidth * 0.55)
    )
    $capBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($capRect, (New-Color 255 255 236 186), $CapColor, 90)
    $Graphics.FillPie($capBrush, $capRect, 180, 180)
    $capBrush.Dispose()

    $capPen = New-Object System.Drawing.Pen((New-Color 80 255 255 255), 2)
    $Graphics.DrawArc($capPen, $capRect, 180, 180)
    $capPen.Dispose()
}

function Draw-CoralPlant {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$BaseX,
        [int]$BaseY,
        [System.Drawing.Color]$Color,
        [int]$Height
    )

    $pen = New-Object System.Drawing.Pen($Color, 3)
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $Graphics.DrawLine($pen, $BaseX, $BaseY, $BaseX, $BaseY - $Height)
    $Graphics.DrawLine($pen, $BaseX, $BaseY - [int]($Height * 0.45), $BaseX - 24, $BaseY - [int]($Height * 0.7))
    $Graphics.DrawLine($pen, $BaseX, $BaseY - [int]($Height * 0.35), $BaseX + 22, $BaseY - [int]($Height * 0.62))
    $Graphics.DrawLine($pen, $BaseX, $BaseY - [int]($Height * 0.7), $BaseX - 12, $BaseY - $Height)
    $Graphics.DrawLine($pen, $BaseX, $BaseY - [int]($Height * 0.75), $BaseX + 14, $BaseY - [int]($Height * 0.96))
    $pen.Dispose()
}

function Draw-Seaweed {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$BaseX,
        [int]$BaseY,
        [System.Drawing.Color]$Color,
        [System.Random]$Random
    )

    $pen = New-Object System.Drawing.Pen($Color, 2)
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    for ($i = 0; $i -lt 5; $i++) {
        $offset = $Random.Next(-12, 12)
        $heightSeed = $Random.Next(38, 82)
        $graphicsPath = New-Object System.Drawing.Drawing2D.GraphicsPath
        $graphicsPath.AddBezier(
            $BaseX, $BaseY,
            $BaseX + $offset, $BaseY - [int]($heightSeed * 0.35),
            $BaseX + ($offset * 2), $BaseY - [int]($heightSeed * 0.72),
            $BaseX + $offset, $BaseY - $heightSeed
        )
        $Graphics.DrawPath($pen, $graphicsPath)
        $graphicsPath.Dispose()
    }
    $pen.Dispose()
}

function Draw-Jelly {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$X,
        [int]$Y,
        [int]$Size
    )

    $capRect = New-Object System.Drawing.Rectangle($X, $Y, $Size, [int]($Size * 0.52))
    $capBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($capRect, (New-Color 110 210 255 255), (New-Color 35 210 255 255), 90)
    $Graphics.FillPie($capBrush, $capRect, 180, 180)
    $capBrush.Dispose()

    $pen = New-Object System.Drawing.Pen((New-Color 75 255 255 255), 1)
    for ($i = 0; $i -lt 4; $i++) {
        $tx = $X + 8 + ($i * [int]($Size * 0.18))
        $Graphics.DrawLine($pen, $tx, $Y + [int]($Size * 0.28), $tx - 4, $Y + [int]($Size * 0.7))
    }
    $pen.Dispose()
}

function Draw-Island {
    param(
        [System.Drawing.Graphics]$Graphics,
        [pscustomobject]$Variant,
        [System.Random]$Random
    )

    $islandX = $Variant.IslandX
    $islandY = $Variant.IslandY
    $islandW = $Variant.IslandW
    $islandH = $Variant.IslandH

    Fill-EllipseGradient -Graphics $Graphics -X $islandX -Y $islandY -Width $islandW -Height $islandH -Center $Variant.IslandTop -Outer $Variant.IslandEdge
    Fill-EllipseGradient -Graphics $Graphics -X ($islandX + 40) -Y ($islandY - 24) -Width ([int]($islandW * 0.72)) -Height ([int]($islandH * 0.68)) -Center $Variant.IslandGlow -Outer (New-Color 0 $Variant.IslandGlow.R $Variant.IslandGlow.G $Variant.IslandGlow.B)

    for ($i = 0; $i -lt 7; $i++) {
        $rockX = $islandX + $Random.Next(40, $islandW - 90)
        $rockY = $islandY + $Random.Next(18, $islandH - 34)
        $rockW = $Random.Next(42, 88)
        $rockH = $Random.Next(18, 42)
        Fill-EllipseGradient -Graphics $Graphics -X $rockX -Y $rockY -Width $rockW -Height $rockH -Center (New-Color 70 255 236 255) -Outer (New-Color 0 255 236 255)
    }

    foreach ($item in $Variant.Plants) {
        switch ($item.Type) {
            'mushroom' {
                Draw-Mushroom -Graphics $Graphics -BaseX ($islandX + $item.X) -BaseY ($islandY + $item.Y) -StemHeight $item.H -CapWidth $item.W -CapColor $item.Cap -StemColor $item.Stem
            }
            'coral' {
                Draw-CoralPlant -Graphics $Graphics -BaseX ($islandX + $item.X) -BaseY ($islandY + $item.Y) -Color $item.Color -Height $item.H
            }
            'seaweed' {
                Draw-Seaweed -Graphics $Graphics -BaseX ($islandX + $item.X) -BaseY ($islandY + $item.Y) -Color $item.Color -Random $Random
            }
            'jelly' {
                Draw-Jelly -Graphics $Graphics -X ($islandX + $item.X) -Y ($islandY + $item.Y) -Size $item.S
            }
        }
    }
}

function Draw-LogoCreature {
    param(
        [System.Drawing.Graphics]$Graphics,
        [pscustomobject]$Variant,
        [System.Drawing.Image]$Logo
    )

    $state = $Graphics.Save()
    $Graphics.TranslateTransform($Variant.LogoX, $Variant.LogoY)
    $Graphics.RotateTransform($Variant.LogoAngle)

    Fill-EllipseGradient -Graphics $Graphics -X ([int](-0.55 * $Variant.LogoSize)) -Y ([int](-0.24 * $Variant.LogoSize)) -Width ([int](1.1 * $Variant.LogoSize)) -Height ([int](0.54 * $Variant.LogoSize)) -Center (New-Color 95 255 255 255) -Outer (New-Color 0 255 255 255)

    $wingBrush = New-Object System.Drawing.SolidBrush($Variant.WingColor)
    $leftWing = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new(-12, 10),
        [System.Drawing.Point]::new(-52, 26),
        [System.Drawing.Point]::new(-20, 62),
        [System.Drawing.Point]::new(4, 34)
    )
    $rightWing = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new(82, 8),
        [System.Drawing.Point]::new(122, -6),
        [System.Drawing.Point]::new(114, 28),
        [System.Drawing.Point]::new(72, 22)
    )
    $tailWing = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new(108, 20),
        [System.Drawing.Point]::new(152, 38),
        [System.Drawing.Point]::new(142, 62),
        [System.Drawing.Point]::new(98, 36)
    )
    $Graphics.FillPolygon($wingBrush, $leftWing)
    $Graphics.FillPolygon($wingBrush, $rightWing)
    $Graphics.FillPolygon($wingBrush, $tailWing)
    $wingBrush.Dispose()

    $bodyRect = [System.Drawing.Rectangle]::new(-24, -18, 140, 86)
    $bodyBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bodyRect, $Variant.LogoBodyTop, $Variant.LogoBodyBottom, 90)
    $Graphics.FillEllipse($bodyBrush, $bodyRect)
    $bodyBrush.Dispose()

    $Graphics.DrawImage($Logo, -8, -6, 132, 132)
    $Graphics.Restore($state)
}

function Draw-Reflection {
    param(
        [System.Drawing.Graphics]$Graphics,
        [pscustomobject]$Variant
    )

    $reflectionRect = [System.Drawing.Rectangle]::new([int]($Variant.LogoX - 120), [int]($Variant.LogoY + 28), 240, 180)
    $reflectionBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $reflectionRect,
        (New-Color 72 255 255 255),
        (New-Color 0 255 255 255),
        90
    )
    $Graphics.FillEllipse($reflectionBrush, $Variant.LogoX - 100, $Variant.LogoY + 34, 200, 144)
    $reflectionBrush.Dispose()
}

function Add-WaterTexture {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Random]$Random,
        [System.Drawing.Color]$LightColor,
        [System.Drawing.Color]$DeepColor
    )

    $pen1 = New-Object System.Drawing.Pen($LightColor, 1)
    $pen2 = New-Object System.Drawing.Pen($DeepColor, 1)

    for ($i = 0; $i -lt 1400; $i++) {
        $x = $Random.Next(0, $width)
        $y = $Random.Next(308, 498)
        $len = $Random.Next(2, 7)
        $Graphics.DrawLine($pen1, $x, $y, $x, $y - $len)
    }

    for ($i = 0; $i -lt 1100; $i++) {
        $x = $Random.Next(0, $width)
        $y = $Random.Next(318, 498)
        $len = $Random.Next(1, 4)
        $Graphics.DrawLine($pen2, $x, $y, $x + 1, $y - $len)
    }

    $pen1.Dispose()
    $pen2.Dispose()
}

$variants = @(
    [pscustomobject]@{
        Name = 'crew-surreal-01'
        SkyTop = (New-Color 255 225 231 255)
        SkyBottom = (New-Color 255 255 204 228)
        Overlay = (New-Color 24 136 182 255)
        WaterTop = (New-Color 255 242 208 228)
        WaterBottom = (New-Color 255 112 125 190)
        IslandX = 390; IslandY = 250; IslandW = 520; IslandH = 136
        IslandTop = (New-Color 255 173 112 206)
        IslandEdge = (New-Color 255 96 72 170)
        IslandGlow = (New-Color 110 230 204 255)
        LogoX = 780; LogoY = 170; LogoSize = 180; LogoAngle = -10
        LogoBodyTop = (New-Color 255 192 231 255); LogoBodyBottom = (New-Color 255 95 120 188)
        WingColor = (New-Color 185 255 179 220)
        Bubble = @{ X = 90; Y = 30; Size = 140; X2 = 290; Y2 = 60; Size2 = 38 }
        Plants = @(
            @{ Type = 'mushroom'; X = 90; Y = 84; H = 66; W = 72; Cap = (New-Color 255 255 188 126); Stem = (New-Color 255 220 120 112) },
            @{ Type = 'mushroom'; X = 292; Y = 78; H = 58; W = 54; Cap = (New-Color 255 255 218 148); Stem = (New-Color 255 204 118 112) },
            @{ Type = 'mushroom'; X = 410; Y = 92; H = 70; W = 62; Cap = (New-Color 255 255 202 118); Stem = (New-Color 255 201 115 106) },
            @{ Type = 'coral'; X = 150; Y = 96; H = 92; Color = (New-Color 255 154 230 255) },
            @{ Type = 'coral'; X = 460; Y = 92; H = 80; Color = (New-Color 255 196 154 255) },
            @{ Type = 'seaweed'; X = 222; Y = 98; Color = (New-Color 255 106 182 214) },
            @{ Type = 'seaweed'; X = 352; Y = 100; Color = (New-Color 255 106 164 226) },
            @{ Type = 'jelly'; X = 476; Y = 42; S = 30 }
        )
    },
    [pscustomobject]@{
        Name = 'crew-surreal-02'
        SkyTop = (New-Color 255 231 234 255)
        SkyBottom = (New-Color 255 255 214 236)
        Overlay = (New-Color 22 120 172 250)
        WaterTop = (New-Color 255 242 212 230)
        WaterBottom = (New-Color 255 96 116 184)
        IslandX = 290; IslandY = 260; IslandW = 600; IslandH = 126
        IslandTop = (New-Color 255 160 108 202)
        IslandEdge = (New-Color 255 90 66 160)
        IslandGlow = (New-Color 100 220 196 255)
        LogoX = 650; LogoY = 160; LogoSize = 196; LogoAngle = 8
        LogoBodyTop = (New-Color 255 205 232 255); LogoBodyBottom = (New-Color 255 88 126 196)
        WingColor = (New-Color 175 255 186 228)
        Bubble = @{ X = 1120; Y = 28; Size = 132; X2 = 1280; Y2 = 82; Size2 = 34 }
        Plants = @(
            @{ Type = 'mushroom'; X = 120; Y = 84; H = 74; W = 78; Cap = (New-Color 255 255 200 124); Stem = (New-Color 255 219 130 118) },
            @{ Type = 'mushroom'; X = 316; Y = 84; H = 60; W = 58; Cap = (New-Color 255 255 214 144); Stem = (New-Color 255 210 118 108) },
            @{ Type = 'mushroom'; X = 486; Y = 92; H = 64; W = 66; Cap = (New-Color 255 255 184 110); Stem = (New-Color 255 208 122 112) },
            @{ Type = 'coral'; X = 206; Y = 90; H = 84; Color = (New-Color 255 162 226 255) },
            @{ Type = 'coral'; X = 548; Y = 96; H = 74; Color = (New-Color 255 195 160 255) },
            @{ Type = 'seaweed'; X = 260; Y = 96; Color = (New-Color 255 112 182 216) },
            @{ Type = 'seaweed'; X = 420; Y = 98; Color = (New-Color 255 102 170 228) },
            @{ Type = 'jelly'; X = 404; Y = 34; S = 28 },
            @{ Type = 'jelly'; X = 536; Y = 58; S = 22 }
        )
    },
    [pscustomobject]@{
        Name = 'crew-surreal-03'
        SkyTop = (New-Color 255 223 229 255)
        SkyBottom = (New-Color 255 244 210 232)
        Overlay = (New-Color 24 130 178 255)
        WaterTop = (New-Color 255 238 210 228)
        WaterBottom = (New-Color 255 104 121 188)
        IslandX = 450; IslandY = 258; IslandW = 470; IslandH = 124
        IslandTop = (New-Color 255 150 106 198)
        IslandEdge = (New-Color 255 88 67 156)
        IslandGlow = (New-Color 98 214 192 255)
        LogoX = 820; LogoY = 146; LogoSize = 210; LogoAngle = -4
        LogoBodyTop = (New-Color 255 188 226 255); LogoBodyBottom = (New-Color 255 80 118 190)
        WingColor = (New-Color 180 255 182 222)
        Bubble = @{ X = 160; Y = 26; Size = 146; X2 = 330; Y2 = 74; Size2 = 40 }
        Plants = @(
            @{ Type = 'mushroom'; X = 88; Y = 80; H = 72; W = 74; Cap = (New-Color 255 255 194 126); Stem = (New-Color 255 216 126 114) },
            @{ Type = 'mushroom'; X = 242; Y = 90; H = 58; W = 60; Cap = (New-Color 255 255 206 138); Stem = (New-Color 255 212 116 106) },
            @{ Type = 'mushroom'; X = 370; Y = 86; H = 66; W = 58; Cap = (New-Color 255 255 190 118); Stem = (New-Color 255 208 116 106) },
            @{ Type = 'coral'; X = 154; Y = 90; H = 90; Color = (New-Color 255 156 232 255) },
            @{ Type = 'coral'; X = 422; Y = 92; H = 82; Color = (New-Color 255 202 164 255) },
            @{ Type = 'seaweed'; X = 290; Y = 100; Color = (New-Color 255 112 175 220) },
            @{ Type = 'seaweed'; X = 332; Y = 96; Color = (New-Color 255 108 162 226) },
            @{ Type = 'jelly'; X = 446; Y = 42; S = 26 }
        )
    },
    [pscustomobject]@{
        Name = 'crew-surreal-04'
        SkyTop = (New-Color 255 228 233 255)
        SkyBottom = (New-Color 255 245 214 238)
        Overlay = (New-Color 22 126 170 255)
        WaterTop = (New-Color 255 244 214 232)
        WaterBottom = (New-Color 255 98 118 186)
        IslandX = 560; IslandY = 262; IslandW = 540; IslandH = 116
        IslandTop = (New-Color 255 162 112 205)
        IslandEdge = (New-Color 255 94 72 166)
        IslandGlow = (New-Color 105 224 202 255)
        LogoX = 930; LogoY = 158; LogoSize = 188; LogoAngle = 12
        LogoBodyTop = (New-Color 255 202 232 255); LogoBodyBottom = (New-Color 255 82 122 194)
        WingColor = (New-Color 185 255 188 228)
        Bubble = @{ X = 112; Y = 24; Size = 136; X2 = 292; Y2 = 76; Size2 = 36 }
        Plants = @(
            @{ Type = 'mushroom'; X = 116; Y = 82; H = 68; W = 66; Cap = (New-Color 255 255 194 128); Stem = (New-Color 255 218 124 112) },
            @{ Type = 'mushroom'; X = 270; Y = 88; H = 60; W = 56; Cap = (New-Color 255 255 206 138); Stem = (New-Color 255 212 118 110) },
            @{ Type = 'mushroom'; X = 440; Y = 84; H = 74; W = 64; Cap = (New-Color 255 255 185 116); Stem = (New-Color 255 210 122 110) },
            @{ Type = 'coral'; X = 176; Y = 88; H = 86; Color = (New-Color 255 164 232 255) },
            @{ Type = 'coral'; X = 382; Y = 94; H = 78; Color = (New-Color 255 200 160 255) },
            @{ Type = 'seaweed'; X = 230; Y = 100; Color = (New-Color 255 112 182 214) },
            @{ Type = 'seaweed'; X = 330; Y = 98; Color = (New-Color 255 104 168 224) },
            @{ Type = 'jelly'; X = 470; Y = 50; S = 24 },
            @{ Type = 'jelly'; X = 512; Y = 68; S = 20 }
        )
    },
    [pscustomobject]@{
        Name = 'crew-surreal-05'
        SkyTop = (New-Color 255 224 231 255)
        SkyBottom = (New-Color 255 247 212 236)
        Overlay = (New-Color 24 132 176 255)
        WaterTop = (New-Color 255 242 210 230)
        WaterBottom = (New-Color 255 106 123 188)
        IslandX = 350; IslandY = 254; IslandW = 650; IslandH = 132
        IslandTop = (New-Color 255 168 114 208)
        IslandEdge = (New-Color 255 96 74 168)
        IslandGlow = (New-Color 105 224 205 255)
        LogoX = 700; LogoY = 150; LogoSize = 202; LogoAngle = -14
        LogoBodyTop = (New-Color 255 198 230 255); LogoBodyBottom = (New-Color 255 86 120 190)
        WingColor = (New-Color 180 255 180 224)
        Bubble = @{ X = 1080; Y = 28; Size = 144; X2 = 1272; Y2 = 80; Size2 = 40 }
        Plants = @(
            @{ Type = 'mushroom'; X = 108; Y = 84; H = 74; W = 74; Cap = (New-Color 255 255 192 126); Stem = (New-Color 255 220 124 114) },
            @{ Type = 'mushroom'; X = 310; Y = 86; H = 62; W = 58; Cap = (New-Color 255 255 208 140); Stem = (New-Color 255 214 118 108) },
            @{ Type = 'mushroom'; X = 500; Y = 92; H = 70; W = 68; Cap = (New-Color 255 255 188 118); Stem = (New-Color 255 210 122 112) },
            @{ Type = 'coral'; X = 180; Y = 92; H = 86; Color = (New-Color 255 162 232 255) },
            @{ Type = 'coral'; X = 440; Y = 94; H = 82; Color = (New-Color 255 202 164 255) },
            @{ Type = 'seaweed'; X = 246; Y = 102; Color = (New-Color 255 112 180 214) },
            @{ Type = 'seaweed'; X = 394; Y = 100; Color = (New-Color 255 106 170 226) },
            @{ Type = 'jelly'; X = 542; Y = 46; S = 28 }
        )
    }
)

$generated = @()

foreach ($variant in $variants) {
    $random = [System.Random]::new(([Math]::Abs($variant.Name.GetHashCode())))
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $canvas = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
    $background = New-Object System.Drawing.Drawing2D.LinearGradientBrush($canvas, $variant.SkyTop, $variant.SkyBottom, 90)
    $graphics.FillRectangle($background, $canvas)
    $background.Dispose()

    $overlay = New-Object System.Drawing.SolidBrush($variant.Overlay)
    $graphics.FillRectangle($overlay, 0, 0, $width, $height)
    $overlay.Dispose()

    Fill-EllipseGradient -Graphics $graphics -X 220 -Y 26 -Width 980 -Height 160 -Center (New-Color 70 255 255 255) -Outer (New-Color 0 255 255 255)
    Fill-EllipseGradient -Graphics $graphics -X 1010 -Y 250 -Width 360 -Height 110 -Center (New-Color 22 255 255 255) -Outer (New-Color 0 255 255 255)
    Fill-EllipseGradient -Graphics $graphics -X 90 -Y 286 -Width 420 -Height 116 -Center (New-Color 18 255 255 255) -Outer (New-Color 0 255 255 255)

    Draw-Bubble -Graphics $graphics -X $variant.Bubble.X -Y $variant.Bubble.Y -Size $variant.Bubble.Size
    Draw-Bubble -Graphics $graphics -X $variant.Bubble.X2 -Y $variant.Bubble.Y2 -Size $variant.Bubble.Size2

    $waterRect = [System.Drawing.Rectangle]::new(0, 300, $width, 200)
    $water = New-Object System.Drawing.Drawing2D.LinearGradientBrush($waterRect, $variant.WaterTop, $variant.WaterBottom, 90)
    $graphics.FillRectangle($water, $waterRect)
    $water.Dispose()

    Draw-Island -Graphics $graphics -Variant $variant -Random $random
    Draw-Reflection -Graphics $graphics -Variant $variant
    Draw-LogoCreature -Graphics $graphics -Variant $variant -Logo $logoImage

    for ($i = 0; $i -lt 5; $i++) {
        $fogX = $random.Next(-80, 1320)
        $fogY = $random.Next(332, 470)
        $fogW = $random.Next(160, 340)
        $fogH = $random.Next(34, 74)
        Fill-EllipseGradient -Graphics $graphics -X $fogX -Y $fogY -Width $fogW -Height $fogH -Center (New-Color 46 255 255 255) -Outer (New-Color 0 255 255 255)
    }

    Add-WaterTexture -Graphics $graphics -Random $random -LightColor (New-Color 54 255 255 255) -DeepColor (New-Color 22 255 220 240)

    $haze = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Rectangle(0, 220, $width, 220)),
        (New-Color 0 255 255 255),
        (New-Color 28 255 255 255),
        90
    )
    $graphics.FillRectangle($haze, 0, 220, $width, 220)
    $haze.Dispose()

    $topMist = New-Object System.Drawing.SolidBrush((New-Color 16 255 255 255))
    $graphics.FillRectangle($topMist, 0, 0, $width, 130)
    $topMist.Dispose()

    $outFile = Join-Path $outputDir ($variant.Name + '.png')
    $bitmap.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Png)
    $generated += $outFile

    $graphics.Dispose()
    $bitmap.Dispose()
}

$logoImage.Dispose()
$logoSource.Dispose()
$generated | ForEach-Object { Write-Output $_ }
