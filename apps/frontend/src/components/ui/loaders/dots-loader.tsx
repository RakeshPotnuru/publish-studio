import { Icons } from "@/assets/icons";

import { Center } from "../center";

export function DotsLoader() {
  return (
    <Center>
      <Icons.Dot className="size-4 animate-bounce" />
      <Icons.Dot className="size-4 animate-bounce delay-100" />
      <Icons.Dot className="size-4 animate-bounce delay-200" />
    </Center>
  );
}
