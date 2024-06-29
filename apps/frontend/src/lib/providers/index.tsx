import { PHProvider } from "./posthog";
import { ThemeProvider } from "./theme";
import { TRPCProvider } from "./trpc";

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <PHProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TRPCProvider>{children}</TRPCProvider>
      </ThemeProvider>
    </PHProvider>
  );
}
