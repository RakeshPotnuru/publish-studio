import type { Types } from "mongoose";
import { z } from "zod";

import { protectedProcedure, router } from "../../trpc";
import NotificationController from "./notification.controller";

const notificationRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      new NotificationController().createNotificationHandler(input, ctx),
    ),

  markRead: protectedProcedure
    .input(z.array(z.custom<Types.ObjectId>()))
    .mutation(({ input, ctx }) =>
      new NotificationController().markReadHandler(input, ctx),
    ),

  getAll: protectedProcedure.query(({ ctx }) =>
    new NotificationController().getNotificationsHandler(ctx),
  ),
});

export default notificationRouter;
