import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { GuideWide } from "./GuideWide";
import { AppPhone, SECTIONS, STORE_ORDER } from "./Talk";

// One-minute 16:9 video (1920 × 1080, 30 fps): the opener, then a short demo of each point, then the opener again as the ending.
// "Shop Along" plays from 0:13 to 1:13 and fades out at the end.

const C = { ink: "#F3F1EA", muted: "#A9B0BE", red: "#E8574A", gold: "#F2B632", green: "#7BC25A" };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

const OPEN = 240, VOICE = 240, SORT = 600, LANG = 960, FREE = 1260, END = 1500, TOTAL = 1800;
const SPOKEN = "milk, apples, bread and chicken";
const SPOKEN_ORDER = [3, 0, 1, 2];

// Right-hand caption: a numbered point with a short line under it.
const Point: React.FC<{ n?: string; title: React.ReactNode; sub?: string; start: number; end: number }> = ({ n, title, sub, start, end }) => {
  const f = useCurrentFrame();
  const inP = interpolate(f, [start, start + 18], [0, 1], { ...clamp, easing: ease });
  const outP = interpolate(f, [end - 12, end], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 250, left: 820, right: 140, opacity: inP * outP, transform: `translateX(${(1 - inP) * 120}px)` }}>
      {n && <div style={{ width: 110, height: 110, borderRadius: "50%", background: C.red, color: "#10141C", fontFamily: "Bricolage", fontSize: 72, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 30 }}>{n}</div>}
      <div style={{ fontFamily: "Bricolage", fontSize: 96, lineHeight: 1, letterSpacing: -1.8, color: C.ink }}>{title}</div>
      {sub && <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 44, color: C.muted, marginTop: 26, lineHeight: 1.25 }}>{sub}</div>}
    </div>
  );
};

// One phone stays on screen from the first demo to the free badges, changing as each point is shown.
const DemoPhone: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: f - VOICE, fps, config: { damping: 18 } });
  const leave = interpolate(f, [END - 20, END], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  // 1. talk to it
  const v = f - VOICE;
  const mic = v >= 40 && v <= 150 ? (v - 40) / 60 : 0;
  const typed = Math.round(interpolate(v, [48, 140], [0, SPOKEN.length], clamp));
  const bubble = v > 40 && v < 156 ? SPOKEN.slice(0, typed) : "";
  const filled = SECTIONS.map((_, i) => interpolate(v, [164 + SPOKEN_ORDER.indexOf(i) * 14, 176 + SPOKEN_ORDER.indexOf(i) * 14], [0, 1], { ...clamp, easing: ease }));
  const flash = SECTIONS.map((_, i) => { const a = 164 + SPOKEN_ORDER.indexOf(i) * 14; return interpolate(v, [a, a + 6, a + 20], [0, 1, 0], clamp); });
  // 2. sorts itself to your store's shelves
  const s = f - SORT;
  const store = s < 60 ? "Standard" : "Walmart";
  const move = interpolate(s, [90, 150], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const pos = SECTIONS.map((_, i) => i + (STORE_ORDER.indexOf(i) - i) * move);
  const aisles = interpolate(s, [160, 178], [0, 1], { ...clamp, easing: ease });
  const tap = interpolate(s, [48, 54, 60], [1, 0.97, 1], clamp);
  // 3. English & Spanish
  const es = f >= LANG + 100 && f < FREE + 10;
  const flip = interpolate(f, [LANG + 92, LANG + 100, LANG + 108], [1, 0.94, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 60, left: 220, transform: `translateX(${(1 - enter) * -900 - leave * 900}px) scale(${tap * flip})`, transformOrigin: "50% 50%" }}>
      <AppPhone filled={filled} pos={pos} store={store} aisles={aisles} mic={mic} bubble={bubble} flash={flash} es={es} />
    </div>
  );
};

