import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// One bearer store shared by email/password and managed (Google) sign-in.
const KEY = "soma.bearer";
const isWeb = Platform.OS === "web";

function setToken(token: string) {
  try {
    if (isWeb) globalThis.localStorage?.setItem(KEY, token);
    else SecureStore.setItem(KEY, token);
  } catch {}
}

export const tokenStore = {
  getToken(): string {
    try {
      if (isWeb) return globalThis.localStorage?.getItem(KEY) ?? "";
      return SecureStore.getItem(KEY) ?? "";
    } catch {
      return "";
    }
  },
  setToken,
  clearToken() {
    setToken("");
  },
};
