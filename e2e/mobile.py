import time
from playwright.sync_api import sync_playwright

errors = []
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    page = b.new_page(viewport={"width": 390, "height": 844})
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.goto("http://localhost:4300/", timeout=120000)
    time.sleep(12)
    print("url:", page.url)
    page.screenshot(path="/home/user/soma/e2e/mobile.png")
    print("body text:", page.inner_text("body")[:300])
    b.close()
print("errors:", [e[:200] for e in errors[:8]])
