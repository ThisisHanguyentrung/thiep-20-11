/* Thiệp 20/11 - hiệu ứng: mở phong bì, cánh hoa & ánh sáng (canvas), typewriter, trái tim bay */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nền: cánh hoa + hạt sáng (một canvas, rất nhẹ) ---------- */
  const canvas = $("ambient");
  const ctx = canvas.getContext("2d");
  const PETAL_COLORS = ["#F4D9D6", "#EBC3C2", "#F8E8E4", "#E8D5AE"];
  let W = 0, H = 0, dpr = 1, petals = [], sparks = [], intensity = 1, running = true, last = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const rand = (a, b) => a + Math.random() * (b - a);

  function makePetal(fromTop) {
    return {
      x: rand(0, W), y: fromTop ? rand(-60, -10) : rand(-60, H),
      s: rand(7, 13), vy: rand(14, 30), sway: rand(.6, 1.6), ph: rand(0, 6.28),
      rot: rand(0, 6.28), vr: rand(-.8, .8), c: PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0],
      a: rand(.55, .85),
    };
  }
  function makeSpark() {
    return { x: rand(0, W), y: rand(0, H), r: rand(.8, 2), ph: rand(0, 6.28), sp: rand(.6, 1.4) };
  }

  function seed() {
    const small = W < 600;
    petals = Array.from({ length: small ? 12 : 20 }, () => makePetal(false));
    sparks = Array.from({ length: small ? 14 : 26 }, makeSpark);
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.a;
    ctx.fillStyle = p.c;
    ctx.beginPath();
    ctx.moveTo(0, -p.s);
    ctx.bezierCurveTo(p.s * .9, -p.s * .5, p.s * .7, p.s * .6, 0, p.s);
    ctx.bezierCurveTo(-p.s * .7, p.s * .6, -p.s * .9, -p.s * .5, 0, -p.s);
    ctx.fill();
    ctx.restore();
  }

  function frame(t) {
    if (!running) return;
    const dt = Math.min((t - last) / 1000 || 0.016, 0.05);
    last = t;
    ctx.clearRect(0, 0, W, H);

    for (const s of sparks) {
      const a = (Math.sin(t / 1000 * s.sp + s.ph) + 1) / 2 * .7 * intensity;
      ctx.globalAlpha = a;
      ctx.fillStyle = "#D9B97A";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
    }
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.y += p.vy * dt * (.7 + intensity * .3);
      p.x += Math.sin(t / 1000 * p.sway + p.ph) * 18 * dt;
      p.rot += p.vr * dt;
      if (p.y > H + 20) petals[i] = makePetal(true);
      drawPetal(p);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  function startAmbient() {
    resize(); seed();
    if (reduced) {           // Chỉ vẽ một khung tĩnh
      petals.forEach(drawPetal); return;
    }
    requestAnimationFrame(frame);
  }
  window.addEventListener("resize", () => { resize(); seed(); if (reduced) petals.forEach(drawPetal); });
  document.addEventListener("visibilitychange", () => {
    if (reduced) return;
    running = !document.hidden;
    if (running) { last = performance.now(); requestAnimationFrame(frame); }
  });

  /* ---------- Trái tim bay lên ---------- */
  const heartsLayer = $("hearts");
  const HEART_SVG = '<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 2.8 4.5 6.4 4.5c2 0 3.6 1.1 4.6 2.7h2c1-1.6 2.6-2.7 4.6-2.7 3.6 0 5.5 3.8 4 7.2C19.5 16.4 12 21 12 21z"/></svg>';
  const HEART_COLORS = ["#E6B8B6", "#D99A9F", "#E8D5AE", "#F0C9C6"];

  function launchHearts(originEl, count = 14) {
    const r = originEl.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    for (let i = 0; i < count; i++) {
      const h = document.createElement("span");
      h.className = "heart";
      h.innerHTML = HEART_SVG;
      h.style.left = cx + rand(-60, 60) + "px";
      h.style.bottom = Math.max(0, window.innerHeight - r.top - 20) + "px";
      h.style.setProperty("--s", rand(14, 30) + "px");
      h.style.setProperty("--d", rand(2.8, 4.4) + "s");
      h.style.setProperty("--x", rand(-70, 70) + "px");
      h.style.setProperty("--r", rand(-25, 25) + "deg");
      h.style.setProperty("--c", HEART_COLORS[(Math.random() * HEART_COLORS.length) | 0]);
      h.style.animationDelay = i * 90 + "ms";
      h.addEventListener("animationend", () => h.remove());
      heartsLayer.appendChild(h);
    }
  }

  /* ---------- Typewriter ---------- */
  async function typewriter(el, text, speed = 48) {
    if (reduced) { el.textContent = text; return; }
    const caret = document.createElement("span");
    caret.className = "caret";
    const node = document.createTextNode("");
    el.append(node, caret);
    for (const ch of text) {
      node.nodeValue += ch;
      await sleep(/[,.]/.test(ch) ? speed * 5 : speed);
    }
    await sleep(900);
    caret.remove();
  }

  /* ---------- Trình tự mở thiệp ---------- */
  const scene = $("scene"), envelope = $("envelope"), openBtn = $("openBtn");
  const cardScreen = $("card"), quote = $("quote"), hugBtn = $("hugBtn"), hugMsg = $("hugMsg");
  let opened = false;

  async function openGift() {
    if (opened) return;
    opened = true;
    openBtn.disabled = true;
    envelope.classList.add("is-open");     // 1) nắp mở, thiệp trượt lên
    await sleep(reduced ? 50 : 2500);
    scene.classList.add("is-leaving");     // 2) phong bì mờ dần
    await sleep(reduced ? 50 : 900);
    scene.hidden = true;
    cardScreen.hidden = false;
    window.scrollTo(0, 0);
    intensity = 1.6;                       // nền sáng và nhiều cánh hoa hơn một chút
    requestAnimationFrame(() => cardScreen.classList.add("is-visible"));
    await sleep(reduced ? 0 : 700);
    await revealCard();
  }

  async function revealCard() {
    const items = [...cardScreen.querySelectorAll(".reveal")];
    const show = (el) => el.classList.add("in");
    const gap = reduced ? 0 : 750;

    items.slice(0, 2).forEach(show);                 // tiêu đề + đường kẻ
    await sleep(gap + 500);
    await typewriter(quote, quote.dataset.text);     // câu nhấn mạnh
    for (const el of items.slice(2)) {               // lời chúc hiện dần
      show(el);
      await sleep(el.matches(".letter p") ? gap + 400 : gap);
    }
  }

  openBtn.addEventListener("click", openGift);

  hugBtn.addEventListener("click", () => {
    hugMsg.classList.add("show");
    launchHearts(hugBtn, reduced ? 6 : 14);
    hugBtn.textContent = "Mẹ nhận được rồi nhé ❤️";
  });

  startAmbient();
})();
