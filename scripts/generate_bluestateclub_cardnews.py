from __future__ import annotations

from pathlib import Path
import math
import re
from dataclasses import dataclass

import numpy as np
from PIL import Image, ImageColor, ImageDraw, ImageEnhance, ImageFont, ImageOps

from apply_bluestateclub_gradient import apply_template_gradient_image


ROOT = Path(r"C:\Users\jyjy6\Documents\New project")
TEMPLATE_PREVIEW_DIR = ROOT / "temp" / "psd_preview"
SOURCE_DIR = ROOT / "temp" / "bluestateclub_src"
OUTPUT_ROOT = Path(r"F:\bluestateclub")
FONT_DIR = Path(r"C:\Users\jyjy6\Downloads\Pretendard-1.3.9\public\static")

CANVAS = (1080, 1350)
BLUE = "#5AA9FF"
RED = "#FF1717"
WHITE = "#F5F5F5"
BLACK = "#000000"
SLIDE3_DARK_OVERLAY_ALPHA = 150
SLIDE4_DARK_OVERLAY_ALPHA = 135


@dataclass
class CardNews:
    folder_name: str
    title: str
    slide2_text: str
    slide3_kicker: str
    slide3_summary: str
    slide3_body: str
    slide4_text: str
    image1: Path
    image2: Path
    image3: Path


CARD = CardNews(
    folder_name="Hormuz Reopens, but Oil Risks Remain",
    title="HORMUZ REOPENS,\nBUT OIL RISKS\nREMAIN",
    slide2_text="HORMUZ reopened after\na Lebanon cease-fire\neasied oil fears.",
    slide3_kicker="WHY PRICES FELL",
    slide3_summary="A cease-fire calmed traders, but the Iran blockade still clouds shipping.",
    slide3_body=(
        "BLOCKADE still matters because\n"
        "Washington has not said how hard it will police\n"
        "ships sailing from Iranian ports.\n"
        "Tanker owners welcomed the route reopening,\n"
        "but insurance, inspections and detention risk\n"
        "could raise freight costs again.\n"
        "The waterway is open for now,\n"
        "not fully risk-free."
    ),
    slide4_text=(
        "ENFORCEMENT is now the market trigger.\n"
        "If penalties tighten near Iranian cargoes,\n"
        "oil, LNG and tanker rates\n"
        "could rebound fast."
    ),
    image1=SOURCE_DIR / "image1.jpg",
    image2=SOURCE_DIR / "image2.jpg",
    image3=SOURCE_DIR / "image3b.jpg",
)


def font(name: str, size: float) -> ImageFont.FreeTypeFont:
    path = FONT_DIR / f"{name}.otf"
    return ImageFont.truetype(str(path), size=round(size))


