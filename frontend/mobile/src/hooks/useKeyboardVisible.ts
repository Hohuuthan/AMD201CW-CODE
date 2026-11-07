// Biet ban phim dang mo hay dong (de an bot hinh trang tri, nhuong cho cho o nhap)
import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

export function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const show = Keyboard.addListener(showEvent, () => setVisible(true));
    const hide = Keyboard.addListener(hideEvent, () => setVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return visible;
}

// Android tu Expo moi chay che do tran vien (edge-to-edge): man hinh KHONG tu co lai khi
// ban phim mo, nen ca iOS va Android deu can KeyboardAvoidingView dung "padding".
export const keyboardBehavior = Platform.OS === "web" ? undefined : "padding";
