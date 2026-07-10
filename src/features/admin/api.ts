import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import type { Database, Json } from "@/types/database";
import type {
  AdminQuizItem,
  QuizChoice,
  QuizDifficulty,
  QuizStatus,
} from "@/types/quiz";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;
type QuizRow = Database["public"]["Tables"]["quizzes"]["Row"];
type QuizInsert = Database["public"]["Tables"]["quizzes"]["Insert"];
type QuizUpdate = Database["public"]["Tables"]["quizzes"]["Update"];

type AdminGuardResult =
  | {
      status: "success";
      supabase: SupabaseServerClient;
    }
  | {
      status: "error";
      message: string;
    };

export type AdminQuizzesResult =
  | {
      status: "success";
      quizzes: AdminQuizItem[];
    }
  | {
      status: "error";
      message: string;
    };

type AdminQuizMutationResult = {
  status: "success" | "error";
  message: string;
};
type QuizFormResult =
  | {
      status: "success";
      quiz: Pick<
        QuizInsert,
        | "quiz_date"
        | "question"
        | "choices"
        | "answer_index"
        | "explanation"
        | "category"
        | "difficulty"
        | "status"
        | "source"
      >;
    }
  | {
      status: "error";
      message: string;
    };

export type AdminStatusResult =
  | {
      status: "success";
      isAdmin: boolean;
    }
  | {
      status: "error";
      message: string;
    };

const adminStatusErrorMessage =
  "관리자 권한을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.";
const adminPermissionMessage = "관리자 권한이 필요합니다.";
const adminQuizzesLoadErrorMessage =
  "관리자 퀴즈 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
const adminQuizSaveErrorMessage =
  "퀴즈를 저장하지 못했습니다. 입력값과 공개 상태를 확인해 주세요.";
const difficultyValues = ["easy", "normal", "hard"] as const;
const statusValues = ["draft", "published", "archived"] as const;

export async function getAdminStatus(): Promise<AdminStatusResult> {
  if (!hasSupabaseConfig()) {
    return {
      status: "error",
      message: "관리자 권한 확인을 위한 Supabase 설정이 아직 준비되지 않았습니다.",
    };
  }

  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      if (userError.message.includes("Auth session missing")) {
        return {
          status: "success",
          isAdmin: false,
        };
      }

      console.error("admin auth user lookup failed", userError);
      return {
        status: "error",
        message: adminStatusErrorMessage,
      };
    }

    if (!userData.user) {
      return {
        status: "success",
        isAdmin: false,
      };
    }

    const { data, error } = await supabase.rpc("is_admin");

    if (error) {
      console.error("is_admin RPC failed", error);
      return {
        status: "error",
        message: adminStatusErrorMessage,
      };
    }

    return {
      status: "success",
      isAdmin: Boolean(data),
    };
  } catch (error) {
    console.error("getAdminStatus failed", error);
    return {
      status: "error",
      message: adminStatusErrorMessage,
    };
  }
}

export async function getAdminQuizzes(): Promise<AdminQuizzesResult> {
  const admin = await requireAdmin();

  if (admin.status === "error") {
    return admin;
  }

  try {
    const { data, error } = await admin.supabase
      .from("quizzes")
      .select(
        "id, quiz_date, question, choices, answer_index, explanation, category, difficulty, status, source, ai_generated, ai_prompt, review_status, reviewed_at, review_note, created_at, updated_at",
      )
      .order("quiz_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("admin quizzes query failed", error);
      return {
        status: "error",
        message: getAdminDatabaseErrorMessage(error.message),
      };
    }

    return {
      status: "success",
      quizzes: (data ?? []).map(mapAdminQuizRow).filter((quiz) => quiz !== null),
    };
  } catch (error) {
    console.error("getAdminQuizzes failed", error);
    return {
      status: "error",
      message: adminQuizzesLoadErrorMessage,
    };
  }
}

export async function createAdminQuiz(
  formData: FormData,
): Promise<AdminQuizMutationResult> {
  const admin = await requireAdmin();

  if (admin.status === "error") {
    return admin;
  }

  const parsed = parseQuizForm(formData);

  if (parsed.status === "error") {
    return parsed;
  }

  const payload: QuizInsert = {
    ...parsed.quiz,
    ai_generated: false,
    review_status: "approved",
  };

  const { error } = await admin.supabase.from("quizzes").insert(payload);

  if (error) {
    console.error("admin quiz create failed", error);
    return {
      status: "error",
      message: getAdminDatabaseErrorMessage(error.message),
    };
  }

  return {
    status: "success",
    message: "새 퀴즈를 저장했습니다.",
  };
}

export async function updateAdminQuiz(
  formData: FormData,
): Promise<AdminQuizMutationResult> {
  const admin = await requireAdmin();

  if (admin.status === "error") {
    return admin;
  }

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    return {
      status: "error",
      message: "수정할 퀴즈를 찾지 못했습니다.",
    };
  }

  const parsed = parseQuizForm(formData);

  if (parsed.status === "error") {
    return parsed;
  }

  const payload: QuizUpdate = parsed.quiz;
  const { error } = await admin.supabase
    .from("quizzes")
    .update(payload)
    .eq("id", id);

  if (error) {
    console.error("admin quiz update failed", error);
    return {
      status: "error",
      message: getAdminDatabaseErrorMessage(error.message),
    };
  }

  return {
    status: "success",
    message: "퀴즈를 수정했습니다.",
  };
}

