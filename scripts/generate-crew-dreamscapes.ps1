$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$outputDir = 'C:\Users\jyjy6\Documents\New project\output\crew-dreamscapes'
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$width = 1500
$height = 500

function New-Color([int]$a, [int]$r, [int]$g, [int]$b) {
    return [System.Drawing.Color]::FromArgb($a, $r, $g, $b)
}

function Add-GlowEllipse {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$X,
        [int]$Y,
        [int]$Width,
        [int]$Height,
        [System.Drawing.Color]$CenterColor,
        [System.Drawing.Color]$OuterColor
    )

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse($X, $Y, $Width, $Height)
    $brush = [System.Drawing.Drawing2D.PathGradientBrush]::new($path)
    $brush.CenterColor = $CenterColor
    $brush.SurroundColors = @($OuterColor)
    $Graphics.FillPath($brush, $path)
    $brush.Dispose()
    $path.Dispose()
}

function Fill-Dome {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$X,
        [int]$Y,
        [int]$Width,
        [int]$Height,
        [System.Drawing.Color]$BaseColor,
        [System.Drawing.Color]$GlowColor,
        [System.Drawing.Color]$HighlightColor,
        [int]$ArcOffset = 20
    )

    $rect = New-Object System.Drawing.Rectangle($X, $Y, $Width, $Height)
    $gradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $GlowColor, $BaseColor, 90)
    $Graphics.FillEllipse($gradient, $rect)
    $gradient.Dispose()

    $pen = New-Object System.Drawing.Pen($HighlightColor, 3)
    $Graphics.DrawArc($pen, $X + 10, $Y + $ArcOffset, $Width - 20, $Height - ($ArcOffset * 2), 188, 124)
    $pen.Dispose()
}

function Add-Spire {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$X,
        [int]$BaseY,
        [int]$Height,
        [int]$Width,
        [System.Drawing.Color]$Color
    )

    $points = [System.Drawing.Point[]]@(
        [System.Drawing.Point]::new($X, $BaseY),
        [System.Drawing.Point]::new($X + [int]($Width / 2), $BaseY - $Height),
        [System.Drawing.Point]::new($X + $Width, $BaseY)
    )
    $brush = New-Object System.Drawing.SolidBrush($Color)
    $Graphics.FillPolygon($brush, $points)
    $brush.Dispose()
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

function Add-BrandGlyph {
    param(
        [System.Drawing.Graphics]$Graphics,
        [float]$CenterX,
        [float]$CenterY,
        [float]$Scale,
        [System.Drawing.Color]$GlowColor
    )

    Add-GlowEllipse -Graphics $Graphics -X ([int]($CenterX - (22 * $Scale))) -Y ([int]($CenterY - (36 * $Scale))) -Width ([int](44 * $Scale)) -Height ([int](72 * $Scale)) -CenterColor $GlowColor -OuterColor (New-Color 0 $GlowColor.R $GlowColor.G $GlowColor.B)

    Add-SharpBar -Graphics $Graphics -Color (New-Color 255 255 255 255) -CenterX $CenterX -CenterY $CenterY -BarWidth (32 * $Scale) -BarHeight (10 * $Scale) -Angle 38 -Slant (8 * $Scale)
    Add-SharpBar -Graphics $Graphics -Color (New-Color 255 255 255 255) -CenterX ($CenterX + (4 * $Scale)) -CenterY ($CenterY - (5 * $Scale)) -BarWidth (32 * $Scale) -BarHeight (10 * $Scale) -Angle -38 -Slant (8 * $Scale)
    Add-SharpBar -Graphics $Graphics -Color (New-Color 255 255 255 255) -CenterX ($CenterX + (14 * $Scale)) -CenterY ($CenterY - (22 * $Scale)) -BarWidth (28 * $Scale) -BarHeight (9 * $Scale) -Angle -36 -Slant (7 * $Scale)
}

