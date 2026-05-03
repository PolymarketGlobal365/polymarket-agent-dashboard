import fs from "node:fs";
import path from "node:path";

import { BRAND_LINE, CTA_HANDLE, MAX_MARKETS_PER_CARD } from "../config.js";
import { cleanText, truncate } from "../lib/strings.js";
import type { RankedEvent, SlideMarketSnapshot, SlideSpec } from "../types.js";

export function buildSlidesForEvent(
  event: RankedEvent,
  options: {
    bullImagePath?: string;
    bearImagePath?: string;
  } = {},
): SlideSpec[] {
  const topMarkets = event.markets.slice(0, MAX_MARKETS_PER_CARD);
  const leadMarket = topMarkets[0];
  const secondMarket = topMarkets[1];
  const imageUrl = resolveEventImageUrl(resolvePreferredImageSource(event));

  const hookSnapshot = buildHookSnapshot(event, leadMarket, secondMarket);
  const leadSnapshot = leadMarket
    ? buildCompactSnapshot(event, leadMarket, secondMarket)
    : undefined;
  const secondSnapshot = secondMarket
    ? buildCompactSnapshot(event, secondMarket, leadMarket)
    : leadMarket
      ? buildSecondaryFallbackSnapshot(event, leadMarket)
      : undefined;

  const leadProbability = leadMarket?.yesProb ?? 50;
  const secondProbability = secondMarket?.yesProb ?? Math.max(0, leadMarket ? leadMarket.noProb : 50);

  const hook: SlideSpec = {
    eventId: event.eventId,
    slideNo: 1,
    layout: "hook",
    brandLine: BRAND_LINE,
    categoryLabel: resolveCategoryLabel(event),
    headline: truncateForHook(localizeHookHeadline(event, leadMarket)),
    subheadline: buildHookSubheadline(event, leadMarket),
    highlightTone: "green",
    ...(hookSnapshot ? { marketSnapshot: hookSnapshot } : {}),
    ...(imageUrl ? { imageUrl } : {}),
    progressValue: leadProbability,
    progressDirection: "left",
  };

  const breakdown: SlideSpec = {
    eventId: event.eventId,
    slideNo: 2,
    layout: "breakdown",
    brandLine: BRAND_LINE,
    headline: leadMarket ? localizeMarketLabel(event, leadMarket.label) : "대표 시나리오",
    highlightTone: "green",
    body: buildBreakdownBody(event, leadMarket, secondMarket),
    ...(leadSnapshot ? { marketSnapshot: leadSnapshot } : {}),
    ...(leadMarket ? { highlightLabel: `${leadMarket.yesProb}%` } : {}),
    ...(imageUrl ? { imageUrl } : {}),
    ...(options.bullImagePath ? { illustrationImageUrl: toFileImageUrl(options.bullImagePath) } : {}),
    progressValue: leadProbability,
    progressDirection: "left",
    chartPoints: buildChartPoints(leadProbability, secondProbability),
    chartLabel: `${leadProbability}% 가능성`,
    ...(leadSnapshot?.deltaText ? { chartDeltaText: leadSnapshot.deltaText } : {}),
  };

  const insight: SlideSpec = {
    eventId: event.eventId,
    slideNo: 3,
    layout: "insight",
    brandLine: BRAND_LINE,
    headline: secondMarket ? localizeMarketLabel(event, secondMarket.label) : "반대 시나리오",
    highlightTone: "red",
    body: buildInsightBody(event, leadMarket, secondMarket),
    ...(secondSnapshot ? { marketSnapshot: secondSnapshot } : {}),
    ...(secondMarket
      ? { highlightLabel: `${secondMarket.yesProb}%` }
      : leadMarket
        ? { highlightLabel: `${leadMarket.noProb}%` }
        : {}),
    ...(imageUrl ? { imageUrl } : {}),
    ...(options.bearImagePath ? { illustrationImageUrl: toFileImageUrl(options.bearImagePath) } : {}),
    progressValue: secondProbability,
    progressDirection: "right",
  };

  const context: SlideSpec = {
    eventId: event.eventId,
    slideNo: 4,
    layout: "context",
    brandLine: BRAND_LINE,
    headline: buildContextHeadline(event),
    highlightTone: leadProbability >= 50 ? "green" : "red",
    body: buildContextBody(event, leadMarket, secondMarket),
    ...(leadSnapshot ? { marketSnapshot: leadSnapshot } : {}),
    ...(imageUrl ? { imageUrl } : {}),
    progressValue: leadProbability,
    progressDirection: "left",
    secondaryHeadline: secondMarket ? localizeMarketLabel(event, secondMarket.label) : "반대 시나리오",
    secondaryBody: buildContextSecondaryBody(event, leadMarket, secondMarket),
    secondaryHighlightTone: "red",
    ...(secondSnapshot ? { secondaryMarketSnapshot: secondSnapshot } : {}),
    secondaryProgressValue: secondProbability,
    secondaryProgressDirection: "right",
  };

  const source: SlideSpec = {
    eventId: event.eventId,
    slideNo: 5,
    layout: "source",
    brandLine: BRAND_LINE,
    badgeLabel: "세상 모든 베팅 / 예측 뉴스",
    badgeTone: "purple",
    headline: "놓치고 싶지 않다면?",
    subheadline: `${CTA_HANDLE}에서 매일 빠르게 정리한 폴리마켓뉴스를 확인하세요.`,
    ctaItems: [
      "폴리마켓나우 공식 계정 팔로우",
      "관심 시장 카드 저장하고 비교하기",
      "폴리마켓나우 텔레그램방 들어가기",
    ],
    sourceLabel: "Polymarket 원문 보기",
    sourceUrl: event.eventUrl,
    scrapedAt: event.scrapedAt,
  };

  return [hook, breakdown, insight, context, source];
}

