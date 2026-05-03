import test from "node:test";
import assert from "node:assert/strict";

import { extractEventPageMeta } from "./event-meta.js";

test("extractEventPageMeta reads og metadata from event html", () => {
  const meta = extractEventPageMeta(`
    <html>
      <head>
        <meta property="og:title" content="Bitcoin price on March 22?" />
        <meta name="description" content="Predict the bitcoin price range." />
        <meta property="og:image" content="https://images.polymarket.com/btc.png" />
      </head>
    </html>
  `);

  assert.equal(meta.title, "Bitcoin price on March 22?");
  assert.equal(meta.description, "Predict the bitcoin price range.");
  assert.equal(meta.imageUrl, "https://images.polymarket.com/btc.png");
});
