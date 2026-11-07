// Text dung font Inter theo mockup: <Txt weight="semibold" size={16}>...</Txt>
import { Text, type TextProps, type TextStyle } from "react-native";
import { colors, fonts } from "../theme";

interface Props extends TextProps {
  size?: number;
  weight?: keyof typeof fonts;
  color?: string;
  align?: TextStyle["textAlign"];
}

export function Txt({ size = 14, weight = "regular", color = colors.text, align, style, ...rest }: Props) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: fonts[weight], fontSize: size, color, textAlign: align }, style]}
    />
  );
}
