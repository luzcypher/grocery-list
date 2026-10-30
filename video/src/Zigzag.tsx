import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// "The Zigzag": 15 s Reel for Lista Mandado, timed to "Shop Along" from 0:13.
// Everything that matters stays inside the Reel safe area: x 110–970, y 220–1460.

const C = {
  bg1: "#121827",
  bg2: "#0B0F18",
  ink: "#F3F1EA",
  muted: "#A9B0BE",
  red: "#E8574A",
  gold: "#F2B632",
  green: "#7BC25A",
  blue: "#8DB4F0",
  card: "#1A202B",
  line: "#2A3240",
};
const SECTIONS = [
  { key: "produce", label: "Produce", emoji: "🍎", color: "#7BC25A", item: "apples" },
  { key: "bakery", label: "Bakery", emoji: "🥖", color: "#F2B632", item: "bread" },
  { key: "meat", label: "Meat", emoji: "🥩", color: "#E8574A", item: "chicken" },
  { key: "dairy", label: "Dairy", emoji: "🥛", color: "#8DB4F0", item: "milk" },
];
const TYPED = [3, 0, 1, 2]; // order the shopper adds things: milk, apples, bread, chicken

// ---- fonts (the same ones the app uses) ----
const fontHandle = delayRender("fonts");
Promise.all([
  new FontFace("Nunito", `url(${staticFile("fonts/nunito.woff2")})`, { weight: "200 1000" }).load(),
  new FontFace("Bricolage", `url(${staticFile("fonts/bricolage-800.woff2")})`, { weight: "800" }).load(),
])
  .then((faces) => {
    faces.forEach((f) => document.fonts.add(f));
    continueRender(fontHandle);
  })
  .catch(() => continueRender(fontHandle));

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

// Fade a scene in at its start and out at its end.
const useSceneFade = (len: number) => {
  const f = useCurrentFrame();
  return interpolate(f, [0, 8, len - 8, len], [0, 1, 1, 0], clamp);
};

// Headline at the top of the safe area, sliding up word by word.
const Headline: React.FC<{ words: { t: string; hot?: boolean }[]; size?: number }> = ({ words, size = 76 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 250, left: 110, right: 110, textAlign: "center", fontFamily: "Bricolage", fontSize: size, lineHeight: 1.04, letterSpacing: -1.2, color: C.ink }}>
      {words.map((w, i) => {
        const p = interpolate(f, [i * 3, i * 3 + 12], [0, 1], { ...clamp, easing: ease });
        return (
          <span key={i} style={{ display: "inline-block", marginRight: "0.25em", opacity: p, transform: `translateY(${(1 - p) * 40}px)`, color: w.hot ? C.red : C.ink }}>
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

// ---- store map ----
type Pt = [number, number];
const AISLE_X = [70, 250, 430, 610];
const ZIG: Pt[] = [[40, 520], [750, 300], [210, 200], [750, 430], [570, 170], [210, 380], [390, 260], [390, 520]];
const CLEAN: Pt[] = [[40, 520], [210, 520], [210, 150], [390, 150], [390, 500], [570, 500], [570, 150], [750, 150], [750, 500]];

const pathUpTo = (pts: Pt[], t: number) => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let left = total * t;
  const out: Pt[] = [pts[0]];
  for (let i = 0; i < seg.length; i++) {
    if (left >= seg[i]) { out.push(pts[i + 1]); left -= seg[i]; continue; }
    const k = left / seg[i];
    out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]);
    break;
  }
  return out;
};

const StoreMap: React.FC<{ path: Pt[]; t: number; color: string; dashed?: boolean; shake?: number }> = ({ path, t, color, dashed, shake = 0 }) => {
  const drawn = pathUpTo(path, t);
  const cart = drawn[drawn.length - 1];
  return (
    <svg viewBox="0 0 800 560" width={860} height={602} style={{ transform: `translate(${shake}px, 0)` }}>
      <rect x={4} y={4} width={792} height={552} rx={36} fill={C.card} stroke={C.line} strokeWidth={4} />
      {SECTIONS.map((s, i) => (
        <g key={s.key}>
          <rect x={AISLE_X[i]} y={110} width={100} height={340} rx={18} fill={s.color} opacity={0.9} />
          <text x={AISLE_X[i] + 50} y={86} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={30} fill={C.ink}>{s.emoji}</text>
          <text x={AISLE_X[i] + 50} y={290} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={26} fill="#10141C" transform={`rotate(-90 ${AISLE_X[i] + 50} 290)`}>{s.label}</text>
        </g>
      ))}
      <polyline points={drawn.map((p) => p.join(",")).join(" ")} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? "2 22" : undefined} />
      <circle cx={cart[0]} cy={cart[1]} r={22} fill={color} stroke={C.ink} strokeWidth={5} />
      <text x={cart[0]} y={cart[1] + 9} textAnchor="middle" fontSize={24}>🛒</text>
    </svg>
  );
};

