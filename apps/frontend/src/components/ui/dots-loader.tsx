import { Icons } from "@/assets/icons";

export function DotsLoader() {
    return (
        <div className="flex items-center justify-center">
            <Icons.LoadingDot className="h-4 w-4 animate-bounce" />
            <Icons.LoadingDot className="h-4 w-4 animate-bounce delay-100" />
            <Icons.LoadingDot className="h-4 w-4 animate-bounce delay-200" />
        </div>
    );
}
