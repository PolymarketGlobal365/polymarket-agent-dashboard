$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$outputDir = 'C:\Users\jyjy6\Documents\New project\output\crew-blue-atmospheres'
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$width = 1500
$height = 500

function New-Color([int]$a, [int]$r, [int]$g, [int]$b) {
    [System.Drawing.Color]::FromArgb($a, $r, $g, $b)
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

function Add-SoftHill {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$X,
        [int]$Y,
        [int]$Width,
        [int]$Height,
        [System.Drawing.Color]$TopColor,
        [System.Drawing.Color]$BottomColor
    )

    $rect = New-Object System.Drawing.Rectangle($X, $Y, $Width, $Height)
    $gradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $TopColor, $BottomColor, 90)
    $Graphics.FillEllipse($gradient, $rect)
    $gradient.Dispose()
}

function Add-SoftBeam {
    param(
        [System.Drawing.Graphics]$Graphics,
        [int]$X,
        [int]$Y,
        [int]$Width,
        [int]$Height,
        [System.Drawing.Color]$TopColor
    )

    $rect = New-Object System.Drawing.Rectangle($X, $Y, $Width, $Height)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $TopColor, (New-Color 0 $TopColor.R $TopColor.G $TopColor.B), 90)
    $Graphics.FillRectangle($brush, $rect)
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

    Add-GlowEllipse -Graphics $Graphics -X ([int]($CenterX - (48 * $Scale))) -Y ([int]($CenterY - (70 * $Scale))) -Width ([int](96 * $Scale)) -Height ([int](138 * $Scale)) -CenterColor $GlowColor -OuterColor (New-Color 0 $GlowColor.R $GlowColor.G $GlowColor.B)
    Add-SoftBeam -Graphics $Graphics -X ([int]($CenterX - (18 * $Scale))) -Y ([int]($CenterY - (26 * $Scale))) -Width ([int](36 * $Scale)) -Height ([int](168 * $Scale)) -TopColor (New-Color 72 255 255 255)

    Add-SharpBar -Graphics $Graphics -Color (New-Color 255 255 255 255) -CenterX $CenterX -CenterY $CenterY -BarWidth (74 * $Scale) -BarHeight (24 * $Scale) -Angle 38 -Slant (18 * $Scale)
    Add-SharpBar -Graphics $Graphics -Color (New-Color 255 255 255 255) -CenterX ($CenterX + (8 * $Scale)) -CenterY ($CenterY - (11 * $Scale)) -BarWidth (74 * $Scale) -BarHeight (24 * $Scale) -Angle -38 -Slant (18 * $Scale)
    Add-SharpBar -Graphics $Graphics -Color (New-Color 255 255 255 255) -CenterX ($CenterX + (28 * $Scale)) -CenterY ($CenterY - (48 * $Scale)) -BarWidth (64 * $Scale) -BarHeight (20 * $Scale) -Angle -36 -Slant (15 * $Scale)
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
    for ($i = 0; $i -lt 1300; $i++) {
        $x = $Random.Next(0, $width)
        $y = $Random.Next(300, 498)
        $len = $Random.Next(2, 7)
        $Graphics.DrawLine($pen1, $x, $y, $x, $y - $len)
    }
    for ($i = 0; $i -lt 900; $i++) {
        $x = $Random.Next(0, $width)
        $y = $Random.Next(320, 500)
        $len = $Random.Next(1, 5)
        $Graphics.DrawLine($pen2, $x, $y, $x + 1, $y - $len)
    }
    $pen1.Dispose()
    $pen2.Dispose()
}

function Add-Grain {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Random]$Random,
        [int]$Count
    )

    $brush = New-Object System.Drawing.SolidBrush((New-Color 14 255 255 255))
    for ($i = 0; $i -lt $Count; $i++) {
        $x = $Random.Next(0, $width)
        $y = $Random.Next(0, $height)
        $r = $Random.Next(1, 3)
        $Graphics.FillEllipse($brush, $x, $y, $r, $r)
    }
    $brush.Dispose()
}

