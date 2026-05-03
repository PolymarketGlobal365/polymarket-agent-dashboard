from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


CANVAS = (1080, 1350)


def _fit_canvas(img: Image.Image) -> Image.Image:
    if img.size == CANVAS:
        return img.convert("RGBA")
    return img.convert("RGBA").resize(CANVAS, Image.Resampling.LANCZOS)


def _make_top_shadow(width: int, height: int) -> Image.Image:
    alpha = np.zeros((height, width), dtype=np.uint8)
    top_end = 300
    for y in range(top_end):
        t = 1.0 - (y / top_end)
        alpha[y, :] = np.clip(int(170 * (t ** 1.7)), 0, 255)
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    img.putalpha(Image.fromarray(alpha, mode="L").filter(ImageFilter.GaussianBlur(3)))
    return img


def _make_bottom_shadow(width: int, height: int) -> Image.Image:
    alpha = np.zeros((height, width), dtype=np.uint8)
    start = 430
    for y in range(start, height):
        t = (y - start) / (height - start)
        alpha[y, :] = np.clip(int(210 * (t ** 1.28)), 0, 255)
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    img.putalpha(Image.fromarray(alpha, mode="L").filter(ImageFilter.GaussianBlur(8)))
    return img


def _make_side_vignette(width: int, height: int) -> Image.Image:
    yy, xx = np.mgrid[0:height, 0:width]
    cx = width / 2
    cy = height * 0.52
    rx = width * 0.63
    ry = height * 0.78
    dist = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
    vignette = np.clip((dist - 0.68) / 0.6, 0, 1)
    alpha = (vignette * 90).astype(np.uint8)
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    img.putalpha(Image.fromarray(alpha, mode="L").filter(ImageFilter.GaussianBlur(18)))
    return img


def _make_center_lift(width: int, height: int) -> Image.Image:
    yy, xx = np.mgrid[0:height, 0:width]
    cx = width / 2
    cy = height * 0.33
    rx = width * 0.58
    ry = height * 0.36
    dist = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
    lift = np.clip(1 - dist, 0, 1)
    alpha = (lift * 22).astype(np.uint8)
    img = Image.new("RGBA", (width, height), (255, 255, 255, 0))
    img.putalpha(Image.fromarray(alpha, mode="L").filter(ImageFilter.GaussianBlur(26)))
    return img


def apply_template_gradient_image(image: Image.Image) -> Image.Image:
    base = _fit_canvas(image)
    width, height = base.size

    composed = Image.alpha_composite(base, _make_center_lift(width, height))
    composed = Image.alpha_composite(composed, _make_top_shadow(width, height))
    composed = Image.alpha_composite(composed, _make_bottom_shadow(width, height))
    composed = Image.alpha_composite(composed, _make_side_vignette(width, height))
    return composed


def apply_template_gradient(path: Path) -> None:
    composed = apply_template_gradient_image(Image.open(path))
    composed.save(path)
    print(path)


def main() -> None:
    folder = Path(r"F:\bluestateclub\Oil Traders Brace")
    for name in ("01.png", "02.png", "03.png"):
        apply_template_gradient(folder / name)


if __name__ == "__main__":
    main()
