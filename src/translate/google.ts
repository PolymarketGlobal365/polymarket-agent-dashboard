import { cleanText } from "../lib/strings.js";

const DEFAULT_ENDPOINT = "https://translate.googleapis.com/translate_a/single";

type GoogleTranslatePayload = [
  Array<[string, string, ...unknown[]]>,
  unknown?,
  string?,
  unknown?,
  unknown?,
  unknown?,
  unknown?,
  unknown?,
];

export async function translateText(
  input: string,
  options: {
    to?: string;
    from?: string;
    endpoint?: string;
    fetchImpl?: typeof fetch;
  } = {},
): Promise<string> {
  const text = cleanText(input);
  if (!text) {
    return "";
  }

  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
  const from = options.from ?? "auto";
  const to = options.to ?? "ko";
  const fetchImpl = options.fetchImpl ?? fetch;
  const url = new URL(endpoint);

  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", from);
  url.searchParams.set("tl", to);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);

  const response = await fetchImpl(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Translation failed with ${response.status}.`);
  }

  return parseGoogleTranslatePayload((await response.json()) as GoogleTranslatePayload);
}

export function parseGoogleTranslatePayload(payload: GoogleTranslatePayload): string {
  const segments = Array.isArray(payload[0]) ? payload[0] : [];
  const translated = segments
    .map((segment) => segment[0] ?? "")
    .join("")
    .replace(/\s+/g, " ")
    .trim();

  if (!translated) {
    throw new Error("Translation payload did not contain any text.");
  }

  return translated;
}
