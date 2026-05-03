export function cleanText(input: string | null | undefined): string {
  return (input ?? "").replace(/\s+/g, " ").trim();
}

export function slugify(input: string): string {
  return cleanText(input)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function uniq<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

export function truncate(input: string, max: number): string {
  if (input.length <= max) {
    return input;
  }

  return `${input.slice(0, Math.max(0, max - 3)).trimEnd()}...`;
}

export function parsePercent(text: string | undefined): number | undefined {
  if (!text) {
    return undefined;
  }

  const match = text.match(/(\d+(?:\.\d+)?)\s*%/);
  if (!match) {
    return undefined;
  }

  return Number.parseFloat(match[1] ?? "0");
}

export function parseVolumeToMillions(text: string | undefined): number {
  if (!text) {
    return 0;
  }

  const match = text.replace(/,/g, "").match(/\$?(\d+(?:\.\d+)?)\s*([KMBT]?)/i);
  if (!match) {
    return 0;
  }

  const value = Number.parseFloat(match[1] ?? "0");
  const unit = match[2]?.toUpperCase() ?? "";
  const multiplier =
    unit === "T" ? 1_000_000 :
    unit === "B" ? 1_000 :
    unit === "M" ? 1 :
    unit === "K" ? 0.001 :
    0.000001;

  return value * multiplier;
}

export function formatUsdCompact(input: number | undefined): string | undefined {
  if (input === undefined || !Number.isFinite(input)) {
    return undefined;
  }

  const absolute = Math.abs(input);
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: absolute >= 100 ? 0 : 1,
    minimumFractionDigits: 0,
  });

  if (absolute >= 1_000_000_000) {
    return `$${formatter.format(input / 1_000_000_000)}B Vol.`;
  }

  if (absolute >= 1_000_000) {
    return `$${formatter.format(input / 1_000_000)}M Vol.`;
  }

  if (absolute >= 1_000) {
    return `$${formatter.format(input / 1_000)}K Vol.`;
  }

  return `$${formatter.format(input)} Vol.`;
}

export function toAbsoluteUrl(input: string, baseUrl: string): string {
  try {
    return new URL(input, baseUrl).toString();
  } catch {
    return input;
  }
}

export function keywordsOf(title: string): string[] {
  return uniq(
    cleanText(title)
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter((part) => part.length >= 3),
  );
}

export function jaccardSimilarity(a: string[], b: string[]): number {
  const left = new Set(a);
  const right = new Set(b);
  const union = new Set([...left, ...right]);

  if (union.size === 0) {
    return 0;
  }

  let intersection = 0;
  for (const item of left) {
    if (right.has(item)) {
      intersection += 1;
    }
  }

  return intersection / union.size;
}
