import { Router } from "express";

import {
  adminAuthRouter,
  adminEmailRouter,
  adminUserRouter,
} from "./modules/admin/admin.routes";
import assetRouter from "./modules/asset/asset.routes";
import authRouter from "./modules/auth/auth.routes";
import folderRouter from "./modules/folder/folder.routes";
import generativeAIRouter, {
  generativeAIRouterExp,
} from "./modules/generative-ai/generate-ai.routes";
import cloudinaryRouter from "./modules/integration/cloudinary/cloudinary.routes";
import pexelsRouter from "./modules/integration/pexels/pexels.routes";
import unsplashRouter from "./modules/integration/unsplash/unsplash.routes";
import nluRouter from "./modules/nlu/nlu.routes";
import notificationRouter from "./modules/notification/notification.routes";
import sectionRouter from "./modules/planner/section/section.routes";
import taskRouter from "./modules/planner/task/task.routes";
import platformRouter from "./modules/platform/platform.routes";
import postRouter from "./modules/post/post.routes";
import projectRouter from "./modules/project/project.routes";
import statsRouter from "./modules/stats/stats.routes";
import subscriptionRouter from "./modules/subscription/subscription.routes";
import toolsRouter from "./modules/tools/tools.routes";
import userRouter from "./modules/user/user.routes";
import { router, t } from "./trpc";

const adminRouter = router({
  auth: adminAuthRouter,
  email: adminEmailRouter,
  user: adminUserRouter,
});

const appRouter = router({
  admin: adminRouter,
  auth: authRouter,
  users: userRouter,
  folders: folderRouter,
  projects: projectRouter,
  assets: assetRouter,
  platforms: platformRouter,
  stats: statsRouter,
  sub: subscriptionRouter,
  genAI: generativeAIRouter,
  nlu: nluRouter,
  pexels: pexelsRouter,
  unsplash: unsplashRouter,
  cloudinary: cloudinaryRouter,
  notifications: notificationRouter,
  post: postRouter,
  tools: toolsRouter,
  section: sectionRouter,
  task: taskRouter,
});

export default appRouter;
export const createCaller = t.createCallerFactory(appRouter);

const expRouter = Router();

expRouter.use("/", generativeAIRouterExp);

export { expRouter };
