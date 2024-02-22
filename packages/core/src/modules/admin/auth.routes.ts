import { z } from "zod";

import { router, t } from "../../trpc";
import AuthController from "../auth/auth.controller";

const adminAuthRouter = router({
  login: t.procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(({ input, ctx }) =>
      new AuthController().adminLoginHandler(input, ctx)
    ),
});

export default adminAuthRouter;
