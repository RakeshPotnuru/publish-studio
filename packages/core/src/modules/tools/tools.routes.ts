import { z } from "zod";

import { protectedProcedure, router } from "../../trpc";
import ToolsController from "./tools.controller";

const toolsRouter = router({
  scraper: router({
    getMetadata: protectedProcedure
      .input(z.string().url())
      .query(({ input }) => new ToolsController().getMetadataHandler(input)),

    getArticleContent: protectedProcedure
      .input(z.string().url())
      .mutation(({ input }) =>
        new ToolsController().getArticleContentHandler(input),
      ),
  }),
});

export default toolsRouter;
