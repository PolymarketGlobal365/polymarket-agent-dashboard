from __future__ import annotations

from pathlib import Path

from generate_bluestateclub_cardnews import (
    CardNews,
    extract_small_mark,
    make_slide1,
    make_slide2,
    make_slide3,
    make_slide4,
    make_slide5,
    sanitize_folder_name,
)


OUTPUT_ROOT = Path(r"F:\bluestateclub")
SOURCE_DIR = Path(r"C:\Users\jyjy6\Documents\New project\temp\bsc_nvidia_story")


CARD = CardNews(
    folder_name="Nvidia to Invest in Thinking Machines Lab and Supply AI Chips",
    title="NVIDIA FUNDS\nMURATI'S AI\nSTARTUP",
    slide2_text="NVIDIA will fund\nMurati's startup and\nsupply Vera Rubin chips.",
    slide3_kicker="WHY IT MATTERS",
    slide3_summary="The deal ties capital, compute and talent together in the race for frontier AI.",
    slide3_body=(
        "VERA Rubin systems give\n"
        "Thinking Machines a multiyear path to\n"
        "train and run frontier models at scale.\n"
        "Bloomberg said the startup will get\n"
        "at least 1 gigawatt of compute,\n"
        "roughly enough for 750,000 homes.\n"
        "That makes Nvidia both a backer\n"
        "and a core infrastructure supplier."
    ),
    slide4_text=(
        "PARTNERSHIP locks in AI demand.\n"
        "Funding the startup and selling chips\n"
        "keeps future compute orders\n"
        "inside Nvidia's orbit."
    ),
    image1=SOURCE_DIR / "nvidia_sign.jpg",
    image2=SOURCE_DIR / "nvidia_tesla.jpg",
    image3=SOURCE_DIR / "datacenter_racks.jpg",
)


TXT_CONTENT = """Nvidia to Invest in Thinking Machines Lab and Supply AI Chips

Nvidia is making a significant new investment in Mira Murati's Thinking Machines Lab.
The startup will also use Nvidia's Vera Rubin AI accelerators under a multiyear deal.
Bloomberg reported the systems will deliver at least 1 gigawatt of computing power.
That scale could help Thinking Machines train and run frontier AI models faster.
The partnership also shows how Nvidia is deepening its role across the AI stack.

Nvidia is not just selling chips now — it is helping shape who builds the next wave of AI.

#Nvidia
#ArtificialIntelligence
#AIChips
#ThinkingMachines
#TechNews
"""


def main() -> None:
    out_dir = OUTPUT_ROOT / sanitize_folder_name(CARD.folder_name)
    out_dir.mkdir(parents=True, exist_ok=True)

    mark = extract_small_mark().resize((118, 118))
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

    txt_path = out_dir / f"{CARD.folder_name}.txt"
    txt_path.write_text(TXT_CONTENT, encoding="utf-8")
    print(txt_path)


if __name__ == "__main__":
    main()
