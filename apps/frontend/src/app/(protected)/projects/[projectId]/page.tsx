import { GoToHome } from "@/components/common/go-to-home";
import { Project } from "@/components/modules/dashboard/projects/project";

export default function ProjectPage({
  params,
}: Readonly<{
  params: { projectId: string };
}>) {
  return (
    <>
      <GoToHome />
      <Project projectId={params.projectId} />
    </>
  );
}
