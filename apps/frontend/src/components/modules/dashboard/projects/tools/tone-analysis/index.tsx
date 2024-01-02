import { Button, Skeleton, toast } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { useState } from "react";

import type { IProject } from "@publish-studio/core";

import { Icons } from "@/assets/icons";
import { Heading } from "@/components/ui/heading";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { MagicButton } from "@/components/ui/magic-button";
import { MagicText } from "@/components/ui/magic-text";
import fleschReadingEaseScore from "@/utils/flesch-reading-ease-score";
import { trpc } from "@/utils/trpc";
import type { MenuProps } from "../../editor/menu/fixed-menu";
import { Analysis, IToneAnalysis, TEmotionScores } from "./analysis";

interface ToneAnalysisProps extends MenuProps {
    project: IProject;
}

export function ToneAnalysis({ editor, project }: Readonly<ToneAnalysisProps>) {
    const [data, setData] = useState<Partial<IToneAnalysis>>();

    const { mutateAsync: analyzeContent, isLoading } = trpc.getToneAnalysis.useMutation({
        onError: error => {
            toast.error(error.message);
        },
    });

    const handleAnalyzeContent = async () => {
        try {
            const { data } = await analyzeContent({
                project_id: project._id,
                text: editor.getText(),
            });

            setData(data.analysis);
        } catch (error) {}
    };

    const level = fleschReadingEaseScore(editor.getText())?.schoolLevel;
    const sentiment = data?.sentiment || project.tone_analysis?.sentiment;
    const emotion = data?.emotion ?? project.tone_analysis?.emotion;

    return (
        <div className="space-y-2">
            <div>
                <Heading level={5}>
                    <MagicText>Tone Analysis</MagicText>
                </Heading>
                <p className="text-muted-foreground text-sm">
                    Find out how your content sounds to readers.
                    <br />
                    <span className="text-warning">Note:</span> To use this tool, your content must
                    have a minimum readability level of 5th grade. Current level:{" "}
                    <span
                        className={cn("text-success", {
                            "text-destructive": !level,
                        })}
                    >
                        {level || "No grade"}.
                    </span>
                </p>
            </div>
            {isLoading ? (
                <Skeleton className="h-8 w-full" />
            ) : (
                sentiment &&
                emotion && (
                    <div className="flex flex-row items-center justify-between space-x-1 rounded-lg border p-2">
                        <p className="text-sm">
                            Analysis: <span className="capitalize">{sentiment}</span> and{" "}
                            <span className="capitalize">
                                {(Object.keys(emotion) as Array<keyof TEmotionScores>).reduce(
                                    (acc, key) => (emotion[acc]! > emotion[key]! ? acc : key),
                                )}
                            </span>
                        </p>
                        <Analysis
                            toneAnalysis={{
                                sentiment,
                                emotion,
                            }}
                        >
                            <Button size="sm" variant="outline" className="whitespace-nowrap">
                                Full Analysis
                            </Button>
                        </Analysis>
                    </div>
                )
            )}
            <MagicButton
                onClick={handleAnalyzeContent}
                size="sm"
                className="w-full"
                disabled={isLoading || !level}
            >
                <ButtonLoader isLoading={isLoading}>
                    <Icons.Magic className="mr-2 size-4" />
                    {data || project.tone_analysis ? "Analyze Again" : "Analyze Content"}
                </ButtonLoader>
            </MagicButton>
        </div>
    );
}