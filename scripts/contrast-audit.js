const { chromium } = require("playwright");

const BASE = process.env.BASE || "http://localhost:3000";
  const routes = [
    "/perfil", "/dashboard", "/carrito", "/pedidos",
  ];
  const seed = JSON.stringify({
    state: {
      user: { id: "u1", name: "María López", email: "maria@correo.com", role: "client", points: 120, createdAt: "2024-01-01T00:00:00.000Z" },
      cart: [], orders: [], favorites: ["p1", "p2", "p3"],
    },
    version: 0,
  });

function lum(rgb) {
  const a = rgb.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
function ratio(fg, bg) {
  const l1 = lum(fg), l2 = lum(bg);
  const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}
function parseRgb(s) {
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(",").map((x) => parseFloat(x));
  return [p[0], p[1], p[2]];
}

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  let total = 0, fails = 0;
  for (const r of routes) {
    const url = BASE + r;
    const res = await page.goto(url, { waitUntil: "networkidle" }).catch(() => null);
    if (!res || res.status() >= 400) { console.log("SKIP (no server?)", r); continue; }
    // seed logged-in store, then reload so the page reads it
    await page.evaluate((s) => { localStorage.setItem("ayni-crea-store", s); }, seed);
    await page.reload({ waitUntil: "networkidle" });
    // force dark
    await page.evaluate(() => {
      localStorage.setItem("ayni-theme", "dark");
      document.documentElement.classList.add("dark");
    });
    await page.waitForTimeout(150);
    // scroll through to trigger whileInView animations
    await page.evaluate(async () => {
      const step = Math.max(300, window.innerHeight * 0.6);
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(200);
    const bad = await page.evaluate(() => {
      const parseRgb = (s) => {
        const m = s.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const p = m[1].split(",").map((x) => parseFloat(x));
        return [p[0], p[1], p[2]];
      };
      const lum = (rgb) => {
        const a = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
        return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
      };
      const ratio = (fg, bg) => {
        const l1 = lum(fg), l2 = lum(bg);
        const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
        return (hi + 0.05) / (lo + 0.05);
      };
      const out = [];
      const els = document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,span,a,button,li,label,div,input,td,th");
      for (const el of els) {
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none" || cs.opacity === "0") continue;
        const txt = (el.innerText || el.value || "").trim();
        if (!txt || txt.length > 80) continue;
        const color = parseRgb(cs.color);
        if (!color) continue;
        let bg = null, node = el;
        while (node && node !== document.documentElement) {
          const b = parseRgb(getComputedStyle(node).backgroundColor);
          if (b && getComputedStyle(node).backgroundColor !== "rgba(0, 0, 0, 0)") { bg = b; break; }
          node = node.parentElement;
        }
        if (!bg) bg = parseRgb(getComputedStyle(document.body).backgroundColor) || [10,10,10];
        const cr = ratio(color, bg);
        if (cr < 4.5) {
          out.push({ t: txt.slice(0, 40), cr: +cr.toFixed(2), fg: cs.color, bg: getComputedStyle(node).backgroundColor });
        }
      }
      return out;
    });
    total += bad.length;
    if (bad.length) {
      fails++;
      console.log(`\n[FAIL] ${r} (${bad.length} low-contrast texts, ratio<3):`);
      bad.slice(0, 12).forEach((b) => console.log(`   "${b.t}"  cr=${b.cr}  fg=${b.fg}  bg=${b.bg}`));
    } else {
      console.log(`[OK]   ${r}`);
    }
  }
  console.log(`\n=== ${fails} routes with low-contrast text, ${total} offenders total ===`);
  await browser.close();
})();
