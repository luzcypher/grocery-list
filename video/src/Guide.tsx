import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";

// The giveaway post, built piece by piece for a 15 s Reel, timed to "Shop Along" from 0:13.
// Headline from the top, phone from the left, three bullets from the right, "DM me LIST" from the bottom; then it holds.
// Everything stays inside the Reel safe area: x 110–970, y 220–1460.

const C = { ink: "#F3F1EA", muted: "#A9B0BE", red: "#E8574A", gold: "#F2B632", green: "#7BC25A" };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BULLETS = ["Sorts itself by aisle", "Add items by voice", "English & Spanish"];

const useIn = (start: number) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - start, fps, config: { damping: 18, stiffness: 120 } });
};

const Phone: React.FC = () => (
  <div style={{ width: 350, height: 734, borderRadius: 58, background: "#050608", padding: 12, boxSizing: "border-box", position: "relative", boxShadow: "0 0 0 2px #3A3F48, 0 0 0 5px #8A8F99, 0 0 0 7px #2B2F36, 0 60px 90px -30px rgba(0,0,0,.85), 0 20px 50px -20px rgba(196,55,43,.45)" }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 50, overflow: "hidden", background: "#10141C", position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 110, height: 32, borderRadius: 18, background: "#000", zIndex: 2 }} />
      <div style={{ height: 50, flex: "none", display: "flex", alignItems: "center", padding: "6px 30px 0 40px", color: "#fff", fontFamily: "Nunito", fontWeight: 800, fontSize: 17 }}>9:41</div>
      <Img src={staticFile("screen-en.png")} style={{ width: "100%", flex: 1, objectFit: "cover", objectPosition: "top" }} />
      <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 124, height: 5, borderRadius: 3, background: "#fff", opacity: 0.9, zIndex: 2 }} />
    </div>
  </div>
);

export const Guide: React.FC = () => {
  const f = useCurrentFrame();
  const head = useIn(4);
  const phone = useIn(22);
  const bullets = [useIn(52), useIn(78), useIn(104)];
  const ask = useIn(140);
  // LIST gives a little pulse every 2 s once everything is in.
  const beat = f > 170 ? Math.max(0, Math.sin(((f - 170) / 60) * Math.PI * 2)) : 0;
  const glowX = interpolate(f, [0, 450], [28, 40]);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(620px 760px at ${glowX}% 52%, rgba(196,55,43,.34), rgba(196,55,43,0) 70%), radial-gradient(1000px 560px at 50% 0%, #1E2A44 0%, rgba(30,42,68,0) 70%), linear-gradient(180deg, #121827 0%, #0B0F18 100%)`, fontFamily: "Nunito", color: C.ink }}>
      <Audio src={staticFile("shop-along.mp3")} startFrom={13 * 30} volume={(fr) => interpolate(fr, [405, 450], [1, 0], clamp)} />

      {/* headline from the top */}
      <div style={{ position: "absolute", top: 232, left: 110, right: 110, textAlign: "center", transform: `translateY(${(1 - head) * -420}px)`, opacity: Math.min(1, head * 1.4) }}>
        <span style={{ display: "inline-block", background: C.gold, color: "#1A1406", fontWeight: 900, fontSize: 30, letterSpacing: 4, borderRadius: 999, padding: "8px 28px" }}>FREE</span>
        <div style={{ fontFamily: "Bricolage", fontSize: 80, lineHeight: 1, letterSpacing: -1.6, marginTop: 16 }}>
          Your grocery list,<br /><span style={{ color: C.red }}>in aisle order</span>
        </div>
      </div>

      {/* phone from the left */}
      <div style={{ position: "absolute", top: 520, left: 110, transform: `translateX(${(1 - phone) * -700}px) rotate(${(1 - phone) * -8}deg)` }}>
        <Phone />
      </div>

      {/* three bullets from the right, big */}
      <div style={{ position: "absolute", top: 600, left: 500, right: 110, display: "flex", flexDirection: "column", gap: 54 }}>
        {BULLETS.map((b, i) => (
          <div key={b} style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 18, alignItems: "start", transform: `translateX(${(1 - bullets[i]) * 620}px)`, opacity: Math.min(1, bullets[i] * 1.4) }}>
            <span style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(123,194,90,.2)", color: C.green, fontSize: 36, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>
            <span style={{ fontWeight: 900, fontSize: 50, lineHeight: 1.08 }}>{b}</span>
          </div>
        ))}
      </div>

      {/* DM me LIST from the bottom */}
      <div style={{ position: "absolute", top: 1296, left: 110, right: 110, height: 158, boxSizing: "border-box", borderRadius: 34, border: "3px solid rgba(214,41,118,.65)", background: "linear-gradient(135deg, rgba(254,218,117,.16), rgba(214,41,118,.24) 55%, rgba(79,91,213,.26))", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 34px", transform: `translateY(${(1 - ask) * 700}px)`, opacity: Math.min(1, ask * 1.4) }}>
        <div>
          <div style={{ fontFamily: "Bricolage", fontSize: 54, lineHeight: 1 }}>Follow + DM me</div>
          <div style={{ color: C.gold, fontWeight: 900, fontSize: 30, marginTop: 12 }}>No email · No card</div>
        </div>
        <div style={{ background: C.ink, color: "#10141C", fontFamily: "Bricolage", fontSize: 76, letterSpacing: 3, borderRadius: 20, padding: "2px 26px", transform: `scale(${1 + 0.1 * beat})` }}>LIST</div>
      </div>
    </AbsoluteFill>
  );
};
