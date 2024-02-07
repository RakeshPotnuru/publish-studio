import { MobileNotice } from "@/components/ui/mobile-notice";

import { ThemeProvider } from "./theme";
import { TRPCProvider } from "./trpc";

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MobileNotice>
        <TRPCProvider>{children}</TRPCProvider>
      </MobileNotice>
    </ThemeProvider>
  );
}
