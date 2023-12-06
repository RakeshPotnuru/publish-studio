import { CookiesProvider } from "./cookies";
import { ThemeProvider } from "./theme";
import { TRPCProvider } from "./trpc";

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <CookiesProvider>
                <TRPCProvider>{children}</TRPCProvider>
            </CookiesProvider>
        </ThemeProvider>
    );
}
