import Chart, { ArcElement, ChartData, ChartOptions } from "chart.js/auto";
import { useTheme } from "next-themes";
import { Doughnut } from "react-chartjs-2";

import type { ITopicStats } from "@publish-studio/core";

import { ErrorBox } from "@/components/ui/error-box";
import { trpc } from "@/utils/trpc";
import { Skeleton } from "@itsrakesh/ui";

const generateChartData = (topics: ITopicStats[]): ChartData<"doughnut"> => {
    const labels = topics.map(({ topic }) => topic);
    const data = topics.map(({ count }) => count);

    return {
        labels,
        datasets: [
            {
                data,
                backgroundColor: ["#7077A1", "#00ADB5", "#3F72AF", "#FF2E63", "#E84545"],
            },
        ],
    };
};

Chart.register(ArcElement);

export function TopicStats() {
    const { theme } = useTheme();

    const { data, isFetching, error } = trpc.getTopicStats.useQuery({});

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

    return error ? (
        <ErrorBox title="Error fetching stats" description={error.message} />
    ) : (
        <div className="flow-row flex items-center space-x-6">
            <div className="size-52">
                {isFetching ? (
                    <Skeleton className="size-52 rounded-full" />
                ) : chartData.labels?.length ? (
                    <Doughnut data={chartData} options={config} />
                ) : (
                    <div className="size-52 bg-secondary text-muted-foreground flex items-center justify-center rounded-full">
                        No enough data
                    </div>
                )}
            </div>
            <div className="flex-1">
                <h4 className="text-lg font-semibold">Your top topics</h4>
                {isFetching ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={`skeleton-${index + 1}`}
                            className="text-muted-foreground mt-2 flex items-center text-sm"
                        >
                            <div className="size-5 mr-2">
                                <Skeleton className="size-5" />
                            </div>
                            <Skeleton className="h-5 w-28" />
                        </div>
                    ))
                ) : chartData.labels?.length ? (
                    chartData.labels.map((label, index) => (
                        <div
                            key={`${label}-${index + 1}`}
                            className="text-muted-foreground mt-2 flex items-center text-sm"
                        >
                            <div
                                className="size-4 mr-2"
                                style={{
                                    backgroundColor: (
                                        chartData.datasets?.[0].backgroundColor as string[]
                                    )[index],
                                }}
                            />
                            <span>{label as string}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-muted-foreground flex h-20 items-center text-sm">
                        No enough data
                    </p>
                )}
            </div>
        </div>
    );
}
