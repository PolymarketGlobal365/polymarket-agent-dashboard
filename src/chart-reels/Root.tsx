import React from "react";
import { Composition } from "remotion";

import { ChartReel } from "./ChartReel.js";
import { SAMPLE_CHART_REEL_INPUT } from "./sample-input.js";

export function RemotionChartRoot() {
  return (
    <Composition
      id="StockChartReel"
      component={ChartReel}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={8 * 30}
      defaultProps={SAMPLE_CHART_REEL_INPUT}
    />
  );
}
