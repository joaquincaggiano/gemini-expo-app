import geminiApi from "@/core/api/gemini.api";

export const basicPromptAction = async (prompt: string) => {
  const response = await geminiApi.post(
    "/basic-prompt",
    { prompt },
    {
      responseType: "text",
    }
  );

  return response.data;
};
