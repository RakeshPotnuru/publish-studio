import type { PaddleEventData } from "@paddle/paddle-js";
import { z } from "zod";

import {
  proProtectedProcedure,
  protectedProcedure,
  router,
  t,
} from "../../trpc";
import SubscriptionController from "./subscription.controller";

const subscriptionRouter = router({
  paddleWebhook: t.procedure.mutation(({ ctx }) =>
    new SubscriptionController().paddleWebhookHandler(ctx),
  ),

  upgradePlan: protectedProcedure
    .input(
      z.object({
        data: z.custom<PaddleEventData>(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new SubscriptionController().upgradePlanHandler(input.data, ctx),
    ),

  cancel: proProtectedProcedure.mutation(({ ctx }) =>
    new SubscriptionController().cancelSubscriptionHandler(ctx),
  ),

  undoCancel: proProtectedProcedure.mutation(({ ctx }) =>
    new SubscriptionController().undoCancelSubscriptionHandler(ctx),
  ),

  get: protectedProcedure.query(({ ctx }) =>
    new SubscriptionController().getSubscriptionHandler(ctx),
  ),

  restart: protectedProcedure.mutation(({ ctx }) =>
    new SubscriptionController().restartSubscriptionHandler(ctx),
  ),

  updatePaymentMethod: proProtectedProcedure.mutation(({ ctx }) =>
    new SubscriptionController().updatePaymentMethodHandler(ctx),
  ),
});

export default subscriptionRouter;
