"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button, toast } from "@itsrakesh/ui";
import type { Paddle, PaddleEventData } from "@paddle/paddle-js";
import { CheckoutEventNames, initializePaddle } from "@paddle/paddle-js";
import { UserType } from "@publish-studio/core/src/config/constants";
import { useTheme } from "next-themes";

import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { siteConfig } from "@/config/site";
import useUserStore from "@/lib/stores/user";
import { trpc } from "@/utils/trpc";

export default function Pay() {
  const [paddle, setPaddle] = useState<Paddle>();
  const [eventData, setEventData] = useState<PaddleEventData>();

  const { user, isLoading } = useUserStore();
  const { theme } = useTheme();
  const router = useRouter();
  const { mutateAsync: upgradePlan } = trpc.sub.upgradePlan.useMutation({
    onSuccess: ({ data }) => {
      toast.success(data.message);
      window.location.href = siteConfig.pages.dashboard.link;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN) return;

    initializePaddle({
      environment:
        process.env.NEXT_PUBLIC_SITE_ENV === "production"
          ? "production"
          : "sandbox",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
      eventCallback: function (data) {
        if (data.name == CheckoutEventNames.CHECKOUT_COMPLETED) {
          setEventData(data);
        }
      },
      checkout: {
        settings: {
          displayMode: "overlay",
          theme: theme === "dark" ? "dark" : "light",
          allowLogout: false,
        },
      },
    })
      .then((paddleInstance: Paddle | undefined) => {
        if (paddleInstance) {
          setPaddle(paddleInstance);
        }
      })
      .catch(() => {
        // Ignore
      });
  }, [theme]);

  const handlePaymentSuccess = useCallback(async () => {
    if (!eventData?.data?.transaction_id) {
      return;
    }

    try {
      await upgradePlan(eventData.data.transaction_id);
    } catch {
      // Ignore
    }
  }, [eventData, upgradePlan]);

  useEffect(() => {
    if (eventData) {
      handlePaymentSuccess().catch(() => {
        // Ignore
      });
    }
  }, [eventData, handlePaymentSuccess]);

  const openCheckout = () => {
    if (!user || !paddle || !process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID)
      return;

    paddle.Checkout.open({
      items: [
        { priceId: process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID, quantity: 1 },
      ],
      customer: {
        email: user.email,
      },
      customData: {
        user_id: user._id.toString(),
      },
    });
  };

  const { mutateAsync: getTxn, isLoading: isTxnLoading } =
    trpc.sub.restart.useMutation({
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const restartSubscription = async () => {
    if (!user || !paddle) return;

    try {
      const { data } = await getTxn();

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

  if (user?.user_type !== UserType.FREE) {
    router.push(siteConfig.pages.dashboard.link);
  }

  return (
    <Center className="min-h-[90dvh]">
      <div className="container mx-auto flex w-full flex-col justify-center space-y-6 rounded-none bg-background p-14 shadow-xl sm:w-[500px] sm:rounded-lg">
        <Heading level={2}>
          {user?.customer_id ? "Restart your subscription" : "One last step!"}
        </Heading>
        <p>
          {user?.customer_id
            ? "Your subscription has been paused. Restart your subscription to unlock all the features and get access to the full power of Publish Studio."
            : "Your free trial has been expired. Start your subscription to unlock all the features and get access to the full power of Publish Studio."}
        </p>
        {user?.customer_id ? (
          <Button onClick={restartSubscription} disabled={!user}>
            <ButtonLoader isLoading={isTxnLoading || isLoading}>
              Restart Subscription
            </ButtonLoader>
          </Button>
        ) : (
          <Button onClick={openCheckout} disabled={!user}>
            <ButtonLoader isLoading={isLoading}>
              Start Subscription
            </ButtonLoader>
          </Button>
        )}
      </div>
    </Center>
  );
}
