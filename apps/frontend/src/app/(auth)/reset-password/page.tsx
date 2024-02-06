import type { Metadata } from "next";

import { ResetPasswordForm } from "@/components/modules/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function ResetPage() {
  return <ResetPasswordForm />;
}
