import {
  Archive,
  Check,
  Edit3,
  Plus,
  Save,
  WandSparkles,
} from "lucide-react";
import {
  archiveAdminQuizFormAction,
  createAdminQuizFormAction,
  updateAdminQuizFormAction,
} from "@/features/admin/actions";
import { cn } from "@/lib/cn";
import type { AdminQuizItem, QuizDifficulty, QuizStatus } from "@/types/quiz";
import { StatusPill } from "@/components/ui/status-pill";

type AdminQuizManagerProps = {
  quizzes: AdminQuizItem[];
  defaultQuizDate: string;
  noticeMessage: string | null;
  errorMessage: string | null;
};

type QuizFormMode = "create" | "edit";

const difficultyLabel: Record<QuizDifficulty, string> = {
  easy: "쉬움",
  normal: "보통",
  hard: "어려움",
};

const statusTone: Record<QuizStatus, "gray" | "teal" | "coral"> = {
  draft: "gray",
  published: "teal",
  archived: "coral",
};

const reviewLabel = {
  pending: "검수 대기",
  approved: "승인",
  rejected: "반려",
};

export function AdminQuizManager({
  quizzes,
  defaultQuizDate,
  noticeMessage,
  errorMessage,
}: AdminQuizManagerProps) {
  return (
    <div className="space-y-4">
      <ActionMessage message={noticeMessage} tone="success" />
      <ActionMessage message={errorMessage} tone="error" />

      <section className="grid grid-cols-2 gap-3">
        <details className="group col-span-1">
          <summary className="touch-target flex cursor-pointer list-none items-center justify-center gap-2 rounded-lg bg-app-teal px-3 py-3 text-sm font-bold text-white marker:hidden">
            <Plus aria-hidden="true" className="h-5 w-5" />
            새 퀴즈
          </summary>
          <div className="col-span-2 mt-3 rounded-lg border border-app-line bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-app-ink">
              새 퀴즈 등록
            </h2>
            <QuizForm
              mode="create"
              action={createAdminQuizFormAction}
              defaultQuizDate={defaultQuizDate}
            />
          </div>
        </details>

        <button
          type="button"
          disabled
          className="touch-target inline-flex items-center justify-center gap-2 rounded-lg border border-app-line bg-white px-3 py-3 text-sm font-bold text-app-muted opacity-70"
        >
          <WandSparkles aria-hidden="true" className="h-5 w-5 text-app-coral" />
          AI 생성 준비중
        </button>
      </section>

      <div className="space-y-3">
        {quizzes.length === 0 ? (
          <section className="rounded-lg border border-app-line bg-white p-5 text-center shadow-sm">
            <p className="text-sm font-semibold text-app-muted">
              등록된 퀴즈가 없습니다.
            </p>
          </section>
        ) : null}

        {quizzes.map((quiz) => (
          <section
            key={quiz.id}
            className="rounded-lg border border-app-line bg-white p-4 shadow-sm"
          >
            <QuizCard quiz={quiz} />
          </section>
        ))}
      </div>
    </div>
  );
}

function QuizCard({ quiz }: { quiz: AdminQuizItem }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill tone={statusTone[quiz.status]}>{quiz.status}</StatusPill>
        <StatusPill tone={quiz.aiGenerated ? "coral" : "blue"}>
          {quiz.aiGenerated ? "AI 생성" : "수동 등록"}
        </StatusPill>
        <StatusPill>{reviewLabel[quiz.reviewStatus]}</StatusPill>
        <StatusPill tone="blue">{difficultyLabel[quiz.difficulty]}</StatusPill>
      </div>
      <p className="mt-3 text-sm font-semibold text-app-muted">
        {quiz.quizDate} · {quiz.category}
      </p>
      <h2 className="mt-2 text-base font-bold leading-6 text-app-ink">
        {quiz.question}
      </h2>
      <ol className="mt-3 space-y-2">
        {quiz.choices.map((choice) => (
          <li
            key={choice.id}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-semibold",
              quiz.answerIndex === choice.id
                ? "border-teal-200 bg-teal-50 text-teal-900"
                : "border-app-line bg-zinc-50 text-app-muted",
            )}
          >
            {choice.id + 1}. {choice.text}
            {quiz.answerIndex === choice.id ? " · 정답" : ""}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm font-semibold leading-6 text-app-muted">
        {quiz.explanation}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <details className="col-span-1">
          <summary className="touch-target flex cursor-pointer list-none items-center justify-center gap-2 rounded-lg border border-app-line bg-white px-3 py-3 text-sm font-bold text-app-ink marker:hidden">
            <Edit3 aria-hidden="true" className="h-4 w-4" />
            수정
          </summary>
          <div className="col-span-2 mt-3 rounded-lg border border-app-line bg-zinc-50 p-3">
            <QuizForm
              mode="edit"
              action={updateAdminQuizFormAction}
              quiz={quiz}
              defaultQuizDate={quiz.quizDate}
            />
          </div>
        </details>
        <form action={archiveAdminQuizFormAction}>
          <input type="hidden" name="id" value={quiz.id} />
          <button
            type="submit"
            disabled={quiz.status === "archived"}
            className="touch-target inline-flex w-full items-center justify-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-3 py-3 text-sm font-bold text-orange-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Archive aria-hidden="true" className="h-4 w-4" />
            보관 처리
          </button>
        </form>
      </div>
    </div>
  );
}

