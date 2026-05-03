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
ASSET_ROOT = Path(r"C:\Users\jyjy6\Documents\New project\temp\bsc_freshest_assets")


STORIES = [
    (
        CardNews(
            folder_name="Beef Returns With New Moral Chaos",
            title="BEEF RETURNS\nWITH NEW\nMORAL CHAOS",
            slide2_text="Season two trades\nroad rage for elite\ncountry-club tension.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="The show is back with a new cast, but it still runs on discomfort, status and emotional collapse.",
            slide3_body=(
                "SEASON two shifts\n"
                "the conflict from strangers on the road\n"
                "to couples at a country club.\n"
                "That keeps the series focused on\n"
                "class tension, resentment and ego.\n"
                "Oscar Isaac and Carey Mulligan\n"
                "step into a world where small frictions\n"
                "can still spiral into ruin."
            ),
            slide4_text=(
                "DISCOMFORT is still the engine.\n"
                "What changed is the setting,\n"
                "not the show's appetite for turning\n"
                "privilege into pressure."
            ),
            image1=ASSET_ROOT / "theatre_audience.jpg",
            image2=ASSET_ROOT / "auditorium_stage.jpg",
            image3=ASSET_ROOT / "auditorium_stage.jpg",
        ),
        """Beef Returns With New Moral Chaos

The second season of “Beef” returns with a fresh cast and a new social setting.
This time the conflict plays out among couples at an elite Southern California country club.
The series still thrives on pressure, resentment and the way small slights can metastasize.
Oscar Isaac and Carey Mulligan step into a world of ethically fraught choices and emotional collapse.
The setting changes, but the show’s obsession with discomfort stays intact.

“Beef” still works by turning tension into entertainment and status into instability.

#Beef
#Netflix
#TV
#OscarIsaac
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="JD Vance Heckled Over Middle East Wars",
            title="JD VANCE IS\nHECKLED OVER\nMIDEAST WARS",
            slide2_text="Young critics\ninterrupted Vance\nover war policy.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="The moment showed how sharply antiwar anger is surfacing inside parts of the right-leaning youth base.",
            slide3_body=(
                "HECKLING matters because\n"
                "it exposed a clear gap between official\n"
                "policy and younger frustration.\n"
                "At the Georgia event,\n"
                "critics shouted about children,\n"
                "war and genocide.\n"
                "Vance later acknowledged that many\n"
                "young voters dislike the current Middle East policy."
            ),
            slide4_text=(
                "YOUNG voters are restless.\n"
                "When antiwar anger breaks into\n"
                "a friendly event,\n"
                "it signals deeper strain."
            ),
            image1=ASSET_ROOT / "public_podium.png",
            image2=ASSET_ROOT / "speaker_protest.jpg",
            image3=ASSET_ROOT / "speaker_protest.jpg",
        ),
        """JD Vance Heckled Over Middle East Wars

JD Vance was heckled at a Turning Point USA event over U.S. policy in the Middle East.
The interruptions appeared to reflect anger over wars in Gaza and Iran.
What stood out was not just the protest itself, but where it happened and who voiced it.
Vance later acknowledged that many young voters are unhappy with current policy.
The clash suggests antiwar sentiment is creating visible strain inside parts of the conservative base.

When frustration breaks through the applause line, it usually means the tension was already there.

#JDVance
#MiddleEast
#Politics
#YouthVote
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Trump's Pope Attack Triggers Christian Backlash",
            title="TRUMP'S POPE\nATTACK SPARKS\nBACKLASH",
            slide2_text="An AI image and\nsocial post drew swift\nChristian criticism.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="Religious symbolism becomes especially explosive when political performance starts crossing sacred lines.",
            slide3_body=(
                "SYMBOLS matter because\n"
                "they can turn a political jab into\n"
                "a moral or spiritual offense.\n"
                "Trump's attack on Pope Leo XIV\n"
                "and the AI-generated Jesus image\n"
                "set off criticism across ideological lines.\n"
                "The episode showed how quickly\n"
                "religion can sharpen political conflict."
            ),
            slide4_text=(
                "RELIGIOUS imagery is volatile.\n"
                "Once politics borrows sacred symbols,\n"
                "the backlash can outrun\n"
                "the original message."
            ),
            image1=ASSET_ROOT / "vatican1.jpg",
            image2=ASSET_ROOT / "vatican2.jpg",
            image3=ASSET_ROOT / "vatican2.jpg",
        ),
        """Trump's Pope Attack Triggers Christian Backlash

Trump drew criticism after attacking Pope Leo XIV and sharing an AI-generated Jesus image.
The response was swift because the episode crossed from politics into religious symbolism.
Even supporters who tolerate combative rhetoric can react differently when sacred imagery is involved.
The clash showed how easily political messaging can trigger broader moral outrage.
Once faith becomes the frame, the argument often gets bigger than the original post.

Sacred symbols can turn a political provocation into a cultural flashpoint.

#Trump
#Pope
#Religion
#Politics
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Hungary Reacts as Orban Era Ends",
            title="HUNGARY REACTS\nAS ORBAN'S ERA\nENDS",
            slide2_text="Peter Magyar's win\nsparked joy, shock\nand anxiety.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="The result was about more than one election — it tested a whole nationalist political era.",
            slide3_body=(
                "TURNOUT surged because\n"
                "voters saw the race as a referendum\n"
                "on Orban's long rule.\n"
                "The reactions were mixed:\n"
                "joy for some, disbelief for others\n"
                "and fear for those who backed Fidesz.\n"
                "The result also reverberated beyond Hungary\n"
                "as a signal about nationalist politics in Europe."
            ),
            slide4_text=(
                "ELECTIONS can reset narratives.\n"
                "When a dominant era ends,\n"
                "the shock travels beyond\n"
                "one country's borders."
            ),
            image1=ASSET_ROOT / "budapest1.jpg",
            image2=ASSET_ROOT / "budapest2.jpg",
            image3=ASSET_ROOT / "budapest2.jpg",
        ),
        """Hungary Reacts as Orban Era Ends

Hungarians reacted with joy, disbelief and disappointment after Peter Magyar defeated Viktor Orban’s camp.
The election was widely seen as a referendum on Orban’s long political era.
High turnout underscored how much was at stake for Hungary’s direction.
The result also mattered internationally because Orban had become a symbol for nationalist politics.
When a figure like that falls, the reaction reaches well beyond national borders.

The end of an era always changes more than the scoreboard.

#Hungary
#Orban
#Europe
#Election
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Daniel Radcliffe Makes Theater More Interactive",
            title="DANIEL RADCLIFFE\nMAKES THEATER\nMORE INTERACTIVE",
            slide2_text="Audience members\nbecome part of the\nshow every night.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="The production works because it turns participation into tenderness rather than gimmickry.",
            slide3_body=(
                "KINDNESS powers the\n"
                "show because audience participation\n"
                "only works when people feel safe.\n"
                "Radcliffe reportedly recruits volunteers\n"
                "before each performance,\n"
                "then builds the play around their presence.\n"
                "That makes the theater feel less distant\n"
                "and more alive to the room."
            ),
            slide4_text=(
                "PARTICIPATION changes the stage.\n"
                "When a play depends on the audience,\n"
                "the performance becomes\n"
                "a live act of trust."
            ),
            image1=ASSET_ROOT / "broadway_interior.jpg",
            image2=ASSET_ROOT / "stage_children.jpg",
            image3=ASSET_ROOT / "stage_children.jpg",
        ),
        """Daniel Radcliffe Makes Theater More Interactive

Daniel Radcliffe’s current play relies on audience members to help carry the performance.
That interactive setup changes the mood from passive viewing to shared participation.
The key, he says, is kindness rather than cleverness or speed.
When audience members feel invited rather than tested, the whole room changes.
The result is a performance that turns theater into a more open and intimate exchange.

The best interactive art works when participation feels generous, not risky.

#DanielRadcliffe
#Theater
#Broadway
#Culture
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Mexico World Cup Security Draws Backlash",
            title="MEXICO'S WORLD\nCUP SECURITY\nDRAWS BACKLASH",
            slide2_text="Families of the\nmissing say safety\npriorities are skewed.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="Mega-events can expose how governments prioritize global image over unresolved local grief.",
            slide3_body=(
                "SECURITY spending now\n"
                "faces criticism from families still\n"
                "searching for missing loved ones.\n"
                "They argue the World Cup focus\n"
                "protects teams and fans,\n"
                "but not their unfinished searches.\n"
                "That tension reveals how global spectacle\n"
                "can collide with unresolved trauma at home."
            ),
            slide4_text=(
                "IMAGE and grief are colliding.\n"
                "A safer tournament can still look\n"
                "morally lopsided when other wounds\n"
                "remain ignored."
            ),
            image1=ASSET_ROOT / "estadio_azteca.jpg",
            image2=ASSET_ROOT / "mexico_fans.jpg",
            image3=ASSET_ROOT / "mexico_fans.jpg",
        ),
        """Mexico World Cup Security Draws Backlash

Mexico’s heavy World Cup security investment is drawing criticism from families of the disappeared.
They argue the focus on fan safety ignores their own unresolved search for loved ones.
The dispute highlights how mega-events can redirect attention and public money.
That tension becomes sharper when the event is global and the grief is local.
Security can look impressive on paper while still leaving deeper wounds untouched.

A showcase event can make a country safer for visitors without making it feel fairer at home.

#Mexico
#WorldCup
#Security
#HumanRights
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
