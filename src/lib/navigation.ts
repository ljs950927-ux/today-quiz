import { BarChart3, BookOpenCheck, CalendarDays, ShieldCheck } from "lucide-react";

export const bottomNavigation = [
  {
    href: "/",
    label: "오늘",
    icon: BookOpenCheck,
  },
  {
    href: "/history",
    label: "기록",
    icon: CalendarDays,
  },
  {
    href: "/stats",
    label: "통계",
    icon: BarChart3,
  },
  {
    href: "/admin",
    label: "관리",
    icon: ShieldCheck,
  },
];
