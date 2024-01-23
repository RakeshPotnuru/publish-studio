import { TInsertImageOptions } from ".";

type IPayload =
    | {
          eventType: "INSERT";
          data: {
              createdAt: Date;
              customCoordinates: null;
              fileId: string;
              filePath: string;
              fileType: string;
              isPrivateFile: boolean;
              name: string;
              tags: null;
              thumbnail: string;
              type: string;
              url: string;
          }[];
      }
    | {
          eventType: "CLOSE_MEDIA_LIBRARY_WIDGET";
      };

interface ImageKitProps {
    onImageInsert: ({ ...options }: TInsertImageOptions) => void;
}

export function ImageKit({ onImageInsert }: Readonly<ImageKitProps>) {
    import("imagekit-media-library-widget").then(({ default: IKMediaLibraryWidget }) => {
        const config = {
            container: "#imagekit-container",
            className: "media-library-widget",
            containerDimensions: {
                height: "100%",
                width: "100%",
            },
            dimensions: {
                height: "100%",
                width: "100%",
            },
            view: "inline",
        };

        const callback = (payload: IPayload) => {
            if (payload.eventType === "INSERT") {
                const { data } = payload;
                const file = data[0];
                onImageInsert({
                    src: file.url,
                    alt: file.name,
                    title: file.name,
                    hasCaption: false,
                });
            }
        };

        new IKMediaLibraryWidget(config, callback);
    });

    return (
        <div className="rounded-lg border p-2">
            <div id="imagekit-container" className="h-[70dvh] w-[70dvw]" />
        </div>
    );
}
