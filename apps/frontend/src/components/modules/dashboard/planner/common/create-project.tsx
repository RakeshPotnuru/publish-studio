import { useRouter } from "next/navigation";

import { DropdownMenuItem, toast } from "@itsrakesh/ui";

import { Icons } from "@/assets/icons";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

interface CreateProjectProps {
  name: string;
  description?: string;
}

export function CreateProject({
  name,
  description,
}: Readonly<CreateProjectProps>) {
  const router = useRouter();

  const { mutateAsync: create } = trpc.projects.create.useMutation({
    onSuccess: ({ data }) => {
      toast.success("Project created successfully", {
        action: {
          label: "Go to project",
          onClick: () => {
            router.push(
              `${siteConfig.pages.projects.link}/${data.project._id.toString()}`,
            );
          },
        },
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateProject = async () => {
    try {
      await create({
        name,
        body: {
          markdown: description,
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
