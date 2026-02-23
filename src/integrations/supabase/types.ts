export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          content: string
          created_at: string
          faqs: Json | null
          featured_image_url: string | null
          id: string
          meta_description: string | null
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["blog_post_status"]
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          faqs?: Json | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["blog_post_status"]
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          faqs?: Json | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["blog_post_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_settings: {
        Row: {
          generation_frequency: Database["public"]["Enums"]["blog_generation_frequency"]
          id: string
          last_generated_at: string | null
          next_topic: string | null
          updated_at: string
        }
        Insert: {
          generation_frequency?: Database["public"]["Enums"]["blog_generation_frequency"]
          id?: string
          last_generated_at?: string | null
          next_topic?: string | null
          updated_at?: string
        }
        Update: {
          generation_frequency?: Database["public"]["Enums"]["blog_generation_frequency"]
          id?: string
          last_generated_at?: string | null
          next_topic?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      estimate_submissions: {
        Row: {
          baseboard: string | null
          boiler_access: string | null
          boiler_size: string | null
          boiler_types: string[] | null
          buried_price_additional: string | null
          buried_tank_size: string[] | null
          chimney_lined_notes: string | null
          cost_of_job: string | null
          created_at: string
          customer: string
          customer_responsible_for_tank: string | null
          email: string
          existing_chimney_lined: string | null
          exterior_275_removal: string | null
          exterior_price_additional: string | null
          gas_in_house: string | null
          gas_needed_for: string[] | null
          gas_notes: string | null
          id: string
          interior_price_additional: string | null
          interior_tank_behind_wall: string | null
          interior_tank_removed: string | null
          meter_location: string | null
          number_of_zones: string | null
          photos: string[] | null
          pump_and_foam: string | null
          status: Database["public"]["Enums"]["submission_status"]
          steam_system: string | null
          tank_notes: string | null
          tank_sand: string | null
          thermostats_included: string | null
          vent_location: string | null
          vent_location_notes: string | null
          zone_size: string | null
        }
        Insert: {
          baseboard?: string | null
          boiler_access?: string | null
          boiler_size?: string | null
          boiler_types?: string[] | null
          buried_price_additional?: string | null
          buried_tank_size?: string[] | null
          chimney_lined_notes?: string | null
          cost_of_job?: string | null
          created_at?: string
          customer: string
          customer_responsible_for_tank?: string | null
          email: string
          existing_chimney_lined?: string | null
          exterior_275_removal?: string | null
          exterior_price_additional?: string | null
          gas_in_house?: string | null
          gas_needed_for?: string[] | null
          gas_notes?: string | null
          id?: string
          interior_price_additional?: string | null
          interior_tank_behind_wall?: string | null
          interior_tank_removed?: string | null
          meter_location?: string | null
          number_of_zones?: string | null
          photos?: string[] | null
          pump_and_foam?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          steam_system?: string | null
          tank_notes?: string | null
          tank_sand?: string | null
          thermostats_included?: string | null
          vent_location?: string | null
          vent_location_notes?: string | null
          zone_size?: string | null
        }
        Update: {
          baseboard?: string | null
          boiler_access?: string | null
          boiler_size?: string | null
          boiler_types?: string[] | null
          buried_price_additional?: string | null
          buried_tank_size?: string[] | null
          chimney_lined_notes?: string | null
          cost_of_job?: string | null
          created_at?: string
          customer?: string
          customer_responsible_for_tank?: string | null
          email?: string
          existing_chimney_lined?: string | null
          exterior_275_removal?: string | null
          exterior_price_additional?: string | null
          gas_in_house?: string | null
          gas_needed_for?: string[] | null
          gas_notes?: string | null
          id?: string
          interior_price_additional?: string | null
          interior_tank_behind_wall?: string | null
          interior_tank_removed?: string | null
          meter_location?: string | null
          number_of_zones?: string | null
          photos?: string[] | null
          pump_and_foam?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          steam_system?: string | null
          tank_notes?: string | null
          tank_sand?: string | null
          thermostats_included?: string | null
          vent_location?: string | null
          vent_location_notes?: string | null
          zone_size?: string | null
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          caption: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          author_name: string
          author_photo_url: string | null
          category: string | null
          created_at: string
          google_review_id: string | null
          id: string
          location: string | null
          rating: number
          rejected_reason: string | null
          review_date: string | null
          source: Database["public"]["Enums"]["review_source"]
          status: Database["public"]["Enums"]["review_status"]
          text: string
          title: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          author_name: string
          author_photo_url?: string | null
          category?: string | null
          created_at?: string
          google_review_id?: string | null
          id?: string
          location?: string | null
          rating: number
          rejected_reason?: string | null
          review_date?: string | null
          source?: Database["public"]["Enums"]["review_source"]
          status?: Database["public"]["Enums"]["review_status"]
          text: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          author_name?: string
          author_photo_url?: string | null
          category?: string | null
          created_at?: string
          google_review_id?: string | null
          id?: string
          location?: string | null
          rating?: number
          rejected_reason?: string | null
          review_date?: string | null
          source?: Database["public"]["Enums"]["review_source"]
          status?: Database["public"]["Enums"]["review_status"]
          text?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      slideshow_items: {
        Row: {
          alt_text: string | null
          created_at: string
          display_order: number
          duration_seconds: number
          file_url: string
          id: string
          is_active: boolean
          is_default_first: boolean
          link_url: string | null
          overlay_text: string | null
          overlay_title: string | null
          type: string
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          display_order?: number
          duration_seconds?: number
          file_url: string
          id?: string
          is_active?: boolean
          is_default_first?: boolean
          link_url?: string | null
          overlay_text?: string | null
          overlay_title?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          display_order?: number
          duration_seconds?: number
          file_url?: string
          id?: string
          is_active?: boolean
          is_default_first?: boolean
          link_url?: string | null
          overlay_text?: string | null
          overlay_title?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      survey_submissions: {
        Row: {
          additional_comments: string | null
          areas_to_improve: string | null
          comfortable_with_tech: string | null
          communication: string | null
          consider_installation: string | null
          created_at: string
          customer_name: string
          email: string
          estimate_overpriced: string | null
          id: string
          overall_satisfaction: string | null
          phone: string | null
          professionalism: string | null
          quality_of_work: string | null
          satisfied_with_recommendation: string | null
          service_date: string | null
          status: Database["public"]["Enums"]["submission_status"]
          technician_name: string | null
          timeliness: string | null
          use_again: string | null
          value_for_money: string | null
          were_we_professional: string | null
          what_did_well: string | null
          would_recommend: string | null
        }
        Insert: {
          additional_comments?: string | null
          areas_to_improve?: string | null
          comfortable_with_tech?: string | null
          communication?: string | null
          consider_installation?: string | null
          created_at?: string
          customer_name: string
          email: string
          estimate_overpriced?: string | null
          id?: string
          overall_satisfaction?: string | null
          phone?: string | null
          professionalism?: string | null
          quality_of_work?: string | null
          satisfied_with_recommendation?: string | null
          service_date?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          technician_name?: string | null
          timeliness?: string | null
          use_again?: string | null
          value_for_money?: string | null
          were_we_professional?: string | null
          what_did_well?: string | null
          would_recommend?: string | null
        }
        Update: {
          additional_comments?: string | null
          areas_to_improve?: string | null
          comfortable_with_tech?: string | null
          communication?: string | null
          consider_installation?: string | null
          created_at?: string
          customer_name?: string
          email?: string
          estimate_overpriced?: string | null
          id?: string
          overall_satisfaction?: string | null
          phone?: string | null
          professionalism?: string | null
          quality_of_work?: string | null
          satisfied_with_recommendation?: string | null
          service_date?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          technician_name?: string | null
          timeliness?: string | null
          use_again?: string | null
          value_for_money?: string | null
          were_we_professional?: string | null
          what_did_well?: string | null
          would_recommend?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      work_order_submissions: {
        Row: {
          apt_number: string | null
          billing_status: string | null
          created_at: string
          customer_name: string
          email: string
          email_to: string | null
          error_code: string | null
          hours_on_job: string | null
          id: string
          job_completed: string | null
          job_date: string | null
          job_description: string
          make_model: string | null
          parts_under_warranty: string | null
          payment_method: string | null
          phone: string
          photos: string[] | null
          recommendations: string | null
          rga_navien_tech: string | null
          serial_number: string | null
          status: Database["public"]["Enums"]["submission_status"]
          street_address: string
          tech_on_job: string | null
          total_charges: string | null
          water_sampling_ph: string | null
          zip_code: string
        }
        Insert: {
          apt_number?: string | null
          billing_status?: string | null
          created_at?: string
          customer_name: string
          email: string
          email_to?: string | null
          error_code?: string | null
          hours_on_job?: string | null
          id?: string
          job_completed?: string | null
          job_date?: string | null
          job_description: string
          make_model?: string | null
          parts_under_warranty?: string | null
          payment_method?: string | null
          phone: string
          photos?: string[] | null
          recommendations?: string | null
          rga_navien_tech?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          street_address: string
          tech_on_job?: string | null
          total_charges?: string | null
          water_sampling_ph?: string | null
          zip_code: string
        }
        Update: {
          apt_number?: string | null
          billing_status?: string | null
          created_at?: string
          customer_name?: string
          email?: string
          email_to?: string | null
          error_code?: string | null
          hours_on_job?: string | null
          id?: string
          job_completed?: string | null
          job_date?: string | null
          job_description?: string
          make_model?: string | null
          parts_under_warranty?: string | null
          payment_method?: string | null
          phone?: string
          photos?: string[] | null
          recommendations?: string | null
          rga_navien_tech?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          street_address?: string
          tech_on_job?: string | null
          total_charges?: string | null
          water_sampling_ph?: string | null
          zip_code?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      blog_generation_frequency: "weekly" | "biweekly" | "monthly" | "quarterly"
      blog_post_status: "draft" | "published" | "rejected"
      review_source: "google" | "manual" | "imported" | "website"
      review_status: "pending" | "approved" | "rejected"
      submission_status: "new" | "reviewed" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      blog_generation_frequency: ["weekly", "biweekly", "monthly", "quarterly"],
      blog_post_status: ["draft", "published", "rejected"],
      review_source: ["google", "manual", "imported", "website"],
      review_status: ["pending", "approved", "rejected"],
      submission_status: ["new", "reviewed", "archived"],
    },
  },
} as const
