import { t } from "../trpc";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";

const trpcRouter = t.mergeRouters(authRouter, userRouter);

export type TRPCRouter = typeof trpcRouter;
export default trpcRouter;
