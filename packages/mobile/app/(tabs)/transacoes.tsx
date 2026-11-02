import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColors } from "../../hooks/use-colors";
import { Fonts } from "../../constants/theme";
import { useTransactions, useCreateTransaction, useRemoveTransaction } from "../../queries/transactions";
import {
  CATEGORY_KEYS,
  CATEGORY_LABELS,
  formatDatePt,
  formatEur,
  parseEurToCents,
  todayIso,
} from "../../lib/format";

export default function Transacoes() {
  const colors = useColors();
  const { data = [], isLoading } = useTransactions();
  const create = useCreateTransaction();
  const remove = useRemoveTransaction();

  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORY_KEYS)[number]>("casa");

  function submit() {
    const cents = parseEurToCents(amount);
    if (!cents || !description.trim()) {
      Alert.alert("Dados em falta", "Indique um valor e uma descrição.");
      return;
    }
    create.mutate(
      { amountCents: cents, description: description.trim(), type, category, occurredOn: todayIso() },
      {
        onSuccess: () => {
          setAmount("");
          setDescription("");
        },
      },
    );
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.foreground }]}>Transações</Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.segment, { backgroundColor: colors.secondary }]}>
            {(["expense", "income"] as const).map((t) => (
              <Pressable
                key={t}
                onPress={() => setType(t)}
                style={[styles.segmentItem, type === t && { backgroundColor: colors.teal900 }]}
              >
                <Text
                  style={{
                    fontFamily: Fonts.sansBold,
                    color: type === t ? colors.cream : colors.mutedForeground,
                  }}
                >
                  {t === "expense" ? "Saída" : "Entrada"}
                </Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            keyboardType="decimal-pad"
            placeholder="Valor (ex.: 42,50)"
            placeholderTextColor={colors.mutedForeground}
            value={amount}
            onChangeText={setAmount}
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
          />
          <TextInput
            placeholder="Descrição"
            placeholderTextColor={colors.mutedForeground}
            value={description}
            onChangeText={setDescription}
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
          />
          <View style={styles.chips}>
            {CATEGORY_KEYS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setCategory(c)}
                style={[
                  styles.chip,
                  { borderColor: colors.border },
                  category === c && { backgroundColor: colors.teal900, borderColor: colors.teal900 },
                ]}
              >
                <Text style={{ fontFamily: Fonts.sansMedium, color: category === c ? colors.cream : colors.foreground, fontSize: 13 }}>
                  {CATEGORY_LABELS[c]}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={submit}
            disabled={create.isPending}
            style={[styles.button, { backgroundColor: colors.teal700, opacity: create.isPending ? 0.6 : 1 }]}
          >
            <Text style={{ fontFamily: Fonts.sansBold, color: colors.cream }}>Guardar transação</Text>
          </Pressable>
        </View>

        <Text style={[styles.section, { color: colors.foreground }]}>Histórico</Text>
        {isLoading && <Text style={{ color: colors.mutedForeground }}>A carregar…</Text>}
        {data.map((t) => (
          <Pressable
            key={t.id}
            onLongPress={() =>
              Alert.alert("Apagar transação", t.description, [
                { text: "Cancelar", style: "cancel" },
                { text: "Apagar", style: "destructive", onPress: () => remove.mutate({ id: t.id }) },
              ])
            }
            style={[styles.row, { borderColor: colors.border }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.foreground }]} numberOfLines={1}>
                {t.description}
              </Text>
              <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>
                {CATEGORY_LABELS[t.category]} · {formatDatePt(t.occurredOn)}
              </Text>
            </View>
            <Text style={[styles.rowAmount, { color: t.type === "income" ? colors.teal700 : colors.foreground }]}>
              {t.type === "income" ? "+ " : "- "}
              {formatEur(t.amountCents)}
            </Text>
          </Pressable>
        ))}
        {!isLoading && data.length === 0 && (
          <Text style={{ color: colors.mutedForeground }}>Ainda não há transações.</Text>
        )}
        <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 8 }}>
          Mantenha premido uma transação para a apagar.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, gap: 12, paddingBottom: 48 },
  title: { fontFamily: Fonts.display, fontSize: 36 },
  card: { borderRadius: 24, borderWidth: StyleSheet.hairlineWidth, padding: 18, gap: 12 },
  segment: { flexDirection: "row", borderRadius: 999, padding: 4 },
  segmentItem: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 999 },
  input: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, fontFamily: Fonts.sans, fontSize: 15 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  button: { borderRadius: 999, paddingVertical: 14, alignItems: "center" },
  section: { fontFamily: Fonts.display, fontSize: 24, marginTop: 16 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, gap: 12 },
  rowTitle: { fontFamily: Fonts.sansBold, fontSize: 15 },
  rowSub: { fontFamily: Fonts.sans, fontSize: 12, marginTop: 2 },
  rowAmount: { fontFamily: Fonts.sansBold, fontSize: 15, fontVariant: ["tabular-nums"] },
});
