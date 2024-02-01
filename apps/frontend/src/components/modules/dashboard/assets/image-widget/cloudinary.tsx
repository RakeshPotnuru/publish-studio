import { useLayoutEffect } from "react";
import Link from "next/link";

import { Button } from "@itsrakesh/ui";

import { Icons } from "@/assets/icons";
import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { DotsLoader } from "@/components/ui/loaders/dots-loader";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

import type { TInsertImageOptions } from ".";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cloudinary: any;
    }
}

interface IPayload {
    assets: {
        public_id: string;
        resource_type: string;
        type: string;
        format: string;
        version: number;
        url: string;
        secure_url: string;
        width: number;
        height: number;
        bytes: number;
        duration: null;
        created_at: Date;
        derived: {
            url: string;
            secure_url: string;
        }[];
        access_mode: string;
        created_by: {
            type: string;
            id: string;
        };
        uploaded_by: {
            type: string;
            id: string;
        };
        id: string;
        folder_id: string;
    }[];
}

interface CloudinaryProps {
    onImageInsert: ({ ...options }: TInsertImageOptions) => void;
}

export function Cloudinary({ onImageInsert }: Readonly<CloudinaryProps>) {
    const { data, isFetching, error } = trpc.cloudinary.get.useQuery();

    useLayoutEffect(() => {
        if (isFetching || error) return;

        if (data?.data.integration) {
            const mediaLibrary = window.cloudinary?.openMediaLibrary(
                {
                    cloud_name: data.data.integration.cloud_name,
                    api_key: data.data.integration.api_key,
                    remove_header: true,
                    insert_caption: "Insert & Close",
                    inline_container: "#cloudinary-container",
                    multiple: false,
                },
                {
                    insertHandler: function (data: IPayload) {
                        const file = data.assets[0];
                        const fileName = file.public_id.split("/").pop() ?? file.public_id;
                        onImageInsert({
                            src: file.url,
                            alt: fileName,
                            title: fileName,
                            hasCaption: false,
                        });
                    },
                },
            );
            mediaLibrary?.show();
        }
    }, [onImageInsert, isFetching, error, data]);

    const bodyView = data?.data.integration ? (
        <div id="cloudinary-container" className="h-[70dvh] w-[70dvw]" />
    ) : (
        <Center className="h-24">
            <Button asChild>
                <Link href={siteConfig.pages.settings.connections.link}>
                    <Icons.Connect className="mr-2" />
                    Connect cloudinary
                </Link>
            </Button>
        </Center>
    );

    const bodyPendingView = isFetching ? (
        <Center className="h-24">
            <DotsLoader />
        </Center>
    ) : (
        bodyView
    );

    return (
        <div className="rounded-lg border p-2">
            {error ? (
                <Center className="h-24">
                    <ErrorBox title="Error" description={error.message} />
                </Center>
            ) : (
                bodyPendingView
            )}
        </div>
    );
}
