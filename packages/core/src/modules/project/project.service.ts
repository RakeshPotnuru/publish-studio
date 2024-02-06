import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import type { IPaginationOptions } from "../../types/common.types";
import { logtail } from "../../utils/logtail";
import Folder from "../folder/folder.model";
import FolderService from "../folder/folder.service";
import Post from "../post/post.model";
import Project from "./project.model";
import type {
    IProject,
    IProjectsResponse,
    IProjectUpdateInput,
    TProjectCreateInput,
} from "./project.types";

export default class ProjectService extends FolderService {
    async createProject(project: TProjectCreateInput): Promise<IProject> {
        try {
            const newProject = await Project.create(project);

            if (project.folder_id) {
                await Folder.findByIdAndUpdate(project.folder_id, {
                    $push: { projects: newProject._id },
                }).exec();
            }

            return newProject;
        } catch (error) {
            await logtail.error(JSON.stringify(error), {
                user_id: project.user_id,
            });

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while creating the project. Please try again later.",
            });
        }
    }

    async getProjectById(id: Types.ObjectId, user_id: Types.ObjectId): Promise<IProject | null> {
        try {
            return await Project.findOne({ _id: id, user_id }).exec();
        } catch (error) {
            await logtail.error(JSON.stringify(error), {
                user_id,
            });

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the project. Please try again later.",
            });
        }
    }

    async getAllProjectsByUserId(
        pagination: IPaginationOptions,
        user_id: Types.ObjectId,
    ): Promise<IProjectsResponse> {
        try {
            const total_rows = await Project.countDocuments({ user_id }).exec();
            const total_pages = Math.ceil(total_rows / pagination.limit);

            const projects = (await Project.find({ user_id })
                .skip((pagination.page - 1) * pagination.limit)
                .limit(pagination.limit)
                .sort({ updated_at: -1 })
                .exec()) as IProject[];

            return {
                projects,
                pagination: {
                    page: pagination.page,
                    limit: pagination.limit,
                    total_rows,
                    total_pages,
                },
            };
        } catch (error) {
            await logtail.error(JSON.stringify(error), {
                user_id,
            });

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the projects. Please try again later.",
            });
        }
    }

    async getProjectsByFolderId(
        pagination: {
            page: number;
            limit: number;
        },
        folder_id: Types.ObjectId,
        user_id: Types.ObjectId,
    ) {
        try {
            const total_rows = await Project.countDocuments({ folder_id, user_id }).exec();
            const total_pages = Math.ceil(total_rows / pagination.limit);

            const projects = (await Project.find({ folder_id, user_id })
                .skip((pagination.page - 1) * pagination.limit)
                .limit(pagination.limit)
                .sort({ updated_at: -1 })
                .exec()) as IProject[];

            return {
                projects,
                pagination: {
                    page: pagination.page,
                    limit: pagination.limit,
                    total_rows,
                    total_pages,
                },
            } as IProjectsResponse;
        } catch (error) {
            await logtail.error(JSON.stringify(error), {
                user_id,
            });

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the projects. Please try again later.",
            });
        }
    }

    async updateProjectById(
        id: Types.ObjectId,
        project: IProjectUpdateInput,
        user_id: Types.ObjectId,
    ) {
        try {
            return (await Project.findOneAndUpdate(
                { _id: id, user_id },
                {
                    $set: {
                        name: project.name,
                        title: project.title,
                        description: project.description,
                        folder_id: project.folder_id,
                        platforms: project.platforms,
                        tags: project.tags,
                        cover_image: project.cover_image,
                        canonical_url: project.canonical_url,
                        scheduled_at: project.scheduled_at,
                        status: project.status,
                        tone_analysis: project.tone_analysis,
                        categories: project.categories,
                        "body.json": project.body?.json,
                        "body.html": project.body?.html,
                        "body.markdown": project.body?.markdown,
                    },
                },
                {
                    new: true,
                },
            ).exec()) as IProject;
        } catch (error) {
            await logtail.error(JSON.stringify(error), {
                user_id,
            });

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while updating the project. Please try again later.",
            });
        }
    }

    async deleteProjects(ids: Types.ObjectId[], user_id: Types.ObjectId) {
        try {
            for (const id of ids) {
                await Post.deleteMany({ project_id: id });
            }

            return await Project.deleteMany({ user_id, _id: { $in: ids } }).exec();
        } catch (error) {
            await logtail.error(JSON.stringify(error), {
                user_id,
            });

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while deleting the project. Please try again later.",
            });
        }
    }
}
