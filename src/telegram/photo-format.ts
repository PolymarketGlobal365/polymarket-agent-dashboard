import { cleanText, truncate } from "../lib/strings.js";
import type { CryptoFeedEvent } from "../polymarket/crypto-feed.js";

export type TelegramPhotoPost = {
  photo?: string;
  caption: string;
  eventUrl: string;
};

const ENTITY_KOREAN_MAP: Record<string, string> = {
  bitcoin: "비트코인",
  ethereum: "이더리움",
  solana: "솔라나",
  xrp: "XRP",
  dogecoin: "도지코인",
  fed: "연준",
  trump: "트럼프",
  biden: "바이든",
};

export function buildCryptoTelegramPhotoPosts(events: CryptoFeedEvent[]): TelegramPhotoPost[] {
  return events.map((event) => ({
    ...(event.thumbnailUrl ? { photo: event.thumbnailUrl } : {}),
    caption: buildCaption(event),
    eventUrl: event.eventUrl,
  }));
}

function buildCaption(event: CryptoFeedEvent): string {
  const lines = [
    "🟢데일리 폴리마켓 이벤트🟢",
    localizeEventTitle(event.eventTitle),
    `원문 보기: ${event.eventUrl}`,
  ];

  return truncate(lines.join("\n"), 900);
}

function localizeEventTitle(title: string): string {
  const normalized = cleanText(title);
  if (!normalized) {
    return "폴리마켓 이벤트";
  }

  const priceHitMatch = normalized.match(/^what price will (bitcoin|ethereum|solana|xrp|dogecoin) hit in (.+)\?$/i);
  if (priceHitMatch) {
    const asset = toKoreanEntity(priceHitMatch[1] ?? "");
    return `${asset} 가격은 ${localizeTimePhrase(priceHitMatch[2] ?? "")}에 어디까지 갈까?`;
  }

  const priceOnMatch = normalized.match(/^(bitcoin|ethereum|solana|xrp|dogecoin) price on (.+)\?$/i);
  if (priceOnMatch) {
    const asset = toKoreanEntity(priceOnMatch[1] ?? "");
    return `${asset} 가격은 ${localizeTimePhrase(priceOnMatch[2] ?? "")}에 얼마일까?`;
  }

  const upOrDownMatch = normalized.match(/^(bitcoin|ethereum|solana|xrp|dogecoin) up or down(?: -)? (.+)\?$/i);
  if (upOrDownMatch) {
    const asset = toKoreanEntity(upOrDownMatch[1] ?? "");
    return `${asset}은 ${localizeTimePhrase(upOrDownMatch[2] ?? "")}에 오를까, 내릴까?`;
  }

  const aboveMatch = normalized.match(/^(bitcoin|ethereum|solana|xrp|dogecoin) above (.+)\?$/i);
  if (aboveMatch) {
    const asset = toKoreanEntity(aboveMatch[1] ?? "");
    return `${asset}이 ${cleanNumericPhrase(aboveMatch[2] ?? "")} 돌파할까?`;
  }

  const willHitByMatch = normalized.match(/^will (bitcoin|ethereum|solana|xrp|dogecoin) hit (.+) by (.+)\?$/i);
  if (willHitByMatch) {
    const asset = toKoreanEntity(willHitByMatch[1] ?? "");
    return `${asset}이 ${localizeTimePhrase(willHitByMatch[3] ?? "")} 전에 ${cleanNumericPhrase(willHitByMatch[2] ?? "")} 도달할까?`;
  }

  const launchMatch = normalized.match(/^what day will the (.+?) launch be\?$/i);
  if (launchMatch) {
    return `${cleanText(launchMatch[1] ?? "")} 출시는 언제일까?`;
  }

  const democraticNomineeMatch = normalized.match(/^democratic presidential nominee (\d{4})$/i);
  if (democraticNomineeMatch) {
    return `${democraticNomineeMatch[1]}년 민주당 대선 후보는 누가 될까?`;
  }

  const republicanNomineeMatch = normalized.match(/^republican presidential nominee (\d{4})$/i);
  if (republicanNomineeMatch) {
    return `${republicanNomineeMatch[1]}년 공화당 대선 후보는 누가 될까?`;
  }

  const presidentialWinnerMatch = normalized.match(/^presidential election winner (\d{4})$/i);
  if (presidentialWinnerMatch) {
    return `${presidentialWinnerMatch[1]}년 미국 대선 승자는 누가 될까?`;
  }

  const allTimeHighMatch = normalized.match(/^(bitcoin|ethereum|solana|xrp|dogecoin) all time high by (.+)\?$/i);
  if (allTimeHighMatch) {
    const asset = toKoreanEntity(allTimeHighMatch[1] ?? "");
    return `${asset} 신고가는 ${localizeTimePhrase(allTimeHighMatch[2] ?? "")} 안에 나올까?`;
  }

  const willMatch = normalized.match(/^will (.+)\?$/i);
  if (willMatch) {
    return `${translateCommonTerms(cleanText(willMatch[1] ?? ""))}될까?`;
  }

  return translateCommonTerms(normalized);
}

function toKoreanEntity(input: string): string {
  const key = cleanText(input).toLowerCase();
  return ENTITY_KOREAN_MAP[key] ?? cleanText(input);
}

function localizeTimePhrase(input: string): string {
  const normalized = cleanText(input);

  return normalized
    .replace(/\bby end of /gi, "")
    .replace(/\bby /gi, "")
    .replace(/\bin /gi, "")
    .replace(/\bMarch\b/gi, "3월")
    .replace(/\bApril\b/gi, "4월")
    .replace(/\bMay\b/gi, "5월")
    .replace(/\bJune\b/gi, "6월")
    .replace(/\bJuly\b/gi, "7월")
    .replace(/\bAugust\b/gi, "8월")
    .replace(/\bSeptember\b/gi, "9월")
    .replace(/\bOctober\b/gi, "10월")
    .replace(/\bNovember\b/gi, "11월")
    .replace(/\bDecember\b/gi, "12월")
    .replace(/\bJanuary\b/gi, "1월")
    .replace(/\bFebruary\b/gi, "2월")
    .replace(/(\d{1,2})월 (\d{1,2})(?!\d)/g, "$1월 $2일")
    .replace(/(\d{4})/g, "$1년")
    .replace(/(\d{1,2})년\s+(\d{1,2})/g, "$1년 $2")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanNumericPhrase(input: string): string {
  return cleanText(input).replace(/\s+/g, " ");
}

function translateCommonTerms(input: string): string {
  return cleanText(input)
    .replace(/\bBitcoin\b/gi, "비트코인")
    .replace(/\bEthereum\b/gi, "이더리움")
    .replace(/\bSolana\b/gi, "솔라나")
    .replace(/\bDogecoin\b/gi, "도지코인")
    .replace(/\bXRP\b/gi, "XRP")
    .replace(/\bFed\b/gi, "연준")
    .replace(/\bTrump\b/gi, "트럼프")
    .replace(/\bBiden\b/gi, "바이든")
    .replace(/\blaunch\b/gi, "출시")
    .replace(/\bdrop out\b/gi, "사퇴")
    .replace(/\bwin\b/gi, "승리")
    .replace(/\bWorld Cup\b/gi, "월드컵")
    .replace(/\belection\b/gi, "선거")
    .replace(/\s+/g, " ")
    .trim();
}
