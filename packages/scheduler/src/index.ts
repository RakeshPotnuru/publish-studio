import "dotenv/config";

import "./config/index";

import { emailJobsReceiver } from "./modules/email/email.receiver";
import { postJobsReceiver } from "./modules/post/post.receiver";

await postJobsReceiver();
await emailJobsReceiver();
