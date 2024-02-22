import { Button, toast } from "@itsrakesh/ui";
import type { IInvite } from "@publish-studio/core";

import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { trpc } from "@/utils/trpc";

export function Invite({ data }: Readonly<{ data: IInvite }>) {
  const { mutateAsync: invite, isLoading } =
    trpc.admin.invites.invite.useMutation({
      onSuccess: ({ data }) => {
        toast.success(data.message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleInvite = async () => {
    try {
      await invite([data._id]);
    } catch {
      // Ignore
    }
  };

  return (
    <Button onClick={handleInvite} size="sm" disabled={data.is_invited}>
      {data.is_invited ? (
        "Invited"
      ) : (
        <ButtonLoader isLoading={isLoading}>Invite</ButtonLoader>
      )}
    </Button>
  );
}
