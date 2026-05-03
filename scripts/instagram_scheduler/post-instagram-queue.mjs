import fs from "node:fs/promises";
import path from "node:path";
import { execFile as execFileCb } from "node:child_process";
import { promisify } from "node:util";
import { chromium } from "playwright";

const execFile = promisify(execFileCb);

const ROOT = "F:\\bluestateclub";
const STATE_DIR = path.join(ROOT, ".instagram_scheduler");
const CONFIG_PATH = path.join(STATE_DIR, "config.json");
const PASSWORD_PATH = path.join(STATE_DIR, "password.secure.txt");
const STATE_PATH = path.join(STATE_DIR, "state.json");
const LOG_PATH = path.join(STATE_DIR, "run.log");
const USER_DATA_DIR = path.join(STATE_DIR, "chromium-profile");
const LOCK_PATH = path.join(STATE_DIR, "run.lock");

const CADENCE_HOURS = [3, 1, 2, 4, 7];
const SECURITY_PATTERNS = [
  "confirm it's you",
  "help us confirm you own this account",
  "suspicious login attempt",
  "we noticed unusual activity",
  "secure your account",
  "challenge_required",
  "try again later",
  "your account has been temporarily locked",
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function acquireLock() {
  try {
    await fs.writeFile(LOCK_PATH, String(process.pid), { flag: "wx" });
    return true;
  } catch {
    return false;
  }
}

async function releaseLock() {
  await fs.unlink(LOCK_PATH).catch(() => {});
}

async function log(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  await fs.appendFile(LOG_PATH, line, "utf8");
  console.log(message);
}

async function readJson(file, fallback) {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw.replace(/^\uFEFF/, ""));
  } catch {
    return fallback;
  }
}

async function writeJson(file, value) {
  await fs.writeFile(file, JSON.stringify(value, null, 2), "utf8");
}

async function readConfig() {
  const config = await readJson(CONFIG_PATH, null);
  if (!config) throw new Error(`Missing config: ${CONFIG_PATH}`);
  return config;
}

async function readPassword() {
  const ps = `
$secure = Get-Content -LiteralPath '${PASSWORD_PATH.replace(/'/g, "''")}' | ConvertTo-SecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
[Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
`;
  const { stdout } = await execFile("powershell.exe", [
    "-NoProfile",
    "-NonInteractive",
    "-Command",
    ps,
  ]);
  return stdout.trim();
}

async function disableTask(taskName, reason, state) {
  state.enabled = false;
  state.haltedReason = reason;
  await writeJson(STATE_PATH, state);
  try {
    await execFile("schtasks.exe", ["/Change", "/TN", taskName, "/DISABLE"]);
    await log(`Scheduler disabled: ${reason}`);
  } catch (error) {
    await log(`Failed to disable task ${taskName}: ${String(error)}`);
  }
}

async function loadState() {
  const base = {
    enabled: true,
    nextDueAt: new Date().toISOString(),
    intervalIndex: 0,
    postedFolders: [],
    haltedReason: null,
  };
  return await readJson(STATE_PATH, base);
}

async function saveState(state) {
  await writeJson(STATE_PATH, state);
}

function storyFolderCandidate(name) {
  return !name.startsWith(".") && name !== "Adobe Premiere Pro Auto-Save" && name !== "릴스 영상";
}

async function getQueue(state) {
  const entries = await fs.readdir(ROOT, { withFileTypes: true });
  const dirs = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || !storyFolderCandidate(entry.name)) continue;
    const full = path.join(ROOT, entry.name);
    const files = await fs.readdir(full);
    const hasSlides = [1, 2, 3, 4, 5].every((n) => files.includes(`${String(n).padStart(2, "0")}.png`));
    const txt = files.find((file) => file.toLowerCase().endsWith(".txt"));
    if (!hasSlides || !txt) continue;
    const stat = await fs.stat(full);
    dirs.push({ name: entry.name, full, txt, ctimeMs: stat.ctimeMs });
  }
  dirs.sort((a, b) => a.ctimeMs - b.ctimeMs);
  return dirs.filter((dir) => !state.postedFolders.includes(dir.name));
}

async function readCaption(folder, txtFile) {
  return (await fs.readFile(path.join(folder, txtFile), "utf8")).trim();
}

function extractSecurityMessage(text) {
  const lower = text.toLowerCase();
  return SECURITY_PATTERNS.find((pattern) => lower.includes(pattern)) || null;
}

async function checkForSecurityStop(page, config, state, stage) {
  const content = await page.textContent("body").catch(() => "");
  const hit = extractSecurityMessage(content || "");
  if (hit) {
    await disableTask(config.taskName, `Security warning at ${stage}: ${hit}`, state);
    throw new Error(`Security warning detected at ${stage}: ${hit}`);
  }
}

