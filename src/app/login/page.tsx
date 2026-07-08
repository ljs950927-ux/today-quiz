import { CheckCircle2, LogOut, Mail } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusPill } from "@/components/ui/status-pill";
import { signInWithEmailAction, signOutAction } from "@/features/auth/actions";
import { getCurrentUser } from "@/features/auth/session";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const errorMessages: Record<string, string> = {
  auth: "로그인 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.",
  callback: "로그인 링크 확인 중 문제가 발생했습니다. 다시 로그인해 주세요.",
  config: "Supabase 환경변수가 아직 설정되지 않았습니다.",
  email: "올바른 이메일 주소를 입력해 주세요.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const sent = getFirstParam(params.sent) === "1";
  const errorCode = getFirstParam(params.error);
  const errorMessage = errorCode ? errorMessages[errorCode] ?? errorMessages.auth : null;

  return (
    <AppShell title="로그인" subtitle="기록과 streak를 내 계정에 저장합니다">
      <div className="space-y-4">
        {user && !user.isAnonymous ? (
          <LoggedInCard email={user.email} />
        ) : (
          <EmailLoginCard sent={sent} errorMessage={errorMessage} />
        )}
      </div>
    </AppShell>
  );
}

function EmailLoginCard({
  sent,
  errorMessage,
}: {
  sent: boolean;
  errorMessage: string | null;
}) {
  return (
    <section className="rounded-lg border border-app-line bg-white p-5 shadow-sm">
      <StatusPill tone="teal">이메일 로그인</StatusPill>
      <h2 className="mt-5 text-2xl font-bold tracking-normal text-app-ink">
        1분 상식 루틴을 이어가세요
      </h2>
      <p className="mt-2 text-sm leading-6 text-app-muted">
        이메일로 받은 로그인 링크를 열면 기록과 연속 참여일을 저장할 수 있습니다.
      </p>

      {sent ? (
        <div className="mt-5 rounded-lg border border-teal-100 bg-teal-50 p-3 text-sm font-semibold leading-6 text-teal-800">
          로그인 링크를 보냈습니다. 이메일을 확인해 주세요.
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-5 rounded-lg border border-orange-100 bg-orange-50 p-3 text-sm font-semibold leading-6 text-orange-800">
          {errorMessage}
        </div>
      ) : null}

      <form action={signInWithEmailAction} className="mt-6 space-y-3">
        <label className="block">
          <span className="text-sm font-semibold text-app-muted">이메일</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="touch-target mt-2 w-full rounded-lg border border-app-line bg-white px-4 py-3 text-base font-semibold text-app-ink shadow-sm placeholder:text-zinc-400"
          />
        </label>
        <button
          type="submit"
          className="touch-target inline-flex w-full items-center justify-center gap-2 rounded-lg bg-app-teal px-4 py-3 text-base font-bold text-white"
        >
          <Mail aria-hidden="true" className="h-5 w-5" />
          로그인 링크 받기
        </button>
      </form>
    </section>
  );
}

function LoggedInCard({ email }: { email: string | null }) {
  return (
    <section className="rounded-lg border border-app-line bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-app-teal">
        <CheckCircle2 aria-hidden="true" className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-2xl font-bold tracking-normal text-app-ink">
        로그인되어 있습니다
      </h2>
      <p className="mt-2 break-all text-sm font-semibold leading-6 text-app-muted">
        {email ?? "이메일 정보 없음"}
      </p>
      <form action={signOutAction} className="mt-6">
        <button
          type="submit"
          className="touch-target inline-flex w-full items-center justify-center gap-2 rounded-lg border border-app-line bg-white px-4 py-3 text-base font-bold text-app-ink"
        >
          <LogOut aria-hidden="true" className="h-5 w-5" />
          로그아웃
        </button>
      </form>
    </section>
  );
}

function getFirstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
