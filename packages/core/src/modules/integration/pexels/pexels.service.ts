import { TRPCError } from "@trpc/server";
import { createClient } from "pexels";

import defaultConfig from "../../../config/app.config";

export default class PexelsService {
    private pexels() {
        return createClient(process.env.PEXELS_API_KEY);
    }

    async searchPhotos(input: { query: string; per_page: number; page: number }) {
        try {
            return await this.pexels().photos.search({
                query: input.query,
                per_page: input.per_page,
                page: input.page,
            });
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }
}
