import { z } from "zod";

import { protectedProcedure, router } from "../../../trpc";
import CloudinaryController from "./cloudinary.controller";

const cloudinaryRouter = router({
  connect: protectedProcedure
    .input(
      z.object({
        cloud_name: z.string(),
        api_key: z.string(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new CloudinaryController().createIntegrationHandler(input, ctx),
    ),

  update: protectedProcedure
    .input(
      z.object({
        cloud_name: z.string(),
        api_key: z.string(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new CloudinaryController().updateIntegrationHandler(input, ctx),
    ),

  disconnect: protectedProcedure.query(({ ctx }) =>
    new CloudinaryController().deleteIntegrationHandler(ctx),
  ),

  get: protectedProcedure.query(({ ctx }) =>
    new CloudinaryController().getIntegrationHandler(ctx),
  ),
});

export default cloudinaryRouter;