export async function archiveAdminQuiz(
  formData: FormData,
): Promise<AdminQuizMutationResult> {
  const admin = await requireAdmin();

  if (admin.status === "error") {
    return admin;
  }

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    return {
      status: "error",
      message: "보관 처리할 퀴즈를 찾지 못했습니다.",
    };
  }

  const { error } = await admin.supabase
    .from("quizzes")
    .update({ status: "archived" })
    .eq("id", id);

  if (error) {
    console.error("admin quiz archive failed", error);
    return {
      status: "error",
      message: getAdminDatabaseErrorMessage(error.message),
    };
  }

  return {
    status: "success",
    message: "퀴즈를 보관 처리했습니다.",
  };
}

async function requireAdmin(): Promise<AdminGuardResult> {
  if (!hasSupabaseConfig()) {
    return {
      status: "error",
      message: "관리자 기능을 위한 Supabase 설정이 아직 준비되지 않았습니다.",
    };
  }

  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      if (userError.message.includes("Auth session missing")) {
        return {
          status: "error",
          message: adminPermissionMessage,
        };
      }

      console.error("admin auth guard user lookup failed", userError);
      return {
        status: "error",
        message: adminStatusErrorMessage,
      };
    }

    if (!userData.user) {
      return {
        status: "error",
        message: adminPermissionMessage,
      };
    }

    const { data, error } = await supabase.rpc("is_admin");

    if (error) {
      console.error("admin auth guard RPC failed", error);
      return {
        status: "error",
        message: adminStatusErrorMessage,
      };
    }

    if (!data) {
      return {
        status: "error",
        message: adminPermissionMessage,
      };
    }

    return {
      status: "success",
      supabase,
    };
  } catch (error) {
    console.error("requireAdmin failed", error);
    return {
      status: "error",
      message: adminStatusErrorMessage,
    };
  }
}

function parseQuizForm(formData: FormData): QuizFormResult {
  const quizDate = String(formData.get("quiz_date") ?? "").trim();
  const question = String(formData.get("question") ?? "").trim();
  const explanation = String(formData.get("explanation") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const difficulty = String(formData.get("difficulty") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const answerIndex = Number(formData.get("answer_index"));
  const source = String(formData.get("source") ?? "").trim();
  const choices = [0, 1, 2, 3].map((index) =>
    String(formData.get(`choice_${index}`) ?? "").trim(),
  );

  if (!/^\d{4}-\d{2}-\d{2}$/.test(quizDate)) {
    return {
      status: "error",
      message: "퀴즈 날짜를 YYYY-MM-DD 형식으로 입력해 주세요.",
    };
  }

  if (!question || !explanation || !category) {
    return {
      status: "error",
      message: "질문, 해설, 카테고리는 반드시 입력해 주세요.",
    };
  }

  if (choices.some((choice) => !choice)) {
    return {
      status: "error",
      message: "선택지 4개를 모두 입력해 주세요.",
    };
  }

  if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex > 3) {
    return {
      status: "error",
      message: "정답은 1번부터 4번 중 하나를 선택해 주세요.",
    };
  }

  if (!isQuizDifficulty(difficulty)) {
    return {
      status: "error",
      message: "난이도를 다시 선택해 주세요.",
    };
  }

  if (!isQuizStatus(status)) {
    return {
      status: "error",
      message: "공개 상태를 다시 선택해 주세요.",
    };
  }

  return {
    status: "success",
    quiz: {
      quiz_date: quizDate,
      question,
      choices,
      answer_index: answerIndex,
      explanation,
      category,
      difficulty,
      status,
      source: source || null,
    },
  };
}

function mapAdminQuizRow(row: QuizRow): AdminQuizItem | null {
  const choices = mapChoices(row.choices);

  if (!choices) {
    return null;
  }

  return {
    id: row.id,
    quizDate: row.quiz_date,
    question: row.question,
    choices,
    answerIndex: row.answer_index,
    explanation: row.explanation,
    category: row.category,
    difficulty: row.difficulty,
    status: row.status,
    source: row.source,
    alreadyAnswered: false,
    selectedIndex: null,
    isCorrect: null,
    answeredAt: null,
    aiGenerated: row.ai_generated,
    reviewStatus: row.review_status,
    reviewedAt: row.reviewed_at,
    reviewNote: row.review_note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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

function isQuizDifficulty(value: string): value is QuizDifficulty {
  return difficultyValues.includes(value as QuizDifficulty);
}

function isQuizStatus(value: string): value is QuizStatus {
  return statusValues.includes(value as QuizStatus);
}

function getAdminDatabaseErrorMessage(message: string) {
  if (
    message.includes("duplicate key") ||
    message.includes("published") ||
    message.includes("unique")
  ) {
    return "해당 날짜에는 published 퀴즈를 1개만 둘 수 있습니다.";
  }

  if (
    message.includes("review_status") ||
    message.includes("reviewed_at") ||
    message.includes("check constraint")
  ) {
    return "AI 생성 퀴즈는 검수 승인 전 published 상태로 변경할 수 없습니다.";
  }

  if (message.includes("permission") || message.includes("policy")) {
    return adminPermissionMessage;
  }

  return adminQuizSaveErrorMessage;
}
