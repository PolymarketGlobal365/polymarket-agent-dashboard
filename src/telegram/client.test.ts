import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { TelegramClient } from "./client.js";

test("TelegramClient sends expected payload to sendMessage", async () => {
  let capturedUrl = "";
  let capturedBody = "";

  const client = new TelegramClient({
    botToken: "test-token",
    fetchImpl: async (input, init) => {
      capturedUrl = String(input);
      capturedBody = String(init?.body ?? "");

      return new Response(
        JSON.stringify({
          ok: true,
          result: {
            message_id: 42,
          },
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    },
  });

  const messageId = await client.sendMessage({
    chatId: "-10012345",
    text: "hello world",
    messageThreadId: 77,
  });

  assert.equal(messageId, 42);
  assert.equal(capturedUrl, "https://api.telegram.org/bottest-token/sendMessage");
  assert.match(capturedBody, /"chat_id":"-10012345"/);
  assert.match(capturedBody, /"text":"hello world"/);
  assert.match(capturedBody, /"message_thread_id":77/);
});

test("TelegramClient sends expected payload to sendPhoto", async () => {
  let capturedUrl = "";
  let capturedBody = "";

  const client = new TelegramClient({
    botToken: "test-token",
    fetchImpl: async (input, init) => {
      capturedUrl = String(input);
      capturedBody = String(init?.body ?? "");

      return new Response(
        JSON.stringify({
          ok: true,
          result: {
            message_id: 84,
          },
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    },
  });

  const messageId = await client.sendPhoto({
    chatId: "-10012345",
    photo: "https://images.polymarket.com/sol.png",
    caption: "솔라나 이벤트",
    messageThreadId: 88,
  });

  assert.equal(messageId, 84);
  assert.equal(capturedUrl, "https://api.telegram.org/bottest-token/sendPhoto");
  assert.match(capturedBody, /"photo":"https:\/\/images\.polymarket\.com\/sol\.png"/);
  assert.match(capturedBody, /"caption":"솔라나 이벤트"/);
  assert.match(capturedBody, /"message_thread_id":88/);
});

test("TelegramClient uploads local photo files with multipart form data", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pm-telegram-client-"));
  const tempFile = path.join(tempDir, "card.png");
  await fs.writeFile(tempFile, Buffer.from([0x89, 0x50, 0x4e, 0x47]));

  let capturedBody: BodyInit | undefined;

  const client = new TelegramClient({
    botToken: "test-token",
    fetchImpl: async (_input, init) => {
      capturedBody = init?.body as BodyInit | undefined;

      return new Response(
        JSON.stringify({
          ok: true,
          result: {
            message_id: 99,
          },
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    },
  });

  const messageId = await client.sendPhoto({
    chatId: "-10012345",
    photo: tempFile,
    caption: "합성 카드",
    messageThreadId: 16,
  });

  assert.equal(messageId, 99);
  assert.ok(capturedBody instanceof FormData);
  assert.equal((capturedBody as FormData).get("chat_id"), "-10012345");
  assert.equal((capturedBody as FormData).get("caption"), "합성 카드");
  assert.equal((capturedBody as FormData).get("message_thread_id"), "16");
  assert.ok((capturedBody as FormData).get("photo") instanceof File);
});

test("TelegramClient sends expected payload to sendMediaGroup", async () => {
  let capturedUrl = "";
  let capturedBody = "";

  const client = new TelegramClient({
    botToken: "test-token",
    fetchImpl: async (input, init) => {
      capturedUrl = String(input);
      capturedBody = String(init?.body ?? "");

      return new Response(
        JSON.stringify({
          ok: true,
          result: [{ message_id: 101 }],
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    },
  });

  const messageId = await client.sendMediaGroup({
    chatId: "-10012345",
    photos: [
      "https://pbs.twimg.com/media/a.jpg?name=large",
      "https://pbs.twimg.com/media/b.jpg?name=large",
    ],
    caption: "번역문",
    messageThreadId: 10,
  });

  assert.equal(messageId, 101);
  assert.equal(capturedUrl, "https://api.telegram.org/bottest-token/sendMediaGroup");
  assert.match(capturedBody, /"chat_id":"-10012345"/);
  assert.match(capturedBody, /"media":\[/);
  assert.match(capturedBody, /"caption":"번역문"/);
  assert.match(capturedBody, /"message_thread_id":10/);
});
