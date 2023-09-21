import type { Metadata } from "next";

import { RegisterForm } from "@/components/modules/auth/register-form";

export const metadata: Metadata = {
    title: "Register",
};

export default function RegisterPage() {
    return (
        <div className="container flex flex-col items-center justify-center pb-8 pt-28">
            <RegisterForm />
        </div>
    );
}