async function loginIfNeeded(page, username, password, config, state) {
  await page.goto("https://www.instagram.com/accounts/login/", { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForTimeout(4000);
  await checkForSecurityStop(page, config, state, "initial load");

  const loginInput = page.locator("input").first();
  if (!(await loginInput.count())) return;

  const emailInput = page.locator("input[name='email']").first();
  const passwordInput = page.locator("input[name='pass']").first();
  if (await emailInput.count()) {
    await emailInput.fill(username, { timeout: 30000 });
    await passwordInput.fill(password, { timeout: 30000 });
    await passwordInput.press("Enter");
    await page.waitForTimeout(12000);
  }

  await checkForSecurityStop(page, config, state, "post-login");
}

async function postFolder(folderInfo, caption, config, state) {
  const username = config.username;
  const password = await readPassword();
  const browser = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: config.headless ?? true,
    viewport: { width: 1400, height: 1000 },
  });

  try {
    const page = browser.pages()[0] || (await browser.newPage());
    await loginIfNeeded(page, username, password, config, state);
    await page.goto("https://www.instagram.com/", { waitUntil: "domcontentloaded", timeout: 120000 });
    await page.waitForTimeout(4000);
    await checkForSecurityStop(page, config, state, "before-create");

    const files = [1, 2, 3, 4, 5].map((n) => path.join(folderInfo.full, `${String(n).padStart(2, "0")}.png`));

    await page.getByLabel("New post").click({ timeout: 30000 });
    await page.waitForTimeout(1500);
    const postChoices = page.locator("a").filter({ hasText: "Post" });
    const postChoiceCount = await postChoices.count();
    if (postChoiceCount) {
      let target = postChoices.nth(postChoiceCount - 1);
      let targetBox = await target.boundingBox().catch(() => null);
      for (let i = 0; i < postChoiceCount; i++) {
        const candidate = postChoices.nth(i);
        const box = await candidate.boundingBox().catch(() => null);
        if (!box) continue;
        if (!targetBox || box.width * box.height > targetBox.width * targetBox.height) {
          target = candidate;
          targetBox = box;
        }
      }
      await target.click({ timeout: 30000 });
    } else {
      const ariaPostChoices = page.getByLabel("Post");
      const ariaCount = await ariaPostChoices.count();
      if (!ariaCount) throw new Error("Could not find Instagram 'Post' menu item.");
      await ariaPostChoices.nth(ariaCount - 1).click({ timeout: 30000 });
    }
    await page.waitForTimeout(1500);

    const [chooser] = await Promise.all([
      page.waitForEvent("filechooser", { timeout: 30000 }),
      page.locator("button").filter({ hasText: "Select from computer" }).first().click({ timeout: 30000 }),
    ]);
    await chooser.setFiles(files);
    await page.waitForTimeout(4000);

    await page.getByLabel("Select crop").click({ timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.getByText("Original", { exact: true }).first().click({ timeout: 30000 });
    await page.waitForTimeout(1000);

    const nextButton = page.getByRole("button", { name: /^next$/i });
    await nextButton.click({ timeout: 30000 });
    await page.waitForTimeout(2000);
    if (await nextButton.count()) {
      await nextButton.click({ timeout: 30000 });
      await page.waitForTimeout(2000);
    }

    const captionBox = page.locator("div[contenteditable='true']").last();
    await captionBox.click({ timeout: 30000 });
    await page.keyboard.insertText(caption);
    await page.waitForTimeout(1000);

    await checkForSecurityStop(page, config, state, "before-share");
    const shareButton = page.getByRole("button", { name: /^share$/i });
    await shareButton.click({ timeout: 30000 });
    await page.waitForTimeout(15000);
    await checkForSecurityStop(page, config, state, "after-share");

    const postedUrl = page.url();
    await log(`Posted folder: ${folderInfo.name} -> ${postedUrl}`);
  } finally {
    await browser.close();
  }
}

async function runOnce() {
  await ensureDir(STATE_DIR);
  if (!(await acquireLock())) {
    await log("Another scheduler run is already in progress.");
    return;
  }

  try {
    const config = await readConfig();
    const state = await loadState();

    if (!state.enabled) {
      await log(`Scheduler halted: ${state.haltedReason || "disabled"}`);
      return;
    }

    const now = new Date();
    const dueAt = new Date(state.nextDueAt);
    if (now < dueAt) {
      await log(`Not due yet. Next run at ${dueAt.toISOString()}`);
      return;
    }

    const queue = await getQueue(state);
    if (!queue.length) {
      await log("No queued card-news folders to post.");
      return;
    }

    const nextFolder = queue[0];
    const caption = await readCaption(nextFolder.full, nextFolder.txt);
    await postFolder(nextFolder, caption, config, state);

    state.postedFolders.push(nextFolder.name);
    const hours = CADENCE_HOURS[state.intervalIndex % CADENCE_HOURS.length];
    state.intervalIndex = (state.intervalIndex + 1) % CADENCE_HOURS.length;
    state.lastPostedAt = now.toISOString();
    state.nextDueAt = new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();
    await saveState(state);
    await log(`Next post scheduled for ${state.nextDueAt}`);
  } finally {
    await releaseLock();
  }
}

runOnce().catch(async (error) => {
  await ensureDir(STATE_DIR);
  await log(`Run failed: ${error.stack || String(error)}`);
  process.exit(1);
});
