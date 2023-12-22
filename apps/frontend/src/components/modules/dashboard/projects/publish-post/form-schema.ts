import { constants } from "@/config/constants";
import { z } from "zod";

export const formSchema = z.object({
    title: z
        .string()
        .min(1, "Please enter a title for your post.")
        .min(
            constants.project.title.MIN_LENGTH,
            `Title must contain at least ${constants.project.title.MIN_LENGTH} characters.`,
        )
        .max(
            constants.project.title.MAX_LENGTH,
            `Title must not exceed ${constants.project.title.MAX_LENGTH} characters.`,
        ),
    description: z
        .string()
        .min(1, "Please enter a description for your post.")
        .max(
            constants.project.description.MAX_LENGTH,
            `Description must not exceed ${constants.project.description.MAX_LENGTH} characters.`,
        ),
    platforms: z
        .array(z.nativeEnum(constants.user.platforms))
        .refine(value => value.some(item => item), {
            message: "Please select at least one platform to publish to.",
        }),
    tags: z.object({
        // hashnode_tags: z
        //     .string()
        //     .refine(
        //         value =>
        //             (value ?? "").split(",").length <= constants.project.tags.hashnode.MAX_LENGTH,
        //         {
        //             message: `Maximum ${constants.project.tags.hashnode.MAX_LENGTH} tags allowed.`,
        //         },
        //     )
        //     .optional(),
        devto_tags: z
            .string()
            .refine(
                value => (value ?? "").split(",").length <= constants.project.tags.dev.MAX_LENGTH,
                {
                    message: `Maximum ${constants.project.tags.dev.MAX_LENGTH} tags allowed.`,
                },
            )
            .optional(),
        medium_tags: z
            .string()
            .refine(
                value =>
                    (value ?? "").split(",").length <= constants.project.tags.medium.MAX_LENGTH,
                {
                    message: `Maximum ${constants.project.tags.medium.MAX_LENGTH} tags allowed.`,
                },
            )
            .optional(),
        ghost_tags: z
            .string()
            .refine(
                value => (value ?? "").split(",").length <= constants.project.tags.ghost.MAX_LENGTH,
                {
                    message: `Maximum ${constants.project.tags.ghost.MAX_LENGTH} tags allowed.`,
                },
            )
            .optional(),
    }),
    canonical_url: z.string().optional(),
});
// .refine(data => !data.platforms.includes(constants.user.platforms.HASHNODE), {
//     message: "Please select atleast one tag",
//     path: ["tags.hashnode_tags"],
// });