function buildHookSnapshot(
  event: RankedEvent,
  leadMarket: RankedEvent["markets"][number] | undefined,
  secondMarket: RankedEvent["markets"][number] | undefined,
): SlideMarketSnapshot | undefined {
  if (!leadMarket) {
    return undefined;
  }

  return {
    title: localizeSnapshotTitle(event),
    ...(event.volumeText ? { volumeText: event.volumeText } : {}),
    probabilityText: `${leadMarket.yesProb}%`,
    ...(secondMarket ? { deltaText: deltaFromPair(leadMarket, secondMarket) } : {}),
    rows: [
      {
        label: localizeMarketLabel(event, leadMarket.label),
        yesProb: leadMarket.yesProb,
        noProb: leadMarket.noProb,
      },
      ...(secondMarket
        ? [{
            label: localizeMarketLabel(event, secondMarket.label),
            yesProb: secondMarket.yesProb,
            noProb: secondMarket.noProb,
          }]
        : []),
    ],
  };
}

function buildCompactSnapshot(
  event: RankedEvent,
  current: RankedEvent["markets"][number],
  comparison: RankedEvent["markets"][number] | undefined,
): SlideMarketSnapshot {
  return {
    title: localizeMarketLabel(event, current.label),
    ...(event.volumeText ? { volumeText: event.volumeText } : {}),
    probabilityText: `${current.yesProb}%`,
    ...(comparison ? { deltaText: deltaFromPair(current, comparison) } : {}),
    rows: [
      {
        label: localizeMarketLabel(event, current.label),
        yesProb: current.yesProb,
        noProb: current.noProb,
      },
    ],
  };
}

function buildSecondaryFallbackSnapshot(
  event: RankedEvent,
  leadMarket: RankedEvent["markets"][number],
): SlideMarketSnapshot {
  return {
    title: "반대 시나리오",
    ...(event.volumeText ? { volumeText: event.volumeText } : {}),
    probabilityText: `${leadMarket.noProb}%`,
    rows: [
      {
        label: "아니오",
        yesProb: leadMarket.noProb,
        noProb: leadMarket.yesProb,
      },
    ],
  };
}

function buildHookSubheadline(
  event: RankedEvent,
  leadMarket: RankedEvent["markets"][number] | undefined,
): string {
  if (!leadMarket) {
    return "지금 시장에서 가장 먼저 확인할 핵심 시나리오를 정리했습니다.";
  }

  return `현재 가장 강한 선택지는 ${localizeMarketLabel(event, leadMarket.label)}이고, Yes 확률은 ${leadMarket.yesProb}%입니다.`;
}

