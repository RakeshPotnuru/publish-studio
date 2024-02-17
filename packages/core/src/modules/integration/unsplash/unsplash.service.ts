import { createApi } from "unsplash-js";

export default class UnsplashService {
  private unsplash() {
    return createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
    });
  }

  async searchPhotos(input: { query: string; per_page: number; page: number }) {
    try {
      return await this.unsplash().search.getPhotos({
        query: input.query,
        perPage: input.per_page,
        page: input.page,
      });
    } catch (error) {
      console.log(error);

      throw new Error("Internal Server Error");
    }
  }
}
