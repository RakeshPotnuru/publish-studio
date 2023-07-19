import { t } from "../trpc";
import authRouter from "./auth.routes";
import folderRouter from "./folder.routes";
import userRouter from "./user.routes";

const trpcRouter = t.mergeRouters(authRouter, userRouter, folderRouter);

export type TRPCRouter = typeof trpcRouter;
export default trpcRouter;
