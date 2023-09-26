import type { Metadata } from "next";

import { LoginForm } from "@/components/modules/auth/login-form";
import { AuthShell } from "@/components/ui/shell";

export const metadata: Metadata = {
    title: "Login",
};

export default function LoginPage() {
    return (
        <AuthShell>
            <LoginForm />
        </AuthShell>
    );
}
