"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  archiveAdminQuiz,
  createAdminQuiz,
  updateAdminQuiz,
} from "@/features/admin/api";

type AdminQuizActionResult = {
  status: "success" | "error";
  message: string;
};

export async function createAdminQuizFormAction(formData: FormData) {
  const result = await createAdminQuiz(formData);
  redirectAfterMutation(result);
}

export async function updateAdminQuizFormAction(formData: FormData) {
  const result = await updateAdminQuiz(formData);
  redirectAfterMutation(result);
}

export async function archiveAdminQuizFormAction(formData: FormData) {
  const result = await archiveAdminQuiz(formData);
  redirectAfterMutation(result);
}

function redirectAfterMutation(result: AdminQuizActionResult) {
  if (result.status === "success") {
    revalidatePath("/admin");
    redirect(`/admin?admin_notice=${encodeURIComponent(result.message)}`);
  }

  redirect(`/admin?admin_error=${encodeURIComponent(result.message)}`);
}