function Add-GrassField {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Random]$Random,
        [System.Drawing.Color]$Primary,
        [System.Drawing.Color]$Secondary
    )

    $pen1 = New-Object System.Drawing.Pen($Primary, 1)
    $pen2 = New-Object System.Drawing.Pen($Secondary, 1)

    for ($i = 0; $i -lt 1900; $i++) {
        $x = $Random.Next(0, $width)
        $y = $Random.Next(300, 499)
        $len = $Random.Next(3, 11)
        $Graphics.DrawLine($pen1, $x, $y, $x, $y - $len)
    }

    for ($i = 0; $i -lt 1300; $i++) {
        $x = $Random.Next(0, $width)
        $y = $Random.Next(308, 500)
        $len = $Random.Next(2, 9)
        $Graphics.DrawLine($pen2, $x, $y, $x, $y - $len)
    }

    $pen1.Dispose()
    $pen2.Dispose()
}

function Add-FloatingStrokes {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Random]$Random,
        [System.Drawing.Color]$StrokeColor,
        [int]$Count
    )

    $pen = New-Object System.Drawing.Pen($StrokeColor, 2)
    for ($i = 0; $i -lt $Count; $i++) {
        $x = $Random.Next(20, 1420)
        $y = $Random.Next(40, 190)
        $w = $Random.Next(80, 240)
        $h = $Random.Next(24, 72)
        $start = $Random.Next(186, 210)
        $sweep = $Random.Next(70, 112)
        $Graphics.DrawArc($pen, $x, $y, $w, $h, $start, $sweep)
    }
    $pen.Dispose()
}

function Get-DomeLayout {
    param(
        [string]$Scene,
        [System.Random]$Random
    )

    switch ($Scene) {
        'lagoon' {
            return @(
                @{ X = -120; Y = 220; W = 430; H = 210; I = 0 },
                @{ X = 120 + $Random.Next(-10, 25); Y = 190; W = 360; H = 200; I = 1 },
                @{ X = 305 + $Random.Next(-25, 40); Y = 158; W = 455; H = 228; I = 2 },
                @{ X = 590 + $Random.Next(-30, 30); Y = 140; W = 515; H = 258; I = 0 },
                @{ X = 930 + $Random.Next(-25, 20); Y = 184; W = 360; H = 208; I = 3 },
                @{ X = 1105 + $Random.Next(-30, 40); Y = 178; W = 395; H = 215; I = 1 },
                @{ X = 1298 + $Random.Next(-15, 25); Y = 202; W = 300; H = 200; I = 2 }
            )
        }
        'coral' {
            return @(
                @{ X = -90; Y = 232; W = 300; H = 170; I = 0 },
                @{ X = 120; Y = 198; W = 500; H = 210; I = 1 },
                @{ X = 612; Y = 154; W = 560; H = 238; I = 0 },
                @{ X = 934; Y = 186; W = 350; H = 198; I = 3 },
                @{ X = 1115; Y = 180; W = 340; H = 186; I = 1 },
                @{ X = 1320; Y = 210; W = 250; H = 168; I = 2 }
            )
        }
        'plain' {
            return @(
                @{ X = -110; Y = 220; W = 370; H = 210; I = 0 },
                @{ X = 110; Y = 192; W = 470; H = 216; I = 1 },
                @{ X = 430; Y = 130; W = 650; H = 286; I = 2 },
                @{ X = 975; Y = 184; W = 340; H = 200; I = 3 },
                @{ X = 1245; Y = 198; W = 325; H = 188; I = 0 }
            )
        }
        'dunes' {
            return @(
                @{ X = -150; Y = 226; W = 340; H = 170; I = 3 },
                @{ X = 80; Y = 192; W = 420; H = 208; I = 0 },
                @{ X = 325; Y = 158; W = 500; H = 228; I = 1 },
                @{ X = 592; Y = 142; W = 560; H = 248; I = 3 },
                @{ X = 920; Y = 190; W = 430; H = 198; I = 0 },
                @{ X = 1138; Y = 178; W = 460; H = 206; I = 2 }
            )
        }
        'horizon' {
            return @(
                @{ X = -130; Y = 225; W = 260; H = 150; I = 0 },
                @{ X = 72; Y = 208; W = 280; H = 170; I = 1 },
                @{ X = 225; Y = 186; W = 470; H = 208; I = 2 },
                @{ X = 608; Y = 156; W = 520; H = 236; I = 0 },
                @{ X = 940; Y = 188; W = 340; H = 192; I = 3 },
                @{ X = 1092; Y = 176; W = 360; H = 196; I = 1 },
                @{ X = 1290; Y = 202; W = 290; H = 168; I = 2 }
            )
        }
        default {
            return @()
        }
    }
}

