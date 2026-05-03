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
ASSET_ROOT = Path(r"C:\Users\jyjy6\Documents\New project\temp\bsc_last_assets")
MORE_ASSET_ROOT = Path(r"C:\Users\jyjy6\Documents\New project\temp\bsc_even_more_assets")
OLDER_ASSET_ROOT = Path(r"C:\Users\jyjy6\Documents\New project\temp\bsc_more_assets")


STORIES = [
    (
        CardNews(
            folder_name="Bagel Makers Find a Way to Scale",
            title="BAGEL MAKERS\nFIND A WAY\nTO SCALE",
            slide2_text="New tech is helping\nbagel shops grow\nwithout losing craft.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="A product once seen as too finicky to scale is becoming a new business and social media success story.",
            slide3_body=(
                "TECHNOLOGY is helping\n"
                "bakeries manage consistency, coffee sales\n"
                "and customer data better.\n"
                "That matters because bagels were long\n"
                "seen as hard to scale profitably.\n"
                "Now better equipment and viral demand\n"
                "are changing what growth can look like\n"
                "for a once stubborn niche."
            ),
            slide4_text=(
                "SCALE is getting tastier.\n"
                "When operations improve,\n"
                "even a famously fussy product can\n"
                "turn into a growth business."
            ),
            image1=ASSET_ROOT / "bagel.jpg",
            image2=ASSET_ROOT / "bagel.jpg",
            image3=ASSET_ROOT / "bagel.jpg",
        ),
        """Bagel Makers Find a Way to Scale

Bagels have long been viewed as hard to scale because the craft is finicky and margins are thin.
New bakery tools, coffee technology and social media demand are helping change that equation.
Shops can now reach more customers while keeping a more consistent product.
That makes the bagel business look less like a stubborn niche and more like a modern growth idea.
Even old-school foods can become scalable when the economics finally improve.

Sometimes the biggest business shift is making a difficult ritual repeatable.

#Bagels
#FoodBusiness
#Baking
#SmallBusiness
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Democrats Get Louder Online",
            title="DEMOCRATS GET\nLOUDER\nONLINE",
            slide2_text="The F-word is\nshowing up more in\nDemocratic posts.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="Political language on social media is becoming rougher, more emotional and more performative.",
            slide3_body=(
                "LANGUAGE matters because\n"
                "swearing can signal anger, identity\n"
                "and authenticity all at once.\n"
                "The Times found Democrats were\n"
                "far more likely than Republicans\n"
                "to embrace the F-word in recent posts.\n"
                "That suggests online politics is shifting\n"
                "toward sharper, more viral expression."
            ),
            slide4_text=(
                "TONE has become strategy.\n"
                "In a crowded feed,\n"
                "politicians often speak rougher\n"
                "to sound more real."
            ),
            image1=ASSET_ROOT / "foldable_phones.jpg",
            image2=ASSET_ROOT / "smartphone_concert.jpg",
            image3=MORE_ASSET_ROOT / "washington_monument.jpg",
        ),
        """Democrats Get Louder Online

The New York Times found Democrats are increasingly using the F-word in social media posts.
That shift suggests online political language is growing rougher and more emotionally charged.
Swearing can work as a signal of anger, authenticity or tribal identity.
In digital politics, tone now helps messages travel as much as policy does.
The result is a style of communication built more for impact than restraint.

Online politics is sounding less like a speech and more like a feed.

#Politics
#SocialMedia
#Democrats
#Communication
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="US Navy Blockade Pressures Iranian Ports",
            title="NAVY BLOCKADE\nPRESSURES\nIRANIAN PORTS",
            slide2_text="The U.S. blockade\nappeared to keep\nships from moving.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="A blockade can move markets, diplomacy and military risk all at once.",
            slide3_body=(
                "BLOCKADES matter because\n"
                "they disrupt shipping before prices\n"
                "fully adjust to the shock.\n"
                "The Times reported Iranian-linked ships\n"
                "appeared unable to leave the region.\n"
                "That raises pressure on trade flows,\n"
                "peace talks and the risk of broader escalation\n"
                "across the Gulf."
            ),
            slide4_text=(
                "PRESSURE builds quickly.\n"
                "When ships stop moving,\n"
                "the effects reach markets,\n"
                "negotiations and security at once."
            ),
            image1=OLDER_ASSET_ROOT / "lebanon_unifil.jpg",
            image2=OLDER_ASSET_ROOT / "lebanon_river.jpg",
            image3=OLDER_ASSET_ROOT / "lebanon_unifil.jpg",
        ),
        """US Navy Blockade Pressures Iranian Ports

The U.S. Navy blockade on Iranian ports appeared to hold, with few visible ship movements.
That kind of disruption can hit shipping flows before oil prices fully reflect the risk.
It also adds fresh tension to diplomacy and wider regional security calculations.
Blockades are powerful because they turn geography into an immediate source of leverage.
When ships stay still, markets and negotiations both feel the pressure.

A blockade can freeze trade and force politics to move faster.

#Iran
#Blockade
#Shipping
#Geopolitics
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Live Nation Verdict Shakes Ticketing",
            title="LIVE NATION\nVERDICT SHAKES\nTICKETING",
            slide2_text="A jury found the\nconcert giant acted\nas a monopoly.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="The ruling could reshape how live entertainment is sold, bundled and controlled.",
            slide3_body=(
                "MONOPOLY findings matter\n"
                "because they can open the door\n"
                "to major remedies or breakups.\n"
                "The verdict against Live Nation\n"
                "puts one of music's biggest gatekeepers\n"
                "under a harsher spotlight.\n"
                "If the outcome sticks,\n"
                "artists, venues and fans could all feel the changes."
            ),
            slide4_text=(
                "TICKETING is now on trial.\n"
                "A monopoly verdict can do more than punish.\n"
                "It can force a whole industry to rethink\n"
                "who controls access."
            ),
            image1=MORE_ASSET_ROOT / "music_mic2.jpg",
            image2=ASSET_ROOT / "smartphone_concert.jpg",
            image3=MORE_ASSET_ROOT / "music_mic.jpg",
        ),
        """Live Nation Verdict Shakes Ticketing

A federal jury found that Live Nation operated as a monopoly in violation of antitrust law.
The decision could have sweeping consequences for the ticketing and live-events business.
Live Nation's scale has long made it one of the industry's most powerful gatekeepers.
If the verdict stands, regulators and courts could push for structural changes.
Artists, venues and fans may all feel the impact of a more open market.

When a gatekeeper loses in court, the whole business model starts to wobble.

#LiveNation
#Ticketmaster
#Antitrust
#MusicBusiness
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Picasso Raffle Offers Cheap Shot at a Masterpiece",
            title="PICASSO RAFFLE\nOFFERS A CHEAP\nSHOT AT ART",
            slide2_text="A Paris man tried\nto win a Picasso\nfor the price of luck.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="The story shows how iconic art still fuels fantasies of access, luck and sudden status.",
            slide3_body=(
                "LOTTERIES matter because\n"
                "they collapse elite aspiration into\n"
                "a ticket almost anyone can buy.\n"
                "A chance to win a Picasso\n"
                "turns a masterpiece into a mass-market dream.\n"
                "That says something about art's power,\n"
                "its price and the strange ways\n"
                "people imagine entering that world."
            ),
            slide4_text=(
                "ACCESS sells the dream.\n"
                "A raffle makes fine art feel closer,\n"
                "even when the odds still protect\n"
                "its aura and rarity."
            ),
            image1=ASSET_ROOT / "art_gallery_ontario.jpg",
            image2=ASSET_ROOT / "bookshelf.jpg",
            image3=ASSET_ROOT / "art_gallery_ontario.jpg",
        ),
        """Picasso Raffle Offers a Cheap Shot at Art

A Paris man tried to win a Picasso through a raffle instead of a high-end auction.
The appeal is obvious: a tiny entry price for a chance at a masterpiece.
Stories like this reveal how art still holds huge symbolic and financial power.
They also show how lotteries can make elite worlds feel briefly accessible.
Even when the odds are slim, the dream of entry is often enough to sell the ticket.

Luxury becomes even more irresistible when it is packaged as a chance.

#Picasso
#Art
#Raffle
#Culture
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Hausa Romance Novels Keep Thriving in Nigeria",
            title="HAUSA ROMANCE\nNOVELS THRIVE\nIN NIGERIA",
            slide2_text="A women's novel boom\nkeeps growing in\nnorthern Nigeria.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="The books reveal how women build cultural influence even inside tighter social systems.",
            slide3_body=(
                "ROMANCE fiction can\n"
                "carry more than fantasy.\n"
                "It can also move ideas, identity\n"
                "and debate through everyday reading.\n"
                "In northern Nigeria,\n"
                "Hausa novels have created a durable\n"
                "industry written by and for women,\n"
                "despite social and legal constraints."
            ),
            slide4_text=(
                "POPULAR stories have power.\n"
                "Even under pressure,\n"
                "a reading culture can open space\n"
                "for voice and imagination."
            ),
            image1=ASSET_ROOT / "bookshelf.jpg",
            image2=ASSET_ROOT / "bookshelf.jpg",
            image3=MORE_ASSET_ROOT / "religion_church2.jpg",
        ),
        """Hausa Romance Novels Keep Thriving in Nigeria

Northern Nigeria remains home to a major industry of romance novels written in Hausa.
The books are created largely by and for women in a region shaped by overlapping legal systems.
Their popularity shows how literature can carve out influence inside tighter cultural boundaries.
The genre is not just entertainment but also a form of expression and community.
Its persistence highlights how reading cultures can thrive under pressure.

Fiction often becomes most important where everyday speech is more restricted.

#Nigeria
#Books
#RomanceNovels
#Culture
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
