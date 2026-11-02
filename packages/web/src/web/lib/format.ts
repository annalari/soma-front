export const CATEGORY_LABELS: Record<string, string> = {
  casa: "Casa",
  familia: "Família",
  projetos: "Projetos",
  "vida-real": "Vida real",
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  casa: "Organize as contas",
  familia: "Partilhe com quem importa",
  projetos: "Planeie juntos",
  "vida-real": "Sem complicação",
};

const eur = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });

export function formatEur(cents: number) {
  return eur.format(cents / 100);
}

/** "12,50" or "12.5" -> cents, or null when invalid. */
export function parseEurToCents(value: string): number | null {
  const n = Number(value.replace(/\s/g, "").replace(",", "."));
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100);
}

export function todayIso() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDatePt(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-PT", { day: "numeric", month: "short" });
}
