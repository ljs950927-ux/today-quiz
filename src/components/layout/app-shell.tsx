import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { signOutAction } from "@/features/auth/actions";
import { getCurrentUser } from "@/features/auth/session";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export async function AppShell({ title, subtitle, children }: AppShellProps) {
  const user = await getCurrentUser();
  const hasEmailUser = Boolean(user && !user.isAnonymous);

  return (
    <main className="min-h-svh bg-app-bg text-app-ink sm:flex sm:items-center sm:justify-center sm:px-4">
      <div className="mx-auto flex h-svh max-h-svh w-full max-w-[430px] flex-col overflow-hidden bg-[#fbfcfe] shadow-none sm:my-6 sm:h-[calc(100svh-3rem)] sm:rounded-lg sm:border sm:border-app-line sm:shadow-app">
        <header className="shrink-0 border-b border-app-line bg-white px-5 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] sm:rounded-t-lg">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-app-teal">오늘상식</p>
              <h1 className="mt-1 truncate text-2xl font-bold tracking-normal text-app-ink">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-1 text-sm leading-5 text-app-muted">{subtitle}</p>
              ) : null}
              {hasEmailUser && user?.email ? (
                <p className="mt-1 max-w-[270px] truncate text-xs font-semibold text-app-teal">
                  {user.email}
                </p>
              ) : null}
            </div>
            {hasEmailUser ? (
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="touch-target inline-flex shrink-0 items-center justify-center rounded-lg border border-app-line bg-white px-3 text-sm font-semibold text-app-ink shadow-sm"
                  aria-label="로그아웃"
                >
                  <LogOut aria-hidden="true" className="h-5 w-5" />
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="touch-target inline-flex shrink-0 items-center justify-center rounded-lg border border-app-line bg-white px-3 text-sm font-semibold text-app-ink shadow-sm"
                aria-label="로그인"
              >
                <LogIn aria-hidden="true" className="h-5 w-5" />
              </Link>
            )}
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-5">
          {children}
        </div>
        <BottomNav />
      </div>
    </main>
  );
}
