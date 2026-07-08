import type { SubmitAnswerData, SubmitAnswerErrorCode } from "./api";

export type SubmitAnswerActionState =
  | {
      status: "idle";
    }
  | {
      status: "success";
      answer: SubmitAnswerData;
    }
  | {
      status: "error";
      code: SubmitAnswerErrorCode;
      message: string;
    };

export const initialSubmitAnswerState: SubmitAnswerActionState = {
  status: "idle",
};
