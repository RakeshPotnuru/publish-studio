"use client";

import { Button, toast } from "@itsrakesh/ui";

import { trpc } from "@/utils/trpc";

export function Home() {
  const { mutateAsync: init, isLoading } =
    trpc.admin.planner.initPlannerForExistingUsers.useMutation({
      onSuccess: () => {
        toast.success("Planner initialized successfully for all users");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return (
    <div className="space-y-8">
      <Button onClick={() => init()} disabled={isLoading}>
        Initialize planner
      </Button>
    </div>
  );
}
