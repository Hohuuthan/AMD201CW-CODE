// Cong tac bat/tat (Auto-watering)
import { useEffect, useRef } from "react";
import { Animated, Platform, Pressable } from "react-native";
import { colors } from "../theme";

interface Props {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

export function Toggle({ value, onChange, label }: Props) {
  const x = useRef(new Animated.Value(value ? 22 : 0)).current;

  useEffect(() => {
    Animated.timing(x, {
      toValue: value ? 22 : 0,
      duration: 200,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [value, x]);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      onPress={() => onChange(!value)}
      hitSlop={8}
      style={{
        width: 52,
        height: 30,
        borderRadius: 15,
        padding: 3,
        backgroundColor: value ? colors.primary : colors.track,
      }}
    >
      <Animated.View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: "#FFFFFF",
          transform: [{ translateX: x }],
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: 1 },
          elevation: 2,
        }}
      />
    </Pressable>
  );
}
