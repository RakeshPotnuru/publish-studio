import { useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@itsrakesh/ui";

import { Icons } from "@/assets/icons";
import { Center } from "@/components/ui/center";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { ProButton } from "@/components/ui/pro-button";

import { Ideas } from "./ideas";
import { PastCategories } from "./past-categories";
import { PastContent } from "./past-content";
import { Topic } from "./topic";

export function Brainstorm() {
  const [ideas, setIdeas] = useState<string[]>([]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ProButton featuretext="use brainstorming tool">
          <Icons.Brain className="mr-2" /> Brainstorm
        </ProButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Brainstorm Ideas</DialogTitle>
          <DialogDescription>
            Brainstorm ideas based on past content, topics, and past categories.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="past-content">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="past-content">Past Content</TabsTrigger>
            <TabsTrigger value="past-categories">Past Categories</TabsTrigger>
            <TabsTrigger value="topic">Topic</TabsTrigger>
          </TabsList>
          <TabsContent value="past-content">
            <PastContent setIdeas={setIdeas} />
          </TabsContent>
          <TabsContent value="past-categories">
            <PastCategories setIdeas={setIdeas} />
          </TabsContent>
          <TabsContent value="topic">
            <Topic setIdeas={setIdeas} />
          </TabsContent>
        </Tabs>
        {ideas.length > 0 && (
          <>
            <Ideas ideas={ideas} />
            <Button
              onClick={() => setIdeas([])}
              variant={"outline"}
              size={"sm"}
              className=" w-max"
            >
              <Icons.Delete className="mr-2" /> Clear
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface GenerateIdeasButtonProps {
  isLoading: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function GenerateIdeasButton({
  isLoading,
  onClick,
  disabled,
}: GenerateIdeasButtonProps) {
  return (
    <Center>
      <Button
        onClick={onClick}
        className="w-full"
        disabled={isLoading || disabled}
      >
        <ButtonLoader isLoading={isLoading}>Generate Ideas</ButtonLoader>
      </Button>
    </Center>
  );
}
