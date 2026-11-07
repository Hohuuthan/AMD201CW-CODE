// Man TreeO AI: 2 che do Care Plan / Feng Shui, chat
// Cau tra loi hien la DEMO - se goi AI Assistant service sau
import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View, type ScrollViewInstance } from "react-native";
import { Screen } from "../../components/Screen";
import { Icon } from "../../components/Icon";
import { Txt } from "../../components/Txt";
import { useAuth } from "../../auth/AuthContext";
import { keyboardBehavior } from "../../hooks/useKeyboardVisible";
import { cardShadow, colors, fonts, radius } from "../../theme";

type Message = { id: number; role: "ai" | "user"; title?: string; text: string };

const MODES = ["Care Plan", "Feng Shui"] as const;
const CHIPS = [
  ["Weekly plan for my Money Tree", "Plan for a hot week", "Care plan while I travel 5 days"],
  ["Best plant for my desk", "Lucky plants for a new home", "Where to place a Money Tree"],
];

export default function AiScreen() {
  const { user } = useAuth();
  const [mode, setMode] = useState(0);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 1,
      role: "ai",
      text: `Hi ${user?.displayName ?? "there"}! I can build a care plan for your plant, or give feng shui tips on which plant to choose and where to place it.`,
    },
    { id: 2, role: "user", text: "Make a weekly care plan for my Money Tree on my desk." },
    {
      id: 3,
      role: "ai",
      title: "Weekly care plan — Money Tree",
      text: "Mon · Check soil; water only if below 30%\nWed · Wipe the leaves, turn the pot a quarter\nFri · Check soil again\nSun · Look for yellow leaves or pests\n\nHeatwave tomorrow: keep it out of direct afternoon sun.",
    },
  ]);
  const scroll = useRef<ScrollViewInstance>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function send() {
    const q = draft.trim();
    if (!q) return;
    setMessages((m) => [...m, { id: Date.now(), role: "user", text: q }]);
    setDraft("");
    timer.current = setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, role: "ai", text: "(Demo) The AI service will answer this question here." }]);
    }, 900);
  }

  return (
    <Screen>
      {/* Ban phim mo -> day o nhap len tren ban phim */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={keyboardBehavior}>
      {/* Dau trang + chon che do */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, gap: 14, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: colors.divider }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" }}>
            <Icon name="sparkle" size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Txt size={20} weight="bold">TreeO AI</Txt>
            <Txt size={12} weight="medium" color={colors.primary}>● Online · care plans & feng shui</Txt>
          </View>
        </View>
        <View accessibilityRole="tablist" style={{ flexDirection: "row", gap: 4, backgroundColor: "#EEF5EE", borderRadius: 12, padding: 4 }}>
          {MODES.map((label, i) => {
            const on = mode === i;
            return (
              <Pressable
                key={label}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                onPress={() => setMode(i)}
                style={[
                  { flex: 1, height: 36, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: on ? "#FFFFFF" : "transparent" },
                  on ? cardShadow : null,
                ]}
              >
                <Txt size={13} weight="semibold" color={on ? colors.primaryDark : colors.muted}>{label}</Txt>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Tin nhan */}
      <ScrollView
        ref={scroll}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((m) =>
          m.role === "user" ? (
            <View key={m.id} style={{ alignSelf: "flex-end", maxWidth: "78%", backgroundColor: "#C8E6C9", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 18, borderBottomRightRadius: 4 }}>
              <Txt color="#1B3A1E" style={{ lineHeight: 20 }}>{m.text}</Txt>
            </View>
          ) : (
            <View key={m.id} style={[{ alignSelf: "flex-start", maxWidth: "86%", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.divider, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 18, borderBottomLeftRadius: 4, gap: 6 }, cardShadow]}>
              {m.title ? <Txt size={13} weight="bold" color={colors.primaryDark}>{m.title}</Txt> : null}
              <Txt style={{ lineHeight: 21 }}>{m.text}</Txt>
            </View>
          ),
        )}
      </ScrollView>

      {/* Goi y nhanh */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, gap: 8 }}>
        {CHIPS[mode].map((c) => (
          <Pressable
            key={c}
            onPress={() => setDraft(c)}
            accessibilityRole="button"
            style={{ height: 34, paddingHorizontal: 12, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.primaryLine, backgroundColor: "#FFFFFF", justifyContent: "center" }}
          >
            <Txt size={12} weight="medium" color={colors.primaryDark}>{c}</Txt>
          </Pressable>
        ))}
      </ScrollView>

      {/* O nhap */}
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center", paddingHorizontal: 16, paddingTop: 10 }}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={send}
          placeholder="Ask TreeO AI…"
          placeholderTextColor="#8A968B"
          accessibilityLabel="Ask TreeO AI"
          returnKeyType="send"
          style={[
            { flex: 1, height: 46, borderRadius: 23, borderWidth: 1, borderColor: colors.border, backgroundColor: "#FFFFFF", paddingHorizontal: 16, fontFamily: fonts.regular, fontSize: 14, color: colors.text },
            Platform.OS === "web" ? ({ outlineColor: colors.primary } as object) : null,
          ]}
        />
        <Pressable
          onPress={send}
          accessibilityRole="button"
          accessibilityLabel="Send"
          style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}
        >
          <Icon name="send" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
      <Txt size={11} color={colors.muted} align="center" style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
        TreeO AI suggests care plans and feng shui tips — it does not diagnose plant diseases.
      </Txt>
      </KeyboardAvoidingView>
    </Screen>
  );
}
