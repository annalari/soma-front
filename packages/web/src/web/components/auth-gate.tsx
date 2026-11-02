import { useEffect, useState, type ReactNode } from "react";
import { Redirect } from "wouter";
import { authClient } from "../lib/auth";

/** Finishes a returning managed sign-in once on load, then renders the app. */
export function AuthGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    void authClient.managedAuth.handleRedirect().finally(() => setReady(true));
  }, []);
  if (!ready) return null;
  return <>{children}</>;
}

/** Renders children only for a signed-in user; otherwise sends them to /entrar. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">A carregar…</div>;
  }
  if (!session) return <Redirect to="/entrar" />;
  return <>{children}</>;
}
