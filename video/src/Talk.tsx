import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";

// "Talk to it": 15 s Reel for Lista Mandado built on the three main points, timed to "Shop Along" from 0:13.
// 1. Talk to it  2. It sorts itself to your store's shelves  3. Free, no email, no card  → DM me LIST.
// Everything that matters stays inside the Reel safe area: x 110–970, y 220–1460.

const C = { bg1: "#121827", bg2: "#0B0F18", ink: "#F3F1EA", muted: "#A9B0BE", red: "#E8574A", gold: "#F2B632", green: "#7BC25A", blue: "#8DB4F0", card: "#1A202B", line: "#2A3240", screen: "#10141C" };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

const SECTIONS = [
  { label: "Produce", emoji: "🍎", color: "#7BC25A", item: "apples" },
  { label: "Bakery", emoji: "🥖", color: "#F2B632", item: "bread" },
  { label: "Meat", emoji: "🥩", color: "#E8574A", item: "chicken" },
  { label: "Dairy", emoji: "🥛", color: "#8DB4F0", item: "milk" },
];
const SPOKEN = "milk, apples, bread and chicken";
const SPOKEN_ORDER = [3, 0, 1, 2]; // milk, apples, bread, chicken
const STORE_ORDER = [1, 0, 3, 2]; // at this store: Bakery, Produce, Dairy, Meat (aisles 1–4)
const CARD_H = 118, CARD_GAP = 14;

// Big numbered caption at the top of the safe area.
const Caption: React.FC<{ n?: string; lines: { t: string; hot?: boolean }[]; at?: number }> = ({ n, lines, at = 0 }) => {
  const f = useCurrentFrame() - at;
  const p = interpolate(f, [0, 14], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{ position: "absolute", top: 236, left: 110, right: 110, display: "flex", alignItems: "center", justifyContent: "center", gap: 26, opacity: p, transform: `translateY(${(1 - p) * 36}px)` }}>
      {n && <div style={{ flex: "none", width: 104, height: 104, borderRadius: "50%", background: C.red, color: "#10141C", fontFamily: "Bricolage", fontSize: 68, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>}
      <div style={{ fontFamily: "Bricolage", fontSize: 72, lineHeight: 1.02, letterSpacing: -1.2, color: C.ink }}>
        {lines.map((l, i) => <span key={i} style={{ color: l.hot ? C.red : C.ink }}>{l.t}{i < lines.length - 1 ? " " : ""}</span>)}
      </div>
    </div>
  );
};

// The app inside a phone. `filled[i]` shows section i's item; `pos[i]` is the card's slot (can be fractional while moving).
const AppPhone: React.FC<{ filled: number[]; pos: number[]; store: string; aisles: number; mic: number; bubble: string; flash: number[] }> = ({ filled, pos, store, aisles, mic, bubble, flash }) => (
  <div style={{ width: 460, height: 960, borderRadius: 74, background: "#050608", padding: 15, boxSizing: "border-box", boxShadow: "0 0 0 3px #3A3F48, 0 0 0 6px #8A8F99, 0 60px 90px -30px rgba(0,0,0,.85), 0 20px 60px -20px rgba(196,55,43,.5)" }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 60, background: C.screen, overflow: "hidden", position: "relative", padding: "74px 24px 24px", boxSizing: "border-box", fontFamily: "Nunito" }}>
      <div style={{ position: "absolute", top: 15, left: "50%", transform: "translateX(-50%)", width: 124, height: 36, borderRadius: 20, background: "#000" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, color: C.blue, fontFamily: "Bricolage", fontSize: 40 }}>
        <img src={staticFile("icon.svg")} style={{ width: 46, height: 46, borderRadius: 11 }} /> Lista Mandado
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18, fontWeight: 800, fontSize: 24, color: C.muted }}>
        Store
        <div style={{ flex: 1, height: 58, borderRadius: 16, border: `2px solid ${store === "Walmart" ? C.green : C.line}`, background: C.card, color: C.ink, fontSize: 28, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", transition: "none" }}>
          {store} <span style={{ color: C.muted, fontSize: 22 }}>▾</span>
        </div>
      </div>
      <div style={{ position: "relative", height: 4 * (CARD_H + CARD_GAP), marginTop: 22 }}>
        {SECTIONS.map((s, i) => (
          <div key={s.label} style={{ position: "absolute", left: 0, right: 0, top: pos[i] * (CARD_H + CARD_GAP), transform: `translateX(${Math.sin(Math.PI * (pos[i] % 1 || 0)) * (STORE_ORDER.indexOf(i) < i ? -26 : 26)}px)`, zIndex: STORE_ORDER.indexOf(i) < i ? 2 : 1, height: CARD_H, boxSizing: "border-box", background: C.card, border: `2px solid ${flash[i] > 0 ? s.color : C.line}`, borderRadius: 22, padding: "14px 18px", boxShadow: flash[i] > 0 ? `0 0 ${30 * flash[i]}px ${s.color}66` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.blue, fontWeight: 900, fontSize: 25 }}>
              <span style={{ width: 9, height: 26, borderRadius: 4, background: s.color }} /> {s.emoji} {s.label}
              <span style={{ marginLeft: "auto", fontSize: 20, fontWeight: 900, color: "#10141C", background: C.gold, borderRadius: 999, padding: "3px 12px", opacity: aisles, transform: `scale(${0.6 + 0.4 * aisles})` }}>
                Aisle {Math.round(pos[i]) + 1}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, opacity: filled[i], transform: `translateY(${(1 - filled[i]) * -40}px)` }}>
              <span style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid #4A5466" }} />
              <span style={{ color: C.ink, fontWeight: 800, fontSize: 32 }}>{s.item}</span>
            </div>
          </div>
        ))}
      </div>
      {/* add bar with the microphone */}
      <div style={{ position: "absolute", left: 24, right: 24, bottom: 28, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1, height: 70, borderRadius: 22, border: `2px solid ${C.line}`, background: C.card, color: C.muted, fontSize: 26, fontWeight: 700, display: "flex", alignItems: "center", padding: "0 18px" }}>Add: 2 kg tortillas</div>
        <div style={{ position: "relative", width: 78, height: 78 }}>
          {[0, 1].map((k) => {
            const r = ((mic * 2 + k * 0.5) % 1);
            return mic > 0 ? <div key={k} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `4px solid ${C.red}`, transform: `scale(${1 + r * 1.2})`, opacity: (1 - r) * 0.8 }} /> : null;
          })}
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, transform: `scale(${1 + 0.08 * Math.sin(mic * 30)})` }}>🎤</div>
        </div>
      </div>
      {/* what you said */}
      {bubble && (
        <div style={{ position: "absolute", right: 24, bottom: 128, maxWidth: 330, background: C.ink, color: "#10141C", borderRadius: "26px 26px 6px 26px", padding: "16px 22px", fontSize: 30, fontWeight: 800, lineHeight: 1.2, boxShadow: "0 20px 40px -16px rgba(0,0,0,.7)" }}>
          “{bubble}”
        </div>
      )}
    </div>
  </div>
);

