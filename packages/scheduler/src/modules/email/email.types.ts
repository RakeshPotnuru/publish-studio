export interface IEmail {
    template: string;
    to: string;
    from: string;
    subject: string;
    scheduled_at: Date;
}