$variants = @(
    [pscustomobject]@{
        Name = 'crew-blue-01-moon-lagoon'
        Seed = 1101
        SkyTop = (New-Color 255 218 227 255)
        SkyBottom = (New-Color 255 88 152 241)
        Overlay = (New-Color 28 120 196 255)
        GlowLeft = (New-Color 125 255 235 245)
        GlowRight = (New-Color 92 208 230 255)
        WaterTop = (New-Color 255 147 232 255)
        WaterBottom = (New-Color 255 37 93 210)
        Hills = @(
            @{ X = -90; Y = 232; W = 420; H = 172; A = (New-Color 255 198 222 255); B = (New-Color 255 114 158 236) },
            @{ X = 180; Y = 176; W = 560; H = 226; A = (New-Color 255 198 212 255); B = (New-Color 255 99 119 221) },
            @{ X = 700; Y = 160; W = 540; H = 236; A = (New-Color 255 184 235 255); B = (New-Color 255 84 142 232) },
            @{ X = 1150; Y = 198; W = 420; H = 190; A = (New-Color 255 192 214 255); B = (New-Color 255 102 130 224) }
        )
        LogoX = 760
        LogoY = 376
        LogoScale = 1.55
        GlowTone = (New-Color 195 255 255 255)
        LightPools = @(
            @{ X = 240; Y = 334; W = 340; H = 90 },
            @{ X = 1040; Y = 324; W = 420; H = 108 }
        )
    },
    [pscustomobject]@{
        Name = 'crew-blue-02-mist-shore'
        Seed = 2202
        SkyTop = (New-Color 255 229 235 255)
        SkyBottom = (New-Color 255 94 146 235)
        Overlay = (New-Color 24 160 190 255)
        GlowLeft = (New-Color 130 245 240 255)
        GlowRight = (New-Color 85 186 218 255)
        WaterTop = (New-Color 255 154 223 255)
        WaterBottom = (New-Color 255 54 102 220)
        Hills = @(
            @{ X = -110; Y = 230; W = 300; H = 156; A = (New-Color 255 208 228 255); B = (New-Color 255 135 171 239) },
            @{ X = 90; Y = 196; W = 400; H = 186; A = (New-Color 255 204 214 255); B = (New-Color 255 116 144 233) },
            @{ X = 470; Y = 144; W = 620; H = 254; A = (New-Color 255 194 202 255); B = (New-Color 255 94 120 220) },
            @{ X = 1090; Y = 190; W = 470; H = 196; A = (New-Color 255 198 222 255); B = (New-Color 255 117 150 235) }
        )
        LogoX = 1180
        LogoY = 368
        LogoScale = 1.6
        GlowTone = (New-Color 200 255 252 255)
        LightPools = @(
            @{ X = 120; Y = 346; W = 260; H = 80 },
            @{ X = 620; Y = 318; W = 320; H = 88 }
        )
    },
    [pscustomobject]@{
        Name = 'crew-blue-03-blue-plain'
        Seed = 3303
        SkyTop = (New-Color 255 213 221 255)
        SkyBottom = (New-Color 255 78 131 225)
        Overlay = (New-Color 25 140 178 240)
        GlowLeft = (New-Color 110 230 235 255)
        GlowRight = (New-Color 112 208 224 255)
        WaterTop = (New-Color 255 142 219 255)
        WaterBottom = (New-Color 255 29 88 208)
        Hills = @(
            @{ X = -130; Y = 236; W = 340; H = 160; A = (New-Color 255 202 223 255); B = (New-Color 255 112 145 233) },
            @{ X = 110; Y = 196; W = 450; H = 188; A = (New-Color 255 190 208 255); B = (New-Color 255 102 129 226) },
            @{ X = 430; Y = 128; W = 680; H = 274; A = (New-Color 255 184 198 252); B = (New-Color 255 84 110 214) },
            @{ X = 970; Y = 184; W = 350; H = 180; A = (New-Color 255 177 228 255); B = (New-Color 255 82 145 228) },
            @{ X = 1240; Y = 194; W = 380; H = 178; A = (New-Color 255 191 208 255); B = (New-Color 255 114 146 232) }
        )
        LogoX = 760
        LogoY = 382
        LogoScale = 1.7
        GlowTone = (New-Color 210 255 255 255)
        LightPools = @(
            @{ X = 260; Y = 330; W = 280; H = 92 },
            @{ X = 980; Y = 328; W = 360; H = 96 }
        )
    },
    [pscustomobject]@{
        Name = 'crew-blue-04-distant-bay'
        Seed = 4404
        SkyTop = (New-Color 255 225 233 255)
        SkyBottom = (New-Color 255 90 156 238)
        Overlay = (New-Color 24 168 204 230)
        GlowLeft = (New-Color 118 236 240 255)
        GlowRight = (New-Color 98 220 245 255)
        WaterTop = (New-Color 255 150 235 255)
        WaterBottom = (New-Color 255 41 108 218)
        Hills = @(
            @{ X = -120; Y = 240; W = 320; H = 144; A = (New-Color 255 200 224 255); B = (New-Color 255 118 163 238) },
            @{ X = 80; Y = 188; W = 520; H = 206; A = (New-Color 255 182 220 255); B = (New-Color 255 97 142 226) },
            @{ X = 530; Y = 150; W = 640; H = 244; A = (New-Color 255 184 230 255); B = (New-Color 255 92 143 228) },
            @{ X = 1030; Y = 188; W = 480; H = 196; A = (New-Color 255 194 216 255); B = (New-Color 255 110 145 230) }
        )
        LogoX = 1220
        LogoY = 366
        LogoScale = 1.55
        GlowTone = (New-Color 200 248 255 255)
        LightPools = @(
            @{ X = 180; Y = 336; W = 420; H = 110 },
            @{ X = 860; Y = 334; W = 260; H = 82 }
        )
    },
    [pscustomobject]@{
        Name = 'crew-blue-05-frost-haze'
        Seed = 5505
        SkyTop = (New-Color 255 218 226 255)
        SkyBottom = (New-Color 255 82 137 229)
        Overlay = (New-Color 26 116 175 235)
        GlowLeft = (New-Color 118 240 245 255)
        GlowRight = (New-Color 90 196 228 255)
        WaterTop = (New-Color 255 144 226 255)
        WaterBottom = (New-Color 255 33 94 212)
        Hills = @(
            @{ X = -90; Y = 234; W = 360; H = 156; A = (New-Color 255 205 226 255); B = (New-Color 255 121 161 238) },
            @{ X = 170; Y = 190; W = 430; H = 188; A = (New-Color 255 195 210 255); B = (New-Color 255 110 140 230) },
            @{ X = 610; Y = 148; W = 520; H = 224; A = (New-Color 255 208 226 255); B = (New-Color 255 118 154 236) },
            @{ X = 1040; Y = 194; W = 460; H = 186; A = (New-Color 255 192 218 255); B = (New-Color 255 105 139 228) }
        )
        LogoX = 430
        LogoY = 370
        LogoScale = 1.62
        GlowTone = (New-Color 198 255 255 255)
        LightPools = @(
            @{ X = 1080; Y = 334; W = 320; H = 96 },
            @{ X = 60; Y = 344; W = 220; H = 78 }
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

    $rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
    $background = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $variant.SkyTop, $variant.SkyBottom, 90)
    $graphics.FillRectangle($background, $rect)
    $background.Dispose()

    $overlayBrush = New-Object System.Drawing.SolidBrush($variant.Overlay)
    $graphics.FillRectangle($overlayBrush, 0, 0, $width, $height)
    $overlayBrush.Dispose()

    Add-GlowEllipse -Graphics $graphics -X (-120 + $random.Next(-30, 50)) -Y (-30 + $random.Next(-20, 20)) -Width 430 -Height 300 -CenterColor $variant.GlowLeft -OuterColor (New-Color 0 $variant.GlowLeft.R $variant.GlowLeft.G $variant.GlowLeft.B)
    Add-GlowEllipse -Graphics $graphics -X (1080 + $random.Next(-140, 40)) -Y (-20 + $random.Next(-20, 20)) -Width 420 -Height 280 -CenterColor $variant.GlowRight -OuterColor (New-Color 0 $variant.GlowRight.R $variant.GlowRight.G $variant.GlowRight.B)
    Add-GlowEllipse -Graphics $graphics -X (360 + $random.Next(-80, 100)) -Y (40 + $random.Next(-20, 20)) -Width 720 -Height 220 -CenterColor (New-Color 74 255 206 235) -OuterColor (New-Color 0 255 206 235)

    foreach ($hill in $variant.Hills) {
        Add-SoftHill -Graphics $graphics -X $hill.X -Y $hill.Y -Width $hill.W -Height $hill.H -TopColor $hill.A -BottomColor $hill.B
    }

    $waterRect = New-Object System.Drawing.Rectangle(0, 286, $width, 214)
    $water = New-Object System.Drawing.Drawing2D.LinearGradientBrush($waterRect, $variant.WaterTop, $variant.WaterBottom, 90)
    $graphics.FillRectangle($water, $waterRect)
    $water.Dispose()

    $horizonGlow = New-Object System.Drawing.SolidBrush((New-Color 72 255 255 255))
    $graphics.FillRectangle($horizonGlow, 0, 286, $width, 24)
    $horizonGlow.Dispose()

    foreach ($pool in $variant.LightPools) {
        Add-GlowEllipse -Graphics $graphics -X $pool.X -Y $pool.Y -Width $pool.W -Height $pool.H -CenterColor (New-Color 34 255 255 255) -OuterColor (New-Color 0 255 255 255)
    }

    Add-GlowEllipse -Graphics $graphics -X ($variant.LogoX - 110) -Y ($variant.LogoY - 30) -Width 220 -Height 70 -CenterColor (New-Color 28 255 255 255) -OuterColor (New-Color 0 255 255 255)
    Add-WaterTexture -Graphics $graphics -Random $random -LightColor (New-Color 58 255 255 255) -DeepColor (New-Color 32 170 220 255)

    Add-SoftBeam -Graphics $graphics -X ($variant.LogoX - 18) -Y ($variant.LogoY - 20) -Width 36 -Height 170 -TopColor (New-Color 52 255 255 255)
    Add-BrandGlyph -Graphics $graphics -CenterX $variant.LogoX -CenterY $variant.LogoY -Scale $variant.LogoScale -GlowColor $variant.GlowTone

    $mist1 = New-Object System.Drawing.Drawing2D.LinearGradientBrush((New-Object System.Drawing.Rectangle(0, 70, $width, 180)), (New-Color 0 255 255 255), (New-Color 34 255 255 255), 90)
    $graphics.FillRectangle($mist1, 0, 70, $width, 180)
    $mist1.Dispose()

    Add-GlowEllipse -Graphics $graphics -X (260 + $random.Next(-80, 120)) -Y (16 + $random.Next(-10, 25)) -Width 380 -Height 150 -CenterColor (New-Color 36 255 255 255) -OuterColor (New-Color 0 255 255 255)
    Add-GlowEllipse -Graphics $graphics -X (900 + $random.Next(-60, 90)) -Y (22 + $random.Next(-10, 25)) -Width 340 -Height 140 -CenterColor (New-Color 28 255 255 255) -OuterColor (New-Color 0 255 255 255)

    Add-Grain -Graphics $graphics -Random $random -Count 1800

    $topWash = New-Object System.Drawing.SolidBrush((New-Color 10 255 255 255))
    $graphics.FillRectangle($topWash, 0, 0, $width, 120)
    $topWash.Dispose()

    $file = Join-Path $outputDir ($variant.Name + '.png')
    $bitmap.Save($file, [System.Drawing.Imaging.ImageFormat]::Png)
    $files += $file

    $graphics.Dispose()
    $bitmap.Dispose()
}

$files | ForEach-Object { Write-Output $_ }