function buildBreakdownBody(
  event: RankedEvent,
  leadMarket: RankedEvent["markets"][number] | undefined,
  secondMarket: RankedEvent["markets"][number] | undefined,
): string[] {
  const lines: string[] = [];

  if (leadMarket) {
    lines.push(
      `이 시장에서 가장 강한 시나리오는 ${localizeMarketLabel(event, leadMarket.label)}이며, 현재 Yes 확률은 ${leadMarket.yesProb}%입니다.`,
    );
  }

  if (leadMarket && secondMarket) {
    lines.push(
      `그다음 시나리오는 ${localizeMarketLabel(event, secondMarket.label)}로 ${secondMarket.yesProb}%이며, 1위와의 격차는 ${Math.abs(leadMarket.yesProb - secondMarket.yesProb)}%p입니다. ${describeEventBrief(event)}`,
    );
  } else {
    lines.push(describeEventBrief(event));
  }

  return lines.slice(0, 2);
}

function buildInsightBody(
  event: RankedEvent,
  leadMarket: RankedEvent["markets"][number] | undefined,
  secondMarket: RankedEvent["markets"][number] | undefined,
): string[] {
  const lines: string[] = [];

  if (leadMarket && secondMarket) {
    lines.push(
      `${localizeMarketLabel(event, secondMarket.label)}의 Yes 확률은 ${secondMarket.yesProb}%로, ${localizeMarketLabel(event, leadMarket.label)}보다 ${Math.abs(leadMarket.yesProb - secondMarket.yesProb)}%p 낮습니다.`,
    );
  } else if (leadMarket) {
    lines.push(`대표 시나리오의 반대 포지션은 No ${leadMarket.noProb}% 수준입니다.`);
  }

  if (event.volumeText) {
    lines.push(`${event.volumeText} 수준의 거래량은 이 이슈에 대한 관심이 꾸준히 이어지고 있음을 보여줍니다. ${describeEventBrief(event)}`);
  } else {
    lines.push(describeEventBrief(event));
  }

  return lines.slice(0, 2);
}

function buildContextHeadline(event: RankedEvent): string {
  switch (event.eventId) {
    case "how-many-fed-rate-cuts-in-2026":
      return "시장 흐름";
    case "fed-decision-in-april":
      return "결정 포인트";
    case "california-governor-election-2026":
      return "구도 요약";
    case "colombia-presidential-election":
      return "판세 요약";
    case "nobel-peace-prize-winner-2026-139":
      return "수상 구도";
    case "next-prime-minister-of-hungary":
      return "판세 요약";
    case "will-the-us-invade-iran-before-2027":
      return "긴장 수위";
    case "2026-seoul-mayoral-election-winner":
      return "판세 요약";
    case "netanyahu-out-before-2027":
      return "핵심 변수";
    case "will-china-invade-taiwan-before-2027":
      return "긴장 수위";
    case "brazil-presidential-election":
      return "구도 요약";
    default:
      return "핵심 포인트";
  }
}

function buildContextBody(
  event: RankedEvent,
  leadMarket: RankedEvent["markets"][number] | undefined,
  secondMarket: RankedEvent["markets"][number] | undefined,
): string[] {
  if (!leadMarket) {
    return ["시장이 현재 어디에 무게를 두는지 짧게 정리한 카드입니다."];
  }

  const firstLabel = localizeMarketLabel(event, leadMarket.label);
  const secondLabel = secondMarket ? localizeMarketLabel(event, secondMarket.label) : "반대 시나리오";

  return [
    `${firstLabel}가 ${leadMarket.yesProb}%로 가장 앞서 있지만, ${secondLabel}도 ${secondMarket?.yesProb ?? leadMarket.noProb}% 수준으로 따라오고 있습니다.`,
    `즉 현재 숫자는 결과를 확정하는 수치라기보다, 지금 시점 투자자들의 기대가 어느 방향에 더 기울어 있는지 보여주는 흐름에 가깝습니다.`,
  ];
}

