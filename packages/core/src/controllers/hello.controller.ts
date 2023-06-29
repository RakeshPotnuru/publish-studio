import { z } from "zod";

import HelloService from "../services/hello.service";
import { publicProcedure } from "../trpc";

export default class HelloController extends HelloService {
    get() {
        return publicProcedure
            .input(
                z.object({
                    client_name: z.string(),
                }),
            )
            .query(client => {
                return super.helloMsg(client.input.client_name);
            });
    }
}
