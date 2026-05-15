/* ═══════════════════════════════════════════════════════
   TIKA'S 22ND BIRTHDAY — script.js
   Pure vanilla JS — zero dependencies — FIXED v2
   ═══════════════════════════════════════════════════════ */

"use strict";

/* ── DOM refs ─────────────────────────────────────────── */
const screen1        = document.getElementById("screen1");
const screen2        = document.getElementById("screen2");
const screen3        = document.getElementById("screen3");
const screen4        = document.getElementById("screen4");
const counterEl      = document.getElementById("counter");
const narrativeEl    = document.getElementById("narrativeText");
const progressBar    = document.getElementById("progressBar");
const giftBox        = document.getElementById("giftBox");
const giftLid        = document.getElementById("giftLid");
const envelope       = document.getElementById("envelope");
const sparkleField   = document.getElementById("sparkleField");
const confettiCont   = document.getElementById("confettiContainer");
const ambientCont    = document.getElementById("ambientParticles");
const muteBtn        = document.getElementById("muteBtn");

/* ── STATE ───────────────────────────────────────────── */
let audioCtx      = null;
let loopNode      = null;
let gainNode      = null;
let muted         = false;
let audioStarted  = false;

/* ── NARRATIVE MAP ───────────────────────────────────── */
const narratives = [
  { range: [0,  5],  text: "Awal dari sebuah perjalanan..." },
  { range: [6,  10], text: "Masa-masa penuh rasa ingin tahu..." },
  { range: [11, 15], text: "Mulai menemukan dirinya sendiri..." },
  { range: [16, 20], text: "Berani, ekspresif, dan terus melangkah..." },
  { range: [21, 21], text: "Selangkah lagi..." },
  { range: [22, 22], text: "Dan hari ini, genap 22. Selamat datang, Gek." },
];

function getNarrative(n) {
  for (const e of narratives) {
    if (n >= e.range[0] && n <= e.range[1]) return e.text;
  }
  return "";
}

/* ═══════════════════════════════════════════════════════
   SCREEN TRANSITIONS
   ═══════════════════════════════════════════════════════ */
function goTo(from, to, delay = 0) {
  setTimeout(() => {
    from.classList.add("fade-out");
    from.classList.remove("active");
    setTimeout(() => {
      from.classList.remove("fade-out");
      to.classList.add("active");
    }, 750);
  }, delay);
}

/* ═══════════════════════════════════════════════════════
   SCREEN 1 — COUNTER
   FIXED: Total duration diperpanjang ke 10 detik agar
   setiap narrative punya waktu cukup untuk terbaca.
   Setiap angka juga ditahan minimal 300ms sebelum naik.
   ═══════════════════════════════════════════════════════ */
function startCounter() {
  const TARGET   = 22;
  // FIXED: diperpanjang dari 4800ms ke 10000ms (10 detik)
  // Breakdown per range: ~0-5 (2.2s), 6-10 (2s), 11-15 (2s), 16-20 (2s), 21 (0.8s), 22 (1s)
  const TOTAL_MS = 10000;
  const START_T  = performance.now();
  let lastVal    = -1;

  function easeInOutCubic(t) {
    // FIXED: pakai easing yang lebih lambat di awal dan akhir
    // sehingga angka kecil (0-5) punya waktu lebih lama terbaca
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function tick(now) {
    const elapsed  = now - START_T;
    const progress = Math.min(elapsed / TOTAL_MS, 1);
    const eased    = easeInOutCubic(progress);
    const val      = Math.round(eased * TARGET);

    /* Update progress bar */
    progressBar.style.width = (progress * 100) + "%";

    /* Update counter only when value changes */
    if (val !== lastVal) {
      counterEl.textContent = val;
      lastVal = val;

      /* Narrative: fade out lama dulu, baru ganti teks */
      const newText = getNarrative(val);
      if (narrativeEl.textContent !== newText) {
        narrativeEl.classList.add("changing");
        setTimeout(() => {
          narrativeEl.textContent = newText;
          narrativeEl.classList.remove("changing");
        }, 350);
      }
    }

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      /* Pause di 22 selama 2.5 detik biar sempat terbaca */
      setTimeout(() => goTo(screen1, screen2), 2500);
    }
  }

  requestAnimationFrame(tick);
}