function buildContextSecondaryBody(
  event: RankedEvent,
  leadMarket: RankedEvent["markets"][number] | undefined,
  secondMarket: RankedEvent["markets"][number] | undefined,
): string[] {
  if (!leadMarket || !secondMarket) {
    return [
      "반대 시나리오를 함께 보면 시장의 균형과 긴장도를 더 선명하게 읽을 수 있습니다.",
      "한쪽이 앞서더라도 반대 포지션의 확률이 유지되면 시장은 여전히 변수 가능성을 열어두고 있다는 뜻입니다.",
    ];
  }

  return [
    `${localizeMarketLabel(event, secondMarket.label)}는 ${secondMarket.yesProb}%로 뒤따르지만, 아직 완전히 이탈한 구간은 아닙니다.`,
    `결국 두 시나리오의 격차를 함께 보면 시장이 확신 단계인지, 아니면 재평가가 남아 있는 단계인지 구분할 수 있습니다.`,
  ];
}

function localizeHookHeadline(
  event: RankedEvent,
  leadMarket: RankedEvent["markets"][number] | undefined,
): string {
  switch (event.eventId) {
    case "how-many-fed-rate-cuts-in-2026":
      return "2026년 연준 금리\n몇 번 내릴까?";
    case "fed-decision-in-april":
      return "4월 FOMC,\n금리 어떻게 결정할까?";
    case "california-governor-election-2026":
      return "캘리포니아 주지사,\n누가 될까?";
    case "colombia-presidential-election":
      return "콜롬비아 대선,\n누가 이길까?";
    case "nobel-peace-prize-winner-2026-139":
      return "2026 노벨평화상,\n누가 받을까?";
    case "next-prime-minister-of-hungary":
      return "헝가리 차기 총리,\n누가 될까?";
    case "will-the-us-invade-iran-before-2027":
      return "미국,\n2027년 전 이란 침공할까?";
    case "2026-seoul-mayoral-election-winner":
      return "2026 서울시장 선거,\n누가 될까?";
    case "netanyahu-out-before-2027":
      return "네타냐후,\n2027년 전 물러날까?";
    case "will-china-invade-taiwan-before-2027":
      return "중국, 2026년 말까지\n대만 침공할까?";
    case "brazil-presidential-election":
      return "브라질 대선,\n누가 이길까?";
    default:
      return toHeadline(buildSnapshotTitle(event, leadMarket));
  }
}

function localizeSnapshotTitle(event: RankedEvent): string {
  switch (event.eventId) {
    case "how-many-fed-rate-cuts-in-2026":
      return "2026년 연준 금리 인하 횟수?";
    case "fed-decision-in-april":
      return "4월 연준 결정?";
    case "california-governor-election-2026":
      return "캘리포니아 주지사 선거 승자?";
    case "colombia-presidential-election":
      return "콜롬비아 대선 승자?";
    case "nobel-peace-prize-winner-2026-139":
      return "2026 노벨평화상 수상자?";
    case "next-prime-minister-of-hungary":
      return "헝가리 차기 총리?";
    case "will-the-us-invade-iran-before-2027":
      return "미국의 이란 침공 가능성?";
    case "2026-seoul-mayoral-election-winner":
      return "2026 서울시장 선거 승자?";
    case "netanyahu-out-before-2027":
      return "네타냐후 퇴진 시점?";
    case "will-china-invade-taiwan-before-2027":
      return "중국의 대만 침공 가능성?";
    case "brazil-presidential-election":
      return "브라질 대선 승자?";
    default:
      return cleanText(event.eventTitle);
  }
}

