import { ArrowRight, ArrowUpRight, Check, TerminalWindow } from "@phosphor-icons/react/dist/ssr";
import { HexMark } from "@/components/brand/hex-mark";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const phases = [
  {
    id: "00",
    time: "0:00–0:15",
    name: "Intake",
    gate: "Raw statement captured, constraints named",
    output: "00-problem-statement.md",
  },
  {
    id: "01",
    time: "0:15–0:55",
    name: "Explore",
    gate: "Users, jobs, alternatives, assumptions",
    output: "01-opportunity-map.md",
  },
  {
    id: "02",
    time: "0:55–1:20",
    name: "Edge cases",
    gate: "Failure matrix and abuse cases",
    output: "02-edge-cases.md",
  },
  {
    id: "03",
    time: "1:20–1:45",
    name: "Research",
    gate: "Prior art, APIs, datasets, sources",
    output: "03-research.md",
  },
  {
    id: "04",
    time: "1:45–2:15",
    name: "Enhance PS",
    gate: "Metrics, scope, acceptance criteria",
    output: "04-enhanced-problem-statement.md",
  },
  {
    id: "05",
    time: "2:15–3:00",
    name: "Solution design",
    gate: "Architecture, data, API, risks",
    output: "05-solution-design.md",
  },
  {
    id: "06",
    time: "3:00–3:30",
    name: "Visual direction",
    gate: "Design read, tokens, reference",
    output: "06-visual-direction.md",
  },
  {
    id: "07",
    time: "3:30–6:45",
    name: "Build",
    gate: "Golden path works end to end",
    output: "07-build-log.md",
  },
  {
    id: "08",
    time: "6:45–7:45",
    name: "Harden",
    gate: "Security, a11y, perf, scale checks",
    output: "08-hardening-report.md",
  },
  {
    id: "09",
    time: "7:45–8:45",
    name: "Final test",
    gate: "Full suite green, deployed smoke",
    output: "09-release-report.md",
  },
  {
    id: "10",
    time: "8:45–10:00",
    name: "Demo + pitch",
    gate: "Rehearsed twice, fallback ready",
    output: "10-demo-script.md",
  },
];

const facts = [
  { value: "10h", label: "Hard timebox" },
  { value: "11", label: "Phase gates" },
  { value: "1h", label: "Final test window" },
  { value: "1", label: "Golden path" },
];

const standards = [
  "Strict TypeScript, zero any",
  "Zod validation at every trust boundary",
  "Server-side RBAC on every workspace read and write",
  "Escalation guards and last-owner protection",
  "Empty, loading, error, and unauthorized states",
  "WCAG AA contrast and full keyboard paths",
  "Cursor pagination, indexes, and no N+1 queries",
  "Rate limits, idempotency, and audit logs on mutations",
  "Durable email outbox with escaped, tested templates",
  "CI green: format, lint, types, tests, build",
  "Seeded demo data and a one-command reset",
  "Deployed URL, health check, and rollback plan",
];

const quickstart = `npm install
npm run setup
npm run db:up
npm run db:push
npm run db:seed
npm run dev`;

