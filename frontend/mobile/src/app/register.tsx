import { useState } from "react";
import { View } from "react-native";
import { Link } from "expo-router";
import { AuthShell, Field, FormError, PrimaryButton } from "../components/AuthForm";
import { Txt } from "../components/Txt";
import { useAuth } from "../auth/AuthContext";
import { useLang } from "../i18n/LanguageContext";
import { colors } from "../theme";

export default function RegisterScreen() {
  const { register } = useAuth();
  const { t } = useLang();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    // Kiem tra truoc o app cho nhanh; server van kiem tra lai (khong tin app)
    if (name.trim().length < 2) return setError(t.errName);
    if (!email.includes("@")) return setError(t.errEmail);
    if (password.length < 8) return setError(t.errPasswordLength);
    if (password !== confirm) return setError(t.errPasswordMatch);

    setError(null);
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title={t.registerTitle} subtitle={t.registerSub}>
      <Field label={t.yourName} value={name} onChangeText={setName} autoComplete="name" maxLength={50} />
      <Field
        label={t.email}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
      />
      <Field
        label={t.password}
        value={password}
        onChangeText={setPassword}
        secure
        autoComplete="new-password"
        hint={t.passwordHint}
      />
      <Field label={t.confirmPassword} value={confirm} onChangeText={setConfirm} secure autoComplete="new-password" onSubmitEditing={submit} />
      <FormError message={error} />
      <PrimaryButton label={loading ? t.creatingAccount : t.createAccount} onPress={submit} loading={loading} />
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
        <Txt color={colors.muted}>{t.haveAccount}</Txt>
        <Link href="/login" replace>
          <Txt weight="semibold" color={colors.primary}>{t.login}</Txt>
        </Link>
      </View>
    </AuthShell>
  );
}
