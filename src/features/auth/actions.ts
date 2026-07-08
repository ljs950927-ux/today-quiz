"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/env";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signInWithEmailAction(formData: FormData) {
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

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error("signInWithEmailAction failed", error);
    redirect("/login?error=auth");
  }

  redirect("/login?sent=1");
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
