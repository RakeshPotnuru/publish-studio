import { useRouter } from "next/navigation";

import { DropdownMenuItem, toast } from "@itsrakesh/ui";
import type { ITask } from "@publish-studio/core";

import { Icons } from "@/assets/icons";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

interface CreateProjectProps {
  task: ITask;
}

export function CreateProject({ task }: Readonly<CreateProjectProps>) {
  const router = useRouter();

  const { mutateAsync: create } = trpc.projects.create.useMutation({
    onSuccess: ({ data }) => {
      toast.success("Project created successfully");
      router.push(
        `${siteConfig.pages.projects.link}/${data.project._id.toString()}`,
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateProject = async () => {
    try {
      await create({
        name: task.name,
        body: {
          markdown: task.description,
        },
      });
    } catch {
      // Ignore
    }
  };

  return (
    <DropdownMenuItem onClick={handleCreateProject}>
      <Icons.Projects className="mr-2 size-4" />
      Convert to project
    </DropdownMenuItem>
  );
}
