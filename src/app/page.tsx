import { Suspense } from "react";
import { AlertCircle, CalendarCheck2, Inbox } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { TodayQuizCard } from "@/components/quiz/today-quiz-card";
import { getCurrentUser } from "@/features/auth/session";
import { getTodayQuiz } from "@/features/quiz/api";

export const dynamic = "force-dynamic";

export default function TodayPage() {
  return (
    <AppShell title="오늘의 퀴즈" subtitle="하루 1문제, 가볍게 쌓는 상식">
      <div className="space-y-4">
        <TodayStatusBanner />

        <Suspense fallback={<TodayQuizLoading />}>
          <TodayQuizContent />
        </Suspense>
      </div>
    </AppShell>
  );
}

function TodayStatusBanner() {
  return (
    <section className="rounded-lg border border-teal-100 bg-teal-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-app-teal">
          <CalendarCheck2 aria-hidden="true" className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-teal-800">오늘의 상식 루틴</p>
          <p className="mt-0.5 text-sm text-teal-700">한국시간 기준 퀴즈를 불러옵니다</p>
        </div>
      </div>
    </section>
  );
}

async function TodayQuizContent() {
  const [quizResult, user] = await Promise.all([getTodayQuiz(), getCurrentUser()]);

  if (quizResult.status === "success") {
    return (
      <TodayQuizCard
        quiz={quizResult.quiz}
        showRecordCta={!user || user.isAnonymous}
      />
    );
  }

  if (quizResult.status === "empty") {
    return (
      <QuizStateCard
        icon={<Inbox aria-hidden="true" className="h-6 w-6" />}
        title="오늘 등록된 퀴즈가 없습니다"
        description="공개된 퀴즈가 준비되면 이 화면에 바로 표시됩니다."
      />
    );
  }

  return (
    <QuizStateCard
      icon={<AlertCircle aria-hidden="true" className="h-6 w-6" />}
      title="퀴즈를 불러올 수 없습니다"
      description={quizResult.message}
      tone="error"
    />
  );
}

function TodayQuizLoading() {
  return (
    <section className="rounded-lg border border-app-line bg-white p-4 shadow-sm">
      <div className="flex gap-2">
        <div className="h-7 w-14 rounded-full bg-zinc-100" />
        <div className="h-7 w-14 rounded-full bg-zinc-100" />
        <div className="h-7 w-24 rounded-full bg-zinc-100" />
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-6 w-full rounded bg-zinc-100" />
        <div className="h-6 w-4/5 rounded bg-zinc-100" />
      </div>
      <div className="mt-5 space-y-3">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-12 rounded-lg border border-app-line bg-zinc-50" />
        ))}
      </div>
    </section>
  );
}

type QuizStateCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  tone?: "default" | "error";
};

function QuizStateCard({
  icon,
  title,
  description,
  tone = "default",
}: QuizStateCardProps) {
  return (
    <section className="rounded-lg border border-app-line bg-white p-5 text-center shadow-sm">
      <div
        className={
          tone === "error"
            ? "mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-app-coral"
            : "mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-app-teal"
        }
      >
        {icon}
      </div>
      <h2 className="mt-4 text-lg font-bold tracking-normal text-app-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-app-muted">{description}</p>
    </section>
  );
}