function QuizForm({
  mode,
  action,
  quiz,
  defaultQuizDate,
}: {
  mode: QuizFormMode;
  action: (formData: FormData) => void;
  quiz?: AdminQuizItem;
  defaultQuizDate: string;
}) {
  const choices = quiz?.choices ?? [
    { id: 0, text: "" },
    { id: 1, text: "" },
    { id: 2, text: "" },
    { id: 3, text: "" },
  ];

  return (
    <form action={action} className="space-y-4">
      {mode === "edit" && quiz ? (
        <input type="hidden" name="id" value={quiz.id} />
      ) : null}

      <div className="grid grid-cols-1 gap-3">
        <TextField
          label="퀴즈 날짜"
          name="quiz_date"
          type="date"
          defaultValue={quiz?.quizDate ?? defaultQuizDate}
          required
        />
        <TextField
          label="질문"
          name="question"
          defaultValue={quiz?.question ?? ""}
          required
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-bold text-app-ink">선택지</p>
        {choices.map((choice) => (
          <TextField
            key={choice.id}
            label={`${choice.id + 1}번`}
            name={`choice_${choice.id}`}
            defaultValue={choice.text}
            required
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3">
        <SelectField
          label="정답"
          name="answer_index"
          defaultValue={String(quiz?.answerIndex ?? 0)}
          options={[
            ["0", "1번"],
            ["1", "2번"],
            ["2", "3번"],
            ["3", "4번"],
          ]}
        />
        <TextAreaField
          label="해설"
          name="explanation"
          defaultValue={quiz?.explanation ?? ""}
          required
        />
        <TextField
          label="카테고리"
          name="category"
          defaultValue={quiz?.category ?? ""}
          required
        />
        <SelectField
          label="난이도"
          name="difficulty"
          defaultValue={quiz?.difficulty ?? "normal"}
          options={[
            ["easy", "easy"],
            ["normal", "normal"],
            ["hard", "hard"],
          ]}
        />
        <SelectField
          label="상태"
          name="status"
          defaultValue={quiz?.status ?? "draft"}
          options={[
            ["draft", "draft"],
            ["published", "published"],
            ["archived", "archived"],
          ]}
        />
        <TextField
          label="출처"
          name="source"
          defaultValue={quiz?.source ?? ""}
          placeholder="선택 입력"
        />
      </div>

      {quiz?.aiGenerated ? (
        <p className="rounded-lg bg-app-soft px-3 py-2 text-xs font-semibold leading-5 text-app-muted">
          AI 생성 퀴즈는 검수 상태가 승인이고 검수 시간이 기록된 경우에만
          published로 변경할 수 있습니다.
        </p>
      ) : null}

      <button
        type="submit"
        className="touch-target inline-flex w-full items-center justify-center gap-2 rounded-lg bg-app-teal px-4 py-3 text-base font-bold text-white shadow-sm"
      >
        {mode === "create" ? (
          <Plus aria-hidden="true" className="h-5 w-5" />
        ) : (
          <Save aria-hidden="true" className="h-5 w-5" />
        )}
        {mode === "create" ? "저장" : "수정"}
      </button>
    </form>
  );
}

function TextField({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-app-ink">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="touch-target mt-2 w-full rounded-lg border border-app-line bg-white px-3 py-3 text-sm font-semibold text-app-ink shadow-sm placeholder:text-zinc-400"
      />
    </label>
  );
}

function TextAreaField({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-app-ink">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={4}
        className="mt-2 w-full resize-none rounded-lg border border-app-line bg-white px-3 py-3 text-sm font-semibold leading-6 text-app-ink shadow-sm"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: Array<[string, string]>;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-app-ink">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="touch-target mt-2 w-full rounded-lg border border-app-line bg-white px-3 py-3 text-sm font-semibold text-app-ink shadow-sm"
      >
        {options.map(([value, labelText]) => (
          <option key={value} value={value}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}

function ActionMessage({
  message,
  tone,
}: {
  message: string | null;
  tone: "success" | "error";
}) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-semibold leading-6",
        tone === "success"
          ? "bg-teal-50 text-teal-900"
          : "bg-orange-50 text-orange-900",
      )}
    >
      {tone === "success" ? (
        <Check aria-hidden="true" className="mr-1 inline h-4 w-4" />
      ) : null}
      {message}
    </p>
  );
}
