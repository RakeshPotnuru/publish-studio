import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  toast,
} from "@itsrakesh/ui";
import type { ISubscription } from "@publish-studio/core";

import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { trpc } from "@/utils/trpc";

interface CancelSubscriptionProps {
  isLoading: boolean;
  scheduledChange?: ISubscription["scheduled_change"];
}

export default function CancelSubscription({
  isLoading,
  scheduledChange,
}: CancelSubscriptionProps) {
  const { mutateAsync: cancel, isLoading: isCancelling } =
    trpc.sub.cancel.useMutation({
      onSuccess: ({ data }) => {
        toast.success(data.message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const utils = trpc.useUtils();

  const handleCancel = async () => {
    try {
      await cancel();
      await utils.sub.get.invalidate();
    } catch {
      // Ignore
    }
  };

  const isDisabled = isLoading || isCancelling;

  return scheduledChange?.action === "cancel" ? (
    <UndoCancellation isLoading={isDisabled} />
  ) : (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isDisabled}>
          <ButtonLoader isLoading={isDisabled}>
            Cancel Subscription
          </ButtonLoader>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="underline">
              Your subscription will be canceled at the end of current billing
              period
            </span>{" "}
            and you will lose access to the platform.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDisabled}>
            Don&apos;t Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel} disabled={isDisabled}>
            <ButtonLoader isLoading={isCancelling}>Cancel</ButtonLoader>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface UndoCancellationProps {
  isLoading: boolean;
}

function UndoCancellation({ isLoading }: Readonly<UndoCancellationProps>) {
  const { mutateAsync: undo, isLoading: isUndoing } =
    trpc.sub.undoCancel.useMutation({
      onSuccess: ({ data }) => {
        toast.success(data.message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const isDisabled = isLoading || isUndoing;
  const utils = trpc.useUtils();

  const handleUndo = async () => {
    try {
      await undo();
      await utils.sub.get.invalidate();
    } catch {
      // Ignore
    }
  };

  return (
    <Button onClick={handleUndo} variant="secondary" disabled={isDisabled}>
      <ButtonLoader isLoading={isUndoing}>Undo Cancellation</ButtonLoader>
    </Button>
  );
}