export default function HomePage() {
  return (
    <div className="relative min-h-[100dvh] overflow-x-clip">
      <div aria-hidden="true" className="grid-field" />

      <header className="border-b border-line/80">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <a href="#main" className="group flex items-center gap-3">
            <HexMark className="size-7 text-brand" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted transition-colors group-hover:text-fg">
              Hexa / Designathon OS
            </span>
          </a>
          <div className="flex items-center gap-4">
            <nav
              aria-label="Primary"
              className="hidden items-center gap-6 text-sm text-muted md:flex"
            >
              <a href="#workflow" className="transition-colors hover:text-fg">
                Workflow
              </a>
              <a href="#principles" className="transition-colors hover:text-fg">
                Principles
              </a>
              <a href="#standards" className="transition-colors hover:text-fg">
                Standards
              </a>
            </nav>
            <Badge tone="brand" dot>
              Standby
            </Badge>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="mx-auto grid w-full max-w-[1200px] gap-12 px-5 pb-16 pt-16 sm:px-8 md:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="rise">
            <Badge tone="outline">Operating system v1.0</Badge>
            <h1 className="mt-6 max-w-[12ch] text-[clamp(3rem,7vw,5.75rem)] font-medium leading-[0.95] tracking-[-0.045em]">
              Ten hours. <span className="italic text-brand">No excuses.</span>
            </h1>
            <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-muted sm:text-lg">
              A phase-gated operating system that turns a raw problem statement into a deployed,
              demo-ready product.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <LinkButton href="#workflow">
                Open the workflow
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </LinkButton>
              <LinkButton href="#standards" variant="secondary">
                See the quality bar
              </LinkButton>
            </div>
          </div>

          <div className="rise rise-2">
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  Mission status
                </span>
                <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-brand">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                  Standby
                </span>
              </div>
              <dl className="divide-y divide-line">
                <div className="grid grid-cols-[6.5rem_1fr] gap-4 px-5 py-3.5">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    Input
                  </dt>
                  <dd className="text-sm">Problem statement</dd>
                </div>
                <div className="grid grid-cols-[6.5rem_1fr] gap-4 px-5 py-3.5">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    Next
                  </dt>
                  <dd className="font-mono text-xs text-fg">agent-prompts/MASTER-WORKFLOW.md</dd>
                </div>
                <div className="grid grid-cols-[6.5rem_1fr] gap-4 px-5 py-3.5">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    Artifacts
                  </dt>
                  <dd className="font-mono text-xs text-fg">docs/discovery/</dd>
                </div>
                <div className="grid grid-cols-[6.5rem_1fr] gap-4 px-5 py-3.5">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    Gate
                  </dt>
                  <dd className="text-sm">No product code before Phase 05</dd>
                </div>
              </dl>
              <div className="border-t border-line bg-surface-2 px-5 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  Start here
                </p>
                <p className="mt-1.5 font-mono text-xs text-brand">
                  Paste the brief, then run the master workflow.
                </p>
              </div>
            </Card>
          </div>
        </section>

        <section aria-label="Operating facts" className="border-y border-line bg-surface/40">
          <div className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-px bg-line md:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-canvas px-5 py-6 sm:px-8">
                <p className="font-mono text-2xl tracking-tight text-brand">{fact.value}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  {fact.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="workflow"
          className="mx-auto w-full max-w-[1200px] scroll-mt-8 px-5 py-20 sm:px-8 md:py-28"
        >
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-[52ch]">
              <h2 className="text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
                The 10-hour route
              </h2>
              <p className="mt-3 text-muted">
                Eleven gates. Every phase ends with an artifact, so the next hour never starts from
                a blank page.
              </p>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              Discovery → Design → Build → Prove
            </p>
          </div>

          <ol className="mt-10 divide-y divide-line border-y border-line">
            {phases.map((phase) => (
              <li
                key={phase.id}
                className="grid gap-3 py-5 transition-colors hover:bg-surface/60 sm:grid-cols-[2.5rem_7rem_1fr_auto] sm:items-baseline sm:gap-4 sm:px-2"
              >
                <span className="font-mono text-xs text-muted">{phase.id}</span>
                <span className="font-mono text-xs text-brand">{phase.time}</span>
                <div>
                  <p className="font-medium">{phase.name}</p>
                  <p className="mt-1 text-sm text-muted">{phase.gate}</p>
                </div>
                <span className="font-mono text-[11px] text-muted sm:text-right">
                  {phase.output}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section id="principles" className="scroll-mt-8 border-t border-line">
          <div className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 md:py-28">
            <div className="max-w-[52ch]">
              <h2 className="text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
                How the work gets done
              </h2>
              <p className="mt-3 text-muted">
                Four rules keep a ten-hour build from turning into a ten-hour demo.
              </p>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-12">
              <Card className="p-7 lg:col-span-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  01 / Discovery
                </p>
                <h3 className="mt-4 text-2xl font-medium tracking-[-0.02em]">
                  Explore before you build.
                </h3>
                <p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-muted">
                  The first 90 minutes belong to the problem, not the stack. Users, jobs,
                  alternatives, constraints, edge cases, prior art. Build starts only after the
                  enhanced problem statement is written.
                </p>
              </Card>

              <Card className="p-7 lg:col-span-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  02 / Evidence
                </p>
                <h3 className="mt-4 text-2xl font-medium tracking-[-0.02em]">
                  Evidence over vibes.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Every claim gets a source, a test, or a measured result. Anything unverifiable in
                  ten hours is an assumption, and assumptions go in the risk register.
                </p>
              </Card>

              <Card className="p-7 lg:col-span-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  03 / Production
                </p>
                <h3 className="mt-4 text-2xl font-medium tracking-[-0.02em]">
                  Production is a feature.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Auth, tenancy, validation, error states, observability, and a rollback path are
                  part of the product, not a stretch goal.
                </p>
              </Card>

              <Card className="border-brand bg-brand p-7 text-brand-ink lg:col-span-7">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-ink/70">
                      04 / Demo
                    </p>
                    <h3 className="mt-4 text-2xl font-medium tracking-[-0.02em]">
                      The demo is the product.
                    </h3>
                    <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-brand-ink/75">
                      One golden path, rehearsed twice, with a fallback recording. Judges remember
                      the story and the live moment, not the feature count.
                    </p>
                  </div>
                  <ArrowUpRight
                    size={28}
                    weight="bold"
                    aria-hidden="true"
                    className="mt-1 shrink-0"
                  />
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section id="standards" className="scroll-mt-8 border-t border-line bg-surface/40">
          <div className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 md:py-28">
            <div className="max-w-[52ch]">
              <h2 className="text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
                The quality bar
              </h2>
              <p className="mt-3 text-muted">
                If it is not on this list, it is not done. The release gate is mechanical, not a
                vibe check.
              </p>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
              <Card className="p-6 sm:p-8">
                <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {standards.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <Check
                        size={16}
                        weight="bold"
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-brand"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    Release gate
                  </p>
                  <h3 className="mt-3 text-xl font-medium tracking-[-0.02em]">
                    Last hour, no new features.
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    The final test window is protected. Run the full suite, smoke the deployed URL,
                    then rehearse the demo twice.
                  </p>
                </div>
                <div className="mt-6 space-y-2 border-t border-line pt-5 font-mono text-xs text-fg">
                  <p>
                    <span className="text-brand">$</span> npm run check
                  </p>
                  <p>
                    <span className="text-brand">$</span> npm run test:e2e
                  </p>
                  <p>
                    <span className="text-brand">$</span> npm run release:check
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section
          id="commands"
          className="mx-auto w-full max-w-[1200px] scroll-mt-8 px-5 py-20 sm:px-8 md:py-28"
        >
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
                From clone to running.
              </h2>
              <p className="mt-3 max-w-[42ch] text-muted">
                One command chain. Docker for the database, Prisma for the schema, seeded demo data
                for the walkthrough.
              </p>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                Full setup: docs/PREREQUISITES.md
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                Mailpit: localhost:8025
              </p>
            </div>

            <Card className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  <TerminalWindow size={14} aria-hidden="true" />
                  Fresh machine
                </span>
                <Badge tone="outline">6 steps</Badge>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7 text-fg">
                <code>{quickstart}</code>
              </pre>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-5 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-mono uppercase tracking-[0.16em]">Hexa Designathon OS</p>
          <p>Discovery first. Ship last. Test before you demo.</p>
        </div>
      </footer>
    </div>
  );
}
