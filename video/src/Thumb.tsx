import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import "./fonts";

// 16:9 thumbnail (1280 × 720): the app in dark mode on a phone at left, the three features at right. Nothing else.
const FEATURES = ["Sorts itself by aisle", "Add items by voice", "English & Spanish"];

export const Thumb: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(520px 520px at 26% 55%, rgba(196,55,43,.38), rgba(196,55,43,0) 70%), radial-gradient(900px 400px at 60% 0%, #1E2A44 0%, rgba(30,42,68,0) 70%), linear-gradient(180deg, #121827 0%, #0B0F18 100%)", fontFamily: "Nunito", color: "#F3F1EA" }}>
    {/* phone, drawn at 310 × 650 */}
    <div style={{ position: "absolute", top: 35, left: 120, width: 310, height: 650, borderRadius: 52, background: "#050608", padding: 10, boxSizing: "border-box", boxShadow: "0 0 0 2px #3A3F48, 0 0 0 4px #8A8F99, 0 0 0 6px #2B2F36, 0 40px 70px -24px rgba(0,0,0,.85), 0 16px 40px -16px rgba(196,55,43,.5)" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 42, overflow: "hidden", background: "#10141C", position: "relative", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "absolute", top: 9, left: "50%", transform: "translateX(-50%)", width: 92, height: 27, borderRadius: 15, background: "#000", zIndex: 2 }} />
        <div style={{ height: 42, flex: "none", display: "flex", alignItems: "center", padding: "5px 26px 0 34px", color: "#fff", fontWeight: 800, fontSize: 14 }}>9:41</div>
        <Img src={staticFile("screen-en.png")} style={{ width: "100%", flex: 1, objectFit: "cover", objectPosition: "top" }} />
        <div style={{ position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)", width: 100, height: 4, borderRadius: 2, background: "#fff", opacity: 0.9, zIndex: 2 }} />
      </div>
    </div>
    {/* the three features */}
    <div style={{ position: "absolute", top: 0, bottom: 0, left: 520, right: 70, display: "flex", flexDirection: "column", justifyContent: "center", gap: 44 }}>
      {FEATURES.map((t) => (
        <div key={t} style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span style={{ flex: "none", width: 72, height: 72, borderRadius: "50%", background: "rgba(123,194,90,.22)", color: "#7BC25A", fontSize: 42, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>
          <span style={{ fontFamily: "Bricolage", fontSize: 64, lineHeight: 1, letterSpacing: -1 }}>{t}</span>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
