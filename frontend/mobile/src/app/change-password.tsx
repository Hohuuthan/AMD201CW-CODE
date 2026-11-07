// Man Doi mat khau (Settings -> Change password)
import { useState } from "react";
import { View } from "react-native";
import { Field, FormError, PrimaryButton } from "../components/AuthForm";
import { goBack, SubScreen } from "../components/SubScreen";
import { Card } from "../components/Card";
import { Icon } from "../components/Icon";
import { Txt } from "../components/Txt";
import { useAuth } from "../auth/AuthContext";
import { useLang } from "../i18n/LanguageContext";
import { colors } from "../theme";

export default function ChangePasswordScreen() {
  const { changePassword } = useAuth();
  const { t } = useLang();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    if (!current) return setError(t.errCurrentPassword);
    if (next.length < 8) return setError(t.errPasswordLength);
    if (next !== confirm) return setError(t.errPasswordMatch);

    setError(null);
    setSaving(true);
    try {
      await changePassword(current, next);
      setDone(true);
      setTimeout(goBack, 1200);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SubScreen title={t.changePasswordTitle} backLabel={t.back}>
      <Txt color={colors.muted}>{t.changePasswordSub}</Txt>
      <Card style={{ padding: 20, gap: 16 }}>
        <Field label={t.currentPassword} value={current} onChangeText={setCurrent} secure autoComplete="current-password" />
        <Field label={t.newPassword} value={next} onChangeText={setNext} secure autoComplete="new-password" hint={t.passwordHint} />
        <Field label={t.confirmNewPassword} value={confirm} onChangeText={setConfirm} secure autoComplete="new-password" onSubmitEditing={submit} />
        <FormError message={error} />
        {done ? (
          <View
            accessibilityLiveRegion="polite"
            style={{ height: 50, borderRadius: 14, backgroundColor: colors.primarySoft, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <Icon name="check" size={18} color={colors.primaryDark} strokeWidth={2.5} />
            <Txt weight="semibold" color={colors.primaryDark}>{t.passwordChanged}</Txt>
          </View>
        ) : (
          <PrimaryButton label={saving ? t.saving : t.savePassword} onPress={submit} loading={saving} />
        )}
      </Card>
    </SubScreen>
  );
}
