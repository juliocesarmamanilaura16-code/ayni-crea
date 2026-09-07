const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const seed = JSON.stringify({
    state: {
      user: { id: "u1", name: "María López", email: "maria@correo.com", role: "client", points: 120, createdAt: "2024-01-01T00:00:00.000Z" },
      cart: [],
      orders: [
        {
          id: "o1", clientId: "u1", artisanId: "a1", productId: "p1",
          productName: "Manta Andina Tejida",
          customization: { color: "Rojo", material: "Lana", size: "Grande", price: 120, text: "" },
          shipping: 15, total: 135, status: "realizado", createdAt: "2024-01-01T00:00:00.000Z",
        },
      ],
      favorites: [],
    },
    version: 0,
  });
  await page.goto("http://localhost:3000/pedidos", { waitUntil: "networkidle" });
  await page.evaluate((s) => localStorage.setItem("ayni-crea-store", s), seed);
  await page.reload({ waitUntil: "networkidle" });
  await page.evaluate(() => { localStorage.setItem("ayni-theme", "dark"); document.documentElement.classList.add("dark"); });
  await page.waitForTimeout(300);

  const btn = page.locator("button").filter({ hasText: "Manta Andina Tejida" }).first();
  await btn.scrollIntoViewIfNeeded();
  await btn.hover();
  await page.waitForTimeout(250);

  const res = await btn.evaluate((el) => {
    const cs = getComputedStyle(el);
    const nameEl = el.querySelector("h3");
    const nameCs = getComputedStyle(nameEl);
    return { bg: cs.backgroundColor, nameColor: nameCs.color };
  });
  console.log("ORDER ROW on hover -> bg:", res.bg, "| name color:", res.nameColor);
  const isLight = (rgb) => { const m = rgb.match(/\d+/g).map(Number); return (m[0]+m[1]+m[2]) / 3 > 200; };
  console.log(res.bg.includes("rgba(0, 0, 0, 0)") ? "(transparent)" : (isLight(res.bg) ? "BG IS LIGHT (bug) ❌" : "BG IS DARK (ok) ✅"));

  // also test navbar icon hover (no auth)
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.evaluate(() => { localStorage.setItem("ayni-theme", "dark"); document.documentElement.classList.add("dark"); });
  await page.waitForTimeout(200);
  const navIcon = page.locator("header button").first();
  await navIcon.hover();
  await page.waitForTimeout(200);
  const navBg = await navIcon.evaluate((el) => getComputedStyle(el).backgroundColor);
  console.log("NAVBAR icon on hover -> bg:", navBg, navBg.includes("rgba(0, 0, 0, 0)") ? "(transparent)" : (isLight(navBg) ? "LIGHT (bug) ❌" : "DARK (ok) ✅"));

  await browser.close();
})();
