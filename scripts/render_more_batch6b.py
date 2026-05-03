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
ASSET_ROOT = Path(r"C:\Users\jyjy6\Documents\New project\temp\bsc_even_more_assets")
PREV_ROOT = Path(r"C:\Users\jyjy6\Documents\New project\temp\bsc_batch_assets")
PREV2_ROOT = Path(r"C:\Users\jyjy6\Documents\New project\temp\bsc_nvidia_story")


STORIES = [
    (
        CardNews(
            folder_name="Blackstone Boosts Anthropic Bet",
            title="BLACKSTONE\nBOOSTS ITS\nANTHROPIC BET",
            slide2_text="Blackstone is\nraising its Anthropic\nstake toward $1B.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="Big money is still pouring into frontier AI, even as valuations climb to eye-watering levels.",
            slide3_body=(
                "CAPITAL keeps chasing\n"
                "the biggest AI labs because investors\n"
                "still see outsized upside.\n"
                "Bloomberg reported Blackstone's stake\n"
                "could reach roughly $1 billion\n"
                "as Anthropic's valuation climbs.\n"
                "That reinforces how the AI race\n"
                "is also becoming a private-markets arms race."
            ),
            slide4_text=(
                "VALUATIONS are stretching higher.\n"
                "If capital keeps flooding frontier labs,\n"
                "AI could stay the market's most\n"
                "crowded growth story."
            ),
            image1=PREV_ROOT / "stockexchange.jpg",
            image2=PREV_ROOT / "wall_street.jpg",
            image3=PREV_ROOT / "capitol.jpg",
        ),
        """Blackstone Boosts Anthropic Bet

Blackstone is increasing its Anthropic investment as the AI startup's valuation climbs higher.
Bloomberg reported the firm's stake could rise to roughly $1 billion.
The move shows that private capital still sees frontier AI as a huge long-term opportunity.
It also highlights how fast money keeps concentrating around a few leading model makers.
As valuations surge, AI is looking more and more like a private-market bidding war.

The AI race is not just about models anymore — it is also about who can fund them longest.

#Anthropic
#Blackstone
#ArtificialIntelligence
#PrivateMarkets
#Bloomberg
""",
    ),
    (
        CardNews(
            folder_name="China Leads OpenClaw AI Rush",
            title="CHINA LEADS\nTHE OPENCLAW\nAI RUSH",
            slide2_text="Chinese labs are\nracing to build more\nagentic AI tools.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="The frenzy suggests China may be moving faster from model-building toward AI systems that actually act.",
            slide3_body=(
                "OPENCLAW adoption shows\n"
                "how quickly Chinese labs are turning\n"
                "toward agentic AI frameworks.\n"
                "That means more focus on systems\n"
                "that plan, execute and use tools.\n"
                "If the stampede continues,\n"
                "China could become one of the biggest\n"
                "real-world testing grounds for AI agents."
            ),
            slide4_text=(
                "SCALE changes the race.\n"
                "A wider OpenClaw push could speed up\n"
                "how fast Chinese AI labs turn research\n"
                "into deployed products."
            ),
            image1=PREV2_ROOT / "nvidia_tesla.jpg",
            image2=PREV2_ROOT / "nvidia_sign.jpg",
            image3=PREV2_ROOT / "datacenter_racks.jpg",
        ),
        """China Leads OpenClaw AI Rush

Bloomberg highlighted how Chinese labs are embracing OpenClaw-style agentic AI at speed.
The shift points to a race beyond chatbots and toward systems that can actually act.
That matters because China has the scale to test and deploy these tools quickly.
The more labs join the push, the faster agentic AI could move into real products.
It also suggests the next AI competition may center on execution, not just models.

The country that scales AI agents fastest could shape the next stage of the industry.

#ChinaAI
#AgenticAI
#OpenClaw
#ArtificialIntelligence
#Bloomberg
""",
    ),
    (
        CardNews(
            folder_name="Trump's Giant Arch Plan Backfires",
            title="TRUMP'S GIANT\nARCH PLAN\nBACKFIRES",
            slide2_text="A much larger arch\nplan is alienating\nearly supporters.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="A monument fight can quickly become a proxy battle over symbolism, history and presidential ego.",
            slide3_body=(
                "SCALE matters because\n"
                "the plan would reportedly dwarf\n"
                "earlier concepts for the project.\n"
                "Critics say a 250-foot structure\n"
                "would clash with Arlington's setting\n"
                "and turn tribute into self-mythology.\n"
                "What began as a monument push\n"
                "is now a cultural and political backlash."
            ),
            slide4_text=(
                "SYMBOLISM cuts both ways.\n"
                "The bigger the structure becomes,\n"
                "the easier it is for critics to frame it\n"
                "as vanity instead of tribute."
            ),
            image1=ASSET_ROOT / "washington_arch.jpg",
            image2=ASSET_ROOT / "arc_de_triomphe.jpg",
            image3=ASSET_ROOT / "arlington_cemetery.jpg",
        ),
        """Trump's Giant Arch Plan Backfires

Trump's push for a giant arch in Washington is drawing backlash from early supporters and experts.
Critics say the enlarged design would overshadow nearby Arlington National Cemetery.
What was pitched as a monument is now being debated as a symbol of self-glorification.
The controversy shows how architecture can become a political and cultural battleground.
In Washington, size often changes the meaning of the message.

The bigger the monument gets, the harder it becomes to separate tribute from ego.

#Washington
#Architecture
#Politics
#Monuments
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Young Men Grow More Religious",
            title="YOUNG MEN\nGROW MORE\nRELIGIOUS",
            slide2_text="A new poll shows\nfaith rising among\nmen under 30.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="The shift is widening a striking gender gap in religion among young American adults.",
            slide3_body=(
                "GALLUP found a\n"
                "sharp jump in young men saying\n"
                "religion is very important.\n"
                "At the same time,\n"
                "religion is falling in importance\n"
                "for young women.\n"
                "That creates a surprising reversal\n"
                "of a longtime pattern in US surveys."
            ),
            slide4_text=(
                "THE gender gap is widening.\n"
                "Faith now appears to be moving\n"
                "in opposite directions for many\n"
                "young men and women."
            ),
            image1=ASSET_ROOT / "religion_church.jpg",
            image2=ASSET_ROOT / "religion_church2.jpg",
            image3=ASSET_ROOT / "washington_monument.jpg",
        ),
        """Young Men Grow More Religious

A new Gallup poll found a sharp rise in young American men who say religion is very important.
The trend is notable because the same survey found importance declining among young women.
That widening gap breaks with decades of polling patterns in the United States.
The change suggests religion may be taking on a different cultural role for younger men.
It is also a reminder that social shifts rarely move in one direction for everyone.

One of the clearest changes in belief may actually be a change in who is moving.

#Religion
#Gallup
#YoungMen
#Society
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="Baby Keem Turns Casino Into Origin Story",
            title="BABY KEEM TURNS\nCASINO INTO AN\nORIGIN STORY",
            slide2_text="His new album turns\nchildhood smoke and\nmemory into art.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="The album shows how autobiographical rap can keep evolving without losing rawness.",
            slide3_body=(
                "CASINO works because\n"
                "it ties personal memory to a sharper,\n"
                "more deliberate storytelling style.\n"
                "Baby Keem turns hardship,\n"
                "smoke and family tension into\n"
                "something both cinematic and intimate.\n"
                "The project feels like a reminder\n"
                "that origin stories can still surprise."
            ),
            slide4_text=(
                "STORYTELLING still cuts through.\n"
                "In a fragmented music world,\n"
                "a vivid personal narrative can make\n"
                "an album feel larger than the rollout."
            ),
            image1=ASSET_ROOT / "vegas_night.jpg",
            image2=ASSET_ROOT / "music_mic.jpg",
            image3=ASSET_ROOT / "music_mic2.jpg",
        ),
        """Baby Keem Turns Casino Into Origin Story

Baby Keem's latest album, 'Casino,' turns childhood memories into a sharper origin story.
The record draws on smoke-filled rooms, family tension and the feeling of growing up boxed in.
It also blends more traditional storytelling with the impulsive energy of modern rap.
That mix helps the album feel both personal and stylistically current.
The result is a project that treats autobiography as performance without losing intimacy.

When an artist gets specific enough, memory can start to sound cinematic.

#BabyKeem
#Casino
#Music
#HipHop
#NYTimes
""",
    ),
    (
        CardNews(
            folder_name="D4vd Arrest Sends Shock Through Music Case",
            title="D4VD ARREST\nSHAKES A MUSIC\nCASE",
            slide2_text="Authorities arrested\nthe musician in a\ndeath investigation.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="The case is now moving from a disturbing discovery into a more serious legal phase.",
            slide3_body=(
                "ARRESTS shift a case\n"
                "from speculation toward prosecution,\n"
                "but they do not settle guilt.\n"
                "Police said D4vd was being held\n"
                "after remains found in a car tied\n"
                "to him were identified as a teenager.\n"
                "The case now turns on what evidence\n"
                "investigators can present in court."
            ),
            slide4_text=(
                "LEGAL pressure is escalating.\n"
                "Once a case reaches this stage,\n"
                "public attention often moves from rumor\n"
                "to evidence and procedure."
            ),
            image1=ASSET_ROOT / "crime_police.jpg",
            image2=ASSET_ROOT / "music_mic2.jpg",
            image3=ASSET_ROOT / "arlington_amphitheater.jpg",
        ),
        """D4vd Arrest Sends Shock Through Music Case

Authorities arrested the musician D4vd in connection with a teenage death investigation.
Police said the case will now move toward prosecutors as evidence is reviewed.
The arrest followed an earlier discovery of human remains in a car tied to him.
At this stage, the case enters a more formal legal process but does not determine guilt.
Public attention is now likely to focus on what investigators can actually prove.

An arrest changes the stakes, but the case still turns on evidence.

#D4vd
#MusicNews
#Crime
#Investigation
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
