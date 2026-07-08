export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          nickname: string | null;
          current_streak: number;
          longest_streak: number;
          last_answered_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          nickname?: string | null;
          current_streak?: number;
          longest_streak?: number;
          last_answered_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          nickname?: string | null;
          current_streak?: number;
          longest_streak?: number;
          last_answered_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      quizzes: {
        Row: {
          id: string;
          quiz_date: string;
          question: string;
          choices: Json;
          answer_index: number;
          explanation: string;
          category: string;
          difficulty: "easy" | "normal" | "hard";
          status: "draft" | "published" | "archived";
          source: string | null;
          ai_generated: boolean;
          ai_prompt: string | null;
          review_status: "pending" | "approved" | "rejected";
          reviewed_at: string | null;
          review_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quiz_date: string;
          question: string;
          choices: Json;
          answer_index: number;
          explanation: string;
          category: string;
          difficulty: "easy" | "normal" | "hard";
          status?: "draft" | "published" | "archived";
          source?: string | null;
          ai_generated?: boolean;
          ai_prompt?: string | null;
          review_status?: "pending" | "approved" | "rejected";
          reviewed_at?: string | null;
          review_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          quiz_date?: string;
          question?: string;
          choices?: Json;
          answer_index?: number;
          explanation?: string;
          category?: string;
          difficulty?: "easy" | "normal" | "hard";
          status?: "draft" | "published" | "archived";
          source?: string | null;
          ai_generated?: boolean;
          ai_prompt?: string | null;
          review_status?: "pending" | "approved" | "rejected";
          reviewed_at?: string | null;
          review_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_answers: {
        Row: {
          id: string;
          user_id: string;
          quiz_id: string;
          selected_index: number;
          is_correct: boolean;
          answered_at: string;
          answered_date: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_id: string;
          selected_index: number;
          is_correct: boolean;
          answered_at?: string;
          answered_date: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quiz_id?: string;
          selected_index?: number;
          is_correct?: boolean;
          answered_at?: string;
          answered_date?: string;
        };
        Relationships: [];
      };
      admin_users: {
        Row: {
          id: string;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_today_quiz: {
        Args: Record<string, never>;
        Returns: {
          id: string;
          quiz_date: string;
          question: string;
          choices: Json;
          explanation_available: boolean;
          category: string;
          difficulty: "easy" | "normal" | "hard";
          status: "published";
          already_answered: boolean;
          selected_index: number | null;
          is_correct: boolean | null;
          answered_at: string | null;
        }[];
      };
      submit_answer: {
        Args: {
          p_quiz_id: string;
          p_selected_index: number;
        };
        Returns: {
          is_correct: boolean;
          answer_index: number;
          explanation: string;
          current_streak: number;
          longest_streak: number;
          already_answered: boolean;
        }[];
      };
      update_nickname: {
        Args: {
          p_nickname: string;
        };
        Returns: {
          id: string;
          nickname: string;
        }[];
      };
      kst_today: {
        Args: Record<string, never>;
        Returns: string;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
