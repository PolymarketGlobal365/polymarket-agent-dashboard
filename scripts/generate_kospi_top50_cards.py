from __future__ import annotations

import argparse
import json
import re
import time
import xml.etree.ElementTree as ET
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

import requests
from bs4 import BeautifulSoup
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_ROOT = ROOT / "output" / "kospi-top50-company-cards"
CACHE_ROOT = ROOT / "temp" / "kospi-top50-company-cards-cache"
ASSET_CACHE_ROOT = CACHE_ROOT / "assets"
PORTRAIT_ROOT = ROOT / "assets" / "company-faces"
TEMPLATE_IMAGE_PATH = ROOT / "assets" / "templates" / "kospi-card-template.png"

NAVER_TOP50_URL = "https://finance.naver.com/sise/sise_market_sum.naver?sosok=0&page=1"
FN_GUIDE_XML_URL = "https://comp.fnguide.com/SVO2/xml/Snapshot_all/{code}.xml"
DART_SEARCH_URL = "https://englishdart.fss.or.kr/dsbb001/search.ax"
DART_MAIN_URL = "https://englishdart.fss.or.kr/dsbh001/main.do"
DART_VIEWER_URL = "https://englishdart.fss.or.kr/report/eng/viewer.do"
YAHOO_CHART_URL = "https://query1.finance.yahoo.com/v8/finance/chart/{ticker}"
COMMONS_API_URL = "https://commons.wikimedia.org/w/api.php"

FONT_REGULAR = "C:/Windows/Fonts/malgun.ttf"
FONT_BOLD = "C:/Windows/Fonts/malgunbd.ttf"

CANVAS_W = 1080
CANVAS_H = 1350

SESSION = requests.Session()
SESSION.headers.update(
    {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0 Safari/537.36"
        ),
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    }
)

LOGO_TITLE_OVERRIDES = {
    "005930": "File:Samsung Electronics logo (english).svg",
    "005935": "File:Samsung Electronics logo (english).svg",
    "000660": "File:SK Hynix.svg",
    "035420": "File:Naver Logotype.svg",
    "017670": "File:SK Telecom wordmark.svg",
    "011200": "File:HMM Logo Basic Form.svg",
    "006400": "File:Samsung SDI wordmark.svg",
    "006405": "File:Samsung SDI wordmark.svg",
    "005380": "File:Hyundai Motor Company logo.svg",
    "000270": "File:Kia logo.svg",
    "000810": "File:Samsung Fire & Marine Insurance logo.svg",
    "032830": "File:Samsung Life Insurance logo.svg",
    "068270": "File:Celltrion logo.svg",
    "010120": "File:LS Electric logo.svg",
    "051910": "File:LG Chem logo.svg",
    "066570": "File:LG Electronics logo.svg",
    "096770": "File:SK Innovation logo.svg",
    "267250": "File:HD Hyundai logo.svg",
    "267260": "File:HD Hyundai Electric logo.svg",
    "329180": "File:HD Hyundai Heavy Industries logo.svg",
    "009540": "File:HD Korea Shipbuilding & Offshore Engineering logo.svg",
    "028260": "File:Samsung C&T logo.svg",
}


@dataclass
class TopRankEntry:
    rank: int
    code: str
    name_ko: str
    naver_price: str
    market_cap_eok: int


@dataclass
class AnnualReportRef:
    fiscal_year: int
    filed_date: str
    report_name: str
    company_eng_name: str
    rcp_no: str


@dataclass
class ExecutiveInfo:
    name: str
    age: int | None
    birth: str
    position: str
    responsibilities: str
    major_career: str
    period_of_employment: str
    term_expiration_date: str


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate KOSPI top-50 card-news images.")
    parser.add_argument("--limit", type=int, default=50)
    parser.add_argument("--sleep", type=float, default=0.12)
    parser.add_argument("--output-dir", default="")
    args = parser.parse_args()

    output_dir = Path(args.output_dir) if args.output_dir else OUTPUT_ROOT / datetime.now().strftime("%Y-%m-%d")
    output_dir.mkdir(parents=True, exist_ok=True)
    CACHE_ROOT.mkdir(parents=True, exist_ok=True)
    ASSET_CACHE_ROOT.mkdir(parents=True, exist_ok=True)

    items = fetch_top50_kospi()[: args.limit]
    results: list[dict[str, Any]] = []
    for entry in items:
        try:
            print(f"[{entry.rank:02d}/{args.limit:02d}] rendering {entry.name_ko} ({entry.code})")
            card = build_company_card_data(entry, throttle=args.sleep)
            render_card(card, output_dir)
            results.append(card)
            print(f"  saved {card['output_path']}")
        except Exception as exc:  # noqa: BLE001
            failure = {
                "rank": entry.rank,
                "code": entry.code,
                "name_ko": entry.name_ko,
                "error": str(exc),
            }
            results.append(failure)
            print(f"  failed: {exc}")

    metadata_path = output_dir / "top50-metadata.json"
    metadata_path.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"metadata saved to {metadata_path}")


def http_get(url: str, *, params: dict[str, Any] | None = None, timeout: int = 30) -> requests.Response:
    last_error: Exception | None = None
    for attempt in range(3):
        try:
            response = SESSION.get(url, params=params, timeout=timeout)
            response.raise_for_status()
            return response
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            time.sleep(0.5 * (attempt + 1))
    raise RuntimeError(str(last_error))


def http_post(url: str, *, data: dict[str, Any], timeout: int = 30) -> requests.Response:
    last_error: Exception | None = None
    for attempt in range(3):
        try:
            response = SESSION.post(url, data=data, timeout=timeout)
            response.raise_for_status()
            return response
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            time.sleep(0.5 * (attempt + 1))
    raise RuntimeError(str(last_error))


def build_company_card_data(entry: TopRankEntry, throttle: float) -> dict[str, Any]:
    reports = fetch_company_annual_reports(entry.code, throttle)
    current_report = pick_report_by_fiscal_year(reports, 2025) or (max(reports, key=lambda item: item.fiscal_year) if reports else None)

    employee_current: dict[str, Any] = {}
    remuneration_top: list[dict[str, Any]] = []
    executive: ExecutiveInfo | None = None
    salary_history: dict[str, str] = {}

    if current_report is not None:
        try:
            employee_current = parse_employee_section(current_report, throttle)
        except Exception:
            employee_current = {}
        try:
            remuneration_top = parse_remuneration_section(current_report, throttle)
        except Exception:
            remuneration_top = []
        try:
            executive = parse_executive_info(current_report, throttle)
        except Exception:
            executive = None

    for year in [2024, 2023, 2022, 2021]:
        report = pick_report_by_fiscal_year(reports, year)
        if report is None:
            continue
        try:
            history = parse_employee_section(report, throttle)
            avg = history.get("average_salary_million")
            if avg is not None:
                salary_history[str(year)] = format_avg_salary(avg)
        except Exception:
            continue

    snapshot = fetch_fnguide_snapshot(entry.code, throttle)
    english_name = (current_report.company_eng_name if current_report else "") or snapshot.get("english_name") or entry.name_ko
    chart_points = fetch_yahoo_chart(f"{entry.code}.KS", throttle)
    logo_path = resolve_logo_asset(entry.code, entry.name_ko, english_name, throttle)
    portrait_path = resolve_portrait_asset(entry.code)

    market_cap_eok = snapshot.get("market_cap_eok") or entry.market_cap_eok
    latest_price = snapshot.get("price_text") or entry.naver_price
    latest_price_date = snapshot.get("date_text") or datetime.now().strftime("%Y.%m.%d")
    footer_value = format_market_cap_big(market_cap_eok)

    output_file = f"{entry.rank:02d}-{safe_filename(entry.name_ko)}-{entry.code}.png"
    return {
        "rank": entry.rank,
        "code": entry.code,
        "ticker": f"{entry.code}.KS",
        "name_ko": entry.name_ko,
        "name_en": english_name,
        "source_line": (
            f"출처: 전자공시(DART) {current_report.filed_date} 사업보고서 · FnGuide {latest_price_date} · Yahoo Finance"
            if current_report
            else f"출처: Naver Finance · FnGuide {latest_price_date} · Yahoo Finance"
        ),
        "latest_price": latest_price,
        "latest_price_date": latest_price_date,
        "market_cap_eok": market_cap_eok,
        "market_cap_text": format_market_cap_from_eok(market_cap_eok),
        "footer_value": footer_value,
        "employee_total": employee_current.get("total_employees"),
        "employee_male": employee_current.get("male_employees"),
        "employee_female": employee_current.get("female_employees"),
        "average_salary_current": format_avg_salary(employee_current.get("average_salary_million")),
        "salary_history": salary_history,
        "remuneration_top": remuneration_top,
        "executive": asdict(executive) if executive else None,
        "chart_points": chart_points,
        "logo_path": str(logo_path) if logo_path else None,
        "portrait_path": str(portrait_path) if portrait_path else None,
        "output_filename": output_file,
        "output_path": str((OUTPUT_ROOT / datetime.now().strftime("%Y-%m-%d") / output_file).resolve()),
    }


