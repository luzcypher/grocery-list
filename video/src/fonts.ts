import { continueRender, delayRender, staticFile } from "remotion";

// Load the app's fonts before any frame renders.
const handle = delayRender("fonts");
Promise.all([
  new FontFace("Nunito", `url(${staticFile("fonts/nunito.woff2")})`, { weight: "200 1000" }).load(),
  new FontFace("Bricolage", `url(${staticFile("fonts/bricolage-800.woff2")})`, { weight: "800" }).load(),
])
  .then((faces) => { faces.forEach((f) => document.fonts.add(f)); continueRender(handle); })
  .catch(() => continueRender(handle));
