"use client";

import Link from "next/link";
import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
} from "lucide-react";
import { StatusPill } from "@/components/ui/status-pill";
import {
  submitAnswerAction,
} from "@/features/answers/actions";
import type { SubmitAnswerData } from "@/features/answers/api";
import { initialSubmitAnswerState } from "@/features/answers/state";
import { ensureAnonymousSession } from "@/features/auth/anonymous";
import { cn } from "@/lib/cn";
import type { QuizChoice, QuizSummary } from "@/types/quiz";

type TodayQuizCardProps = {
  quiz: QuizSummary;
  showRecordCta?: boolean;
};

const difficultyLabel = {
  easy: "쉬움",
  normal: "보통",
  hard: "어려움",
};

export function TodayQuizCard({ quiz, showRecordCta = true }: TodayQuizCardProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    quiz.selectedIndex,
  );
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);
  const [isEnsuringSession, setIsEnsuringSession] = useState(false);
  const [didRequestExistingAnswer, setDidRequestExistingAnswer] =
    useState(false);
  const [state, formAction, isPending] = useActionState(
    submitAnswerAction,
    initialSubmitAnswerState,
  );

  const answer = state.status === "success" ? state.answer : null;
  const isSubmitted = Boolean(answer);
  const isLoadingExistingAnswer =
    quiz.alreadyAnswered && !answer && didRequestExistingAnswer;

  useEffect(() => {
    let isMounted = true;

    async function createAnonymousSession() {
      const result = await ensureAnonymousSession();

      if (!isMounted) {
        return;
      }

      setSessionMessage(result.status === "error" ? result.message : null);
    }

    createAnonymousSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (answer) {
      setSelectedIndex(answer.selectedIndex);
    }
  }, [answer]);

  useEffect(() => {
    if (
      quiz.alreadyAnswered &&
      quiz.selectedIndex !== null &&
      !answer &&
      !didRequestExistingAnswer
    ) {
      setSelectedIndex(quiz.selectedIndex);
      setDidRequestExistingAnswer(true);
      formRef.current?.requestSubmit();
    }
  }, [answer, didRequestExistingAnswer, quiz.alreadyAnswered, quiz.selectedIndex]);

  const submitLabel = useMemo(() => {
    if (isLoadingExistingAnswer) {
      return "결과 불러오는 중";
    }

    if (isEnsuringSession || isPending) {
      return "확인 중";
    }

    if (isSubmitted) {
      return "확인 완료";
    }

    return "정답 확인하기";
  }, [isEnsuringSession, isLoadingExistingAnswer, isPending, isSubmitted]);

  const isChoiceLocked =
    isSubmitted || isPending || isEnsuringSession || quiz.alreadyAnswered;
  const isSubmitDisabled =
    selectedIndex === null ||
    isPending ||
    isEnsuringSession ||
    isSubmitted ||
    isLoadingExistingAnswer;

  async function handleSubmitClick() {
    if (selectedIndex === null || isSubmitDisabled) {
      return;
    }

    setSessionMessage(null);
    setIsEnsuringSession(true);

    const result = await ensureAnonymousSession();

    setIsEnsuringSession(false);

    if (result.status === "error") {
      setSessionMessage(result.message);
      return;
    }

    formRef.current?.requestSubmit();
  }

  return (
    <section className="rounded-lg border border-app-line bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill tone="teal">{quiz.category}</StatusPill>
        <StatusPill tone="blue">{difficultyLabel[quiz.difficulty]}</StatusPill>
        <StatusPill>{quiz.quizDate}</StatusPill>
      </div>

      <h2 className="mt-5 text-xl font-bold leading-7 tracking-normal text-app-ink">
        {quiz.question}
      </h2>

      <form ref={formRef} action={formAction} className="mt-5">
        <input type="hidden" name="quiz_id" value={quiz.id} />
        <input type="hidden" name="selected_index" value={selectedIndex ?? ""} />

        <div className="space-y-3">
          {quiz.choices.map((choice) => (
            <ChoiceButton
              key={choice.id}
              choice={choice}
              selectedIndex={selectedIndex}
              answerIndex={answer?.answerIndex ?? null}
              submittedSelectedIndex={answer?.selectedIndex ?? null}
              isSubmitted={isSubmitted}
              isPending={isChoiceLocked}
              isCorrectAnswer={answer?.isCorrect ?? false}
              onSelect={setSelectedIndex}
            />
          ))}
        </div>

        {state.status === "error" ? (
          <div className="mt-4 rounded-lg border border-orange-100 bg-orange-50 p-3 text-sm font-semibold leading-6 text-orange-800">
            {state.message}
          </div>
        ) : null}

        {sessionMessage ? (
          <div className="mt-4 rounded-lg border border-orange-100 bg-orange-50 p-3 text-sm font-semibold leading-6 text-orange-800">
            {sessionMessage}
          </div>
        ) : null}

        <button
          type="button"
          disabled={isSubmitDisabled}
          onClick={handleSubmitClick}
          className="touch-target mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-app-teal px-4 py-3 text-base font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending || isEnsuringSession || isLoadingExistingAnswer ? (
            <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
          ) : (
            <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
          )}
          {submitLabel}
        </button>
      </form>

      {showRecordCta ? (
        <p className="mt-3 text-center text-sm font-semibold text-app-muted">
          <Link href="/login" className="text-app-teal underline-offset-4 hover:underline">
            이메일로 기록 보관하기
          </Link>
          는 선택이에요.
        </p>
      ) : null}

      {answer ? <AnswerResultCard answer={answer} /> : null}
    </section>
  );
}