function localizeMarketLabel(event: RankedEvent, label: string): string {
  const normalized = cleanText(label);

  if (event.eventId === "how-many-fed-rate-cuts-in-2026") {
    const match = normalized.match(/^(\d+)\s*\((\d+)\s*bps\)$/i);
    if (match) {
      const cuts = Number.parseInt(match[1] ?? "0", 10);
      const bps = match[2] ?? "0";
      if (cuts === 0) {
        return `동결 (${bps}bp)`;
      }
      return `${cuts}회 인하 (${bps}bp)`;
    }
  }

  if (event.eventId === "fed-decision-in-april") {
    return normalized
      .replace("No change", "동결")
      .replace("25 bps decrease", "25bp 인하")
      .replace("50+ bps decrease", "50bp 이상 인하")
      .replace("25+ bps increase", "25bp 이상 인상")
      .replace("Will there be no change in Fed interest rates after the April 2026 meeting?", "동결")
      .replace("Will the Fed decrease interest rates by 25 bps after the April 2026 meeting?", "25bp 인하")
      .replace("Will the Fed decrease interest rates by 50+ bps after the April 2026 meeting?", "50bp 이상 인하")
      .replace("Will the Fed increase interest rates by 25+ bps after the April 2026 meeting?", "25bp 이상 인상");
  }

  if (event.eventId === "will-the-us-invade-iran-before-2027") {
    const localized = normalized
      .replace("Will the U.S. invade Iran before 2027?", "대표 선택지")
      .replace("Yes", "예")
      .replace("No", "아니오");
    if (localized === "대표 선택지") {
      return "침공";
    }
    if (localized === "아니오") {
      return "비침공";
    }
    return localized;
  }

  if (event.eventId === "next-prime-minister-of-hungary") {
    return normalized
      .replace("Péter Magyar", "페테르 머저르")
      .replace("Viktor Orbán", "빅토르 오르반")
      .replace("Klára Dobrev", "클라라 도브레브")
      .replace("László Toroczkai", "라슬로 토로츠카이")
      .replace("István Kapitány", "이슈트반 커피타니")
      .replace("János Lázár", "야노시 라자르")
      .replace("Other", "기타");
  }

  if (event.eventId === "california-governor-election-2026") {
    return normalized
      .replace("Tom Steyer", "톰 스테이어")
      .replace("Xavier Becerra", "하비에르 베세라")
      .replace("Rick Caruso", "릭 카루소")
      .replace("Katie Porter", "케이티 포터")
      .replace("Steve Hilton", "스티브 힐턴")
      .replace("Stephen Cloobeck", "스티븐 클루벡")
      .replace("Betty Yee", "베티 이")
      .replace("Kyle Langford", "카일 랭포드")
      .replace("Eleni Kounalakis", "엘레니 쿠날라키스")
      .replace("Tony Thurmond", "토니 서먼드");
  }

  if (event.eventId === "colombia-presidential-election") {
    return normalized
      .replace("Candidate M", "후보 M")
      .replace("Iván Cepeda Castro", "이반 세페다 카스트로")
      .replace("Vicky Dávila", "비키 다빌라")
      .replace("Luis Gilberto Murillo", "루이스 힐베르토 무리요")
      .replace("Claudia López", "클라우디아 로페스")
      .replace("David Luna Sánchez", "다비드 루나 산체스")
      .replace("Juan Daniel Oviedo", "후안 다니엘 오비에도")
      .replace("Miguel Uribe Turbay", "미겔 우리베 투르바이")
      .replace("Gustavo Bolívar", "구스타보 볼리바르")
      .replace("Sergio Fajardo", "세르히오 파하르도");
  }

  if (event.eventId === "nobel-peace-prize-winner-2026-139") {
    return normalized
      .replace("Volodymyr Zelenskyy", "볼로디미르 젤렌스키")
      .replace("Donald Trump", "도널드 트럼프")
      .replace("Yulia Navalnaya", "율리아 나발나야")
      .replace("Greta Thunberg", "그레타 툰베리")
      .replace("UNRWA", "UNRWA")
      .replace("António Guterres", "안토니우 구테흐스")
      .replace("Tamim bin Hamad Al Thani", "타밈 빈 하마드 알사니")
      .replace("Khaled Mashal", "칼레드 마샬")
      .replace("Recep Tayyip Erdoğan", "레제프 타이이프 에르도안");
  }

  if (event.eventId === "2026-seoul-mayoral-election-winner") {
    return normalized
      .replace("Chong Won-oh", "정원오")
      .replace("Oh Se-hoon", "오세훈")
      .replace("Cho Eun-hee", "조은희")
      .replace("Ahn Cheol-soo", "안철수")
      .replace("Park Yong-jin", "박용진")
      .replace("Hong Ihk-pyo", "홍익표")
      .replace("Will Oh Se-hoon win the 2026 Seoul Mayoral Election", "오세훈")
      .replace("Will Cho Eun-hee win the 2026 Seoul Mayoral Election", "조은희")
      .replace("Will Ahn Cheol-soo win the 2026 Seoul Mayoral Election", "안철수")
      .replace("Will Park Yong-jin win the 2026 Seoul Mayoral Election", "박용진")
      .replace("Will Chong Won-oh win the 2026 Seoul Mayoral Election", "정원오")
      .replace("Will Hong Ihk-pyo win the 2026 Seoul Mayoral Election", "홍익표");
  }

  if (event.eventId === "netanyahu-out-before-2027") {
    return normalizeDateLabel(normalized);
  }

  if (event.eventId === "will-china-invade-taiwan-before-2027") {
    return normalizeDateLabel(normalized);
  }

  if (event.eventId === "brazil-presidential-election") {
    return normalized
      .replace("Luiz Inacio Lula da Silva", "룰라")
      .replace("Jair Bolsonaro", "보우소나루");
  }
  return normalized;
}

