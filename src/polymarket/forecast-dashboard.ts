import type { RewardTradingSignal, RewardTradingSnapshot } from "./trading-bot.js";

export type ForecastAgentProfile = {
  agentName: string;
  provider: string;
  model: string;
  strategy: string;
  riskStyle: "conservative" | "balanced" | "aggressive";
  voiceNote?: string;
};

export type ForecastDashboardConfig = {
  title: string;
  subtitle: string;
  accent: "green" | "cyan" | "amber";
  agent: ForecastAgentProfile;
};

export type ForecastDashboardCard = {
  rank: number;
  marketQuestion: string;
  eventTitle: string;
  eventUrl: string;
  outcomeLabel: string;
  probability: number;
  spreadCents: number;
  rewardDailyRate: number;
  liquidityLabel: string;
  biasLabel: string;
  actionLabel: string;
  confidenceLabel: string;
  rationale: string;
  tags: string[];
};

export type ForecastDashboardViewModel = {
  generatedAt: string;
  title: string;
  subtitle: string;
  accent: ForecastDashboardConfig["accent"];
  agent: ForecastAgentProfile;
  topProbability: number;
  averageProbability: number;
  bullishCount: number;
  bearishCount: number;
  scannedMarkets: number;
  shortlistedMarkets: number;
  cards: ForecastDashboardCard[];
  deskHeadline: string;
  deskSummary: string;
};

export function buildForecastDashboardViewModel(
  snapshot: RewardTradingSnapshot,
  config: ForecastDashboardConfig,
): ForecastDashboardViewModel {
  const cards = snapshot.signals.slice(0, 6).map((signal, index) => toCard(signal, index + 1));
  const probabilities = cards.map((card) => card.probability);
  const topProbability = Math.max(...probabilities, 0);
  const averageProbability = probabilities.length > 0
    ? probabilities.reduce((sum, value) => sum + value, 0) / probabilities.length
    : 0;
  const bullishCount = cards.filter((card) => card.biasLabel === "Bullish").length;
  const bearishCount = cards.filter((card) => card.biasLabel === "Bearish").length;

  return {
    generatedAt: snapshot.generatedAt,
    title: config.title,
    subtitle: config.subtitle,
    accent: config.accent,
    agent: config.agent,
    topProbability,
    averageProbability,
    bullishCount,
    bearishCount,
    scannedMarkets: snapshot.scannedMarkets,
    shortlistedMarkets: snapshot.shortlistedMarkets,
    cards,
    deskHeadline: buildDeskHeadline(cards, config.agent),
    deskSummary: buildDeskSummary(cards, config.agent),
  };
}

