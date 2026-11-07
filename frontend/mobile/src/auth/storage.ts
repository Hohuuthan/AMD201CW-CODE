// Luu du lieu nho tren may: dien thoai dung SecureStore (ma hoa), trinh duyet dung localStorage
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export const SESSION_KEY = "treeo.auth";
export const LANG_KEY = "treeo.lang";

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(key);
}

export async function setItem(key: string, value: string) {
  if (Platform.OS === "web") {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Trinh duyet chan localStorage: van dung duoc trong phien nay
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function removeItem(key: string) {
  if (Platform.OS === "web") {
    try {
      localStorage.removeItem(key);
    } catch {
      // bo qua
    }
    return;
  }
  await SecureStore.deleteItemAsync(key);
}
