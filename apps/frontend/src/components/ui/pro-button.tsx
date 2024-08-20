import { forwardRef, useState } from "react";

import { Button } from "@itsrakesh/ui";

import useUserStore from "@/lib/stores/user";

import { Upgrade } from "../modules/dashboard/pay/upgrade";
import { ButtonLoader } from "./loaders/button-loader";

interface ProButtonProps extends React.ComponentProps<typeof Button> {
  featureText?: string;
}

/**
 * A custom button component for Pro users.
 *
 * @param className - Additional CSS class names for the button.
 * @param children - The content of the button.
 * @param onClick - The click event handler for the button.
 * @param featureText - The text to display when the button is clicked by non-Pro users.
 * @param ref - The ref to attach to the button element.
 * @param props - Additional props to pass to the button component.
 * @returns The rendered ProButton component.
 */
const ProButton = forwardRef<HTMLButtonElement, ProButtonProps>(
  ({ className, children, onClick, featureText, ...props }, ref) => {
    const [open, setOpen] = useState(false);

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
      <>
        <Button
          onClick={handleClick}
          ref={ref}
          className={className}
          disabled={isLoading}
          {...props}
        >
          <ButtonLoader isLoading={isLoading}>{children}</ButtonLoader>
        </Button>
        <Upgrade open={open} onOpenChange={setOpen} featureText={featureText} />
      </>
    );
  },
);
ProButton.displayName = "ProButton";

export { ProButton };
