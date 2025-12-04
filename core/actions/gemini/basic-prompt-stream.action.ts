import { fetch } from "expo/fetch";

const API_URL = process.env.EXPO_PUBLIC_GEMINI_API_URL;

export const basicPromptStreamAction = async (
  prompt: string,
  onChunk: (chunk: string) => void
) => {
  const response = await fetch(`${API_URL}/basic-prompt-stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "plain/text",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader(); // UINT
  const decoder = new TextDecoder("utf-8");
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    result += chunk;
    onChunk(result);
  }
};
