import { ProjectStats } from "./project-stats";
import { TopicStats } from "./topic-stats";

export function Stats() {
    return (
        <div className="flex flex-row justify-evenly space-x-4 *:w-1/2 *:rounded-lg *:border *:p-4">
            <TopicStats />
            <ProjectStats />
        </div>
    );
}
