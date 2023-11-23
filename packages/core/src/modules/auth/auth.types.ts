import type { constants } from "../../constants";

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
    user_type: (typeof constants.user.userTypes)[keyof typeof constants.user.userTypes];
    auth_modes?: (typeof constants.user.authModes)[keyof typeof constants.user.authModes][];
    google_sub?: string;
}

export interface IResetPasswordInput {
    token: string;
    password: string;
}
