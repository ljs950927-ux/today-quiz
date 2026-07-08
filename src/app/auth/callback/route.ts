import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/env";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (!code || !hasSupabaseConfig()) {
    return NextResponse.redirect(new URL("/login?error=callback", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("auth callback exchange failed", error);
    return NextResponse.redirect(new URL("/login?error=callback", request.url));
  }

  return NextResponse.redirect(new URL(next, request.url));
}
