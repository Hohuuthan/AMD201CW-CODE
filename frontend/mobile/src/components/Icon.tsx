// Bo icon net (stroke) dung trong mockup, ve bang react-native-svg
import { View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { colors } from "../theme";

export type IconName =
  | "leaf"
  | "sparkle"
  | "users"
  | "settings"
  | "bell"
  | "flame"
  | "sun"
  | "alert"
  | "drop"
  | "sheet"
  | "send"
  | "plus"
  | "check"
  | "heart"
  | "comment"
  | "globe"
  | "chip"
  | "lock"
  | "chevron"
  | "logout"
  | "plantPhoto"
  | "eye"
  | "eyeOff";

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 22, color = colors.text, fill = "none", strokeWidth = 2 }: Props) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill,
  };

  return (
    <View aria-hidden style={{ width: size, height: size }}>
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === "leaf" && (
        <>
          <Path {...common} d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z" />
          <Path {...common} d="M2 21c0-3 1.9-5.4 5.1-6" />
        </>
      )}
      {name === "sparkle" && (
        <>
          <Path {...common} d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
          <Path {...common} d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
        </>
      )}
      {name === "users" && (
        <>
          <Circle {...common} cx="9" cy="8" r="4" />
          <Path {...common} d="M2 21v-1a6 6 0 0 1 12 0v1" />
          <Path {...common} d="M16 4.1a4 4 0 0 1 0 7.8M22 21v-1a6 6 0 0 0-4-5.7" />
        </>
      )}
      {name === "settings" && (
        <>
          <Circle {...common} cx="12" cy="12" r="3" />
          <Path {...common} d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
        </>
      )}
      {name === "bell" && (
        <>
          <Path {...common} d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <Path {...common} d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </>
      )}
      {name === "flame" && (
        <Path
          d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-6 1-9.5z"
          fill={colors.sun}
          stroke="#E65100"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      )}
      {name === "sun" && (
        <>
          <Circle cx="12" cy="12" r="4.5" fill={colors.sunLine} stroke={colors.sun} strokeWidth={2} />
          <Path
            d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
            stroke={colors.sun}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </>
      )}
      {name === "alert" && (
        <>
          <Path {...common} d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          <Path {...common} d="M12 9v4M12 17h.01" />
        </>
      )}
      {name === "drop" && <Path {...common} d="M12 2.7s6 6.4 6 11.3a6 6 0 0 1-12 0c0-4.9 6-11.3 6-11.3z" />}
      {name === "sheet" && (
        <>
          <Rect {...common} x="3" y="3" width="18" height="18" rx="2" />
          <Path {...common} d="M3 9h18M3 15h18M9 3v18" />
        </>
      )}
      {name === "send" && (
        <>
          <Path {...common} d="M22 2 11 13" />
          <Path {...common} d="M22 2 15 22l-4-9-9-4z" />
        </>
      )}
      {name === "plus" && <Path {...common} d="M12 5v14M5 12h14" />}
      {name === "check" && <Path {...common} d="M20 6 9 17l-5-5" />}
      {name === "heart" && (
        <Path {...common} d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z" />
      )}
      {name === "comment" && <Path {...common} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />}
      {name === "globe" && (
        <>
          <Circle {...common} cx="12" cy="12" r="10" />
          <Path {...common} d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
        </>
      )}
      {name === "chip" && (
        <>
          <Rect {...common} x="5" y="5" width="14" height="14" rx="2" />
          <Rect {...common} x="9" y="9" width="6" height="6" />
          <Path {...common} d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
        </>
      )}
      {name === "lock" && (
        <>
          <Rect {...common} x="4" y="11" width="16" height="10" rx="2" />
          <Path {...common} d="M8 11V7a4 4 0 0 1 8 0v4" />
        </>
      )}
      {name === "chevron" && <Path {...common} d="m9 18 6-6-6-6" />}
      {name === "logout" && (
        <>
          <Path {...common} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <Path {...common} d="m16 17 5-5-5-5M21 12H9" />
        </>
      )}
      {name === "plantPhoto" && (
        <>
          <Path {...common} d="M7 20h10M10 20c5.5-2.5.8-6.4 3-10" />
          <Path {...common} d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
          <Path {...common} d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
        </>
      )}
      {name === "eye" && (
        <>
          <Path {...common} d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <Circle {...common} cx="12" cy="12" r="3" />
        </>
      )}
      {name === "eyeOff" && (
        <>
          <Path {...common} d="M9.9 4.2A10 10 0 0 1 12 4c6.5 0 10 8 10 8a17 17 0 0 1-2.2 3.2M6.6 6.6C3.6 8.6 2 12 2 12s3.5 8 10 8a9.7 9.7 0 0 0 5.4-1.6" />
          <Path {...common} d="M2 2l20 20M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </>
      )}
    </Svg>
    </View>
  );
}
