import { useState } from "react";

import { Button, toast } from "@itsrakesh/ui";

import { Icons } from "@/assets/icons";
import { AskForConfirmation } from "@/components/ui/ask-for-confirmation";
import { Tooltip } from "@/components/ui/tooltip";
import { useSnippets } from "@/lib/stores/snippets";
import { trpc } from "@/utils/trpc";

interface SnippetNavigationProps {
  isFetching: boolean;
}

export function SnippetNavigation({
  isFetching,
}: Readonly<SnippetNavigationProps>) {
  const [askingForConfirmation, setAskingForConfirmation] = useState(false);

  const { setActiveSnippet, snippets, activeSnippet, removeSnippet } =
    useSnippets();

  const handleNext = () => {
    const index = snippets.findIndex(
      (snippet) => snippet._id === activeSnippet?._id,
    );

    if (index === snippets.length - 1) return;

    setActiveSnippet(snippets[index + 1]);
  };

  const handlePrevious = () => {
    const index = snippets.findIndex(
      (snippet) => snippet._id === activeSnippet?._id,
    );

    if (index === 0) return;

    setActiveSnippet(snippets[index - 1]);
  };

  const { mutateAsync: deleteSnippet, isLoading: isDeleting } =
    trpc.snippets.delete.useMutation({
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleDelete = async () => {
    if (!activeSnippet) return;

    const index = snippets.findIndex(
      (snippet) => snippet._id === activeSnippet?._id,
    );

    try {
      await deleteSnippet({
        ids: [activeSnippet._id],
      });
      setAskingForConfirmation(false);
      removeSnippet(activeSnippet._id);

      if (snippets.length === 1) {
        setActiveSnippet(null);
      } else if (index === snippets.length - 1) {
        setActiveSnippet(snippets[index - 1]);
      } else {
        setActiveSnippet(snippets[index + 1]);
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className="flex justify-between py-2">
      <Tooltip content="Previous">
        <Button
          onClick={handlePrevious}
          variant="outline"
          size="icon"
          className="h-8 w-8 text-xs"
          disabled={
            isFetching ||
            (activeSnippet && snippets.indexOf(activeSnippet) === 0)
          }
        >
          <Icons.LeftChevron />
        </Button>
      </Tooltip>
      <div className="flex items-center space-x-2">
        {askingForConfirmation ? (
          <AskForConfirmation
            onCancel={() => setAskingForConfirmation(false)}
            onConfirm={handleDelete}
            isLoading={isDeleting}
            classNames={{
              confirmButton: "h-6 w-6",
              cancelButton: "h-6 w-6",
              container: "py-1 pl-2",
            }}
          />
        ) : (
          <Tooltip content="Delete">
            <Button
              onClick={() => setAskingForConfirmation(true)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-xs"
            >
              <Icons.Delete />
            </Button>
          </Tooltip>
        )}
        <Tooltip content="Next">
          <Button
            onClick={handleNext}
            variant="outline"
            size="icon"
            className="h-8 w-8 text-xs"
            disabled={
              isFetching ||
              (activeSnippet &&
                snippets.indexOf(activeSnippet) === snippets.length - 1)
            }
          >
            <Icons.RightChevron />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
