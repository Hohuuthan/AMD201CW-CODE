import { useState } from "react";
import { View } from "react-native";
import { Link } from "expo-router";
import { AuthShell, Field, FormError, PrimaryButton } from "../components/AuthForm";
import { Txt } from "../components/Txt";
import { useAuth } from "../auth/AuthContext";
import { useLang } from "../i18n/LanguageContext";
import { colors } from "../theme";

export default function LoginScreen() {
  const { login } = useAuth();
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email.trim() || !password) {
      setError(t.errEmailPassword);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      // Dang nhap xong, layout goc tu chuyen sang cac tab
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title={t.welcomeBack} subtitle={t.loginSub}>
      <Field
        label={t.email}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      <Field
        label={t.password}
        value={password}
        onChangeText={setPassword}
        secure
        autoComplete="current-password"
        textContentType="password"
        onSubmitEditing={submit}
      />
      <View style={{ alignItems: "flex-end", marginTop: -6 }}>
        <Link href={{ pathname: "/forgot-password", params: email.trim() ? { email: email.trim() } : {} }}>
          <Txt size={13} weight="semibold" color={colors.primary}>{t.forgotPassword}</Txt>
        </Link>
      </View>
      <FormError message={error} />
      <PrimaryButton label={loading ? t.loggingIn : t.login} onPress={submit} loading={loading} />
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
        <Txt color={colors.muted}>{t.newHere}</Txt>
        <Link href="/register" replace>
          <Txt weight="semibold" color={colors.primary}>{t.createAccount}</Txt>
        </Link>
      </View>
    </AuthShell>
  );
}
