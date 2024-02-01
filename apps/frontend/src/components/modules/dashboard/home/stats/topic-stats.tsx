import { Skeleton } from "@itsrakesh/ui";
import type { ICategoryStats } from "@publish-studio/core";
import type { ChartData, ChartOptions } from "chart.js/auto";
import Chart, { ArcElement } from "chart.js/auto";
import { useTheme } from "next-themes";
import { Doughnut } from "react-chartjs-2";

import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { trpc } from "@/utils/trpc";

const generateChartData = (categories: ICategoryStats[]): ChartData<"doughnut"> => {
    const labels = categories.map(({ category }) => category);
    const data = categories.map(({ count }) => count);

    return {
        labels,
        datasets: [
            {
                data,
                backgroundColor: ["#525CEB", "#F4CE14", "#609966", "#FF2E63", "#E84545"],
            },
        ],
    };
};

Chart.register(ArcElement);

export function TopicStats() {
    const { theme } = useTheme();

    const { data, isFetching, error } = trpc.stats.getCategories.useQuery({});

    const chartData = generateChartData(data?.data.stats || []);

    const config: ChartOptions<"doughnut"> = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        borderColor: theme === "dark" ? "hsl(230, 7.5%, 15.7%)" : "hsl(0 0% 100%)",
    };

    const chartView = chartData.labels?.length ? (
        <Doughnut data={chartData} options={config} />
    ) : (
        <div className="flex size-52 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            No enough data
        </div>
    );

    const labelsView = chartData.labels?.length ? (
        (chartData.labels as ICategoryStats["category"][]).map((label, index) => (
            <div
                key={`${label}-${index + 1}`}
                className="mt-2 flex items-center text-sm text-muted-foreground"
            >
                <div
                    className="mr-2 size-4"
                    style={{
                        backgroundColor: (chartData.datasets[0].backgroundColor as string[])[index],
                    }}
                />
                <span>{label}</span>
            </div>
        ))
    ) : (
        <p className="flex h-20 items-center text-sm text-muted-foreground">No enough data</p>
    );

    return error ? (
        <Center>
            <ErrorBox title="Error fetching stats" description={error.message} />
        </Center>
    ) : (
        <div className="flex flex-col items-center space-y-4">
            <h4 className="text-lg font-semibold">Top categories</h4>
            <div className="flex flex-row items-center space-x-6">
                <div className="size-52">
                    {isFetching ? <Skeleton className="size-52 rounded-full" /> : chartView}
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
        </div>
    );
}