// ---- scene 1: the zigzag ----
const SceneZig: React.FC = () => {
  const f = useCurrentFrame();
  const fade = useSceneFade(75);
  const t = interpolate(f, [6, 70], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Headline size={68} words={[{ t: "Your" }, { t: "list" }, { t: "says" }, { t: "milk…" }, { t: "then" }, { t: "apples…" }, { t: "then" }, { t: "milk", hot: true }, { t: "again?", hot: true }]} />
      <div style={{ position: "absolute", top: 640, left: 110, width: 860, display: "flex", justifyContent: "center" }}>
        <StoreMap path={ZIG} t={t} color={C.red} dashed />
      </div>
    </AbsoluteFill>
  );
};

// ---- scene 2: crumple it ----
const SceneStop: React.FC = () => {
  const f = useCurrentFrame();
  const fade = useSceneFade(45);
  const shake = f < 16 ? Math.sin(f * 2.4) * 18 : 0;
  const crush = interpolate(f, [16, 34], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const spin = interpolate(f, [16, 34], [0, -40], clamp);
  const fly = interpolate(f, [16, 34], [0, -700], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Headline size={96} words={[{ t: "Stop" }, { t: "zigzagging.", hot: true }]} />
      <div style={{ position: "absolute", top: 640, left: 110, width: 860, display: "flex", justifyContent: "center", transform: `translate(${fly}px, ${-fly * 0.3}px) rotate(${spin}deg) scale(${crush})`, transformOrigin: "50% 50%" }}>
        <StoreMap path={ZIG} t={1} color={C.red} dashed shake={shake} />
      </div>
    </AbsoluteFill>
  );
};

// ---- phone with sections ----
const Phone: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ width: 430, height: 860, borderRadius: 70, background: "#050608", padding: 14, boxSizing: "border-box", boxShadow: `0 0 0 3px #3A3F48, 0 0 0 6px #8A8F99, 0 60px 90px -30px rgba(0,0,0,.85), 0 20px 60px -20px rgba(196,55,43,.5)`, ...style }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 56, background: "#10141C", overflow: "hidden", position: "relative", padding: "70px 22px 22px", boxSizing: "border-box", fontFamily: "Nunito" }}>
      <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 120, height: 34, borderRadius: 20, background: "#000" }} />
      {children}
    </div>
  </div>
);

