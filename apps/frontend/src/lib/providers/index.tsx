import PaddleProvider from "./paddle";
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
        <TRPCProvider>
          <PaddleProvider>{children}</PaddleProvider>
        </TRPCProvider>
      </ThemeProvider>
    </PHProvider>
  );
}
