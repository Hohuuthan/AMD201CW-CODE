// Bieu do do am 24 gio (ban web dashboard): dai xanh = vung tot 30-70%, vach xanh duong = luc bom chay
import { View } from "react-native";
import Svg, { Line, Polyline, Rect } from "react-native-svg";
import { Txt } from "./Txt";
import { colors } from "../theme";

const W = 600;
const H = 160;

interface Props {
  values: number[];      // 24 gia tri, moi gio mot diem
  pumpHour?: number;     // gio bom chay (0-23)
}

export function MoistureChart({ values, pumpHour }: Props) {
  const step = W / (values.length - 1);
  const y = (v: number) => H - v * (H / 100);
  const points = values.map((v, i) => `${(i * step).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const min = Math.min(...values);
  const last = values[values.length - 1];

  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <Txt size={15} weight="semibold" accessibilityRole="header">Last 24 hours</Txt>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
            <View style={{ width: 14, height: 10, borderRadius: 3, backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.primaryLine }} />
            <Txt size={12} color={colors.muted}>Optimal 30–70%</Txt>
          </View>
          <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.water }} />
            <Txt size={12} color={colors.muted}>Pump ran</Txt>
          </View>
        </View>
      </View>

      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Soil moisture over the last 24 hours. Lowest ${min} percent, now ${last} percent.`}
        style={{ height: H }}
      >
        <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <Rect x="0" y={y(70)} width={W} height={y(30) - y(70)} fill={colors.primarySoft} />
          <Line x1="0" y1={H - 0.5} x2={W} y2={H - 0.5} stroke={colors.border} strokeWidth={1} />
          {pumpHour != null && (
            <Line x1={pumpHour * step} y1="0" x2={pumpHour * step} y2={H} stroke={colors.water} strokeWidth={1.5} strokeDasharray="4 4" />
          )}
          <Polyline points={points} fill="none" stroke={colors.primary} strokeWidth={2.5} strokeLinejoin="round" />
        </Svg>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {["00:00", "06:00", "12:00", "18:00", "Now"].map((l) => (
          <Txt key={l} size={11} color={colors.muted}>{l}</Txt>
        ))}
      </View>
    </View>
  );
}
