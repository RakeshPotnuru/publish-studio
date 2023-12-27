import type { constants } from "../../config/constants";

export interface IToneAnalysis {
    result: Result;
}

export interface Result {
    data: Data;
}

export interface Data {
    usage: Usage;
    sentiment: Sentiment;
    language: string;
    emotion: DataEmotion;
}

export interface DataEmotion {
    document: EmotionDocument;
}

export interface EmotionDocument {
    emotion: IEmotionScores;
}

export type IEmotionScores = {
    [key in "joy" | "anger" | "disgust" | "fear" | "sadness"]?: number;
};

export interface Sentiment {
    document: SentimentDocument;
}

export type TSentimentLabel =
    (typeof constants.project.tone_analysis.sentiments)[keyof typeof constants.project.tone_analysis.sentiments];

export interface SentimentDocument {
    score: number;
    mixed: string;
    label: TSentimentLabel;
}

export interface Usage {
    text_units: number;
    text_characters: number;
    features: number;
}
