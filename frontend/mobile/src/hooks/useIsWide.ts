// Man hinh rong (may tinh, tablet ngang) -> dung bo cuc web dashboard
import { useWindowDimensions } from "react-native";

export const WIDE_BREAKPOINT = 900;

export function useIsWide() {
  const { width } = useWindowDimensions();
  return width >= WIDE_BREAKPOINT;
}
