export interface IUser {
    _id?: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    profile_pic?: string;
    user_type: "free" | "pro";
}
