import { imageGenerationAction } from "@/core/actions/gemini/image-generation.action";
import { FileType } from "@/core/actions/helpers/prompt-with-images";
import { ImagePickerAsset } from "expo-image-picker";
import { create } from "zustand";

interface ImagePlaygroundState {
  isGenerating: boolean;
  images: string[];
  history: string[];
  previousPrompt: string;
  previousImages: (FileType | ImagePickerAsset)[];
  selectedStyle: string;

  generateImage: (
    prompt: string,
    images: (FileType | ImagePickerAsset)[]
  ) => Promise<void>;
  generateNextImage: () => Promise<void>;
  setSelectedStyle: (style: string) => void;
}

export const useImagePlaygroundStore = create<ImagePlaygroundState>()(
  (set, get) => ({
    isGenerating: false,
    images: [],
    history: [],
    previousPrompt: "",
    previousImages: [],
    selectedStyle: "",

    generateImage: async (
      prompt: string,
      images: (FileType | ImagePickerAsset)[]
    ) => {
      set({
        isGenerating: true,
        images: [],
        previousPrompt: prompt,
        previousImages: images,
      });

      const { imageUrl } = await imageGenerationAction(prompt, images);

      if (imageUrl === "") {
        set({ isGenerating: false });
        return;
      }

      const currentImages = [imageUrl, ...get().history];

      set({
        isGenerating: false,
        images: [imageUrl],
        history: currentImages,
      });

      setTimeout(() => {
        get().generateNextImage();
      }, 500);
    },

    generateNextImage: async () => {},

    setSelectedStyle: (style: string) => {
      if (get().selectedStyle === style) {
        set({ selectedStyle: "" });
        return;
      }
      set({ selectedStyle: style });
    },
  })
);
