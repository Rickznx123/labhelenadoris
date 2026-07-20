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
      patients: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          full_name: string;
          cpf: string;
          birth_date: string;
          phone: string | null;
          email: string | null;
          sex: "M" | "F" | "O";
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          full_name: string;
          cpf: string;
          birth_date: string;
          phone?: string | null;
          email?: string | null;
          sex: "M" | "F" | "O";
          notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["patients"]["Insert"]>;
      };
      exams: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          patient_id: string;
          exam_type: string;
          exam_date: string;
          status: "pending" | "completed";
          pdf_path: string | null;
          notes: string | null;
          uploaded_by: string | null;
          changed_by: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          patient_id: string;
          exam_type: string;
          exam_date: string;
          status?: "pending" | "completed";
          pdf_path?: string | null;
          notes?: string | null;
          uploaded_by?: string | null;
          changed_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["exams"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          full_name: string;
          role: "admin" | "staff";
          is_active: boolean;
          phone: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          full_name: string;
          role?: "admin" | "staff";
          is_active?: boolean;
          phone?: string | null;
          avatar_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      users: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          role: "admin" | "staff";
          is_active: boolean;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          role?: "admin" | "staff";
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      settings: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          lab_name: string;
          phone: string | null;
          whatsapp: string | null;
          address: string | null;
          logo_url: string | null;
          instagram: string | null;
          facebook: string | null;
          linkedin: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          lab_name: string;
          phone?: string | null;
          whatsapp?: string | null;
          address?: string | null;
          logo_url?: string | null;
          instagram?: string | null;
          facebook?: string | null;
          linkedin?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["settings"]["Insert"]>;
      };
      download_logs: {
        Row: {
          id: string;
          created_at: string;
          exam_id: string;
          ip_address: string | null;
          user_agent: string | null;
          downloaded_by: string | null;
          requested_by_cpf: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          exam_id: string;
          ip_address?: string | null;
          user_agent?: string | null;
          downloaded_by?: string | null;
          requested_by_cpf?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["download_logs"]["Insert"]>;
      };
      audit_logs: {
        Row: {
          id: string;
          created_at: string;
          actor_id: string | null;
          actor_role: string | null;
          action: string;
          table_name: string;
          record_id: string | null;
          meta: Json;
          ip_address: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          actor_id?: string | null;
          actor_role?: string | null;
          action: string;
          table_name: string;
          record_id?: string | null;
          meta?: Json;
          ip_address?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
      };
      exam_results: {
        Row: {
          id: string;
          patient_name: string;
          patient_cpf: string;
          birth_date: string;
          exam_name: string;
          exam_date: string;
          pdf_path: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_name: string;
          patient_cpf: string;
          birth_date: string;
          exam_name: string;
          exam_date: string;
          pdf_path: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["exam_results"]["Insert"]>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      exam_status: "pending" | "completed";
      profile_role: "admin" | "staff";
      sex_type: "M" | "F" | "O";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
