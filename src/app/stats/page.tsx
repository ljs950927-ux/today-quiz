import { AnonymousSessionGuard } from "@/components/auth/anonymous-session-guard";
import { EmailRecordCta } from "@/components/auth/email-record-cta";
import { AppShell } from "@/components/layout/app-shell";
import { MetricCard } from "@/components/ui/metric-card";
import { getAnswerStats } from "@/features/stats/api";
import type { AnswerStatsSummary } from "@/types/stats";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const result = await getAnswerStats();

  return (
    <AppShell title="내 통계" subtitle="상식 루틴의 흐름을 봅니다">
      <div className="space-y-4">
        <AnonymousSessionGuard />
        {result.status === "error" ? (
          <StatsStateCard title="통계를 불러오지 못했습니다" message={result.message} />
        ) : null}

        {result.status === "success" ? <StatsContent stats={result.stats} /> : null}
        <EmailRecordCta />
      </div>
    </AppShell>
  );
}

function StatsContent({ stats }: { stats: AnswerStatsSummary }) {
  const hasAnswers = stats.totalAnswers > 0;

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-2 gap-3">
        <MetricCard
          label="현재 streak"
          value={`${stats.currentStreak}일`}
          helper="연속 풀이"
        />
        <MetricCard
          label="최장 streak"
          value={`${stats.longestStreak}일`}
          helper="개인 최고"
        />
      </section>

      <section className="rounded-lg border border-app-line bg-white p-4 shadow-sm">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-app-muted">정답률</p>
            <p className="mt-1 text-4xl font-bold tracking-normal text-app-ink">
              {stats.accuracyRate}%
            </p>
          </div>
          <p className="pb-1 text-sm font-semibold text-app-muted">
            총 {stats.totalAnswers}문제
          </p>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-app-teal"
            style={{ width: `${stats.accuracyRate}%` }}
          />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <MetricCard
          label="정답 수"
          value={`${stats.correctAnswers}개`}
          helper="맞힌 문제"
        />
        <MetricCard
          label="오답 수"
          value={`${stats.wrongAnswers}개`}
          helper="다시 볼 문제"
        />
      </section>

      <section className="rounded-lg border border-app-line bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-app-muted">최근 풀이일</p>
        <p className="mt-2 text-2xl font-bold tracking-normal text-app-ink">
          {stats.lastAnsweredDate ?? "-"}
        </p>
        <p className="mt-2 text-sm font-semibold leading-6 text-app-muted">
          {hasAnswers
            ? "오늘처럼 가볍게 이어가면 streak가 계속 쌓입니다."
            : "오늘의 퀴즈를 풀면 통계가 이곳에 쌓입니다."}
        </p>
      </section>
    </div>
  );
}

function StatsStateCard({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <section className="rounded-lg border border-app-line bg-white p-5 text-center shadow-sm">
      <p className="text-base font-bold text-app-ink">{title}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-app-muted">{message}</p>
    </section>
  );
}
