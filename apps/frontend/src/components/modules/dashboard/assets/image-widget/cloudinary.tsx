import { useLayoutEffect } from "react";

import { TInsertImageOptions } from ".";

declare global {
    interface Window {
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
        tags: any[];
        metadata: any[];
        created_at: Date;
        derived: {
            url: string;
            secure_url: string;
        }[];
        access_mode: string;
        access_control: any[];
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
    useLayoutEffect(() => {
        const mediaLibrary = window.cloudinary?.openMediaLibrary(
            {
                cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
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
    }, [onImageInsert]);

    return (
        <div className="rounded-lg border p-2">
            <div id="cloudinary-container" className="h-[70dvh] w-[70dvw]" />
        </div>
    );
}
