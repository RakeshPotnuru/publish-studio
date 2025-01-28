import { forwardRef } from "react";

import { Button } from "@itsrakesh/ui";

import useUserStore from "@/lib/stores/user";

import { ButtonLoader } from "./loaders/button-loader";

interface ProButtonProps extends React.ComponentProps<typeof Button> {
  featuretext?: string;
}

/**
 * A custom button component for Pro users.
 *
 * @param className - Additional CSS class names for the button.
 * @param children - The content of the button.
 * @param onClick - The click event handler for the button.
 * @param featuretext - The text to display when the button is clicked by non-Pro users.
 * @param ref - The ref to attach to the button element.
 * @param props - Additional props to pass to the button component.
 * @returns The rendered ProButton component.
 */
const ProButton = forwardRef<HTMLButtonElement, ProButtonProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const { isLoading } = useUserStore();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // NOSONAR
      // if (user?.user_type === UserType.PRO) {
      //   onClick?.(event);
      // } else {
      //   setOpen((prev) => !prev);
      // }
      onClick?.(event);
    };

    return (
      <Button
        onClick={handleClick}
        ref={ref}
        className={className}
        disabled={isLoading}
        {...props}
      >
        <ButtonLoader isLoading={isLoading}>{children}</ButtonLoader>
      </Button>
    );
  },
);
ProButton.displayName = "ProButton";

export { ProButton };
