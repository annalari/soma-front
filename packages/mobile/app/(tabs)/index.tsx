import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "../../lib/auth";
import { tokenStore } from "../../lib/token";
import { useColors } from "../../hooks/use-colors";
import { Fonts } from "../../constants/theme";
import { useTransactions } from "../../queries/transactions";
import { CATEGORY_LABELS, formatDatePt, formatEur, todayIso } from "../../lib/format";

export default function Inicio() {
  const colors = useColors();
  const { data = [] } = useTransactions();
  const router = useRouter();
  const queryClient = useQueryClient();
  const signOut = async () => {
    await authClient.signOut().catch(() => {});
    tokenStore.clearToken();
    queryClient.clear();
    router.replace("/entrar");
  };
  const month = todayIso().slice(0, 7);
  const monthly = data.filter((t) => t.occurredOn.startsWith(month));
  const income = monthly.filter((t) => t.type === "income").reduce((s, t) => s + t.amountCents, 0);
  const expense = monthly.filter((t) => t.type === "expense").reduce((s, t) => s + t.amountCents, 0);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Image source={require("../../assets/logo-mark.png")} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.wordmark, { color: colors.foreground }]}>soma</Text>
          <Pressable onPress={signOut} style={styles.signOut} accessibilityRole="button" accessibilityLabel="Sair">
            <Text style={{ color: colors.mutedForeground, fontFamily: Fonts.sansBold }}>Sair</Text>
          </Pressable>
        </View>

        <Text style={[styles.kicker, { color: colors.mutedForeground }]}>Saldo do mês</Text>
        <View style={[styles.hero, { backgroundColor: colors.teal900 }]}>
          <Text style={[styles.heroValue, { color: colors.cream }]}>{formatEur(income - expense)}</Text>
          <View style={styles.heroRow}>
            <View style={styles.heroStat}>
              <Text style={[styles.heroLabel, { color: colors.cream }]}>Entradas</Text>
              <Text style={[styles.heroNumber, { color: colors.mint }]}>{formatEur(income)}</Text>
            </View>
            <View style={styles.heroStat}>
              <Text style={[styles.heroLabel, { color: colors.cream }]}>Saídas</Text>
              <Text style={[styles.heroNumber, { color: colors.cream }]}>{formatEur(expense)}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.section, { color: colors.foreground }]}>Recentes</Text>
        {data.length === 0 && (
          <Text style={{ color: colors.mutedForeground, fontFamily: Fonts.sans }}>
            Ainda não há transações. Adicione a primeira em Transações.
          </Text>
        )}
        {data.slice(0, 6).map((t) => (
          <View key={t.id} style={[styles.row, { borderColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.foreground }]} numberOfLines={1}>
                {t.description}
              </Text>
              <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>
                {CATEGORY_LABELS[t.category]} · {formatDatePt(t.occurredOn)}
              </Text>
            </View>
            <Text
              style={[
                styles.rowAmount,
                { color: t.type === "income" ? colors.teal700 : colors.foreground },
              ]}
            >
              {t.type === "income" ? "+ " : "- "}
              {formatEur(t.amountCents)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, gap: 12, paddingBottom: 48 },
  header: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  logo: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#03444A" },
  wordmark: { fontFamily: Fonts.display, fontSize: 26, flex: 1 },
  signOut: { paddingVertical: 6, paddingHorizontal: 10 },
  kicker: { fontFamily: Fonts.sansMedium, fontSize: 13 },
  hero: { borderRadius: 28, padding: 24, gap: 20 },
  heroValue: { fontFamily: Fonts.displayLight, fontSize: 44, fontVariant: ["tabular-nums"] },
  heroRow: { flexDirection: "row", gap: 12 },
  heroStat: { flex: 1, backgroundColor: "rgba(241,236,223,0.1)", borderRadius: 16, padding: 14 },
  heroLabel: { fontFamily: Fonts.sans, fontSize: 12, opacity: 0.8 },
  heroNumber: { fontFamily: Fonts.sansBold, fontSize: 16, marginTop: 4, fontVariant: ["tabular-nums"] },
  section: { fontFamily: Fonts.display, fontSize: 26, marginTop: 20 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, gap: 12 },
  rowTitle: { fontFamily: Fonts.sansBold, fontSize: 15 },
  rowSub: { fontFamily: Fonts.sans, fontSize: 12, marginTop: 2 },
  rowAmount: { fontFamily: Fonts.sansBold, fontSize: 15, fontVariant: ["tabular-nums"] },
});
