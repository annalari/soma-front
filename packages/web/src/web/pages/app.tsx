import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Brand } from "../components/logo";
import { authClient } from "../lib/auth";
import { useTransactions, useCreateTransaction, useRemoveTransaction } from "../queries/transactions";
import { useGoals, useCreateGoal, useAddSavings } from "../queries/goals";
import {
  CATEGORY_LABELS,
  formatDatePt,
  formatEur,
  parseEurToCents,
  todayIso,
} from "../lib/format";

const CATEGORY_KEYS = ["casa", "familia", "projetos", "vida-real"] as const;
type Filter = "todas" | (typeof CATEGORY_KEYS)[number];

const inputClass =
  "w-full rounded-2xl border border-border bg-paper px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-[24px] border border-border bg-card p-6 ${className}`}>{children}</section>;
}

function SummaryPanel({ income, expense }: { income: number; expense: number }) {
  const balance = income - expense;
  return (
    <div className="rounded-[28px] bg-teal-900 p-8 text-cream">
      <p className="text-sm opacity-80">Saldo do mês</p>
      <p className="tabular mt-2 font-display text-5xl font-light">{formatEur(balance)}</p>
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-cream/10 p-4">
          <p className="text-xs opacity-75">Entradas</p>
          <p className="tabular mt-1 text-lg font-semibold text-mint">{formatEur(income)}</p>
        </div>
        <div className="rounded-2xl bg-cream/10 p-4">
          <p className="text-xs opacity-75">Saídas</p>
          <p className="tabular mt-1 text-lg font-semibold text-cream">{formatEur(expense)}</p>
        </div>
      </div>
    </div>
  );
}

function TransactionForm() {
  const create = useCreateTransaction();
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORY_KEYS)[number]>("casa");
  const [date, setDate] = useState(todayIso());
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const cents = parseEurToCents(amount);
    if (!cents) return setError("Indique um valor válido.");
    if (!description.trim()) return setError("Escreva uma descrição.");
    setError(null);
    create.mutate(
      { amountCents: cents, description: description.trim(), type, category, occurredOn: date },
      {
        onSuccess: () => {
          setAmount("");
          setDescription("");
        },
      },
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 rounded-full bg-secondary p-1 text-sm font-semibold">
        {(["expense", "income"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`rounded-full py-2 transition ${type === t ? "bg-teal-900 text-cream" : "text-muted-foreground"}`}
          >
            {t === "expense" ? "Saída" : "Entrada"}
          </button>
        ))}
      </div>
      <input
        aria-label="Valor"
        inputMode="decimal"
        placeholder="Valor (ex.: 42,50)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={`${inputClass} tabular text-lg`}
      />
      <input
        aria-label="Descrição"
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={inputClass}
      />
      <div className="grid grid-cols-2 gap-3">
        <select aria-label="Categoria" value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className={inputClass}>
          {CATEGORY_KEYS.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
        <input aria-label="Data" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={create.isPending}
        className="w-full rounded-full bg-teal-700 py-3 text-sm font-semibold text-cream transition hover:bg-teal-900 disabled:opacity-60"
      >
        {create.isPending ? "A guardar…" : "Guardar transação"}
      </button>
    </form>
  );
}