// The English | Español switch shown during the language demo.
const LangSwitch: React.FC = () => {
  const f = useCurrentFrame();
  const on = f >= LANG + 100;
  const appear = interpolate(f, [LANG + 30, LANG + 48], [0, 1], { ...clamp, easing: ease });
  const out = interpolate(f, [FREE - 12, FREE], [1, 0], clamp);
  const pill = (label: string, active: boolean) => (
    <div style={{ padding: "16px 40px", borderRadius: 999, fontFamily: "Nunito", fontWeight: 900, fontSize: 46, background: active ? C.red : "transparent", color: active ? "#10141C" : C.ink }}>{label}</div>
  );
  return (
    <div style={{ position: "absolute", top: 760, left: 820, display: "flex", gap: 8, padding: 8, borderRadius: 999, border: "3px solid #2A3240", background: "#1A202B", opacity: appear * out, transform: `scale(${0.9 + 0.1 * appear})` }}>
      {pill("English", !on)}
      {pill("Español", on)}
    </div>
  );
};

const Badges: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const list = [
    { t: "FREE", bg: C.gold, ink: "#1A1406" },
    { t: "No sign-up", bg: C.ink, ink: "#10141C" },
    { t: "No email", bg: C.ink, ink: "#10141C" },
    { t: "No card", bg: C.ink, ink: "#10141C" },
  ];
  const out = interpolate(f, [END - 12, END], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 200, left: 820, right: 140, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 34, opacity: out }}>
      {list.map((b, i) => {
        const pop = spring({ frame: f - FREE - 20 - i * 20, fps, config: { damping: 9, stiffness: 170 } });
        return <div key={b.t} style={{ background: b.bg, color: b.ink, fontFamily: "Bricolage", fontSize: i === 0 ? 120 : 92, letterSpacing: -1, padding: "10px 56px", borderRadius: 999, transform: `scale(${pop}) rotate(${i % 2 ? 1.5 : -1.5}deg)`, transformOrigin: "left center", boxShadow: "0 30px 60px -24px rgba(0,0,0,.8)" }}>{b.t}</div>;
      })}
    </div>
  );
};

export const LongWide: React.FC = () => {
  const f = useCurrentFrame();
  const glowX = interpolate(f, [0, TOTAL], [18, 34]);
  const openOut = interpolate(f, [OPEN - 14, OPEN], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(760px 700px at ${glowX}% 55%, rgba(196,55,43,.32), rgba(196,55,43,0) 70%), radial-gradient(1200px 520px at 60% 0%, #1E2A44 0%, rgba(30,42,68,0) 70%), linear-gradient(180deg, #121827 0%, #0B0F18 100%)` }}>
      <Audio src={staticFile("shop-along.mp3")} startFrom={13 * 30} volume={(fr) => interpolate(fr, [TOTAL - 60, TOTAL], [1, 0], clamp)} />

      {/* 0–8 s: the opener */}
      <Sequence from={0} durationInFrames={OPEN}><AbsoluteFill style={{ opacity: openOut }}><GuideWide music={false} /></AbsoluteFill></Sequence>

      {/* 8–50 s: the phone demos each point */}
      <DemoPhone />
      <Point n="1" start={VOICE} end={SORT} title={<>Talk <span style={{ color: C.red }}>to it.</span></>} sub="Say “milk, apples, bread and chicken”. Each one lands in its section." />
      <Point n="2" start={SORT} end={LANG} title={<>It sorts itself to your <span style={{ color: C.red }}>store's shelves.</span></>} sub="Pick your store once. Your list follows its aisles." />
      <Point n="3" start={LANG} end={FREE} title={<>English <span style={{ color: C.red }}>&amp; Spanish.</span></>} sub="One tap switches the whole list." />
      <LangSwitch />
      <Badges />

      {/* 50–60 s: the opener again as the ending, holding on "DM me LIST" */}
      <Sequence from={END} durationInFrames={TOTAL - END}><GuideWide music={false} /></Sequence>
    </AbsoluteFill>
  );
};
