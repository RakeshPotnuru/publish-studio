import { Icons } from "@/assets/icons";

export function FullScreenLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Icons.Dot className="size-4 animate-bounce" />
      <Icons.Dot className="size-4 animate-bounce delay-100" />
      <Icons.Dot className="size-4 animate-bounce delay-200" />
    </div>
  );
}
