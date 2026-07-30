import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { STATES, NATIONAL_TREND, withDerived, type DerivedRow } from "@/lib/waste-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "India Waste & Plastic Pollution Dashboard" },
      {
        name: "description",
        content:
          "Interactive state-wise view of India's municipal solid waste and plastic waste processing gaps, trends, and priority action recommendations.",
      },
      { property: "og:title", content: "India Waste & Plastic Pollution Dashboard" },
      {
        property: "og:description",
        content:
          "Which Indian states lag furthest on plastic waste processing — and where to prioritize smart-bin and MRF rollouts.",
      },
    ],
  }),
  component: Dashboard,
});

type SortKey = "gapTPD" | "gapPct" | "plasticGenTPD" | "mswProcPct";

function fmt(n: number, digits = 0) {
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function gapColor(gapPct: number) {
  // Higher gap = deeper terracotta; low gap = teal
  if (gapPct >= 70) return "var(--chart-1)";
  if (gapPct >= 50) return "oklch(0.62 0.18 45)";
  if (gapPct >= 30) return "var(--chart-3)";
  return "var(--chart-4)";
}

function Dashboard() {
  const [sortKey, setSortKey] = useState<SortKey>("gapTPD");
  const [selected, setSelected] = useState<string | null>(null);

  const rows: DerivedRow[] = useMemo(() => withDerived(STATES), []);

  const nationalPlasticGen = rows.reduce((s, r) => s + r.plasticGenTPD, 0);
  const nationalPlasticProc = rows.reduce((s, r) => s + r.plasticProcTPD, 0);
  const nationalGap = nationalPlasticGen - nationalPlasticProc;
  const nationalProcPct = (nationalPlasticProc / nationalPlasticGen) * 100;

  const sorted = useMemo(() => [...rows].sort((a, b) => b[sortKey] - a[sortKey]), [rows, sortKey]);

  const top3 = [...rows].sort((a, b) => b.gapTPD - a.gapTPD).slice(0, 3);
  const top3Share = (top3.reduce((s, r) => s + r.gapTPD, 0) / nationalGap) * 100;

  // Correlation urbanization vs processed %
  const corr = useMemo(
    () =>
      pearson(
        rows.map((r) => r.urbanPct),
        rows.map((r) => r.processedPct),
      ),
    [rows],
  );

  const focus = selected ? (rows.find((r) => r.state === selected) ?? null) : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <header className="border-b border-border/60 bg-gradient-to-br from-secondary via-background to-background">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              CPCB · Swachh Bharat Mission · 2016–2023
            </span>
          </div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            India's plastic waste gap,
            <span className="text-accent"> state by state</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Which Indian states are furthest behind on waste segregation and plastic waste
            processing targets — and what's driving the gap?
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 space-y-8">
        {/* KPI row */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi
            label="Plastic generated"
            value={`${fmt(nationalPlasticGen / 1000, 1)}K TPD`}
            hint="tonnes per day, 20 states"
          />
          <Kpi
            label="Plastic processed"
            value={`${fmt(nationalProcPct, 0)}%`}
            hint={`${fmt(nationalPlasticProc)} TPD recycled / co-processed`}
            tone="good"
          />
          <Kpi
            label="Unprocessed daily"
            value={`${fmt(nationalGap)} TPD`}
            hint="landfilled, littered or leaked"
            tone="bad"
          />
          <Kpi
            label="Top-3 states' share of gap"
            value={`${fmt(top3Share, 0)}%`}
            hint={top3.map((t) => t.state).join(" · ")}
            tone="bad"
          />
        </section>

        {/* Ranking bar chart */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle>State ranking — plastic waste processing gap</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Darker bars = larger unprocessed plastic load. Click a state to inspect it below.
              </p>
            </div>
            <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
              <SelectTrigger className="w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gapTPD">Unprocessed (TPD)</SelectItem>
                <SelectItem value="gapPct">Unprocessed (% of gen.)</SelectItem>
                <SelectItem value="plasticGenTPD">Total generated (TPD)</SelectItem>
                <SelectItem value="mswProcPct">MSW processed %</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[520px] w-full">
              <ResponsiveContainer>
                <BarChart
                  data={sorted}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="state"
                    width={120}
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                  />
                  <Tooltip content={<StateTooltip />} cursor={{ fill: "var(--muted)" }} />
                  <Bar
                    dataKey={sortKey}
                    radius={[0, 6, 6, 0]}
                    onClick={(d: DerivedRow) => setSelected(d.state)}
                  >
                    {sorted.map((r) => (
                      <Cell
                        key={r.state}
                        fill={gapColor(r.gapPct)}
                        opacity={selected && selected !== r.state ? 0.35 : 1}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Two-up: trend + scatter */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>National trend — generated vs. processed</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Plastic waste generation is outpacing processing capacity buildup.
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer>
                  <LineChart
                    data={NATIONAL_TREND}
                    margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="generated"
                      stroke="var(--chart-1)"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      name="Generated (TPD)"
                    />
                    <Line
                      type="monotone"
                      dataKey="processed"
                      stroke="var(--chart-2)"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      name="Processed (TPD)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What predicts a good processing rate?</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Urbanisation vs. plastic processed. Pearson r ={" "}
                <span className="font-medium text-foreground">{corr.toFixed(2)}</span> — moderately
                positive, but far from destiny.
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer>
                  <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      type="number"
                      dataKey="urbanPct"
                      name="Urban %"
                      unit="%"
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                    />
                    <YAxis
                      type="number"
                      dataKey="processedPct"
                      name="Processed %"
                      unit="%"
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                    />
                    <ZAxis type="number" dataKey="plasticGenTPD" range={[60, 400]} />
                    <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter data={rows} onClick={(d: DerivedRow) => setSelected(d.state)}>
                      {rows.map((r) => (
                        <Cell
                          key={r.state}
                          fill={gapColor(r.gapPct)}
                          style={{ cursor: "pointer" }}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Focus panel */}
        {focus && (
          <Card className="border-accent/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <div className="text-xs uppercase tracking-widest text-accent">State profile</div>
                <CardTitle className="mt-1">{focus.state}</CardTitle>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear ✕
              </button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                <Stat label="Plastic generated" value={`${fmt(focus.plasticGenTPD)} TPD`} />
                <Stat label="Plastic processed" value={`${fmt(focus.processedPct, 0)}%`} />
                <Stat label="MSW processed" value={`${focus.mswProcPct}%`} />
                <Stat label="Urban share" value={`${focus.urbanPct}%`} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        <Card className="bg-gradient-to-br from-secondary to-background">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-accent text-accent">
                Act
              </Badge>
              <CardTitle>Where to prioritise</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              <span className="font-semibold">{top3.map((t) => t.state).join(", ")}</span> alone
              account for <span className="font-semibold text-accent">{fmt(top3Share, 0)}%</span> of
              India's unprocessed plastic waste (~{fmt(top3.reduce((s, r) => s + r.gapTPD, 0))}{" "}
              TPD). A concentrated rollout here delivers the largest marginal reduction per rupee.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                <span className="text-foreground">IoT smart-bin + fill-level sensors</span> in
                Tier-2 cities of {top3[0].state} and {top3[1].state} to cut collection-truck trips
                and increase source segregation compliance.
              </li>
              <li>
                <span className="text-foreground">MRF (Material Recovery Facility) capacity</span>{" "}
                augmentation in low-processing states (Bihar, West Bengal, Assam &lt; 25%) — the
                bottleneck is downstream capacity, not collection.
              </li>
              <li>
                <span className="text-foreground">EPR enforcement</span> on FMCG producers in
                high-generation, low-urbanisation states where informal recyclers dominate.
              </li>
              <li>
                <span className="text-foreground">Edge-AI waste classifiers</span> on conveyor belts
                at existing MRFs to lift PET/HDPE recovery yield 15–25% without new capex.
              </li>
            </ul>
          </CardContent>
        </Card>

        <footer className="pt-4 pb-8 text-xs text-muted-foreground">
          Figures approximated from CPCB Annual Reports on Plastic Waste Management (2019–20 to
          2022–23) and Swachh Bharat Mission Urban dashboards. For illustrative analysis only.
        </footer>
      </main>
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "good" | "bad";
}) {
  const toneClass =
    tone === "bad"
      ? "text-[var(--chart-1)]"
      : tone === "good"
        ? "text-[var(--chart-4)]"
        : "text-foreground";
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className={`mt-2 text-3xl font-semibold tracking-tight ${toneClass}`}>{value}</div>
        {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function StateTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: DerivedRow }>;
}) {
  if (!active || !payload?.length) return null;
  const r = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-card p-3 text-xs shadow-lg">
      <div className="text-sm font-semibold">{r.state}</div>
      <div className="mt-2 space-y-0.5 text-muted-foreground">
        <div>
          Generated: <span className="text-foreground">{fmt(r.plasticGenTPD)} TPD</span>
        </div>
        <div>
          Processed:{" "}
          <span className="text-foreground">
            {fmt(r.plasticProcTPD)} TPD ({fmt(r.processedPct, 0)}%)
          </span>
        </div>
        <div>
          Gap: <span className="text-foreground">{fmt(r.gapTPD)} TPD</span>
        </div>
        <div>
          MSW processed: <span className="text-foreground">{r.mswProcPct}%</span>
        </div>
        <div>
          Urban: <span className="text-foreground">{r.urbanPct}%</span>
        </div>
      </div>
    </div>
  );
}

function ScatterTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: DerivedRow }>;
}) {
  if (!active || !payload?.length) return null;
  const r = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-card p-3 text-xs shadow-lg">
      <div className="text-sm font-semibold">{r.state}</div>
      <div className="text-muted-foreground">
        Urban {r.urbanPct}% · Processed {fmt(r.processedPct, 0)}%
      </div>
      <div className="text-muted-foreground">Generates {fmt(r.plasticGenTPD)} TPD</div>
    </div>
  );
}

function pearson(x: number[], y: number[]) {
  const n = x.length;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let num = 0,
    dx = 0,
    dy = 0;
  for (let i = 0; i < n; i++) {
    const a = x[i] - mx,
      b = y[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  return num / Math.sqrt(dx * dy);
}
