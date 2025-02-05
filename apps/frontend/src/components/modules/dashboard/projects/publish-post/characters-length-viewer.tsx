import { cn } from "@itsrakesh/utils";

interface CharactersLengthViewerProps {
  maxLength: number;
  length: number;
  recommendedLength: {
    min: number;
    max: number;
  };
}

export function CharactersLengthViewer({
  maxLength,
  length,
  recommendedLength,
}: Readonly<CharactersLengthViewerProps>) {
  return (
    <div
      className={cn(
        "w-max animate-slide-down rounded-full border bg-accent px-2 py-1 text-xs",
        {
          "border-success":
            length >= recommendedLength.min && length <= recommendedLength.max,
          "border-destructive": length > recommendedLength.max,
        },
      )}
    >
      <p>
        {length} / {maxLength}
      </p>
    </div>
  );
}
