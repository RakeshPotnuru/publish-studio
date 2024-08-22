import { z } from "zod";

import { proProtectedProcedure, router } from "../../trpc";
import ToolsController from "./tools.controller";

const toolsRouter = router({
  scraper: router({
    getMetadata: proProtectedProcedure
      .input(z.string().url())
      .query(({ input }) => new ToolsController().getMetadataHandler(input)),

    getArticleContent: proProtectedProcedure
      .input(z.string().url())
      .mutation(({ input }) =>
        new ToolsController().getArticleContentHandler(input),
      ),
  }),
});

export default toolsRouter;
