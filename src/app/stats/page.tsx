import { AppShell } from "@/components/layout/app-shell";
import { MetricCard } from "@/components/ui/metric-card";

export const dynamic = "force-dynamic";

export default function StatsPage() {
  return (
    <AppShell title="내 통계" subtitle="상식 루틴의 흐름을 봅니다">
      <div className="space-y-4">
        <section className="grid grid-cols-2 gap-3">
          <MetricCard label="현재 streak" value="3일" helper="연속 풀이" />
          <MetricCard label="최장 streak" value="8일" helper="개인 최고" />
        </section>

        <section className="rounded-lg border border-app-line bg-white p-4 shadow-sm">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-app-muted">정답률</p>
              <p className="mt-1 text-4xl font-bold tracking-normal text-app-ink">78%</p>
            </div>
            <p className="pb-1 text-sm font-semibold text-app-muted">총 18문제</p>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full w-[78%] rounded-full bg-app-teal" />
          </div>
        </section>

        <section className="rounded-lg border border-app-line bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-app-muted">최근 카테고리</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["과학", "역사", "경제", "인물"].map((category) => (
              <span
                key={category}
                className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-semibold text-app-ink"
              >
                {category}
              </span>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
