import { ThemeProvider } from "./theme";
import { TRPCProvider } from "./trpc";

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <TRPCProvider>{children}</TRPCProvider>
    </ThemeProvider>
  );
}