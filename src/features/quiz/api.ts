import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import type { Database, Json } from "@/types/database";
import type { QuizChoice, QuizSummary } from "@/types/quiz";

type TodayQuizRpcRow =
  Database["public"]["Functions"]["get_today_quiz"]["Returns"][number];

export type TodayQuizResult =
  | {
      status: "success";
      quiz: QuizSummary;
    }
  | {
      status: "empty";
    }
  | {
      status: "error";
      message: string;
    };

const quizLoadErrorMessage =
  "오늘의 퀴즈를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";

export async function getTodayQuiz(): Promise<TodayQuizResult> {
  if (!hasSupabaseConfig()) {
    return {
      status: "error",
      message: "오늘의 퀴즈를 불러올 설정이 아직 준비되지 않았습니다.",
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_today_quiz");

    if (error) {
      console.error("get_today_quiz RPC failed", error);
      return {
        status: "error",
        message: quizLoadErrorMessage,
      };
    }

    const row = data?.[0];

    if (!row) {
      return {
        status: "empty",
      };
    }

    const quiz = mapTodayQuiz(row);

    if (!quiz) {
      console.error("get_today_quiz returned invalid choices", row);
      return {
        status: "error",
        message: quizLoadErrorMessage,
      };
    }

    return {
      status: "success",
      quiz,
    };
  } catch (error) {
    console.error("getTodayQuiz failed", error);
    return {
      status: "error",
      message: quizLoadErrorMessage,
    };
  }
}

export function mapTodayQuiz(row: TodayQuizRpcRow): QuizSummary | null {
  const choices = mapChoices(row.choices);

  if (!choices) {
    return null;
  }

  return {
    id: row.id,
    quizDate: row.quiz_date,
    question: row.question,
    choices,
    category: row.category,
    difficulty: row.difficulty,
    status: row.status,
    alreadyAnswered: row.already_answered,
    selectedIndex: row.selected_index,
    isCorrect: row.is_correct,
    answeredAt: row.answered_at,
  };
}

function mapChoices(value: Json): QuizChoice[] | null {
  if (!Array.isArray(value) || value.length !== 4) {
    return null;
  }

  const choices: QuizChoice[] = [];

  for (const [index, choice] of value.entries()) {
    if (typeof choice !== "string" || choice.trim().length === 0) {
      return null;
    }

    choices.push({
      id: index,
      text: choice,
    });
  }

  return choices;
}
