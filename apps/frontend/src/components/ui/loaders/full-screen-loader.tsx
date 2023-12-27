import { Icons } from "@/assets/icons";

export function FullScreenLoader() {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <Icons.LoadingDot className="size-4 animate-bounce" />
            <Icons.LoadingDot className="size-4 animate-bounce delay-100" />
            <Icons.LoadingDot className="size-4 animate-bounce delay-200" />
        </div>
    );
}
