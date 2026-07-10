"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ensureAnonymousSession } from "@/features/auth/anonymous";

type AnonymousSessionGuardProps = {
  refreshOnCreate?: boolean;
};

export function AnonymousSessionGuard({
  refreshOnCreate = true,
}: AnonymousSessionGuardProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function ensureSession() {
      const result = await ensureAnonymousSession();

      if (!isMounted) {
        return;
      }

      if (result.status === "error") {
        setMessage(result.message);
        return;
      }

      setMessage(null);

      if (result.created && refreshOnCreate) {
        router.refresh();
      }
    }

    ensureSession();

    return () => {
      isMounted = false;
    };
  }, [refreshOnCreate, router]);

  if (!message) {
    return null;
  }

  return (
    <section className="rounded-lg border border-orange-100 bg-orange-50 p-3 text-sm font-semibold leading-6 text-orange-800">
      {message}
    </section>
  );
}
