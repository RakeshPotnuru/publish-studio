import type { Types } from "mongoose";
import { z } from "zod";

import { proProtectedProcedure, router } from "../../trpc";
import GenerativeAIController from "./generative-ai.controller";

const generativeAIRouter = router({
    generate: router({
        title: proProtectedProcedure
            .input(z.object({ project_id: z.custom<Types.ObjectId>() }))
            .mutation(({ input, ctx }) =>
                new GenerativeAIController().generateTitleHandler(input, ctx),
            ),

        description: proProtectedProcedure
            .input(z.object({ project_id: z.custom<Types.ObjectId>() }))
            .mutation(({ input, ctx }) =>
                new GenerativeAIController().generateDescriptionHandler(input, ctx),
            ),

        outline: proProtectedProcedure
            .input(z.object({ project_id: z.custom<Types.ObjectId>() }))
            .mutation(({ input, ctx }) =>
                new GenerativeAIController().generateOutlineHandler(input, ctx),
            ),
    }),
});

export default generativeAIRouter;