def fit_cover(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    src_w, src_h = image.size
    dst_w, dst_h = size
    scale = max(dst_w / src_w, dst_h / src_h)
    new_size = (math.ceil(src_w * scale), math.ceil(src_h * scale))
    image = image.resize(new_size, Image.Resampling.LANCZOS)
    left = (image.width - dst_w) // 2
    top = (image.height - dst_h) // 2
    return image.crop((left, top, left + dst_w, top + dst_h))


def load_source_image(path: Path) -> Image.Image:
    return ImageOps.exif_transpose(Image.open(path).convert("RGB"))


def tune_background(image: Image.Image, brightness: float = 1.18, contrast: float = 1.04, color: float = 1.02) -> Image.Image:
    image = ImageEnhance.Brightness(image).enhance(brightness)
    image = ImageEnhance.Contrast(image).enhance(contrast)
    image = ImageEnhance.Color(image).enhance(color)
    return image


def add_dark_overlay(base: Image.Image, alpha: int) -> Image.Image:
    overlay = Image.new("RGBA", base.size, (0, 0, 0, alpha))
    return Image.alpha_composite(base.convert("RGBA"), overlay)


def draw_brand(canvas: Image.Image) -> None:
    draw = ImageDraw.Draw(canvas)
    brand_font = font("Pretendard-ExtraBold", 34)
    text = "BLUE STATE CLUB"
    bbox = draw.textbbox((0, 0), text, font=brand_font)
    x = (canvas.width - (bbox[2] - bbox[0])) / 2
    draw.text((x, 44), text, font=brand_font, fill=ImageColor.getrgb(BLUE))


def wrap_text(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        test = word if not current else f"{current} {word}"
        if draw.textbbox((0, 0), test, font=fnt)[2] <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def truncate_to_lines(draw: ImageDraw.ImageDraw, lines: list[str], fnt: ImageFont.FreeTypeFont, max_width: int, max_lines: int) -> list[str]:
    if len(lines) <= max_lines:
        return lines
    kept = lines[:max_lines]
    while kept[-1]:
        trial = kept[:-1] + [kept[-1].rstrip(" ,.;:!?") + "..."]
        if draw.textbbox((0, 0), trial[-1], font=fnt)[2] <= max_width:
            return trial
        kept[-1] = " ".join(kept[-1].split()[:-1])
    return kept


def draw_centered_multiline(
    canvas: Image.Image,
    box: tuple[int, int, int, int],
    text: str,
    fnt: ImageFont.FreeTypeFont,
    fill: str,
    line_gap: int,
) -> None:
    draw = ImageDraw.Draw(canvas)
    max_width = box[2] - box[0]
    paragraphs = text.split("\n")
    lines: list[str] = []
    for p in paragraphs:
        if p.strip():
            wrapped = wrap_text(draw, p, fnt, max_width)
            lines.extend(wrapped)
        else:
            lines.append("")
    lines = truncate_to_lines(draw, lines, fnt, max_width, 3)
    metrics = []
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=fnt)
        metrics.append((bbox[2] - bbox[0], bbox[3] - bbox[1]))
    total_h = sum(h for _, h in metrics) + line_gap * max(0, len(lines) - 1)
    y = box[1] + (box[3] - box[1] - total_h) / 2
    for line, (w, h) in zip(lines, metrics):
        x = box[0] + (box[2] - box[0] - w) / 2
        draw.text((x, y), line, font=fnt, fill=fill)
        y += h + line_gap


def draw_left_multiline(
    canvas: Image.Image,
    box: tuple[int, int, int, int],
    text: str,
    fnt: ImageFont.FreeTypeFont,
    fill: str,
    line_gap: int,
    first_word_red: bool = False,
) -> None:
    draw = ImageDraw.Draw(canvas)
    lines = text.split("\n")
    x, y = box[0], box[1]
    for idx, line in enumerate(lines):
        if first_word_red and idx == 0 and " " in line:
            first, rest = line.split(" ", 1)
            draw.text((x, y), first, font=fnt, fill=ImageColor.getrgb(RED))
            offset = draw.textbbox((0, 0), first + " ", font=fnt)[2]
            draw.text((x + offset, y), rest, font=fnt, fill=fill)
        elif first_word_red and idx == 0:
            draw.text((x, y), line, font=fnt, fill=ImageColor.getrgb(RED))
        else:
            draw.text((x, y), line, font=fnt, fill=fill)
        line_box = draw.textbbox((0, 0), line, font=fnt)
        y += (line_box[3] - line_box[1]) + line_gap


def extract_small_mark() -> Image.Image:
    source = Image.open(TEMPLATE_PREVIEW_DIR / "artboard_2.png").convert("RGBA")
    crop = source.crop((910, 1150, 1036, 1278))
    data = np.array(crop)
    rgb = data[:, :, :3]
    alpha = np.where(rgb.max(axis=2) < 25, 0, 255).astype(np.uint8)
    data[:, :, 3] = alpha
    return Image.fromarray(data, "RGBA")


def make_slide1(card: CardNews) -> Image.Image:
    bg = fit_cover(tune_background(load_source_image(card.image1), brightness=1.22, contrast=1.03), CANVAS)
    slide = apply_template_gradient_image(bg)
    draw_brand(slide)
    draw_centered_multiline(
        slide,
        (97, 905, 980, 1207),
        card.title,
        font("Pretendard-Black", 92),
        WHITE,
        18,
    )
    return slide


def make_slide2(card: CardNews, mark: Image.Image) -> Image.Image:
    bg = fit_cover(tune_background(load_source_image(card.image2), brightness=1.2, contrast=1.02), CANVAS)
    slide = apply_template_gradient_image(bg)
    draw_brand(slide)
    draw_left_multiline(
        slide,
        (53, 1038, 854, 1207),
        card.slide2_text.upper(),
        font("Pretendard-SemiBold", 50),
        ImageColor.getrgb(WHITE),
        16,
        first_word_red=True,
    )
    slide.alpha_composite(mark, (900, 1145))
    return slide


def make_slide3(card: CardNews, mark: Image.Image) -> Image.Image:
    bg = fit_cover(tune_background(load_source_image(card.image1), brightness=1.2, contrast=1.03), CANVAS)
    slide = add_dark_overlay(bg, SLIDE3_DARK_OVERLAY_ALPHA)
    draw_brand(slide)
    draw = ImageDraw.Draw(slide)
    draw.text((120, 240), card.slide3_kicker, font=font("Pretendard-Black", 86), fill=ImageColor.getrgb(WHITE))

    summary_box = (120, 344, 840, 430)
    summary_font = font("Pretendard-Medium", 48)
    summary_lines = wrap_text(draw, card.slide3_summary, summary_font, summary_box[2] - summary_box[0])
    draw_left_multiline(
        slide,
        summary_box,
        "\n".join(summary_lines[:2]),
        summary_font,
        ImageColor.getrgb(WHITE),
        10,
    )
    draw_left_multiline(
        slide,
        (120, 535, 925, 1002),
        card.slide3_body,
        font("Pretendard-SemiBold", 37),
        ImageColor.getrgb(WHITE),
        16,
        first_word_red=True,
    )
    slide.alpha_composite(mark, (920, 1145))
    return slide


def make_slide4(card: CardNews, mark: Image.Image) -> Image.Image:
    bg = fit_cover(tune_background(load_source_image(card.image3), brightness=1.25, contrast=1.02), CANVAS)
    slide = add_dark_overlay(bg, SLIDE4_DARK_OVERLAY_ALPHA)
    draw_brand(slide)
    draw_left_multiline(
        slide,
        (73, 216, 842, 384),
        card.slide4_text,
        font("Pretendard-SemiBold", 48),
        ImageColor.getrgb(WHITE),
        14,
        first_word_red=True,
    )
    slide.alpha_composite(mark, (900, 1145))
    return slide


def make_slide5() -> Image.Image:
    return Image.open(TEMPLATE_PREVIEW_DIR / "artboard_5.png").convert("RGBA")


def sanitize_folder_name(name: str) -> str:
    return re.sub(r'[<>:"/\\\\|?*]', "", name).strip().rstrip(".")


def main() -> None:
    mark = extract_small_mark().resize((118, 118), Image.Resampling.LANCZOS)
    out_dir = OUTPUT_ROOT / sanitize_folder_name(CARD.folder_name)
    out_dir.mkdir(parents=True, exist_ok=True)

    slides = [
        make_slide1(CARD),
        make_slide2(CARD, mark),
        make_slide3(CARD, mark),
        make_slide4(CARD, mark),
        make_slide5(),
    ]

    for idx, slide in enumerate(slides, start=1):
        out_path = out_dir / f"{idx:02d}.png"
        slide.save(out_path)
        print(out_path)


if __name__ == "__main__":
    main()
