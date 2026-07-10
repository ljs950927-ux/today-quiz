import { CheckCircle2, XCircle } from "lucide-react";
import { AnonymousSessionGuard } from "@/components/auth/anonymous-session-guard";
import { EmailRecordCta } from "@/components/auth/email-record-cta";
import { AppShell } from "@/components/layout/app-shell";
import { StatusPill } from "@/components/ui/status-pill";
import { getAnswerHistory } from "@/features/history/api";
import type { AnswerHistoryItem, QuizDifficulty } from "@/types/quiz";

export const dynamic = "force-dynamic";

const difficultyLabel: Record<QuizDifficulty, string> = {
  easy: "쉬움",
  normal: "보통",
  hard: "어려움",
};

export default async function HistoryPage() {
  const result = await getAnswerHistory();

  return (
    <AppShell title="풀이 기록" subtitle="날짜별 퀴즈 결과를 확인합니다">
      <div className="space-y-4">
        <AnonymousSessionGuard />
        {result.status === "error" ? (
          <HistoryStateCard title="기록을 불러오지 못했습니다" message={result.message} />
        ) : null}

        {result.status === "success" && result.items.length === 0 ? (
          <HistoryStateCard
            title="아직 푼 퀴즈가 없습니다"
            message="오늘의 퀴즈를 풀면 이곳에 기록이 쌓입니다."
          />
        ) : null}

        {result.status === "success" && result.items.length > 0 ? (
          <div className="space-y-3">
            {result.items.map((item) => (
              <HistoryCard key={item.id} item={item} />
            ))}
          </div>
        ) : null}
        <EmailRecordCta />
      </div>
    </AppShell>
  );
}

function HistoryCard({ item }: { item: AnswerHistoryItem }) {
  const ResultIcon = item.isCorrect ? CheckCircle2 : XCircle;

  return (
    <section className="rounded-lg border border-app-line bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={item.isCorrect ? "mt-0.5 text-app-teal" : "mt-0.5 text-app-coral"}>
          <ResultIcon aria-hidden="true" className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={item.isCorrect ? "teal" : "coral"}>
              {item.isCorrect ? "정답" : "오답"}
            </StatusPill>
            <StatusPill>{item.category}</StatusPill>
            <StatusPill tone="blue">{difficultyLabel[item.difficulty]}</StatusPill>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-app-muted">
            <span>풀이 {item.answeredDate}</span>
            <span>퀴즈 {item.quizDate}</span>
          </div>

          <p className="mt-3 text-base font-semibold leading-6 text-app-ink">
            {item.question}
          </p>

          <div className="mt-3 rounded-lg bg-app-soft p-3">
            <p className="text-sm font-semibold text-app-muted">내 선택</p>
            <p className="mt-1 text-sm font-bold leading-6 text-app-ink">
              {item.selectedChoice}
            </p>
          </div>

          <p className="mt-3 text-sm leading-6 text-app-muted">{item.explanation}</p>
        </div>
      </div>
    </section>
  );
}

function HistoryStateCard({
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
