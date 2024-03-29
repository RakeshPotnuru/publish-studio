import ToolsService from "./tools.service";

export default class ToolsController extends ToolsService {
  async getMetadataHandler(input: string) {
    const metadata = await super.getMetadata(input);

    return {
      status: "success",
      data: metadata,
    };
  }

  async getArticleContentHandler(input: string) {
    const article = await super.getArticleContent(input);

    return {
      status: "success",
      data: { article },
    };
  }
}
