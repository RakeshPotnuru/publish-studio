import type {
  ChartConfig} from "@itsrakesh/ui";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { Sentiment } from "@publish-studio/core/src/config/constants";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export type TEmotionScores = {
  [key in "joy" | "anger" | "disgust" | "fear" | "sadness"]?: number;
};

export interface IToneAnalysis {
  sentiment: Sentiment;
  emotion: TEmotionScores;
}

interface AnalysisProps extends React.HTMLAttributes<HTMLDialogElement> {
  toneAnalysis: IToneAnalysis;
}

const sentiments: {
  label: string;
  value: Sentiment;
  className: string;
}[] = [
  {
    label: "😃 Positive",
    value: Sentiment.POSITIVE,
    className: "text-success",
  },
  {
    label: "😐 Neutral",
    value: Sentiment.NEUTRAL,
    className: "text-neutral-500",
  },
  {
    label: "😟 Negative",
    value: Sentiment.NEGATIVE,
    className: "text-destructive",
  },
];
const emotions = [
  {
    label: "😊 Joy",
    value: "joy",
    className: "text-[#FFD700]",
    color: "hsl(var(--chart-1))",
  },
  {
    label: "😢 Sadness",
    value: "sadness",
    className: "text-[#4682B4]",
    color: "hsl(var(--chart-2))",
  },
  {
    label: "😨 Fear",
    value: "fear",
    className: "text-[#8B4513]",
    color: "hsl(var(--chart-3))",
  },
  {
    label: "😖 Disgust",
    value: "disgust",
    className: "text-[#228B22]",
    color: "hsl(var(--chart-4))",
  },
  {
    label: "😡 Anger",
    value: "anger",
    className: "text-[#FF4500]",
    color: "hsl(var(--chart-5))",
  },
];

const sortEmotions = (emotion: TEmotionScores) => {
  return Object.entries(emotion).sort(([, a], [, b]) => b - a);
};

const generateChart = (emotion: TEmotionScores) => {
  const labels = Object.keys(emotion).map((key) => {
    const emotion = emotions.find(({ value }) => value === key);

    if (!emotion) return key;

    return emotion.label;
  });

  const data = labels.map((label, index) => ({
    label,
    score: Object.values(emotion)[index],
    fill: emotions[index].color,
  }));

  const config: ChartConfig = {
    score: {
      label: "Score",
    },
  };

  for (const [index, label] of labels.entries()) {
    config[label] = {
      label,
      color: emotions[index].color,
    };
  }

  return {
    data,
    config,
  };
};

export function Analysis({ toneAnalysis, children }: Readonly<AnalysisProps>) {
  const { sentiment, emotion } = toneAnalysis;

  const sortedValues = sortEmotions(emotion);
  const chart = generateChart(emotion);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
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

          <ChartContainer config={chart.config}>
            <BarChart accessibilityLayer data={chart.data}>
              <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  String(
                    chart.config[value as keyof typeof chart.config]?.label,
                  )
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="score" strokeWidth={2} radius={8} />
            </BarChart>
          </ChartContainer>

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
              {
                emotions.find(({ value }) => value === sortedValues[0][0])
                  ?.label
              }
            </span>{" "}
            and lower levels of{" "}
            {sortedValues.slice(1).map(([key], index, array) => {
              const emotion = emotions.find(({ value }) => value === key);
              const label = emotion?.label;
              const className = emotion?.className;

              let separator = "";
              if (index < array.length - 2) {
                separator = ", ";
              } else if (index === array.length - 2) {
                separator = ", and ";
              }

              return (
                <span key={key}>
                  <span className={cn(className)}>{label}</span>
                  {separator}
                </span>
              );
            })}
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