// ---- scene 1: talk to it (0–150) ----
const SceneTalk: React.FC = () => {
  const f = useCurrentFrame();
  const typed = Math.round(interpolate(f, [14, 62], [0, SPOKEN.length], clamp));
  const mic = f >= 8 && f <= 72 ? (f - 8) / 60 : 0;
  const filled = SECTIONS.map((_, i) => interpolate(f, [88 + SPOKEN_ORDER.indexOf(i) * 12, 98 + SPOKEN_ORDER.indexOf(i) * 12], [0, 1], { ...clamp, easing: ease }));
  const flash = SECTIONS.map((_, i) => { const a = 88 + SPOKEN_ORDER.indexOf(i) * 12; return interpolate(f, [a, a + 6, a + 18], [0, 1, 0], clamp); });
  const bubbleOut = f > 84; // the bubble is gone before the items land
  return (
    <AbsoluteFill>
      <Caption n="1" lines={[{ t: "Talk" }, { t: "to it.", hot: true }]} />
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <AppPhone filled={filled} pos={[0, 1, 2, 3]} store="Standard" aisles={0} mic={mic} bubble={bubbleOut ? "" : SPOKEN.slice(0, typed)} flash={flash} />
      </div>
    </AbsoluteFill>
  );
};

// ---- scene 2: it sorts itself to your store's shelves (150–300) ----
const SceneSort: React.FC = () => {
  const f = useCurrentFrame();
  const store = f < 22 ? "Standard" : "Walmart";
  const move = interpolate(f, [34, 70], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const pos = SECTIONS.map((_, i) => i + (STORE_ORDER.indexOf(i) - i) * move);
  const aisles = interpolate(f, [72, 86], [0, 1], { ...clamp, easing: ease });
  const tap = interpolate(f, [10, 16, 22], [1, 0.94, 1], clamp);
  return (
    <AbsoluteFill>
      <Caption n="2" lines={[{ t: "It sorts itself to your" }, { t: "store's shelves.", hot: true }]} />
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${tap})` }}>
        <AppPhone filled={[1, 1, 1, 1]} pos={pos} store={store} aisles={aisles} mic={0} bubble="" flash={[0, 0, 0, 0]} />
      </div>
    </AbsoluteFill>
  );
};

// ---- scene 3: free, no email, no card (300–390) ----
const SceneFree: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const badges = [
    { t: "FREE", bg: C.gold, ink: "#1A1406", size: 150 },
    { t: "No email", bg: C.ink, ink: "#10141C", size: 96 },
    { t: "No card", bg: C.ink, ink: "#10141C", size: 96 },
  ];
  return (
    <AbsoluteFill>
      <Caption n="3" lines={[{ t: "And it's" }, { t: "free.", hot: true }]} />
      <div style={{ position: "absolute", top: 560, left: 110, right: 110, display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        {badges.map((b, i) => {
          const pop = spring({ frame: f - 8 - i * 12, fps, config: { damping: 9, stiffness: 180 } });
          return (
            <div key={b.t} style={{ background: b.bg, color: b.ink, fontFamily: "Bricolage", fontSize: b.size, letterSpacing: -1, padding: "14px 60px", borderRadius: 999, transform: `scale(${pop}) rotate(${i % 2 ? 2 : -2}deg)`, boxShadow: "0 30px 60px -24px rgba(0,0,0,.8)" }}>
              {b.t}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---- scene 4: want it? (390–450) ----
const SceneAsk: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: f, fps, config: { damping: 11 } });
  const pulse = f > 16 && f < 46 ? 1 + 0.12 * Math.max(0, Math.sin(((f - 16) / 15) * Math.PI)) : 1;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ marginTop: -140, display: "flex", flexDirection: "column", alignItems: "center", gap: 34, transform: `scale(${0.85 + 0.15 * pop})`, opacity: Math.min(1, pop * 1.5) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "Bricolage", fontSize: 52, color: C.ink }}>
          <img src={staticFile("icon.svg")} style={{ width: 76, height: 76, borderRadius: 18 }} /> Lista Mandado
        </div>
        <div style={{ width: 820, boxSizing: "border-box", borderRadius: 40, padding: "40px 44px", textAlign: "center", border: "3px solid rgba(214,41,118,.65)", background: "linear-gradient(135deg, rgba(254,218,117,.16), rgba(214,41,118,.24) 55%, rgba(79,91,213,.26))", fontFamily: "Nunito" }}>
          <div style={{ color: C.muted, fontWeight: 900, fontSize: 32, letterSpacing: 3 }}>WANT IT?</div>
          <div style={{ color: C.ink, fontFamily: "Bricolage", fontSize: 64, lineHeight: 1.05, marginTop: 14 }}>Follow me + DM me</div>
          <div style={{ display: "inline-block", marginTop: 22, background: C.ink, color: "#10141C", fontFamily: "Bricolage", fontSize: 96, letterSpacing: 4, borderRadius: 22, padding: "4px 34px", transform: `scale(${pulse})` }}>LIST</div>
          <div style={{ color: C.muted, fontWeight: 800, fontSize: 36, marginTop: 22 }}>and I'll send you the app 📲</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Cross-fade each scene in and out.
const Fade: React.FC<{ len: number; children: React.ReactNode; last?: boolean }> = ({ len, children, last }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, last ? [0, 8] : [0, 8, len - 8, len], last ? [0, 1] : [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const Talk: React.FC = () => {
  const frame = useCurrentFrame();
  const glowX = interpolate(frame, [0, 450], [30, 70]);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(700px 800px at ${glowX}% 58%, rgba(196,55,43,.30), rgba(196,55,43,0) 70%), radial-gradient(1000px 600px at 50% 0%, #1E2A44 0%, rgba(30,42,68,0) 70%), linear-gradient(180deg, ${C.bg1} 0%, ${C.bg2} 100%)` }}>
      <Audio src={staticFile("shop-along.mp3")} startFrom={13 * 30} volume={(f) => interpolate(f, [405, 450], [1, 0], clamp)} />
      <Sequence from={0} durationInFrames={150}><Fade len={150}><SceneTalk /></Fade></Sequence>
      <Sequence from={150} durationInFrames={150}><Fade len={150}><SceneSort /></Fade></Sequence>
      <Sequence from={300} durationInFrames={90}><Fade len={90}><SceneFree /></Fade></Sequence>
      <Sequence from={390} durationInFrames={60}><Fade len={60} last><SceneAsk /></Fade></Sequence>
    </AbsoluteFill>
  );
};
