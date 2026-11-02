import { ArrowRight, Heart, House, Leaf, Users } from "lucide-react";
import { Brand, LogoMark } from "../components/logo";

const STEPS = [
  { n: "1", title: "Registe", text: "Lance entradas e despesas em segundos, com a área certa." },
  { n: "2", title: "Partilhe", text: "Veja as contas da casa e da família no mesmo lugar." },
  { n: "3", title: "Planeie", text: "Crie objetivos e acompanhe cada poupança até lá." },
];

const FEATURES = [
  {
    title: "Tudo na mesma conta.",
    text: "Casa, família, projetos e o dia a dia numa única vista. Sem folhas de cálculo espalhadas.",
    icon: House,
  },
  {
    title: "Ajustes sem drama.",
    text: "Mude categorias e objetivos quando a vida mudar. O orçamento acompanha-o.",
    icon: Users,
  },
  {
    title: "Para o longo prazo.",
    text: "Veja o progresso mês a mês e celebre cada meta atingida.",
    icon: Heart,
  },
];

const AREAS = [
  { title: "Casa", text: "Organize as contas da casa.", icon: House },
  { title: "Família", text: "Partilhe com quem importa.", icon: Users },
  { title: "Projetos", text: "Planeie as grandes coisas juntos.", icon: Heart },
  { title: "Vida real", text: "Sem complicação, no dia a dia.", icon: Leaf },
];

function Blob({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <path
        d="M52 22c26-14 88-8 112 18 22 24 16 80 4 108-14 32-72 44-104 30C36 164 14 120 20 84 24 52 30 32 52 22z"
        fill="#F1ECDF"
      />
    </svg>
  );
}

function StoreButtons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href="/app"
        className="inline-flex items-center gap-2 rounded-full bg-teal-900 px-6 py-3 text-sm font-semibold text-cream transition hover:bg-teal-700"
      >
        Começar gratuitamente <ArrowRight className="h-4 w-4" />
      </a>
      <a
        href="#como-funciona"
        className="inline-flex items-center gap-2 rounded-full border border-teal-900/20 px-6 py-3 text-sm font-semibold text-teal-900 transition hover:bg-teal-900/5"
      >
        Ver como funciona
      </a>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px] rounded-[44px] bg-teal-900 p-3 shadow-2xl shadow-teal-900/30">
      <div className="rounded-[34px] bg-paper p-5">
        <div className="mx-auto mb-5 h-5 w-24 rounded-full bg-teal-900" />
        <p className="text-xs text-muted-foreground">Saldo do mês</p>
        <p className="tabular font-display text-4xl text-teal-900">+ 1 240,00 €</p>
        <div className="mt-5 space-y-3">
          {[
            ["Supermercado", "Casa", "- 86,40 €"],
            ["Escola das crianças", "Família", "- 145,00 €"],
            ["Salário", "Vida real", "+ 1 800,00 €"],
          ].map(([a, b, c]) => (
            <div key={a} className="flex items-center justify-between rounded-2xl bg-card p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{a}</p>
                <p className="text-xs text-muted-foreground">{b}</p>
              </div>
              <p className="tabular text-sm font-semibold text-teal-700">{c}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl bg-teal-900 p-4 text-cream">
          <p className="text-xs opacity-80">Férias em família</p>
          <div className="mt-2 h-2 rounded-full bg-cream/20">
            <div className="h-2 w-[64%] rounded-full bg-mint" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper text-foreground">
      <header className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-6">
        <Brand />
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#como-funciona" className="hover:text-foreground">Como funciona</a>
          <a href="#areas" className="hover:text-foreground">Áreas</a>
          <a href="/app" className="rounded-full bg-teal-900 px-4 py-2 font-semibold text-cream">
            Abrir a app
          </a>
        </nav>
      </header>

      <section className="mx-auto grid max-w-[1120px] items-center gap-16 px-6 pb-32 pt-12 md:grid-cols-2 md:pt-20">
        <div>
          <h1 className="text-5xl font-light leading-[1.02] text-teal-900 md:text-7xl">
            Tudo a <em className="italic text-teal-700">somar</em>,
            <br /> em conjunto.
          </h1>
          <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
            As finanças da sua vida organizadas com quem importa. Contas da casa, despesas da família e
            os projetos que querem fazer juntos, num só sítio.
          </p>
          <div className="mt-10">
            <StoreButtons />
          </div>
        </div>
        <div className="relative">
          <Blob className="absolute -right-10 -top-10 h-80 w-80" />
          <Blob className="absolute -bottom-8 -left-12 h-40 w-40 opacity-70" />
          <div className="relative">
            <PhoneMockup />
          </div>
        </div>
      </section>

      <section id="como-funciona" className="bg-teal-900 text-cream">
        <div className="mx-auto max-w-[1120px] rounded-[32px] px-6 py-24 md:px-16">
          <p className="max-w-md text-lg text-cream/80">
            A soma é a única app pensada para o orçamento de quem vive em família.
          </p>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="font-display text-7xl font-light text-mint">{s.n}.</p>
                <h3 className="mt-4 text-3xl font-light">{s.title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/75">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 py-40">
        <p className="text-center text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Porque é diferente
        </p>
        <div className="mt-20 space-y-40">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`grid items-center gap-16 md:grid-cols-2 ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}
              >
                <div>
                  <h2 className="text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl">
                    {f.title}
                  </h2>
                  <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                </div>
                <div className="relative mx-auto grid h-72 w-72 place-items-center">
                  <Blob className="absolute inset-0 h-full w-full" />
                  <Icon className="relative h-24 w-24 text-teal-900" strokeWidth={1.2} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="areas" className="mx-auto max-w-[1120px] px-6 pb-40">
        <h2 className="max-w-lg text-4xl font-light leading-tight text-teal-900 md:text-5xl">
          Quatro áreas da vida, um só orçamento.
        </h2>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {AREAS.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.title} className="rounded-[24px] bg-cream p-7">
                <Icon className="h-9 w-9 text-teal-900" strokeWidth={1.4} />
                <h3 className="mt-10 text-xl font-semibold text-teal-900">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pb-32">
        <div className="flex flex-col items-start justify-between gap-10 rounded-[32px] bg-teal-900 px-10 py-20 text-cream md:flex-row md:items-center md:px-16">
          <h2 className="max-w-md text-4xl font-light leading-tight md:text-5xl">
            Comece a somar hoje.
          </h2>
          <StoreButtons />
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-6 px-6 py-12 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <LogoMark className="h-8 w-8 rounded-full bg-teal-900 object-contain p-1" />
            <span className="font-display text-xl text-teal-900">soma</span>
            <span>· As finanças da sua vida em conjunto.</span>
          </div>
          <p>© 2026 soma. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
