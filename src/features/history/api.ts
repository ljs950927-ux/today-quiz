import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import type { Database } from "@/types/database";
import type { AnswerHistoryItem } from "@/types/quiz";

type AnswerHistoryRpcRow =
  Database["public"]["Functions"]["get_answer_history"]["Returns"][number];

export type AnswerHistoryResult =
  | {
      status: "success";
      items: AnswerHistoryItem[];
    }
  | {
      status: "error";
      message: string;
    };

const historyLoadErrorMessage =
  "풀이 기록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";

export async function getAnswerHistory(): Promise<AnswerHistoryResult> {
  if (!hasSupabaseConfig()) {
    return {
      status: "error",
      message: "풀이 기록을 불러올 Supabase 설정이 아직 준비되지 않았습니다.",
    };
  }

  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return {
        status: "success",
        items: [],
      };
    }

    const { data, error } = await supabase.rpc("get_answer_history");

    if (error) {
      console.error("get_answer_history RPC failed", error);
      return {
        status: "error",
        message: historyLoadErrorMessage,
      };
    }

    return {
      status: "success",
      items: (data ?? []).map(mapAnswerHistoryRow),
    };
  } catch (error) {
    console.error("getAnswerHistory failed", error);
    return {
      status: "error",
      message: historyLoadErrorMessage,
    };
  }
}

function mapAnswerHistoryRow(row: AnswerHistoryRpcRow): AnswerHistoryItem {
  return {
    id: row.answer_id,
    quizId: row.quiz_id,
    answeredAt: row.answered_at,
    answeredDate: row.answered_date,
    quizDate: row.quiz_date,
    question: row.question,
    selectedIndex: row.selected_index,
    selectedChoice: row.selected_choice,
    isCorrect: row.is_correct,
    category: row.category,
    difficulty: row.difficulty,
    explanation: row.explanation,
  };
}
