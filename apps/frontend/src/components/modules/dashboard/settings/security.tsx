"use client";

import { Button, toast } from "@itsrakesh/ui";

import { logout } from "@/components/common/layout/navbar/actions";
import { Heading } from "@/components/ui/heading";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

import Header from "./common/header";

export function Security() {
  const { mutateAsync: logoutAll, isLoading } = trpc.auth.logout.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleLogout = async () => {
    try {
      await logoutAll();
      await logout();

      window.google?.accounts.id.disableAutoSelect();
      window.location.href = siteConfig.pages.login.link;
    } catch {
      // Ignore
    }
  };

  return (
    <Header
      title={siteConfig.pages.settings.security.title}
      description={siteConfig.pages.settings.security.description}
    >
      <div className="space-y-4">
        <div className="flex justify-between">
          <Heading level={2}>Logout from all sessions</Heading>
          <Button onClick={handleLogout} variant="destructive">
            <ButtonLoader isLoading={isLoading}>Logout</ButtonLoader>
          </Button>
        </div>
      </div>
    </Header>
  );
}
