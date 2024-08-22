import { z } from "zod";

import { MediumStatus } from "../../../config/constants";
import { proProtectedProcedure, router } from "../../../trpc";
import MediumController from "./medium.controller";

const mediumRouter = router({
  connect: proProtectedProcedure
    .input(
      z.object({
        api_key: z.string(),
        status: z.nativeEnum(MediumStatus),
        notify_followers: z.boolean(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new MediumController().createPlatformHandler(input, ctx),
    ),

  update: proProtectedProcedure
    .input(
      z.object({
        api_key: z.string().optional(),
        status: z.nativeEnum(MediumStatus).optional(),
        notify_followers: z.boolean().optional(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new MediumController().updatePlatformHandler(input, ctx),
    ),

  disconnect: proProtectedProcedure.query(({ ctx }) =>
    new MediumController().deletePlatformHandler(ctx),
  ),
});

export default mediumRouter;
