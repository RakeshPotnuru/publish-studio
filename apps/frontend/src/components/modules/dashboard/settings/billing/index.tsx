"use client";

import { useEffect, useState } from "react";

import { Alert, AlertDescription, Badge, Skeleton } from "@itsrakesh/ui";
import type { Paddle } from "@paddle/paddle-js";
import { initializePaddle } from "@paddle/paddle-js";
import { constants, UserType } from "@publish-studio/core/src/config/constants";
import { format } from "date-fns";
import { useTheme } from "next-themes";

import { siteConfig } from "@/config/site";
import useUserStore from "@/lib/stores/user";
import { trpc } from "@/utils/trpc";

import Header from "../common/header";
import CancelSubscription from "./cancel-subscription";
import UpdatePaymentMethod from "./update-payment-method";

export default function Billing() {
  const [paddle, setPaddle] = useState<Paddle>();

  const { user, isLoading: isUserLoading } = useUserStore();
  const { theme } = useTheme();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN) return;

    initializePaddle({
      environment:
        process.env.NEXT_PUBLIC_SITE_ENV === "production"
          ? "production"
          : "sandbox",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
      checkout: {
        settings: {
          displayMode: "overlay",
          theme: theme === "dark" ? "dark" : "light",
          successUrl: `${siteConfig.url}${siteConfig.pages.settings.billing.link}`,
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

  const { data, isFetching } = trpc.sub.get.useQuery();

  const isLoading = isUserLoading || isFetching;

  return (
    <Header
      title={siteConfig.pages.settings.billing.title}
      description={siteConfig.pages.settings.billing.description}
    >
      {data?.data.subscription?.scheduled_change?.action === "cancel" &&
        data.data.subscription.scheduled_change.effectiveAt && (
          <Alert className="border-warning text-warning">
            <AlertDescription>
              ⚠️ Your subscription will be canceled on{" "}
              {format(
                data.data.subscription.scheduled_change.effectiveAt,
                "PPp",
              )}
              . To undo this, click on &quot;Undo Cancellation&quot;.
            </AlertDescription>
          </Alert>
        )}
      {user?.user_type === UserType.TRIAL ? (
        <div>
          <p>
            Your free trial expires in{" "}
            {format(
              new Date(user.created_at).getTime() + constants.FREE_TRIAL_TIME,
              "PPp",
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2 *:flex *:flex-row *:justify-between">
            <div>
              <p>Current Plan</p>
              {isUserLoading ? (
                <Skeleton className="h-6 w-20" />
              ) : (
                <Badge variant={"secondary"}>{user?.user_type}</Badge>
              )}
            </div>
            <div className="text-muted-foreground">
              <p>Next Billing Date</p>
              {isFetching ? (
                <Skeleton className="h-6 w-32" />
              ) : (
                data?.data.subscription?.next_billed_at && (
                  <time
                    dateTime={data.data.subscription.next_billed_at.toString()}
                  >
                    {format(data.data.subscription.next_billed_at, "PPp")}
                  </time>
                )
              )}
            </div>
            <div className="text-muted-foreground">
              <p>Subscription Status</p>
              {isFetching ? (
                <Skeleton className="h-6 w-20" />
              ) : (
                <Badge variant={"secondary"}>
                  {data?.data.subscription?.status}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            {isFetching ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              data?.data.subscription?.started_at && (
                <p className="text-sm text-muted-foreground">
                  Subscribed since{" "}
                  {format(data.data.subscription.started_at, "PP")}
                </p>
              )
            )}
            <div className="float-right space-x-4">
              <UpdatePaymentMethod paddle={paddle} isLoading={isLoading} />
              <CancelSubscription
                isLoading={isLoading}
                scheduledChange={data?.data.subscription?.scheduled_change}
              />
            </div>
          </div>
        </div>
      )}
    </Header>
  );
}
