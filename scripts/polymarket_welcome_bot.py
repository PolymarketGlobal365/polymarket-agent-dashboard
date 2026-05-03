import json
import time
import urllib.parse
import urllib.request
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
CONFIG_PATH = BASE_DIR / "polymarket_welcome_bot_config.json"
STATE_PATH = BASE_DIR / "polymarket_welcome_bot_state.json"
LOG_PATH = BASE_DIR / "polymarket_welcome_bot.log"


def log(message: str) -> None:
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    with LOG_PATH.open("a", encoding="utf-8") as f:
        f.write(f"[{timestamp}] {message}\n")


def load_config() -> dict:
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def load_state() -> dict:
    if not STATE_PATH.exists():
        return {"offset": 0}
    try:
        return json.loads(STATE_PATH.read_text(encoding="utf-8"))
    except Exception:
        return {"offset": 0}


def save_state(state: dict) -> None:
    STATE_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")


def api_request(token: str, method: str, payload: dict | None = None) -> dict:
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = None
    headers = {}
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=data, headers=headers, method="POST" if payload is not None else "GET")
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def build_reply_markup() -> dict:
    return {
        "inline_keyboard": [
            [{"text": "SUPPORT", "url": "https://t.me/c/3971378956/1"}],
            [{"text": "WALLET LEADERBOARD", "url": "https://t.me/c/3971378956/11"}],
            [{"text": "COPYTRADE", "url": "https://t.me/c/3971378956/9"}],
            [{"text": "TRAIDING BOT (PROGRAM)", "url": "https://t.me/c/3971378956/3"}],
            [{"text": "STRATEGIES", "url": "https://t.me/c/3971378956/6"}],
        ]
    }


def get_updates(token: str, offset: int) -> list[dict]:
    query = urllib.parse.urlencode(
        {
            "offset": offset,
            "timeout": 30,
            "allowed_updates": json.dumps(["message"]),
        }
    )
    url = f"https://api.telegram.org/bot{token}/getUpdates?{query}"
    with urllib.request.urlopen(url, timeout=65) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    if not data.get("ok"):
        raise RuntimeError(f"getUpdates failed: {data}")
    return data.get("result", [])


def send_welcome(token: str, chat_id: int | str, text: str) -> None:
    payload = {
        "chat_id": chat_id,
        "text": text,
        "reply_markup": build_reply_markup(),
    }
    result = api_request(token, "sendMessage", payload)
    if not result.get("ok"):
        raise RuntimeError(f"sendMessage failed: {result}")


def main() -> None:
    config = load_config()
    token = config["bot_token"]
    welcome_text = config["welcome_text"]

    me = api_request(token, "getMe")
    if not me.get("ok"):
        raise RuntimeError(f"Bot token validation failed: {me}")
    bot_username = me["result"]["username"]
    log(f"Bot authenticated as @{bot_username}")

    state = load_state()
    offset = int(state.get("offset", 0))
    log(f"Starting polling loop at offset={offset}")

    while True:
        try:
            updates = get_updates(token, offset)
            for update in updates:
                offset = update["update_id"] + 1
                state["offset"] = offset
                save_state(state)

                message = update.get("message")
                if not message:
                    continue

                new_members = message.get("new_chat_members") or []
                if not new_members:
                    continue

                chat = message.get("chat", {})
                chat_id = chat.get("id")
                chat_title = chat.get("title", "")
                if chat_id is None:
                    continue

                member_names = ", ".join(
                    member.get("username") or member.get("first_name") or "new member"
                    for member in new_members
                )
                log(f"New members joined chat_id={chat_id} title={chat_title!r}: {member_names}")
                send_welcome(token, chat_id, welcome_text)
                log(f"Welcome message sent to chat_id={chat_id}")
        except Exception as exc:
            log(f"ERROR: {exc}")
            time.sleep(5)


if __name__ == "__main__":
    main()
