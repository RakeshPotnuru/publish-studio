import { GoDotFill } from "react-icons/go";

interface FullScreenLoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function FullScreenLoader({}: FullScreenLoaderProps) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <GoDotFill className="h-4 w-4 animate-bounce" />
            <GoDotFill className="h-4 w-4 animate-bounce delay-100" />
            <GoDotFill className="h-4 w-4 animate-bounce delay-200" />
        </div>
    );
}
