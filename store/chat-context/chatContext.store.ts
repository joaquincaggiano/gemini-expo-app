import { getChatStream } from "@/core/actions/gemini/chat-stream.action";
import { Message, Sender } from "@/interfaces/chat.interfaces";
import uuid from "react-native-uuid";
import { create } from "zustand";

interface ChatContextState {
  chatId: string;
  messages: Message[];
  addMessage: (text: string, attachments: any[]) => void;
  clearChat: () => void;
}

const createMessage = (
  text: string,
  sender: Sender,
  attachments: any[] = []
): Message => {
  if (attachments.length > 0) {
    return {
      id: uuid.v4(),
      text,
      createdAt: new Date(),
      sender,
      type: "image",
      images: attachments.map((attachment) => attachment.uri),
    };
  }

  return {
    id: uuid.v4(),
    text,
    createdAt: new Date(),
    sender,
    type: "text",
  };
};

export const useChatContextStore = create<ChatContextState>((set, get) => ({
  chatId: uuid.v4(),
  messages: [],

  addMessage: async (prompt: string, attachments: any[]) => {
    const userMessage = createMessage(prompt, "user", attachments);
    const geminiMessage = createMessage("Generando respuesta...", "gemini");
    const chatId = get().chatId;
    set((state) => ({
      messages: [geminiMessage, userMessage, ...state.messages],
    }));

    // Peticion a Gemini (basic prompt stream)
    await getChatStream({
      prompt,
      chatId,
      files: attachments,
      onChunk: (text) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === geminiMessage.id ? { ...msg, text } : msg
          ),
        }));
      },
    });
  },

  clearChat: () => set({ messages: [], chatId: uuid.v4() }),
}));
