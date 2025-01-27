export async function* getIterableStream(
  body: ReadableStream<Uint8Array>,
): AsyncIterable<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    const decodedChunk = decoder.decode(value, { stream: true });
    yield decodedChunk;
  }
}

export const generateStream = async (
  path: string,
  method: "GET" | "POST",
  body: string,
): Promise<AsyncIterable<string>> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body,
  });

  if (response.status !== 200) throw new Error(response.status.toString());
  if (!response.body) throw new Error("Response body does not exist");
  return getIterableStream(response.body);
};
