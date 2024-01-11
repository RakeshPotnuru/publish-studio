import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Icons } from "@/assets/icons";
import { constants } from "@/config/constants";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";
import { Center } from "../ui/center";
import { ErrorBox } from "../ui/error-box";
import { Heading } from "../ui/heading";
import { ButtonLoader } from "../ui/loaders/button-loader";

interface UpgradeProps extends React.HTMLAttributes<HTMLDialogElement> {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    featureText?: string;
}

export function Upgrade({ children, featureText, ...props }: Readonly<UpgradeProps>) {
    const {
        refetch: goToCheckout,
        error,
        isFetching,
    } = trpc.createCheckoutSession.useQuery(undefined, {
        enabled: false,
    });

    const router = useRouter();

    const handleUpgrade = async () => {
        try {
            const { data } = await goToCheckout();

            if (data?.data.url) {
                router.push(data?.data.url);
            }
        } catch (error) {}
    };

    return (
        <Dialog {...props}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upgrade to Pro</DialogTitle>
                    <DialogDescription>
                        Upgrade to Pro to{" "}
                        {featureText ??
                            `unlock all the
                        features of ${siteConfig.title}`}
                        .
                    </DialogDescription>
                </DialogHeader>
                <div
                    className={cn("space-y-2", {
                        "animate-shake": error,
                    })}
                >
                    {error && (
                        <Center>
                            <ErrorBox
                                title="Could not create project"
                                description={error.message}
                            />
                        </Center>
                    )}
                    <div className="flex flex-row justify-between">
                        <Card>
                            <CardHeader>
                                <CardTitle>Free</CardTitle>
                                <CardDescription>Suitable for individuals</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Heading className="text-center">
                                    {constants.payment.currency.SYMBOL}0{" "}
                                    <span className="text-sm">/ month</span>
                                </Heading>
                                <ul className="list-inside list-disc space-y-2">
                                    <li>Feature 1</li>
                                    <li>Feature 2</li>
                                    <li>...</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button variant="secondary" className="w-full" disabled>
                                    Current Plan
                                </Button>
                            </CardFooter>
                        </Card>
                        <div className="from-primary rounded-xl bg-gradient-to-tr via-purple-500 to-blue-500 p-[1px]">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pro</CardTitle>
                                    <CardDescription>Ideal for power users</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Heading className="text-center">
                                        {constants.payment.currency.SYMBOL}
                                        {constants.payment.plans.proMonthly.PRICE_IN_DOLLARS}{" "}
                                        <span className="text-sm">/ month</span>
                                    </Heading>
                                    <ul className="list-inside list-disc space-y-2">
                                        <li>Everything in free +</li>
                                        <li>...</li>
                                        <li className="opacity-0"></li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        onClick={handleUpgrade}
                                        className="w-full"
                                        disabled={isFetching}
                                    >
                                        <ButtonLoader isLoading={isFetching}>Upgrade</ButtonLoader>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
                <Button variant="link" asChild>
                    <Link href={siteConfig.links.pricing}>
                        Full comparison <Icons.ExternalLink className="ml-2 size-4" />
                    </Link>
                </Button>
            </DialogContent>
        </Dialog>
    );
}
