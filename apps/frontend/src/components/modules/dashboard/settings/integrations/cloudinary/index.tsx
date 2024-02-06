import { useState } from "react";

import { toast } from "@itsrakesh/ui";
import type { ICloudinary } from "@publish-studio/core";

import { Images } from "@/assets/images";
import { trpc } from "@/utils/trpc";

import { ConnectionCard } from "../../connection-card";
import { CloudinaryForm } from "./form";

interface CloudinaryProps {
  data?: ICloudinary;
  isLoading: boolean;
}

export function Cloudinary({ data, isLoading }: Readonly<CloudinaryProps>) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    refetch: disconnect,
    isFetching: isDisconnecting,
    error: disconnectError,
  } = trpc.cloudinary.disconnect.useQuery(undefined, {
    enabled: false,
  });
  const utils = trpc.useUtils();

  const handleDisconnect = async () => {
    try {
      const { data } = await disconnect();
      toast.success(data?.data.message);
      await utils.cloudinary.get.invalidate();
    } catch {
      toast.error(disconnectError?.message ?? "Something went wrong.");
    }
  };

  return (
    <ConnectionCard
      onDisconnect={handleDisconnect}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      name="Cloudinary"
      icon={Images.cloudinaryLogoIcon}
      iconClassName="bg-white p-2"
      isLoading={isLoading || isDisconnecting}
      connected={data !== undefined}
      editForm={<CloudinaryForm type="edit" setIsOpen={setIsOpen} />}
      connectForm={<CloudinaryForm type="connect" setIsOpen={setIsOpen} />}
    />
  );
}
