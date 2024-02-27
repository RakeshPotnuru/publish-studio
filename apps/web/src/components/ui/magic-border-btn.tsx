import { forwardRef } from "react";

import { Button } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";

interface MagicBorderBtnProps extends React.ComponentProps<typeof Button> {}

const MagicBorderBtn = forwardRef<HTMLButtonElement, MagicBorderBtnProps>(
  ({ className, children, onClick, ...props }, ref) => {
    return (
      <Button
        onClick={onClick}
        ref={ref}
        className={cn(
          className,
          "relative h-min inline-flex overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        )}
        {...props}
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
          {children}
        </span>
      </Button>
    );
  }
);
MagicBorderBtn.displayName = "MagicBorderBtn";

export { MagicBorderBtn };
