import UserController from "../controllers/user.controller";
import { protectedProcedure, t } from "../trpc";

const userRouter = t.router({
    me: protectedProcedure.query(({ ctx }) => new UserController().getMeHandler(ctx)),
});

export default userRouter;
