import type { Types } from "mongoose";
import { z } from "zod";

import { proProtectedProcedure, router } from "../../trpc";
import GenerativeAIController from "./generative-ai.controller";

const generativeAIRouter = router({
    generateTitle: proProtectedProcedure
        .input(z.object({ project_id: z.custom<Types.ObjectId>() }))
        .mutation(({ input, ctx }) =>
            new GenerativeAIController().generateTitleHandler(input, ctx),
        ),

    generateDescription: proProtectedProcedure
        .input(z.object({ project_id: z.custom<Types.ObjectId>() }))
        .mutation(({ input, ctx }) =>
            new GenerativeAIController().generateDescriptionHandler(input, ctx),
        ),

    generateOutline: proProtectedProcedure
        .input(z.object({ project_id: z.custom<Types.ObjectId>() }))
        .mutation(({ input, ctx }) =>
            new GenerativeAIController().generateOutlineHandler(input, ctx),
        ),
});

export default generativeAIRouter;
