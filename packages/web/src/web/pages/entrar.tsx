import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { Brand } from "../components/logo";
import { authClient } from "../lib/auth";

type Mode = "entrar" | "criar";

const inputClass =
  "w-full rounded-2xl border border-border bg-paper px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.5v2.9h3.9c2.3-2.1 3.5-5.2 3.5-8.6z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-2.9c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3c2 3.9 6 6.5 10.6 6.5z" />
      <path fill="#FBBC05" d="M5.4 14.5c-.2-.7-.4-1.5-.4-2.5s.1-1.7.4-2.5v-3H1.4C.5 8 0 9.9 0 12s.5 4 1.4 5.5l4-3z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.5l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
    </svg>
  );
}

export default function SignIn() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<Mode>("entrar");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          ? "Não foi possível criar a conta. Verifique os dados (palavra-passe com pelo menos 8 caracteres) ou tente entrar."
          : "Email ou palavra-passe incorretos.",
      );
      return;
    }
    navigate("/app");
  };

  const google = async () => {
    setError(null);
    const result = await authClient.managedAuth.signIn({ provider: "google" });
    if (result.error && result.error.code !== "POPUP_CLOSED") {
      setError("Não foi possível entrar com Google. Tente novamente.");
      return;
    }
    if (!result.error) navigate("/app");
  };

  return (
    <div className="min-h-screen bg-paper text-foreground">
      <header className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-6">
        <Link href="/" aria-label="soma — página inicial">
          <Brand />
        </Link>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Página inicial
        </Link>
      </header>

      <main className="mx-auto grid max-w-[1000px] items-center gap-12 px-6 pb-24 pt-8 md:grid-cols-2 md:pt-16">
        <div>
          <h1 className="text-5xl font-light leading-[1.05] text-teal-900 md:text-6xl">
            {mode === "entrar" ? (
              <>
                Bem-vindo <em className="italic text-teal-700">de volta</em>.
              </>
            ) : (
              <>
                Comece a <em className="italic text-teal-700">somar</em>.
              </>
            )}
          </h1>
          <p className="mt-6 max-w-sm text-base text-muted-foreground">
            As contas da casa, da família e dos projetos, guardadas em segurança e sempre à mão.
          </p>
        </div>

        <div className="rounded-[32px] border border-border bg-white p-8 shadow-sm">
          <div className="mb-6 grid grid-cols-2 rounded-full bg-cream p-1 text-sm font-semibold">
            {(["entrar", "criar"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError(null);
                }}
                className={`rounded-full py-2 transition ${mode === m ? "bg-teal-900 text-cream" : "text-teal-900"}`}
              >
                {m === "entrar" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={google}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-paper px-6 py-3 text-sm font-semibold text-teal-900 transition hover:bg-cream"
          >
            <GoogleIcon /> Continuar com Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "criar" && (
              <input
                aria-label="Nome"
                required
                autoComplete="name"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            )}
            <input
              aria-label="Email"
              type="email"
              required
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <input
              aria-label="Palavra-passe"
              type="password"
              required
              minLength={8}
              autoComplete={mode === "criar" ? "new-password" : "current-password"}
              placeholder="Palavra-passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
            {error && (
              <p role="alert" className="rounded-2xl bg-clay/10 px-4 py-3 text-sm text-clay">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-teal-900 px-6 py-3 text-sm font-semibold text-cream transition hover:bg-teal-700 disabled:opacity-60"
            >
              {mode === "entrar" ? "Entrar" : "Criar conta"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
