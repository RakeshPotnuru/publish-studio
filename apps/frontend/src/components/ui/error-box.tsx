import { Alert, AlertDescription, AlertTitle } from "@itsrakesh/ui";

import { Icons } from "../../assets/icons";

interface ErrorBoxProps {
    title: string;
    description: string;
}

export function ErrorBox({ title, description }: Readonly<ErrorBoxProps>) {
    return (
        <Alert variant="destructive" className="w-max bg-red-200 dark:bg-red-950">
            <Icons.Error className="size-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    );
}
