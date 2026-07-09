import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import type { Database } from "@/types/database";
import type { AnswerStatsSummary } from "@/types/stats";

type ProfileRow = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "current_streak" | "longest_streak" | "last_answered_date"
>;

type AnswerRow = Pick<
  Database["public"]["Tables"]["user_answers"]["Row"],
  "is_correct" | "answered_at" | "answered_date"
>;

export type AnswerStatsResult =
  | {
      status: "success";
      stats: AnswerStatsSummary;
    }
  | {
      status: "error";
      message: string;
    };

const emptyStats: AnswerStatsSummary = {
  currentStreak: 0,
  longestStreak: 0,
  totalAnswers: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  accuracyRate: 0,
  lastAnsweredDate: null,
  lastAnsweredAt: null,
};

const statsLoadErrorMessage =
  "통계를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";

export async function getAnswerStats(): Promise<AnswerStatsResult> {
  if (!hasSupabaseConfig()) {
    return {
      status: "error",
      message: "통계를 불러올 Supabase 설정이 아직 준비되지 않았습니다.",
    };
  }

  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      return {
        status: "success",
        stats: emptyStats,
      };
    }

    const [profileResponse, answersResponse] = await Promise.all([
      supabase
        .from("profiles")
        .select("current_streak, longest_streak, last_answered_date")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("user_answers")
        .select("is_correct, answered_at, answered_date")
        .eq("user_id", user.id)
        .order("answered_at", { ascending: false }),
    ]);

    if (profileResponse.error || answersResponse.error) {
      console.error("stats query failed", {
        profileError: profileResponse.error,
        answersError: answersResponse.error,
      });

      return {
        status: "error",
        message: statsLoadErrorMessage,
      };
    }

    return {
      status: "success",
      stats: mapAnswerStats({
        profile: profileResponse.data,
        answers: answersResponse.data ?? [],
      }),
    };
  } catch (error) {
    console.error("getAnswerStats failed", error);
    return {
      status: "error",
      message: statsLoadErrorMessage,
    };
  }
}

function mapAnswerStats({
  profile,
  answers,
}: {
  profile: ProfileRow | null;
  answers: AnswerRow[];
}): AnswerStatsSummary {
  const totalAnswers = answers.length;
  const correctAnswers = answers.filter((answer) => answer.is_correct).length;
  const wrongAnswers = totalAnswers - correctAnswers;

  return {
    currentStreak: profile?.current_streak ?? 0,
    longestStreak: profile?.longest_streak ?? 0,
    totalAnswers,
    correctAnswers,
    wrongAnswers,
    accuracyRate:
      totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
    lastAnsweredDate: profile?.last_answered_date ?? answers[0]?.answered_date ?? null,
    lastAnsweredAt: answers[0]?.answered_at ?? null,
  };
}
