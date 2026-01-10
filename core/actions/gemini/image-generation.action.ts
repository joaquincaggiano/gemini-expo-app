import { ImagePickerAsset } from "expo-image-picker";
import { FileType, promptWithFiles } from "../helpers/prompt-with-images";

export interface ImageGenerationResponse {
  imageUrl: string;
  text: string;
}

export const imageGenerationAction = async (
  prompt: string,
  files: (FileType | ImagePickerAsset)[]
): Promise<ImageGenerationResponse> => {
  const { imageUrl, text } = await promptWithFiles<ImageGenerationResponse>(
    "/image-generation",
    { prompt },
    files
  );

  return {
    imageUrl,
    text,
  };
};
