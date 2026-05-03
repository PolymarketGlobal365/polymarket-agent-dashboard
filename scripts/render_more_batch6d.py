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
FINAL_ASSET_ROOT = Path(r"C:\Users\jyjy6\Documents\New project\temp\bsc_final_assets")
EVEN_MORE_ROOT = Path(r"C:\Users\jyjy6\Documents\New project\temp\bsc_even_more_assets")
MORE_ROOT = Path(r"C:\Users\jyjy6\Documents\New project\temp\bsc_more_assets")
LAST_ROOT = Path(r"C:\Users\jyjy6\Documents\New project\temp\bsc_last_assets")


STORIES = [
    (
        CardNews(
            folder_name="Immigration Frustration Reshapes US Politics",
            title="IMMIGRATION\nANGER RESHAPES\nUS POLITICS",
            slide2_text="Frustration over\nimmigration helped\nreorder politics.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="When voters call a system broken, the political response can redefine a whole election cycle.",
            slide3_body=(
                "FRUSTRATION over\n"
                "immigration has become one of the\n"
                "most powerful forces in US politics.\n"
                "The Times noted that broad concern\n"
                "helped return Trump to power.\n"
                "Once an issue feels broken,\n"
                "voters often reward the candidate\n"
                "who promises the sharpest response."
            ),
            slide4_text=(
                "POLITICS follows pressure.\n"
                "When immigration dominates the mood,\n"
                "it can reorder priorities far beyond\n"
                "the border itself."
            ),
            image1=FINAL_ASSET_ROOT / "border_fence.jpg",
            image2=FINAL_ASSET_ROOT / "border_fence.jpg",
            image3=FINAL_ASSET_ROOT / "border_fence.jpg",
        ),
        """Immigration Frustration Reshapes US Politics

Frustration over immigration became one of the strongest forces in recent American politics.
As more voters concluded the system was broken, the issue moved closer to the center of elections.
That anger helped shape the political conditions that returned Donald Trump to power.
Immigration debates now reach far beyond policy details and into broader questions of order and identity.
Once voters decide a system has failed, they often reward the loudest promise of change.

In politics, a problem seen as broken can quickly become the issue that breaks the map.

#Immigration
#USPolitics
#Border
#Election
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Salton Sea Lithium Rush Draws Bigger Stakes",
            title="SALTON SEA\nLITHIUM RUSH\nRAISES STAKES",
            slide2_text="California sees a\nbattery future under\nthe Salton Sea.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="The metal beneath the lake could reshape the battery supply chain if extraction can actually scale.",
            slide3_body=(
                "LITHIUM has become\n"
                "one of the most strategic materials\n"
                "in the energy transition.\n"
                "California leaders see the Salton Sea\n"
                "as a possible domestic treasure.\n"
                "But the promise only matters\n"
                "if companies can extract it cheaply,\n"
                "cleanly and at industrial scale."
            ),
            slide4_text=(
                "BATTERY politics are local too.\n"
                "A big domestic lithium source\n"
                "could shift supply chains and\n"
                "strategic leverage."
            ),
            image1=FINAL_ASSET_ROOT / "salton_sea.jpg",
            image2=FINAL_ASSET_ROOT / "parking_structure.jpg",
            image3=FINAL_ASSET_ROOT / "salton_sea.jpg",
        ),
        """Salton Sea Lithium Rush Draws Bigger Stakes

California sees enormous lithium potential beneath the Salton Sea.
The metal is crucial for batteries, electric vehicles and the broader energy transition.
Supporters say a successful extraction boom could strengthen domestic supply chains.
But turning geological promise into industrial output remains technically and politically difficult.
The Salton Sea story is really about whether strategic minerals can be scaled at home.

The next battery boom may depend as much on extraction as on invention.

#Lithium
#Batteries
#California
#EnergyTransition
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Coachella's Parties Rival the Music",
            title="COACHELLA'S\nPARTIES RIVAL\nTHE MUSIC",
            slide2_text="At Coachella,\nthe social scene is\npart of the draw.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="Festivals are no longer just concerts; they are status stages, brand ecosystems and social media fuel.",
            slide3_body=(
                "PARTIES now shape\n"
                "the festival experience almost as much\n"
                "as the main lineup.\n"
                "The Times reported that invite-only events\n"
                "have become part of Coachella's appeal.\n"
                "That turns the weekend into\n"
                "a layered economy of music,\n"
                "influence and exclusivity."
            ),
            slide4_text=(
                "FESTIVALS sell more than songs.\n"
                "The bigger the side scene becomes,\n"
                "the more the event works as\n"
                "a social platform."
            ),
            image1=LAST_ROOT / "smartphone_concert.jpg",
            image2=EVEN_MORE_ROOT / "music_mic.jpg",
            image3=EVEN_MORE_ROOT / "music_mic2.jpg",
        ),
        """Coachella's Parties Rival the Music

Coachella is increasingly about the social scene as much as the performances.
Private parties and branded events now compete with the official lineup for attention.
That shift turns the festival into a wider marketplace of influence and exclusivity.
Music still matters, but social status and access have become part of the product.
The festival works not just as a concert, but as a platform for visibility.

At modern festivals, the side party can be as important as the headliner.

#Coachella
#MusicFestival
#Culture
#SocialMedia
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Hoi An Shows Why Travelers Keep Returning",
            title="HOI AN KEEPS\nWINNING OVER\nTRAVELERS",
            slide2_text="Hoi An blends old\narchitecture with\nfresh cultural life.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="Great travel destinations endure by mixing preserved history with living, changing culture.",
            slide3_body=(
                "HOI AN stands out\n"
                "because it feels curated by history\n"
                "without feeling frozen by it.\n"
                "The town offers old buildings,\n"
                "craft traditions, tea ceremonies and\n"
                "modern dining in one compact setting.\n"
                "That mix helps explain why\n"
                "travelers keep returning to it."
            ),
            slide4_text=(
                "TRAVEL lasts through texture.\n"
                "Places that preserve atmosphere while\n"
                "staying alive in the present\n"
                "tend to endure."
            ),
            image1=FINAL_ASSET_ROOT / "hoi_an.jpg",
            image2=FINAL_ASSET_ROOT / "hoi_an.jpg",
            image3=FINAL_ASSET_ROOT / "hoi_an.jpg",
        ),
        """Hoi An Shows Why Travelers Keep Returning

Hoi An keeps drawing travelers because it balances history with lived-in energy.
The town offers preserved architecture, traditional crafts and modern dining all at once.
That combination makes it feel both timeless and active rather than frozen in the past.
The appeal lies in texture: tea ceremonies, old streets and contemporary touches working together.
Destinations like this last because they remain beautiful without becoming static.

The best travel places feel preserved without ever feeling paused.

#HoiAn
#Vietnam
#Travel
#Culture
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Cancer in Younger Adults Keeps Rising",
            title="CANCER IN\nYOUNGER ADULTS\nKEEPS RISING",
            slide2_text="Doctors are trying\nto explain why more\nyounger adults are affected.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="A disease once linked mostly to aging is now forcing researchers to ask new questions earlier in life.",
            slide3_body=(
                "INCIDENCE matters because\n"
                "cancer under 50 changes how doctors,\n"
                "patients and systems think about risk.\n"
                "Researchers are studying why\n"
                "some cancers are appearing more often\n"
                "in younger adults.\n"
                "The answers could reshape screening,\n"
                "prevention and long-term care."
            ),
            slide4_text=(
                "EARLIER illness changes the stakes.\n"
                "When cancer arrives younger,\n"
                "it disrupts more years of work,\n"
                "family and planning."
            ),
            image1=FINAL_ASSET_ROOT / "pink_ribbon.jpg",
            image2=MORE_ROOT / "rfk_vaccine2.jpg",
            image3=MORE_ROOT / "rfk_vaccine1.jpg",
        ),
        """Cancer in Younger Adults Keeps Rising

Cancer is becoming more common in adults under 50, pushing researchers to search for answers.
The trend is especially striking because cancer has long been treated as a disease of aging.
If more people are getting sick earlier, prevention and screening may need to change too.
The rise also affects families, careers and long-term health planning in different ways.
Scientists are now trying to understand what has shifted in the environment, behavior or biology.

When a disease arrives earlier, the question changes from treatment alone to timing itself.

#Cancer
#Health
#Research
#Medicine
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Affordable Cars Are Disappearing",
            title="AFFORDABLE CARS\nARE QUICKLY\nDISAPPEARING",
            slide2_text="Buying a cheaper\nnew car is getting\nmuch harder.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="When entry-level cars vanish, mobility becomes more expensive for the people who need it most.",
            slide3_body=(
                "PRICES matter because\n"
                "cars are not just products;\n"
                "they are access to work and daily life.\n"
                "The Times noted that the average\n"
                "new-car price now hovers near $50,000.\n"
                "That leaves fewer realistic options\n"
                "for buyers who once relied\n"
                "on affordable entry-level models."
            ),
            slide4_text=(
                "MOBILITY is getting pricier.\n"
                "As low-cost cars fade,\n"
                "the burden falls hardest on\n"
                "middle- and lower-income buyers."
            ),
            image1=FINAL_ASSET_ROOT / "car_for_sale.jpg",
            image2=FINAL_ASSET_ROOT / "parking_structure.jpg",
            image3=MORE_ROOT / "ev_charge1.jpg",
        ),
        """Affordable Cars Are Disappearing

New cars in the United States are getting harder to buy at the low end of the market.
The average transaction price is now so high that many entry-level buyers are squeezed out.
That matters because a car is often a requirement for work, errands and family logistics.
As cheap new options disappear, more people are pushed toward debt or older used vehicles.
The affordability problem is becoming a broader mobility problem.

When the cheap car disappears, transportation starts behaving more like a luxury.

#Cars
#Affordability
#AutoMarket
#Consumers
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
