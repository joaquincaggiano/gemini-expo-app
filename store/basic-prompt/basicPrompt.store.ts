import { basicPromptAction } from "@/core/actions/gemini/basic-prompt.action";
import { Message, Sender } from "@/interfaces/chat.interfaces";
import uuid from "react-native-uuid";
import { create } from "zustand";

interface BasicPromptState {
  geminiWriting: boolean;
  messages: Message[];
  addMessage: (text: string) => void;
  setGeminiWriting: (isWriting: boolean) => void;
}

const createMessage = (text: string, sender: Sender): Message => {
  return {
    id: uuid.v4(),
    text,
    createdAt: new Date(),
    sender,
    type: "text",
  };
};

export const useBasicPromptStore = create<BasicPromptState>((set) => ({
  geminiWriting: false,
  messages: [],
  addMessage: async (text: string) => {
    const userMessage = createMessage(text, "user");

    set((state) => ({
      geminiWriting: true,
      messages: [userMessage, ...state.messages],
    }));

    // Peticion a Gemini
    const geminiResponse = await basicPromptAction(text);
    const geminiMessage = createMessage(geminiResponse, "gemini");

    set((state) => ({
      geminiWriting: false,
      messages: [geminiMessage, ...state.messages],
    }));
  },
  setGeminiWriting: (isWriting: boolean) => set({ geminiWriting: isWriting }),
}));
