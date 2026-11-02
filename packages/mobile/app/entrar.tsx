import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useColors } from "../hooks/use-colors";
import { Fonts } from "../constants/theme";
import { authClient } from "../lib/auth";

type Mode = "entrar" | "criar";

export default function Entrar() {
  const colors = useColors();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("entrar");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(null);
    setBusy(true);
    const result =
      mode === "criar"
        ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password })
        : await authClient.signIn.email({ email: email.trim(), password });
    setBusy(false);
    if (result.error) {
      setError(
        mode === "criar"
          ? "Não foi possível criar a conta. A palavra-passe tem de ter pelo menos 8 caracteres."
          : "Email ou palavra-passe incorretos.",
      );
      return;
    }
    router.replace("/");
  };

  const google = async () => {
    setError(null);
    setBusy(true);
    const result = await authClient.managedAuth.signIn({ provider: "google" });
    setBusy(false);
    if (result.error) {
      if (result.error.code !== "AUTH_SESSION_DISMISSED") setError("Não foi possível entrar com Google.");
      return;
    }
    router.replace("/");
  };

  const input = [styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }];

  return (
    <SafeAreaView edges={["top", "left", "right", "bottom"]} style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.content}>
        <View style={styles.brand}>
          <Image source={require("../assets/logo-mark.png")} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.wordmark, { color: colors.foreground }]}>soma</Text>
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>
          {mode === "entrar" ? "Bem-vindo de volta." : "Comece a somar."}
        </Text>

        <View style={[styles.switch, { backgroundColor: colors.secondary }]}>
          {(["entrar", "criar"] as Mode[]).map((m) => (
            <Pressable
              key={m}
              onPress={() => {
                setMode(m);
                setError(null);
              }}
              style={[styles.switchItem, mode === m && { backgroundColor: colors.teal900 }]}
            >
              <Text style={{ color: mode === m ? colors.cream : colors.foreground, fontFamily: Fonts.sansBold }}>
                {m === "entrar" ? "Entrar" : "Criar conta"}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={google}
          disabled={busy}
          style={[styles.button, styles.googleButton, { borderColor: colors.border, backgroundColor: colors.card }]}
        >
          <Text style={[styles.buttonText, { color: colors.foreground }]}>Continuar com Google</Text>
        </Pressable>

        <Text style={[styles.or, { color: colors.mutedForeground }]}>ou</Text>

        {mode === "criar" && (
          <TextInput
            accessibilityLabel="Nome"
            placeholder="Nome"
            placeholderTextColor={colors.mutedForeground}
            autoComplete="name"
            value={name}
            onChangeText={setName}
            style={input}
          />
        )}
        <TextInput
          accessibilityLabel="Email"
          placeholder="Email"
          placeholderTextColor={colors.mutedForeground}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          style={input}
        />
        <TextInput
          accessibilityLabel="Palavra-passe"
          placeholder="Palavra-passe"
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry
          autoComplete={mode === "criar" ? "new-password" : "current-password"}
          value={password}
          onChangeText={setPassword}
          style={input}
        />

        {error && <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>}

        <Pressable
          onPress={submit}
          disabled={busy || !email || !password}
          style={[styles.button, { backgroundColor: colors.teal900, opacity: busy || !email || !password ? 0.5 : 1 }]}
        >
          <Text style={[styles.buttonText, { color: colors.cream }]}>
            {mode === "entrar" ? "Entrar" : "Criar conta"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 24, gap: 14, justifyContent: "center" },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#03444A" },
  wordmark: { fontFamily: Fonts.display, fontSize: 26 },
  title: { fontFamily: Fonts.displayLight, fontSize: 40, lineHeight: 44, marginTop: 24, marginBottom: 8 },
  switch: { flexDirection: "row", borderRadius: 999, padding: 4 },
  switchItem: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 999 },
  button: { borderRadius: 999, paddingVertical: 15, alignItems: "center" },
  googleButton: { borderWidth: 1 },
  buttonText: { fontFamily: Fonts.sansBold, fontSize: 15 },
  or: { fontFamily: Fonts.sans, textAlign: "center", fontSize: 12, textTransform: "uppercase", letterSpacing: 2 },
  input: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 13, fontFamily: Fonts.sans, fontSize: 15 },
  error: { fontFamily: Fonts.sans, fontSize: 13 },
});