function normalizeDateLabel(input: string): string {
  return input
    .replace("December 31, 2026", "2026년 12월 31일")
    .replace("December 31, 2025", "2025년 12월 31일")
    .replace("December 31", "12월 31일")
    .replace("June 30, 2026", "2026년 6월 30일")
    .replace("June 30", "6월 30일")
    .replace("March 31, 2026", "2026년 3월 31일")
    .replace("March 31", "3월 31일")
    .replace("April 30, 2026", "2026년 4월 30일")
    .replace("April 30", "4월 30일")
    .replace("October 31, 2025", "2025년 10월 31일");
}

function buildSnapshotTitle(
  event: RankedEvent,
  leadMarket: RankedEvent["markets"][number] | undefined,
): string {
  const replacement = leadMarket?.label ? ` ${leadMarket.label} ` : " ___ ";
  return cleanText(cleanText(event.eventTitle).replace(/_{2,}/g, replacement));
}

function resolveCategoryLabel(event: RankedEvent): string {
  if (event.eventId === "will-the-us-invade-iran-before-2027") {
    return "이슈";
  }

  if (event.eventId === "nobel-peace-prize-winner-2026-139") {
    return "이슈";
  }

  const normalized = cleanText(event.sectionName || event.category);

  if (/politics/i.test(normalized) || /president|election|netanyahu|china|taiwan|fed/i.test(event.eventTitle)) {
    return "정치";
  }

  if (/economy|business|finance/i.test(normalized)) {
    return "경제";
  }

  return normalized || "이슈";
}

function deltaFromPair(
  current: RankedEvent["markets"][number],
  comparison: RankedEvent["markets"][number] | undefined,
): string {
  if (!comparison) {
    return "0%p";
  }

  const difference = current.yesProb - comparison.yesProb;
  if (difference === 0) {
    return "0%p";
  }

  return `${difference > 0 ? "▲" : "▼"} ${Math.abs(difference)}%p`;
}

function toHeadline(title: string): string {
  const normalized = cleanText(title)
    .replace(/^will\s+/i, "")
    .replace(/\?+$/g, "");

  return normalized.endsWith("?") ? normalized : `${normalized}?`;
}

function truncateForHook(input: string): string {
  return truncate(input, /[가-힣]/.test(input) ? 28 : 44);
}

function buildChartPoints(primary: number, secondary: number): number[] {
  const anchor = Math.max(primary, 4);
  const floor = Math.max(0, Math.min(primary, secondary) - 6);

  return [
    floor,
    floor + 1,
    floor + 2,
    secondary,
    secondary + 2,
    anchor - 6,
    anchor - 4,
    anchor - 1,
    anchor,
    anchor,
  ].map((value) => Math.max(0, value));
}

