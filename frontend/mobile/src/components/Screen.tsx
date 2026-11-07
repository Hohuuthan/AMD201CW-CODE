// Khung man hinh: nen xanh nhat, tranh tai tho/thanh trang thai.
// Tren man hinh rong, noi dung duoc gioi han be ngang va canh giua cho de doc.
import type { ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsWide } from "../hooks/useIsWide";
import { colors } from "../theme";

export function Screen({ children, maxWidth = 720 }: { children: ReactNode; maxWidth?: number | null }) {
  const wide = useIsWide();
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={[
          { flex: 1 },
          wide && maxWidth ? { width: "100%", maxWidth, alignSelf: "center", paddingTop: 12 } : null,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
