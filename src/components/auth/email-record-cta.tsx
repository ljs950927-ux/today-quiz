import Link from "next/link";
import { Mail } from "lucide-react";
import { getCurrentUser } from "@/features/auth/session";

export async function EmailRecordCta() {
  const user = await getCurrentUser();

  if (user && !user.isAnonymous) {
    return null;
  }

  return (
    <section className="rounded-lg border border-teal-100 bg-teal-50 p-3 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-app-teal">
          <Mail aria-hidden="true" className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-teal-900">
            이메일로 기록 보관하기
          </p>
          <p className="mt-1 text-xs font-semibold leading-5 text-teal-800">
            지금 기기의 풀이 기록을 이메일에 연결해 나중에도 이어볼 수 있어요.
          </p>
          <Link
            href="/login"
            className="mt-2 inline-flex text-sm font-bold text-app-teal underline-offset-4 hover:underline"
          >
            선택해서 연결하기
          </Link>
        </div>
      </div>
    </section>
  );
}
