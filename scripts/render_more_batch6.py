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
ASSET_ROOT = Path(r"C:\Users\jyjy6\Documents\New project\temp\bsc_more_assets")
PREV_ASSET_ROOT = Path(r"C:\Users\jyjy6\Documents\New project\temp\bsc_batch_assets")


STORIES = [
    (
        CardNews(
            folder_name="Lebanon Families Return Under Cease-Fire",
            title="LEBANON FAMILIES\nRETURN UNDER\nCEASE-FIRE",
            slide2_text="Thousands began\nheading home as\na truce took hold.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="The pause offers relief, but displaced residents still face danger, damage and uncertainty.",
            slide3_body=(
                "RETURNS have begun\n"
                "even as Israeli troops still occupy\n"
                "parts of southern Lebanon.\n"
                "Bombed bridges over the Litani River\n"
                "have forced traffic onto dirt crossings.\n"
                "Families are going back with hope,\n"
                "but the pause remains fragile\n"
                "and the damage is widespread."
            ),
            slide4_text=(
                "UNCERTAINTY still hangs over homecoming.\n"
                "A cease-fire can slow the violence,\n"
                "but it cannot quickly rebuild\n"
                "roads, homes or trust."
            ),
            image1=ASSET_ROOT / "lebanon_river.jpg",
            image2=ASSET_ROOT / "lebanon_unifil.jpg",
            image3=ASSET_ROOT / "lebanon_unifil.jpg",
        ),
        """Lebanon Families Return Under Cease-Fire

Thousands of families in Lebanon began returning home as a 10-day cease-fire took effect.
The latest fighting displaced more than a million people, mostly in the south.
Israeli forces remain in parts of southern Lebanon, adding to the uncertainty.
Bombed bridges over the Litani River have forced traffic through makeshift crossings.
For many residents, the return home is a relief shaped by damage and fear.

Going home can mark the end of flight without bringing the end of risk.

#Lebanon
#Ceasefire
#MiddleEast
#Displacement
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Homesteading Boom Reaches Rural America",
            title="HOMESTEADING\nBOOM REACHES\nRURAL AMERICA",
            slide2_text="More Americans\nare turning back\nto self-reliance.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="The movement reflects anxiety about modern life as much as affection for country living.",
            slide3_body=(
                "PANDEMIC shocks helped\n"
                "push more people toward gardens,\n"
                "barns, livestock and home skills.\n"
                "Expo crowds in Oklahoma show\n"
                "how fast interest has grown.\n"
                "For many families, homesteading\n"
                "is part practicality, part identity\n"
                "and part escape from modern stress."
            ),
            slide4_text=(
                "SELF-RELIANCE is selling again.\n"
                "What looks nostalgic on the surface\n"
                "is also a reaction to disruption,\n"
                "shortages and cultural fatigue."
            ),
            image1=ASSET_ROOT / "homestead_barn.jpg",
            image2=ASSET_ROOT / "homestead_farm.jpg",
            image3=ASSET_ROOT / "homestead_barn2.jpg",
        ),
        """Homesteading Boom Reaches Rural America

Interest in homesteading is growing as more Americans look for self-reliance.
Events like the Okie Homesteading Expo are drawing larger crowds each year.
The pandemic helped push the movement by exposing people to shortages and instability.
For many followers, homesteading is a way to escape the pace of modern life.
The trend blends practical skills, identity and anxiety about the future.

What feels old-fashioned to some now looks like a hedge against modern uncertainty.

#Homesteading
#RuralAmerica
#SelfReliance
#Lifestyle
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Annie Judis Keeps Jumping at 82",
            title="ANNIE JUDIS\nKEEPS JUMPING\nAT 82",
            slide2_text="The oldest rope\nskipper says age\ndoes not set limits.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="Her popularity shows how older athletes are reshaping expectations about aging and strength.",
            slide3_body=(
                "PURPOSE can become\n"
                "a powerful training partner well\n"
                "into later life.\n"
                "Annie Judis uses competition\n"
                "and social media to challenge what\n"
                "people think aging looks like.\n"
                "Her message is simple:\n"
                "try first, then decide your limits."
            ),
            slide4_text=(
                "EXPECTATIONS are the real target.\n"
                "Her story resonates because\n"
                "it turns fitness into a public\n"
                "argument against decline."
            ),
            image1=ASSET_ROOT / "rope_track.jpg",
            image2=ASSET_ROOT / "rope_equipment.jpg",
            image3=ASSET_ROOT / "rope_run.jpg",
        ),
        """Annie Judis Keeps Jumping at 82

At 82, Annie Judis is still competing as the world's oldest rope skipper.
She says the sport has given her a renewed sense of purpose and joy.
By sharing her journey online, she is pushing back on narrow ideas about aging.
Her message is that many people discover new strength only after they try.
The story resonates because it turns movement into a challenge to expectation.

Aging looks different when effort keeps rewriting the script.

#HealthyAging
#Fitness
#JumpRope
#Wellness
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="RFK Jr. Faces Pressure on Vaccines",
            title="RFK JR. FACES\nPRESSURE ON\nVACCINES",
            slide2_text="Lawmakers pressed\nKennedy on vaccines\nand health fraud.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="His testimony showed how hard it is to walk back years of skepticism under official scrutiny.",
            slide3_body=(
                "HEARINGS forced\n"
                "Kennedy to defend his record on\n"
                "vaccines in sharper terms.\n"
                "He called the measles shot safe\n"
                "and effective for most people,\n"
                "a notable shift from past rhetoric.\n"
                "But lawmakers also challenged\n"
                "fraud oversight and public messaging."
            ),
            slide4_text=(
                "SCRUTINY changes the tone.\n"
                "Comments that played one way\n"
                "outside government sound different\n"
                "under oath on Capitol Hill."
            ),
            image1=ASSET_ROOT / "rfk_vaccine1.jpg",
            image2=ASSET_ROOT / "rfk_vaccine2.jpg",
            image3=ASSET_ROOT / "rfk_vaccine3.jpg",
        ),
        """RFK Jr. Faces Pressure on Vaccines

Lawmakers confronted Robert F. Kennedy Jr. on vaccines, fraud oversight and public health comments.
During the hearing, he described the measles vaccine as safe and effective for most people.
That language marked a notable shift from his long history of vaccine skepticism.
The exchange showed how official scrutiny can narrow the room for rhetorical ambiguity.
It also highlighted the political stakes around vaccine policy and public trust.

Once skepticism enters government, every word starts carrying policy weight.

#RFKJr
#Vaccines
#PublicHealth
#Politics
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="GLP-1 Use Spreads Beyond Weight Loss",
            title="GLP-1 USE\nSPREADS BEYOND\nWEIGHT LOSS",
            slide2_text="These drugs are\nbeing used for far\nmore than obesity.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="Popularity is moving faster than regulators and doctors can fully track or understand.",
            slide3_body=(
                "EXPERIMENTATION is\n"
                "expanding from weight loss into\n"
                "arthritis, addiction and migraines.\n"
                "That shows how fast patients\n"
                "and clinicians are testing the drugs.\n"
                "But broad off-label use also means\n"
                "evidence, monitoring and rules\n"
                "may struggle to keep pace."
            ),
            slide4_text=(
                "MOMENTUM is outrunning oversight.\n"
                "The wider the uses become,\n"
                "the more urgently medicine needs\n"
                "clearer evidence and guardrails."
            ),
            image1=ASSET_ROOT / "glp1_sensor.jpg",
            image2=ASSET_ROOT / "glp1_glucose.jpg",
            image3=ASSET_ROOT / "rfk_vaccine2.jpg",
        ),
        """GLP-1 Use Spreads Beyond Weight Loss

GLP-1 drugs are now being used for conditions far beyond obesity and diabetes.
People are testing them for issues ranging from arthritis to addiction to migraines.
That rapid expansion shows how quickly medical use can move ahead of formal guidance.
Experts warn that regulators and health systems may struggle to keep pace with the trend.
The bigger the experiment gets, the more important evidence and monitoring become.

When one drug becomes a cure-all candidate, oversight has to move faster too.

#GLP1
#Medicine
#HealthCare
#WeightLoss
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Tesla Loses EV Crown to BYD",
            title="TESLA LOSES\nEV CROWN\nTO BYD",
            slide2_text="BYD pulled ahead\nafter Tesla's second\nannual sales drop.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="The electric-vehicle race is broadening beyond one market leader and one dominant narrative.",
            slide3_body=(
                "COMPETITION is now\n"
                "hitting Tesla from both pricing\n"
                "pressure and scale.\n"
                "A second yearly drop in sales\n"
                "made room for BYD to move ahead.\n"
                "That shift matters because EV growth\n"
                "is no longer just a Tesla story,\n"
                "but a global market battle."
            ),
            slide4_text=(
                "LEADERSHIP can flip quickly.\n"
                "The EV market is expanding,\n"
                "but investors are learning that\n"
                "scale alone does not guarantee dominance."
            ),
            image1=ASSET_ROOT / "ev_charge2.jpg",
            image2=ASSET_ROOT / "ev_charge1.jpg",
            image3=PREV_ASSET_ROOT / "wall_street.jpg",
        ),
        """Tesla Loses EV Crown to BYD

Tesla lost the EV sales crown to BYD after a second straight annual drop in deliveries.
The shift shows how competitive the global electric-vehicle market has become.
Pricing pressure and scale are no longer working in Tesla's favor alone.
BYD's rise highlights how quickly leadership can change in a maturing sector.
For investors, the EV race is becoming a broader market contest, not a one-company bet.

The electric-car boom is still alive, but the old pecking order is not guaranteed.

#Tesla
#BYD
#ElectricVehicles
#AutoIndustry
#Bloomberg
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
