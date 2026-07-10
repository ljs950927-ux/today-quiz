import { CheckCircle2, LogOut, Mail } from "lucide-react";
import { AnonymousSessionGuard } from "@/components/auth/anonymous-session-guard";
import { AppShell } from "@/components/layout/app-shell";
import { StatusPill } from "@/components/ui/status-pill";
import { connectEmailAction, signOutAction } from "@/features/auth/actions";
import { getCurrentUser } from "@/features/auth/session";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const errorMessages: Record<string, string> = {
  auth: "이메일 연결 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.",
  callback: "인증 링크 확인 중 문제가 발생했습니다. 다시 시도해 주세요.",
  config: "Supabase 환경변수가 아직 설정되지 않았습니다.",
  email: "올바른 이메일 주소를 입력해 주세요.",
  email_exists: "이미 등록된 이메일입니다. 해당 이메일로 로그인하면 기존 계정 기록을 사용할 수 있어요.",
  session: "기록을 연결할 익명 세션을 준비하지 못했습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const sent = getFirstParam(params.sent) === "1";
  const linked = getFirstParam(params.linked) === "1";
  const already = getFirstParam(params.already) === "1";
  const errorCode = getFirstParam(params.error);
  const errorMessage = errorCode
    ? errorMessages[errorCode] ?? errorMessages.auth
    : null;

  return (
    <AppShell
      title="이메일로 기록 보관하기"
      subtitle="필요할 때만 현재 기록을 이메일에 연결합니다"
    >
      <div className="space-y-4">
        <AnonymousSessionGuard />
        {user && !user.isAnonymous ? (
          <LoggedInCard email={user.email} linked={linked} already={already} />
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
      <StatusPill tone="teal">선택 기능</StatusPill>
      <h2 className="mt-5 text-2xl font-bold tracking-normal text-app-ink">
        이메일로 기록 보관하기
      </h2>
      <p className="mt-2 text-sm leading-6 text-app-muted">
        지금 기기의 풀이 기록을 이메일 계정에 연결하면, 나중에도 기록을 이어볼 수 있어요.
        퀴즈 풀기는 이메일 없이 계속 이용할 수 있습니다.
      </p>

      {sent ? (
        <div className="mt-5 rounded-lg border border-teal-100 bg-teal-50 p-3 text-sm font-semibold leading-6 text-teal-800">
          인증 메일을 보냈습니다. 이메일의 링크를 열면 현재 기록이 연결됩니다.
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-5 rounded-lg border border-orange-100 bg-orange-50 p-3 text-sm font-semibold leading-6 text-orange-800">
          {errorMessage}
        </div>
      ) : null}

      <form action={connectEmailAction} className="mt-6 space-y-3">
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
          인증 메일 받기
        </button>
      </form>
    </section>
  );
}

function LoggedInCard({
  email,
  linked,
  already,
}: {
  email: string | null;
  linked: boolean;
  already: boolean;
}) {
  return (
    <section className="rounded-lg border border-app-line bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-app-teal">
        <CheckCircle2 aria-hidden="true" className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-2xl font-bold tracking-normal text-app-ink">
        이메일 기록 보관이 켜져 있습니다
      </h2>
      <p className="mt-2 break-all text-sm font-semibold leading-6 text-app-muted">
        {email ?? "이메일 정보 없음"}
      </p>
      {linked ? (
        <div className="mt-5 rounded-lg border border-teal-100 bg-teal-50 p-3 text-sm font-semibold leading-6 text-teal-800">
          현재 기기의 기록이 이메일에 연결되었습니다.
        </div>
      ) : null}
      {already ? (
        <div className="mt-5 rounded-lg border border-teal-100 bg-teal-50 p-3 text-sm font-semibold leading-6 text-teal-800">
          이미 이메일로 기록을 보관 중입니다.
        </div>
      ) : null}
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
