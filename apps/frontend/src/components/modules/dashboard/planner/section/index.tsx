import { useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  ScrollArea,
  ScrollBar,
} from "@itsrakesh/ui";
import type { ISection } from "@publish-studio/core";
import { constants } from "@publish-studio/core/src/config/constants";

import { Task } from "../task";
import { NewTask } from "../task/new-task";
import { NewSection } from "./new-section";
import { SectionActions } from "./section-actions";
import { Title } from "./title";

interface SectionProps {
  data?: ISection[];
}

export function Sections({ data }: Readonly<SectionProps>) {
  const [sections, setSections] = useState<ISection[]>(data ?? []);
  const [editingSectionId, setEditingSectionId] = useState<
    ISection["_id"] | null
  >(null);

  return (
    <ScrollArea className="max-w-[74vw]">
      <div className="flex flex-row gap-4 pb-4">
        {sections?.map((section) => (
          <Card key={section._id.toString()} className="min-w-72">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-1 uppercase">
                <Title
                  section={section}
                  editingSectionId={editingSectionId}
                  setEditingSectionId={setEditingSectionId}
                />{" "}
                <span className="rounded-md bg-secondary p-1 py-0 text-xs text-muted-foreground">
                  {section.tasks?.length}
                </span>
              </CardTitle>
              {section.name !== constants.planner.section.name.RESERVED && (
                <SectionActions
                  section={section}
                  setEditingSectionId={setEditingSectionId}
                />
              )}
            </CardHeader>
            <CardContent className="pb-0">
              <ScrollArea className="h-[58vh]">
                <div className="flex flex-col gap-2">
                  {section.tasks?.map((task) => (
                    <Task
                      key={task._id.toString()}
                      task={task}
                      setSections={setSections}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="justify-center py-2">
              <NewTask section_id={section._id} setSections={setSections} />
            </CardFooter>
          </Card>
        ))}
        <NewSection setSections={setSections} />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
