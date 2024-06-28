import { useState } from "react";

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Skeleton,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";

import { Icons } from "@/assets/icons";
import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { Shake } from "@/components/ui/shake";
import { Tooltip } from "@/components/ui/tooltip";
import { trpc } from "@/utils/trpc";

import { GenerateIdeasButton } from ".";

interface PastCategoriesProps {
  setIdeas: React.Dispatch<React.SetStateAction<string[]>>;
}

export function PastCategories({ setIdeas }: Readonly<PastCategoriesProps>) {
  const [category, setCategory] = useState<string>("");

  const {
    refetch: generate,
    isFetching,
    error,
  } = trpc.genAI.generate.ideasWith.category.useQuery(category, {
    enabled: false,
  });

  const handleGenerate = async () => {
    try {
      const { data } = await generate();
      setIdeas(
        (prev) =>
          [...(data?.data.ideas ?? []).map((idea) => idea), ...prev] ?? [],
      );
    } catch {
      // Ignore
    }
  };

  return (
    <Shake isShaking={error?.message ?? ""} className="space-y-4">
      <Heading level={6}>Generate ideas based on your past categories.</Heading>
      {error && (
        <Center>
          <ErrorBox title="Error" description={error.message} />
        </Center>
      )}

      <ChooseCategory category={category} setCategory={setCategory} />

      <GenerateIdeasButton
        isLoading={isFetching}
        onClick={handleGenerate}
        disabled={!category}
      />
    </Shake>
  );
}

interface ChooseCategoryProps {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

function ChooseCategory({
  category,
  setCategory,
}: Readonly<ChooseCategoryProps>) {
  const [open, setOpen] = useState(false);

  const { data, error, isFetching } = trpc.projects.categories.useQuery();

  const categories = data?.data.categories ?? [];

  const handleRandom = () => {
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    setCategory(randomCategory);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <div className="flex gap-1">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {category || "Select category..."}
            <Icons.Sort className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <Tooltip content="Random category">
          <Button
            onClick={handleRandom}
            variant={"secondary"}
            size={"icon"}
            aria-label="select random category"
          >
            <Icons.Random className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>
      <PopoverContent className="p-0">
        {error && (
          <Center>
            <ErrorBox title="Error" description={error.message} />
          </Center>
        )}
        {isFetching ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={`skeleton-${index.toString()}`} className="h-8" />
            ))}
          </div>
        ) : (
          <Command>
            <CommandInput placeholder="Search categories..." className="h-9" />
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-72">
                  {categories.map((cat) => (
                    <CommandItem
                      key={cat}
                      value={cat}
                      onSelect={(currentValue) => {
                        setCategory(
                          currentValue === category ? "" : currentValue,
                        );
                        setOpen(false);
                      }}
                    >
                      {cat}
                      <Icons.Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          category === cat ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
}
