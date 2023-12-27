import assetRouter from "./modules/asset/asset.routes";
import authRouter from "./modules/auth/auth.routes";
import folderRouter from "./modules/folder/folder.routes";
import generativeAIRouter from "./modules/generative-ai/generate-ai.routes";
import nluRouter from "./modules/nlu/nlu.routes";
import paymentRouter from "./modules/payment/payment.routes";
import platformRouter from "./modules/platform/platform.routes";
import projectRouter from "./modules/project/project.routes";
import userRouter from "./modules/user/user.routes";
import { mergeRouters } from "./trpc";

const appRouter = mergeRouters(
    authRouter,
    userRouter,
    folderRouter,
    projectRouter,
    assetRouter,
    platformRouter,
    paymentRouter,
    generativeAIRouter,
    nluRouter,
);

export type AppRouter = typeof appRouter;
export default appRouter;
