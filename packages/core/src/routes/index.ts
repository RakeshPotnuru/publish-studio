import { t } from "../trpc";
import authRouter from "./auth.routes";
import folderRouter from "./folder.routes";
import projectRouter from "./project.routes";
import userRouter from "./user.routes";

const trpcRouter = t.mergeRouters(authRouter, userRouter, folderRouter, projectRouter);

export type TRPCRouter = typeof trpcRouter;
export default trpcRouter;
