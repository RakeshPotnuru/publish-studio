import axios from "axios";
import { load } from "cheerio";

import type { IMetadata } from "./tools.types";

export default class ToolsService {
  async getMetadata(url: string): Promise<IMetadata | null> {
    try {
      const response = await axios.get(url);
      const html = response.data as string;
      const $ = load(html);

      const title = $("head title").text().trim();
      const description = $('meta[name="description"]').attr("content") ?? "";

      let image = $('meta[property="og:image"]').attr("content") ?? "";
      if (image && !image.startsWith("http")) {
        image = new URL(image, url).href;
      }

      let favicon =
        $('link[rel="icon"]').attr("href") ??
        $('link[type="image/x-icon"]').attr("href") ??
        $('meta[itemprop="image"]').attr("content") ??
        "";
      if (favicon && !favicon.startsWith("http")) {
        favicon = new URL(favicon, url).href;
      }

      const metadata: IMetadata = {
        title,
        description,
        image,
        favicon,
      };

      return metadata;
    } catch {
      return null;
    }
  }

  async getArticleContent(url: string): Promise<string | null> {
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = load(html as string);

      return $("article").html() ?? $("main").html() ?? $("body").html();
    } catch {
      return null;
    }
  }
}
