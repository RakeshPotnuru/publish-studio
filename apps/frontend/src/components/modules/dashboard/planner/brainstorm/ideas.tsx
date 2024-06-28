import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  ScrollArea,
} from "@itsrakesh/ui";
import { constants } from "@publish-studio/core/src/config/constants";

import usePlannerStore from "@/lib/store/planner";

import { CreateProject } from "../common/create-project";
import { NewTask } from "../common/new-task";

interface IdeasProps {
  ideas: string[];
}

export function Ideas({ ideas }: IdeasProps) {
  return (
    <ScrollArea className="h-96">
      <div className="flex flex-wrap gap-2">
        {ideas.map((idea, i) => (
          <Idea key={`idea-${i + 1}`} idea={idea} />
        ))}
      </div>
    </ScrollArea>
  );
}

type IdeaProps = {
  idea: string;
};

function Idea({ idea }: IdeaProps) {
  const { sections } = usePlannerStore();
  const unassignedSectionId = sections.find(
    (section) => section.name === constants.planner.section.name.RESERVED,
  )?._id;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"secondary"} size={"sm"} className="h-fit py-1.5">
          {idea}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <CreateProject name={idea} />
        {unassignedSectionId && (
          <NewTask
            name={idea}
            sectionId={unassignedSectionId}
            className="justify-start px-2 py-1.5 text-sm"
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
