import React from "react";
import { Composition } from "remotion";
import { Zigzag } from "./Zigzag";

// 15 s vertical Reel at 30 fps.
export const Root: React.FC = () => (
  <Composition id="ZigzagEN" component={Zigzag} durationInFrames={450} fps={30} width={1080} height={1920} defaultProps={{ lang: "en" as const }} />
);