def fetch_top50_kospi() -> list[TopRankEntry]:
    html = http_get(NAVER_TOP50_URL).text
    soup = BeautifulSoup(html, "html.parser")
    entries: list[TopRankEntry] = []
    for tr in soup.select("table.type_2 tr"):
        link = tr.select_one("a.tltle")
        if not link:
            continue
        href = link.get("href", "")
        match = re.search(r"code=(\d{6})", href)
        if not match:
            continue
        cells = [td.get_text(" ", strip=True) for td in tr.find_all("td")]
        if len(cells) < 7:
            continue
        entries.append(
            TopRankEntry(
                rank=int(clean_numeric(cells[0]) or "0"),
                code=match.group(1),
                name_ko=link.get_text(strip=True),
                naver_price=cells[2],
                market_cap_eok=int(clean_numeric(cells[6]) or "0"),
            )
        )
    if len(entries) < 50:
        raise RuntimeError(f"Expected 50 KOSPI rows, found {len(entries)}")
    return entries


def fetch_company_annual_reports(code: str, throttle: float) -> list[AnnualReportRef]:
    cache_path = CACHE_ROOT / f"reports-{code}.json"
    if cache_path.exists():
        return [AnnualReportRef(**item) for item in json.loads(cache_path.read_text(encoding="utf-8"))]

    reports: list[AnnualReportRef] = []
    for fiscal_year in [2025, 2024, 2023, 2022, 2021]:
        report = search_annual_report_for_fiscal_year(code, fiscal_year, fiscal_year + 1, throttle)
        if report is not None:
            reports.append(report)
    cache_path.write_text(json.dumps([asdict(item) for item in reports], ensure_ascii=False, indent=2), encoding="utf-8")
    return reports


def search_annual_report_for_fiscal_year(code: str, fiscal_year: int, filing_year: int, throttle: float) -> AnnualReportRef | None:
    for page in range(1, 4):
        html = http_post(
            DART_SEARCH_URL,
            data={
                "currentPage": str(page),
                "maxResults": "15",
                "maxLinks": "10",
                "sort": "date",
                "series": "desc",
                "textCrpNm": code,
                "textCrpCik": "",
                "startDate": f"{filing_year}0101",
                "endDate": f"{filing_year}0630",
            },
        ).text
        time.sleep(throttle)
        soup = BeautifulSoup(html, "html.parser")
        for tr in soup.select("table.tbList tbody tr"):
            cols = tr.find_all("td")
            if len(cols) < 5:
                continue
            company_anchor = cols[1].find("a")
            report_anchor = cols[2].find("a")
            if not company_anchor or not report_anchor:
                continue
            report_name = simplify_spaces(report_anchor.get_text(" ", strip=True))
            if not report_name.startswith("Annual Report"):
                continue
            if f"({fiscal_year}.12)" not in report_name:
                continue
            href = report_anchor.get("href", "")
            match = re.search(r"rcpNo=(\d+)", href)
            if not match:
                continue
            return AnnualReportRef(
                fiscal_year=fiscal_year,
                filed_date=cols[4].get_text(strip=True),
                report_name=report_name,
                company_eng_name=company_anchor.get_text(" ", strip=True),
                rcp_no=match.group(1),
            )
    return None


def pick_report_by_fiscal_year(reports: list[AnnualReportRef], fiscal_year: int) -> AnnualReportRef | None:
    for report in reports:
        if report.fiscal_year == fiscal_year:
            return report
    return None


def fetch_section_html(rcp_no: str, label: str, throttle: float) -> str:
    cache_path = CACHE_ROOT / f"{safe_filename(rcp_no)}-{safe_filename(label)}.html"
    if cache_path.exists():
        return cache_path.read_text(encoding="utf-8")

    main_html = http_get(DART_MAIN_URL, params={"rcpNo": rcp_no}).text
    time.sleep(throttle)
    meta = find_section_meta(main_html, label)
    if meta is None:
        raise RuntimeError(f"Section '{label}' not found for {rcp_no}")

    html = http_get(DART_VIEWER_URL, params=meta).text
    time.sleep(throttle)
    cache_path.write_text(html, encoding="utf-8")
    return html


def find_section_meta(main_html: str, label: str) -> dict[str, str] | None:
    pattern = re.compile(
        r"node\d+\['text'\] = \"([^\"]+)\";.*?"
        r"node\d+\['id'\] = \"(\d+)\";.*?"
        r"node\d+\['rcpNo'\] = \"(\d+)\";.*?"
        r"node\d+\['dcmNo'\] = \"(\d+)\";.*?"
        r"node\d+\['eleId'\] = \"(\d+)\";.*?"
        r"node\d+\['offset'\] = \"(\d+)\";.*?"
        r"node\d+\['length'\] = \"(\d+)\";.*?"
        r"node\d+\['dtd'\] = \"([^\"]+)\";",
        re.S,
    )
    normalized = label.lower()
    for match in pattern.finditer(main_html):
        toc_text = match.group(1).lower()
        if normalized in toc_text or section_label_matches(label, toc_text):
            return {
                "rcpNo": match.group(3),
                "dcmNo": match.group(4),
                "eleId": match.group(5),
                "offset": match.group(6),
                "length": match.group(7),
                "dtd": match.group(8),
            }
    return None


def section_label_matches(label: str, toc_text: str) -> bool:
    lowered = label.lower()
    if "status of executives and employees" in lowered:
        return "executive" in toc_text and "employee" in toc_text
    if "executive remuneration" in lowered:
        return "remuneration" in toc_text
    return False


def parse_employee_section(report: AnnualReportRef, throttle: float) -> dict[str, Any]:
    html = fetch_section_html(report.rcp_no, "Status of executives and employees", throttle)
    soup = BeautifulSoup(html, "html.parser")
    rows = find_table_rows(soup, ["Average salary per person", "Number of employees"])
    total_row = next(
        (
            row
            for row in reversed(rows)
            if row
            and row[0] in {"Total", "총계"}
            and len(row) >= 9
            and clean_numeric(row[1])
        ),
        None,
    )
    male_row = next(
        (row for row in rows if row and row[0] in {"Gender total", "성별합계"} and any(cell == "Male" for cell in row)),
        None,
    )
    female_row = next(
        (row for row in rows if row and row[0] in {"Gender total", "성별합계"} and any(cell == "Female" for cell in row)),
        None,
    )
    return {
        "total_employees": parse_employee_total_from_total_row(total_row),
        "male_employees": parse_employee_total_from_gender_row(male_row),
        "female_employees": parse_employee_total_from_gender_row(female_row),
        "average_salary_million": parse_average_salary_from_total_row(total_row),
    }


def parse_executive_info(report: AnnualReportRef, throttle: float) -> ExecutiveInfo | None:
    html = fetch_section_html(report.rcp_no, "Status of executives and employees", throttle)
    soup = BeautifulSoup(html, "html.parser")
    rows = find_table_rows(soup, ["Whether registered executive", "Responsibilities", "Major career"])
    candidates = []
    for row in rows:
        if len(row) < 12 or row[0] == "Name":
            continue
        if "Executive" not in row[4]:
            continue
        candidates.append(row)
    if not candidates:
        return None

    target = next(
        (row for row in candidates if "대표이사" in row[6] or "CEO" in row[6] or "chief executive" in row[6].lower()),
        candidates[0],
    )
    birth_year_match = re.search(r"(\d{4})", target[2])
    age = datetime.now().year - int(birth_year_match.group(1)) if birth_year_match else None
    return ExecutiveInfo(
        name=target[0],
        age=age,
        birth=target[2],
        position=target[3],
        responsibilities=simplify_spaces(target[6]),
        major_career=simplify_spaces(target[7]),
        period_of_employment=target[-2],
        term_expiration_date=target[-1],
    )


