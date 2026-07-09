export type AnswerStatsSummary = {
  currentStreak: number;
  longestStreak: number;
  totalAnswers: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracyRate: number;
  lastAnsweredDate: string | null;
  lastAnsweredAt: string | null;
};
