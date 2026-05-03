import { MAX_EVENTS_PER_RUN } from "../config.js";
import { jaccardSimilarity, keywordsOf, parseVolumeToMillions } from "../lib/strings.js";
import type { NormalizedEvent, RankedEvent } from "../types.js";

export function selectTopEvents(events: NormalizedEvent[], limit = MAX_EVENTS_PER_RUN): RankedEvent[] {
  const selected: RankedEvent[] = [];
  const remaining = [...events];

  while (selected.length < limit && remaining.length > 0) {
    let bestIndex = 0;
    let bestCandidate: RankedEvent | undefined;

    remaining.forEach((event, index) => {
      const candidate = scoreEvent(event, selected);
      if (!bestCandidate || candidate.selectionScore > bestCandidate.selectionScore) {
        bestCandidate = candidate;
        bestIndex = index;
      }
    });

    if (!bestCandidate) {
      break;
    }

    selected.push(bestCandidate);
    remaining.splice(bestIndex, 1);
  }

  return selected;
}

function scoreEvent(event: NormalizedEvent, selected: RankedEvent[]): RankedEvent {
  const volumeMillions = parseVolumeToMillions(event.volumeText);
  const sectionWeight = Math.max(0.2, 1 - Math.min(event.cardIndex, 10) * 0.08);
  const volumeScore = Math.min(2.5, Math.log10(volumeMillions + 1) * 1.4);
  const probabilities = event.markets.map((market) => market.yesProb);
  const highest = probabilities.length > 0 ? Math.max(...probabilities) : 50;
  const closestToCoinflip = probabilities.length > 0
    ? Math.min(...probabilities.map((value) => Math.abs(50 - value)))
    : 50;
  const probabilitySignal = Math.max(
    Math.abs(highest - 50) / 50,
    1 - closestToCoinflip / 50,
  );
  const freshnessScore = Math.max(0.1, 1 - Math.min(event.cardIndex, 15) * 0.05);
  const diversityBoost = computeDiversityBoost(event, selected);

  return {
    ...event,
    selectionScore: Number(
      (sectionWeight + volumeScore + diversityBoost + probabilitySignal + freshnessScore).toFixed(4),
    ),
    scoreBreakdown: {
      sectionWeight: round(sectionWeight),
      volumeScore: round(volumeScore),
      diversityBoost: round(diversityBoost),
      probabilitySignal: round(probabilitySignal),
      freshnessScore: round(freshnessScore),
    },
  };
}

function computeDiversityBoost(event: NormalizedEvent, selected: RankedEvent[]): number {
  if (selected.length === 0) {
    return 0.8;
  }

  const currentKeywords = keywordsOf(event.eventTitle);
  const similarities = selected.map((chosen) =>
    jaccardSimilarity(currentKeywords, keywordsOf(chosen.eventTitle)),
  );
  const maxSimilarity = similarities.length > 0 ? Math.max(...similarities) : 0;

  return Math.max(0.15, 1 - maxSimilarity);
}

function round(input: number): number {
  return Number(input.toFixed(4));
}
