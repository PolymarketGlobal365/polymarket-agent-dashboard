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
ASSET_ROOT = Path(r"C:\Users\jyjy6\Documents\New project\temp\bsc_unique_assets")


STORIES = [
    (
        CardNews(
            folder_name="Rory McIlroy Wins Back-to-Back Masters",
            title="RORY WINS\nBACK-TO-BACK\nMASTERS",
            slide2_text="McIlroy claimed a\nsecond straight Masters\nwith history in sight.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="A repeat title at Augusta turns a major win into a legacy milestone.",
            slide3_body=(
                "AUGUSTA has long\n"
                "measured greatness by more than one\n"
                "good weekend.\n"
                "McIlroy's second straight Masters\n"
                "put him in rarer company\n"
                "and strengthened his place in history.\n"
                "Back-to-back titles do not just confirm form.\n"
                "They rewrite how a champion is remembered."
            ),
            slide4_text=(
                "LEGACY grows in layers.\n"
                "A repeat win does more than add a trophy.\n"
                "It changes how the whole era is viewed."
            ),
            image1=ASSET_ROOT / "golf.jpg",
            image2=ASSET_ROOT / "golf.jpg",
            image3=ASSET_ROOT / "golf.jpg",
        ),
        """Rory McIlroy Wins Back-to-Back Masters

Rory McIlroy won a second straight Masters and moved deeper into golf history.
Back-to-back titles at Augusta remain one of the sport’s rarest achievements.
The victory did more than confirm his form — it elevated his legacy.
In golf, repeat wins at the same major often become the marker of an era.
McIlroy’s latest Masters triumph now belongs in that kind of conversation.

A single green jacket is glory, but two in a row starts to look like history.

#RoryMcIlroy
#Masters
#Golf
#Sports
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Artemis II Crew Returns From Lunar Journey",
            title="ARTEMIS II CREW\nRETURNS FROM\nLUNAR JOURNEY",
            slide2_text="NASA's moon mission\ncrew splashed down\nafter 10 days.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="Every safe return helps turn long-range space ambition into something more tangible and public.",
            slide3_body=(
                "SPLASHDOWNS matter because\n"
                "they complete the story of exploration,\n"
                "not just its outward push.\n"
                "Artemis II's crew returned after\n"
                "a 10-day lunar journey that carried\n"
                "both technical and symbolic weight.\n"
                "A successful mission helps NASA\n"
                "make the moon feel closer again."
            ),
            slide4_text=(
                "RETURN is part of the triumph.\n"
                "Space ambition becomes real when\n"
                "a mission ends safely,\n"
                "not just boldly."
            ),
            image1=ASSET_ROOT / "splashdown.jpg",
            image2=ASSET_ROOT / "splashdown.jpg",
            image3=ASSET_ROOT / "splashdown.jpg",
        ),
        """Artemis II Crew Returns From Lunar Journey

The four astronauts of Artemis II returned safely after a 10-day lunar journey.
Their splashdown marked the completion of one of NASA’s most symbolic recent missions.
A safe return is critical because it turns daring exploration into repeatable confidence.
The mission also keeps public attention on the broader effort to push humans deeper into space again.
With each successful flight, the moon becomes less like myth and more like destination.

A moon mission inspires most when the crew comes home.

#NASA
#ArtemisII
#MoonMission
#Space
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Asha Bhosle's Voice Spanned Generations",
            title="ASHA BHOSLE'S\nVOICE SPANNED\nGENERATIONS",
            slide2_text="Her songs became a\nsoundtrack for decades\nof Indian life.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="A voice that lasts for generations becomes part of memory itself, not just music history.",
            slide3_body=(
                "RANGE made her\n"
                "more than a singer.\n"
                "It made her a constant presence.\n"
                "Asha Bhosle recorded across eras,\n"
                "styles and generations of listeners.\n"
                "That kind of longevity turns music\n"
                "into cultural memory,\n"
                "woven into everyday life and cinema."
            ),
            slide4_text=(
                "GREAT voices outlive their moment.\n"
                "When one singer spans generations,\n"
                "her work starts to sound like\n"
                "shared history."
            ),
            image1=ASSET_ROOT / "indian_music.jpg",
            image2=ASSET_ROOT / "indian_music.jpg",
            image3=ASSET_ROOT / "indian_music.jpg",
        ),
        """Asha Bhosle's Voice Spanned Generations

Asha Bhosle’s death closes a chapter in the history of Indian popular music.
Her extraordinary range and longevity made her one of the most recorded voices of her era.
For generations, her songs shaped the emotional backdrop of cinema and everyday life.
Artists like Bhosle do not just perform culture — they become part of how it is remembered.
The scale of her career turned music into a shared inheritance across age groups.

When a voice lasts that long, it stops belonging to one era alone.

#AshaBhosle
#Music
#India
#Culture
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Page Break Turns Reading Into a Retreat",
            title="PAGE BREAK TURNS\nREADING INTO A\nRETREAT",
            slide2_text="Strangers gather to\nread aloud and share\na short retreat.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="The idea reframes reading from a solitary habit into a temporary, communal ritual.",
            slide3_body=(
                "RETREATS work because\n"
                "they slow people down enough to make\n"
                "attention feel shared again.\n"
                "Page Break turns reading aloud\n"
                "into a social structure,\n"
                "not just a personal pastime.\n"
                "In a distracted age,\n"
                "that makes books feel less private\n"
                "and more communal."
            ),
            slide4_text=(
                "READING changes in company.\n"
                "A book can feel different\n"
                "when people inhabit it together,\n"
                "not alone."
            ),
            image1=ASSET_ROOT / "reading_person.jpg",
            image2=ASSET_ROOT / "reading_person.jpg",
            image3=ASSET_ROOT / "reading_person.jpg",
        ),
        """Page Break Turns Reading Into a Retreat

Page Break turns reading into a two-day retreat built around a shared book.
Instead of reading alone, strangers take turns narrating the story together.
The idea turns attention into something communal rather than private.
That matters in an age when deep focus often feels harder to sustain.
The retreat suggests that reading can still create connection as well as introspection.

Sometimes the best way to read deeply is to read with other people.

#Books
#Reading
#Retreat
#Culture
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Smartphone Fatigue Sparks a Quiet Rebellion",
            title="SMARTPHONE FATIGUE\nSPARKS A QUIET\nREBELLION",
            slide2_text="More people are\nquestioning what phones\nhave done to attention.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="The devices gave convenience and connection, but many people now feel the social cost more sharply.",
            slide3_body=(
                "SMARTPHONES changed\n"
                "how people work, socialize and fill\n"
                "the smallest empty moments.\n"
                "But the same device also helped\n"
                "shrink attention and deepen loneliness\n"
                "for many users.\n"
                "That is why a growing backlash\n"
                "now treats disconnection as relief,\n"
                "not deprivation."
            ),
            slide4_text=(
                "CONVENIENCE has a cost.\n"
                "The same tool that made life easier\n"
                "also made uninterrupted attention\n"
                "harder to keep."
            ),
            image1=ASSET_ROOT / "phone_hand.jpg",
            image2=ASSET_ROOT / "phone_hand.jpg",
            image3=ASSET_ROOT / "phone_hand.jpg",
        ),
        """Smartphone Fatigue Sparks a Quiet Rebellion

The smartphone transformed life by making convenience constant and attention portable.
But many people now feel the downside more sharply: distraction, loneliness and mental clutter.
That tension is fueling a small but growing backlash against always-on phone culture.
For some, stepping back now feels less like deprivation and more like recovery.
The question is no longer what phones made possible, but what they made harder to protect.

The quiet rebellion against phones starts with the wish to hear your own thoughts again.

#Smartphone
#Attention
#Technology
#Culture
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Lauren Sanchez Bezos Rejects the Old Rich Code",
            title="LAUREN SANCHEZ\nBEZOS REJECTS\nTHE OLD RICH CODE",
            slide2_text="A new elite style\nis less discreet and\nmore visible.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="The wealthy once relied on discretion, but a newer culture rewards display, branding and visibility.",
            slide3_body=(
                "AUSTERITY used to be\n"
                "part of the social contract for the\n"
                "ultra-rich in public life.\n"
                "The Times argues that Sánchez Bezos\n"
                "represents a different model,\n"
                "one built on spectacle and openness.\n"
                "That shift says something larger\n"
                "about how status is now performed."
            ),
            slide4_text=(
                "ELITE style is changing.\n"
                "Visibility itself has become\n"
                "a form of wealth,\n"
                "not a risk to hide from."
            ),
            image1=ASSET_ROOT / "jewelry_box.jpg",
            image2=ASSET_ROOT / "jewelry_box.jpg",
            image3=ASSET_ROOT / "jewelry_box.jpg",
        ),
        """Lauren Sanchez Bezos Rejects the Old Rich Code

