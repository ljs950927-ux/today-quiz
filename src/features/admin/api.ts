import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/env";

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
