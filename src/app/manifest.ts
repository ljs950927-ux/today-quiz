import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "오늘상식",
    short_name: "오늘상식",
    description: "하루 1문제, 1분 안에 배우는 상식 퀴즈",
    lang: "ko-KR",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f6f7fb",
    theme_color: "#0f766e",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
