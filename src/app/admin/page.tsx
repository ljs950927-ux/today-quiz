import { Plus, WandSparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusPill } from "@/components/ui/status-pill";
import { adminQuizzes } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

const statusTone = {
  draft: "gray",
  published: "teal",
  archived: "coral",
} as const;

const reviewLabel = {
  pending: "검수 대기",
  approved: "승인",
  rejected: "반려",
};

export default function AdminPage() {
  return (
    <AppShell title="퀴즈 관리" subtitle="등록, 검수, 공개 상태를 관리합니다">
      <div className="space-y-4">
        <section className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="touch-target inline-flex items-center justify-center gap-2 rounded-lg bg-app-teal px-3 py-3 text-sm font-bold text-white"
          >
            <Plus aria-hidden="true" className="h-5 w-5" />
            새 퀴즈
          </button>
          <button
            type="button"
            className="touch-target inline-flex items-center justify-center gap-2 rounded-lg border border-app-line bg-white px-3 py-3 text-sm font-bold text-app-ink"
          >
            <WandSparkles aria-hidden="true" className="h-5 w-5 text-app-coral" />
            AI 생성
          </button>
        </section>

        <div className="space-y-3">
          {adminQuizzes.map((quiz) => (
            <section
              key={quiz.id}
              className="rounded-lg border border-app-line bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone={statusTone[quiz.status]}>{quiz.status}</StatusPill>
                <StatusPill tone={quiz.aiGenerated ? "coral" : "blue"}>
                  {quiz.aiGenerated ? "AI 생성" : "수동 등록"}
                </StatusPill>
                <StatusPill>{reviewLabel[quiz.reviewStatus]}</StatusPill>
              </div>
              <p className="mt-3 text-sm font-semibold text-app-muted">
                {quiz.quizDate} · {quiz.category}
              </p>
              <h2 className="mt-2 text-base font-bold leading-6 text-app-ink">
                {quiz.question}
              </h2>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
