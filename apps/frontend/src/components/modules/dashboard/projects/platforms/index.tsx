import { Images } from "@/components/ui/images";
import { constants } from "@/config/constants";
import { UseFormReturn } from "react-hook-form";
import { Dev } from "./dev";
import { Hashnode } from "./hashnode";
import { Medium } from "./medium";
import { z } from "zod";
import { schema } from "../publish-post";

interface IPlatformConfig {
    label: string;
    value: (typeof constants.user.platforms)[keyof typeof constants.user.platforms];
    logo: string;
    component: (form: UseFormReturn<z.infer<typeof schema>>) => JSX.Element;
}

export const platformConfig: IPlatformConfig[] = [
    {
        label: "Dev.to",
        value: constants.user.platforms.DEVTO,
        logo: Images.devLogo,
        component: (form: UseFormReturn<z.infer<typeof schema>>) => <Dev form={form} />,
    },
    {
        label: "Medium",
        value: constants.user.platforms.MEDIUM,
        logo: Images.mediumLogo,
        component: (form: UseFormReturn<z.infer<typeof schema>>) => <Medium form={form} />,
    },
    {
        label: "Hashnode",
        value: constants.user.platforms.HASHNODE,
        logo: Images.hashnodeLogo,
        component: (form: UseFormReturn<z.infer<typeof schema>>) => <Hashnode form={form} />,
    },
];
