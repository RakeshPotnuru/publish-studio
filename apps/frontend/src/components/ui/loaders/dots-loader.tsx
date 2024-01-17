import { Icons } from "@/assets/icons";
import { Center } from "../center";

export function DotsLoader() {
    return (
        <Center>
            <Icons.LoadingDot className="size-4 animate-bounce" />
            <Icons.LoadingDot className="size-4 animate-bounce delay-100" />
            <Icons.LoadingDot className="size-4 animate-bounce delay-200" />
        </Center>
    );
}