export function renderForecastDashboardHtml(model: ForecastDashboardViewModel): string {
  const accent = accentPalette(model.accent);
  const generatedLabel = formatDateTime(model.generatedAt);
  const cardsHtml = model.cards.map((card) => renderCard(card, accent)).join("\n");

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(model.title)}</title>
    <style>
      :root {
        --bg: #07110f;
        --bg-soft: #0b1b17;
        --panel: rgba(8, 17, 15, 0.84);
        --panel-strong: rgba(4, 10, 9, 0.94);
        --line: rgba(112, 255, 207, 0.22);
        --line-strong: rgba(112, 255, 207, 0.5);
        --text: #eefbf6;
        --muted: #8fb2a8;
        --danger: #ff6d78;
        --warning: #f7ca63;
        --accent: ${accent.main};
        --accent-soft: ${accent.soft};
        --accent-strong: ${accent.strong};
      }
      * { box-sizing: border-box; }
      html, body { margin: 0; min-height: 100%; background: var(--bg); color: var(--text); }
      body {
        font-family: "IBM Plex Mono", "Consolas", "SFMono-Regular", monospace;
        background:
          radial-gradient(circle at top left, rgba(74, 255, 199, 0.14), transparent 28%),
          radial-gradient(circle at top right, rgba(0, 182, 255, 0.12), transparent 22%),
          linear-gradient(180deg, #07110f 0%, #030605 100%);
      }
      body::before {
        content: "";
        position: fixed;
        inset: 0;
        background-image:
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
        background-size: 36px 36px;
        opacity: 0.35;
        pointer-events: none;
      }
      .shell {
        position: relative;
        max-width: 1500px;
        margin: 0 auto;
        padding: 28px;
      }
      .topbar {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: center;
        margin-bottom: 20px;
        padding: 14px 18px;
        border: 1px solid var(--line);
        background: rgba(5, 14, 12, 0.78);
        box-shadow: 0 0 0 1px rgba(255,255,255,0.02) inset, 0 20px 40px rgba(0,0,0,0.24);
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }
      .dot {
        width: 12px;
        height: 12px;
        border-radius: 999px;
        background: var(--accent);
        box-shadow: 0 0 18px var(--accent);
      }
      .eyebrow {
        color: var(--accent);
        font-size: 12px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        margin-bottom: 6px;
      }
      h1 {
        margin: 0;
        font-size: clamp(28px, 4vw, 50px);
        line-height: 1.02;
        letter-spacing: -0.05em;
      }
      .subtitle {
        margin-top: 8px;
        color: var(--muted);
        font-size: 14px;
      }
      .stamp {
        text-align: right;
        color: var(--muted);
        font-size: 13px;
        line-height: 1.7;
      }
      .grid {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 20px;
      }
      .panel {
        border: 1px solid var(--line);
        background: var(--panel);
        box-shadow: 0 16px 36px rgba(0,0,0,0.28);
        backdrop-filter: blur(10px);
      }
      .hero {
        padding: 22px;
        min-height: 260px;
      }
      .hero-grid {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 18px;
      }
      .terminal {
        padding: 18px;
        border: 1px solid rgba(255,255,255,0.05);
        background: linear-gradient(180deg, rgba(8,17,15,0.92), rgba(5,10,9,0.96));
      }
      .terminal-line {
        color: #d6f7eb;
        font-size: 14px;
        line-height: 1.75;
      }
      .terminal-line strong { color: var(--accent); }
      .stat-stack {
        display: grid;
        gap: 12px;
      }
      .stat {
        padding: 16px 18px;
        border: 1px solid rgba(255,255,255,0.05);
        background: rgba(255,255,255,0.03);
      }
      .stat-label {
        color: var(--muted);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.14em;
      }
      .stat-value {
        margin-top: 10px;
        font-size: clamp(26px, 3vw, 40px);
        font-weight: 700;
      }
      .stat-note {
        margin-top: 8px;
        font-size: 13px;
        color: var(--muted);
      }
      .agent-panel {
        padding: 22px;
      }
      .agent-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-bottom: 18px;
      }
      .agent-name {
        font-size: 22px;
        font-weight: 700;
      }
      .pill {
        padding: 7px 12px;
        border: 1px solid var(--line-strong);
        color: var(--accent);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
      }
      .agent-meta,
      .agent-strategy {
        color: var(--muted);
        font-size: 14px;
        line-height: 1.7;
      }
      .agent-list {
        display: grid;
        gap: 10px;
        margin-top: 16px;
      }
      .agent-item {
        padding: 12px 14px;
        border-left: 2px solid var(--accent);
        background: rgba(255,255,255,0.03);
        font-size: 13px;
      }
      .cards {
        display: grid;
        gap: 16px;
        margin-top: 20px;
      }
      .card {
        padding: 18px;
      }
      .card-top {
        display: flex;
        justify-content: space-between;
        gap: 18px;
        align-items: flex-start;
      }
      .rank {
        color: var(--accent);
        font-size: 14px;
        margin-bottom: 8px;
      }
      .market {
        font-size: 24px;
        line-height: 1.25;
        margin: 0;
      }
      .event {
        margin-top: 8px;
        color: var(--muted);
        font-size: 13px;
      }
      .probability {
        min-width: 180px;
        text-align: right;
      }
      .probability-value {
        font-size: clamp(38px, 4vw, 56px);
        line-height: 0.95;
        color: var(--accent);
        text-shadow: 0 0 26px rgba(0,0,0,0.3);
      }
      .probability-label {
        margin-top: 10px;
        color: var(--muted);
        font-size: 13px;
      }
      .bar {
        margin-top: 16px;
        height: 12px;
        background: rgba(255,255,255,0.06);
        overflow: hidden;
      }
      .fill {
        height: 100%;
        background: linear-gradient(90deg, var(--accent-strong), var(--accent));
        box-shadow: 0 0 20px rgba(0,0,0,0.24);
      }
      .meta-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
        margin-top: 16px;
      }
      .meta {
        padding: 12px;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.04);
      }
      .meta-key {
        color: var(--muted);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
      }
      .meta-value {
        margin-top: 8px;
        font-size: 16px;
      }
      .rationale {
        margin-top: 16px;
        color: #dcefe8;
        font-size: 14px;
        line-height: 1.7;
      }
      .footer-link {
        display: inline-block;
        margin-top: 14px;
        color: var(--accent);
        text-decoration: none;
        font-size: 13px;
      }
      @media (max-width: 1100px) {
        .grid,
        .hero-grid,
        .meta-grid {
          grid-template-columns: 1fr;
        }
        .probability {
          min-width: 0;
          text-align: left;
        }
        .card-top,
        .topbar,
        .agent-header {
          display: block;
        }
        .stamp {
          margin-top: 14px;
          text-align: left;
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <section class="topbar panel">
        <div class="brand">
          <span class="dot"></span>
          <div>
            <div class="eyebrow">AI Forecast Desk</div>
            <h1>${escapeHtml(model.title)}</h1>
            <div class="subtitle">${escapeHtml(model.subtitle)}</div>
          </div>
        </div>
        <div class="stamp">
          Generated: ${escapeHtml(generatedLabel)}<br />
          Scanned ${model.scannedMarkets} markets / shortlisted ${model.shortlistedMarkets}
        </div>
      </section>
      <section class="grid">
        <div class="hero panel">
          <div class="hero-grid">
            <div class="terminal">
              <div class="eyebrow">Desk Readout</div>
              <div class="terminal-line"><strong>${escapeHtml(model.deskHeadline)}</strong></div>
              <div class="terminal-line">${escapeHtml(model.deskSummary)}</div>
              <div class="terminal-line">Primary bias split: ${model.bullishCount} bullish / ${model.bearishCount} bearish</div>
              <div class="terminal-line">Execution tone: ${escapeHtml(riskStyleLabel(model.agent.riskStyle))}</div>
            </div>
            <div class="stat-stack">
              <div class="stat">
                <div class="stat-label">Top win rate</div>
                <div class="stat-value">${formatPercent(model.topProbability)}</div>
                <div class="stat-note">Highest probability across current shortlist</div>
              </div>
              <div class="stat">
                <div class="stat-label">Average win rate</div>
                <div class="stat-value">${formatPercent(model.averageProbability)}</div>
                <div class="stat-note">Mean conviction across the displayed board</div>
              </div>
            </div>
          </div>
        </div>
        <aside class="agent-panel panel">
          <div class="agent-header">
            <div>
              <div class="eyebrow">User Agent</div>
              <div class="agent-name">${escapeHtml(model.agent.agentName)}</div>
            </div>
            <div class="pill">${escapeHtml(model.agent.provider)} / ${escapeHtml(model.agent.model)}</div>
          </div>
          <div class="agent-meta">This dashboard is ready for a user-selected AI agent layer and can be extended with live model commentary.</div>
          <div class="agent-list">
            <div class="agent-item">Strategy: ${escapeHtml(model.agent.strategy)}</div>
            <div class="agent-item">Risk profile: ${escapeHtml(riskStyleLabel(model.agent.riskStyle))}</div>
            <div class="agent-item">Voice note: ${escapeHtml(model.agent.voiceNote ?? "냉정한 트레이딩 데스크 톤으로 브리핑")}</div>
          </div>
          <div class="agent-strategy" style="margin-top: 16px;">
            Next, you can connect a real model provider such as OpenAI, Claude, or Gemini to generate card-by-card commentary automatically.
          </div>
        </aside>
      </section>
      <section class="cards">
        ${cardsHtml}
      </section>
    </main>
  </body>
</html>`;
}

function toCard(signal: RewardTradingSignal, rank: number): ForecastDashboardCard {
  const probability = signal.outcomeLabel.toLowerCase() === "yes"
    ? signal.midpoint * 100
    : (1 - signal.midpoint) * 100;

  return {
    rank,
    marketQuestion: signal.marketQuestion,
    eventTitle: signal.eventTitle,
    eventUrl: signal.eventUrl,
    outcomeLabel: signal.outcomeLabel,
    probability,
    spreadCents: signal.displayedSpreadCents,
    rewardDailyRate: signal.rewardDailyRate,
    liquidityLabel: formatCompactUsd(signal.rewardMinSize),
    biasLabel: formatBias(signal.bias),
    actionLabel: signal.action === "passive-entry" ? "Passive entry" : "Watch only",
    confidenceLabel: probability >= 65 ? "High conviction" : probability >= 56 ? "Tradeable edge" : "Tactical watch",
    rationale: signal.headlineReason,
    tags: signal.tags.slice(0, 4),
  };
}

function buildDeskHeadline(cards: ForecastDashboardCard[], agent: ForecastAgentProfile): string {
  const first = cards[0];
  if (!first) {
    return `${agent.agentName} is waiting for fresh signal flow.`;
  }

  return `${agent.agentName} favors ${first.outcomeLabel.toUpperCase()} on "${first.marketQuestion}" at ${formatPercent(first.probability)}.`;
}

function buildDeskSummary(cards: ForecastDashboardCard[], agent: ForecastAgentProfile): string {
  if (cards.length === 0) {
    return "No active candidates met the current thresholds.";
  }

  const avg = cards.reduce((sum, card) => sum + card.probability, 0) / cards.length;
  return `Using the strategy "${agent.strategy}", the desk shortlisted ${cards.length} signals with an average projected win rate of ${formatPercent(avg)}.`;
}

function renderCard(card: ForecastDashboardCard, accent: ReturnType<typeof accentPalette>): string {
  return `<article class="card panel">
    <div class="card-top">
      <div>
        <div class="rank">Signal ${card.rank.toString().padStart(2, "0")}</div>
        <h2 class="market">${escapeHtml(card.marketQuestion)}</h2>
        <div class="event">${escapeHtml(card.eventTitle)} · ${escapeHtml(card.outcomeLabel)} lane</div>
      </div>
      <div class="probability">
        <div class="probability-value">${formatPercent(card.probability)}</div>
        <div class="probability-label">${escapeHtml(card.confidenceLabel)}</div>
      </div>
    </div>
    <div class="bar"><div class="fill" style="width:${clamp(card.probability, 0, 100)}%; background: linear-gradient(90deg, ${accent.strong}, ${accent.main});"></div></div>
    <div class="meta-grid">
      <div class="meta"><div class="meta-key">Bias</div><div class="meta-value">${escapeHtml(card.biasLabel)}</div></div>
      <div class="meta"><div class="meta-key">Action</div><div class="meta-value">${escapeHtml(card.actionLabel)}</div></div>
      <div class="meta"><div class="meta-key">Reward/day</div><div class="meta-value">$${card.rewardDailyRate.toFixed(2)}</div></div>
      <div class="meta"><div class="meta-key">Spread</div><div class="meta-value">${card.spreadCents.toFixed(1)}c</div></div>
    </div>
    <div class="meta-grid">
      <div class="meta"><div class="meta-key">Min size</div><div class="meta-value">${escapeHtml(card.liquidityLabel)}</div></div>
      <div class="meta"><div class="meta-key">Tags</div><div class="meta-value">${escapeHtml(card.tags.join(", ") || "none")}</div></div>
      <div class="meta"><div class="meta-key">Desk tone</div><div class="meta-value">${escapeHtml(card.confidenceLabel)}</div></div>
      <div class="meta"><div class="meta-key">Outcome</div><div class="meta-value">${escapeHtml(card.outcomeLabel)}</div></div>
    </div>
    <div class="rationale">${escapeHtml(card.rationale)}</div>
    <a class="footer-link" href="${escapeHtml(card.eventUrl)}" target="_blank" rel="noreferrer">Open market</a>
  </article>`;
}

function accentPalette(accent: ForecastDashboardConfig["accent"]) {
  switch (accent) {
    case "cyan":
      return { main: "#46d8ff", soft: "rgba(70,216,255,0.16)", strong: "#1180ff" };
    case "amber":
      return { main: "#ffc860", soft: "rgba(255,200,96,0.16)", strong: "#ff8f1f" };
    case "green":
    default:
      return { main: "#65ffbf", soft: "rgba(101,255,191,0.18)", strong: "#1fe082" };
  }
}

function formatBias(bias: RewardTradingSignal["bias"]): string {
  switch (bias) {
    case "bullish":
      return "Bullish";
    case "bearish":
      return "Bearish";
    default:
      return "Neutral";
  }
}

function riskStyleLabel(riskStyle: ForecastAgentProfile["riskStyle"]): string {
  switch (riskStyle) {
    case "conservative":
      return "Conservative";
    case "aggressive":
      return "Aggressive";
    default:
      return "Balanced";
  }
}

function formatCompactUsd(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function formatDateTime(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}