/* ═══════════════════════════════════════════════════════
   SPARKLES (ambient around gift box)
   ═══════════════════════════════════════════════════════ */
function createSparkles() {
  const colors = ["#7ec8c8", "#a8d5ba", "#b8dfe8", "#f0c090", "#fffbe0"];
  for (let i = 0; i < 18; i++) {
    const sp = document.createElement("div");
    sp.className = "sparkle";
    sp.style.cssText = `
      left: ${10 + Math.random() * 80}%;
      top:  ${10 + Math.random() * 80}%;
      width: ${5 + Math.random() * 8}px;
      height: ${5 + Math.random() * 8}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      --sd: ${1.2 + Math.random() * 1.6}s;
      --delay: ${Math.random() * 2.5}s;
    `;
    sparkleField.appendChild(sp);
  }
}

/* ═══════════════════════════════════════════════════════
   CONFETTI BURST
   ═══════════════════════════════════════════════════════ */
function launchConfetti() {
  const colors = [
    "#7ec8c8", "#a8d5ba", "#b8dfe8", "#f0c090",
    "#f9c9d4", "#ffe0a3", "#c8e6c9", "#80deea"
  ];

  /* Paper confetti */
  for (let i = 0; i < 60; i++) {
    const p = document.createElement("div");
    p.className = "confetti-piece";
    const isCircle = Math.random() > 0.5;
    p.style.cssText = `
      left: ${10 + Math.random() * 80}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${isCircle ? "50%" : "2px"};
      width:  ${8 + Math.random() * 10}px;
      height: ${8 + Math.random() * 14}px;
      --cf-dur:   ${1.4 + Math.random() * 1.2}s;
      --cf-delay: ${Math.random() * 0.6}s;
      --cf-drift: ${-80 + Math.random() * 160}px;
    `;
    confettiCont.appendChild(p);
  }

  /* Rising bubbles */
  for (let i = 0; i < 20; i++) {
    const b = document.createElement("div");
    b.className = "bubble-rise";
    const sz = 14 + Math.random() * 28;
    b.style.cssText = `
      left: ${5 + Math.random() * 90}%;
      width:  ${sz}px;
      height: ${sz}px;
      border-color: ${colors[Math.floor(Math.random() * colors.length)]};
      --br-dur:   ${1.8 + Math.random() * 1.4}s;
      --br-delay: ${Math.random() * 0.8}s;
    `;
    confettiCont.appendChild(b);
  }

  /* Clean up after animation */
  setTimeout(() => { confettiCont.innerHTML = ""; }, 4000);
}

/* ═══════════════════════════════════════════════════════
   SCREEN 2 — GIFT BOX CLICK
   ═══════════════════════════════════════════════════════ */
function initGiftBox() {
  createSparkles();

  const trigger = () => {
    if (giftBox.classList.contains("opened")) return;

    /* Start audio on first user interaction */
    if (!audioStarted) {
      startAudio();
      audioStarted = true;
    }

    playChime(["C5", "E5", "G5", "C6"]);
    giftBox.classList.add("opened");
    launchConfetti();

    goTo(screen2, screen3, 1600);
  };

  giftBox.addEventListener("click",   trigger);
  giftBox.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") trigger(); });
}

/* ═══════════════════════════════════════════════════════
   SCREEN 3 — ENVELOPE CLICK
   ═══════════════════════════════════════════════════════ */
function initEnvelope() {
  const trigger = () => {
    if (envelope.classList.contains("opened")) return;

    playChime(["E5", "G5", "B5", "E6"]);
    envelope.classList.add("opened");

    goTo(screen3, screen4, 1800);
    setTimeout(() => startAmbient(), 1800);
  };

  envelope.addEventListener("click",   trigger);
  envelope.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") trigger(); });
}

/* ═══════════════════════════════════════════════════════
   AMBIENT HEARTS & BUBBLES (Screen 4)
   ═══════════════════════════════════════════════════════ */
