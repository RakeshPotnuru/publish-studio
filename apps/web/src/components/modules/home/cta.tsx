import { Footer } from "@/components/common/layout/footer";

export function Cta() {
  return (
    <div
      id="cta"
      className="relative flex h-[5rem] w-full flex-col items-center justify-center rounded-md bg-neutral-950 antialiased sm:h-[10rem]"
    >
      <Footer className="relative z-10" />
    </div>
  );
}
