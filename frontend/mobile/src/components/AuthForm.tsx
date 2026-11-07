// Khung chung + o nhap lieu cho man Dang nhap / Dang ky
import { useState, type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MoistureRing } from "./MoistureRing";
import { Icon } from "./Icon";
import { Txt } from "./Txt";
import { keyboardBehavior, useKeyboardVisible } from "../hooks/useKeyboardVisible";
import { cardShadow, colors, fonts, radius } from "../theme";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  // Ban phim mo: an hinh chau cay, dua form len tren cho khoi bi che
  const keyboard = useKeyboardVisible();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={keyboardBehavior}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 20,
            gap: keyboard ? 14 : 20,
            justifyContent: keyboard ? "flex-start" : "center",
            maxWidth: 440,
            width: "100%",
            alignSelf: "center",
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="leaf" color="#FFFFFF" size={24} />
            </View>
            <Txt size={22} weight="bold">TreeO</Txt>
          </View>

          {!keyboard && (
            <View style={{ alignItems: "center" }}>
              <MoistureRing moisture={58} size={168} />
            </View>
          )}

          <View style={{ gap: 6 }}>
            <Txt size={keyboard ? 22 : 26} weight="bold">{title}</Txt>
            {!keyboard && <Txt size={15} color={colors.muted}>{subtitle}</Txt>}
          </View>

          <View style={[{ backgroundColor: colors.card, borderRadius: radius.hero, padding: 20, gap: 16 }, cardShadow]}>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface FieldProps extends TextInputProps {
  label: string;
  hint?: string;
  secure?: boolean;
}

export function Field({ label, hint, secure, ...input }: FieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View style={{ gap: 6 }}>
      <Txt size={14} weight="semibold">{label}</Txt>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 48,
          borderRadius: radius.input,
          borderWidth: 1.5,
          borderColor: focused ? colors.primary : colors.border,
          backgroundColor: "#FFFFFF",
          paddingLeft: 14,
        }}
      >
        <TextInput
          {...input}
          accessibilityLabel={label}
          secureTextEntry={secure && hidden}
          placeholderTextColor="#8A968B"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            { flex: 1, height: "100%", fontFamily: fonts.regular, fontSize: 15, color: colors.text },
            Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null,
          ]}
        />
        {secure && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
            style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}
          >
            <Icon name={hidden ? "eye" : "eyeOff"} size={20} color={colors.muted} />
          </Pressable>
        )}
      </View>
      {hint ? <Txt size={12} color={colors.muted}>{hint}</Txt> : null}
    </View>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <View
      accessibilityRole="alert"
      style={{ flexDirection: "row", gap: 10, alignItems: "center", backgroundColor: "#FDECEC", borderRadius: 12, padding: 12 }}
    >
      <Icon name="alert" size={18} color={colors.danger} />
      <Txt size={13} weight="medium" color={colors.danger} style={{ flex: 1 }}>{message}</Txt>
    </View>
  );
}

export function PrimaryButton({ label, onPress, loading }: { label: string; onPress: () => void; loading?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: loading }}
      style={({ pressed }) => ({
        height: 50,
        borderRadius: radius.button,
        backgroundColor: pressed ? colors.primaryDark : colors.primary,
        opacity: loading ? 0.7 : 1,
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <Txt size={16} weight="semibold" color="#FFFFFF">{label}</Txt>
    </Pressable>
  );
}
