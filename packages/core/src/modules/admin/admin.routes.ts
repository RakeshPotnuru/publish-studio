import { z } from "zod";

import { adminProtectedProcedure, router, t } from "../../trpc";
import AuthController from "../auth/auth.controller";
import AdminController from "./admin.controller";

const adminAuthRouter = router({
  login: t.procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }),
    )
    .mutation(({ input, ctx }) =>
      new AuthController().adminLoginHandler(input, ctx),
    ),
});

const adminEmailRouter = router({
  sendTosNotice: adminProtectedProcedure.mutation(() =>
    new AdminController().sendTosNoticeHandler(),
  ),
});

export { adminAuthRouter, adminEmailRouter };
