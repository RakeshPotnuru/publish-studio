import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";
import type Stripe from "stripe";

import { constants } from "../../config/constants";
import type { Context } from "../../trpc";
import { logtail } from "../../utils/logtail";
import stripe from "../../utils/stripe";
import UserService from "../user/user.service";
import type { IUser } from "../user/user.types";
import Payment from "./payment.model";
import type { IPayment, TPaymentCreateInput } from "./payment.types";

export default class PaymentService extends UserService {
  async updateCustomer(user: IUser, customer_id: string) {
    try {
      const params: Stripe.CustomerUpdateParams = {
        name: user.first_name + " " + user.last_name,
        email: user.email,
        description: `Customer user id: ${user._id.toString()}`,
      };

      return await stripe.customers.update(customer_id, params);
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id: user._id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error creating customer",
      });
    }
  }

  async deleteCustomer(customer_id: string, user_id: Types.ObjectId) {
    try {
      return await stripe.customers.del(customer_id);
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error deleting customer",
      });
    }
  }

  async createCheckoutSession(ctx: Context) {
    try {
      const params: Stripe.Checkout.SessionCreateParams = {
        customer: ctx.user.stripe_customer_id,
        customer_email: ctx.user.email,
        mode: "subscription",
        line_items: [
          {
            price: constants.payment.plans.proMonthly.PRICE_ID,
            quantity: 1,
          },
        ],
        success_url:
          process.env.CLIENT_URL +
          "/payment-success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: process.env.CLIENT_URL,
        client_reference_id: ctx.user._id.toString(),
      };

      return await stripe.checkout.sessions.create(params);
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id: ctx.user._id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error creating checkout session. Please try again later.",
      });
    }
  }

  async fetchCheckoutSession(session_id: string, user_id: Types.ObjectId) {
    try {
      return await stripe.checkout.sessions.retrieve(session_id);
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching checkout session",
      });
    }
  }

  async createPayment(payment: TPaymentCreateInput) {
    try {
      return await Payment.create(payment);
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id: payment.user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error creating payment",
      });
    }
  }

  async getPayment(user_id: Types.ObjectId): Promise<IPayment | null> {
    try {
      return await Payment.findOne({
        user_id,
      });
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching payment",
      });
    }
  }

  async getPaymentBySubscriptionId(subscription_id: string) {
    try {
      return await Payment.findOne({
        subscription_id: subscription_id,
      });
    } catch (error) {
      await logtail.error(JSON.stringify(error));

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching payment",
      });
    }
  }

  async deletePayment(payment_id: Types.ObjectId, user_id: Types.ObjectId) {
    try {
      return await Payment.findOneAndDelete({
        _id: payment_id,
        user_id,
      });
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error deleting payment",
      });
    }
  }

  async cancelSubscription(subscription_id: string, user_id: Types.ObjectId) {
    try {
      return await stripe.subscriptions.cancel(subscription_id);
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
}
