import { Icons } from "@/assets/icons";

import { Center } from "../center";

interface DotsLoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DotsLoader({ ...props }: DotsLoaderProps) {
  return (
    <Center {...props}>
      <Icons.Dot className="size-4 animate-bounce" />
      <Icons.Dot className="size-4 animate-bounce delay-100" />
      <Icons.Dot className="size-4 animate-bounce delay-200" />
    </Center>
  );
}
