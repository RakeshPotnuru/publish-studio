import type { SendEmailCommandInput } from "@aws-sdk/client-sesv2";
import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";

import type { emailTemplates } from "../../constants";
import type { ISES } from "../../types/aws.types";

const ses = new SESv2Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
} as ISES);

export default ses;

export const sendEmail = async (
    emails: string[],
    template: (typeof emailTemplates)[keyof typeof emailTemplates],
    variables: Record<string, string>,
    from_address: string,
) => {
    const input: SendEmailCommandInput = {
        Content: {
            Template: {
                TemplateName: template,
                TemplateData: JSON.stringify(variables),
            },
        },
        Destination: {
            ToAddresses: emails,
        },
        FromEmailAddress: from_address,
    };

    const command = new SendEmailCommand(input);
    await ses.send(command);
};