const SectionCard: React.FC<{ s: (typeof SECTIONS)[number]; filled: number; checked?: number }> = ({ s, filled, checked = 0 }) => (
  <div style={{ background: C.card, border: `2px solid ${C.line}`, borderRadius: 22, padding: "14px 16px", marginBottom: 14 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.blue, fontWeight: 900, fontSize: 24 }}>
      <span style={{ width: 9, height: 26, borderRadius: 4, background: s.color }} />
      {s.emoji} {s.label}
    </div>
    <div style={{ height: 46, display: "flex", alignItems: "center", gap: 12, marginTop: 8, opacity: filled, transform: `scale(${0.8 + 0.2 * filled})`, transformOrigin: "left center" }}>
      <span style={{ width: 30, height: 30, borderRadius: "50%", border: `3px solid ${checked > 0.5 ? C.green : "#4A5466"}`, background: checked > 0.5 ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#10141C", fontWeight: 900, fontSize: 20, transform: `scale(${1 + 0.35 * Math.sin(Math.PI * Math.min(1, checked))})` }}>
        {checked > 0.5 ? "✓" : ""}
      </span>
      <span style={{ color: checked > 0.5 ? "#8A93A3" : C.ink, textDecoration: checked > 0.5 ? "line-through" : "none", fontWeight: 800, fontSize: 30 }}>{s.item}</span>
    </div>
  </div>
);

// ---- scene 3: it sorts itself ----
const SceneSort: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useSceneFade(120);
  const rise = spring({ frame: f - 4, fps, config: { damping: 16 } });
  // Each typed item appears in the add box, then flies into its section.
  const START = 24, EACH = 20;
  const filledOf = (sectionIndex: number) => {
    const order = TYPED.indexOf(sectionIndex);
    return interpolate(f, [START + order * EACH + 10, START + order * EACH + 18], [0, 1], clamp);
  };
  const current = Math.floor((f - START) / EACH);
  const typedLabel = current >= 0 && current < 4 ? SECTIONS[TYPED[current]].item : "";
  const local = (f - START) % EACH;
  const chipY = interpolate(local, [0, 8, 16], [0, 0, -420], { ...clamp, easing: Easing.in(Easing.cubic) });
  const chipOpacity = interpolate(local, [0, 3, 12, 16], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Headline words={[{ t: "Type" }, { t: "it" }, { t: "or" }, { t: "say" }, { t: "it." }, { t: "It" }, { t: "sorts", hot: true }, { t: "itself.", hot: true }]} />
      <div style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `translateY(${(1 - rise) * 900}px)` }}>
        <Phone>
          <div style={{ color: C.blue, fontFamily: "Bricolage", fontSize: 38, marginBottom: 18 }}>Lista Mandado</div>
          {SECTIONS.map((s, i) => <SectionCard key={s.key} s={s} filled={filledOf(i)} />)}
          <div style={{ position: "absolute", left: 22, right: 22, bottom: 26, display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ flex: 1, height: 64, borderRadius: 20, border: `2px solid ${C.line}`, background: C.card, color: typedLabel ? C.ink : C.muted, fontSize: 28, fontWeight: 700, display: "flex", alignItems: "center", padding: "0 18px", position: "relative" }}>
              {typedLabel ? (
                <span style={{ transform: `translateY(${chipY}px)`, opacity: chipOpacity, background: typedLabel ? "#2A3240" : "transparent", borderRadius: 12, padding: "2px 12px" }}>{typedLabel}</span>
              ) : "Add: milk"}
            </div>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>🎤</div>
          </div>
        </Phone>
      </div>
    </AbsoluteFill>
  );
};

// ---- scene 4: one clean path ----
const SceneClean: React.FC = () => {
  const f = useCurrentFrame();
  const fade = useSceneFade(75);
  const t = interpolate(f, [6, 66], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Headline size={96} words={[{ t: "In" }, { t: "aisle", hot: true }, { t: "order.", hot: true }]} />
      <div style={{ position: "absolute", top: 430, left: 110, width: 860, display: "flex", justifyContent: "center", transform: "scale(.86)", transformOrigin: "50% 0" }}>
        <StoreMap path={CLEAN} t={t} color={C.green} />
      </div>
      <div style={{ position: "absolute", top: 980, left: 190, right: 190, fontFamily: "Nunito" }}>
        {SECTIONS.map((s, i) => (
          <SectionCard key={s.key} s={s} filled={1} checked={interpolate(t, [(i + 0.55) / 4, (i + 0.75) / 4], [0, 1], clamp)} />
        )).slice(0, 4)}
      </div>
    </AbsoluteFill>
  );
};