def parse_remuneration_section(report: AnnualReportRef, throttle: float) -> list[dict[str, Any]]:
    html = fetch_section_html(report.rcp_no, "Executive remuneration", throttle)
    soup = BeautifulSoup(html, "html.parser")
    rows = find_table_rows(soup, ["Total remuneration amount", "Name", "Position"])
    items: list[dict[str, Any]] = []
    for row in rows:
        if len(row) < 3 or row[0] == "Name":
            continue
        amount_million = int(clean_numeric(row[2]) or "0")
        if amount_million <= 0:
            continue
        items.append(
            {
                "name": row[0],
                "position": simplify_spaces(row[1]),
                "amount_eok": round(amount_million / 100, 1),
            }
        )
    return sorted(items, key=lambda item: item["amount_eok"], reverse=True)[:5]


def find_table_rows(soup: BeautifulSoup, required_texts: list[str]) -> list[list[str]]:
    for table in soup.find_all("table"):
        table_text = " ".join(table.stripped_strings)
        if not all(text in table_text for text in required_texts):
            continue
        rows: list[list[str]] = []
        for tr in table.find_all("tr"):
            cells = [simplify_spaces(cell.get_text(" ", strip=True)) for cell in tr.find_all(["th", "td"])]
            if cells:
                rows.append(cells)
        return rows
    return []


def fetch_fnguide_snapshot(code: str, throttle: float) -> dict[str, Any]:
    cache_path = CACHE_ROOT / f"fnguide-{code}.json"
    if cache_path.exists():
        return json.loads(cache_path.read_text(encoding="utf-8"))

    response = http_get(FN_GUIDE_XML_URL.format(code=code))
    time.sleep(throttle)
    xml_text = response.content.decode("euc-kr", errors="ignore")
    root = ET.fromstring(xml_text)

    def text_at(path: str) -> str:
        node = root.find(path)
        return node.text.strip() if node is not None and node.text else ""

    snapshot = {
        "date_text": text_at("./price/date").replace("/", "."),
        "price_text": text_at("./price/close_val"),
        "market_cap_eok": int(clean_numeric(text_at("./price/market_sum")) or "0"),
    }
    cache_path.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2), encoding="utf-8")
    return snapshot


def fetch_yahoo_chart(ticker: str, throttle: float) -> list[dict[str, Any]]:
    cache_path = CACHE_ROOT / f"chart-{safe_filename(ticker)}.json"
    if cache_path.exists():
        return json.loads(cache_path.read_text(encoding="utf-8"))

    response = http_get(YAHOO_CHART_URL.format(ticker=ticker), params={"interval": "1wk", "range": "5y"})
    time.sleep(throttle)
    payload = response.json()["chart"]["result"][0]
    timestamps = payload.get("timestamp", [])
    closes = payload["indicators"]["quote"][0].get("close", [])
    points = []
    for ts, close in zip(timestamps, closes):
        if close is None:
            continue
        points.append({"date": datetime.fromtimestamp(ts).strftime("%Y-%m-%d"), "close": float(close)})
    cache_path.write_text(json.dumps(points, ensure_ascii=False, indent=2), encoding="utf-8")
    return points


def resolve_portrait_asset(code: str) -> Path | None:
    for ext in [".png", ".webp", ".jpg", ".jpeg"]:
        candidate = PORTRAIT_ROOT / f"{code}{ext}"
        if candidate.exists():
            return candidate
    return None


def resolve_logo_asset(code: str, name_ko: str, name_en: str, throttle: float) -> Path | None:
    cache_path = ASSET_CACHE_ROOT / f"logo-{code}.png"
    if cache_path.exists():
        return cache_path

    titles = []
    override = LOGO_TITLE_OVERRIDES.get(code)
    if override:
        titles.append(override)

    base_variants = unique_preserve_order(
        [
            name_en,
            name_en.replace("&", "and"),
            name_en.replace(" Co., Ltd.", ""),
            name_en.replace(" Corporation", ""),
            name_en.replace(" Holdings", ""),
            name_en.replace(" Group", ""),
            name_en.replace(" Company", ""),
            name_ko,
        ]
    )
    for base in base_variants:
        clean = simplify_spaces(base)
        if not clean:
            continue
        titles.extend(
            [
                f"File:{clean} logo.svg",
                f"File:{clean} Logo.svg",
                f"File:{clean} logotype.svg",
                f"File:{clean}.svg",
                f"File:{clean} CI.svg",
                f"File:{clean} wordmark.svg",
            ]
        )

    for title in unique_preserve_order(titles):
        try:
            url = commons_title_to_thumb(title, throttle)
            if url:
                save_remote_image(url, cache_path)
                return cache_path
        except Exception:
            continue

    search_queries = unique_preserve_order(
        [
            f"{name_en} logo",
            f"{name_en} wordmark",
            f"{name_ko} logo",
            f"{name_ko} CI",
        ]
    )
    for query in search_queries:
        try:
            title = commons_search_best_title(query, throttle)
            if not title:
                continue
            url = commons_title_to_thumb(title, throttle)
            if not url:
                continue
            save_remote_image(url, cache_path)
            return cache_path
        except Exception:
            continue
    return None


def commons_search_best_title(query: str, throttle: float) -> str | None:
    response = http_get(
        COMMONS_API_URL,
        params={
            "action": "query",
            "list": "search",
            "format": "json",
            "srnamespace": "6",
            "srlimit": "8",
            "srsearch": query,
        },
    )
    time.sleep(throttle)
    items = response.json().get("query", {}).get("search", [])
    preferred = []
    fallback = []
    for item in items:
        title = item.get("title", "")
        lowered = title.lower()
        if "logo" in lowered or "logotype" in lowered or "wordmark" in lowered or "ci" in lowered:
            preferred.append(title)
        else:
            fallback.append(title)
    return (preferred or fallback or [None])[0]


def commons_title_to_thumb(title: str, throttle: float) -> str | None:
    response = http_get(
        COMMONS_API_URL,
        params={
            "action": "query",
            "titles": title,
            "prop": "imageinfo",
            "iiprop": "url",
            "iiurlwidth": "1200",
            "format": "json",
        },
    )
    time.sleep(throttle)
    pages = response.json().get("query", {}).get("pages", {})
    page = next(iter(pages.values()), {})
    info = (page.get("imageinfo") or [{}])[0]
    return info.get("thumburl") or info.get("url")


def save_remote_image(url: str, destination: Path) -> None:
    response = http_get(url)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(response.content)


def render_card(card: dict[str, Any], output_dir: Path) -> None:
    if TEMPLATE_IMAGE_PATH.exists():
        image = Image.open(TEMPLATE_IMAGE_PATH).convert("RGBA").resize((CANVAS_W, CANVAS_H), Image.Resampling.LANCZOS)
    else:
        image = Image.new("RGBA", (CANVAS_W, CANVAS_H), "#050A13")
    draw = ImageDraw.Draw(image)

    fonts = load_fonts(card["name_ko"], card["name_en"])
    render_reference_layout(image, draw, card, fonts)

    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / card["output_filename"]
    image.convert("RGB").save(output_path, format="PNG", optimize=True)
    card["output_path"] = str(output_path.resolve())


