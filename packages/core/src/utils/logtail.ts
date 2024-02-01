import { Logtail } from "@logtail/node";

export const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);
