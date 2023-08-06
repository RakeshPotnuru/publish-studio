import axios from "axios";
import type { Types } from "mongoose";

import defaultConfig from "../../../config/app.config";
import { decryptField } from "../../../utils/aws/kms";
import Hashnode from "./hashnode.model";
import type {
    IHashnode,
    IHashnodeCreatePostOutput,
    IHashnodeCreateStoryInput,
    IHashnodeUserOutput,
} from "./hashnode.types";

export default class HashnodeService {
    /**
     * The function `createUser` creates a new user in the Hashnode collection and returns the created
     * user.
     * @param {IHashnode} user - The parameter `user` is of type `IHashnode`, which is an interface
     * representing the structure of a user object in Hashnode.
     * @returns a promise that resolves to an object of type IHashnode.
     */
    async createUser(user: IHashnode) {
        return (await Hashnode.create(user)) as IHashnode;
    }

    /**
     * The function updates a user in the Hashnode collection and returns the updated user.
     * @param {IHashnode} user - The `user` parameter is an object of type `IHashnode` which represents
     * a user in the Hashnode system.
     * @returns a Promise that resolves to an updated user object of type IHashnode.
     */
    async updateUser(user: IHashnode, user_id: Types.ObjectId | undefined) {
        return (await Hashnode.findByIdAndUpdate(user_id, user, {
            new: true,
        }).exec()) as IHashnode;
    }

    /**
     * The function deletes a user from the Hashnode database using their user ID.
     * @param user_id - The user_id parameter is of type Types.ObjectId, which is a unique
     * identifier for a user in the database.
     * @returns the deleted user object as an instance of the IHashnode interface.
     */
    async deleteUser(user_id: Types.ObjectId | undefined) {
        return (await Hashnode.findByIdAndDelete(user_id).exec()) as IHashnode;
    }

    /**
     * The function retrieves a Hashnode user from the Hashnode collection by their ID.
     * @param user_id - The user_id parameter is of type Types.ObjectId, which is likely a unique
     * identifier for a user in the database.
     * @returns a Promise that resolves to an object of type IHashnode.
     */
    async getUserById(user_id: Types.ObjectId | undefined) {
        return (await Hashnode.findById(user_id).exec()) as IHashnode;
    }

    /**
     * The function `getUserDetails` makes an API call to retrieve details about a user from the
     * Hashnode API using the provided username.
     * @param {string} username - The `username` parameter is a string that represents the username of
     * the user whose details you want to retrieve.
     * @returns a response object of type `IHashnodeUserOutput`.
     */
    async getUserDetails(username: string) {
        const response = await axios.post(
            defaultConfig.hashnode_api_url,
            {
                query: `query user($username: String!) {
                user(username: $username) {
                    photo
                    blogHandle
                    publication {
                        _id
                        favicon
                    }
                }
            }`,
                variables: {
                    username,
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        return response.data.data.user as unknown as IHashnodeUserOutput;
    }

    /**
     * The function `publishPost` is an asynchronous function that takes in a post object and a user
     * object as parameters, and it sends a POST request to the Hashnode API to create a new
     * story/post.
     * @param {IHashnodeCreateStoryInput} post - The `post` parameter is an object of type
     * `IHashnodeCreateStoryInput` which contains the data for creating a new post on Hashnode. It
     * includes properties such as `title`, `contentMarkdown`, `tags`, `slug`, `coverImage`, `brief`,
     * and `blogHandle`.
     * @param {IHashnode} user - The `user` parameter is an object of type `IHashnode` which contains
     * the user's information. It includes properties such as `api_key`, which is the user's API key
     * for authentication purposes.
     * @returns a response object of type `IHashnodeCreatePostOutput`.
     */
    async publishPost(post: IHashnodeCreateStoryInput, user: IHashnode) {
        const decryptedApiKey = await decryptField(user.api_key);

        const response = await axios.post(
            defaultConfig.hashnode_api_url,
            {
                query: `mutation createStory($input: CreateStoryInput!) {
                createStory(input: $input) {
                    code
                    success
                    message
                    post {
                        title
                        contentMarkdown
                        tags {
                            name
                        }
                        slug
                        coverImage
                        brief
                        blogHandle
                    }
                }
            }`,
                variables: {
                    input: {
                        title: post.title,
                        contentMarkdown: post.contentMarkdown,
                        tags: post.tags,
                        coverImageURL: post.coverImageURL,
                        isRepublished: post.isRepublished?.originalArticleURL,
                        isPartOfPublication: user.publication.publication_id,
                    },
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: decryptedApiKey,
                },
            },
        );

        return response as unknown as IHashnodeCreatePostOutput;
    }
}
