import { basicPromptStreamAction } from "@/core/actions/gemini/basic-prompt-stream.action";
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
  addMessage: async (prompt: string) => {
    const userMessage = createMessage(prompt, "user");
    const geminiMessage = createMessage("Generando respuesta...", "gemini");

    set((state) => ({
      // geminiWriting: true,
      messages: [geminiMessage, userMessage, ...state.messages],
    }));

    // Peticion a Gemini (basic prompt stream)
    await basicPromptStreamAction(prompt, (text) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === geminiMessage.id ? { ...msg, text } : msg
        ),
      }));
    });

    // Peticion a Gemini (basic prompt)
    // const geminiResponse = await basicPromptAction(prompt);
    // const geminiMessage = createMessage(geminiResponse, "gemini");

    // set((state) => ({
    //   geminiWriting: false,
    //   messages: [geminiMessage, ...state.messages],
    // }));
  },
  setGeminiWriting: (isWriting: boolean) => set({ geminiWriting: isWriting }),
}));
