import { Platform } from "react-native";
import { createAuthClient } from "better-auth/react";
import { managedAuthExpoClient } from "@runablehq/managed-auth/native";
import Constants from "expo-constants";
import { tokenStore } from "./token";

// Platform-managed identity: never edit `expo.extra` or `expo.scheme` in app.json.
const extra = Constants.expoConfig?.extra ?? {};
const isWeb = Platform.OS === "web";

export const authClient = createAuthClient({
  baseURL: extra.apiUrl ?? process.env.EXPO_PUBLIC_API_URL,
  basePath: "/api/auth",
  fetchOptions: {
    ...(isWeb ? { credentials: "omit" as const } : {}),
    headers: isWeb ? {} : { "expo-origin": "mobile://" },
    auth: { type: "Bearer", token: () => tokenStore.getToken() },
    onSuccess(ctx) {
      const token = ctx.response.headers.get("set-auth-token");
      if (token) tokenStore.setToken(token);
    },
  },
  plugins: [
    managedAuthExpoClient({
      applicationId: extra.applicationId,
      issuer: extra.runableAuthIssuer,
      storage: tokenStore,
    }),
  ],
});
