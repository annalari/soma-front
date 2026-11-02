import time, random
from playwright.sync_api import sync_playwright

BASE = "http://localhost:4200"
email = f"teste{random.randint(100000,999999)}@example.com"
errors = []

with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    page = b.new_page()
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.goto(f"{BASE}/entrar")
    page.get_by_role("button", name="Criar conta").first.click()
    page.get_by_label("Nome").fill("Teste")
    page.get_by_label("Email").fill(email)
    page.get_by_label("Palavra-passe").fill("segredo12345")
    page.locator("form button[type=submit]").click()
    page.wait_for_url("**/app", timeout=15000)
    print("1 signed up, at", page.url)
    page.screenshot(path="/home/user/soma/e2e/app.png", full_page=True)

    page.goto(f"{BASE}/app")
    time.sleep(1)
    print("2 /app after reload:", page.url)

    page.get_by_role("button", name="Sair", exact=False).first.click()
    time.sleep(1.5)
    page.goto(f"{BASE}/app")
    page.wait_for_url("**/entrar", timeout=15000)
    print("3 after sign out, /app redirected to:", page.url)

    page.get_by_label("Email").fill(email)
    page.get_by_label("Palavra-passe").fill("segredo12345")
    page.locator("form button[type=submit]").click()
    page.wait_for_url("**/app", timeout=15000)
    print("4 signed back in:", page.url)
    b.close()

print("console errors:", errors[:10])
