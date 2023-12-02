import type { Metadata } from "next";

import { VerifyEmail } from "@/components/modules/auth/verify-email";

export const metadata: Metadata = {
    title: "Verify Email",
};

export default function VerifyEmailPage() {
    return <VerifyEmail />;
}