type ChoiceButtonProps = {
  choice: QuizChoice;
  selectedIndex: number | null;
  answerIndex: number | null;
  submittedSelectedIndex: number | null;
  isSubmitted: boolean;
  isPending: boolean;
  isCorrectAnswer: boolean;
  onSelect: (index: number) => void;
};

function ChoiceButton({
  choice,
  selectedIndex,
  answerIndex,
  submittedSelectedIndex,
  isSubmitted,
  isPending,
  isCorrectAnswer,
  onSelect,
}: ChoiceButtonProps) {
  const isSelected = selectedIndex === choice.id;
  const isAnswer = answerIndex === choice.id;
  const isSubmittedChoice = submittedSelectedIndex === choice.id;
  const isWrongChoice = isSubmitted && isSubmittedChoice && !isCorrectAnswer;

  const Icon = getChoiceIcon({
    isSubmitted,
    isAnswer,
    isWrongChoice,
  });

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => onSelect(choice.id)}
      className={cn(
        "touch-target flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-base font-semibold shadow-sm transition disabled:cursor-default",
        getChoiceClassName({
          isSelected,
          isSubmitted,
          isAnswer,
          isWrongChoice,
        }),
      )}
    >
      <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
      <span>{choice.text}</span>
    </button>
  );
}

function AnswerResultCard({ answer }: { answer: SubmitAnswerData }) {
  return (
    <section className="mt-5 rounded-lg border border-app-line bg-zinc-50 p-4">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white",
            answer.isCorrect ? "text-app-teal" : "text-app-coral",
          )}
        >
          {answer.isCorrect ? (
            <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
          ) : (
            <XCircle aria-hidden="true" className="h-5 w-5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          {answer.alreadyAnswered ? (
            <p className="text-sm font-bold text-app-blue">
              이미 오늘의 퀴즈를 풀었습니다
            </p>
          ) : (
            <p className="text-sm font-bold text-app-muted">제출 완료</p>
          )}
          <h3 className="mt-1 text-lg font-bold tracking-normal text-app-ink">
            {answer.isCorrect ? "정답입니다" : "아쉬워요, 오답입니다"}
          </h3>
          <p className="mt-3 text-sm font-semibold leading-6 text-app-muted">
            {answer.explanation}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs font-semibold text-app-muted">현재 streak</p>
              <p className="mt-1 text-xl font-bold text-app-ink">
                {answer.currentStreak}일
              </p>
            </div>
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs font-semibold text-app-muted">최장 streak</p>
              <p className="mt-1 text-xl font-bold text-app-ink">
                {answer.longestStreak}일
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function getChoiceIcon({
  isSubmitted,
  isAnswer,
  isWrongChoice,
}: {
  isSubmitted: boolean;
  isAnswer: boolean;
  isWrongChoice: boolean;
}) {
  if (isSubmitted && isAnswer) {
    return CheckCircle2;
  }

  if (isWrongChoice) {
    return XCircle;
  }

  return Circle;
}

function getChoiceClassName({
  isSelected,
  isSubmitted,
  isAnswer,
  isWrongChoice,
}: {
  isSelected: boolean;
  isSubmitted: boolean;
  isAnswer: boolean;
  isWrongChoice: boolean;
}) {
  if (isSubmitted && isAnswer) {
    return "border-teal-200 bg-teal-50 text-teal-900";
  }

  if (isWrongChoice) {
    return "border-orange-200 bg-orange-50 text-orange-900";
  }

  if (isSubmitted) {
    return "border-app-line bg-zinc-50 text-app-muted";
  }

  if (isSelected) {
    return "border-teal-200 bg-teal-50 text-teal-900";
  }

  return "border-app-line bg-white text-app-ink hover:border-teal-200 hover:bg-teal-50";
}
