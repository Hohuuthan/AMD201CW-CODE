import { View, type ViewProps } from "react-native";
import { cardShadow, colors, radius } from "../theme";

// The trang bo goc 20, bong nhe - khoi giao dien chinh trong mockup
export function Card({ style, ...rest }: ViewProps) {
  return (
    <View
      {...rest}
      style={[{ backgroundColor: colors.card, borderRadius: radius.card, padding: 16, gap: 12 }, cardShadow, style]}
    />
  );
}
