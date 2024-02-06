import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import { logtail } from "../../utils/logtail";
import type { IRegisterInput } from "../auth/auth.types";
import User from "./user.model";
import type { IUser, IUserUpdate } from "./user.types";

export default class UserService {
    async createUser(user: IRegisterInput): Promise<IUser> {
        try {
            return await User.create(user);
        } catch (error) {
            await logtail.error(JSON.stringify(error));

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while creating the user. Please try again later.",
            });
        }
    }

    async getUserByEmail(email: string): Promise<Omit<IUser, "google_sub"> | null> {
        try {
            return await User.findOne({ email }).select("-google_sub").exec();
        } catch (error) {
            await logtail.error(JSON.stringify(error));

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the user. Please try again later.",
            });
        }
    }

    async getUserById(id: Types.ObjectId): Promise<Omit<IUser, "password" | "google_sub"> | null> {
        try {
            return await User.findById(id).select("-password -google_sub").exec();
        } catch (error) {
            await logtail.error(JSON.stringify(error));

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while fetching the user. Please try again later.",
            });
        }
    }

    async updateUser(
        id: Types.ObjectId,
        user: IUserUpdate,
    ): Promise<Omit<IUser, "password" | "google_sub"> | null> {
        try {
            return await User.findByIdAndUpdate(id, user, { new: true })
                .select("-password -google_sub")
                .exec();
        } catch (error) {
            await logtail.error(JSON.stringify(error));

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while updating the user. Please try again later.",
            });
        }
    }
}
