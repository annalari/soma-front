import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "../../hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transacoes"
        options={{
          title: "Transações",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "swap-horizontal" : "swap-horizontal-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="objetivos"
        options={{
          title: "Objetivos",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "flag" : "flag-outline"} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
