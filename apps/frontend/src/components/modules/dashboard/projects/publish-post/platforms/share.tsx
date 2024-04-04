import React from "react";
import Link from "next/link";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import type { IProject } from "@publish-studio/core";
import type { IconType } from "react-icons";

import { Icons } from "@/assets/icons";
import { Tooltip } from "@/components/ui/tooltip";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

interface ShareProps {
  project: IProject;
  url: string;
}

export function Share({ project, url }: Readonly<ShareProps>) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const { name, title, description, cover_image } = project;

  const shareTitle = title ?? name;

  const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  const twitterShare = `https://twitter.com/intent/tweet?url=${url}&text=${shareTitle}`;
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${shareTitle}&summary=${description}`;
  const redditShare = `https://www.reddit.com/submit?url=${url}&title=${shareTitle}`;
  const whatsappShare = `https://api.whatsapp.com/send?text=*${shareTitle}* %0A%0A${description}%0A%0ALink: ${url}`;
  const mailShare = `mailto:?subject=${shareTitle}&body=${description}%0A%0ALink: ${url}`;

  const moreShareOptions = async () => {
    let imageFile;
    if (cover_image) {
      imageFile = new File([cover_image], "cover_image.jpg", {
        type: "image/jpeg",
      });
    }
    await navigator.share({
      title: shareTitle,
      text: description,
      url,
      files: imageFile ? [imageFile] : [],
    });
  };

  return (
    <Popover>
      <Tooltip content="Share post">
        <PopoverTrigger asChild>
          <Button type="button" variant="ghost" size="icon" className="h-6 w-6">
            <Icons.Share />
          </Button>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent
        className="max-w-max"
        align="end"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        <div className="flex items-center space-x-2">
          <ShareItem
            icon={isCopied ? <Icons.Check /> : <Icons.Copy />}
            onClick={async () => copyToClipboard(url)}
            tooltip="Copy link"
            className={cn({
              "text-success": isCopied,
            })}
          />
          <ShareItem
            icon={<Icons.Facebook />}
            href={fbShare}
            tooltip="Facebook"
          />
          <ShareItem
            icon={<Icons.Twitter />}
            href={twitterShare}
            tooltip="Twitter"
          />
          <ShareItem
            icon={<Icons.Linkedin />}
            href={linkedinShare}
            tooltip="LinkedIn"
          />
          <ShareItem
            icon={<Icons.Reddit />}
            href={redditShare}
            tooltip="Reddit"
          />
          <ShareItem
            icon={<Icons.Whatsapp />}
            href={whatsappShare}
            tooltip="WhatsApp"
          />
          <ShareItem icon={<Icons.Mail />} href={mailShare} tooltip="Email" />
          {typeof navigator.share === "function" && (
            <ShareItem
              icon={<Icons.RowActions />}
              onClick={moreShareOptions}
              tooltip="More"
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface ShareItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon: React.ReactElement<IconType>;
  href?: string;
  tooltip: string;
}

const ShareItem = ({
  icon,
  href,
  onClick,
  className,
  tooltip,
}: Readonly<ShareItemProps>) => {
  return (
    <Tooltip content={tooltip}>
      <Button
        onClick={onClick}
        variant="ghost"
        size="icon"
        className={cn("h-6 w-6", className)}
      >
        {href ? (
          <Link href={href} target="_blank">
            {icon}
          </Link>
        ) : (
          icon
        )}
      </Button>
    </Tooltip>
  );
};
