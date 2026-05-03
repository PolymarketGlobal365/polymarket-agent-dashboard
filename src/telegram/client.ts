import fs from "node:fs/promises";
import path from "node:path";

export type TelegramClientOptions = {
  botToken: string;
  apiBaseUrl?: string;
  fetchImpl?: typeof fetch;
};

export type TelegramUpdate = {
  update_id: number;
  message?: {
    message_id?: number;
    message_thread_id?: number;
    text?: string;
    chat?: {
      id?: number | string;
      type?: string;
      title?: string;
    };
    from?: {
      id?: number | string;
      username?: string;
      first_name?: string;
      last_name?: string;
    };
  };
};

export type SendTelegramMessageOptions = {
  chatId: string;
  text: string;
  disableWebPagePreview?: boolean;
  messageThreadId?: number;
  parseMode?: "HTML" | "MarkdownV2";
  replyMarkup?: {
    inline_keyboard: Array<Array<{
      text: string;
      url?: string;
    }>>;
  };
};

export type SendTelegramPhotoOptions = {
  chatId: string;
  photo: string;
  caption?: string;
  messageThreadId?: number;
};

export type SendTelegramMediaGroupOptions = {
  chatId: string;
  photos: string[];
  caption?: string;
  messageThreadId?: number;
};

type TelegramApiResponse = {
  ok?: boolean;
  description?: string;
  result?:
    | {
        message_id?: number;
      }
    | TelegramUpdate[]
    | Array<{
        message_id?: number;
      }>;
};

export class TelegramClient {
  private readonly botToken: string;
  private readonly apiBaseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: TelegramClientOptions) {
    this.botToken = options.botToken;
    this.apiBaseUrl = options.apiBaseUrl ?? "https://api.telegram.org";
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async sendMessage(options: SendTelegramMessageOptions): Promise<number | undefined> {
    return sendWithRetry(
      () => this.fetchImpl(`${this.apiBaseUrl}/bot${this.botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          chat_id: options.chatId,
          text: options.text,
          disable_web_page_preview: options.disableWebPagePreview ?? true,
          ...(options.messageThreadId !== undefined ? { message_thread_id: options.messageThreadId } : {}),
          ...(options.parseMode ? { parse_mode: options.parseMode } : {}),
          ...(options.replyMarkup ? { reply_markup: options.replyMarkup } : {}),
        }),
      }),
      "sendMessage",
    );
  }

  async sendPhoto(options: SendTelegramPhotoOptions): Promise<number | undefined> {
    return sendWithRetry(
      async () => {
        const requestInit = await buildSendPhotoRequest(options);
        return this.fetchImpl(`${this.apiBaseUrl}/bot${this.botToken}/sendPhoto`, requestInit);
      },
      "sendPhoto",
    );
  }

  async sendMediaGroup(options: SendTelegramMediaGroupOptions): Promise<number | undefined> {
    return sendWithRetry(
      () => this.fetchImpl(`${this.apiBaseUrl}/bot${this.botToken}/sendMediaGroup`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          chat_id: options.chatId,
          media: options.photos.map((photo, index) => ({
            type: "photo",
            media: photo,
            ...(index === 0 && options.caption ? { caption: options.caption } : {}),
          })),
          ...(options.messageThreadId !== undefined ? { message_thread_id: options.messageThreadId } : {}),
        }),
      }),
      "sendMediaGroup",
    );
  }

  async getUpdates(options: {
    offset?: number;
    limit?: number;
    timeoutSeconds?: number;
    allowedUpdates?: string[];
  } = {}): Promise<TelegramUpdate[]> {
    const response = await this.fetchImpl(`${this.apiBaseUrl}/bot${this.botToken}/getUpdates`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...(options.offset !== undefined ? { offset: options.offset } : {}),
        ...(options.limit !== undefined ? { limit: options.limit } : {}),
        ...(options.timeoutSeconds !== undefined ? { timeout: options.timeoutSeconds } : {}),
        ...(options.allowedUpdates ? { allowed_updates: options.allowedUpdates } : {}),
      }),
    });

    const payload = (await readJson(response)) as TelegramApiResponse | undefined;
    if (!response.ok || payload?.ok === false) {
      throw new Error(
        `Telegram getUpdates failed with ${response.status}${payload?.description ? `: ${payload.description}` : ""}`,
      );
    }

    return Array.isArray(payload?.result) ? (payload.result as TelegramUpdate[]) : [];
  }
}

async function sendWithRetry(
  sendRequest: () => Promise<Response>,
  methodName: "sendMessage" | "sendPhoto" | "sendMediaGroup",
): Promise<number | undefined> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await sendRequest();
    const payload = (await readJson(response)) as TelegramApiResponse | undefined;

    if (response.ok && payload?.ok !== false) {
      return extractMessageId(payload?.result);
    }

    const retryAfterMs = parseRetryAfterMs(payload?.description);
    if (response.status === 429 && retryAfterMs !== undefined && attempt < 4) {
      await delay(retryAfterMs);
      continue;
    }

    throw new Error(
      `Telegram ${methodName} failed with ${response.status}${payload?.description ? `: ${payload.description}` : ""}`,
    );
  }

  return undefined;
}

function extractMessageId(result: unknown): number | undefined {
  if (Array.isArray(result)) {
    const first = result[0] as { message_id?: number } | undefined;
    return first?.message_id;
  }

  if (result && typeof result === "object" && "message_id" in result) {
    return (result as { message_id?: number }).message_id;
  }

  return undefined;
}

async function buildSendPhotoRequest(options: SendTelegramPhotoOptions): Promise<RequestInit> {
  if (await isReadableLocalFile(options.photo)) {
    const form = new FormData();
    const bytes = await fs.readFile(options.photo);
    const fileName = path.basename(options.photo) || "photo.png";
    const photoFile = new File([bytes], fileName, { type: inferMimeType(options.photo) });

    form.set("chat_id", options.chatId);
    form.set("photo", photoFile);
    if (options.caption) {
      form.set("caption", options.caption);
    }
    if (options.messageThreadId !== undefined) {
      form.set("message_thread_id", String(options.messageThreadId));
    }

    return {
      method: "POST",
      body: form,
    };
  }

  return {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      chat_id: options.chatId,
      photo: options.photo,
      ...(options.caption ? { caption: options.caption } : {}),
      ...(options.messageThreadId !== undefined ? { message_thread_id: options.messageThreadId } : {}),
    }),
  };
}

async function isReadableLocalFile(input: string): Promise<boolean> {
  if (!isLikelyLocalPath(input)) {
    return false;
  }

  try {
    const stat = await fs.stat(input);
    return stat.isFile();
  } catch {
    return false;
  }
}

function isLikelyLocalPath(input: string): boolean {
  return path.isAbsolute(input) || input.startsWith(".\\") || input.startsWith("./");
}

function inferMimeType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    default:
      return "image/png";
  }
}

function parseRetryAfterMs(description: string | undefined): number | undefined {
  if (!description) {
    return undefined;
  }

  const match = description.match(/retry after (\d+)/i);
  if (!match) {
    return undefined;
  }

  const seconds = Number.parseInt(match[1] ?? "0", 10);
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return undefined;
  }

  return (seconds + 1) * 1_000;
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}
