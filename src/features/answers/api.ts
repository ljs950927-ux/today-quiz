import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

type SubmitAnswerRpcRow =
  Database["public"]["Functions"]["submit_answer"]["Returns"][number];

export type SubmitAnswerData = {
  quizId: string;
  selectedIndex: number;
  isCorrect: boolean;
  answerIndex: number;
  explanation: string;
  answeredAt: string;
  answeredDate: string;
  currentStreak: number;
  longestStreak: number;
  alreadyAnswered: boolean;
};

export type SubmitAnswerErrorCode =
  | "LOGIN_REQUIRED"
  | "INVALID_SELECTED_INDEX"
  | "QUIZ_NOT_FOUND"
  | "QUIZ_NOT_TODAY"
  | "CONFIG_MISSING"
  | "UNKNOWN";

export type SubmitAnswerResult =
  | {
      status: "success";
      answer: SubmitAnswerData;
    }
  | {
      status: "error";
      code: SubmitAnswerErrorCode;
      message: string;
    };

export async function submitAnswer({
  quizId,
  selectedIndex,
}: {
  quizId: string;
  selectedIndex: number;
}): Promise<SubmitAnswerResult> {
  if (!hasSupabaseConfig()) {
    return {
      status: "error",
      code: "CONFIG_MISSING",
      message: getSubmitAnswerErrorMessage("CONFIG_MISSING"),
    };
  }

  if (
    !quizId ||
    !Number.isInteger(selectedIndex) ||
    selectedIndex < 0 ||
    selectedIndex > 3
  ) {
    return {
      status: "error",
      code: "INVALID_SELECTED_INDEX",
      message: getSubmitAnswerErrorMessage("INVALID_SELECTED_INDEX"),
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("submit_answer", {
      p_quiz_id: quizId,
      p_selected_index: selectedIndex,
    });

    if (error) {
      const code = getSubmitAnswerErrorCode(error.message);
      console.error("submit_answer RPC failed", error);

      return {
        status: "error",
        code,
        message: getSubmitAnswerErrorMessage(code),
      };
    }

    const row = data?.[0];

    if (!row) {
      return {
        status: "error",
        code: "UNKNOWN",
        message: getSubmitAnswerErrorMessage("UNKNOWN"),
      };
    }

    return {
      status: "success",
      answer: mapSubmitAnswer(row, quizId, selectedIndex),
    };
  } catch (error) {
    console.error("submitAnswer failed", error);
    return {
      status: "error",
      code: "UNKNOWN",
      message: getSubmitAnswerErrorMessage("UNKNOWN"),
    };
  }
}

function mapSubmitAnswer(
  row: SubmitAnswerRpcRow,
  quizId: string,
  selectedIndex: number,
): SubmitAnswerData {
  return {
    quizId,
    selectedIndex,
    isCorrect: row.is_correct,
    answerIndex: row.answer_index,
    explanation: row.explanation,
    answeredAt: "",
    answeredDate: "",
    currentStreak: row.current_streak,
    longestStreak: row.longest_streak,
    alreadyAnswered: row.already_answered,
  };
}

function getSubmitAnswerErrorCode(message: string): SubmitAnswerErrorCode {
  if (message.includes("LOGIN_REQUIRED")) {
    return "LOGIN_REQUIRED";
  }

  if (message.includes("INVALID_SELECTED_INDEX")) {
    return "INVALID_SELECTED_INDEX";
  }

  if (message.includes("QUIZ_NOT_FOUND")) {
    return "QUIZ_NOT_FOUND";
  }

  if (message.includes("QUIZ_NOT_TODAY")) {
    return "QUIZ_NOT_TODAY";
  }

  return "UNKNOWN";
}

function getSubmitAnswerErrorMessage(code: SubmitAnswerErrorCode) {
  switch (code) {
    case "LOGIN_REQUIRED":
      return "익명 세션을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.";
    case "INVALID_SELECTED_INDEX":
      return "선택지를 다시 확인해 주세요.";
    case "QUIZ_NOT_FOUND":
      return "제출할 수 있는 퀴즈를 찾지 못했습니다.";
    case "QUIZ_NOT_TODAY":
      return "오늘의 퀴즈만 제출할 수 있습니다.";
    case "CONFIG_MISSING":
      return "퀴즈 제출 설정이 아직 준비되지 않았습니다.";
    case "UNKNOWN":
    default:
      return "정답 제출 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  }
}
