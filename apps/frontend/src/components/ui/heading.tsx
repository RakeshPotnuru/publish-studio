import { cn } from "@itsrakesh/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({
  level = 1,
  children,
  className,
  ...props
}: Readonly<HeadingProps>) {
  switch (level) {
    case 1: {
      return (
        <h1 className={cn("text-3xl font-semibold", className)} {...props}>
          {children}
        </h1>
      );
    }
    case 2: {
      return (
        <h2 className={cn("text-2xl font-semibold", className)} {...props}>
          {children}
        </h2>
      );
    }
    case 3: {
      return (
        <h3 className={cn("text-xl font-semibold", className)} {...props}>
          {children}
        </h3>
      );
    }
    case 4: {
      return (
        <h4 className={cn("text-lg font-semibold", className)} {...props}>
          {children}
        </h4>
      );
    }
    case 5: {
      return (
        <h5 className={cn("text-base font-semibold", className)} {...props}>
          {children}
        </h5>
      );
    }
    case 6: {
      return (
        <h6 className={cn("text-sm font-semibold", className)} {...props}>
          {children}
        </h6>
      );
    }
    default:
  }
}