function TransactionList() {
  const { data = [], isLoading } = useTransactions();
  const remove = useRemoveTransaction();
  const [filter, setFilter] = useState<Filter>("todas");
  const rows = useMemo(
    () => (filter === "todas" ? data : data.filter((t) => t.category === filter)),
    [data, filter],
  );

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-light text-teal-900">Transações</h2>
        <div className="flex flex-wrap gap-2">
          {(["todas", ...CATEGORY_KEYS] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                filter === f ? "bg-teal-900 text-cream" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "todas" ? "Todas" : CATEGORY_LABELS[f]}
            </button>
          ))}
        </div>
      </div>
      <ul className="mt-6 divide-y divide-border">
        {isLoading && <li className="py-6 text-sm text-muted-foreground">A carregar…</li>}
        {!isLoading && rows.length === 0 && (
          <li className="py-10 text-center text-sm text-muted-foreground">
            Ainda não há transações. Adicione a primeira ao lado.
          </li>
        )}
        {rows.map((t) => (
          <li key={t.id} className="group flex items-center justify-between gap-4 py-4">
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{t.description}</p>
              <p className="text-xs text-muted-foreground">
                {CATEGORY_LABELS[t.category]} · {formatDatePt(t.occurredOn)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className={`tabular font-semibold ${t.type === "income" ? "text-teal-700" : "text-foreground"}`}>
                {t.type === "income" ? "+ " : "- "}
                {formatEur(t.amountCents)}
              </p>
              <button
                aria-label="Apagar transação"
                onClick={() => remove.mutate({ id: t.id })}
                className="rounded-full p-2 text-muted-foreground opacity-0 transition hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function GoalCard({ goal }: { goal: { id: number; name: string; category: string; targetCents: number; savedCents: number } }) {
  const add = useAddSavings();
  const [value, setValue] = useState("");
  const pct = Math.min(100, Math.round((goal.savedCents / goal.targetCents) * 100));
  return (
    <div className="flex flex-col rounded-[24px] bg-cream p-6">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{CATEGORY_LABELS[goal.category]}</p>
      <h3 className="mt-2 font-display text-2xl text-teal-900">{goal.name}</h3>
      <p className="tabular mt-3 text-sm text-foreground">
        {formatEur(goal.savedCents)} <span className="text-muted-foreground">de {formatEur(goal.targetCents)}</span>
      </p>
      <div className="mt-3 h-2.5 rounded-full bg-white">
        <div className="h-2.5 rounded-full bg-mint transition-all" style={{ width: `${pct}%` }} />
      </div>
      <form
        className="mt-5 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const cents = parseEurToCents(value);
          if (!cents) return;
          add.mutate({ id: goal.id, amountCents: cents }, { onSuccess: () => setValue("") });
        }}
      >
        <input
          aria-label="Adicionar valor"
          inputMode="decimal"
          placeholder="Adicionar valor"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`${inputClass} py-2`}
        />
        <button className="rounded-full bg-teal-900 px-4 text-sm font-semibold text-cream">+</button>
      </form>
    </div>
  );
}

function GoalsSection() {
  const { data = [] } = useGoals();
  const create = useCreateGoal();
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORY_KEYS)[number]>("projetos");

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="grid gap-6 sm:grid-cols-2">
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground">Crie o primeiro objetivo para começar a poupar em conjunto.</p>
        )}
        {data.map((g) => (
          <GoalCard key={g.id} goal={g} />
        ))}
      </div>
      <Card>
        <h2 className="text-2xl font-light text-teal-900">Novo objetivo</h2>
        <form
          className="mt-5 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const cents = parseEurToCents(target);
            if (!name.trim() || !cents) return;
            create.mutate(
              { name: name.trim(), category, targetCents: cents },
              { onSuccess: () => { setName(""); setTarget(""); } },
            );
          }}
        >
          <input aria-label="Nome do objetivo" placeholder="Nome (ex.: Férias em família)" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          <input aria-label="Meta" inputMode="decimal" placeholder="Meta (€)" value={target} onChange={(e) => setTarget(e.target.value)} className={inputClass} />
          <select aria-label="Categoria" value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className={inputClass}>
            {CATEGORY_KEYS.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
          <button className="w-full rounded-full bg-teal-700 py-3 text-sm font-semibold text-cream hover:bg-teal-900">
            Criar objetivo
          </button>
        </form>
      </Card>
    </div>
  );
}

function SignOutButton() {
  const [, navigate] = useLocation();
  const qc = useQueryClient();
  const { data: session } = authClient.useSession();
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        qc.clear();
        navigate("/entrar");
      }}
      className="hover:text-foreground"
    >
      Sair{session?.user?.name ? ` (${session.user.name.split(" ")[0]})` : ""}
    </button>
  );
}

export default function Dashboard() {
  const { data: transactions = [] } = useTransactions();
  const month = todayIso().slice(0, 7);
  const monthly = transactions.filter((t) => t.occurredOn.startsWith(month));
  const income = monthly.filter((t) => t.type === "income").reduce((s, t) => s + t.amountCents, 0);
  const expense = monthly.filter((t) => t.type === "expense").reduce((s, t) => s + t.amountCents, 0);

  return (
    <div className="min-h-screen bg-paper">
      <header className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-6">
        <Brand />
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ← Página inicial
          </Link>
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-6 pb-24">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Painel</p>
          <h1 className="mt-2 text-5xl font-light text-teal-900 md:text-6xl">As suas finanças, em conjunto.</h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <SummaryPanel income={income} expense={expense} />
            <TransactionList />
          </div>
          <div className="space-y-6">
            <Card>
              <h2 className="mb-5 text-2xl font-light text-teal-900">Nova transação</h2>
              <TransactionForm />
            </Card>
          </div>
        </div>
        <div className="mt-16">
          <h2 className="text-4xl font-light text-teal-900">Objetivos</h2>
          <GoalsSection />
        </div>
      </main>
    </div>
  );
}
