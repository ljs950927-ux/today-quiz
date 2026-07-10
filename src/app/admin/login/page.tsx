import Link from "next/link";
import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusPill } from "@/components/ui/status-pill";
import { signInAdminWithEmailAction } from "@/features/admin/auth-actions";

export const dynamic = "force-dynamic";

type AdminLoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const errorMessages: Record<string, string> = {
  auth: "로그인 링크 발송에 실패했습니다.",
  callback: "관리자 로그인 링크 확인 중 문제가 발생했습니다. 다시 시도해 주세요.",
  config: "Supabase 환경변수가 아직 설정되지 않았습니다.",
  email: "올바른 이메일 주소를 입력해 주세요.",
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const sent = getFirstParam(params.sent) === "1";
  const errorCode = getFirstParam(params.error);
  const errorMessage = errorCode ? errorMessages[errorCode] ?? errorMessages.auth : null;

  return (
    <AppShell title="관리자 로그인" subtitle="퀴즈 운영 계정으로 접속합니다">
      <section className="rounded-lg border border-app-line bg-white p-5 shadow-sm">
        <StatusPill tone="teal">관리자 전용</StatusPill>
        <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-app-teal">
          <ShieldCheck aria-hidden="true" className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-bold tracking-normal text-app-ink">
          관리자 로그인
        </h2>
        <p className="mt-2 text-sm leading-6 text-app-muted">
          관리자 계정으로 로그인해야 퀴즈를 등록·수정할 수 있습니다.
        </p>

        {sent ? (
          <div className="mt-5 rounded-lg border border-teal-100 bg-teal-50 p-3 text-sm font-semibold leading-6 text-teal-800">
            <div className="flex items-start gap-2">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
              <span>입력한 이메일로 로그인 링크를 보냈습니다.</span>
            </div>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-5 rounded-lg border border-orange-100 bg-orange-50 p-3 text-sm font-semibold leading-6 text-orange-800">
            {errorMessage}
          </div>
        ) : null}

        <form action={signInAdminWithEmailAction} className="mt-6 space-y-3">
          <label className="block">
            <span className="text-sm font-semibold text-app-muted">이메일</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@example.com"
              className="touch-target mt-2 w-full rounded-lg border border-app-line bg-white px-4 py-3 text-base font-semibold text-app-ink shadow-sm placeholder:text-zinc-400"
            />
          </label>
          <button
            type="submit"
            className="touch-target inline-flex w-full items-center justify-center gap-2 rounded-lg bg-app-teal px-4 py-3 text-base font-bold text-white"
          >
            <Mail aria-hidden="true" className="h-5 w-5" />
            관리자 로그인 링크 받기
          </button>
        </form>

        <Link
          href="/login"
          className="mt-4 inline-flex text-sm font-bold text-app-muted underline-offset-4 hover:text-app-ink hover:underline"
        >
          일반 사용자 기록 보관으로 이동
        </Link>
      </section>
    </AppShell>
  );
}

function getFirstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
