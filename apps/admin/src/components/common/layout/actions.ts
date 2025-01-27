"use server";

import { cookies } from "next/headers";

// eslint-disable-next-line @typescript-eslint/require-await
export async function logout() {
  cookies().delete("access_token");
  cookies().delete("refresh_token");
  cookies().delete("logged_in");
}
