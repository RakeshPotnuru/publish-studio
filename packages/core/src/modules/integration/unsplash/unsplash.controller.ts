import UnsplashService from "./unsplash.service";

export default class UnsplashController extends UnsplashService {
  async searchPhotosHandler(input: {
    query: string;
    per_page: number;
    page: number;
  }) {
    const photos = await super.searchPhotos(input);

    return {
      status: "success",
      data: {
        photos,
      },
    };
  }
}
