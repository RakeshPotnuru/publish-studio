import { protectedProcedure, t } from "../../trpc";
import UserController from "./user.controller";

const userRouter = t.router({
    me: protectedProcedure.query(({ ctx }) => new UserController().getMeHandler(ctx)),
});

export default userRouter;