function Add-SceneDetails {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Random]$Random,
        [pscustomobject]$Variant
    )

    switch ($Variant.Scene) {
        'lagoon' {
            for ($i = 0; $i -lt 4; $i++) {
                Add-GlowEllipse -Graphics $Graphics -X ($Random.Next(-120, 1280)) -Y (302 + $Random.Next(-10, 30)) -Width (260 + $Random.Next(80, 240)) -Height (110 + $Random.Next(10, 55)) -CenterColor (New-Color 35 255 255 255) -OuterColor (New-Color 0 255 255 255)
            }
        }
        'coral' {
            $coralPen = New-Object System.Drawing.Pen((New-Color 120 255 170 210), 4)
            $coralPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
            $coralPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
            $coralBrush = New-Object System.Drawing.SolidBrush((New-Color 85 255 210 230))
            foreach ($x in @(160, 250, 1180, 1305)) {
                $baseY = 390 + $Random.Next(-8, 12)
                $Graphics.DrawLine($coralPen, $x, $baseY, $x, $baseY - 46)
                $Graphics.DrawLine($coralPen, $x, $baseY - 20, $x - 22, $baseY - 48)
                $Graphics.DrawLine($coralPen, $x, $baseY - 18, $x + 24, $baseY - 42)
                $Graphics.FillEllipse($coralBrush, $x - 28, $baseY - 20, 56, 24)
            }
            for ($i = 0; $i -lt 6; $i++) {
                Add-GlowEllipse -Graphics $Graphics -X ($Random.Next(80, 1320)) -Y ($Random.Next(70, 210)) -Width ($Random.Next(20, 52)) -Height ($Random.Next(20, 52)) -CenterColor (New-Color 70 255 220 245) -OuterColor (New-Color 0 255 220 245)
            }
            $coralPen.Dispose()
            $coralBrush.Dispose()
        }
        'plain' {
            $portalPen = New-Object System.Drawing.Pen((New-Color 115 255 255 255), 3)
            $Graphics.DrawEllipse($portalPen, 650, 250, 180, 82)
            $Graphics.DrawEllipse($portalPen, 628, 238, 224, 108)
            $portalPen.Dispose()

            $beam = New-Object System.Drawing.Drawing2D.LinearGradientBrush((New-Object System.Drawing.Rectangle(715, 236, 52, 220)), (New-Color 135 255 255 255), (New-Color 0 255 255 255), 90)
            $Graphics.FillRectangle($beam, 715, 236, 52, 220)
            $beam.Dispose()

            Add-GlowEllipse -Graphics $Graphics -X 645 -Y 214 -Width 190 -Height 120 -CenterColor (New-Color 48 255 255 255) -OuterColor (New-Color 0 255 255 255)
        }
        'dunes' {
            Add-GlowEllipse -Graphics $Graphics -X 980 -Y 48 -Width 300 -Height 300 -CenterColor (New-Color 92 255 245 255) -OuterColor (New-Color 0 255 245 255)
            $ribbonPen = New-Object System.Drawing.Pen((New-Color 72 255 255 255), 3)
            $Graphics.DrawArc($ribbonPen, 1010, 76, 330, 120, 188, 102)
            $Graphics.DrawArc($ribbonPen, 1082, 122, 270, 98, 188, 98)
            $Graphics.DrawArc($ribbonPen, 1126, 160, 220, 82, 188, 92)
            $ribbonPen.Dispose()

            Add-GlowEllipse -Graphics $Graphics -X 140 -Y 320 -Width 420 -Height 118 -CenterColor (New-Color 30 255 255 255) -OuterColor (New-Color 0 255 255 255)
        }
        'horizon' {
            $orbPen = New-Object System.Drawing.Pen((New-Color 110 198 230 255), 3)
            $nodeBrush = New-Object System.Drawing.SolidBrush((New-Color 80 255 245 255))
            $nodes = @(
                [System.Drawing.Point]::new(190, 92),
                [System.Drawing.Point]::new(306, 124),
                [System.Drawing.Point]::new(438, 86),
                [System.Drawing.Point]::new(520, 132)
            )
            for ($i = 0; $i -lt ($nodes.Count - 1); $i++) {
                $Graphics.DrawLine($orbPen, $nodes[$i], $nodes[$i + 1])
            }
            foreach ($node in $nodes) {
                $Graphics.FillEllipse($nodeBrush, $node.X - 14, $node.Y - 14, 28, 28)
                $Graphics.DrawEllipse($orbPen, $node.X - 28, $node.Y - 28, 56, 56)
            }
            $orbPen.Dispose()
            $nodeBrush.Dispose()

            Add-GlowEllipse -Graphics $Graphics -X 1120 -Y 300 -Width 260 -Height 92 -CenterColor (New-Color 28 255 255 255) -OuterColor (New-Color 0 255 255 255)
            Add-GlowEllipse -Graphics $Graphics -X 40 -Y 320 -Width 220 -Height 88 -CenterColor (New-Color 26 255 255 255) -OuterColor (New-Color 0 255 255 255)
        }
    }
}

