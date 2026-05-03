import { TIMEZONE } from "../config.js";
import { formatProbability, formatTraderLabel, formatUsdCompact, type WhaleAlert } from "../polymarket/whales.js";

export function buildWhaleAlertMessage(alert: WhaleAlert): string {
  const lines = [
    "🐋 Polymarket Whale Alert",
    `${formatSide(alert.side)} ${formatUsdCompact(alert.usdcSize)}`,
    "",
    `트레이더: ${escapeHtml(formatTraderLabel(alert))}`,
    `시장: ${escapeHtml(alert.marketTitle)}`,
    ...(alert.outcome ? [`포지션: ${escapeHtml(alert.outcome)}`] : []),
    ...(alert.price !== undefined ? [`체결 가격: ${escapeHtml(formatProbability(alert.price) ?? "")}`] : []),
    `시각: ${formatKoreanTimestamp(alert.timestamp)}`,
    ...buildTraderStats(alert),
    "",
    `<b>👉🏻 ${escapeHtml(buildInterpretation(alert))}</b>`,
  ];

  return lines.join("\n");
}

export function buildWhaleAlertMessages(alerts: WhaleAlert[]): string[] {
  return alerts.map((alert) => buildWhaleAlertMessage(alert));
}

function formatSide(side: WhaleAlert["side"]): string {
  if (side === "BUY") {
    return "🟢 BUY";
  }
  if (side === "SELL") {
    return "🔴 SELL";
  }

  return "⚪ UNKNOWN";
}

function buildTraderStats(alert: WhaleAlert): string[] {
  const stats: string[] = [];

  if (alert.leaderboardRank) {
    stats.push(`리더보드: #${escapeHtml(alert.leaderboardRank)}`);
  }
  if (alert.leaderboardPnl !== undefined) {
    stats.push(`누적 PnL: ${escapeHtml(formatUsdCompact(alert.leaderboardPnl))}`);
  }
  if (alert.leaderboardVolume !== undefined) {
    stats.push(`누적 거래량: ${escapeHtml(formatUsdCompact(alert.leaderboardVolume))}`);
  }

  return stats;
}

function buildInterpretation(alert: WhaleAlert): string {
  const outcomeText = alert.outcome ? `'${alert.outcome}' ` : "";
  if (alert.side === "BUY") {
    return `시장 상위 트레이더가 ${outcomeText}방향에 새 자금을 얹었습니다. 가격이 추가로 밀리는지 확인할 구간입니다.`;
  }
  if (alert.side === "SELL") {
    return `시장 상위 트레이더가 ${outcomeText}포지션을 줄였습니다. 단기 확률 둔화 신호인지 체크할 구간입니다.`;
  }

  return "체결은 확인됐지만 방향성은 추가 데이터와 함께 해석하는 편이 안전합니다.";
}

function formatKoreanTimestamp(input: number): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(input * 1_000));
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
