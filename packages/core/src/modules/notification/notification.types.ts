export interface INotification {
    id: string;
    user_id: string;
    message: string;
    type: string;
    status: "sent" | "read";
    created_at: Date;
    updated_at: Date;
    expires_at: Date;
}
