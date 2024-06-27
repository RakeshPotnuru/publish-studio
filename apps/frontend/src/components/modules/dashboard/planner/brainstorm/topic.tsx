import { useState } from "react";

import { Textarea } from "@itsrakesh/ui";

import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { Shake } from "@/components/ui/shake";
import { trpc } from "@/utils/trpc";

import { GenerateIdeasButton } from ".";

interface TopicProps {
  setIdeas: React.Dispatch<React.SetStateAction<string[]>>;
}

export function Topic({ setIdeas }: Readonly<TopicProps>) {
  const [topic, setTopic] = useState<string>("");

  const {
    refetch: generate,
    isFetching,
    error,
  } = trpc.genAI.generate.ideasWith.text.useQuery(topic, {
    enabled: false,
  });

  const handleGenerate = async () => {
    try {
      const { data } = await generate();
      setIdeas(
        (prev) =>
          [...(data?.data.ideas ?? []).map((idea) => idea), ...prev] ?? [],
      );
      setTopic("");
    } catch {
      // Ignore
    }
  };

  return (
    <Shake isShaking={error?.message ?? ""} className="space-y-4">
      <Heading level={6}>
        Generate ideas based on a topic. Just put whatever comes to your mind.
      </Heading>
      {error && (
        <Center>
          <ErrorBox title="Error" description={error.message} />
        </Center>
      )}
      <TopicInput topic={topic} setTopic={setTopic} isLoading={isFetching} />
      <GenerateIdeasButton
        isLoading={isFetching}
        onClick={handleGenerate}
        disabled={!topic}
      />
    </Shake>
  );
}

interface TopicInputProps {
  topic: string;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}

function TopicInput({ topic, setTopic, isLoading }: Readonly<TopicInputProps>) {
  return (
    <Textarea
      value={topic}
      onChange={(e) => setTopic(e.target.value)}
      placeholder="eg. How to build a successful business, software engineering, etc."
      disabled={isLoading}
    />
  );
}
