import "dotenv/config";

import "./config/index";

import { postJobsReceiver } from "./modules/post/post.receiver";

await postJobsReceiver();
