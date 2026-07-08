import type { AdminQuizItem, HistoryItem, QuizSummary } from "@/types/quiz";

export const todayQuiz: QuizSummary = {
  id: "mock-today",
  quizDate: "2026-07-08",
  question: "지구의 대기에서 가장 많은 비율을 차지하는 기체는 무엇일까요?",
  choices: [
    { id: 0, text: "산소" },
    { id: 1, text: "질소" },
    { id: 2, text: "이산화탄소" },
    { id: 3, text: "수소" },
  ],
  category: "과학",
  difficulty: "easy",
  status: "published",
  alreadyAnswered: false,
  selectedIndex: null,
  isCorrect: null,
  answeredAt: null,
};

export const historyItems: HistoryItem[] = [
  {
    id: "history-1",
    date: "2026-07-07",
    category: "인물",
    question: "노벨상은 어느 사람의 이름에서 유래했을까요?",
    isCorrect: true,
  },
  {
    id: "history-2",
    date: "2026-07-06",
    category: "수학",
    question: "피타고라스의 정리는 어떤 도형과 관련이 있을까요?",
    isCorrect: true,
  },
  {
    id: "history-3",
    date: "2026-07-05",
    category: "역사",
    question: "대한민국의 국보 1호였던 문화재는 무엇일까요?",
    isCorrect: false,
  },
];

export const adminQuizzes: AdminQuizItem[] = [
  {
    ...todayQuiz,
    aiGenerated: false,
    reviewStatus: "approved",
  },
  {
    id: "draft-1",
    quizDate: "2026-07-09",
    question: "르네상스가 처음 크게 발전한 지역은 어디일까요?",
    choices: [
      { id: 0, text: "이탈리아" },
      { id: 1, text: "스페인" },
      { id: 2, text: "러시아" },
      { id: 3, text: "이집트" },
    ],
    category: "역사",
    difficulty: "normal",
    status: "draft",
    alreadyAnswered: false,
    selectedIndex: null,
    isCorrect: null,
    answeredAt: null,
    aiGenerated: true,
    reviewStatus: "pending",
  },
  {
    id: "draft-2",
    quizDate: "2026-07-10",
    question: "경제에서 인플레이션은 보통 무엇을 뜻할까요?",
    choices: [
      { id: 0, text: "물가 상승" },
      { id: 1, text: "물가 하락" },
      { id: 2, text: "실업률 하락" },
      { id: 3, text: "수출 증가" },
    ],
    category: "경제",
    difficulty: "normal",
    status: "draft",
    alreadyAnswered: false,
    selectedIndex: null,
    isCorrect: null,
    answeredAt: null,
    aiGenerated: true,
    reviewStatus: "pending",
  },
];
