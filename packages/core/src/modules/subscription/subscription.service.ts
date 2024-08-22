import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import { logtail } from "../../utils/logtail";
import paddle from "../../utils/paddle";
import UserService from "../user/user.service";
import Subscription from "./subscription.model";
import type {
  ISubscription,
  TSubscriptionCreateInput,
} from "./subscription.types";

export default class SubscriptionService extends UserService {
  async createSubscription(subscription: TSubscriptionCreateInput) {
    try {
      return await Subscription.create(subscription);
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id: subscription.user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error creating subscription",
      });
    }
  }

  async getSubscription(
    user_id: Types.ObjectId,
  ): Promise<ISubscription | null> {
    try {
      return await Subscription.findOne({
        user_id,
      });
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching subscription",
      });
    }
  }

  async getSubscriptionBySubscriptionId(subscription_id: string) {
    try {
      return await Subscription.findOne({
        subscription_id: subscription_id,
      });
    } catch (error) {
      await logtail.error(JSON.stringify(error));

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching subscription",
      });
    }
  }

  async updateSubscription(
    user_id: Types.ObjectId,
    subscription_id: string,
    update: Partial<TSubscriptionCreateInput>,
  ) {
    try {
      return await Subscription.findOneAndUpdate(
        { user_id, subscription_id },
        update,
        { new: true },
      );
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error updating subscription",
      });
    }
  }

  async cancelSubscription(subscription_id: string, user_id: Types.ObjectId) {
    try {
      return await paddle.subscriptions.cancel(subscription_id, {
        effectiveFrom: "next_billing_period",
      });
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error cancelling subscription. Please try again later.",
      });
    }
  }

  async undoCancelSubscription(
    subscription_id: string,
    user_id: Types.ObjectId,
  ) {
    try {
      return await paddle.subscriptions.update(subscription_id, {
        scheduledChange: null,
      });
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error cancelling subscription. Please try again later.",
      });
    }
  }

  async restartSubscription(subscription_id: string, user_id: Types.ObjectId) {
    const subscription = await paddle.subscriptions.get(subscription_id);

    try {
      return await paddle.transactions.create({
        items: [
          {
            quantity: subscription.items[0].quantity,
            priceId: subscription.items[0].price.id,
          },
        ],
        customerId: subscription.customerId,
        addressId: subscription.addressId,
      });
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error restarting subscription. Please try again later.",
      });
    }
  }

  async updatePaymentMethod(subscription_id: string, user_id: Types.ObjectId) {
    try {
      return await paddle.subscriptions.getPaymentMethodChangeTransaction(
        subscription_id,
      );
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error updating payment method. Please try again later.",
      });
    }
  }
}
