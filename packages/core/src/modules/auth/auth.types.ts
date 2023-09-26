import type { user } from "../../constants";

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
    user_type: (typeof user.userTypes)[keyof typeof user.userTypes];
    auth_modes?: (typeof user.authModes)[keyof typeof user.authModes][];
    google_sub?: string;
}

export interface IResetPasswordInput {
    token: string;
    password: string;
}
