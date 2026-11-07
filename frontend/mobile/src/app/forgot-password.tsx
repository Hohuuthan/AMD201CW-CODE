// Quen mat khau: buoc 1 nhap email -> buoc 2 nhap ma 6 so + mat khau moi
// Dat lai thanh cong -> server tra ve token -> app dang nhap luon, vao man Garden
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { AuthShell, Field, FormError, PrimaryButton } from "../components/AuthForm";
import { Txt } from "../components/Txt";
import { useAuth } from "../auth/AuthContext";
import * as api from "../api/auth";
import { useLang } from "../i18n/LanguageContext";
import { colors } from "../theme";

const RESEND_SECONDS = 60; // Khop voi server: 60 giay moi xin ma moi duoc

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const { t } = useLang();
  const params = useLocalSearchParams<{ email?: string }>();

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState(params.email ?? "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Dem nguoc nut "Gui lai ma"
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function sendCode() {
    if (!email.includes("@")) return setError(t.errEmail);
    setError(null);
    setLoading(true);
    try {
      await api.forgotPassword(email.trim());
      setStep("code");
      setCooldown(RESEND_SECONDS);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function submitReset() {
    if (!/^\d{6}$/.test(code.trim())) return setError(t.errCode);
    if (password.length < 8) return setError(t.errPasswordLength);
    if (password !== confirm) return setError(t.errPasswordMatch);
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email.trim(), code.trim(), password);
      // Dang nhap thanh cong -> layout goc tu chuyen sang cac tab
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  }

  const backLink = (
    <View style={{ flexDirection: "row", justifyContent: "center" }}>
      <Link href="/login" replace>
        <Txt weight="semibold" color={colors.primary}>{t.backToLogin}</Txt>
      </Link>
    </View>
  );

  if (step === "email") {
    return (
      <AuthShell title={t.forgotTitle} subtitle={t.forgotSub}>
        <Field
          label={t.email}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onSubmitEditing={sendCode}
        />
        <FormError message={error} />
        <PrimaryButton label={loading ? t.sending : t.sendCode} onPress={sendCode} loading={loading} />
        {backLink}
      </AuthShell>
    );
  }

  return (
    <AuthShell title={t.forgotTitle} subtitle={`${t.codeSentTo} ${email.trim()}. ${t.codeCheckSpam}`}>
      <Field
        label={t.code}
        value={code}
        onChangeText={(v) => setCode(v.replace(/\D/g, "").slice(0, 6))}
        keyboardType="number-pad"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        maxLength={6}
      />
      <Field label={t.newPassword} value={password} onChangeText={setPassword} secure autoComplete="new-password" hint={t.passwordHint} />
      <Field label={t.confirmNewPassword} value={confirm} onChangeText={setConfirm} secure autoComplete="new-password" onSubmitEditing={submitReset} />
      <FormError message={error} />
      <PrimaryButton label={loading ? t.resetting : t.resetPassword} onPress={submitReset} loading={loading} />

      <View style={{ flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <Pressable
          onPress={sendCode}
          disabled={cooldown > 0 || loading}
          accessibilityRole="button"
          accessibilityState={{ disabled: cooldown > 0 || loading }}
          hitSlop={8}
        >
          <Txt weight="semibold" color={cooldown > 0 ? colors.muted : colors.primary}>
            {cooldown > 0 ? `${t.resendIn} ${cooldown}${t.seconds}` : t.resendCode}
          </Txt>
        </Pressable>
        <Pressable
          onPress={() => {
            setStep("email");
            setCode("");
            setError(null);
          }}
          accessibilityRole="button"
          hitSlop={8}
        >
          <Txt weight="semibold" color={colors.primary}>{t.useOtherEmail}</Txt>
        </Pressable>
      </View>
      {backLink}
    </AuthShell>
  );
}
