"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bottomNavigation } from "@/lib/navigation";
import { cn } from "@/lib/cn";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 shrink-0 border-t border-app-line bg-white px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2">
      <div className="grid grid-cols-4 gap-1">
        {bottomNavigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "touch-target flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold transition",
                isActive
                  ? "bg-teal-50 text-app-teal"
                  : "text-app-muted hover:bg-zinc-50 hover:text-app-ink",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
