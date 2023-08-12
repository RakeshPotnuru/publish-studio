import { SESv2Client } from "@aws-sdk/client-sesv2";

import type { ISES } from "../../types/aws.types";

const ses = new SESv2Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
} as ISES);

export default ses;
