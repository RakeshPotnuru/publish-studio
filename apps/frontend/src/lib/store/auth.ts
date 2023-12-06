import { createContext } from "react";
import { createStore } from "zustand";

interface AuthProps {
    isAuthenticated: boolean;
}

interface AuthState extends AuthProps {
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

type AuthStore = ReturnType<typeof createAuthStore>;

const createAuthStore = (initProps?: Partial<AuthProps>) => {
    const DEFAULT_PROPS: AuthProps = {
        isAuthenticated: false,
    };

    return createStore<AuthState>()(set => ({
        ...DEFAULT_PROPS,
        ...initProps,
        setIsAuthenticated: isAuthenticated => set({ isAuthenticated }),
    }));
};

export const AuthContext = createContext<AuthStore | null>(null);
