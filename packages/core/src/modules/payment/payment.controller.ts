import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";
import mongoose from "mongoose";
import type Stripe from "stripe";

import { constants } from "../../config/constants";
import type { Context } from "../../trpc";
import stripe from "../../utils/stripe";
import PaymentService from "./payment.service";

export default class PaymentController extends PaymentService {
    async stripeWebhookHandler(ctx: Context) {
        const signature = ctx.req.headers["stripe-signature"] as string;
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let event: Stripe.Event;

        // Verify webhook signature and extract the event.
        try {
            event = stripe.webhooks.constructEvent(
                ctx.req.body as Buffer,
                signature,
                endpointSecret,
            );
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Error creating event",
            });
        }

        // Handle the event
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;

                if (session.client_reference_id && session.payment_status === "paid") {
                    await this.upgradePlan(
                        session.id,
                        new mongoose.Types.ObjectId(session.client_reference_id),
                    );
                }

                break;
            }
            case "subscription_schedule.canceled": {
                const subscription = event.data.object;

                await this.downgradePlan(subscription.id);

                break;
            }
            default: {
                console.log(`Unhandled event type ${event.type} from stripe`);
            }
        }

        return {
            status: "success",
            data: {
                message: "Webhook received successfully",
            },
        };
    }

    async makePaymentHandler(ctx: Context) {
        const payment = await super.getPayment(ctx.user?._id);

        if (payment?.isPaid) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "You already have an active subscription",
            });
        }

        const session = await super.createCheckoutSession(ctx);

        return {
            status: "success",
            data: {
                url: session.url,
            },
        };
    }

    private async upgradePlan(session_id: string, user_id: Types.ObjectId) {
        const session = await super.fetchCheckoutSession(session_id);

        await super.updateUser(user_id, {
            user_type: constants.user.userTypes.PRO,
        });

        await super.createPayment({
            user_id: user_id,
            subscription_id: session.subscription as string,
            isPaid: true,
            amount: session.amount_total ?? 0 / 100,
            currency: session.currency ?? constants.payment.currency.NAME,
        });

        const user = await super.getUserById(user_id);

        if (!user) return;

        await super.updateCustomer(user, session.customer as string);

        return {
            status: "success",
            data: {
                message: "Plan upgraded successfully",
            },
        };
    }

    private async downgradePlan(subscription_id: string) {
        const payment = await super.getPaymentBySubscriptionId(subscription_id);

        if (!payment) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "No subscription found",
            });
        }

        await super.deletePayment(payment._id);

        const user = await super.getUserById(payment.user_id);

        if (!user) return;

        if (user.stripe_customer_id) {
            await super.deleteCustomer(user.stripe_customer_id);
        }

        await super.updateUser(user._id, {
            user_type: constants.user.userTypes.FREE,
            stripe_customer_id: undefined,
        });

        return {
            status: "success",
            data: {
                message: "Plan downgraded successfully",
            },
        };
    }

    async cancelSubscriptionHandler(ctx: Context) {
        const payment = await super.getPayment(ctx.user?._id);

        if (!payment) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "No subscription found",
            });
        }

        await super.cancelSubscription(payment.subscription_id);

        return {
            status: "success",
            data: {
                message:
                    "Subscription cancelled successfully. You will be downgraded to the free plan at the end of your billing cycle.",
            },
        };
    }

    async getSessionHandler(session_id: string) {
        const session = await super.fetchCheckoutSession(session_id);

        return {
            status: "success",
            data: { session },
        };
    }
}
