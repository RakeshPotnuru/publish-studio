import type { AuthMode, UserType } from "../../config/constants";

export interface ILoginInput {
    email: string;
    password: string;
}

export interface IRegisterInput {
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    profile_pic?: string;
    user_type: UserType;
    auth_modes?: AuthMode[];
    google_sub?: string;
    is_verified?: boolean;
}

export interface IResetPasswordInput {
    token: string;
    password: string;
}
