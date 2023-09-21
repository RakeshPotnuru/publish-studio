import type { Metadata } from "next";

import { LoginForm } from "@/components/modules/auth/login-form";

export const metadata: Metadata = {
    title: "Login",
};

export default function LoginPage() {
    return (
        <div className="container flex flex-col items-center justify-center pb-8 pt-28">
            <LoginForm />
        </div>
    );
}