$variants = @(
    [pscustomobject]@{
        Name = 'crew-01-aurora-lagoon'
        Scene = 'lagoon'
        Seed = 101
        SkyTop = (New-Color 255 241 217 255)
        SkyBottom = (New-Color 255 85 152 255)
        Overlay = (New-Color 42 255 160 222)
        GroundTop = (New-Color 255 124 231 255)
        GroundBottom = (New-Color 255 28 92 215)
        DomeBase = @(
            (New-Color 255 112 126 242),
            (New-Color 255 100 114 234),
            (New-Color 255 87 93 219),
            (New-Color 255 73 122 236)
        )
        DomeGlow = @(
            (New-Color 255 203 220 255),
            (New-Color 255 193 207 255),
            (New-Color 255 176 186 255),
            (New-Color 255 160 226 255)
        )
        Spires = @(
            @{ X = 84; BaseY = 290; Height = 128; Width = 18; Color = (New-Color 175 120 84 232) },
            @{ X = 596; BaseY = 174; Height = 48; Width = 7; Color = (New-Color 140 117 84 228) },
            @{ X = 1138; BaseY = 264; Height = 116; Width = 16; Color = (New-Color 175 145 80 234) }
        )
        LogoX = 744
        LogoY = 386
        LogoScale = 1.0
        GlowTone = (New-Color 160 255 255 255)
    },
    [pscustomobject]@{
        Name = 'crew-02-coral-mirage'
        Scene = 'coral'
        Seed = 202
        SkyTop = (New-Color 255 255 224 245)
        SkyBottom = (New-Color 255 124 118 255)
        Overlay = (New-Color 35 255 128 188)
        GroundTop = (New-Color 255 255 183 231)
        GroundBottom = (New-Color 255 70 92 222)
        DomeBase = @(
            (New-Color 255 183 125 229),
            (New-Color 255 150 114 238),
            (New-Color 255 104 106 222),
            (New-Color 255 78 150 244)
        )
        DomeGlow = @(
            (New-Color 255 255 215 235),
            (New-Color 255 235 190 255),
            (New-Color 255 188 192 255),
            (New-Color 255 173 235 255)
        )
        Spires = @(
            @{ X = 216; BaseY = 256; Height = 78; Width = 11; Color = (New-Color 155 215 92 255) },
            @{ X = 770; BaseY = 168; Height = 58; Width = 9; Color = (New-Color 145 255 142 220) },
            @{ X = 1326; BaseY = 245; Height = 84; Width = 10; Color = (New-Color 160 202 100 255) }
        )
        LogoX = 1070
        LogoY = 360
        LogoScale = 1.05
        GlowTone = (New-Color 170 255 236 255)
    },
    [pscustomobject]@{
        Name = 'crew-03-violet-plain'
        Scene = 'plain'
        Seed = 303
        SkyTop = (New-Color 255 206 210 255)
        SkyBottom = (New-Color 255 104 140 255)
        Overlay = (New-Color 40 255 182 255)
        GroundTop = (New-Color 255 149 244 255)
        GroundBottom = (New-Color 255 21 82 204)
        DomeBase = @(
            (New-Color 255 116 135 250),
            (New-Color 255 96 111 239),
            (New-Color 255 94 88 208),
            (New-Color 255 80 138 243)
        )
        DomeGlow = @(
            (New-Color 255 211 222 255),
            (New-Color 255 186 203 255),
            (New-Color 255 170 178 244),
            (New-Color 255 176 242 255)
        )
        Spires = @(
            @{ X = 66; BaseY = 293; Height = 146; Width = 18; Color = (New-Color 170 126 88 245) },
            @{ X = 556; BaseY = 176; Height = 56; Width = 7; Color = (New-Color 160 118 86 232) },
            @{ X = 1364; BaseY = 248; Height = 82; Width = 10; Color = (New-Color 150 125 92 236) }
        )
        LogoX = 744
        LogoY = 392
        LogoScale = 1.1
        GlowTone = (New-Color 180 255 255 255)
    },
    [pscustomobject]@{
        Name = 'crew-04-holo-dunes'
        Scene = 'dunes'
        Seed = 404
        SkyTop = (New-Color 255 255 219 235)
        SkyBottom = (New-Color 255 96 165 255)
        Overlay = (New-Color 34 190 255 240)
        GroundTop = (New-Color 255 116 244 245)
        GroundBottom = (New-Color 255 20 96 198)
        DomeBase = @(
            (New-Color 255 94 167 246),
            (New-Color 255 82 139 237),
            (New-Color 255 84 114 220),
            (New-Color 255 118 186 255)
        )
        DomeGlow = @(
            (New-Color 255 194 247 255),
            (New-Color 255 181 230 255),
            (New-Color 255 175 205 255),
            (New-Color 255 215 251 255)
        )
        Spires = @(
            @{ X = 232; BaseY = 262; Height = 92; Width = 11; Color = (New-Color 170 180 98 255) },
            @{ X = 1128; BaseY = 266; Height = 132; Width = 16; Color = (New-Color 190 140 88 244) },
            @{ X = 1374; BaseY = 245; Height = 66; Width = 9; Color = (New-Color 140 140 98 240) }
        )
        LogoX = 1210
        LogoY = 352
        LogoScale = 0.95
        GlowTone = (New-Color 165 226 255 255)
    },
    [pscustomobject]@{
        Name = 'crew-05-candy-horizon'
        Scene = 'horizon'
        Seed = 505
        SkyTop = (New-Color 255 249 222 255)
        SkyBottom = (New-Color 255 122 122 255)
        Overlay = (New-Color 38 255 155 205)
        GroundTop = (New-Color 255 160 236 255)
        GroundBottom = (New-Color 255 38 88 212)
        DomeBase = @(
            (New-Color 255 214 138 220),
            (New-Color 255 150 128 245),
            (New-Color 255 117 108 232),
            (New-Color 255 92 170 250)
        )
        DomeGlow = @(
            (New-Color 255 255 230 240),
            (New-Color 255 234 209 255),
            (New-Color 255 202 198 255),
            (New-Color 255 190 245 255)
        )
        Spires = @(
            @{ X = 82; BaseY = 289; Height = 120; Width = 17; Color = (New-Color 175 134 82 236) },
            @{ X = 604; BaseY = 178; Height = 52; Width = 7; Color = (New-Color 155 125 86 232) },
            @{ X = 1322; BaseY = 239; Height = 76; Width = 10; Color = (New-Color 155 124 90 240) }
        )
        LogoX = 420
        LogoY = 360
        LogoScale = 1.0
        GlowTone = (New-Color 170 255 255 255)
    }
)

