import type { Sentiment } from "../../config/constants";

export interface IToneAnalysis {
  result: Result;
}

export interface Result {
  data: Data;
}

export interface Data {
  usage: Usage;
  sentiment: ISentiment;
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

export interface ISentiment {
  document: SentimentDocument;
}

export interface SentimentDocument {
  score: number;
  mixed: string;
  label: Sentiment;
}

export interface Usage {
  text_units: number;
  text_characters: number;
  features: number;
}
