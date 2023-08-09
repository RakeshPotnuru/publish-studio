import { S3 } from "@aws-sdk/client-s3";

import type { IS3 } from "../../types/aws.types";

const s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
} as IS3);

export default s3;
