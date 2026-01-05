import { Button, Input, Layout } from "@ui-kitten/components";
import { Image, KeyboardAvoidingView, Platform } from "react-native";

import { getGalleryImages } from "@/core/actions/image-picker/get-gallery-images";
import { useThemeColor } from "@/hooks/useThemeColor";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ImagePickerAsset } from "expo-image-picker";
import { useState } from "react";

interface Props {
  onSendMessage: (message: string, attachments: ImagePickerAsset[]) => void;
}

const CustomInputBox = ({ onSendMessage }: Props) => {
  const isAndroid = Platform.OS === "android";
  const iconColor = useThemeColor({}, "icon");
  const [text, setText] = useState("");
  const [images, setImages] = useState<ImagePickerAsset[]>([]);

  const handleSendMessage = () => {
    if (text.trim().length === 0) return;

    onSendMessage(text.trim(), images);
    setText("");
    setImages([]);
  };

  const handlePickImages = async () => {
    const selectedImages = await getGalleryImages();

    if (selectedImages.length === 0 || images.length >= 4) return;

    const availableSlots = 4 - images.length;
    const imagesToAdd = selectedImages.slice(0, availableSlots);

    if (imagesToAdd.length > 0) {
      setImages([...images, ...imagesToAdd]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={isAndroid ? "height" : "padding"}
      keyboardVerticalOffset={isAndroid ? 0 : 85}
    >
      {/* Imágenes */}
      <Layout
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {images.map((image) => (
          <Image
            key={image.uri}
            source={{ uri: image.uri }}
            style={{ width: 50, height: 50, marginTop: 5, borderRadius: 10 }}
          />
        ))}
      </Layout>

      {/* Espacio para escribir y enviar mensaje */}
      <Layout
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingBottom: isAndroid ? 10 : 20,
        }}
      >
        <Button
          onPress={handlePickImages}
          appearance="ghost"
          accessoryRight={
            <Ionicons name="attach-outline" size={22} color={iconColor} />
          }
        />
        <Input
          placeholder="Escribe tu mensaje"
          multiline
          numberOfLines={4}
          style={{ flex: 1 }}
          value={text}
          onChangeText={setText}
        />
        <Button
          onPress={handleSendMessage}
          appearance="ghost"
          accessoryRight={
            <Ionicons name="paper-plane-outline" size={22} color={iconColor} />
          }
        />
      </Layout>
    </KeyboardAvoidingView>
  );
};

export default CustomInputBox;
