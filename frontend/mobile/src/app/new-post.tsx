// Man Dang bai moi (Community -> Create post)
import { useState } from "react";
import { Platform, Pressable, TextInput, View } from "react-native";
import { goBack, SubScreen } from "../components/SubScreen";
import { FormError } from "../components/AuthForm";
import { Txt } from "../components/Txt";
import { useAuth } from "../auth/AuthContext";
import { forumApi } from "../api/forum";
import { useLang } from "../i18n/LanguageContext";
import { colors, fonts, radius } from "../theme";

const MAX = 1000;

export default function NewPostScreen() {
  const { authFetch } = useAuth();
  const { t } = useLang();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  async function submit() {
    if (!content.trim()) return setError(t.errEmptyPost);
    setError(null);
    setPosting(true);
    try {
      await forumApi(authFetch).create(content.trim());
      // Quay ve Community; Community tu tai lai danh sach khi hien len (useFocusEffect)
      goBack();
    } catch (e) {
      setError((e as Error).message);
      setPosting(false);
    }
  }

  const canPost = content.trim().length > 0 && !posting;

  return (
    <SubScreen
      title={t.newPostTitle}
      backLabel={t.cancel}
      right={
        <Pressable
          onPress={submit}
          disabled={!canPost}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canPost, busy: posting }}
          style={{ height: 40, paddingHorizontal: 18, marginRight: 8, borderRadius: 12, backgroundColor: canPost ? colors.primary : colors.track, justifyContent: "center" }}
        >
          <Txt weight="semibold" color="#FFFFFF">{posting ? t.posting : t.post}</Txt>
        </Pressable>
      }
    >
      <View style={{ gap: 6 }}>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder={t.newPostPlaceholder}
          placeholderTextColor="#8A968B"
          accessibilityLabel={t.newPostTitle}
          multiline
          autoFocus
          maxLength={MAX}
          textAlignVertical="top"
          style={[
            {
              minHeight: 180,
              borderRadius: radius.card,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: "#FFFFFF",
              padding: 16,
              fontFamily: fonts.regular,
              fontSize: 16,
              lineHeight: 23,
              color: colors.text,
            },
            Platform.OS === "web" ? ({ outlineColor: colors.primary } as object) : null,
          ]}
        />
        <Txt size={12} color={colors.muted} align="right">{content.length}/{MAX}</Txt>
      </View>
      <FormError message={error} />
    </SubScreen>
  );
}
