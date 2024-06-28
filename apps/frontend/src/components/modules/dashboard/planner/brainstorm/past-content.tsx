import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { Shake } from "@/components/ui/shake";
import { trpc } from "@/utils/trpc";

import { GenerateIdeasButton } from ".";

interface PastContentProps {
  setIdeas: React.Dispatch<React.SetStateAction<string[]>>;
}

export function PastContent({ setIdeas }: Readonly<PastContentProps>) {
  const {
    refetch: generate,
    isFetching,
    error,
  } = trpc.genAI.generate.ideasWith.pastContent.useQuery(undefined, {
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
      <Heading level={6}>Generate ideas based on your past content.</Heading>
      {error && (
        <Center>
          <ErrorBox title="Error" description={error.message} />
        </Center>
      )}
      <GenerateIdeasButton isLoading={isFetching} onClick={handleGenerate} />
    </Shake>
  );
}
