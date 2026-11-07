// Thanh dieu huong:
// - Dien thoai: 4 tab duoi day (giong mockup Mobile)
// - Man hinh rong: thanh doc ben trai (giong mockup Web Dashboard)
import { Tabs } from "expo-router/js-tabs";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, type IconName } from "../../components/Icon";
import { Txt } from "../../components/Txt";
import { useIsWide } from "../../hooks/useIsWide";
import { useLang } from "../../i18n/LanguageContext";
import { colors } from "../../theme";

const ICONS: Record<string, IconName> = {
  index: "leaf",
  ai: "sparkle",
  community: "users",
  settings: "settings",
};

export default function TabsLayout() {
  const { t } = useLang();
  const insets = useSafeAreaInsets();
  const wide = useIsWide();
  const labels: Record<string, string> = {
    index: t.navGarden,
    ai: t.navAi,
    community: t.navCommunity,
    settings: t.navSettings,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarPosition: wide ? "left" : "bottom",
      }}
      tabBar={({ state, navigateToTab }) => {
        const items = state.routes.map((route, i) => {
          const active = state.index === i;
          const color = active ? (wide ? colors.primaryDark : colors.primary) : colors.muted;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={labels[route.name]}
              onPress={() => {
                if (!active) navigateToTab(route.key);
              }}
              style={
                wide
                  ? {
                      alignItems: "center",
                      gap: 6,
                      paddingVertical: 10,
                      paddingHorizontal: 4,
                      borderRadius: 14,
                      backgroundColor: active ? colors.primarySoft : "transparent",
                    }
                  : { alignItems: "center", gap: 4, minWidth: 64, paddingVertical: 6 }
              }
            >
              <View
                style={
                  wide
                    ? null
                    : {
                        paddingVertical: 4,
                        paddingHorizontal: 16,
                        borderRadius: 999,
                        backgroundColor: active ? colors.primarySoft : "transparent",
                      }
                }
              >
                <Icon name={ICONS[route.name]} color={color} />
              </View>
              <Txt size={12} weight={active ? "semibold" : "medium"} color={color}>
                {labels[route.name]}
              </Txt>
            </Pressable>
          );
        });

        if (wide) {
          return (
            <View
              accessibilityRole="tablist"
              style={{
                width: 96,
                paddingVertical: 20,
                paddingHorizontal: 10,
                gap: 24,
                backgroundColor: "#FFFFFF",
                borderRightWidth: 1,
                borderRightColor: colors.divider,
              }}
            >
              <View style={{ alignItems: "center" }}>
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
              </View>
              <View style={{ gap: 8 }}>{items}</View>
            </View>
          );
        }

        return (
          <View
            accessibilityRole="tablist"
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              height: 76 + insets.bottom,
              paddingBottom: insets.bottom,
              paddingHorizontal: 8,
              backgroundColor: "#FFFFFF",
              borderTopWidth: 1,
              borderTopColor: colors.divider,
            }}
          >
            {items}
          </View>
        );
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="ai" />
      <Tabs.Screen name="community" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