// ---- scene 5: free, no sign-up, no card ----
const SceneBadges: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useSceneFade(60);
  const badges = [
    { t: "100% FREE", bg: C.gold, ink: "#1A1406" },
    { t: "No sign-up", bg: C.ink, ink: "#10141C" },
    { t: "No card", bg: C.ink, ink: "#10141C" },
    { t: "No email", bg: C.ink, ink: "#10141C" },
  ];
  return (
    <AbsoluteFill style={{ opacity: fade, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34, marginTop: -150 }}>
        {badges.map((b, i) => {
          const pop = spring({ frame: f - 4 - i * 12, fps, config: { damping: 9, stiffness: 180 } });
          return (
            <div key={b.t} style={{ background: b.bg, color: b.ink, fontFamily: "Bricolage", fontSize: 92, letterSpacing: -1, padding: "18px 54px", borderRadius: 999, transform: `scale(${pop}) rotate(${(i % 2 ? 2 : -2)}deg)`, boxShadow: "0 30px 60px -24px rgba(0,0,0,.8)" }}>
              {b.t}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---- scene 6: want it? ----
const SceneAsk: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = interpolate(f, [0, 8], [0, 1], clamp);
  const pop = spring({ frame: f, fps, config: { damping: 11 } });
  const pulse = 1 + 0.12 * Math.max(0, Math.sin(((f - 20) / 15) * Math.PI)) * (f > 20 && f < 50 ? 1 : 0);
  return (
    <AbsoluteFill style={{ opacity: fade, alignItems: "center", justifyContent: "center" }}>
      <div style={{ marginTop: -140, display: "flex", flexDirection: "column", alignItems: "center", gap: 34, transform: `scale(${0.85 + 0.15 * pop})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "Bricolage", fontSize: 50, color: C.ink }}>
          <img src={staticFile("icon.svg")} style={{ width: 72, height: 72, borderRadius: 18 }} />
          Lista Mandado
        </div>
        <div style={{ width: 820, boxSizing: "border-box", borderRadius: 40, padding: "40px 44px", textAlign: "center", border: "3px solid rgba(214,41,118,.65)", background: "linear-gradient(135deg, rgba(254,218,117,.16), rgba(214,41,118,.24) 55%, rgba(79,91,213,.26))", fontFamily: "Nunito" }}>
          <div style={{ color: C.muted, fontWeight: 900, fontSize: 32, letterSpacing: 3 }}>WANT IT?</div>
          <div style={{ color: C.ink, fontFamily: "Bricolage", fontSize: 64, lineHeight: 1.05, marginTop: 14 }}>Follow me + DM me</div>
          <div style={{ display: "inline-block", marginTop: 22, background: C.ink, color: "#10141C", fontFamily: "Bricolage", fontSize: 96, letterSpacing: 4, borderRadius: 22, padding: "4px 34px", transform: `scale(${pulse})` }}>LIST</div>
          <div style={{ color: C.muted, fontWeight: 800, fontSize: 36, marginTop: 22 }}>and I'll send you the app 📲</div>
          <div style={{ color: C.gold, fontWeight: 900, fontSize: 30, marginTop: 18, letterSpacing: 0.5 }}>Free · No sign-up · No card · No email</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Zigzag: React.FC<{ lang: "en" }> = () => {
  const frame = useCurrentFrame();
  const glowX = interpolate(frame, [0, 450], [30, 70]);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(700px 800px at ${glowX}% 58%, rgba(196,55,43,.30), rgba(196,55,43,0) 70%), radial-gradient(1000px 600px at 50% 0%, #1E2A44 0%, rgba(30,42,68,0) 70%), linear-gradient(180deg, ${C.bg1} 0%, ${C.bg2} 100%)` }}>
      {/* "Shop Along" from 0:13, fading out over the last 1.5 s */}
      <Audio src={staticFile("shop-along.mp3")} startFrom={13 * 30} volume={(f) => interpolate(f, [405, 450], [1, 0], clamp)} />
      <Sequence from={0} durationInFrames={75}><SceneZig /></Sequence>
      <Sequence from={75} durationInFrames={45}><SceneStop /></Sequence>
      <Sequence from={120} durationInFrames={120}><SceneSort /></Sequence>
      <Sequence from={240} durationInFrames={75}><SceneClean /></Sequence>
      <Sequence from={315} durationInFrames={60}><SceneBadges /></Sequence>
      <Sequence from={375} durationInFrames={75}><SceneAsk /></Sequence>
    </AbsoluteFill>
  );
};
