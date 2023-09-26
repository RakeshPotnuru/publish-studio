import type { Metadata } from "next";

import { RegisterForm } from "@/components/modules/auth/register-form";
import { AuthShell } from "@/components/ui/shell";

export const metadata: Metadata = {
    title: "Register",
};

export default function RegisterPage() {
    return (
        <AuthShell>
            <RegisterForm />
        </AuthShell>
    );
}
