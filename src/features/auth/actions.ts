"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/env";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function connectEmailAction(formData: FormData) {
  if (!hasSupabaseConfig()) {
    redirect("/login?error=config");
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!emailPattern.test(email)) {
    redirect("/login?error=email");
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? "http://localhost:3000";
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  let user = userData.user;

  if (userError || !user) {
    const { data: anonymousData, error: anonymousError } =
      await supabase.auth.signInAnonymously();

    if (anonymousError || !anonymousData.user) {
      redirect("/login?error=session");
    }

    user = anonymousData.user;
  }

  if (!user.is_anonymous) {
    redirect("/login?already=1");
  }

  const nextPath = encodeURIComponent("/login?linked=1");
  const { error } = await supabase.auth.updateUser(
    { email },
    {
      emailRedirectTo: `${origin}/auth/callback?next=${nextPath}`,
    },
  );

  if (error) {
    console.error("connectEmailAction failed", error);

    if (isEmailConflictError(error)) {
      redirect("/login?error=email_exists");
    }

    redirect("/login?error=auth");
  }

  redirect("/login?sent=1");
}

export async function signInWithEmailAction(formData: FormData) {
  return connectEmailAction(formData);
}

export async function signOutAction() {
  if (hasSupabaseConfig()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("signOutAction failed", error);
    }
  }

  redirect("/");
}

function isEmailConflictError(error: {
  message?: string;
  code?: string;
  name?: string;
}) {
  const errorText = `${error.code ?? ""} ${error.name ?? ""} ${error.message ?? ""}`
    .toLowerCase();

  return ["already", "registered", "exists", "taken", "duplicate"].some((keyword) =>
    errorText.includes(keyword),
  );
}
