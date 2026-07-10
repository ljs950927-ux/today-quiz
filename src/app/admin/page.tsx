import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { AdminQuizManager } from "@/components/admin/admin-quiz-manager";
import { AppShell } from "@/components/layout/app-shell";
import { getAdminQuizzes, getAdminStatus } from "@/features/admin/api";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const adminStatus = await getAdminStatus();
  const canAccessAdmin =
    adminStatus.status === "success" && adminStatus.isAdmin;
  const quizzesResult = canAccessAdmin ? await getAdminQuizzes() : null;
  const params = await searchParams;
  const noticeMessage = getFirstParam(params.admin_notice);
  const errorMessage = getFirstParam(params.admin_error);

  return (
    <AppShell title="퀴즈 관리" subtitle="등록, 검수, 공개 상태를 관리합니다">
      {canAccessAdmin ? (
        quizzesResult?.status === "success" ? (
          <AdminQuizManager
            quizzes={quizzesResult.quizzes}
            defaultQuizDate={getKstDate()}
            noticeMessage={noticeMessage}
            errorMessage={errorMessage}
          />
        ) : (
          <section className="rounded-lg border border-app-line bg-white p-5 text-center shadow-sm">
            <h2 className="text-lg font-bold text-app-ink">
              퀴즈 목록을 불러오지 못했습니다
            </h2>
            <p className="mt-2 text-sm leading-6 text-app-muted">
              {quizzesResult?.message ??
                "잠시 후 다시 시도해 주세요."}
            </p>
          </section>
        )
      ) : (
        <section className="rounded-lg border border-app-line bg-white p-5 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-app-coral/10 text-app-coral">
            <ShieldAlert aria-hidden="true" className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-app-ink">
            관리자 권한이 필요합니다
          </h2>
          <p className="mt-2 text-sm leading-6 text-app-muted">
            퀴즈 관리는 등록된 관리자만 접근할 수 있습니다.
          </p>
          <Link
            href="/admin/login"
            className="touch-target mt-5 inline-flex items-center justify-center rounded-lg bg-app-teal px-4 py-3 text-sm font-bold text-white"
          >
            관리자 로그인
          </Link>
          {adminStatus.status === "error" ? (
            <p className="mt-3 rounded-lg bg-app-soft px-3 py-2 text-xs font-semibold text-app-muted">
              {adminStatus.message}
            </p>
          ) : null}
        </section>
      )}
    </AppShell>
  );
}

function getFirstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? null;
}

function getKstDate() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date());
}
