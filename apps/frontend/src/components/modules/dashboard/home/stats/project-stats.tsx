import { useState } from "react";

import type { ChartConfig } from "@itsrakesh/ui";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Skeleton,
} from "@itsrakesh/ui";
import type { IProjectStats } from "@publish-studio/core";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { trpc } from "@/utils/trpc";

import RangeFilter from "./common/range-filter";
import StatsShell from "./common/stats-shell";

const generateChart = (projects: IProjectStats[], isWeek: boolean) => {
  const labels = projects.map((project) =>
    format(project.date, isWeek ? "EEE" : "LLL d"),
  );
  const counts = projects.map((project) => project.count);

  const data = labels.map((label, index) => ({
    label,
    count: counts[index],
  }));

  const config: ChartConfig = {
    count: {
      label: "Projects",
      color: "hsl(var(--chart-1))",
    },
  };

  return {
    data,
    config,
  };
};

export function ProjectStats() {
  const [range, setRange] = useState<7 | 30 | 365 | undefined>(7);

  const { data, isFetching, error } = trpc.stats.getProjects.useQuery({
    days: range,
  });

  const isWeek = range === 7;
  const chart = generateChart(data?.data.stats || [], isWeek);

  const chartView = (
    <ChartContainer config={chart.config} className="min-h-[200px]">
      <AreaChart
        accessibilityLayer
        data={chart.data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray={"3 3"} />
        <XAxis dataKey="label" tickMargin={8} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Area
          dataKey="count"
          type="linear"
          fill="var(--color-count)"
          fillOpacity={0.4}
          stroke="var(--color-count)"
        />
      </AreaChart>
    </ChartContainer>
  );

  return (
    <StatsShell error={error?.message} heading="Activity" className="relative">
      <RangeFilter onRangeChange={setRange} />
      <div className="h-full">
        {isFetching ? <Skeleton className="h-full w-80" /> : chartView}
      </div>
    </StatsShell>
  );
}