function startAmbient() {
  const hearts  = ["🤍", "💙", "🫧", "✨", "🌊"];
  const bColors = ["#7ec8c8", "#a8d5ba", "#b8dfe8"];

  for (let i = 0; i < 14; i++) {
    const h = document.createElement("div");
    h.className = "heart-particle";
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    const sz = 12 + Math.random() * 18;
    h.style.cssText = `
      left: ${Math.random() * 100}%;
      --hp-size:  ${sz}px;
      --hp-dur:   ${5 + Math.random() * 5}s;
      --hp-delay: ${Math.random() * 8}s;
    `;
    ambientCont.appendChild(h);
  }

  for (let i = 0; i < 10; i++) {
    const b = document.createElement("div");
    b.className = "amb-bubble";
    const sz = 10 + Math.random() * 24;
    b.style.cssText = `
      left: ${Math.random() * 100}%;
      width:  ${sz}px;
      height: ${sz}px;
      border-color: ${bColors[Math.floor(Math.random() * bColors.length)]};
      --ab-dur:   ${6 + Math.random() * 6}s;
      --ab-delay: ${Math.random() * 10}s;
    `;
    ambientCont.appendChild(b);
  }
}

/* ═══════════════════════════════════════════════════════
   WEB AUDIO — CHIME + AMBIENT LOOP
   ═══════════════════════════════════════════════════════ */
const NOTE_FREQ = {
  C4:261.63, D4:293.66, E4:329.63, F4:349.23,
  G4:392.00, A4:440.00, B4:493.88,
  C5:523.25, D5:587.33, E5:659.25, F5:698.46,
  G5:783.99, A5:880.00, B5:987.77,
  C6:1046.50, E6:1318.51
};

function startAudio() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.connect(audioCtx.destination);
    startAmbientLoop();
    muteBtn.classList.remove("hidden");
  } catch(e) {
    console.warn("Web Audio not available:", e);
  }
}

function startAmbientLoop() {
  if (!audioCtx) return;

  const chords = [
    [NOTE_FREQ.C5, NOTE_FREQ.E5, NOTE_FREQ.G5],
    [NOTE_FREQ.A4, NOTE_FREQ.C5, NOTE_FREQ.E5],
    [NOTE_FREQ.F4, NOTE_FREQ.A4, NOTE_FREQ.C5],
    [NOTE_FREQ.G4, NOTE_FREQ.B4, NOTE_FREQ.D5],
  ];

  let idx = 0;
  const interval = 3200;

  function playChord() {
    if (!audioCtx || muted) return;
    const chord = chords[idx % chords.length];
    idx++;

    chord.forEach((freq, i) => {
      const osc  = audioCtx.createOscillator();
      const env  = audioCtx.createGain();
      const t    = audioCtx.currentTime;

      osc.type      = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, t);

      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.06, t + 0.4);
      env.gain.exponentialRampToValueAtTime(0.001, t + interval / 1000 - 0.1);

      osc.connect(env);
      env.connect(gainNode);

      osc.start(t);
      osc.stop(t + interval / 1000);
    });
  }

  playChord();
  const id = setInterval(() => {
    if (!audioCtx) { clearInterval(id); return; }
    playChord();
  }, interval);
}

function playChime(noteNames) {
  if (!audioCtx) return;

  noteNames.forEach((name, i) => {
    const freq = NOTE_FREQ[name];
    if (!freq) return;
    const t   = audioCtx.currentTime + i * 0.12;
    const osc = audioCtx.createOscillator();
    const env = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.002, t + 0.05);

    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.25, t + 0.04);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    osc.connect(env);
    env.connect(gainNode);
    osc.start(t);
    osc.stop(t + 0.95);
  });
}

/* ── MUTE TOGGLE ─────────────────────────────────────── */
muteBtn.addEventListener("click", () => {
  muted = !muted;
  if (audioCtx && gainNode) {
    gainNode.gain.setTargetAtTime(
      muted ? 0 : 0.3,
      audioCtx.currentTime,
      0.15
    );
  }
  muteBtn.textContent = muted ? "🔇" : "🔊";
});

/* ═══════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════ */
function init() {
  screen1.classList.add("active");
  setTimeout(startCounter, 300);
  initGiftBox();
  initEnvelope();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
