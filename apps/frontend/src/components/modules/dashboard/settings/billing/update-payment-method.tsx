import { Button, toast } from "@itsrakesh/ui";
import type { Paddle } from "@paddle/paddle-js";

import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import useUserStore from "@/lib/stores/user";
import { trpc } from "@/utils/trpc";

interface UpdatePaymentMethodProps {
  paddle?: Paddle;
  isLoading: boolean;
}

export default function UpdatePaymentMethod({
  paddle,
  isLoading,
}: Readonly<UpdatePaymentMethodProps>) {
  const { mutateAsync: updatePaymentMethod, isLoading: isTxnLoading } =
    trpc.sub.updatePaymentMethod.useMutation({
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { user } = useUserStore();

  const handleUpdatePaymentMethod = async () => {
    if (!user || !paddle) return;

    try {
      const { data } = await updatePaymentMethod();

      paddle.Checkout.open({
        transactionId: data.transaction.id,
        customer: {
          email: user.email,
        },
        customData: {
          user_id: user._id.toString(),
        },
      });
    } catch {
      // Ignore
    }
  };

  const isDisabled = isLoading || isTxnLoading;

  return (
    <Button
      onClick={handleUpdatePaymentMethod}
      variant="outline"
      disabled={isDisabled}
    >
      <ButtonLoader isLoading={isDisabled}>Update Payment Method</ButtonLoader>
    </Button>
  );
}
