import { z } from "zod";

import AuthService from "../services/auth.service";
import { publicProcedure } from "../trpc";

export default class AuthController extends AuthService {
    registerUser() {
        return publicProcedure
            .input(
                z.object({
                    first_name: z.string().min(3).max(25),
                    last_name: z.string().min(3).max(25),
                    email: z.string().email(),
                    password: z.string().min(8),
                }),
            )
            .query(user => {
                return super.register(
                    user.input.first_name,
                    user.input.last_name,
                    user.input.email,
                    user.input.password,
                );
            });
    }
    loginUser() {
        return publicProcedure
            .input(
                z.object({
                    email: z.string().email(),
                    password: z.string().min(8),
                }),
            )
            .query(user => {
                return super.login(user.input.email, user.input.password);
            });
    }
}
