import { proProtectedProcedure, protectedProcedure, router, t } from "../../trpc";
import PaymentController from "./payment.controller";

const paymentRouter = router({
    createCheckoutSession: protectedProcedure.query(({ ctx }) =>
        new PaymentController().makePaymentHandler(ctx),
    ),

    cancelSubscription: proProtectedProcedure.query(({ ctx }) =>
        new PaymentController().cancelSubscriptionHandler(ctx),
    ),

    stripeWebhook: t.procedure.mutation(({ ctx }) =>
        new PaymentController().stripeWebhookHandler(ctx),
    ),
});

export default paymentRouter;
