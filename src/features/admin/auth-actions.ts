"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/env";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signInAdminWithEmailAction(formData: FormData) {
  if (!hasSupabaseConfig()) {
    redirect("/admin/login?error=config");
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!emailPattern.test(email)) {
    redirect("/admin/login?error=email");
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? "http://localhost:3000";
  const supabase = await createClient();
  const nextPath = encodeURIComponent("/admin");
  const errorNextPath = encodeURIComponent("/admin/login?error=callback");

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${nextPath}&error_next=${errorNextPath}`,
      shouldCreateUser: false,
    },
  });

  if (error) {
    console.error("signInAdminWithEmailAction failed", error);
    redirect("/admin/login?error=auth");
  }

  redirect("/admin/login?sent=1");
}
