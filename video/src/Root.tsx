import React from "react";
import { Composition } from "remotion";
import { Zigzag } from "./Zigzag";
import { Talk } from "./Talk";
import { Guide } from "./Guide";
import { GuideWide } from "./GuideWide";
import { LongWide } from "./LongWide";

// 15 s vertical Reels at 30 fps.
export const Root: React.FC = () => (
  <>
    <Composition id="MinuteWideEN" component={LongWide} durationInFrames={1800} fps={30} width={1920} height={1080} />
    <Composition id="PostWideEN" component={GuideWide} durationInFrames={450} fps={30} width={1920} height={1080} />
    <Composition id="PostEN" component={Guide} durationInFrames={450} fps={30} width={1080} height={1920} />
    <Composition id="TalkEN" component={Talk} durationInFrames={450} fps={30} width={1080} height={1920} />
    <Composition id="ZigzagEN" component={Zigzag} durationInFrames={450} fps={30} width={1080} height={1920} defaultProps={{ lang: "en" as const }} />
  </>
);
