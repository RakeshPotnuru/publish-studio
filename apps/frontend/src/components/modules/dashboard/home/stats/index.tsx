import EmotionScores from "./emotion-scores";
import { ProjectStats } from "./project-stats";
import ReadingTimeAndWordCount from "./reading-time-word-count";
import { TopicStats } from "./topic-stats";

export function Stats() {
  return (
    <div className="grid grid-cols-2 gap-4 *:rounded-lg *:border *:p-4 xl:grid-cols-3">
      <TopicStats />
      <ProjectStats />
      <ReadingTimeAndWordCount />
      <EmotionScores />
    </div>
  );
}