Lauren Sánchez Bezos represents a style of wealth that is more public and less restrained.
For decades, the ultra-rich were expected to project austerity or remain discreet.
That older code is weakening as visibility itself becomes part of elite status.
The shift suggests that wealth is no longer only accumulated — it is also performed.
In this newer model, glamour and spectacle are not side effects but part of the message.

The richest signals now are often the ones designed to be seen.

#Wealth
#Culture
#Status
#Luxury
#NYTimes
""",
    ),
]


def render_story(card: CardNews, txt_content: str) -> None:
    out_dir = OUTPUT_ROOT / sanitize_folder_name(card.folder_name)
    out_dir.mkdir(parents=True, exist_ok=True)
    mark = extract_small_mark().resize((118, 118))

    slides = [
        make_slide1(card),
        make_slide2(card, mark),
        make_slide3(card, mark),
        make_slide4(card, mark),
        make_slide5(),
    ]
    for idx, slide in enumerate(slides, start=1):
        out_path = out_dir / f"{idx:02d}.png"
        slide.save(out_path)
        print(out_path)

    txt_path = out_dir / f"{sanitize_folder_name(card.folder_name)}.txt"
    txt_path.write_text(txt_content, encoding="utf-8")
    print(txt_path)


def main() -> None:
    for card, txt_content in STORIES:
        render_story(card, txt_content)


if __name__ == "__main__":
    main()
