"use client";

import { createClient } from "@/lib/supabase/client";

export type AnonymousSessionResult =
  | {
      status: "success";
      isAnonymous: boolean;
    }
  | {
      status: "error";
      message: string;
    };

export async function ensureAnonymousSession(): Promise<AnonymousSessionResult> {
  try {
    const supabase = createClient();
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      return {
        status: "error",
        message: "세션을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      };
    }

    if (sessionData.session) {
      return {
        status: "success",
        isAnonymous: Boolean(sessionData.session.user.is_anonymous),
      };
    }

    const { data, error } = await supabase.auth.signInAnonymously();

    if (error || !data.session) {
      return {
        status: "error",
        message:
          "익명 풀이 설정이 아직 준비되지 않았습니다. Anonymous Auth 설정을 확인해 주세요.",
      };
    }

    return {
      status: "success",
      isAnonymous: Boolean(data.user?.is_anonymous),
    };
  } catch {
    return {
      status: "error",
      message: "익명 세션을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }
}
