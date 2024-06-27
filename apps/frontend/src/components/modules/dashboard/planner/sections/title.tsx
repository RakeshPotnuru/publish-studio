import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from "@itsrakesh/ui";
import type { ISection } from "@publish-studio/core";
import { constants } from "@publish-studio/core/src/config/constants";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { trpc } from "@/utils/trpc";

import { formSchema } from "./new-section";

interface TitleProps {
  section: ISection;
  editingSectionId: ISection["_id"] | null;
  setEditingSectionId: React.Dispatch<
    React.SetStateAction<ISection["_id"] | null>
  >;
}

export function Title({
  section,
  editingSectionId,
  setEditingSectionId,
}: Readonly<TitleProps>) {
  const [title, setTitle] = useState(section.name);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      name: title,
    },
  });

  const { mutateAsync: rename } = trpc.section.update.useMutation();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data.name === title) {
      setEditingSectionId(null);
      return;
    }

    try {
      await rename({
        _id: section._id,
        name: data.name,
      });
      setTitle(data.name);
      setEditingSectionId(null);
    } catch {
      // Ignore
    }
  };

  return editingSectionId === section._id &&
    section.name !== constants.planner.section.name.RESERVED ? (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-row items-center gap-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl onBlur={form.handleSubmit(onSubmit)}>
                {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
                <Input placeholder="Section name" autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  ) : (
    <slot onClick={() => setEditingSectionId(section._id)}>{title}</slot>
  );
}
