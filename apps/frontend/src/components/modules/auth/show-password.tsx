import { Checkbox, Label } from "@itsrakesh/ui";

interface ShowPasswordProps extends React.HTMLAttributes<HTMLDivElement> {
  passwordVisible: boolean;
  setPasswordVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ShowPassword({
  passwordVisible,
  setPasswordVisible,
}: Readonly<ShowPasswordProps>) {
  const handleShowPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="show-password"
        onCheckedChange={handleShowPassword}
        aria-label="toggle password visibility"
      />
      <Label htmlFor="show-password">Show password</Label>
    </div>
  );
}
