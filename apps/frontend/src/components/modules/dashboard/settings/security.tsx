"use client";

import { Button, toast } from "@itsrakesh/ui";
import { deleteCookie } from "cookies-next";

import { Heading } from "@/components/ui/heading";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

export function Security() {
  const { mutateAsync: logout, isLoading } = trpc.auth.logout.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleLogout = async () => {
    try {
      await logout();

      deleteCookie("ps_access_token", { path: "/" });
      deleteCookie("ps_refresh_token", { path: "/" });

      window.google?.accounts.id.disableAutoSelect();
      window.location.href = siteConfig.pages.login.link;
    } catch {
      // Ignore
    }
  };

  return (
    <div>
      <div className="space-y-2">
        <Heading>Security</Heading>
        <p className="text-muted-foreground">
          Manage your account security settings
        </p>
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <Heading level={2}>Logout from all sessions</Heading>
          <Button onClick={handleLogout} variant="destructive">
            <ButtonLoader isLoading={isLoading}>Logout</ButtonLoader>
          </Button>
        </div>
      </div>
    </div>
  );
}
