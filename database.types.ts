export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      adminuseraccount: {
        Row: {
          created_at: string
          email: string
          id: string
          user_id: string
          user_role: Database["public"]["Enums"]["user-role"]
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          user_id?: string
          user_role?: Database["public"]["Enums"]["user-role"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          user_id?: string
          user_role?: Database["public"]["Enums"]["user-role"]
        }
        Relationships: []
      }
      contactentries: {
        Row: {
          company: string | null
          company_size: string | null
          country: string | null
          description: string | null
          email: string | null
          id: string
          inserted_at: string
          name: string | null
          phone: number | null
          referral: string | null
          subject: string | null
        }
        Insert: {
          company?: string | null
          company_size?: string | null
          country?: string | null
          description?: string | null
          email?: string | null
          id?: string
          inserted_at?: string
          name?: string | null
          phone?: number | null
          referral?: string | null
          subject?: string | null
        }
        Update: {
          company?: string | null
          company_size?: string | null
          country?: string | null
          description?: string | null
          email?: string | null
          id?: string
          inserted_at?: string
          name?: string | null
          phone?: number | null
          referral?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          always_approve: boolean
          banner_image: string
          created_at: string
          description: string
          end_date: string
          event_type: Database["public"]["Enums"]["event-type"] | null
          id: string
          is_featured: boolean | null
          more_info: string | null
          more_info_text: string | null
          publish_date: string
          rules: string | null
          slug: string
          start_date: string
          tags: string[]
          title: string
          typeform_config: Json
          venue: string
        }
        Insert: {
          always_approve?: boolean
          banner_image: string
          created_at?: string
          description: string
          end_date: string
          event_type?: Database["public"]["Enums"]["event-type"] | null
          id?: string
          is_featured?: boolean | null
          more_info?: string | null
          more_info_text?: string | null
          publish_date: string
          rules?: string | null
          slug?: string
          start_date: string
          tags: string[]
          title: string
          typeform_config: Json
          venue: string
        }
        Update: {
          always_approve?: boolean
          banner_image?: string
          created_at?: string
          description?: string
          end_date?: string
          event_type?: Database["public"]["Enums"]["event-type"] | null
          id?: string
          is_featured?: boolean | null
          more_info?: string | null
          more_info_text?: string | null
          publish_date?: string
          rules?: string | null
          slug?: string
          start_date?: string
          tags?: string[]
          title?: string
          typeform_config?: Json
          venue?: string
        }
        Relationships: []
      }
      eventsregistrations: {
        Row: {
          application_id: string
          attendance: Database["public"]["Enums"]["attendance"]
          created_at: string
          details: Json
          event_id: string
          event_title: string
          id: string
          is_approved: Database["public"]["Enums"]["registration-status"]
          registration_email: string
          ticket_id: number
        }
        Insert: {
          application_id?: string
          attendance?: Database["public"]["Enums"]["attendance"]
          created_at?: string
          details: Json
          event_id?: string
          event_title: string
          id?: string
          is_approved?: Database["public"]["Enums"]["registration-status"]
          registration_email: string
          ticket_id?: number
        }
        Update: {
          application_id?: string
          attendance?: Database["public"]["Enums"]["attendance"]
          created_at?: string
          details?: Json
          event_id?: string
          event_title?: string
          id?: string
          is_approved?: Database["public"]["Enums"]["registration-status"]
          registration_email?: string
          ticket_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "eventsregistrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author: string
          author_image: string
          content: string
          created_at: string
          id: number
          image: string
          published_at: string
          slug: string
          summary: string
          tag: Database["public"]["Enums"]["blog-post-types"] | null
          title: string
        }
        Insert: {
          author: string
          author_image?: string
          content: string
          created_at?: string
          id?: never
          image: string
          published_at?: string
          slug: string
          summary: string
          tag?: Database["public"]["Enums"]["blog-post-types"] | null
          title: string
        }
        Update: {
          author?: string
          author_image?: string
          content?: string
          created_at?: string
          id?: never
          image?: string
          published_at?: string
          slug?: string
          summary?: string
          tag?: Database["public"]["Enums"]["blog-post-types"] | null
          title?: string
        }
        Relationships: []
      }
      team: {
        Row: {
          created_at: string
          id: number
          image: string | null
          join_date: string | null
          name: string | null
          position: string | null
          rollno: string | null
          socials: Json | null
          tagline: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          image?: string | null
          join_date?: string | null
          name?: string | null
          position?: string | null
          rollno?: string | null
          socials?: Json | null
          tagline?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          image?: string | null
          join_date?: string | null
          name?: string | null
          position?: string | null
          rollno?: string | null
          socials?: Json | null
          tagline?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_event_registrations: {
        Args: Record<PropertyKey, never>
        Returns: {
          registration_id: string
          created_at: string
          ticket_id: number
          event_id: string
          event_title_from_registration: string
          application_id: string
          details: Json
          is_approved: boolean
          attendance: Database["public"]["Enums"]["attendance"]
          event_slug: string
          user_email: string
        }[]
      }
      mark_attendance: {
        Args: {
          registration_id: string
        }
        Returns: undefined
      }
      reset_attendance: {
        Args: {
          input_event_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      attendance: "Present" | "Absent"
      "blog-post-types":
        | "SuccessStories"
        | "StudentEntrepreneurs"
        | "TechInnovation"
        | "StartupTips"
        | "Technical"
        | "Projects"
        | "Hackathons"
        | "Foundathon"
        | "Ideathon"
        | "OpenHouse"
        | "Other"
      "event-type": "online" | "offline" | "hybrid"
      "registration-status": "SUBMITTED" | "ACCEPTED" | "REJECTED" | "INVALID"
      "user-role": "user" | "moderator" | "admin" | "owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