function describeEventBrief(event: RankedEvent): string {
  switch (event.eventId) {
    case "how-many-fed-rate-cuts-in-2026":
      return "이 시장은 2026년 말까지 연준이 총 몇 차례 기준금리를 인하할지를 묻습니다.";
    case "fed-decision-in-april":
      return "이 시장은 2026년 4월 FOMC 이후 연준이 동결, 인하, 인상 중 어떤 결정을 내릴지를 묻습니다.";
    case "next-prime-minister-of-hungary":
      return "이 시장은 2026년 헝가리 총선 이후 차기 총리로 누가 공식 선출될지를 묻습니다.";
    case "california-governor-election-2026":
      return "이 시장은 2026년 캘리포니아 주지사 선거에서 누가 승리할지를 묻습니다.";
    case "colombia-presidential-election":
      return "이 시장은 2026년 콜롬비아 대선에서 누가 승리할지를 묻습니다.";
    case "nobel-peace-prize-winner-2026-139":
      return "이 시장은 2026년 노벨평화상을 누가 수상할지를 묻습니다.";
    case "will-the-us-invade-iran-before-2027":
      return "이 시장은 2027년 전 미국이 이란에 군사적으로 침공할 가능성을 묻습니다.";
    case "2026-seoul-mayoral-election-winner":
      return "이 시장은 2026 서울시장 선거에서 누가 승리할지를 묻습니다.";
    case "netanyahu-out-before-2027":
      return "이 시장은 2027년 전 네타냐후가 총리직에서 물러날 가능성을 묻습니다.";
    case "will-china-invade-taiwan-before-2027":
      return "이 시장은 2026년 말까지 중국이 대만을 군사적으로 침공할 가능성을 묻습니다.";
    case "brazil-presidential-election":
      return "이 시장은 브라질 대선에서 누가 승리할지를 묻습니다.";
    default: {
      const sentence = cleanText(event.eventDescription).split(/(?<=[.!?])\s+/u)[0] ?? "";
      return truncate(sentence, 120);
    }
  }
}

function resolveEventImageUrl(input: string | undefined): string | undefined {
  if (!input) {
    return undefined;
  }

  if (/^[a-zA-Z]:\\/.test(input) || input.startsWith("\\\\")) {
    return toFileImageUrl(input);
  }

  try {
    const parsed = new URL(input);
    const nestedUrl = parsed.searchParams.get("url");

    if (parsed.pathname.startsWith("/_next/image") && nestedUrl) {
      return decodeURIComponent(nestedUrl);
    }

    return parsed.toString();
  } catch {
    return input;
  }
}

function resolvePreferredImageSource(event: RankedEvent): string | undefined {
  if (event.eventId === "netanyahu-out-before-2027") {
    const localFallback = path.resolve("tmp-netanyahu.jpg");
    if (fs.existsSync(localFallback)) {
      return localFallback;
    }
  }

  if (event.eventId === "2026-seoul-mayoral-election-winner") {
    const localFallback = path.resolve("tmp-seoul.jpg");
    if (fs.existsSync(localFallback)) {
      return localFallback;
    }
  }

  if (event.eventId === "next-prime-minister-of-hungary") {
    const localFallback = path.resolve("tmp-hungary-small.jpg");
    if (fs.existsSync(localFallback)) {
      return localFallback;
    }
  }

  if (event.eventId === "california-governor-election-2026") {
    const localFallback = path.resolve("tmp-california.png");
    if (fs.existsSync(localFallback)) {
      return localFallback;
    }
  }

  if (event.eventId === "colombia-presidential-election") {
    const localFallback = path.resolve("tmp-colombia.png");
    if (fs.existsSync(localFallback)) {
      return localFallback;
    }
  }

  if (event.eventId === "nobel-peace-prize-winner-2026-139") {
    const localFallback = path.resolve("tmp-nobel.jpg");
    if (fs.existsSync(localFallback)) {
      return localFallback;
    }
  }

  return event.thumbnailUrl ?? event.iconUrl;
}

function toFileImageUrl(inputPath: string): string {
  const extension = path.extname(inputPath).toLowerCase();
  const mimeType =
    extension === ".jpg" || extension === ".jpeg" ? "image/jpeg" :
    extension === ".webp" ? "image/webp" :
    "image/png";
  const bytes = fs.readFileSync(inputPath);
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}
