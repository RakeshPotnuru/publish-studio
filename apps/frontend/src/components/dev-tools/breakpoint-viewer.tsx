export function BreakpointViewer() {
  return (
    <div
      title="Current breakpoint"
      className="fixed bottom-3 right-28 z-50 rounded-full bg-primary p-1.5 px-2 text-primary-foreground"
    >
      <span className="inline-block sm:hidden">XS</span>
      <span className="hidden sm:inline-block md:hidden">SM</span>
      <span className="hidden md:inline-block lg:hidden">MD</span>
      <span className="hidden lg:inline-block xl:hidden">LG</span>
      <span className="hidden xl:inline-block">XL</span>
      <span className="hidden 2xl:inline-block">2XL</span>
    </div>
  );
}
