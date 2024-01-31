import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import ProjectService from "../project/project.service";
import Post from "./post.model";
import type { IPost, TPostCreateInput } from "./post.types";

export default class PostService extends ProjectService {
    async createPost(post: TPostCreateInput): Promise<boolean> {
        try {
            await Post.create(post);

            return true;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Error creating post. Please try again later.",
            });
        }
    }

    async updatePost(_id: Types.ObjectId, post: Partial<TPostCreateInput>): Promise<boolean> {
        try {
            await Post.findByIdAndUpdate(_id, post);

            return true;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Error updating post. Please try again later.",
            });
        }
    }

    async getPost(_id: Types.ObjectId): Promise<IPost | null> {
        try {
            return await Post.findById(_id);
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Error getting post. Please try again later.",
            });
        }
    }

    async getPostsByProjectId(
        project_id: Types.ObjectId,
        user_id: Types.ObjectId,
    ): Promise<IPost[] | []> {
        try {
            return await Post.find({ project_id, user_id });
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Error getting posts. Please try again later.",
            });
        }
    }

    async getPostByProjectIdAndPlatform(
        project_id: Types.ObjectId,
        platform: string,
    ): Promise<IPost | null> {
        try {
            return await Post.findOne({ project_id, platform });
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Error getting post. Please try again later.",
            });
        }
    }

    async deletePostsByProjectId(project_id: Types.ObjectId): Promise<boolean> {
        try {
            await Post.deleteMany({ project_id });

            return true;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Error deleting posts. Please try again later.",
            });
        }
    }
}
