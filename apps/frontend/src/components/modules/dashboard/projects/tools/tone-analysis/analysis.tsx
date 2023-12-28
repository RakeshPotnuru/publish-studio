import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import Chart, { CategoryScale, ChartData, ChartOptions } from "chart.js/auto";
import { useTheme } from "next-themes";
import { Bar } from "react-chartjs-2";

import { constants } from "@/config/constants";

export type TSentimentLabel =
    (typeof constants.project.tone_analysis.sentiments)[keyof typeof constants.project.tone_analysis.sentiments];

export type TEmotionScores = {
    [key in "joy" | "anger" | "disgust" | "fear" | "sadness"]?: number;
};

export interface IToneAnalysis {
    sentiment: TSentimentLabel;
    emotion: TEmotionScores;
}

interface AnalysisProps extends React.HTMLAttributes<HTMLDialogElement> {
    toneAnalysis: IToneAnalysis;
}

Chart.register(CategoryScale);

const sentiments = [
    { label: "😃 Positive", value: "positive", className: "text-success" },
    { label: "😐 Neutral", value: "neutral", className: "text-neutral-500" },
    { label: "😟 Negative", value: "negative", className: "text-destructive" },
];
const emotions = [
    { label: "😊 Joy", value: "joy", className: "text-[#FFD700]", color: "#FFD700" },
    { label: "😢 Sadness", value: "sadness", className: "text-[#4682B4]", color: "#4682B4" },
    { label: "😨 Fear", value: "fear", className: "text-[#8B4513]", color: "#8B4513" },
    { label: "😖 Disgust", value: "disgust", className: "text-[#228B22]", color: "#228B22" },
    { label: "😡 Anger", value: "anger", className: "text-[#FF4500]", color: "#FF4500" },
];

const sortEmotions = (emotion: TEmotionScores) => {
    return Object.entries(emotion).sort(([, a], [, b]) => b - a);
};

const generateChartData = (emotion: TEmotionScores): ChartData<"bar"> => {
    const labels = Object.keys(emotion).map(key => {
        const { label } = emotions.find(({ value }) => value === key)!;
        return label;
    });

    return {
        labels,
        datasets: [
            {
                label: "Emotions",
                data: Object.values(emotion),
                backgroundColor: emotions.map(({ color }) => color),
            },
        ],
    };
};

export function Analysis({ toneAnalysis, children }: AnalysisProps) {
    const { theme } = useTheme();

    const { sentiment, emotion } = toneAnalysis;

    const sortedValues = sortEmotions(emotion);
    const data = generateChartData(emotion);

    const config: ChartOptions<"bar"> = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "Emotions",
                color: theme === "dark" ? "hsl(234, 4%, 44%)" : "hsl(215.4 16.3% 46.9%)",
            },
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
                max: 1,
            },
        },
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tone Analysis</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p>
                        <span className="text-muted-foreground">Sentiment:</span>{" "}
                        <span
                            className={cn(
                                "capitalize",
                                sentiments.find(({ value }) => sentiment === value)?.className,
                            )}
                        >
                            {sentiments.find(({ value }) => sentiment === value)?.label}
                        </span>
                    </p>
                    <div>
                        <Bar data={data} options={config} />
                    </div>
                    <p className="text-sm">
                        The text analysis reveals a predominantly{" "}
                        <span
                            className={cn(
                                sentiments.find(({ value }) => sentiment === value)?.className,
                            )}
                        >
                            {sentiment}
                        </span>{" "}
                        sentiment, with a strong presence of{" "}
                        <span
                            className={cn(
                                emotions.find(({ value }) => value === sortedValues[0][0])
                                    ?.className,
                            )}
                        >
                            {emotions.find(({ value }) => value === sortedValues[0][0])?.label}
                        </span>{" "}
                        and lower levels of{" "}
                        {sortedValues.slice(1).map(([key, value], index, array) => (
                            <>
                                <span
                                    key={key}
                                    className={cn(
                                        emotions.find(({ value }) => value === key)?.className,
                                    )}
                                >
                                    {emotions.find(({ value }) => value === key)?.label}
                                </span>
                                {index < array.length - 2
                                    ? ", "
                                    : index === array.length - 2
                                    ? ", and "
                                    : ""}
                            </>
                        ))}
                        .
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
