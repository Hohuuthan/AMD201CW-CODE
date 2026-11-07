// Khung cho man hinh phu (Doi mat khau, Dang bai): thanh tren co nut quay lai + tieu de
import type { ReactNode } from "react";
import { KeyboardAvoidingView, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Icon } from "./Icon";
import { Txt } from "./Txt";
import { keyboardBehavior } from "../hooks/useKeyboardVisible";
import { colors } from "../theme";

interface Props {
  title: string;
  backLabel: string;
  right?: ReactNode;
  children: ReactNode;
}

export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace("/");
}

export function SubScreen({ title, backLabel, right, children }: Props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={keyboardBehavior}>
        <View
          style={{
            height: 56,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 8,
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 1,
            borderBottomColor: colors.divider,
          }}
        >
          <Pressable
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel={backLabel}
            style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center", transform: [{ scaleX: -1 }] }}
          >
            <Icon name="chevron" size={22} />
          </Pressable>
          <Txt size={17} weight="semibold" style={{ flex: 1 }} accessibilityRole="header">{title}</Txt>
          {right}
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 20, gap: 16, maxWidth: 560, width: "100%", alignSelf: "center" }}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
