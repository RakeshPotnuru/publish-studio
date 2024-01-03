import { Skeleton } from "@itsrakesh/ui";
import { ChartData, ChartOptions } from "chart.js/auto";
import { format } from "date-fns";
import { useTheme } from "next-themes";
import { Line } from "react-chartjs-2";

import type { IProjectStats } from "@publish-studio/core";

import { ErrorBox } from "@/components/ui/error-box";
import { trpc } from "@/utils/trpc";

const generateChartData = (projects: IProjectStats[]): ChartData<"line"> => {
    const labels = projects.map(project => format(project.date, "dd MMM"));
    const data = projects.map(project => project.count);

    return {
        labels,
        datasets: [
            {
                label: "No of Projects",
                data,
                borderColor: "#EB5757",
                tension: 0.1,
            },
        ],
    };
};

export function ProjectStats() {
    const { theme } = useTheme();

    const { data, isFetching, error } = trpc.getProjectStats.useQuery({});

    const chartData = generateChartData(data?.data.stats || []);

    const config: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    color: theme === "dark" ? "hsl(217, 7%, 22%)" : "hsl(210 40% 96.1%)",
                },
            },
            y: {
                grid: {
                    color: theme === "dark" ? "hsl(217, 7%, 22%)" : "hsl(210 40% 96.1%)",
                },
                ticks: {
                    precision: 0,
                },
                max: data?.data.stats[0].count && data?.data.stats[0].count < 10 ? 10 : undefined,
            },
        },
    };

    const chartView = chartData.labels?.length ? (
        <Line data={chartData} options={config} />
    ) : (
        <div className="bg-secondary text-muted-foreground flex h-full w-80 items-center justify-center">
            No enough data
        </div>
    );

    return error ? (
        <div className="flex items-center justify-center">
            <ErrorBox title="Error fetching stats" description={error.message} />
        </div>
    ) : (
        <div className="flex flex-col items-center space-y-4">
            <h4 className="text-lg font-semibold">Your activity</h4>
            <div className="h-full">
                {isFetching ? <Skeleton className="h-full w-80" /> : chartView}
            </div>
        </div>
    );
}
