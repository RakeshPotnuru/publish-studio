import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

import type { AppRouter } from "../";
import { user } from "../utils/constants";

jest.setTimeout(120_000);

const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: process.env.BASE_URL,
        }),
    ],
});

test("register a test account", async () => {
    const data = await trpc.register.mutate({
        email: "test@test.org",
        first_name: "test",
        last_name: "dev",
        password: "PassWord1234",
        user_type: user.userTypes.FREE,
    });

    expect(data.data).not.toEqual({});
});
