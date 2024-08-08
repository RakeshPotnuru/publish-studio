import { useState } from "react";

import type {
  ChartConfig} from "@itsrakesh/ui";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Skeleton,
} from "@itsrakesh/ui";
import type { IEmotionStats } from "@publish-studio/core";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import { trpc } from "@/utils/trpc";

import RangeFilter from "./common/range-filter";
import StatsShell from "./common/stats-shell";

const generateChart = (emotions: IEmotionStats[]) => {
  const labels = emotions.map((emotion) => emotion.emotion);
  const scores = emotions.map((emotion) => emotion.score);

  const data = labels.map((label, index) => ({
    label,
    score: scores[index],
  }));

  const config: ChartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--chart-1))",
    },
  };

  return {
    data,
    config,
  };
};

export default function EmotionScores() {
  const [range, setRange] = useState<7 | 30 | 365 | undefined>(undefined);

  const { data, isFetching, error } = trpc.stats.getEmotions.useQuery({
    days: range,
  });

  const chart = generateChart(data?.data.stats || []);

  const chartView = (
    <ChartContainer
      config={chart.config}
      className="max-h-[200px] min-h-[200px]"
    >
      <RadarChart data={chart.data}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="label" />
        <PolarGrid />
        <Radar dataKey="score" fill="var(--color-score)" fillOpacity={0.6} />
      </RadarChart>
    </ChartContainer>
  );

  return (
    <StatsShell error={error?.message} heading="Emotions" className="relative">
      <RangeFilter onRangeChange={setRange} allTime />
      <div className="h-full">
        {isFetching ? <Skeleton className="h-52 w-80" /> : chartView}
      </div>
    </StatsShell>
  );
}
