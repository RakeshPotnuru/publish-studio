import type { emailTemplates } from "../../constants";

export interface IEmail {
    emails: string[];
    template: (typeof emailTemplates)[keyof typeof emailTemplates];
    variables: Record<string, string>;
    from_address: string;
    scheduled_at: Date;
}
