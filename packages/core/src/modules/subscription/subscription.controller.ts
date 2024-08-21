import type { PaddleEventData } from "@paddle/paddle-js";
import type {
  ApiError,
  SubscriptionCreatedEvent,
  SubscriptionUpdatedEvent,
} from "@paddle/paddle-node-sdk";
import { EventName } from "@paddle/paddle-node-sdk";
import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";
import mongoose from "mongoose";

import { UserType } from "../../config/constants";
import { createCaller } from "../../routes";
import type { Context } from "../../trpc";
import { logtail } from "../../utils/logtail";
import paddle from "../../utils/paddle";
import SubscriptionService from "./subscription.service";

export default class SubscriptionController extends SubscriptionService {
  async paddleWebhookHandler(ctx: Context) {
    const signature = ctx.req.headers["paddle-signature"] as string;
    const endpointSecret = process.env.PADDLE_WEBHOOK_SECRET;

    let event;

    // Verify webhook signature and extract the event.
    try {
      event = paddle.webhooks.unmarshal(
        (ctx.req.body || "").toString() as string,
        endpointSecret,
        signature,
      );
    } catch (error: unknown) {
      const paddleApiError = error as ApiError;

      await logtail.error(paddleApiError);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: paddleApiError.message,
      });
    }

    // Handle the event
    switch (event?.eventType) {
      case EventName.SubscriptionCreated: {
        const user_id = (event.data.customData as { user_id: string | null })
          ?.user_id;

        if (user_id) {
          await this.createSubscriptionHandler(
            event,
            new mongoose.Types.ObjectId(user_id),
          );
        }

        break;
      }
      case EventName.SubscriptionUpdated: {
        await this.updateSubscriptionHandler(event);

        break;
      }
      default: {
        console.log(`Unhandled event type ${event?.eventType} from paddle`);
      }
    }

    return {
      status: "success",
      data: {
        message: "Webhook received successfully",
      },
    };
  }

  async upgradePlanHandler(input: PaddleEventData, ctx: Context) {
    const { data } = input;

    await super.updateUser(ctx.user._id, {
      user_type: UserType.PRO,
      customer_id: data?.customer.id,
    });

    await createCaller(ctx).notifications.create({
      message: "Thank you for subscribing.",
      type: "upgraded to pro",
    });

    return {
      status: "success",
      data: {
        message: "Plan upgraded successfully",
      },
    };
  }

  private async createSubscriptionHandler(
    event: SubscriptionCreatedEvent,
    user_id: Types.ObjectId,
  ) {
    const { data, occurredAt } = event;

    const subscription = await super.getSubscription(user_id);

    if (subscription) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Subscription already exists",
      });
    }

    await super.createSubscription({
      subscription_id: data.id,
      collection_mode: data.collectionMode,
      next_billed_at: data.nextBilledAt
        ? new Date(data.nextBilledAt)
        : undefined,
      price_id: data.items[0].price?.id,
      product_id: data.items[0].product?.id,
      status: data.status,
      user_id,
      scheduled_change: {
        action: data.scheduledChange?.action,
        effectiveAt: data.scheduledChange?.effectiveAt
          ? new Date(data.scheduledChange.effectiveAt)
          : undefined,
        resumeAt: data.scheduledChange?.resumeAt
          ? new Date(data.scheduledChange.resumeAt)
          : undefined,
      },
      occurred_at: new Date(occurredAt),
      started_at: data.startedAt ? new Date(data.startedAt) : new Date(),
    });

    return {
      status: "success",
      data: {
        message: "Subscription created successfully",
      },
    };
  }

  private async updateSubscriptionHandler(event: SubscriptionUpdatedEvent) {
    const { data, occurredAt } = event;
    const subscription = await super.getSubscriptionBySubscriptionId(data.id);

    if (!subscription) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No subscription found",
      });
    }

    const user = await super.getUserById(subscription.user_id);

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No user found",
      });
    }

    if (data.status === "canceled") {
      await super.updateUser(user._id, {
        user_type: UserType.FREE,
      });

      const user_id = (data.customData as { user_id: string | null })?.user_id;

      if (user_id)
        /* eslint-disable @typescript-eslint/no-explicit-any */
        await createCaller({
          req: {} as any,
          res: {} as any,
          user: { _id: user_id } as any,
        }).notifications.create({
          message:
            "We are sorry to see you go. Your subscription will be cancelled at the end of the billing cycle. You can restart your subscription anytime or undo the cancellation in billing settings.",
          type: "subscription cancelled",
        });
      /* eslint-enable @typescript-eslint/no-explicit-any */
    }

    await super.updateSubscription(user._id, data.id, {
      status: data.status,
      canceled_at: data.canceledAt ? new Date(data.canceledAt) : undefined,
      occurred_at: new Date(occurredAt),
      next_billed_at: data.nextBilledAt
        ? new Date(data.nextBilledAt)
        : undefined,
      scheduled_change: {
        action: data.scheduledChange?.action,
        effectiveAt: data.scheduledChange?.effectiveAt
          ? new Date(data.scheduledChange.effectiveAt)
          : undefined,
        resumeAt: data.scheduledChange?.resumeAt
          ? new Date(data.scheduledChange.resumeAt)
          : undefined,
      },
      collection_mode: data.collectionMode,
      started_at: data.startedAt ? new Date(data.startedAt) : undefined,
    });

    return {
      status: "success",
      data: {
        message: "Plan downgraded successfully",
      },
    };
  }

  async getSubscriptionHandler(ctx: Context) {
    const subscription = await super.getSubscription(ctx.user._id);

    return {
      status: "success",
      data: {
        subscription,
      },
    };
  }

  async cancelSubscriptionHandler(ctx: Context) {
    const subscription = await super.getSubscription(ctx.user._id);

    if (!subscription) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No subscription found",
      });
    }

    if (subscription.scheduled_change?.action === "cancel") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Subscription is already scheduled for cancellation",
      });
    }

    await super.cancelSubscription(subscription.subscription_id, ctx.user._id);

    return {
      status: "success",
      data: {
        message:
          "Subscription cancelled successfully. You won't be charged from the next billing cycle.",
      },
    };
  }

  async undoCancelSubscriptionHandler(ctx: Context) {
    const subscription = await super.getSubscription(ctx.user._id);

    if (!subscription) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No subscription found",
      });
    }

    await super.undoCancelSubscription(
      subscription.subscription_id,
      ctx.user._id,
    );

    return {
      status: "success",
      data: {
        message: "Subscription cancellation undone successfully",
      },
    };
  }

  async restartSubscriptionHandler(ctx: Context) {
    const subscription = await super.getSubscription(ctx.user._id);

    if (!subscription) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No subscription found",
      });
    }

    const transaction = await super.restartSubscription(
      subscription.subscription_id,
      ctx.user._id,
    );

    return {
      status: "success",
      data: {
        transaction,
      },
    };
  }

  async updatePaymentMethodHandler(ctx: Context) {
    const user_id = ctx.user._id;

    const subscription = await super.getSubscription(user_id);

    if (!subscription || subscription.status === "canceled") {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No subscription found",
      });
    }

    const transaction = await super.updatePaymentMethod(
      subscription.subscription_id,
      user_id,
    );

    return {
      status: "success",
      data: {
        transaction,
      },
    };
  }
}
