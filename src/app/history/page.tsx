import { CheckCircle2, XCircle } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { historyItems } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default function HistoryPage() {
  return (
    <AppShell title="풀이 기록" subtitle="날짜별 퀴즈 결과를 확인합니다">
      <div className="space-y-3">
        {historyItems.map((item) => {
          const ResultIcon = item.isCorrect ? CheckCircle2 : XCircle;

          return (
            <section
              key={item.id}
              className="rounded-lg border border-app-line bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div
                  className={
                    item.isCorrect
                      ? "mt-0.5 text-app-teal"
                      : "mt-0.5 text-app-coral"
                  }
                >
                  <ResultIcon aria-hidden="true" className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-app-muted">{item.date}</p>
                    <p className="text-sm font-bold text-app-ink">{item.category}</p>
                  </div>
                  <p className="mt-2 text-base font-semibold leading-6 text-app-ink">
                    {item.question}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-app-muted">
                    {item.isCorrect ? "정답" : "오답"}
                  </p>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
