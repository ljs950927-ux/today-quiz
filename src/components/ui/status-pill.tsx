import { cn } from "@/lib/cn";

type StatusPillProps = {
  children: React.ReactNode;
  tone?: "teal" | "blue" | "coral" | "gray";
};

const toneClasses = {
  teal: "bg-teal-50 text-teal-800 ring-teal-100",
  blue: "bg-blue-50 text-blue-800 ring-blue-100",
  coral: "bg-orange-50 text-orange-800 ring-orange-100",
  gray: "bg-zinc-100 text-zinc-700 ring-zinc-200",
};

export function StatusPill({ children, tone = "gray" }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}
