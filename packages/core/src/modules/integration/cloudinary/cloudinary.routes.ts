import { z } from "zod";

import { proProtectedProcedure, router } from "../../../trpc";
import CloudinaryController from "./cloudinary.controller";

const cloudinaryRouter = router({
  connect: proProtectedProcedure
    .input(
      z.object({
        cloud_name: z.string(),
        api_key: z.string(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new CloudinaryController().createIntegrationHandler(input, ctx),
    ),

  update: proProtectedProcedure
    .input(
      z.object({
        cloud_name: z.string(),
        api_key: z.string(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new CloudinaryController().updateIntegrationHandler(input, ctx),
    ),

  disconnect: proProtectedProcedure.query(({ ctx }) =>
    new CloudinaryController().deleteIntegrationHandler(ctx),
  ),

  get: proProtectedProcedure.query(({ ctx }) =>
    new CloudinaryController().getIntegrationHandler(ctx),
  ),
});

export default cloudinaryRouter;
