import { ChatMessages } from "@/components/chat/ChatMessages";
import CustomInputBox from "@/components/chat/CustomInputBox";
import { useBasicPromptStore } from "@/store/basic-prompt/basicPrompt.store";
import { Layout } from "@ui-kitten/components";

const BasicPromptScreen = () => {
  const { messages, geminiWriting, addMessage } = useBasicPromptStore();

  return (
    <Layout style={{ flex: 1 }}>
      <ChatMessages messages={messages} isGeminiWriting={geminiWriting} />

      <CustomInputBox
        onSendMessage={(message, attachments) => {
          console.log(attachments);
          addMessage(message);
        }}
      />
    </Layout>
  );
};

export default BasicPromptScreen;