def render_reference_layout(
    image: Image.Image,
    draw: ImageDraw.ImageDraw,
    card: dict[str, Any],
    fonts: dict[str, ImageFont.FreeTypeFont],
) -> None:
    cover_gradient_rect(draw, (18, 14, 742, 292))
    draw.text((28, 24), card["source_line"], font=fonts["source"], fill="#F2F7FC")
    draw.text((26, 44), card["name_ko"], font=fonts["title"], fill="#F3F6FB")
    draw.text((28, 254), card["name_en"], font=fonts["eng"], fill="#F7FAFE")

    eng_width = text_width(draw, card["name_en"], fonts["eng"])
    chip_x = min(624, 38 + eng_width + 18)
    draw_outlined_chip(draw, (chip_x, 250, chip_x + 164, 292), card["ticker"], "#12345A", "#4E9CFF", fonts["chip"])
    draw_outlined_chip(draw, (chip_x + 176, 250, chip_x + 270, 292), "KOSPI", "#103528", "#48F0A5", fonts["chip"])

    cover_gradient_rect(draw, (772, 62, 1038, 202), rounded=False)
    if card.get("logo_path"):
        place_image(image, Path(card["logo_path"]), (786, 72, 1025, 195), contain=True, alpha=225, trim=True)

    draw.rectangle((720, 690, 1080, 1248), fill=(7, 17, 31, 255))
    draw.rectangle((0, 1218, 1080, 1350), fill=(4, 12, 24, 248))

    draw_reference_panel(draw, (28, 300, 510, 575))
    draw_reference_panel(draw, (526, 300, 1052, 700))
    draw_reference_panel(draw, (28, 590, 510, 878))
    draw_reference_panel(draw, (28, 888, 510, 1238))
    draw_reference_panel(draw, (526, 720, 1052, 1206))
    draw_footer_shell(draw, (28, 1252, 1052, 1330))

    paint_reference_employee(draw, card, fonts)
    paint_reference_salary(draw, card, fonts)
    paint_reference_remuneration(draw, card, fonts)
    paint_reference_price(image, draw, card, fonts)
    paint_reference_leader(image, draw, card, fonts)
    paint_reference_footer(draw, card, fonts)


def draw_reference_panel(draw: ImageDraw.ImageDraw, rect: tuple[int, int, int, int]) -> None:
    x1, y1, x2, y2 = rect
    draw.rounded_rectangle((x1 + 6, y1 + 10, x2 + 8, y2 + 12), radius=28, fill=(0, 0, 0, 70))
    draw.rounded_rectangle(rect, radius=28, fill=(6, 17, 31, 230), outline=(106, 139, 173, 115), width=2)


def draw_footer_shell(draw: ImageDraw.ImageDraw, rect: tuple[int, int, int, int]) -> None:
    x1, y1, x2, y2 = rect
    draw.rounded_rectangle((x1 + 4, y1 + 8, x2 + 8, y2 + 10), radius=22, fill=(0, 0, 0, 65))
    draw.rounded_rectangle(rect, radius=22, fill=(10, 24, 42, 235), outline=(92, 142, 216, 80), width=2)


