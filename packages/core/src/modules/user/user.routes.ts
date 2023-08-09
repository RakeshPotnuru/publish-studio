import { protectedProcedure, t } from "../../trpc";
import UserController from "./user.controller";

const userRouter = t.router({
    me: protectedProcedure.query(({ ctx }) => new UserController().getMeHandler(ctx)),

    getUser: protectedProcedure.query(({ ctx }) => new UserController().getUserHandler(ctx)),
});

export default userRouter;
