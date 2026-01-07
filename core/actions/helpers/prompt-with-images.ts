import geminiApi from "@/core/api/gemini.api";

export interface FileType {
  uri: string;
  filename?: string;
  type?: string;
}

interface JsonBody {
  [key: string]: any;
}

export const promptWithFiles = async (
  endpoint: string,
  body: JsonBody,
  files: FileType[]
): Promise<string> => {
  try {
    const formData = new FormData();

    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value);
    });

    files.forEach((file) => {
      formData.append("files", {
        uri: file.uri,
        name: file.filename ?? "image.jpg",
        type: file.type ?? "image/jpeg",
      } as unknown as Blob);
    });

    const response = await geminiApi.post(endpoint, formData);

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
