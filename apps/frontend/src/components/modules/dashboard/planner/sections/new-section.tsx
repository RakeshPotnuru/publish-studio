import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  toast,
} from "@itsrakesh/ui";
import { constants } from "@publish-studio/core/src/config/constants";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import usePlannerStore from "@/lib/stores/planner";
import { trpc } from "@/utils/trpc";

export const formSchema = z.object({
  name: z
    .string()
    .min(constants.planner.section.name.MIN_LENGTH, "Name is too short")
    .max(constants.planner.section.name.MAX_LENGTH, "Name is too long"),
});

export function NewSection() {
  const [isOpen, setIsOpen] = useState(false);

  const { setSections } = usePlannerStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
    },
  });

  const { mutateAsync: create } = trpc.section.create.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const section = await create({
        ...data,
      });

      setSections((prev) => [
        ...prev,
        {
          ...section,
          tasks: [],
        },
      ]);

      setIsOpen(false);
      form.reset();
    } catch {
      // Ignore
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} className="whitespace-nowrap">
          <Icons.Add className="mr-2 size-4" /> New Section
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
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
                  <FormControl>
                    <Input placeholder="Section name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size={"sm"}
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
            >
              Submit
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
