"use server";

import { submitAnswer } from "./api";
import type { SubmitAnswerActionState } from "./state";

export async function submitAnswerAction(
  _previousState: SubmitAnswerActionState,
  formData: FormData,
): Promise<SubmitAnswerActionState> {
  const quizId = String(formData.get("quiz_id") ?? "");
  const selectedIndexValue = formData.get("selected_index");
  const selectedIndex =
    typeof selectedIndexValue === "string" && selectedIndexValue.trim() !== ""
      ? Number(selectedIndexValue)
      : Number.NaN;

  const result = await submitAnswer({
    quizId,
    selectedIndex,
  });

  if (result.status === "error") {
    return result;
  }

  return result;
}
