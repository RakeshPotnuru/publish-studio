import type { Types } from "mongoose";
import { z } from "zod";

import { adminProtectedProcedure, router, t } from "../../../trpc";
import InviteController from "./invite.controller";

const inviteRouter = router({
  addToWaitList: t.procedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(({ input }) =>
      new InviteController().addToWaitListHandler(input)
    ),

  invite: adminProtectedProcedure
    .input(z.array(z.custom<Types.ObjectId>()))
    .mutation(({ input }) => new InviteController().inviteHandler(input)),

  getAll: adminProtectedProcedure
    .input(
      z.object({
        pagination: z.object({
          page: z.number().int().positive().default(1),
          limit: z.number().int().positive().default(10),
        }),
      })
    )
    .query(({ input }) => new InviteController().getAllHandler(input)),
});

export default inviteRouter;
