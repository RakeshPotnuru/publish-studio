"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Separator,
  Skeleton,
  toast,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { constants } from "@publish-studio/core/src/config/constants";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { ImageWidget } from "@/components/modules/dashboard/assets/image-widget";
import { ErrorBox } from "@/components/ui/error-box";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { Tooltip } from "@/components/ui/tooltip";
import useUserStore from "@/lib/stores/user";
import { trpc } from "@/utils/trpc";

import { DashboardHeader } from "../common/dashboard-header";

type ProfileProps = React.HTMLAttributes<HTMLDivElement>;

const formSchema = z.object({
  first_name: z
    .string()
    .regex(/^((?!\p{Extended_Pictographic}).)*$/u, "Emojis are not allowed")
    .min(1, "First Name cannot be empty")
    .max(constants.user.firstName.MAX_LENGTH)
    .optional(),
  last_name: z
    .string()
    .regex(/^((?!\p{Extended_Pictographic}).)*$/u, "Emojis are not allowed")
    .min(1, "Last Name cannot be empty")
    .max(constants.user.lastName.MAX_LENGTH)
    .optional(),
  profile_pic: z.string().url().optional(),
});

export function Profile({ ...props }: Readonly<ProfileProps>) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const {
    user,
    isLoading: isUserLoading,
    setUser,
    setIsLoading,
  } = useUserStore();
  const utils = trpc.useUtils();

  const { mutateAsync: editProfile, isLoading: isUpdating } =
    trpc.users.update.useMutation({
      onSuccess: async () => {
        toast.success("Your profile has been updated successfully.");
        setIsEditing(false);
        await utils.auth.getMe.invalidate();
      },
      onError: (error) => {
        setError(error.message);
      },
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      first_name: isUserLoading ? "Loading..." : "",
      last_name: isUserLoading ? "Loading..." : "",
      email: isUserLoading ? "Loading..." : "",
      profile_pic: isUserLoading ? "Loading..." : "",
    },
  });

  const watchProfilePic = form.watch("profile_pic");

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: updatedUser } = await editProfile(data);

      setUser(updatedUser.user);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        profile_pic: user.profile_pic,
      });
    }
  }, [user, form]);

  const isLoading = isUserLoading || isUpdating || form.formState.isSubmitting;

  return (
    <div
      className={cn({
        "animate-shake": error,
      })}
      {...props}
    >
      <Form {...form}>
        <form className="space-y-4">
          <DashboardHeader
            title="Profile"
            action={
              isEditing ? (
                <div className="flex flex-row space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isLoading || !form.formState.isDirty}
                  >
                    <ButtonLoader isLoading={isUpdating}>Save</ButtonLoader>
                  </Button>
                </div>
              ) : (
                <Tooltip content="Edit Profile">
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="ghost"
                    size="icon"
                    disabled={isLoading}
                    aria-label="Edit Profile"
                  >
                    <Icons.EditProfile size={25} />
                  </Button>
                </Tooltip>
              )
            }
          />
          <Separator />
          {error && <ErrorBox title="Update failed" description={error} />}
          <div className="space-y-8">
            <Avatar>
              {isEditing && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => setOpen(true)}
                    className="absolute left-[2px] top-[2px] rounded-full opacity-80 hover:opacity-100"
                  >
                    <Icons.Edit size={20} />
                  </Button>
                  <ImageWidget
                    open={open}
                    onOpenChange={setOpen}
                    isWidget={true}
                    onImageInsert={({ src }) => {
                      form.setValue("profile_pic", src, {
                        shouldDirty: true,
                      });
                      setOpen(false);
                    }}
                  />
                </>
              )}
              <AvatarImage
                src={watchProfilePic ?? user?.profile_pic}
                alt={`${user?.first_name} ${user?.last_name}`}
              />
              {isLoading ? (
                <AvatarFallback>
                  <Skeleton className="size-4 animate-ping rounded-full" />
                </AvatarFallback>
              ) : (
                <AvatarFallback>
                  {user?.first_name.charAt(0) ?? "P"}
                  {user?.last_name.charAt(0) ?? "S"}
                </AvatarFallback>
              )}
            </Avatar>
            <FormField
              control={form.control}
              name="email"
              disabled
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="me@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                disabled={!isEditing || isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="John"
                        autoComplete="given-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                disabled={!isEditing || isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Doe"
                        autoComplete="family-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
