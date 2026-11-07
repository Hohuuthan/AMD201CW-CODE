// Vong do am + chau cay co mat cuoi/buon, giong mockup Home
import Svg, { Circle, G, Path, Rect } from "react-native-svg";
import { View } from "react-native";
import { colors } from "../theme";

const R = 96;
const CIRC = 2 * Math.PI * R; // 603.19

export type MoistureLevel = "dry" | "optimal" | "wet";

export function moistureLevel(m: number): MoistureLevel {
  if (m < 30) return "dry";
  if (m > 70) return "wet";
  return "optimal";
}

export function MoistureRing({ moisture, size = 220 }: { moisture: number; size?: number }) {
  const level = moistureLevel(moisture);
  const dry = level === "dry";
  const ringColor = dry ? colors.sun : level === "wet" ? colors.water : "#43A047";
  const leafColor = dry ? colors.leafDry : colors.leaf;
  const plantSize = (size * 140) / 220;

  return (
    <View
      style={{ width: size, height: size }}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Soil moisture ${moisture} percent`}
    >
      <Svg width={size} height={size} viewBox="0 0 220 220" style={{ position: "absolute" }}>
        <Circle cx="110" cy="110" r={R} fill="none" stroke={colors.ringTrack} strokeWidth={14} />
        <Circle
          cx="110"
          cy="110"
          r={R}
          fill="none"
          stroke={ringColor}
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={`${CIRC} ${CIRC}`}
          strokeDashoffset={CIRC * (1 - moisture / 100)}
          transform="rotate(-90 110 110)"
        />
      </Svg>

      <Svg
        width={plantSize}
        height={plantSize}
        viewBox="0 0 120 120"
        style={{ position: "absolute", left: (size * 40) / 220, top: (size * 30) / 220 }}
      >
        <Path d="M60 78 C60 62 60 50 60 38" stroke={colors.primary} strokeWidth={4} fill="none" strokeLinecap="round" />
        <G transform={dry ? "rotate(-28 60 62)" : undefined}>
          <Path d="M60 62 C44 60 34 50 32 38 C46 38 56 46 60 62 Z" fill={leafColor} />
        </G>
        <G transform={dry ? "rotate(28 60 54)" : undefined}>
          <Path d="M60 54 C76 52 86 42 88 30 C74 30 64 38 60 54 Z" fill={leafColor} />
        </G>
        <G transform={dry ? "rotate(22 60 40)" : undefined}>
          <Path d="M60 40 C52 32 52 20 60 10 C68 20 68 32 60 40 Z" fill={leafColor} />
        </G>
        <Rect x="30" y="70" width="60" height="10" rx="4" fill={colors.potRim} />
        <Path d="M34 80 H86 L80 112 H40 Z" fill={colors.pot} />
        <Circle cx="51" cy="92" r="2.6" fill={colors.face} />
        <Circle cx="69" cy="92" r="2.6" fill={colors.face} />
        <Path
          d={dry ? "M54 102 Q60 97 66 102" : "M54 99 Q60 104 66 99"}
          stroke={colors.face}
          strokeWidth={2.2}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}
