import EventEmitter from "node:events";

import { observable } from "@trpc/server/observable";
import type { Types } from "mongoose";
import { z } from "zod";

import { protectedProcedure, router, t } from "../../trpc";
import NotificationController from "./notification.controller";
import type { INotification } from "./notification.types";

// eslint-disable-next-line unicorn/prefer-event-target
const ee = new EventEmitter();

const notificationRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { data } =
        await new NotificationController().createNotificationHandler(
          input,
          ctx,
        );

      ee.emit("create", data.notification);

      return data.notification;
    }),

  onCreate: t.procedure.subscription(() => {
    return observable<INotification>((emit) => {
      const onCreate = (data: INotification) => {
        emit.next(data);
      };

      ee.on("create", onCreate);

      return () => {
        ee.off("create", onCreate);
      };
    });
  }),

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
