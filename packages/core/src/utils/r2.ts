import { S3Client } from "@aws-sdk/client-s3";

import defaultConfig from "../config/app";

const r2 = new S3Client({
  region: process.env.R2_REGION,
  endpoint: defaultConfig.r2Endpoint,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export default r2;
