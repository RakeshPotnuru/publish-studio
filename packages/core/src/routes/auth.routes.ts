import { z } from "zod";

import AuthController from "../controllers/auth.controller";
import { t } from "../trpc";

const authRouter = t.router({
    register: t.procedure
        .input(
            z.object({
                first_name: z.string().min(3).max(25),
                last_name: z.string().min(3).max(25),
                email: z.string().email().toLowerCase(),
                password: z
                    .string()
                    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!$%&*?@])[\d!$%&*?@A-Za-z]{8,}$/),
                profile_pic: z.string().optional(),
                user_type: z.enum(["free", "pro"]).optional().default("free"),
            }),
        )
        .mutation(({ input }) => new AuthController().registerHandler(input)),

    login: t.procedure
        .input(
            z.object({
                email: z.string().email(),
                password: z.string().min(8),
            }),
        )
        .mutation(({ input, ctx }) => new AuthController().loginHandler(input, ctx)),

    logout: t.procedure.mutation(({ ctx }) => new AuthController().logoutHandler(ctx)),

    refresh: t.procedure.query(({ ctx }) => new AuthController().refreshAccessTokenHandler(ctx)),
});

export default authRouter;
