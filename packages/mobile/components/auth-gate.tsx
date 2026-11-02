import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { authClient } from "../lib/auth";

/** Sends signed-out users to /entrar and signed-in users away from it. */
export function AuthGate() {
  const { data: session, isPending } = authClient.useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    const onEntrar = segments[0] === "entrar";
    const onCallback = segments[0] === "auth";
    if (onCallback) return;
    if (!session && !onEntrar) router.replace("/entrar");
    if (session && onEntrar) router.replace("/");
  }, [session, isPending, segments, router]);

  return null;
}
