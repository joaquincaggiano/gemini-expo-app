import geminiApi from "@/core/api/gemini.api";
import { ImagePickerAsset } from "expo-image-picker";

export interface FileType {
  uri: string;
  filename?: string;
  type?: string;
}

interface JsonBody {
  [key: string]: any;
}

export const promptWithFiles = async <T>(
  endpoint: string,
  body: JsonBody,
  files: (FileType | ImagePickerAsset)[]
): Promise<T> => {
  try {
    const formData = new FormData();

    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value);
    });

    files.forEach((file) => {
      const isFileType = "filename" in file;
      const fileName = isFileType
        ? (file as FileType).filename
        : (file as ImagePickerAsset).fileName;
      const fileType = isFileType
        ? (file as FileType).type
        : (file as ImagePickerAsset).mimeType;

      formData.append("files", {
        uri: file.uri,
        name: fileName ?? "image.jpg",
        type: fileType ?? "image/jpeg",
      } as unknown as Blob);
    });

    const response = await geminiApi.post<T>(endpoint, formData);

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
