import { Redirect } from "expo-router";

// Deep-link landing for managed sign-in. Without it expo-router shows "Unmatched Route" on Android.
export default function AuthCallback() {
  return <Redirect href="/" />;
}
