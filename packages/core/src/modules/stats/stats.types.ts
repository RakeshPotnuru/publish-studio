export interface ICategoryStats {
  category: string;
  count: number;
}

export interface IProjectStats {
  count: number;
  date: Date;
}

export interface IReadTimeStats {
  read_time: number;
}

export interface IWordStats {
  word_count: number;
}

export interface IEmotionStats {
  emotion: string;
  score: number;
}