def paint_reference_employee(draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    draw_icon_bubble(draw, (46, 320), "인", "#7AF7B9", "#173A2E", fonts["body_bold"])
    draw.text((102, 327), "직원수", font=fonts["section_green"], fill="#74F5B4")
    draw.text((54, 396), format_count(card["employee_total"]), font=fonts["hero_number"], fill="#74F5B4")
    draw.line((56, 484, 480, 484), fill=(200, 211, 226, 108), width=2)
    draw.line((266, 495, 266, 553), fill=(200, 211, 226, 108), width=2)
    draw.text((82, 504), "남", font=fonts["body_bold"], fill="#4C95FF")
    draw.text((82, 538), format_count(card["employee_male"]), font=fonts["body_bold"], fill="#4C95FF")
    draw.text((362, 504), "여", font=fonts["body_bold"], fill="#6EF5A9")
    draw.text((362, 538), format_count(card["employee_female"]), font=fonts["body_bold"], fill="#6EF5A9")


def paint_reference_salary(draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    draw_icon_bubble(draw, (548, 320), "₩", "#7AF7B9", "#173A2E", fonts["body_bold"])
    draw.text((604, 327), "평균급여", font=fonts["section_green"], fill="#74F5B4")
    draw.text((556, 390), card["average_salary_current"], font=fonts["salary_main"], fill="#FFFFFF")
    y = 488
    for year in ["2024", "2023", "2022", "2021"]:
        value = card["salary_history"].get(year)
        if not value:
            continue
        draw.rounded_rectangle((560, y, 684, y + 43), radius=11, fill=(70, 148, 111, 90), outline=(118, 232, 178, 92), width=2)
        draw.text((582, y + 5), f"{year}년", font=fonts["body_bold"], fill="#C7FFE2")
        draw.text((746, y + 4), value, font=fonts["body_bold"], fill="#FFFFFF")
        y += 58


def paint_reference_remuneration(draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    draw_icon_bubble(draw, (46, 608), "★", "#5A9DFF", "#143155", fonts["body_bold"])
    draw.text((102, 615), "보수지급금액 상위 5명", font=fonts["section"], fill="#5298FF")
    start_y = 678
    items = card["remuneration_top"][:5]
    for idx, item in enumerate(items, start=1):
        yy = start_y + (idx - 1) * 40
        draw.rounded_rectangle((50, yy - 3, 90, yy + 29), radius=9, fill=(22, 58, 121, 110), outline=(93, 150, 255, 140), width=2)
        draw.text((63, yy + 1), str(idx), font=fonts["body_bold"], fill="#FFFFFF")
        draw.text((118, yy), shorten(item["name"], 7), font=fonts["body_bold"], fill="#FFFFFF")
        draw.text((260, yy), f"{item['amount_eok']:.1f}억원", font=fonts["body_bold"], fill="#5A9DFF")
        draw.text((406, yy), shorten(normalize_position(item["position"]), 7), font=fonts["body_small"], fill="#D4DBE8")
        if idx < len(items):
            draw.line((118, yy + 34, 478, yy + 34), fill=(189, 202, 218, 70), width=1)


def paint_reference_price(image: Image.Image, draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    draw_icon_bubble(draw, (46, 908), "↗", "#74F5B4", "#163A2F", fonts["body_bold"])
    draw.text((102, 915), "주가", font=fonts["section_green"], fill="#74F5B4")
    draw.text((190, 916), f"최근 5년 ({card['latest_price_date']} 기준)", font=fonts["body_small"], fill="#EFF5FB")
    price_text = f"{card['latest_price']}원"
    px = centered_x(draw, price_text, fonts["price_value"], 110, 430)
    draw.text((px, 968), price_text, font=fonts["price_value"], fill="#74F5B4")
    render_template_chart(image, card["chart_points"], (72, 1018, 494, 1208), fonts)


def paint_reference_leader(image: Image.Image, draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    executive = card.get("executive")
    draw.text((548, 758), leader_title(card), font=fonts["section_green"], fill="#74F5B4")
    draw.line((548, 808, 756, 808), fill=(124, 242, 184, 110), width=2)
    if executive:
        line = executive["name"] + (f" ({executive['age']}세)" if executive.get("age") else "")
        draw.text((548, 834), shorten(line, 16), font=fonts["leader_name"], fill="#FFFFFF")
        y = 914
        for bullet in build_leader_bullets(executive, card["rank"]):
            draw.text((562, y - 2), "•", font=fonts["leader_name"], fill="#74F5B4")
            draw.text((592, y), shorten(bullet, 22), font=fonts["leader_bullet"], fill="#F0F5FB")
            y += 56
    if card.get("portrait_path"):
        place_image(image, Path(card["portrait_path"]), (756, 700, 1072, 1240), contain=True, alpha=255, trim=False)
    elif card.get("logo_path"):
        place_image(image, Path(card["logo_path"]), (736, 860, 1036, 1140), contain=True, alpha=238, trim=True)


def paint_reference_footer(draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    draw_icon_bubble(draw, (48, 1266), "♛", "#D9FFE6", "#314D4A", fonts["body_bold"])
    left_text = f"{card['latest_price_date']} 기준 코스피 시가총액 {card['rank']}위"
    draw.text((120, 1268), left_text, font=fonts["section"], fill="#EEF3FA")
    draw.text((120, 1300), "※ 시가총액·주가 × 상장주식수 기준", font=fonts["tiny"], fill="#BBC7D7")
    draw.text((618, 1268), "약", font=fonts["section"], fill="#74F5B4")
    draw.text((654, 1258), card["footer_value"], font=fonts["footer_value"], fill="#74F5B4")

def cover_template_dynamic_areas(image: Image.Image, draw: ImageDraw.ImageDraw) -> None:
    cover_gradient_rect(draw, (18, 16, 742, 292))
    cover_gradient_rect(draw, (776, 62, 1036, 202), rounded=False)

    cover_panel_inner(draw, (48, 385, 488, 567))
    cover_panel_inner(draw, (540, 360, 1038, 690))
    cover_panel_inner(draw, (46, 664, 492, 862))
    cover_panel_inner(draw, (42, 934, 496, 1220))
    cover_panel_inner(draw, (536, 780, 1038, 1190))
    cover_panel_inner(draw, (730, 694, 1078, 1230))
    cover_panel_inner(draw, (110, 1240, 1046, 1316))


def cover_gradient_rect(draw: ImageDraw.ImageDraw, rect: tuple[int, int, int, int], rounded: bool = False) -> None:
    x1, y1, x2, y2 = rect
    for yy in range(y1, y2):
        y_ratio = (yy - y1) / max(1, y2 - y1)
        for xx in range(x1, x2):
            x_ratio = (xx - x1) / max(1, x2 - x1)
            r = int(6 + 4 * y_ratio + 3 * x_ratio)
            g = int(18 + 20 * (1 - abs(x_ratio - 0.25)) + 6 * y_ratio)
            b = int(22 + 42 * x_ratio + 10 * y_ratio)
            draw.point((xx, yy), fill=(r, g, b, 255))
    if rounded:
        draw.rounded_rectangle(rect, radius=30, outline=(111, 153, 224, 90), width=2)
        for step in range(0, 310, 28):
            draw.line((x1 + step, y1 + 6, x1 + step - 24, y2 - 6), fill=(125, 164, 231, 75), width=1)
        for step in range(0, 260, 26):
            draw.line((x1 + 10, y1 + step, x2 - 10, y1 + step - 32), fill=(125, 164, 231, 54), width=1)


def cover_panel_inner(draw: ImageDraw.ImageDraw, inner_rect: tuple[int, int, int, int]) -> None:
    draw.rectangle(inner_rect, fill=(7, 17, 31, 255))


def paint_template_header(image: Image.Image, draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    draw.text((28, 24), card["source_line"], font=fonts["source"], fill="#F1F5FB")
    draw.text((22, 44), card["name_ko"], font=fonts["title"], fill="#F5F7FB")
    draw.text((34, 255), card["name_en"], font=fonts["eng"], fill="#F5F8FD")

    eng_width = text_width(draw, card["name_en"], fonts["eng"])
    chip_y = 252
    chip_x = min(650, 34 + eng_width + 20)
    draw_outlined_chip(draw, (chip_x, chip_y, chip_x + 162, chip_y + 44), card["ticker"], "#0E2F52", "#3E99FF", fonts["chip"])
    draw_outlined_chip(draw, (chip_x + 176, chip_y, chip_x + 270, chip_y + 44), "KOSPI", "#0D3428", "#43F1A4", fonts["chip"])

    if card.get("logo_path"):
        place_image(image, Path(card["logo_path"]), (784, 66, 1025, 197), contain=True, alpha=255, trim=True)


def paint_template_employee(draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    draw.text((50, 401), format_count(card["employee_total"]), font=fonts["hero_number"], fill="#75F4B4")
    draw.line((53, 484, 474, 484), fill=(195, 213, 230, 130), width=2)
    draw.line((263, 494, 263, 551), fill=(195, 213, 230, 130), width=2)
    draw.text((88, 503), "남", font=fonts["body_bold"], fill="#4C93FF")
    draw.text((84, 537), format_count(card["employee_male"]), font=fonts["body_bold"], fill="#4C93FF")
    draw.text((349, 503), "여", font=fonts["body_bold"], fill="#6DF4A7")
    draw.text((345, 537), format_count(card["employee_female"]), font=fonts["body_bold"], fill="#6DF4A7")


def paint_template_salary(draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    draw.text((555, 390), card["average_salary_current"], font=fonts["salary_main"], fill="#FFFFFF")
    y = 492
    for year in ["2024", "2023", "2022", "2021"]:
        value = card["salary_history"].get(year)
        if not value:
            continue
        draw.rounded_rectangle((552, y, 682, y + 42), radius=10, fill=(70, 147, 110, 88), outline=(118, 232, 178, 96), width=2)
        draw.text((574, y + 5), f"{year}년", font=fonts["body_bold"], fill="#C0FFE0")
        draw.text((748, y + 5), value, font=fonts["body_bold"], fill="#FFFFFF")
        y += 56


def paint_template_remuneration(draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    start_y = 681
    for idx, item in enumerate(card["remuneration_top"][:5], start=1):
        yy = start_y + (idx - 1) * 42
        draw.rounded_rectangle((52, yy - 3, 89, yy + 28), radius=9, fill=(20, 60, 122, 110), outline=(103, 153, 255, 135), width=2)
        draw.text((64, yy + 1), str(idx), font=fonts["body_bold"], fill="#FFFFFF")
        draw.text((116, yy), shorten(item["name"], 7), font=fonts["body_bold"], fill="#FFFFFF")
        draw.text((259, yy), f"{item['amount_eok']:.1f}억원", font=fonts["body_bold"], fill="#5E9FFF")
        draw.text((404, yy), shorten(normalize_position(item["position"]), 7), font=fonts["body_small"], fill="#D2D8E4")
        if idx < len(card["remuneration_top"][:5]):
            draw.line((116, yy + 34, 470, yy + 34), fill=(178, 191, 211, 78), width=1)


def paint_template_price(image: Image.Image, draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    draw.text((204, 902), f"최근 5년 ({card['latest_price_date']} 기준)", font=fonts["body_small"], fill="#F2F5FA")
    price_text = f"{card['latest_price']}원"
    px = centered_x(draw, price_text, fonts["price_value"], 132, 444)
    draw.text((px, 950), price_text, font=fonts["price_value"], fill="#73F5B3")
    render_template_chart(image, card["chart_points"], (86, 1005, 488, 1176), fonts)


def render_template_chart(
    image: Image.Image,
    points: list[dict[str, Any]],
    rect: tuple[int, int, int, int],
    fonts: dict[str, ImageFont.FreeTypeFont],
) -> None:
    x1, y1, x2, y2 = rect
    layer = Image.new("RGBA", (x2 - x1, y2 - y1), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    closes = [float(point["close"]) for point in points]
    min_close = min(closes)
    max_close = max(closes)
    span = max(1.0, max_close - min_close)
    left_pad, right_pad, top_pad, bottom_pad = 30, 10, 12, 26
    width = layer.width - left_pad - right_pad
    height = layer.height - top_pad - bottom_pad

    for ratio in [0.0, 0.25, 0.5, 0.75, 1.0]:
        y = top_pad + height * ratio
        draw.line((left_pad, y, left_pad + width, y), fill=(255, 255, 255, 34), width=1)

    path = []
    for idx, point in enumerate(points):
        px = left_pad + width * idx / max(1, len(points) - 1)
        py = top_pad + height * (1 - (point["close"] - min_close) / span)
        path.append((px, py))

    area = path + [(path[-1][0], top_pad + height), (path[0][0], top_pad + height)]
    draw.polygon(area, fill=(112, 246, 180, 48))
    glow = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.line(path, fill=(124, 255, 201, 100), width=7)
    glow = glow.filter(ImageFilter.GaussianBlur(8))
    layer.alpha_composite(glow)
    draw.line(path, fill=(122, 248, 183, 255), width=4, joint="curve")
    lx, ly = path[-1]
    draw.ellipse((lx - 7, ly - 7, lx + 7, ly + 7), fill=(122, 248, 183, 255), outline="#FFFFFF", width=2)

    labels = [max_close, min_close + span * 2 / 3, min_close + span / 3, min_close]
    for idx, value in enumerate(labels):
        yy = top_pad + height * idx / max(1, len(labels) - 1)
        draw.text((0, yy - 8), f"{int(round(value)):,}", font=fonts["tiny"], fill="#E6EDF7")
    years = extract_year_labels(points)
    for idx, year in enumerate(years):
        xx = left_pad + width * idx / max(1, len(years) - 1)
        draw.text((xx - 16, top_pad + height + 6), year, font=fonts["tiny"], fill="#E6EDF7")

    image.alpha_composite(layer, (x1, y1))


def paint_template_leader(image: Image.Image, draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    executive = card.get("executive")
    if executive:
        line = executive["name"] + (f"({executive['age']}세)" if executive.get("age") else "")
        draw.text((547, 832), shorten(line, 14), font=fonts["leader_name"], fill="#FFFFFF")
        y = 914
        for bullet in build_leader_bullets(executive, card["rank"]):
            draw.text((560, y - 2), "•", font=fonts["leader_name"], fill="#72F5B2")
            draw.text((590, y), shorten(bullet, 21), font=fonts["leader_bullet"], fill="#F0F5FC")
            y += 56
    if card.get("portrait_path"):
        place_image(image, Path(card["portrait_path"]), (762, 705, 1052, 1244), contain=True, alpha=255, trim=False)
    elif card.get("logo_path"):
        place_image(image, Path(card["logo_path"]), (738, 840, 1030, 1158), contain=True, alpha=240, trim=True)


def paint_template_footer(draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    left_text = f"{card['latest_price_date']} 기준 코스피 시가총액 {card['rank']}위"
    draw.text((122, 1262), left_text, font=fonts["section"], fill="#EDF2F9")
    draw.text((122, 1299), "※ 시가총액: 주가 × 상장주식수 기준", font=fonts["tiny"], fill="#B8C5D7")
    draw.text((610, 1262), "약", font=fonts["section"], fill="#72F5B2")
    draw.text((654, 1253), card["footer_value"], font=fonts["footer_value"], fill="#72F5B2")


def load_fonts(name_ko: str, name_en: str) -> dict[str, ImageFont.FreeTypeFont]:
    dummy = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    title_font = fit_font(dummy, name_ko, FONT_BOLD, 132, 76, 685)
    eng_font = fit_font(dummy, name_en, FONT_BOLD, 32, 18, 420)
    return {
        "source": ImageFont.truetype(FONT_BOLD, 18),
        "title": title_font,
        "eng": eng_font,
        "chip": ImageFont.truetype(FONT_BOLD, 23),
        "section": ImageFont.truetype(FONT_BOLD, 31),
        "section_green": ImageFont.truetype(FONT_BOLD, 31),
        "hero_number": ImageFont.truetype(FONT_BOLD, 81),
        "salary_main": ImageFont.truetype(FONT_BOLD, 68),
        "body": ImageFont.truetype(FONT_REGULAR, 22),
        "body_bold": ImageFont.truetype(FONT_BOLD, 22),
        "body_small": ImageFont.truetype(FONT_REGULAR, 17),
        "leader_name": ImageFont.truetype(FONT_BOLD, 34),
        "leader_bullet": ImageFont.truetype(FONT_REGULAR, 22),
        "price_value": ImageFont.truetype(FONT_BOLD, 61),
        "footer_label": ImageFont.truetype(FONT_BOLD, 20),
        "footer_value": ImageFont.truetype(FONT_BOLD, 60),
        "tiny": ImageFont.truetype(FONT_REGULAR, 16),
    }


def paint_background(image: Image.Image, draw: ImageDraw.ImageDraw, card: dict[str, Any]) -> None:
    base = Image.new("RGBA", image.size, "#050A13")
    px = base.load()
    for y in range(CANVAS_H):
        y_ratio = y / max(1, CANVAS_H - 1)
        for x in range(CANVAS_W):
            x_ratio = x / max(1, CANVAS_W - 1)
            r = int(5 + 7 * y_ratio + 2 * x_ratio)
            g = int(9 + 18 * (1 - abs(x_ratio - 0.22)) + 10 * y_ratio)
            b = int(18 + 32 * x_ratio + 14 * y_ratio)
            px[x, y] = (r, g, b, 255)
    image.alpha_composite(base)

    glow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((-140, 90, 510, 680), fill=(46, 241, 177, 44))
    glow_draw.ellipse((630, -70, 1160, 390), fill=(80, 143, 255, 48))
    glow = glow.filter(ImageFilter.GaussianBlur(58))
    image.alpha_composite(glow)

    grid = Image.new("RGBA", image.size, (0, 0, 0, 0))
    grid_draw = ImageDraw.Draw(grid)
    for x in range(0, CANVAS_W, 72):
        grid_draw.line((x, 0, x, CANVAS_H), fill=(255, 255, 255, 11))
    for y in range(0, CANVAS_H, 72):
        grid_draw.line((0, y, CANVAS_W, y), fill=(255, 255, 255, 11))
    image.alpha_composite(grid)

    billboard = (750, 22, 1040, 258)
    draw.rounded_rectangle(billboard, radius=26, fill=(7, 17, 31, 168), outline=(65, 136, 220, 80), width=2)
    bx1, by1, bx2, by2 = billboard
    for step in range(0, 260, 28):
        draw.line((bx1 + step, by1, bx1 + step - 26, by2), fill=(96, 131, 188, 26), width=2)
    for step in range(0, 300, 28):
        draw.line((bx1, by1 + step, bx2, by1 + step - 50), fill=(96, 131, 188, 18), width=1)

    if card.get("logo_path"):
        place_image(image, Path(card["logo_path"]), (786, 72, 1025, 195), contain=True, alpha=205, trim=True)


def paint_top_header(image: Image.Image, draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    draw.text((28, 28), card["source_line"], font=fonts["source"], fill="#E8EDF8")

    draw.text((28, 54), card["name_ko"], font=fonts["title"], fill="#F4F7FC")
    draw.text((34, 228), card["name_en"], font=fonts["eng"], fill="#F8FBFF")

    name_width = text_width(draw, card["name_en"], fonts["eng"])
    chip_x = 34 + name_width + 16
    draw_outlined_chip(draw, (chip_x, 230, chip_x + 155, 272), card["ticker"], "#132C45", "#4796F5", fonts["chip"])
    draw_outlined_chip(draw, (chip_x + 170, 230, chip_x + 262, 272), "KOSPI", "#113229", "#3AF0A0", fonts["chip"])


def paint_employee_panel(draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    rect = (28, 300, 500, 570)
    draw_panel(draw, rect)
    draw_icon_bubble(draw, (48, 322), "인", "#5EF2B1", "#123329", fonts["body_bold"])
    draw.text((102, 326), "직원수", font=fonts["section_green"], fill="#74F5B4")
    draw.text((48, 394), format_count(card["employee_total"]), font=fonts["hero_number"], fill="#74F5B4")
    draw.line((52, 472, 474, 472), fill=(255, 255, 255, 80), width=2)
    draw.line((264, 486, 264, 546), fill=(255, 255, 255, 70), width=2)
    draw.text((92, 492), "남", font=fonts["body_bold"], fill="#4C94FF")
    draw.text((92, 526), format_count(card["employee_male"]), font=fonts["body_bold"], fill="#4C94FF")
    draw.text((350, 492), "여", font=fonts["body_bold"], fill="#6FF2A7")
    draw.text((350, 526), format_count(card["employee_female"]), font=fonts["body_bold"], fill="#6FF2A7")


def paint_salary_panel(draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    rect = (516, 300, 1052, 694)
    draw_panel(draw, rect)
    draw_icon_bubble(draw, (536, 322), "₩", "#6CF2B1", "#143A2F", fonts["body_bold"])
    draw.text((592, 326), "평균급여", font=fonts["section_green"], fill="#74F5B4")
    draw.text((548, 394), card["average_salary_current"], font=fonts["salary_main"], fill="#FFFFFF")
    y = 490
    for year in ["2024", "2023", "2022", "2021"]:
        value = card["salary_history"].get(year)
        if not value:
            continue
        draw.rounded_rectangle((550, y, 680, y + 42), radius=12, fill=(65, 148, 111, 82), outline=(118, 232, 178, 90), width=2)
        draw.text((572, y + 5), f"{year}년", font=fonts["body_bold"], fill="#B5FFD8")
        draw.text((744, y + 4), value, font=fonts["body_bold"], fill="#F4F7FC")
        y += 56


def paint_remuneration_panel(draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    rect = (28, 582, 500, 860)
    draw_panel(draw, rect)
    draw_icon_bubble(draw, (48, 606), "★", "#4D97FF", "#102B52", fonts["body_bold"])
    draw.text((102, 610), "보수지급금액 상위 5명", font=fonts["section"], fill="#4E98FF")

    start_y = 668
    items = card["remuneration_top"][:5]
    for idx, item in enumerate(items, start=1):
        yy = start_y + (idx - 1) * 40
        draw.rounded_rectangle((48, yy - 2, 94, yy + 30), radius=10, fill=(28, 67, 120, 110), outline=(86, 148, 255, 120), width=2)
        draw.text((64, yy + 3), str(idx), font=fonts["body_bold"], fill="#FFFFFF")
        draw.text((118, yy), shorten(item["name"], 8), font=fonts["body_bold"], fill="#FFFFFF")
        draw.text((264, yy), f"{item['amount_eok']:.1f}억원", font=fonts["body_bold"], fill="#5D9FFF")
        draw.text((405, yy), shorten(normalize_position(item["position"]), 8), font=fonts["body_small"], fill="#CFD6E3")
        if idx < len(items):
            draw.line((118, yy + 34, 470, yy + 34), fill=(255, 255, 255, 48), width=1)


def paint_price_panel(image: Image.Image, draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    rect = (28, 870, 500, 1226)
    draw_panel(draw, rect)
    draw_icon_bubble(draw, (48, 894), "↗", "#6EF3B3", "#143C2F", fonts["body_bold"])
    draw.text((102, 896), "주가", font=fonts["section_green"], fill="#74F5B4")
    draw.text((188, 898), f"최근 5년 ({card['latest_price_date']} 기준)", font=fonts["body_small"], fill="#E8EEF7")
    price_x = centered_x(draw, card["latest_price"] + "원", fonts["price_value"], 36, 494)
    draw.text((price_x, 940), f"{card['latest_price']}원", font=fonts["price_value"], fill="#72F5B2")
    render_price_chart(image, draw, card, (52, 1010, 486, 1194), fonts)


def paint_leader_panel(image: Image.Image, draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    rect = (516, 710, 1052, 1192)
    draw_panel(draw, rect)
    title = leader_title(card)
    draw.text((544, 742), title, font=fonts["section_green"], fill="#74F5B4")
    draw.line((544, 796, 760, 796), fill=(128, 255, 192, 120), width=2)

    executive = card.get("executive")
    if executive:
        name_line = executive["name"] + (f" ({executive['age']}세)" if executive.get("age") else "")
        draw.text((544, 820), shorten(name_line, 14), font=fonts["leader_name"], fill="#FFFFFF")
        bullets = build_leader_bullets(executive, card["rank"])
        y = 900
        for bullet in bullets:
            draw.text((560, y), "•", font=fonts["leader_name"], fill="#75F6B4")
            draw.text((592, y + 4), shorten(bullet, 22), font=fonts["leader_bullet"], fill="#F0F5FC")
            y += 54
    else:
        draw.text((544, 834), "리더 정보 공시 미확인", font=fonts["leader_name"], fill="#FFFFFF")

    portrait_path = card.get("portrait_path")
    logo_path = card.get("logo_path")
    if portrait_path:
        place_image(image, Path(portrait_path), (742, 774, 1045, 1240), contain=True, alpha=255, trim=False)
    elif logo_path:
        place_image(image, Path(logo_path), (736, 790, 1034, 1160), contain=True, alpha=245, trim=True)
    else:
        draw_monogram_logo(draw, (770, 800, 1020, 1120), monogram_from_name(card["name_en"]))


def paint_footer(draw: ImageDraw.ImageDraw, card: dict[str, Any], fonts: dict[str, ImageFont.FreeTypeFont]) -> None:
    rect = (28, 1216, 1052, 1322)
    draw.rounded_rectangle(rect, radius=24, fill=(10, 24, 42, 232), outline=(91, 141, 216, 78), width=2)
    draw_icon_bubble(draw, (50, 1242), "♛", "#C9F8D8", "#2F4A49", fonts["body_bold"])
    label = f"{card['latest_price_date']} 기준 코스피 시가총액 {card['rank']}위"
    draw.text((122, 1245), label, font=fonts["section"], fill="#EAF1FB")
    draw.text((122, 1286), "※ 시가총액·주가·사업보고서 기준으로 자동 생성", font=fonts["tiny"], fill="#95A8C0")
    draw.text((856, 1246), "약", font=fonts["section"], fill="#72F5B2")
    value_text = card["footer_value"]
    value_width = text_width(draw, value_text, fonts["footer_value"])
    draw.text((1032 - value_width, 1238), value_text, font=fonts["footer_value"], fill="#72F5B2")


def draw_panel(draw: ImageDraw.ImageDraw, rect: tuple[int, int, int, int]) -> None:
    x1, y1, x2, y2 = rect
    shadow = (x1 + 8, y1 + 12, x2 + 10, y2 + 14)
    draw.rounded_rectangle(shadow, radius=28, fill=(0, 0, 0, 80))
    draw.rounded_rectangle(rect, radius=28, fill=(7, 17, 31, 222), outline=(103, 140, 184, 96), width=2)


def draw_outlined_chip(
    draw: ImageDraw.ImageDraw,
    rect: tuple[int, int, int, int],
    text: str,
    fill: str,
    outline: str,
    font: ImageFont.FreeTypeFont,
) -> None:
    draw.rounded_rectangle(rect, radius=21, fill=fill, outline=outline, width=2)
    tx = centered_x(draw, text, font, rect[0], rect[2])
    draw.text((tx, rect[1] + 8), text, font=font, fill="#F7FBFF")


def draw_icon_bubble(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    glyph: str,
    glow_color: str,
    fill_color: str,
    font: ImageFont.FreeTypeFont,
) -> None:
    x, y = xy
    draw.ellipse((x - 4, y - 4, x + 50, y + 50), fill=fill_color, outline=glow_color, width=2)
    tx = centered_x(draw, glyph, font, x - 4, x + 50)
    draw.text((tx, y + 8), glyph, font=font, fill=glow_color)


def render_price_chart(
    image: Image.Image,
    draw: ImageDraw.ImageDraw,
    card: dict[str, Any],
    rect: tuple[int, int, int, int],
    fonts: dict[str, ImageFont.FreeTypeFont],
) -> None:
    x1, y1, x2, y2 = rect
    draw.rounded_rectangle(rect, radius=28, fill=(16, 31, 53, 255))
    chart_layer = Image.new("RGBA", (x2 - x1, y2 - y1), (0, 0, 0, 0))
    cdraw = ImageDraw.Draw(chart_layer)

    closes = [float(point["close"]) for point in card["chart_points"]]
    if not closes:
        return
    min_close = min(closes)
    max_close = max(closes)
    span = max(1.0, max_close - min_close)

    left_pad = 48
    right_pad = 18
    top_pad = 20
    bottom_pad = 28
    width = (x2 - x1) - left_pad - right_pad
    height = (y2 - y1) - top_pad - bottom_pad

    for ratio in [0.0, 0.25, 0.5, 0.75, 1.0]:
        y = top_pad + height * ratio
        cdraw.line((left_pad, y, left_pad + width, y), fill=(255, 255, 255, 34), width=1)

    path = []
    for idx, point in enumerate(card["chart_points"]):
        px = left_pad + width * idx / max(1, len(card["chart_points"]) - 1)
        py = top_pad + height * (1 - (point["close"] - min_close) / span)
        path.append((px, py))

    if len(path) >= 2:
        area = path + [(path[-1][0], top_pad + height), (path[0][0], top_pad + height)]
        cdraw.polygon(area, fill=(98, 248, 183, 60))
        for blur in [10, 6, 3]:
            blur_layer = Image.new("RGBA", chart_layer.size, (0, 0, 0, 0))
            bdraw = ImageDraw.Draw(blur_layer)
            bdraw.line(path, fill=(110, 255, 198, 90), width=8)
            blur_layer = blur_layer.filter(ImageFilter.GaussianBlur(blur))
            chart_layer.alpha_composite(blur_layer)
        cdraw.line(path, fill=(118, 248, 183, 255), width=5, joint="curve")
        lx, ly = path[-1]
        cdraw.ellipse((lx - 7, ly - 7, lx + 7, ly + 7), fill=(118, 248, 183, 255), outline="#FFFFFF", width=3)

    years = extract_year_labels(card["chart_points"])
    for idx, label in enumerate(years):
        x = left_pad + width * idx / max(1, len(years) - 1)
        cdraw.text((x - 18, top_pad + height + 6), label, font=fonts["tiny"], fill="#D9E4F2")

    y_labels = [max_close, min_close + span * 2 / 3, min_close + span / 3, min_close]
    for idx, value in enumerate(y_labels):
        y = top_pad + height * idx / max(1, len(y_labels) - 1)
        label = f"{int(round(value)):,}"
        cdraw.text((2, y - 8), label, font=fonts["tiny"], fill="#D9E4F2")

    image.alpha_composite(chart_layer, (x1, y1))


def place_image(
    base: Image.Image,
    path: Path,
    rect: tuple[int, int, int, int],
    *,
    contain: bool,
    alpha: int,
    trim: bool,
) -> None:
    try:
        asset = Image.open(path).convert("RGBA")
    except Exception:
        return

    if trim:
        asset = trim_transparent(asset)
    x1, y1, x2, y2 = rect
    max_w = x2 - x1
    max_h = y2 - y1
    if max_w <= 0 or max_h <= 0:
        return

    scale_x = max_w / max(1, asset.width)
    scale_y = max_h / max(1, asset.height)
    scale = min(scale_x, scale_y) if contain else max(scale_x, scale_y)
    new_size = (max(1, int(asset.width * scale)), max(1, int(asset.height * scale)))
    asset = asset.resize(new_size, Image.Resampling.LANCZOS)

    if alpha < 255:
        mask = asset.getchannel("A").point(lambda p: int(p * alpha / 255))
        asset.putalpha(mask)

    offset_x = x1 + (max_w - asset.width) // 2
    offset_y = y1 + (max_h - asset.height) // 2
    base.alpha_composite(asset, (offset_x, offset_y))


def trim_transparent(image: Image.Image) -> Image.Image:
    bg = Image.new("RGBA", image.size, (0, 0, 0, 0))
    diff = ImageChops.difference(image, bg)
    bbox = diff.getbbox()
    return image.crop(bbox) if bbox else image


def draw_monogram_logo(draw: ImageDraw.ImageDraw, rect: tuple[int, int, int, int], text: str) -> None:
    x1, y1, x2, y2 = rect
    draw.rounded_rectangle(rect, radius=46, fill=(16, 40, 70, 160), outline=(88, 154, 255, 140), width=3)
    font = ImageFont.truetype(FONT_BOLD, 86)
    tx = centered_x(draw, text, font, x1, x2)
    ty = y1 + (y2 - y1 - text_height(draw, text, font)) // 2 - 6
    draw.text((tx, ty), text, font=font, fill="#EAF6FF")


def leader_title(card: dict[str, Any]) -> str:
    executive = card.get("executive")
    if not executive:
        return "리더"
    position = executive.get("position", "")
    responsibilities = executive.get("responsibilities", "")
    merged = f"{position} {responsibilities}"
    if "회장" in merged:
        return "회장"
    if "부회장" in merged:
        return "부회장"
    if "대표이사" in merged or "CEO" in merged:
        return "대표"
    return "리더"


def build_leader_bullets(executive: dict[str, Any], rank: int) -> list[str]:
    bullets = []
    first_career = extract_first_career_line(executive.get("major_career", ""))
    if first_career:
        bullets.append(first_career)
    duty = simplify_responsibility(executive.get("responsibilities", ""), executive.get("position", ""))
    if duty:
        bullets.append(duty)
    bullets.append(f"코스피 시가총액 {rank}위")
    return bullets[:4]


def extract_first_career_line(text: str) -> str:
    text = simplify_spaces(text.replace("ㆍ", " "))
    parts = [part.strip() for part in re.split(r"\s{2,}|(?<=박사)|(?<=학사)|(?<=석사)", text) if part.strip()]
    return shorten(parts[0], 22) if parts else ""


def simplify_responsibility(responsibility: str, position: str) -> str:
    text = simplify_spaces(responsibility.replace("ㆍ", " ").replace("(", " ").replace(")", " "))
    if "대표이사" in text:
        return f"대표이사 · {normalize_position(position)}"
    return shorten(text or normalize_position(position), 22)


def normalize_position(text: str) -> str:
    return simplify_spaces(text.replace("前", "전").replace("(", " ").replace(")", " ").replace("/", " / "))


def parse_int_from_row_position(row: list[str] | None, index: int) -> int | None:
    if not row:
        return None
    try:
        value = clean_numeric(row[index]) or "0"
        return int(value)
    except Exception:
        return None


def parse_employee_total_from_total_row(row: list[str] | None) -> int | None:
    if not row:
        return None
    candidates = [5, -5, len(row) - 5]
    for index in candidates:
        try:
            value = clean_numeric(row[index])
            if value:
                return int(value)
        except Exception:
            continue
    return None


def parse_average_salary_from_total_row(row: list[str] | None) -> int | None:
    if not row:
        return None
    candidates = [8, -2, len(row) - 2]
    for index in candidates:
        try:
            value = clean_numeric(row[index])
            if value:
                return int(value)
        except Exception:
            continue
    return None


def parse_employee_total_from_gender_row(row: list[str] | None) -> int | None:
    if not row:
        return None
    candidates = [6, -4, len(row) - 4]
    for index in candidates:
        try:
            value = clean_numeric(row[index])
            if value:
                return int(value)
        except Exception:
            continue
    return None


def clean_numeric(value: str | None) -> str:
    if value is None:
        return ""
    cleaned = re.sub(r"[^\d\-]", "", value)
    return "" if cleaned in {"", "-"} else cleaned


def simplify_spaces(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def unique_preserve_order(values: list[str]) -> list[str]:
    seen = set()
    items = []
    for value in values:
        if value in seen or not value:
            continue
        seen.add(value)
        items.append(value)
    return items


def safe_filename(text: str) -> str:
    text = re.sub(r"[^\w가-힣.-]+", "-", text, flags=re.UNICODE).strip("-")
    return text or "item"


def monogram_from_name(name: str) -> str:
    parts = re.findall(r"[A-Z0-9]+", name.upper())
    if not parts:
        return "CI"
    return "".join(part[0] for part in parts[:3])


def format_count(value: int | None) -> str:
    return f"{value:,}명" if value else "-"


def format_avg_salary(million_won: int | None) -> str:
    if million_won is None or million_won <= 0:
        return "-"
    eok = million_won // 100
    remain = million_won % 100
    if eok > 0:
        return f"{eok:,}억 {remain * 100:,.0f}만원"
    return f"{million_won * 100:,.0f}만원"


def format_market_cap_from_eok(market_cap_eok: int) -> str:
    if market_cap_eok <= 0:
        return "시총 정보 없음"
    if market_cap_eok >= 10000:
        return f"시총 {market_cap_eok / 10000:,.1f}조원"
    return f"시총 {market_cap_eok:,.0f}억원"


def format_market_cap_big(market_cap_eok: int) -> str:
    if market_cap_eok >= 10000:
        value = market_cap_eok / 10000
        if value >= 100:
            return f"{value:,.0f}조 원"
        return f"{value:,.1f}조 원"
    return f"{market_cap_eok:,.0f}억 원"


def extract_year_labels(points: list[dict[str, Any]]) -> list[str]:
    years = []
    for point in points:
        year = point["date"][:4]
        if not years or years[-1] != year:
            years.append(year)
    if len(years) >= 5:
        return [years[0], years[1], years[2], years[3], f"{years[-1]}.04"]
    return years


def shorten(text: str, max_chars: int) -> str:
    text = simplify_spaces(text)
    if len(text) <= max_chars:
        return text
    return text[: max_chars - 1].rstrip() + "…"


def fit_font(
    draw: ImageDraw.ImageDraw,
    text: str,
    font_path: str,
    max_size: int,
    min_size: int,
    max_width: int,
) -> ImageFont.FreeTypeFont:
    for size in range(max_size, min_size - 1, -2):
        font = ImageFont.truetype(font_path, size)
        if text_width(draw, text, font) <= max_width:
            return font
    return ImageFont.truetype(font_path, min_size)


def centered_x(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, left: int, right: int) -> int:
    width = text_width(draw, text, font)
    return left + (right - left - width) // 2


def text_width(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont) -> int:
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0]


def text_height(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont) -> int:
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[3] - bbox[1]


if __name__ == "__main__":
    main()
