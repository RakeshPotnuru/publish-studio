import assetRouter from "./modules/asset/asset.routes";
import authRouter from "./modules/auth/auth.routes";
import folderRouter from "./modules/folder/folder.routes";
import projectRouter from "./modules/project/project.routes";
import userRouter from "./modules/user/user.routes";
import { t } from "./trpc";

const trpcRouter = t.mergeRouters(authRouter, userRouter, folderRouter, projectRouter, assetRouter);

export type TRPCRouter = typeof trpcRouter;
export default trpcRouter;
