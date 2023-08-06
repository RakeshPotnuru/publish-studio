import { TRPCError } from "@trpc/server";

import defaultConfig from "../../../config/app.config";
import type { Context } from "../../../trpc";
import HashnodeService from "./hashnode.service";
import type { IHashnode, IHashnodeCreateStoryInput } from "./hashnode.types";

export default class HashnodeController extends HashnodeService {
    /**
     * The function `getUserHandler` retrieves user details based on a given username and returns a
     * success response with the user data, or throws an error if the user is not found or an internal
     * server error occurs.
     * @param input - The `input` parameter is an object that contains a `username` property. This
     * function is an asynchronous function that retrieves user details based on the provided username.
     * @returns an object with a `status` property set to "success" and a `data` property containing
     * the `user` object.
     */
    async getUserHandler(input: { username: string }) {
        try {
            const user = await super.getUserDetails(input.username);

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found. Correct your username and try again.",
                });
            }

            return {
                status: "success",
                data: {
                    user: user,
                },
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    /**
     * The function `createUserHandler` creates a new user in the Hashnode collection using the provided
     * input and returns the created user's details.
     * @param input - The `input` parameter is an object that contains the following properties:
     * @param {Context} ctx - The `ctx` parameter is an object that represents the context of the
     * current request. It typically contains information such as the authenticated user, request
     * headers, cookies, and other contextual data that may be useful during request processing. In
     * this case, it is used to access the authenticated user's ID.
     * @returns an object with the properties "status" and "data". The "status" property is set to
     * "success" and the "data" property contains an object with the property "user" which holds the
     * value of the "newHashnodeUser" variable.
     */
    async createUserHandler(input: { username: string; api_key: string }, ctx: Context) {
        try {
            const { username, api_key } = input;

            const user = await super.getUserDetails(username);

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found. Correct your username and try again.",
                });
            }

            const newHashnodeUser = await super.createUser({
                user_id: ctx.user?._id,
                api_key: api_key,
                username,
                profile_pic: user.photo,
                blog_handle: user.blogHandle,
                publication: {
                    publication_id: user.publication._id,
                    publication_logo: user.publication.favicon,
                },
            });

            return {
                status: "success",
                data: {
                    user: newHashnodeUser,
                },
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    /**
     * The function `updateUserHandler` updates a user's information and returns the updated user
     * object.
     * @param input - The `input` parameter is an object that contains the `user` property. This
     * property represents the updated user data that will be passed to the `updateUser` function.
     * @param {Context} ctx - The `ctx` parameter is the context object that contains information about
     * the current request and user. It is typically used to access the authenticated user's
     * information, such as their ID (`ctx.user?._id` in this case).
     * @returns an object with the following properties:
     * - status: "success"
     * - data: an object with a property "user" which contains the updated user data.
     */
    async updateUserHandler(input: { user: IHashnode }, ctx: Context) {
        try {
            const updatedUser = await super.updateUser(input.user, ctx.user?._id);

            return {
                status: "success",
                data: {
                    user: updatedUser,
                },
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    /**
     * The deleteUserHandler function deletes a user and returns a success status along with the
     * deleted user data, or throws an error if there is an internal server error.
     * @param {Context} ctx - The `ctx` parameter is an object of type `Context`. It contains
     * information about the current request and user context.
     * @returns an object with a "status" property set to "success" and a "data" property containing
     * the deleted user.
     */
    async deleteUserHandler(ctx: Context) {
        try {
            const deletedUser = await super.deleteUser(ctx.user?._id);

            return {
                status: "success",
                data: {
                    user: deletedUser,
                },
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    /**
     * The `createPostHandler` function creates a new post using the provided input and the user's
     * information, and returns the created post if successful.
     * @param input - The `input` parameter is an object that contains the `post` property. The `post`
     * property is of type `IHashnodeCreateStoryInput`, which represents the data needed to create a
     * new post on Hashnode.
     * @param {Context} ctx - The `ctx` parameter is the context object that contains information about
     * the current request. It typically includes information such as the user making the request,
     * authentication details, and any other relevant data needed to process the request. In this case,
     * it seems to contain the user's ID.
     * @returns an object with the following properties:
     * - status: a string indicating the status of the operation ("success" in this case)
     * - data: an object containing the newly created post, accessed through the "post" property.
     */
    async createPostHandler(
        input: {
            post: IHashnodeCreateStoryInput;
        },
        ctx: Context,
    ) {
        try {
            const user = await super.getUserById(ctx.user?._id);

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found. Please connect your Hashnode account to continue.",
                });
            }

            const newPost = await super.publishPost(input.post, user);

            if (newPost.errors) {
                if (newPost.errors[0].extensions.code === "INTERNAL_SERVER_ERROR") {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Invalid fields",
                    });
                }

                if (newPost.errors[0].extensions.code === "UNAUTHENTICATED") {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: newPost.errors[0].message,
                    });
                }

                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: defaultConfig.defaultErrorMessage,
                });
            }

            return {
                status: "success",
                data: {
                    post: newPost.post,
                },
            };
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }
}
