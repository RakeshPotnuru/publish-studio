import { z } from "zod";

import { constants } from "../../config/constants";
import { protectedProcedure, router } from "../../trpc";
import UserController from "./user.controller";

const userRouter = router({
    getMe: protectedProcedure.query(({ ctx }) => new UserController().getMeHandler(ctx)),

    getUser: protectedProcedure.query(({ ctx }) => new UserController().getUserHandler(ctx)),

    updateUser: protectedProcedure
        .input(
            z.object({
                first_name: z
                    .string()
                    .regex(/^((?!\p{Extended_Pictographic}).)*$/u, "Emojis are not allowed")
                    .min(constants.user.firstName.MIN_LENGTH)
                    .max(constants.user.firstName.MAX_LENGTH)
                    .optional(),
                last_name: z
                    .string()
                    .regex(/^((?!\p{Extended_Pictographic}).)*$/u, "Emojis are not allowed")
                    .min(constants.user.lastName.MIN_LENGTH)
                    .max(constants.user.lastName.MAX_LENGTH)
                    .optional(),
                profile_pic: z.string().optional(),
            }),
        )
        .mutation(({ ctx, input }) => new UserController().updateUserHandler(input, ctx)),
});

export default userRouter;
