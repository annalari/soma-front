import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColors } from "../../hooks/use-colors";
import { Fonts } from "../../constants/theme";
import { useGoals, useCreateGoal, useAddSavings } from "../../queries/goals";
import { CATEGORY_KEYS, CATEGORY_LABELS, formatEur, parseEurToCents } from "../../lib/format";

type Goal = { id: number; name: string; category: string; targetCents: number; savedCents: number };

function GoalCard({ goal }: { goal: Goal }) {
  const colors = useColors();
  const add = useAddSavings();
  const [value, setValue] = useState("");
  const pct = Math.min(100, Math.round((goal.savedCents / goal.targetCents) * 100));

  return (
    <View style={[styles.card, { backgroundColor: colors.cream }]}>
      <Text style={[styles.kicker, { color: colors.mutedForeground }]}>{CATEGORY_LABELS[goal.category]}</Text>
      <Text style={[styles.goalName, { color: colors.teal900 }]}>{goal.name}</Text>
      <Text style={[styles.amounts, { color: colors.foreground }]}>
        {formatEur(goal.savedCents)} <Text style={{ color: colors.mutedForeground }}>de {formatEur(goal.targetCents)}</Text>
      </Text>
      <View style={[styles.track, { backgroundColor: "#FFFFFF" }]}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: colors.mint }]} />
      </View>
      <View style={styles.addRow}>
        <TextInput
          keyboardType="decimal-pad"
          placeholder="Adicionar valor"
          placeholderTextColor={colors.mutedForeground}
          value={value}
          onChangeText={setValue}
          style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: "#FFFFFF" }]}
        />
        <Pressable
          onPress={() => {
            const cents = parseEurToCents(value);
            if (!cents) return;
            add.mutate({ id: goal.id, amountCents: cents }, { onSuccess: () => setValue("") });
          }}
          style={[styles.addBtn, { backgroundColor: colors.teal900 }]}
        >
          <Text style={{ color: colors.cream, fontFamily: Fonts.sansBold, fontSize: 18 }}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function Objetivos() {
  const colors = useColors();
  const { data = [] } = useGoals();
  const create = useCreateGoal();
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORY_KEYS)[number]>("projetos");

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.foreground }]}>Objetivos</Text>

        {data.length === 0 && (
          <Text style={{ color: colors.mutedForeground }}>Crie o primeiro objetivo para começar a poupar em conjunto.</Text>
        )}
        {data.map((g) => (
          <GoalCard key={g.id} goal={g} />
        ))}

        <View style={[styles.newCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.section, { color: colors.foreground }]}>Novo objetivo</Text>
          <TextInput
            placeholder="Nome (ex.: Férias em família)"
            placeholderTextColor={colors.mutedForeground}
            value={name}
            onChangeText={setName}
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
          />
          <TextInput
            keyboardType="decimal-pad"
            placeholder="Meta (€)"
            placeholderTextColor={colors.mutedForeground}
            value={target}
            onChangeText={setTarget}
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
          />
          <View style={styles.chips}>
            {CATEGORY_KEYS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setCategory(c)}
                style={[styles.chip, { borderColor: colors.border }, category === c && { backgroundColor: colors.teal900, borderColor: colors.teal900 }]}
              >
                <Text style={{ fontFamily: Fonts.sansMedium, fontSize: 13, color: category === c ? colors.cream : colors.foreground }}>
                  {CATEGORY_LABELS[c]}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={() => {
              const cents = parseEurToCents(target);
              if (!name.trim() || !cents) return;
              create.mutate(
                { name: name.trim(), category, targetCents: cents },
                { onSuccess: () => { setName(""); setTarget(""); } },
              );
            }}
            style={[styles.button, { backgroundColor: colors.teal700 }]}
          >
            <Text style={{ fontFamily: Fonts.sansBold, color: colors.cream }}>Criar objetivo</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, gap: 16, paddingBottom: 48 },
  title: { fontFamily: Fonts.display, fontSize: 36 },
  section: { fontFamily: Fonts.display, fontSize: 24 },
  card: { borderRadius: 24, padding: 22, gap: 8 },
  kicker: { fontFamily: Fonts.sansMedium, fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2 },
  goalName: { fontFamily: Fonts.display, fontSize: 26 },
  amounts: { fontFamily: Fonts.sansMedium, fontSize: 14, fontVariant: ["tabular-nums"] },
  track: { height: 10, borderRadius: 999, overflow: "hidden", marginTop: 6 },
  fill: { height: 10, borderRadius: 999 },
  addRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  addBtn: { width: 48, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  newCard: { borderRadius: 24, borderWidth: StyleSheet.hairlineWidth, padding: 18, gap: 12 },
  input: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, fontFamily: Fonts.sans, fontSize: 15, flex: 1 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  button: { borderRadius: 999, paddingVertical: 14, alignItems: "center" },
});
