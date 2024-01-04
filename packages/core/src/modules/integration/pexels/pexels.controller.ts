import PexelsService from "./pexels.service";

export default class PexelsController extends PexelsService {
    async searchPhotosHandler(input: { query: string; per_page: number; page: number }) {
        const photos = await super.searchPhotos(input);

        return {
            status: "success",
            data: {
                photos,
            },
        };
    }
}
