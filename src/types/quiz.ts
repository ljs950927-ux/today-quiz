export type QuizDifficulty = "easy" | "normal" | "hard";
export type QuizStatus = "draft" | "published" | "archived";
export type ReviewStatus = "pending" | "approved" | "rejected";

export type QuizChoice = {
  id: number;
  text: string;
};

export type QuizSummary = {
  id: string;
  quizDate: string;
  question: string;
  choices: QuizChoice[];
  category: string;
  difficulty: QuizDifficulty;
  status: QuizStatus;
  alreadyAnswered: boolean;
  selectedIndex: number | null;
  isCorrect: boolean | null;
  answeredAt: string | null;
};

export type HistoryItem = {
  id: string;
  date: string;
  category: string;
  question: string;
  isCorrect: boolean;
};

export type AnswerHistoryItem = {
  id: string;
  quizId: string;
  answeredAt: string;
  answeredDate: string;
  quizDate: string;
  question: string;
  selectedIndex: number;
  selectedChoice: string;
  isCorrect: boolean;
  category: string;
  difficulty: QuizDifficulty;
  explanation: string;
};

export type AdminQuizItem = QuizSummary & {
  aiGenerated: boolean;
  reviewStatus: ReviewStatus;
};