$generatedFiles = @()

foreach ($variant in $variants) {
    $random = [System.Random]::new($variant.Seed)
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $canvas = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
    $background = New-Object System.Drawing.Drawing2D.LinearGradientBrush($canvas, $variant.SkyTop, $variant.SkyBottom, 90)
    $graphics.FillRectangle($background, $canvas)
    $background.Dispose()

    $overlayBrush = New-Object System.Drawing.SolidBrush($variant.Overlay)
    $graphics.FillRectangle($overlayBrush, 0, 0, $width, $height)
    $overlayBrush.Dispose()

    Add-GlowEllipse -Graphics $graphics -X (-140 + $random.Next(-20, 40)) -Y (-60 + $random.Next(-20, 30)) -Width 520 -Height 360 -CenterColor (New-Color 150 255 215 245) -OuterColor (New-Color 0 255 215 245)
    Add-GlowEllipse -Graphics $graphics -X (960 + $random.Next(-80, 40)) -Y (-55 + $random.Next(-10, 40)) -Width 520 -Height 340 -CenterColor (New-Color 120 245 235 255) -OuterColor (New-Color 0 245 235 255)
    Add-GlowEllipse -Graphics $graphics -X (320 + $random.Next(-80, 80)) -Y (35 + $random.Next(-10, 30)) -Width 850 -Height 260 -CenterColor (New-Color 100 255 170 220) -OuterColor (New-Color 0 255 170 220)

    $softMist = New-Object System.Drawing.Drawing2D.LinearGradientBrush((New-Object System.Drawing.Rectangle(0, 70, $width, 260)), (New-Color 0 255 255 255), (New-Color 55 255 255 255), 90)
    $graphics.FillRectangle($softMist, 0, 70, $width, 260)
    $softMist.Dispose()

    Add-FloatingStrokes -Graphics $graphics -Random $random -StrokeColor (New-Color 60 255 255 255) -Count 5

    $domeLayout = Get-DomeLayout -Scene $variant.Scene -Random $random

    foreach ($dome in $domeLayout) {
        $index = [int]$dome.I
        Fill-Dome -Graphics $graphics -X $dome.X -Y $dome.Y -Width $dome.W -Height $dome.H -BaseColor $variant.DomeBase[$index] -GlowColor $variant.DomeGlow[$index] -HighlightColor (New-Color 95 255 255 255) -ArcOffset (16 + $random.Next(0, 8))
    }

    $groundRect = New-Object System.Drawing.Rectangle(0, 292, $width, 208)
    $ground = New-Object System.Drawing.Drawing2D.LinearGradientBrush($groundRect, $variant.GroundTop, $variant.GroundBottom, 90)
    $graphics.FillRectangle($ground, 0, 292, $width, 208)
    $ground.Dispose()

    $waterLine = New-Object System.Drawing.SolidBrush((New-Color 78 255 255 255))
    $graphics.FillRectangle($waterLine, 0, 286, $width, 28)
    $waterLine.Dispose()

    Add-GrassField -Graphics $graphics -Random $random -Primary (New-Color 58 255 255 255) -Secondary (New-Color 42 120 255 255)

    foreach ($spire in $variant.Spires) {
        Add-Spire -Graphics $graphics -X $spire.X -BaseY $spire.BaseY -Height $spire.Height -Width $spire.Width -Color $spire.Color
    }

    Add-SceneDetails -Graphics $graphics -Random $random -Variant $variant

    Add-BrandGlyph -Graphics $graphics -CenterX $variant.LogoX -CenterY $variant.LogoY -Scale $variant.LogoScale -GlowColor $variant.GlowTone

    $topWash = New-Object System.Drawing.SolidBrush((New-Color 16 255 255 255))
    $graphics.FillRectangle($topWash, 0, 0, $width, 128)
    $topWash.Dispose()

    $filePath = Join-Path $outputDir ($variant.Name + '.png')
    $bitmap.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $generatedFiles += $filePath

    $graphics.Dispose()
    $bitmap.Dispose()
}

$generatedFiles | ForEach-Object { Write-Output $_ }
