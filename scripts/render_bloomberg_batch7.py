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
ASSET_ROOT = Path(r"C:\Users\jyjy6\Documents\New project\temp\bsc_batch_assets")
NVIDIA_ASSET_ROOT = Path(r"C:\Users\jyjy6\Documents\New project\temp\bsc_nvidia_story")


STORIES = [
    (
        CardNews(
            folder_name="DeepSeek Pivots to Agentic AI",
            title="DEEPSEEK PIVOTS\nTO AGENTIC\nAI",
            slide2_text="DeepSeek job ads\nsignal a move toward\nagent-style systems.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="Hiring clues can reveal where a fast-moving AI lab is placing its next big bet.",
            slide3_body=(
                "HIRING now points to\n"
                "tools that can plan, decide and act\n"
                "with less human prompting.\n"
                "That suggests DeepSeek is pushing\n"
                "past model launches alone and into\n"
                "agent-style product development.\n"
                "If the pivot sticks, competition in AI\n"
                "could shift from chatbots to execution."
            ),
            slide4_text=(
                "STRATEGY shifts matter fast.\n"
                "A hiring pivot can preview where\n"
                "capital, compute and talent\n"
                "are heading next."
            ),
            image1=ASSET_ROOT / "stockexchange.jpg",
            image2=NVIDIA_ASSET_ROOT / "datacenter_racks.jpg",
            image3=NVIDIA_ASSET_ROOT / "nvidia_tesla.jpg",
        ),
        """DeepSeek Pivots to Agentic AI

DeepSeek's latest job postings suggest the company is leaning harder into agentic AI.
That means building systems that can plan, decide and act with less user prompting.
Hiring signals often reveal product direction before a company makes it official.
The shift could intensify competition as labs race beyond chatbots into autonomous tools.
It also shows how the AI battle is moving from models alone to full execution stacks.

The next AI fight may be less about answers and more about action.

#DeepSeek
#AgenticAI
#ArtificialIntelligence
#TechStrategy
#Bloomberg
""",
    ),
    (
        CardNews(
            folder_name="Big Banks Turn to AI Misconduct Monitors",
            title="BIG BANKS TURN\nTO AI MISCONDUCT\nMONITORS",
            slide2_text="Major banks want AI\nto flag risky trader\nbehavior faster.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="Compliance is becoming a data-and-surveillance arms race inside global finance.",
            slide3_body=(
                "SURVEILLANCE teams are\n"
                "using AI to scan more chats,\n"
                "signals and patterns at once.\n"
                "The goal is to catch misconduct\n"
                "earlier and reduce human blind spots.\n"
                "But better monitoring also raises\n"
                "questions about accuracy, governance\n"
                "and how firms handle false alarms."
            ),
            slide4_text=(
                "COMPLIANCE is scaling up.\n"
                "Banks see AI as a way to review\n"
                "more behavior without adding\n"
                "friction to every trade."
            ),
            image1=ASSET_ROOT / "wall_street.jpg",
            image2=ASSET_ROOT / "stockexchange.jpg",
            image3=ASSET_ROOT / "wall_street.jpg",
        ),
        """Big Banks Turn to AI Misconduct Monitors

Big banks are turning to AI tools to spot possible trader misconduct faster.
The technology can scan large volumes of messages and market behavior at scale.
Firms hope that broader surveillance will catch problems before they spread.
At the same time, heavier AI monitoring raises concerns about errors and oversight.
The shift shows how compliance is becoming a bigger technology battleground in finance.

Wall Street is using AI not just to trade faster, but to watch itself harder.

#Banking
#ArtificialIntelligence
#Compliance
#WallStreet
#FinanceNews
""",
    ),
    (
        CardNews(
            folder_name="Nvidia Funds Thinking Machines Lab",
            title="NVIDIA FUNDS\nMURATI'S AI\nSTARTUP",
            slide2_text="Nvidia will fund\nMurati's startup and\nsupply Vera Rubin chips.",
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
            image1=NVIDIA_ASSET_ROOT / "nvidia_sign.jpg",
            image2=NVIDIA_ASSET_ROOT / "nvidia_tesla.jpg",
            image3=NVIDIA_ASSET_ROOT / "datacenter_racks.jpg",
        ),
        """Nvidia Funds Thinking Machines Lab

Nvidia is investing in Mira Murati's Thinking Machines Lab and supplying AI chips.
The deal links financing with long-term access to high-end computing power.
Bloomberg reported the startup is set to receive at least 1 gigawatt of compute.
That scale could help it train and run frontier AI models much faster.
The partnership also shows how Nvidia is deepening its hold across the AI stack.

Nvidia is no longer just selling the picks and shovels — it is backing the miners too.

#Nvidia
#ArtificialIntelligence
#AIChips
#ThinkingMachines
#TechNews
""",
    ),
    (
        CardNews(
            folder_name="2026 IPO Watchlist: Space, AI, Crypto",
            title="2026 IPOS:\nSPACE, AI,\nCRYPTO",
            slide2_text="Space, AI and crypto\nnames are leading the\nnext IPO watchlist.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="The pipeline says investors still want growth stories — but only at the right price.",
            slide3_body=(
                "PIPELINES matter because\n"
                "new listings test what risk appetite\n"
                "really looks like in public markets.\n"
                "Space, AI and crypto candidates\n"
                "offer excitement, but valuation discipline\n"
                "is still likely to decide who prices well.\n"
                "A stronger IPO tape could also signal\n"
                "broader confidence in growth assets."
            ),
            slide4_text=(
                "SENTIMENT is on trial.\n"
                "If these names price well,\n"
                "more late-stage companies may\n"
                "rush toward market debuts."
            ),
            image1=ASSET_ROOT / "rocket.jpg",
            image2=ASSET_ROOT / "stockexchange.jpg",
            image3=ASSET_ROOT / "wall_street.jpg",
        ),
        """2026 IPO Watchlist: Space, AI, Crypto

Bloomberg's IPO watchlist shows space, AI and crypto names leading investor attention.
These sectors still attract money because they promise high growth and big narratives.
But strong stories alone may not be enough in a more valuation-sensitive market.
How these deals price and trade could shape confidence for the broader IPO pipeline.
A successful run would encourage more companies to test the public market window.

The next IPO cycle will be driven by story stocks, but judged by hard pricing.

#IPO
#ArtificialIntelligence
#Crypto
#SpaceTech
#Markets
""",
    ),
    (
        CardNews(
            folder_name="Trump's Greenland Push Rattles NATO",
            title="TRUMP'S\nGREENLAND PUSH\nRATTLES NATO",
            slide2_text="Greenland pressure\ncould strain Europe\nand NATO unity.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="Arctic strategy is becoming a bigger alliance issue, not just a headline dispute.",
            slide3_body=(
                "GREENLAND sits at\n"
                "the intersection of security, shipping,\n"
                "resources and Arctic influence.\n"
                "That means aggressive rhetoric can\n"
                "do more than unsettle diplomats.\n"
                "It can also test allied trust,\n"
                "force public positioning and complicate\n"
                "NATO coordination in Europe."
            ),
            slide4_text=(
                "ARCTIC politics are rising.\n"
                "Pressure over Greenland could turn\n"
                "symbolic rhetoric into a real test\n"
                "for allied cohesion."
            ),
            image1=ASSET_ROOT / "greenland_coast.jpg",
            image2=ASSET_ROOT / "capitol.jpg",
            image3=ASSET_ROOT / "greenland_coast.jpg",
        ),
        """Trump's Greenland Push Rattles NATO

Trump's renewed Greenland logic is creating fresh unease across Europe and NATO.
The issue matters because Greenland sits in a strategic part of the Arctic.
Questions around sovereignty and pressure tactics can strain allied trust quickly.
That makes the dispute bigger than a political headline or a symbolic argument.
It is also a reminder that Arctic security is becoming more central to NATO thinking.

What sounds like rhetoric can still reshape alliance politics.

#Greenland
#NATO
#Europe
#Arctic
#Geopolitics
""",
    ),
    (
        CardNews(
            folder_name="Venezuela Turmoil Jolts Oil Markets",
            title="VENEZUELA\nTURMOIL JOLTS\nOIL MARKETS",
            slide2_text="Venezuela turmoil\nis shaking harder-to-\nreplace oil flows.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="Oil shocks do not hit every barrel equally, and niche supply disruptions can ripple fast.",
            slide3_body=(
                "SUPPLY chains for\n"
                "specific grades of crude are harder\n"
                "to replace than headline volumes suggest.\n"
                "That is why turmoil in Venezuela\n"
                "can jolt the market's outlands,\n"
                "especially for refiners built around\n"
                "certain feedstocks and flows.\n"
                "Politics can move margins as fast as prices."
            ),
            slide4_text=(
                "FRAGMENTED supply matters.\n"
                "When niche barrels get disrupted,\n"
                "the pressure can spread through\n"
                "refining and shipping routes."
            ),
            image1=ASSET_ROOT / "venezuela_flag.png",
            image2=ASSET_ROOT / "stockexchange.jpg",
            image3=ASSET_ROOT / "venezuela_flag.png",
        ),
        """Venezuela Turmoil Jolts Oil Markets

Turmoil in Venezuela is sending a shock through harder-to-replace parts of the oil market.
Not every crude stream can be swapped easily when politics disrupt supply.
That creates pressure for refiners and traders tied to specific grades and routes.
The impact can show up in margins and logistics before it fully hits headline prices.
It is another reminder that oil markets are shaped by geography as much as volume.

The toughest supply shock is often the one that looks small on paper.

#Venezuela
#OilMarket
#Energy
#Refining
#Bloomberg
""",
    ),
    (
        CardNews(
            folder_name="Wall Street's Hot 2026 AI Trades",
            title="WALL STREET'S\nHOT 2026\nAI TRADES",
            slide2_text="AI dispersion and\ntech tails are shaping\nWall Street's 2026 bets.",
            slide3_kicker="WHY IT MATTERS",
            slide3_summary="Investors are moving from one big AI story toward a more selective, uneven market.",
            slide3_body=(
                "DISPERSION trades gain\n"
                "when winners and laggards separate\n"
                "more sharply inside one theme.\n"
                "That is a sign the market is\n"
                "getting more nuanced about AI,\n"
                "not less interested in it.\n"
                "The trade is shifting from broad hype\n"
                "to stock-picking and risk control."
            ),
            slide4_text=(
                "SELECTIVITY is back.\n"
                "Wall Street still wants AI exposure,\n"
                "but investors are becoming choosier\n"
                "about where it pays off."
            ),
            image1=ASSET_ROOT / "wall_street.jpg",
            image2=ASSET_ROOT / "stockexchange.jpg",
            image3=ASSET_ROOT / "wall_street.jpg",
        ),
        """Wall Street's Hot 2026 AI Trades

Bloomberg's 2026 trade list shows Wall Street still leaning into AI themes.
But the market is becoming more selective about who wins and who falls behind.
That is why dispersion and other targeted strategies are gaining traction.
Investors want exposure to AI, but they also want protection from crowding risk.
The shift suggests markets are moving from broad enthusiasm to sharper stock-picking.

The AI trade is maturing from a wave into a sorting machine.

#WallStreet
#AITrade
#Markets
#Investing
#TechStocks
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
