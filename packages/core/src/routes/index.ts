import HelloController from "../controllers/hello.controller";

const trpcRouter = {
    hello: new HelloController().get(),
};

export type TRPCRouter = typeof trpcRouter;
export default trpcRouter;
