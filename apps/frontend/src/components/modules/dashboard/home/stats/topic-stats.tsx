import type { ChartConfig } from "@itsrakesh/ui";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Skeleton,
} from "@itsrakesh/ui";
import type { ICategoryStats } from "@publish-studio/core";
import { Pie, PieChart } from "recharts";

import { shortenText } from "@/utils/text-shortener";
import { trpc } from "@/utils/trpc";

import StatsShell from "./common/stats-shell";

const generateChart = (categories: ICategoryStats[]) => {
  const labels = categories.map(({ category }) => category);
  const counts = categories.map(({ count }) => count);

  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const data = labels.map((label, index) => ({
    label,
    count: counts[index],
    fill: colors[index],
  }));

  const config: ChartConfig = {
    count: {
      label: "Count",
    },
  };

  for (const [index, label] of labels.entries()) {
    config[label] = {
      label,
      color: colors[index],
    };
  }

  return {
    data,
    config,
  };
};

export function TopicStats() {
  const { data, isFetching, error } = trpc.stats.getCategories.useQuery({});

  const chart = generateChart(data?.data.stats || []);

  const chartView = chart.data?.length ? (
    <ChartContainer
      config={chart.config}
      className="aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie data={chart.data} dataKey="count" nameKey="label" label />
      </PieChart>
    </ChartContainer>
  ) : (
    <div className="flex size-52 items-center justify-center rounded-full bg-secondary text-muted-foreground">
      No enough data
    </div>
  );

  const labelsView =
    chart.data.length > 0 ? (
      chart.data.map((item, index) => (
        <div
          key={`${item.label}-${index + 1}`}
          className="mt-2 flex items-center text-sm text-muted-foreground"
        >
          <div
            className="mr-2 size-4"
            style={{
              backgroundColor: item.fill,
            }}
          />
          <span title={item.label.length > 20 ? item.label : ""}>
            {shortenText(item.label, 20)}
          </span>
        </div>
      ))
    ) : (
      <p className="flex h-20 items-center text-sm text-muted-foreground">
        No enough data
      </p>
    );

  return (
    <StatsShell
      heading="Top Categories"
      error={error?.message}
      className="text-center"
    >
      <div className="flex flex-row items-center space-x-6">
        <div className="size-52">
          {isFetching ? (
            <Skeleton className="size-52 rounded-full" />
          ) : (
            chartView
          )}
        </div>
        <div className="flex-1">
          {isFetching
            ? Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={`skeleton-${index + 1}`}
                  className="mt-2 flex items-center text-sm text-muted-foreground"
                >
                  <div className="mr-2 size-5">
                    <Skeleton className="size-5" />
                  </div>
                  <Skeleton className="h-5 w-28" />
                </div>
              ))
            : labelsView}
        </div>
      </div>
    </StatsShell>
  );
}
