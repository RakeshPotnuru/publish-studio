"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button, toast } from "@itsrakesh/ui";
import type { Paddle } from "@paddle/paddle-js";
import { CheckoutEventNames, initializePaddle } from "@paddle/paddle-js";
import { UserType } from "@publish-studio/core/src/config/constants";
import { useTheme } from "next-themes";

import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { siteConfig } from "@/config/site";
import useUserStore from "@/lib/stores/user";
import { trpc } from "@/utils/trpc";

let defaultUrl: string;
if (process.env.SITE_ENV === "production") {
  defaultUrl = "https://app.publishstudio.one";
} else if (process.env.SITE_ENV === "staging") {
  defaultUrl = "https://stg.app.publishstudio.one";
} else {
  defaultUrl = "http://localhost:3000";
}

export default function Pay() {
  const [paddle, setPaddle] = useState<Paddle>();

  const { user, isLoading } = useUserStore();
  const { theme } = useTheme();
  const router = useRouter();
  const { mutateAsync: upgradePlan } = trpc.sub.upgradePlan.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN) return;

    initializePaddle({
      environment:
        process.env.SITE_ENV === "production" ? "production" : "sandbox",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
      eventCallback: function (data) {
        if (data.name == CheckoutEventNames.CHECKOUT_COMPLETED) {
          upgradePlan({ data: data }).catch(() => {
            // Ignore
          });
        }
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
  }, [upgradePlan]);

  const openCheckout = () => {
    if (!user || !paddle || !process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID)
      return;

    paddle.Checkout.open({
      items: [
        { priceId: process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID, quantity: 1 },
      ],
      settings: {
        displayMode: "overlay",
        theme: theme === "dark" ? "dark" : "light",
        successUrl: `${defaultUrl}${siteConfig.pages.dashboard.link}`,
        allowLogout: false,
      },
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
        settings: {
          displayMode: "overlay",
          theme: theme === "dark" ? "dark" : "light",
          successUrl: `${defaultUrl}${siteConfig.pages.dashboard.link}`,
          allowLogout: false,
        },
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
            : "Start your subscription to unlock all the features and get access to the full power of Publish Studio."}
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
