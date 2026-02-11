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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          changed_from: Json | null
          changed_to: Json | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          is_suspicious: boolean | null
          metadata: Json | null
          security_level: string | null
          session_id: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changed_from?: Json | null
          changed_to?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          is_suspicious?: boolean | null
          metadata?: Json | null
          security_level?: string | null
          session_id?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changed_from?: Json | null
          changed_to?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          is_suspicious?: boolean | null
          metadata?: Json | null
          security_level?: string | null
          session_id?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      api_integrations: {
        Row: {
          api_key_encrypted: string | null
          api_secret_encrypted: string | null
          config: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          integration_name: string
          integration_type: string | null
          is_active: boolean | null
          is_sandbox: boolean | null
          last_sync_at: string | null
          provider: string | null
          updated_at: string | null
          webhook_secret: string | null
          webhook_url: string | null
        }
        Insert: {
          api_key_encrypted?: string | null
          api_secret_encrypted?: string | null
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          integration_name: string
          integration_type?: string | null
          is_active?: boolean | null
          is_sandbox?: boolean | null
          last_sync_at?: string | null
          provider?: string | null
          updated_at?: string | null
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          api_key_encrypted?: string | null
          api_secret_encrypted?: string | null
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          integration_name?: string
          integration_type?: string | null
          is_active?: boolean | null
          is_sandbox?: boolean | null
          last_sync_at?: string | null
          provider?: string | null
          updated_at?: string | null
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_integrations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      approval_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          expires_at: string | null
          id: string
          priority: string | null
          reason: string
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          request_data: Json | null
          request_type: string
          requested_by: string
          staff_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          expires_at?: string | null
          id?: string
          priority?: string | null
          reason: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          request_data?: Json | null
          request_type: string
          requested_by: string
          staff_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          expires_at?: string | null
          id?: string
          priority?: string | null
          reason?: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          request_data?: Json | null
          request_type?: string
          requested_by?: string
          staff_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          attendance_source: string | null
          check_in_time: string | null
          check_out_time: string | null
          created_at: string | null
          date: string
          exception_type: string | null
          half_day_type: string | null
          has_exception: boolean | null
          hours_worked: number | null
          id: string
          is_half_day: boolean | null
          location_check_in: string | null
          location_check_out: string | null
          marked_by: string | null
          notes: string | null
          overtime_hours: number | null
          selfie_url: string | null
          staff_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          attendance_source?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          date: string
          exception_type?: string | null
          half_day_type?: string | null
          has_exception?: boolean | null
          hours_worked?: number | null
          id?: string
          is_half_day?: boolean | null
          location_check_in?: string | null
          location_check_out?: string | null
          marked_by?: string | null
          notes?: string | null
          overtime_hours?: number | null
          selfie_url?: string | null
          staff_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          attendance_source?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          date?: string
          exception_type?: string | null
          half_day_type?: string | null
          has_exception?: boolean | null
          hours_worked?: number | null
          id?: string
          is_half_day?: boolean | null
          location_check_in?: string | null
          location_check_out?: string | null
          marked_by?: string | null
          notes?: string | null
          overtime_hours?: number | null
          selfie_url?: string | null
          staff_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_marked_by_fkey"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_locks: {
        Row: {
          date: string
          employer_id: string
          id: string
          locked_at: string | null
          locked_by: string
          notes: string | null
        }
        Insert: {
          date: string
          employer_id: string
          id?: string
          locked_at?: string | null
          locked_by: string
          notes?: string | null
        }
        Update: {
          date?: string
          employer_id?: string
          id?: string
          locked_at?: string | null
          locked_by?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_locks_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_locks_locked_by_fkey"
            columns: ["locked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_trail: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          field_name: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          new_value: string | null
          old_value: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          field_name?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          field_name?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_trail_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      auto_reorder_rules: {
        Row: {
          created_at: string | null
          id: string
          is_enabled: boolean | null
          last_order_id: string | null
          last_triggered_at: string | null
          preferred_supplier_name: string | null
          product_id: string
          reorder_point: number
          reorder_quantity: number
          supplier_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          last_order_id?: string | null
          last_triggered_at?: string | null
          preferred_supplier_name?: string | null
          product_id: string
          reorder_point?: number
          reorder_quantity?: number
          supplier_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          last_order_id?: string | null
          last_triggered_at?: string | null
          preferred_supplier_name?: string | null
          product_id?: string
          reorder_point?: number
          reorder_quantity?: number
          supplier_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auto_reorder_rules_last_order_id_fkey"
            columns: ["last_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auto_reorder_rules_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auto_reorder_rules_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "wholesalers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auto_reorder_rules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      available_leads: {
        Row: {
          budget_range: string | null
          carpet_area_sqft: number | null
          created_at: string | null
          credit_cost: number | null
          current_purchases: number | null
          customer_city: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          customer_pincode: string | null
          customer_state: string | null
          estimated_budget: number | null
          expires_at: string | null
          id: string
          is_premium: boolean | null
          is_verified: boolean | null
          max_purchases: number | null
          preferred_style: string | null
          price_override: number | null
          project_city: string | null
          project_location: string | null
          project_pincode: string | null
          project_type: string | null
          property_type: string | null
          quality_score: number | null
          requirements_summary: string | null
          reserved_until: string | null
          source: string
          source_reference: string | null
          status: string | null
          submitted_at: string | null
          timeline: string | null
          updated_at: string | null
          verification_date: string | null
          verified_by: string | null
        }
        Insert: {
          budget_range?: string | null
          carpet_area_sqft?: number | null
          created_at?: string | null
          credit_cost?: number | null
          current_purchases?: number | null
          customer_city?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          customer_pincode?: string | null
          customer_state?: string | null
          estimated_budget?: number | null
          expires_at?: string | null
          id?: string
          is_premium?: boolean | null
          is_verified?: boolean | null
          max_purchases?: number | null
          preferred_style?: string | null
          price_override?: number | null
          project_city?: string | null
          project_location?: string | null
          project_pincode?: string | null
          project_type?: string | null
          property_type?: string | null
          quality_score?: number | null
          requirements_summary?: string | null
          reserved_until?: string | null
          source: string
          source_reference?: string | null
          status?: string | null
          submitted_at?: string | null
          timeline?: string | null
          updated_at?: string | null
          verification_date?: string | null
          verified_by?: string | null
        }
        Update: {
          budget_range?: string | null
          carpet_area_sqft?: number | null
          created_at?: string | null
          credit_cost?: number | null
          current_purchases?: number | null
          customer_city?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          customer_pincode?: string | null
          customer_state?: string | null
          estimated_budget?: number | null
          expires_at?: string | null
          id?: string
          is_premium?: boolean | null
          is_verified?: boolean | null
          max_purchases?: number | null
          preferred_style?: string | null
          price_override?: number | null
          project_city?: string | null
          project_location?: string | null
          project_pincode?: string | null
          project_type?: string | null
          property_type?: string | null
          quality_score?: number | null
          requirements_summary?: string | null
          reserved_until?: string | null
          source?: string
          source_reference?: string | null
          status?: string | null
          submitted_at?: string | null
          timeline?: string | null
          updated_at?: string | null
          verification_date?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "available_leads_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_history: {
        Row: {
          backup_location: string | null
          backup_type: string | null
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          file_size: number | null
          id: string
          initiated_by: string | null
          metadata: Json | null
          status: string | null
        }
        Insert: {
          backup_location?: string | null
          backup_type?: string | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          file_size?: number | null
          id?: string
          initiated_by?: string | null
          metadata?: Json | null
          status?: string | null
        }
        Update: {
          backup_location?: string | null
          backup_type?: string | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          file_size?: number | null
          id?: string
          initiated_by?: string | null
          metadata?: Json | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "backup_history_initiated_by_fkey"
            columns: ["initiated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_logs: {
        Row: {
          backup_file_path: string | null
          backup_file_url: string | null
          backup_size_mb: number | null
          backup_status: string | null
          backup_type: string | null
          completed_at: string | null
          created_at: string | null
          duration_seconds: number | null
          error_details: Json | null
          error_message: string | null
          id: string
          is_restorable: boolean | null
          metadata: Json | null
          records_count: number | null
          restore_point_name: string | null
          started_at: string | null
          tables_included: string[] | null
          user_id: string
        }
        Insert: {
          backup_file_path?: string | null
          backup_file_url?: string | null
          backup_size_mb?: number | null
          backup_status?: string | null
          backup_type?: string | null
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          error_details?: Json | null
          error_message?: string | null
          id?: string
          is_restorable?: boolean | null
          metadata?: Json | null
          records_count?: number | null
          restore_point_name?: string | null
          started_at?: string | null
          tables_included?: string[] | null
          user_id: string
        }
        Update: {
          backup_file_path?: string | null
          backup_file_url?: string | null
          backup_size_mb?: number | null
          backup_status?: string | null
          backup_type?: string | null
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          error_details?: Json | null
          error_message?: string | null
          id?: string
          is_restorable?: boolean | null
          metadata?: Json | null
          records_count?: number | null
          restore_point_name?: string | null
          started_at?: string | null
          tables_included?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      broadcast_recipients: {
        Row: {
          broadcast_id: string
          created_at: string | null
          customer_id: string
          email_clicked_at: string | null
          email_error: string | null
          email_opened_at: string | null
          email_sent_at: string | null
          email_status: string | null
          id: string
          overall_status: string | null
          push_error: string | null
          push_opened_at: string | null
          push_sent_at: string | null
          push_status: string | null
          sms_delivered_at: string | null
          sms_error: string | null
          sms_sent_at: string | null
          sms_status: string | null
          updated_at: string | null
          whatsapp_delivered_at: string | null
          whatsapp_error: string | null
          whatsapp_sent_at: string | null
          whatsapp_status: string | null
        }
        Insert: {
          broadcast_id: string
          created_at?: string | null
          customer_id: string
          email_clicked_at?: string | null
          email_error?: string | null
          email_opened_at?: string | null
          email_sent_at?: string | null
          email_status?: string | null
          id?: string
          overall_status?: string | null
          push_error?: string | null
          push_opened_at?: string | null
          push_sent_at?: string | null
          push_status?: string | null
          sms_delivered_at?: string | null
          sms_error?: string | null
          sms_sent_at?: string | null
          sms_status?: string | null
          updated_at?: string | null
          whatsapp_delivered_at?: string | null
          whatsapp_error?: string | null
          whatsapp_sent_at?: string | null
          whatsapp_status?: string | null
        }
        Update: {
          broadcast_id?: string
          created_at?: string | null
          customer_id?: string
          email_clicked_at?: string | null
          email_error?: string | null
          email_opened_at?: string | null
          email_sent_at?: string | null
          email_status?: string | null
          id?: string
          overall_status?: string | null
          push_error?: string | null
          push_opened_at?: string | null
          push_sent_at?: string | null
          push_status?: string | null
          sms_delivered_at?: string | null
          sms_error?: string | null
          sms_sent_at?: string | null
          sms_status?: string | null
          updated_at?: string | null
          whatsapp_delivered_at?: string | null
          whatsapp_error?: string | null
          whatsapp_sent_at?: string | null
          whatsapp_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "broadcast_recipients_broadcast_id_fkey"
            columns: ["broadcast_id"]
            isOneToOne: false
            referencedRelation: "digital_broadcasts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broadcast_recipients_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcast_templates: {
        Row: {
          available_placeholders: string[] | null
          created_at: string | null
          default_image_url: string | null
          default_product_link: string | null
          id: string
          is_active: boolean | null
          last_used_at: string | null
          message_template: string
          subject_template: string | null
          template_category: string
          template_name: string
          updated_at: string | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          available_placeholders?: string[] | null
          created_at?: string | null
          default_image_url?: string | null
          default_product_link?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          message_template: string
          subject_template?: string | null
          template_category: string
          template_name: string
          updated_at?: string | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          available_placeholders?: string[] | null
          created_at?: string | null
          default_image_url?: string | null
          default_product_link?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          message_template?: string
          subject_template?: string | null
          template_category?: string
          template_name?: string
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "broadcast_templates_default_product_link_fkey"
            columns: ["default_product_link"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_analytics: {
        Row: {
          campaign_id: string
          channel: string
          clicked_at: string | null
          conversion_amount: number | null
          conversion_order_id: string | null
          converted_at: string | null
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          id: string
          opened_at: string | null
          recipient_id: string | null
          recipient_type: string | null
          sent_at: string | null
          status: string | null
        }
        Insert: {
          campaign_id: string
          channel: string
          clicked_at?: string | null
          conversion_amount?: number | null
          conversion_order_id?: string | null
          converted_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          opened_at?: string | null
          recipient_id?: string | null
          recipient_type?: string | null
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          campaign_id?: string
          channel?: string
          clicked_at?: string | null
          conversion_amount?: number | null
          conversion_order_id?: string | null
          converted_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          opened_at?: string | null
          recipient_id?: string | null
          recipient_type?: string | null
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_analytics_conversion_order_id_fkey"
            columns: ["conversion_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_analytics_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_sale_payments: {
        Row: {
          cash_sale_id: string
          created_at: string
          id: string
          notes: string | null
          payment_amount: number
          payment_date: string
          payment_method: string
          recorded_by: string | null
        }
        Insert: {
          cash_sale_id: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_amount: number
          payment_date?: string
          payment_method: string
          recorded_by?: string | null
        }
        Update: {
          cash_sale_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_amount?: number
          payment_date?: string
          payment_method?: string
          recorded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_sale_payments_cash_sale_id_fkey"
            columns: ["cash_sale_id"]
            isOneToOne: false
            referencedRelation: "cash_sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_sale_payments_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_sale_returns: {
        Row: {
          cash_sale_id: string
          created_at: string | null
          id: string
          notes: string | null
          processed_at: string | null
          processed_by: string | null
          refund_method: string | null
          return_amount: number
          return_quantity: number | null
          return_reason: string
        }
        Insert: {
          cash_sale_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          refund_method?: string | null
          return_amount: number
          return_quantity?: number | null
          return_reason: string
        }
        Update: {
          cash_sale_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          refund_method?: string | null
          return_amount?: number
          return_quantity?: number | null
          return_reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "cash_sale_returns_cash_sale_id_fkey"
            columns: ["cash_sale_id"]
            isOneToOne: false
            referencedRelation: "cash_sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_sale_returns_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_sales: {
        Row: {
          amount_due: number | null
          amount_paid: number | null
          created_at: string | null
          customer_type: string | null
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: Database["public"]["Enums"]["cash_sale_payment_status"]
          product_details: Json | null
          quantity_sold: number | null
          sale_amount: number
          session_id: string | null
          sold_at: string | null
          split_payments: Json | null
          staff_member_id: string | null
          user_id: string
        }
        Insert: {
          amount_due?: number | null
          amount_paid?: number | null
          created_at?: string | null
          customer_type?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["cash_sale_payment_status"]
          product_details?: Json | null
          quantity_sold?: number | null
          sale_amount: number
          session_id?: string | null
          sold_at?: string | null
          split_payments?: Json | null
          staff_member_id?: string | null
          user_id: string
        }
        Update: {
          amount_due?: number | null
          amount_paid?: number | null
          created_at?: string | null
          customer_type?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["cash_sale_payment_status"]
          product_details?: Json | null
          quantity_sold?: number | null
          sale_amount?: number
          session_id?: string | null
          sold_at?: string | null
          split_payments?: Json | null
          staff_member_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cash_sales_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "incognito_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_sales_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_cash_sales_staff_member"
            columns: ["staff_member_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          default_gst_rate: number | null
          description: string | null
          display_order: number | null
          hsn_code: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_gst_rate?: number | null
          description?: string | null
          display_order?: number | null
          hsn_code?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_gst_rate?: number | null
          description?: string | null
          display_order?: number | null
          hsn_code?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      client_milestone_payments: {
        Row: {
          amount: number
          client_id: string
          created_at: string | null
          id: string
          milestone_id: string
          notes: string | null
          paid_by: string | null
          payment_method: string | null
          payment_number: string
          project_id: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          receipt_sent: boolean | null
          receipt_sent_at: string | null
          receipt_url: string | null
          status: string | null
          transaction_date: string | null
          transaction_id: string | null
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string | null
          id?: string
          milestone_id: string
          notes?: string | null
          paid_by?: string | null
          payment_method?: string | null
          payment_number: string
          project_id: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          receipt_sent?: boolean | null
          receipt_sent_at?: string | null
          receipt_url?: string | null
          status?: string | null
          transaction_date?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string | null
          id?: string
          milestone_id?: string
          notes?: string | null
          paid_by?: string | null
          payment_method?: string | null
          payment_number?: string
          project_id?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          receipt_sent?: boolean | null
          receipt_sent_at?: string | null
          receipt_url?: string | null
          status?: string | null
          transaction_date?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_milestone_payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "designer_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_milestone_payments_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "project_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_milestone_payments_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_milestone_payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "client_milestone_payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_milestone_payments_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_portal_access: {
        Row: {
          access_level: string | null
          can_approve_quotations: boolean | null
          can_make_payments: boolean | null
          can_request_changes: boolean | null
          can_view_change_requests: boolean | null
          can_view_milestones: boolean | null
          can_view_quotations: boolean | null
          can_view_site_visits: boolean | null
          client_id: string
          created_at: string | null
          id: string
          invitation_accepted_at: string | null
          invitation_email: string | null
          invitation_expires_at: string | null
          invitation_sent_at: string | null
          invitation_token: string | null
          is_active: boolean | null
          last_login_at: string | null
          login_count: number | null
          profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          access_level?: string | null
          can_approve_quotations?: boolean | null
          can_make_payments?: boolean | null
          can_request_changes?: boolean | null
          can_view_change_requests?: boolean | null
          can_view_milestones?: boolean | null
          can_view_quotations?: boolean | null
          can_view_site_visits?: boolean | null
          client_id: string
          created_at?: string | null
          id?: string
          invitation_accepted_at?: string | null
          invitation_email?: string | null
          invitation_expires_at?: string | null
          invitation_sent_at?: string | null
          invitation_token?: string | null
          is_active?: boolean | null
          last_login_at?: string | null
          login_count?: number | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          access_level?: string | null
          can_approve_quotations?: boolean | null
          can_make_payments?: boolean | null
          can_request_changes?: boolean | null
          can_view_change_requests?: boolean | null
          can_view_milestones?: boolean | null
          can_view_quotations?: boolean | null
          can_view_site_visits?: boolean | null
          client_id?: string
          created_at?: string | null
          id?: string
          invitation_accepted_at?: string | null
          invitation_email?: string | null
          invitation_expires_at?: string | null
          invitation_sent_at?: string | null
          invitation_token?: string | null
          is_active?: boolean | null
          last_login_at?: string | null
          login_count?: number | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_portal_access_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "designer_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_portal_access_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_portal_messages: {
        Row: {
          attachments: Json | null
          client_id: string
          created_at: string | null
          designer_id: string
          id: string
          is_read: boolean | null
          message: string
          project_id: string
          read_at: string | null
          reply_to_id: string | null
          sender_id: string
          sender_type: string
        }
        Insert: {
          attachments?: Json | null
          client_id: string
          created_at?: string | null
          designer_id: string
          id?: string
          is_read?: boolean | null
          message: string
          project_id: string
          read_at?: string | null
          reply_to_id?: string | null
          sender_id: string
          sender_type: string
        }
        Update: {
          attachments?: Json | null
          client_id?: string
          created_at?: string | null
          designer_id?: string
          id?: string
          is_read?: boolean | null
          message?: string
          project_id?: string
          read_at?: string | null
          reply_to_id?: string | null
          sender_id?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_portal_messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "designer_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_portal_messages_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "client_portal_messages_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_portal_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "client_portal_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_portal_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "client_portal_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      client_portal_notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          client_id: string
          created_at: string | null
          email_sent: boolean | null
          email_sent_at: string | null
          id: string
          is_read: boolean | null
          message: string
          notification_type: string
          project_id: string | null
          read_at: string | null
          reference_id: string | null
          reference_type: string | null
          title: string
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          client_id: string
          created_at?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: string
          project_id?: string | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title: string
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          client_id?: string
          created_at?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          project_id?: string | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_portal_notifications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "designer_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_portal_notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "client_portal_notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      client_shared_documents: {
        Row: {
          client_id: string
          created_at: string | null
          description: string | null
          document_name: string
          document_type: string
          document_url: string
          download_count: number | null
          expires_at: string | null
          file_size: number | null
          id: string
          is_downloadable: boolean | null
          last_downloaded_at: string | null
          last_viewed_at: string | null
          mime_type: string | null
          project_id: string
          shared_by: string
          view_count: number | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          description?: string | null
          document_name: string
          document_type: string
          document_url: string
          download_count?: number | null
          expires_at?: string | null
          file_size?: number | null
          id?: string
          is_downloadable?: boolean | null
          last_downloaded_at?: string | null
          last_viewed_at?: string | null
          mime_type?: string | null
          project_id: string
          shared_by: string
          view_count?: number | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          description?: string | null
          document_name?: string
          document_type?: string
          document_url?: string
          download_count?: number | null
          expires_at?: string | null
          file_size?: number | null
          id?: string
          is_downloadable?: boolean | null
          last_downloaded_at?: string | null
          last_viewed_at?: string | null
          mime_type?: string | null
          project_id?: string
          shared_by?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_shared_documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "designer_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_shared_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "client_shared_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_shared_documents_shared_by_fkey"
            columns: ["shared_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      colors: {
        Row: {
          created_at: string | null
          description: string | null
          hex_code: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          hex_code?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          hex_code?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      commission_rules: {
        Row: {
          applicable_to_business_type: string | null
          commission_type: string | null
          commission_value: number
          created_at: string | null
          created_by: string | null
          effective_from: string
          effective_to: string | null
          id: string
          is_active: boolean | null
          max_transaction_amount: number | null
          min_transaction_amount: number | null
          rule_name: string
          transaction_type: string | null
          updated_at: string | null
        }
        Insert: {
          applicable_to_business_type?: string | null
          commission_type?: string | null
          commission_value: number
          created_at?: string | null
          created_by?: string | null
          effective_from: string
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          max_transaction_amount?: number | null
          min_transaction_amount?: number | null
          rule_name: string
          transaction_type?: string | null
          updated_at?: string | null
        }
        Update: {
          applicable_to_business_type?: string | null
          commission_type?: string | null
          commission_value?: number
          created_at?: string | null
          created_by?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          max_transaction_amount?: number | null
          min_transaction_amount?: number | null
          rule_name?: string
          transaction_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_rules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_settings: {
        Row: {
          category: string
          commission_percent: number
          created_at: string | null
          created_by: string | null
          effective_from: string | null
          effective_until: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          commission_percent?: number
          created_at?: string | null
          created_by?: string | null
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          commission_percent?: number
          created_at?: string | null
          created_by?: string | null
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_transactions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          base_amount: number
          commission_amount: number
          commission_rule_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          paid_at: string | null
          profile_id: string | null
          reference_id: string | null
          reference_type: string | null
          status: string | null
          transaction_number: string
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          base_amount: number
          commission_amount: number
          commission_rule_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          paid_at?: string | null
          profile_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          transaction_number: string
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          base_amount?: number
          commission_amount?: number
          commission_rule_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          paid_at?: string | null
          profile_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          transaction_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_transactions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_transactions_commission_rule_id_fkey"
            columns: ["commission_rule_id"]
            isOneToOne: false
            referencedRelation: "commission_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_transactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_alerts: {
        Row: {
          alert_type: string
          auto_generated: boolean | null
          created_at: string | null
          description: string | null
          entity_id: string | null
          entity_number: string | null
          entity_type: string | null
          id: string
          is_resolved: boolean | null
          metadata: Json | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          alert_type: string
          auto_generated?: boolean | null
          created_at?: string | null
          description?: string | null
          entity_id?: string | null
          entity_number?: string | null
          entity_type?: string | null
          id?: string
          is_resolved?: boolean | null
          metadata?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          auto_generated?: boolean | null
          created_at?: string | null
          description?: string | null
          entity_id?: string | null
          entity_number?: string | null
          entity_type?: string | null
          id?: string
          is_resolved?: boolean | null
          metadata?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_alerts_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_checklist: {
        Row: {
          checklist_type: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          is_completed: boolean | null
          item_name: string
          notes: string | null
          priority: string | null
          profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          checklist_type?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          item_name: string
          notes?: string | null
          priority?: string | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          checklist_type?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          item_name?: string
          notes?: string | null
          priority?: string | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_checklist_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_checklist_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_documents: {
        Row: {
          created_at: string | null
          document_number: string
          document_type: string | null
          file_hash: string | null
          file_name: string | null
          file_size: number | null
          file_url: string | null
          generated_at: string | null
          id: string
          is_gst_compliant: boolean | null
          metadata: Json | null
          mime_type: string | null
          profile_id: string | null
          reference_id: string | null
          reference_type: string | null
          uploaded_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_number: string
          document_type?: string | null
          file_hash?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          generated_at?: string | null
          id?: string
          is_gst_compliant?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          profile_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          uploaded_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_number?: string
          document_type?: string | null
          file_hash?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          generated_at?: string | null
          id?: string
          is_gst_compliant?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          profile_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_documents_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversion_funnel_analytics: {
        Row: {
          application_to_approval_rate: number | null
          applications_approved: number | null
          applications_completed: number | null
          applications_rejected: number | null
          applications_started: number | null
          average_credit_limit_approved: number | null
          created_at: string | null
          customers_interested: number | null
          id: string
          interest_to_application_rate: number | null
          invitation_to_interest_rate: number | null
          invitations_sent: number | null
          overall_conversion_rate: number | null
          period_end: string
          period_start: string
          period_type: string
          successful_conversions: number | null
          total_non_osas_customers: number | null
          total_outstanding_converted: number | null
          wholesaler_id: string | null
        }
        Insert: {
          application_to_approval_rate?: number | null
          applications_approved?: number | null
          applications_completed?: number | null
          applications_rejected?: number | null
          applications_started?: number | null
          average_credit_limit_approved?: number | null
          created_at?: string | null
          customers_interested?: number | null
          id?: string
          interest_to_application_rate?: number | null
          invitation_to_interest_rate?: number | null
          invitations_sent?: number | null
          overall_conversion_rate?: number | null
          period_end: string
          period_start: string
          period_type: string
          successful_conversions?: number | null
          total_non_osas_customers?: number | null
          total_outstanding_converted?: number | null
          wholesaler_id?: string | null
        }
        Update: {
          application_to_approval_rate?: number | null
          applications_approved?: number | null
          applications_completed?: number | null
          applications_rejected?: number | null
          applications_started?: number | null
          average_credit_limit_approved?: number | null
          created_at?: string | null
          customers_interested?: number | null
          id?: string
          interest_to_application_rate?: number | null
          invitation_to_interest_rate?: number | null
          invitations_sent?: number | null
          overall_conversion_rate?: number | null
          period_end?: string
          period_start?: string
          period_type?: string
          successful_conversions?: number | null
          total_non_osas_customers?: number | null
          total_outstanding_converted?: number | null
          wholesaler_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversion_funnel_analytics_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_applications: {
        Row: {
          application_number: string
          approved_amount: number | null
          created_at: string | null
          disbursed_at: string | null
          id: string
          interest_rate: number | null
          nbfc_approved_at: string | null
          notes: string | null
          osas_approved_at: string | null
          osas_approved_by: string | null
          requested_amount: number
          retailer_id: string | null
          status: string | null
          tenure_months: number | null
          updated_at: string | null
        }
        Insert: {
          application_number: string
          approved_amount?: number | null
          created_at?: string | null
          disbursed_at?: string | null
          id?: string
          interest_rate?: number | null
          nbfc_approved_at?: string | null
          notes?: string | null
          osas_approved_at?: string | null
          osas_approved_by?: string | null
          requested_amount: number
          retailer_id?: string | null
          status?: string | null
          tenure_months?: number | null
          updated_at?: string | null
        }
        Update: {
          application_number?: string
          approved_amount?: number | null
          created_at?: string | null
          disbursed_at?: string | null
          id?: string
          interest_rate?: number | null
          nbfc_approved_at?: string | null
          notes?: string | null
          osas_approved_at?: string | null
          osas_approved_by?: string | null
          requested_amount?: number
          retailer_id?: string | null
          status?: string | null
          tenure_months?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_applications_osas_approved_by_fkey"
            columns: ["osas_approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_applications_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_notes: {
        Row: {
          amount: number
          applied_at: string | null
          applied_to_invoice_id: string | null
          created_at: string
          created_by: string | null
          credit_note_number: string
          expires_at: string | null
          id: string
          invoice_id: string | null
          reason: string | null
          retailer_id: string | null
          status: string
          updated_at: string
          wholesaler_id: string | null
        }
        Insert: {
          amount: number
          applied_at?: string | null
          applied_to_invoice_id?: string | null
          created_at?: string
          created_by?: string | null
          credit_note_number: string
          expires_at?: string | null
          id?: string
          invoice_id?: string | null
          reason?: string | null
          retailer_id?: string | null
          status?: string
          updated_at?: string
          wholesaler_id?: string | null
        }
        Update: {
          amount?: number
          applied_at?: string | null
          applied_to_invoice_id?: string | null
          created_at?: string
          created_by?: string | null
          credit_note_number?: string
          expires_at?: string | null
          id?: string
          invoice_id?: string | null
          reason?: string | null
          retailer_id?: string | null
          status?: string
          updated_at?: string
          wholesaler_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_notes_applied_to_invoice_id_fkey"
            columns: ["applied_to_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_notes_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_notes_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_notes_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "wholesalers"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_scores: {
        Row: {
          business_age_score: number | null
          calculated_at: string | null
          created_at: string | null
          id: string
          purchase_history_score: number | null
          repayment_score: number | null
          retailer_id: string | null
          score: number | null
        }
        Insert: {
          business_age_score?: number | null
          calculated_at?: string | null
          created_at?: string | null
          id?: string
          purchase_history_score?: number | null
          repayment_score?: number | null
          retailer_id?: string | null
          score?: number | null
        }
        Update: {
          business_age_score?: number | null
          calculated_at?: string | null
          created_at?: string | null
          id?: string
          purchase_history_score?: number | null
          repayment_score?: number | null
          retailer_id?: string | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_scores_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          notes: string | null
          reference_id: string | null
          reference_type: string | null
          retailer_id: string | null
          transaction_number: string
          transaction_type: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          notes?: string | null
          reference_id?: string | null
          reference_type?: string | null
          retailer_id?: string | null
          transaction_number: string
          transaction_type?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          reference_id?: string | null
          reference_type?: string | null
          retailer_id?: string | null
          transaction_number?: string
          transaction_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          address_type: string | null
          city: string
          contact_name: string | null
          contact_phone: string | null
          country: string
          created_at: string | null
          delivery_instructions: string | null
          id: string
          is_default: boolean | null
          label: string
          latitude: number | null
          longitude: number | null
          postal_code: string
          state: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          address_type?: string | null
          city: string
          contact_name?: string | null
          contact_phone?: string | null
          country?: string
          created_at?: string | null
          delivery_instructions?: string | null
          id?: string
          is_default?: boolean | null
          label: string
          latitude?: number | null
          longitude?: number | null
          postal_code: string
          state: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          address_type?: string | null
          city?: string
          contact_name?: string | null
          contact_phone?: string | null
          country?: string
          created_at?: string | null
          delivery_instructions?: string | null
          id?: string
          is_default?: boolean | null
          label?: string
          latitude?: number | null
          longitude?: number | null
          postal_code?: string
          state?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_loyalty_points: {
        Row: {
          created_at: string | null
          current_balance: number | null
          customer_id: string
          id: string
          last_earned_at: string | null
          last_redeemed_at: string | null
          lifetime_purchases: number | null
          loyalty_tier: string | null
          points_expiring_soon: number | null
          tier_since: string | null
          total_orders: number | null
          total_points_earned: number | null
          total_points_redeemed: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_balance?: number | null
          customer_id: string
          id?: string
          last_earned_at?: string | null
          last_redeemed_at?: string | null
          lifetime_purchases?: number | null
          loyalty_tier?: string | null
          points_expiring_soon?: number | null
          tier_since?: string | null
          total_orders?: number | null
          total_points_earned?: number | null
          total_points_redeemed?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_balance?: number | null
          customer_id?: string
          id?: string
          last_earned_at?: string | null
          last_redeemed_at?: string | null
          lifetime_purchases?: number | null
          loyalty_tier?: string | null
          points_expiring_soon?: number | null
          tier_since?: string | null
          total_orders?: number | null
          total_points_earned?: number | null
          total_points_redeemed?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_loyalty_points_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_quotation_requests: {
        Row: {
          city: string | null
          contact_phone: string | null
          created_at: string | null
          customer_id: string | null
          designer_id: string | null
          designer_response: string | null
          estimated_budget_max: number | null
          estimated_budget_min: number | null
          id: string
          preferred_start_date: string | null
          project_description: string
          project_type: string | null
          property_address: string | null
          quoted_amount: number | null
          responded_at: string | null
          special_requirements: string | null
          state: string | null
          status: string | null
          updated_at: string | null
          viewed_at: string | null
        }
        Insert: {
          city?: string | null
          contact_phone?: string | null
          created_at?: string | null
          customer_id?: string | null
          designer_id?: string | null
          designer_response?: string | null
          estimated_budget_max?: number | null
          estimated_budget_min?: number | null
          id?: string
          preferred_start_date?: string | null
          project_description: string
          project_type?: string | null
          property_address?: string | null
          quoted_amount?: number | null
          responded_at?: string | null
          special_requirements?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          viewed_at?: string | null
        }
        Update: {
          city?: string | null
          contact_phone?: string | null
          created_at?: string | null
          customer_id?: string | null
          designer_id?: string | null
          designer_response?: string | null
          estimated_budget_max?: number | null
          estimated_budget_min?: number | null
          id?: string
          preferred_start_date?: string | null
          project_description?: string
          project_type?: string | null
          property_address?: string | null
          quoted_amount?: number | null
          responded_at?: string | null
          special_requirements?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_quotation_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_quotation_requests_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "customer_quotation_requests_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_segment_members: {
        Row: {
          added_at: string | null
          customer_data: Json | null
          customer_id: string
          id: string
          is_active: boolean | null
          removed_at: string | null
          segment_id: string
        }
        Insert: {
          added_at?: string | null
          customer_data?: Json | null
          customer_id: string
          id?: string
          is_active?: boolean | null
          removed_at?: string | null
          segment_id: string
        }
        Update: {
          added_at?: string | null
          customer_data?: Json | null
          customer_id?: string
          id?: string
          is_active?: boolean | null
          removed_at?: string | null
          segment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_segment_members_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_segment_members_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "customer_segments"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_segments: {
        Row: {
          created_at: string | null
          customer_count: number | null
          filter_criteria: Json
          id: string
          is_active: boolean | null
          is_dynamic: boolean | null
          last_calculated_at: string | null
          segment_description: string | null
          segment_name: string
          segment_type: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_count?: number | null
          filter_criteria?: Json
          id?: string
          is_active?: boolean | null
          is_dynamic?: boolean | null
          last_calculated_at?: string | null
          segment_description?: string | null
          segment_name: string
          segment_type?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_count?: number | null
          filter_criteria?: Json
          id?: string
          is_active?: boolean | null
          is_dynamic?: boolean | null
          last_calculated_at?: string | null
          segment_description?: string | null
          segment_name?: string
          segment_type?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          credit_limit: number | null
          email: string | null
          gstin: string | null
          id: string
          is_active: boolean | null
          name: string
          outstanding_balance: number | null
          phone: string | null
          postal_code: string | null
          state: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          email?: string | null
          gstin?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          outstanding_balance?: number | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          email?: string | null
          gstin?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          outstanding_balance?: number | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      dashboard_preferences: {
        Row: {
          compact_view: boolean | null
          created_at: string | null
          default_date_range: string | null
          id: string
          show_business_overview: boolean | null
          show_customer_layer: boolean | null
          show_financial_summary: boolean | null
          show_order_snapshot: boolean | null
          show_osas_insights: boolean | null
          show_private_summary: boolean | null
          show_quick_actions: boolean | null
          show_today_tasks: boolean | null
          show_wholesaler_offers: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          compact_view?: boolean | null
          created_at?: string | null
          default_date_range?: string | null
          id?: string
          show_business_overview?: boolean | null
          show_customer_layer?: boolean | null
          show_financial_summary?: boolean | null
          show_order_snapshot?: boolean | null
          show_osas_insights?: boolean | null
          show_private_summary?: boolean | null
          show_quick_actions?: boolean | null
          show_today_tasks?: boolean | null
          show_wholesaler_offers?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          compact_view?: boolean | null
          created_at?: string | null
          default_date_range?: string | null
          id?: string
          show_business_overview?: boolean | null
          show_customer_layer?: boolean | null
          show_financial_summary?: boolean | null
          show_order_snapshot?: boolean | null
          show_osas_insights?: boolean | null
          show_private_summary?: boolean | null
          show_quick_actions?: boolean | null
          show_today_tasks?: boolean | null
          show_wholesaler_offers?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dead_stock_analytics: {
        Row: {
          cleared_at: string | null
          created_at: string | null
          current_stock_value: number | null
          id: string
          identified_at: string | null
          notes: string | null
          original_stock_value: number | null
          product_id: string
          quantity: number
          reason: string | null
          status: string | null
          stock_age_days: number | null
          suggested_discount_percentage: number | null
          updated_at: string | null
        }
        Insert: {
          cleared_at?: string | null
          created_at?: string | null
          current_stock_value?: number | null
          id?: string
          identified_at?: string | null
          notes?: string | null
          original_stock_value?: number | null
          product_id: string
          quantity: number
          reason?: string | null
          status?: string | null
          stock_age_days?: number | null
          suggested_discount_percentage?: number | null
          updated_at?: string | null
        }
        Update: {
          cleared_at?: string | null
          created_at?: string | null
          current_stock_value?: number | null
          id?: string
          identified_at?: string | null
          notes?: string | null
          original_stock_value?: number | null
          product_id?: string
          quantity?: number
          reason?: string | null
          status?: string | null
          stock_age_days?: number | null
          suggested_discount_percentage?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dead_stock_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      dead_stock_sales: {
        Row: {
          created_at: string | null
          customer_type: string | null
          discount_percentage: number
          id: string
          order_id: string | null
          original_price: number
          product_id: string
          profit_loss: number | null
          quantity_sold: number
          sale_price: number
          sold_at: string | null
          sold_by: string | null
        }
        Insert: {
          created_at?: string | null
          customer_type?: string | null
          discount_percentage: number
          id?: string
          order_id?: string | null
          original_price: number
          product_id: string
          profit_loss?: number | null
          quantity_sold: number
          sale_price: number
          sold_at?: string | null
          sold_by?: string | null
        }
        Update: {
          created_at?: string | null
          customer_type?: string | null
          discount_percentage?: number
          id?: string
          order_id?: string | null
          original_price?: number
          product_id?: string
          profit_loss?: number | null
          quantity_sold?: number
          sale_price?: number
          sold_at?: string | null
          sold_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dead_stock_sales_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dead_stock_sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dead_stock_sales_sold_by_fkey"
            columns: ["sold_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      debit_notes: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          cgst_amount: number | null
          created_at: string | null
          created_by: string | null
          debit_note_number: string
          id: string
          igst_amount: number | null
          original_invoice_date: string | null
          original_invoice_id: string | null
          original_invoice_number: string | null
          reason: string
          retailer_id: string | null
          sgst_amount: number | null
          status: string | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          cgst_amount?: number | null
          created_at?: string | null
          created_by?: string | null
          debit_note_number: string
          id?: string
          igst_amount?: number | null
          original_invoice_date?: string | null
          original_invoice_id?: string | null
          original_invoice_number?: string | null
          reason: string
          retailer_id?: string | null
          sgst_amount?: number | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          cgst_amount?: number | null
          created_at?: string | null
          created_by?: string | null
          debit_note_number?: string
          id?: string
          igst_amount?: number | null
          original_invoice_date?: string | null
          original_invoice_id?: string | null
          original_invoice_number?: string | null
          reason?: string
          retailer_id?: string | null
          sgst_amount?: number | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debit_notes_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debit_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debit_notes_original_invoice_id_fkey"
            columns: ["original_invoice_id"]
            isOneToOne: false
            referencedRelation: "gst_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debit_notes_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debit_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deliveries: {
        Row: {
          assigned_to: string | null
          carrier: string | null
          created_at: string | null
          delivered_date: string | null
          delivery_address: string | null
          delivery_fee: number | null
          delivery_number: string
          delivery_type: Database["public"]["Enums"]["delivery_type"] | null
          id: string
          notes: string | null
          order_id: string | null
          recipient_name: string | null
          recipient_phone: string | null
          scheduled_date: string | null
          status: Database["public"]["Enums"]["delivery_status"] | null
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          carrier?: string | null
          created_at?: string | null
          delivered_date?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          delivery_number: string
          delivery_type?: Database["public"]["Enums"]["delivery_type"] | null
          id?: string
          notes?: string | null
          order_id?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["delivery_status"] | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          carrier?: string | null
          created_at?: string | null
          delivered_date?: string | null
          delivery_address?: string | null
          delivery_fee?: number | null
          delivery_number?: string
          delivery_type?: Database["public"]["Enums"]["delivery_type"] | null
          id?: string
          notes?: string | null
          order_id?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["delivery_status"] | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_configurations: {
        Row: {
          auto_assign_algorithm: string | null
          auto_assign_radius_km: number | null
          created_at: string | null
          default_delivery_partner: string | null
          default_delivery_window_hours: number | null
          default_proof_type: string | null
          driver_shift_hours: number | null
          enable_auto_assign: boolean | null
          enable_contactless_delivery: boolean | null
          enable_delivery_pooling: boolean | null
          enable_driver_app: boolean | null
          enable_real_time_updates: boolean | null
          enable_route_optimization: boolean | null
          enable_same_day_delivery: boolean | null
          enable_scheduled_delivery: boolean | null
          id: string
          live_tracking_preference: string | null
          max_deliveries_per_driver: number | null
          notify_customer_before_arrival: boolean | null
          notify_customer_on_dispatch: boolean | null
          notify_minutes_before_arrival: number | null
          notify_on_delivery_complete: boolean | null
          require_customer_confirmation: boolean | null
          third_party_api_key: string | null
          third_party_provider_name: string | null
          tracking_update_interval_seconds: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_assign_algorithm?: string | null
          auto_assign_radius_km?: number | null
          created_at?: string | null
          default_delivery_partner?: string | null
          default_delivery_window_hours?: number | null
          default_proof_type?: string | null
          driver_shift_hours?: number | null
          enable_auto_assign?: boolean | null
          enable_contactless_delivery?: boolean | null
          enable_delivery_pooling?: boolean | null
          enable_driver_app?: boolean | null
          enable_real_time_updates?: boolean | null
          enable_route_optimization?: boolean | null
          enable_same_day_delivery?: boolean | null
          enable_scheduled_delivery?: boolean | null
          id?: string
          live_tracking_preference?: string | null
          max_deliveries_per_driver?: number | null
          notify_customer_before_arrival?: boolean | null
          notify_customer_on_dispatch?: boolean | null
          notify_minutes_before_arrival?: number | null
          notify_on_delivery_complete?: boolean | null
          require_customer_confirmation?: boolean | null
          third_party_api_key?: string | null
          third_party_provider_name?: string | null
          tracking_update_interval_seconds?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_assign_algorithm?: string | null
          auto_assign_radius_km?: number | null
          created_at?: string | null
          default_delivery_partner?: string | null
          default_delivery_window_hours?: number | null
          default_proof_type?: string | null
          driver_shift_hours?: number | null
          enable_auto_assign?: boolean | null
          enable_contactless_delivery?: boolean | null
          enable_delivery_pooling?: boolean | null
          enable_driver_app?: boolean | null
          enable_real_time_updates?: boolean | null
          enable_route_optimization?: boolean | null
          enable_same_day_delivery?: boolean | null
          enable_scheduled_delivery?: boolean | null
          id?: string
          live_tracking_preference?: string | null
          max_deliveries_per_driver?: number | null
          notify_customer_before_arrival?: boolean | null
          notify_customer_on_dispatch?: boolean | null
          notify_minutes_before_arrival?: number | null
          notify_on_delivery_complete?: boolean | null
          require_customer_confirmation?: boolean | null
          third_party_api_key?: string | null
          third_party_provider_name?: string | null
          tracking_update_interval_seconds?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      designer_alert_settings: {
        Row: {
          approval_pending_enabled: boolean | null
          client_inactive_days: number | null
          commission_ready_enabled: boolean | null
          created_at: string | null
          delivery_delay_enabled: boolean | null
          designer_id: string
          email_notifications_enabled: boolean | null
          id: string
          low_stock_enabled: boolean | null
          payment_due_days_before: number | null
          payment_due_enabled: boolean | null
          payment_overdue_enabled: boolean | null
          price_change_enabled: boolean | null
          project_deadline_days_before: number | null
          project_deadline_enabled: boolean | null
          push_notifications_enabled: boolean | null
          quiet_hours_enabled: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          referral_followup_enabled: boolean | null
          site_visit_hours_before: number | null
          site_visit_reminder_enabled: boolean | null
          sms_notifications_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          approval_pending_enabled?: boolean | null
          client_inactive_days?: number | null
          commission_ready_enabled?: boolean | null
          created_at?: string | null
          delivery_delay_enabled?: boolean | null
          designer_id: string
          email_notifications_enabled?: boolean | null
          id?: string
          low_stock_enabled?: boolean | null
          payment_due_days_before?: number | null
          payment_due_enabled?: boolean | null
          payment_overdue_enabled?: boolean | null
          price_change_enabled?: boolean | null
          project_deadline_days_before?: number | null
          project_deadline_enabled?: boolean | null
          push_notifications_enabled?: boolean | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          referral_followup_enabled?: boolean | null
          site_visit_hours_before?: number | null
          site_visit_reminder_enabled?: boolean | null
          sms_notifications_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          approval_pending_enabled?: boolean | null
          client_inactive_days?: number | null
          commission_ready_enabled?: boolean | null
          created_at?: string | null
          delivery_delay_enabled?: boolean | null
          designer_id?: string
          email_notifications_enabled?: boolean | null
          id?: string
          low_stock_enabled?: boolean | null
          payment_due_days_before?: number | null
          payment_due_enabled?: boolean | null
          payment_overdue_enabled?: boolean | null
          price_change_enabled?: boolean | null
          project_deadline_days_before?: number | null
          project_deadline_enabled?: boolean | null
          push_notifications_enabled?: boolean | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          referral_followup_enabled?: boolean | null
          site_visit_hours_before?: number | null
          site_visit_reminder_enabled?: boolean | null
          sms_notifications_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_alert_settings_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: true
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_alert_settings_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: true
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_alerts: {
        Row: {
          action_label: string | null
          action_url: string | null
          actioned_at: string | null
          alert_type: string
          created_at: string | null
          designer_id: string
          expires_at: string | null
          id: string
          message: string
          metadata: Json | null
          priority: string | null
          read_at: string | null
          reference_id: string | null
          reference_type: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          actioned_at?: string | null
          alert_type: string
          created_at?: string | null
          designer_id: string
          expires_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          priority?: string | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          actioned_at?: string | null
          alert_type?: string
          created_at?: string | null
          designer_id?: string
          expires_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_alerts_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_alerts_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_analytics_snapshots: {
        Row: {
          active_clients: number | null
          active_projects: number | null
          average_quotation_value: number | null
          client_satisfaction_score: number | null
          completed_projects: number | null
          converted_referrals: number | null
          created_at: string | null
          designer_id: string
          id: string
          new_clients_period: number | null
          on_time_delivery_rate: number | null
          paid_commission: number | null
          partner_order_value: number | null
          pending_commission: number | null
          pending_payments: number | null
          preferred_partners: number | null
          projects_delayed: number | null
          projects_on_track: number | null
          quotation_approval_rate: number | null
          quotations_approved: number | null
          quotations_rejected: number | null
          quotations_sent: number | null
          received_payments: number | null
          referral_commission_earned: number | null
          referral_conversion_rate: number | null
          response_time_hours: number | null
          snapshot_date: string
          snapshot_type: string | null
          total_clients: number | null
          total_commission_earned: number | null
          total_partners: number | null
          total_project_value: number | null
          total_projects: number | null
          total_referrals: number | null
        }
        Insert: {
          active_clients?: number | null
          active_projects?: number | null
          average_quotation_value?: number | null
          client_satisfaction_score?: number | null
          completed_projects?: number | null
          converted_referrals?: number | null
          created_at?: string | null
          designer_id: string
          id?: string
          new_clients_period?: number | null
          on_time_delivery_rate?: number | null
          paid_commission?: number | null
          partner_order_value?: number | null
          pending_commission?: number | null
          pending_payments?: number | null
          preferred_partners?: number | null
          projects_delayed?: number | null
          projects_on_track?: number | null
          quotation_approval_rate?: number | null
          quotations_approved?: number | null
          quotations_rejected?: number | null
          quotations_sent?: number | null
          received_payments?: number | null
          referral_commission_earned?: number | null
          referral_conversion_rate?: number | null
          response_time_hours?: number | null
          snapshot_date: string
          snapshot_type?: string | null
          total_clients?: number | null
          total_commission_earned?: number | null
          total_partners?: number | null
          total_project_value?: number | null
          total_projects?: number | null
          total_referrals?: number | null
        }
        Update: {
          active_clients?: number | null
          active_projects?: number | null
          average_quotation_value?: number | null
          client_satisfaction_score?: number | null
          completed_projects?: number | null
          converted_referrals?: number | null
          created_at?: string | null
          designer_id?: string
          id?: string
          new_clients_period?: number | null
          on_time_delivery_rate?: number | null
          paid_commission?: number | null
          partner_order_value?: number | null
          pending_commission?: number | null
          pending_payments?: number | null
          preferred_partners?: number | null
          projects_delayed?: number | null
          projects_on_track?: number | null
          quotation_approval_rate?: number | null
          quotations_approved?: number | null
          quotations_rejected?: number | null
          quotations_sent?: number | null
          received_payments?: number | null
          referral_commission_earned?: number | null
          referral_conversion_rate?: number | null
          response_time_hours?: number | null
          snapshot_date?: string
          snapshot_type?: string | null
          total_clients?: number | null
          total_commission_earned?: number | null
          total_partners?: number | null
          total_project_value?: number | null
          total_projects?: number | null
          total_referrals?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_analytics_snapshots_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_analytics_snapshots_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_client_payments: {
        Row: {
          amount: number
          bank_name: string | null
          bounce_reason: string | null
          cheque_number: string | null
          created_at: string | null
          designer_id: string
          id: string
          milestone_id: string | null
          notes: string | null
          payment_date: string | null
          payment_mode: string
          project_id: string
          reference_number: string | null
          status: string | null
        }
        Insert: {
          amount: number
          bank_name?: string | null
          bounce_reason?: string | null
          cheque_number?: string | null
          created_at?: string | null
          designer_id: string
          id?: string
          milestone_id?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_mode: string
          project_id: string
          reference_number?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          bank_name?: string | null
          bounce_reason?: string | null
          cheque_number?: string | null
          created_at?: string | null
          designer_id?: string
          id?: string
          milestone_id?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_mode?: string
          project_id?: string
          reference_number?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_client_payments_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_client_payments_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "designer_payment_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_client_payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_client_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_client_projects: {
        Row: {
          actual_end_date: string | null
          client_address: string | null
          client_email: string | null
          client_name: string
          client_phone: string | null
          created_at: string | null
          designer_id: string
          expected_end_date: string | null
          id: string
          notes: string | null
          project_address: string | null
          project_name: string
          project_status: string | null
          project_type: string | null
          project_value: number
          start_date: string | null
          total_billed: number | null
          total_collected: number | null
          total_pending: number | null
          updated_at: string | null
        }
        Insert: {
          actual_end_date?: string | null
          client_address?: string | null
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string | null
          designer_id: string
          expected_end_date?: string | null
          id?: string
          notes?: string | null
          project_address?: string | null
          project_name: string
          project_status?: string | null
          project_type?: string | null
          project_value?: number
          start_date?: string | null
          total_billed?: number | null
          total_collected?: number | null
          total_pending?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_end_date?: string | null
          client_address?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string | null
          designer_id?: string
          expected_end_date?: string | null
          id?: string
          notes?: string | null
          project_address?: string | null
          project_name?: string
          project_status?: string | null
          project_type?: string | null
          project_value?: number
          start_date?: string | null
          total_billed?: number | null
          total_collected?: number | null
          total_pending?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_client_projects_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_clients: {
        Row: {
          address: string | null
          alternate_phone: string | null
          budget_range: string | null
          city: string | null
          created_at: string | null
          designer_id: string
          email: string | null
          has_portal_access: boolean | null
          id: string
          is_active: boolean | null
          last_contacted_at: string | null
          name: string
          notes: string | null
          phone: string | null
          portal_invite_sent_at: string | null
          portal_registered_at: string | null
          postal_code: string | null
          profile_id: string | null
          project_type_preference: string | null
          source: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          alternate_phone?: string | null
          budget_range?: string | null
          city?: string | null
          created_at?: string | null
          designer_id: string
          email?: string | null
          has_portal_access?: boolean | null
          id?: string
          is_active?: boolean | null
          last_contacted_at?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          portal_invite_sent_at?: string | null
          portal_registered_at?: string | null
          postal_code?: string | null
          profile_id?: string | null
          project_type_preference?: string | null
          source?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          alternate_phone?: string | null
          budget_range?: string | null
          city?: string | null
          created_at?: string | null
          designer_id?: string
          email?: string | null
          has_portal_access?: boolean | null
          id?: string
          is_active?: boolean | null
          last_contacted_at?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          portal_invite_sent_at?: string | null
          portal_registered_at?: string | null
          postal_code?: string | null
          profile_id?: string | null
          project_type_preference?: string | null
          source?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_clients_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_clients_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_clients_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_commission_rates: {
        Row: {
          approved_by: string | null
          category: string
          commission_percent: number
          created_at: string | null
          designer_id: string | null
          effective_from: string | null
          effective_until: string | null
          id: string
          is_active: boolean | null
          notes: string | null
        }
        Insert: {
          approved_by?: string | null
          category: string
          commission_percent: number
          created_at?: string | null
          designer_id?: string | null
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
        }
        Update: {
          approved_by?: string | null
          category?: string
          commission_percent?: number
          created_at?: string | null
          designer_id?: string | null
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_commission_rates_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_commission_rates_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_commission_rates_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_commissions: {
        Row: {
          admin_notes: string | null
          approved_at: string | null
          commission_amount: number | null
          commission_percent: number | null
          confirmed_at: string | null
          created_at: string | null
          designer_id: string | null
          gst_amount: number | null
          gst_percent: number | null
          id: string
          notes: string | null
          order_amount: number | null
          order_date: string | null
          order_id: string | null
          paid_at: string | null
          payout_id: string | null
          project_id: string | null
          quotation_id: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          approved_at?: string | null
          commission_amount?: number | null
          commission_percent?: number | null
          confirmed_at?: string | null
          created_at?: string | null
          designer_id?: string | null
          gst_amount?: number | null
          gst_percent?: number | null
          id?: string
          notes?: string | null
          order_amount?: number | null
          order_date?: string | null
          order_id?: string | null
          paid_at?: string | null
          payout_id?: string | null
          project_id?: string | null
          quotation_id?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          approved_at?: string | null
          commission_amount?: number | null
          commission_percent?: number | null
          confirmed_at?: string | null
          created_at?: string | null
          designer_id?: string | null
          gst_amount?: number | null
          gst_percent?: number | null
          id?: string
          notes?: string | null
          order_amount?: number | null
          order_date?: string | null
          order_id?: string | null
          paid_at?: string | null
          payout_id?: string | null
          project_id?: string | null
          quotation_id?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_commissions_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_commissions_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_commissions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_commissions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "designer_commissions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_commissions_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "designer_quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_eligibility_history: {
        Row: {
          changed_by: string | null
          created_at: string | null
          credit_limit_approved: number | null
          designer_id: string
          id: string
          new_status: string
          notes: string | null
          on_time_payment_percentage: number | null
          previous_status: string | null
          risk_indicator: string | null
          total_project_value: number | null
          total_projects_completed: number | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          credit_limit_approved?: number | null
          designer_id: string
          id?: string
          new_status: string
          notes?: string | null
          on_time_payment_percentage?: number | null
          previous_status?: string | null
          risk_indicator?: string | null
          total_project_value?: number | null
          total_projects_completed?: number | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          credit_limit_approved?: number | null
          designer_id?: string
          id?: string
          new_status?: string
          notes?: string | null
          on_time_payment_percentage?: number | null
          previous_status?: string | null
          risk_indicator?: string | null
          total_project_value?: number | null
          total_projects_completed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_eligibility_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_eligibility_history_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_emi_plans: {
        Row: {
          amount_paid: number | null
          approved_by: string | null
          created_at: string | null
          designer_id: string
          emi_amount: number
          emis_paid: number | null
          end_date: string | null
          id: string
          interest_rate: number | null
          linked_invoice_ids: string[] | null
          linked_project_ids: string[] | null
          principal_amount: number
          start_date: string
          status: string | null
          tenure_months: number
          total_amount: number
          total_emis: number
          updated_at: string | null
        }
        Insert: {
          amount_paid?: number | null
          approved_by?: string | null
          created_at?: string | null
          designer_id: string
          emi_amount: number
          emis_paid?: number | null
          end_date?: string | null
          id?: string
          interest_rate?: number | null
          linked_invoice_ids?: string[] | null
          linked_project_ids?: string[] | null
          principal_amount: number
          start_date: string
          status?: string | null
          tenure_months: number
          total_amount: number
          total_emis: number
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number | null
          approved_by?: string | null
          created_at?: string | null
          designer_id?: string
          emi_amount?: number
          emis_paid?: number | null
          end_date?: string | null
          id?: string
          interest_rate?: number | null
          linked_invoice_ids?: string[] | null
          linked_project_ids?: string[] | null
          principal_amount?: number
          start_date?: string
          status?: string | null
          tenure_months?: number
          total_amount?: number
          total_emis?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_emi_plans_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_emi_plans_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_emi_schedule: {
        Row: {
          created_at: string | null
          designer_id: string
          due_date: string
          emi_amount: number
          emi_number: number
          emi_plan_id: string
          id: string
          interest_component: number | null
          late_fee: number | null
          paid_amount: number | null
          paid_date: string | null
          payment_id: string | null
          principal_component: number | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          designer_id: string
          due_date: string
          emi_amount: number
          emi_number: number
          emi_plan_id: string
          id?: string
          interest_component?: number | null
          late_fee?: number | null
          paid_amount?: number | null
          paid_date?: string | null
          payment_id?: string | null
          principal_component?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          designer_id?: string
          due_date?: string
          emi_amount?: number
          emi_number?: number
          emi_plan_id?: string
          id?: string
          interest_component?: number | null
          late_fee?: number | null
          paid_amount?: number | null
          paid_date?: string | null
          payment_id?: string | null
          principal_component?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_emi_schedule_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_emi_schedule_emi_plan_id_fkey"
            columns: ["emi_plan_id"]
            isOneToOne: false
            referencedRelation: "designer_emi_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_emi_schedule_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "designer_osas_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_goals: {
        Row: {
          actual_clients: number | null
          actual_commission: number | null
          actual_projects: number | null
          actual_referrals: number | null
          actual_revenue: number | null
          created_at: string | null
          designer_id: string
          end_date: string
          goal_type: string
          id: string
          notes: string | null
          start_date: string
          status: string | null
          target_clients: number | null
          target_commission: number | null
          target_projects: number | null
          target_referrals: number | null
          target_revenue: number | null
          updated_at: string | null
        }
        Insert: {
          actual_clients?: number | null
          actual_commission?: number | null
          actual_projects?: number | null
          actual_referrals?: number | null
          actual_revenue?: number | null
          created_at?: string | null
          designer_id: string
          end_date: string
          goal_type: string
          id?: string
          notes?: string | null
          start_date: string
          status?: string | null
          target_clients?: number | null
          target_commission?: number | null
          target_projects?: number | null
          target_referrals?: number | null
          target_revenue?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_clients?: number | null
          actual_commission?: number | null
          actual_projects?: number | null
          actual_referrals?: number | null
          actual_revenue?: number | null
          created_at?: string | null
          designer_id?: string
          end_date?: string
          goal_type?: string
          id?: string
          notes?: string | null
          start_date?: string
          status?: string | null
          target_clients?: number | null
          target_commission?: number | null
          target_projects?: number | null
          target_referrals?: number | null
          target_revenue?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_goals_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_goals_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_lead_credits: {
        Row: {
          created_at: string | null
          credits_balance: number | null
          credits_used: number | null
          designer_id: string
          id: string
          monthly_leads_remaining: number | null
          subscription_end_date: string | null
          subscription_package_id: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          total_amount_spent: number | null
          total_credits_purchased: number | null
          total_leads_purchased: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credits_balance?: number | null
          credits_used?: number | null
          designer_id: string
          id?: string
          monthly_leads_remaining?: number | null
          subscription_end_date?: string | null
          subscription_package_id?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          total_amount_spent?: number | null
          total_credits_purchased?: number | null
          total_leads_purchased?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credits_balance?: number | null
          credits_used?: number | null
          designer_id?: string
          id?: string
          monthly_leads_remaining?: number | null
          subscription_end_date?: string | null
          subscription_package_id?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          total_amount_spent?: number | null
          total_credits_purchased?: number | null
          total_leads_purchased?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_lead_credits_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: true
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_lead_credits_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: true
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_lead_credits_subscription_package_id_fkey"
            columns: ["subscription_package_id"]
            isOneToOne: false
            referencedRelation: "lead_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_leads: {
        Row: {
          amount_paid: number | null
          budget_range: string | null
          contact_attempts: number | null
          converted_at: string | null
          converted_project_id: string | null
          converted_value: number | null
          created_at: string | null
          credits_spent: number | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          designer_id: string
          estimated_budget: number | null
          first_contact_at: string | null
          first_contact_method: string | null
          id: string
          internal_notes: string | null
          is_refund_requested: boolean | null
          last_contact_at: string | null
          lead_id: string
          lead_quality_rating: number | null
          next_follow_up_date: string | null
          notes: string | null
          project_city: string | null
          project_type: string | null
          purchase_date: string | null
          purchase_type: string | null
          quality_feedback: string | null
          refund_processed_at: string | null
          refund_reason: string | null
          refund_status: string | null
          requirements_summary: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount_paid?: number | null
          budget_range?: string | null
          contact_attempts?: number | null
          converted_at?: string | null
          converted_project_id?: string | null
          converted_value?: number | null
          created_at?: string | null
          credits_spent?: number | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          designer_id: string
          estimated_budget?: number | null
          first_contact_at?: string | null
          first_contact_method?: string | null
          id?: string
          internal_notes?: string | null
          is_refund_requested?: boolean | null
          last_contact_at?: string | null
          lead_id: string
          lead_quality_rating?: number | null
          next_follow_up_date?: string | null
          notes?: string | null
          project_city?: string | null
          project_type?: string | null
          purchase_date?: string | null
          purchase_type?: string | null
          quality_feedback?: string | null
          refund_processed_at?: string | null
          refund_reason?: string | null
          refund_status?: string | null
          requirements_summary?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number | null
          budget_range?: string | null
          contact_attempts?: number | null
          converted_at?: string | null
          converted_project_id?: string | null
          converted_value?: number | null
          created_at?: string | null
          credits_spent?: number | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          designer_id?: string
          estimated_budget?: number | null
          first_contact_at?: string | null
          first_contact_method?: string | null
          id?: string
          internal_notes?: string | null
          is_refund_requested?: boolean | null
          last_contact_at?: string | null
          lead_id?: string
          lead_quality_rating?: number | null
          next_follow_up_date?: string | null
          notes?: string | null
          project_city?: string | null
          project_type?: string | null
          purchase_date?: string | null
          purchase_type?: string | null
          quality_feedback?: string | null
          refund_processed_at?: string | null
          refund_reason?: string | null
          refund_status?: string | null
          requirements_summary?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_leads_converted_project_id_fkey"
            columns: ["converted_project_id"]
            isOneToOne: false
            referencedRelation: "client_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "designer_leads_converted_project_id_fkey"
            columns: ["converted_project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_leads_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_leads_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_leads_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "available_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_materials: {
        Row: {
          brand: string | null
          category: string | null
          cost_price: number | null
          created_at: string | null
          description: string | null
          designer_id: string | null
          id: string
          image_url: string | null
          images: Json | null
          is_active: boolean | null
          lead_time_days: number | null
          margin_percent: number | null
          min_order_quantity: number | null
          name: string
          notes: string | null
          selling_price: number | null
          sku: string | null
          supplier_contact: string | null
          supplier_name: string | null
          supplier_notes: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          designer_id?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_active?: boolean | null
          lead_time_days?: number | null
          margin_percent?: number | null
          min_order_quantity?: number | null
          name: string
          notes?: string | null
          selling_price?: number | null
          sku?: string | null
          supplier_contact?: string | null
          supplier_name?: string | null
          supplier_notes?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          designer_id?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_active?: boolean | null
          lead_time_days?: number | null
          margin_percent?: number | null
          min_order_quantity?: number | null
          name?: string
          notes?: string | null
          selling_price?: number | null
          sku?: string | null
          supplier_contact?: string | null
          supplier_name?: string | null
          supplier_notes?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_materials_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_materials_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_monitoring_status: {
        Row: {
          created_at: string | null
          credit_eligible: boolean | null
          current_month: number | null
          designer_id: string
          eligibility_decision_date: string | null
          eligibility_notes: string | null
          id: string
          monitoring_end_date: string | null
          monitoring_start_date: string
          on_time_payment_rate: number | null
          payment_discipline_score: number | null
          project_completion_rate: number | null
          recommended_credit_limit: number | null
          risk_level: string | null
          status: string | null
          total_months: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credit_eligible?: boolean | null
          current_month?: number | null
          designer_id: string
          eligibility_decision_date?: string | null
          eligibility_notes?: string | null
          id?: string
          monitoring_end_date?: string | null
          monitoring_start_date?: string
          on_time_payment_rate?: number | null
          payment_discipline_score?: number | null
          project_completion_rate?: number | null
          recommended_credit_limit?: number | null
          risk_level?: string | null
          status?: string | null
          total_months?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credit_eligible?: boolean | null
          current_month?: number | null
          designer_id?: string
          eligibility_decision_date?: string | null
          eligibility_notes?: string | null
          id?: string
          monitoring_end_date?: string | null
          monitoring_start_date?: string
          on_time_payment_rate?: number | null
          payment_discipline_score?: number | null
          project_completion_rate?: number | null
          recommended_credit_limit?: number | null
          risk_level?: string | null
          status?: string | null
          total_months?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_monitoring_status_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_osas_credit: {
        Row: {
          active_emi_count: number | null
          credit_available: number | null
          credit_frozen: boolean | null
          credit_limit: number | null
          credit_used: number | null
          credit_utilization_percent: number | null
          current_dues: number | null
          designer_id: string
          freeze_reason: string | null
          id: string
          last_disbursement_date: string | null
          last_payment_date: string | null
          overdue_amount: number | null
          payment_status: string | null
          pending_penalties: number | null
          total_emi_outstanding: number | null
          total_outstanding: number | null
          total_penalties: number | null
          updated_at: string | null
        }
        Insert: {
          active_emi_count?: number | null
          credit_available?: number | null
          credit_frozen?: boolean | null
          credit_limit?: number | null
          credit_used?: number | null
          credit_utilization_percent?: number | null
          current_dues?: number | null
          designer_id: string
          freeze_reason?: string | null
          id?: string
          last_disbursement_date?: string | null
          last_payment_date?: string | null
          overdue_amount?: number | null
          payment_status?: string | null
          pending_penalties?: number | null
          total_emi_outstanding?: number | null
          total_outstanding?: number | null
          total_penalties?: number | null
          updated_at?: string | null
        }
        Update: {
          active_emi_count?: number | null
          credit_available?: number | null
          credit_frozen?: boolean | null
          credit_limit?: number | null
          credit_used?: number | null
          credit_utilization_percent?: number | null
          current_dues?: number | null
          designer_id?: string
          freeze_reason?: string | null
          id?: string
          last_disbursement_date?: string | null
          last_payment_date?: string | null
          overdue_amount?: number | null
          payment_status?: string | null
          pending_penalties?: number | null
          total_emi_outstanding?: number | null
          total_outstanding?: number | null
          total_penalties?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_osas_credit_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_osas_invoices: {
        Row: {
          created_at: string | null
          days_overdue: number | null
          designer_id: string
          designer_paid_amount: number | null
          due_date: string
          emi_plan_id: string | null
          id: string
          invoice_amount: number
          invoice_date: string | null
          invoice_number: string
          is_emi_converted: boolean | null
          notes: string | null
          original_invoice_id: string | null
          osas_paid_amount: number | null
          outstanding: number | null
          penalty_amount: number | null
          penalty_rate: number | null
          project_id: string | null
          project_name: string | null
          status: string | null
          supplier_id: string | null
          supplier_name: string | null
          supplier_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          days_overdue?: number | null
          designer_id: string
          designer_paid_amount?: number | null
          due_date: string
          emi_plan_id?: string | null
          id?: string
          invoice_amount: number
          invoice_date?: string | null
          invoice_number: string
          is_emi_converted?: boolean | null
          notes?: string | null
          original_invoice_id?: string | null
          osas_paid_amount?: number | null
          outstanding?: number | null
          penalty_amount?: number | null
          penalty_rate?: number | null
          project_id?: string | null
          project_name?: string | null
          status?: string | null
          supplier_id?: string | null
          supplier_name?: string | null
          supplier_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          days_overdue?: number | null
          designer_id?: string
          designer_paid_amount?: number | null
          due_date?: string
          emi_plan_id?: string | null
          id?: string
          invoice_amount?: number
          invoice_date?: string | null
          invoice_number?: string
          is_emi_converted?: boolean | null
          notes?: string | null
          original_invoice_id?: string | null
          osas_paid_amount?: number | null
          outstanding?: number | null
          penalty_amount?: number | null
          penalty_rate?: number | null
          project_id?: string | null
          project_name?: string | null
          status?: string | null
          supplier_id?: string | null
          supplier_name?: string | null
          supplier_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_osas_invoices_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_osas_invoices_original_invoice_id_fkey"
            columns: ["original_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_osas_payments: {
        Row: {
          amount: number
          created_at: string | null
          designer_id: string
          failure_reason: string | null
          id: string
          osas_invoice_id: string | null
          payment_date: string | null
          payment_mode: string
          reference_number: string | null
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          designer_id: string
          failure_reason?: string | null
          id?: string
          osas_invoice_id?: string | null
          payment_date?: string | null
          payment_mode: string
          reference_number?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          designer_id?: string
          failure_reason?: string | null
          id?: string
          osas_invoice_id?: string | null
          payment_date?: string | null
          payment_mode?: string
          reference_number?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_osas_payments_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_osas_payments_osas_invoice_id_fkey"
            columns: ["osas_invoice_id"]
            isOneToOne: false
            referencedRelation: "designer_osas_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_osas_repayments: {
        Row: {
          created_at: string | null
          days_overdue: number | null
          designer_id: string
          due_date: string
          id: string
          last_payment_date: string | null
          order_id: string
          original_amount: number
          outstanding_amount: number
          paid_amount: number | null
          paid_on_time: boolean | null
          penalty_amount: number | null
          penalty_applied: boolean | null
          project_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          days_overdue?: number | null
          designer_id: string
          due_date: string
          id?: string
          last_payment_date?: string | null
          order_id: string
          original_amount: number
          outstanding_amount: number
          paid_amount?: number | null
          paid_on_time?: boolean | null
          penalty_amount?: number | null
          penalty_applied?: boolean | null
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          days_overdue?: number | null
          designer_id?: string
          due_date?: string
          id?: string
          last_payment_date?: string | null
          order_id?: string
          original_amount?: number
          outstanding_amount?: number
          paid_amount?: number | null
          paid_on_time?: boolean | null
          penalty_amount?: number | null
          penalty_applied?: boolean | null
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_osas_repayments_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_osas_repayments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_osas_repayments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "designer_osas_repayments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_osas_transactions: {
        Row: {
          amount: number
          balance_after: number | null
          created_at: string | null
          description: string | null
          designer_id: string
          id: string
          order_id: string | null
          payment_method: string | null
          payment_reference: string | null
          project_id: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          balance_after?: number | null
          created_at?: string | null
          description?: string | null
          designer_id: string
          id?: string
          order_id?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          project_id?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          balance_after?: number | null
          created_at?: string | null
          description?: string | null
          designer_id?: string
          id?: string
          order_id?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          project_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "designer_osas_transactions_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_osas_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_osas_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "designer_osas_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_partner_categories: {
        Row: {
          category: string
          created_at: string | null
          id: string
          is_primary: boolean | null
          mapping_id: string
          notes: string | null
          volume_percentage: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          mapping_id: string
          notes?: string | null
          volume_percentage?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          mapping_id?: string
          notes?: string | null
          volume_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_partner_categories_mapping_id_fkey"
            columns: ["mapping_id"]
            isOneToOne: false
            referencedRelation: "designer_partner_mappings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_partner_categories_mapping_id_fkey"
            columns: ["mapping_id"]
            isOneToOne: false
            referencedRelation: "designer_partner_summary"
            referencedColumns: ["mapping_id"]
          },
        ]
      }
      designer_partner_mappings: {
        Row: {
          avg_delivery_days: number | null
          commission_rate_override: number | null
          communication_rating: number | null
          created_at: string | null
          credit_limit: number | null
          designer_id: string
          first_order_date: string | null
          id: string
          is_preferred: boolean | null
          is_verified: boolean | null
          last_order_date: string | null
          on_time_delivery_rate: number | null
          partner_id: string
          partner_type: string
          partnership_tier: string | null
          payment_terms_days: number | null
          quality_rating: number | null
          relationship_started_at: string | null
          special_notes: string | null
          total_commission_earned: number | null
          total_orders: number | null
          total_value: number | null
          updated_at: string | null
        }
        Insert: {
          avg_delivery_days?: number | null
          commission_rate_override?: number | null
          communication_rating?: number | null
          created_at?: string | null
          credit_limit?: number | null
          designer_id: string
          first_order_date?: string | null
          id?: string
          is_preferred?: boolean | null
          is_verified?: boolean | null
          last_order_date?: string | null
          on_time_delivery_rate?: number | null
          partner_id: string
          partner_type: string
          partnership_tier?: string | null
          payment_terms_days?: number | null
          quality_rating?: number | null
          relationship_started_at?: string | null
          special_notes?: string | null
          total_commission_earned?: number | null
          total_orders?: number | null
          total_value?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_delivery_days?: number | null
          commission_rate_override?: number | null
          communication_rating?: number | null
          created_at?: string | null
          credit_limit?: number | null
          designer_id?: string
          first_order_date?: string | null
          id?: string
          is_preferred?: boolean | null
          is_verified?: boolean | null
          last_order_date?: string | null
          on_time_delivery_rate?: number | null
          partner_id?: string
          partner_type?: string
          partnership_tier?: string | null
          payment_terms_days?: number | null
          quality_rating?: number | null
          relationship_started_at?: string | null
          special_notes?: string | null
          total_commission_earned?: number | null
          total_orders?: number | null
          total_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_partner_mappings_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_partner_mappings_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_partner_reviews: {
        Row: {
          after_sales_rating: number | null
          communication_rating: number | null
          cons: string[] | null
          created_at: string | null
          delivery_rating: number | null
          designer_id: string
          id: string
          is_approved: boolean | null
          is_public: boolean | null
          is_verified: boolean | null
          mapping_id: string
          moderation_notes: string | null
          order_value_range: string | null
          overall_rating: number
          pricing_rating: number | null
          product_quality_rating: number | null
          project_id: string | null
          pros: string[] | null
          review_text: string | null
          review_title: string | null
          updated_at: string | null
        }
        Insert: {
          after_sales_rating?: number | null
          communication_rating?: number | null
          cons?: string[] | null
          created_at?: string | null
          delivery_rating?: number | null
          designer_id: string
          id?: string
          is_approved?: boolean | null
          is_public?: boolean | null
          is_verified?: boolean | null
          mapping_id: string
          moderation_notes?: string | null
          order_value_range?: string | null
          overall_rating: number
          pricing_rating?: number | null
          product_quality_rating?: number | null
          project_id?: string | null
          pros?: string[] | null
          review_text?: string | null
          review_title?: string | null
          updated_at?: string | null
        }
        Update: {
          after_sales_rating?: number | null
          communication_rating?: number | null
          cons?: string[] | null
          created_at?: string | null
          delivery_rating?: number | null
          designer_id?: string
          id?: string
          is_approved?: boolean | null
          is_public?: boolean | null
          is_verified?: boolean | null
          mapping_id?: string
          moderation_notes?: string | null
          order_value_range?: string | null
          overall_rating?: number
          pricing_rating?: number | null
          product_quality_rating?: number | null
          project_id?: string | null
          pros?: string[] | null
          review_text?: string | null
          review_title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_partner_reviews_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_partner_reviews_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_partner_reviews_mapping_id_fkey"
            columns: ["mapping_id"]
            isOneToOne: false
            referencedRelation: "designer_partner_mappings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_partner_reviews_mapping_id_fkey"
            columns: ["mapping_id"]
            isOneToOne: false
            referencedRelation: "designer_partner_summary"
            referencedColumns: ["mapping_id"]
          },
          {
            foreignKeyName: "designer_partner_reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "designer_partner_reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_partner_transactions: {
        Row: {
          actual_delivery_date: string | null
          commission_amount: number | null
          created_at: string | null
          delivery_rating: number | null
          designer_id: string
          discount_given: number | null
          expected_delivery_date: string | null
          id: string
          mapping_id: string
          notes: string | null
          order_value: number | null
          partner_id: string
          partner_type: string
          project_id: string | null
          quality_rating: number | null
          reference_id: string | null
          reference_number: string | null
          reference_type: string | null
          status: string | null
          transaction_type: string
        }
        Insert: {
          actual_delivery_date?: string | null
          commission_amount?: number | null
          created_at?: string | null
          delivery_rating?: number | null
          designer_id: string
          discount_given?: number | null
          expected_delivery_date?: string | null
          id?: string
          mapping_id: string
          notes?: string | null
          order_value?: number | null
          partner_id: string
          partner_type: string
          project_id?: string | null
          quality_rating?: number | null
          reference_id?: string | null
          reference_number?: string | null
          reference_type?: string | null
          status?: string | null
          transaction_type: string
        }
        Update: {
          actual_delivery_date?: string | null
          commission_amount?: number | null
          created_at?: string | null
          delivery_rating?: number | null
          designer_id?: string
          discount_given?: number | null
          expected_delivery_date?: string | null
          id?: string
          mapping_id?: string
          notes?: string | null
          order_value?: number | null
          partner_id?: string
          partner_type?: string
          project_id?: string | null
          quality_rating?: number | null
          reference_id?: string | null
          reference_number?: string | null
          reference_type?: string | null
          status?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "designer_partner_transactions_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_partner_transactions_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_partner_transactions_mapping_id_fkey"
            columns: ["mapping_id"]
            isOneToOne: false
            referencedRelation: "designer_partner_mappings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_partner_transactions_mapping_id_fkey"
            columns: ["mapping_id"]
            isOneToOne: false
            referencedRelation: "designer_partner_summary"
            referencedColumns: ["mapping_id"]
          },
          {
            foreignKeyName: "designer_partner_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "designer_partner_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_payment_milestones: {
        Row: {
          amount: number
          collected_amount: number | null
          collected_date: string | null
          collection_mode: string | null
          created_at: string | null
          designer_id: string
          due_date: string | null
          grace_days: number | null
          id: string
          milestone_description: string | null
          milestone_name: string
          milestone_order: number | null
          notes: string | null
          percentage_of_total: number | null
          project_id: string
          reminder_count: number | null
          reminder_date: string | null
          reminder_sent: boolean | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          collected_amount?: number | null
          collected_date?: string | null
          collection_mode?: string | null
          created_at?: string | null
          designer_id: string
          due_date?: string | null
          grace_days?: number | null
          id?: string
          milestone_description?: string | null
          milestone_name: string
          milestone_order?: number | null
          notes?: string | null
          percentage_of_total?: number | null
          project_id: string
          reminder_count?: number | null
          reminder_date?: string | null
          reminder_sent?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          collected_amount?: number | null
          collected_date?: string | null
          collection_mode?: string | null
          created_at?: string | null
          designer_id?: string
          due_date?: string | null
          grace_days?: number | null
          id?: string
          milestone_description?: string | null
          milestone_name?: string
          milestone_order?: number | null
          notes?: string | null
          percentage_of_total?: number | null
          project_id?: string
          reminder_count?: number | null
          reminder_date?: string | null
          reminder_sent?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_payment_milestones_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_payment_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_client_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_payouts: {
        Row: {
          bank_account_last4: string | null
          commission_total: number | null
          completed_at: string | null
          created_at: string | null
          deduction_notes: string | null
          designer_id: string | null
          id: string
          net_amount: number | null
          notes: string | null
          other_deductions: number | null
          payment_method: string | null
          payment_reference: string | null
          payout_number: string
          period_end: string | null
          period_start: string | null
          processed_at: string | null
          processed_by: string | null
          status: string | null
          tds_amount: number | null
          tds_percent: number | null
          updated_at: string | null
        }
        Insert: {
          bank_account_last4?: string | null
          commission_total?: number | null
          completed_at?: string | null
          created_at?: string | null
          deduction_notes?: string | null
          designer_id?: string | null
          id?: string
          net_amount?: number | null
          notes?: string | null
          other_deductions?: number | null
          payment_method?: string | null
          payment_reference?: string | null
          payout_number: string
          period_end?: string | null
          period_start?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          tds_amount?: number | null
          tds_percent?: number | null
          updated_at?: string | null
        }
        Update: {
          bank_account_last4?: string | null
          commission_total?: number | null
          completed_at?: string | null
          created_at?: string | null
          deduction_notes?: string | null
          designer_id?: string | null
          id?: string
          net_amount?: number | null
          notes?: string | null
          other_deductions?: number | null
          payment_method?: string | null
          payment_reference?: string | null
          payout_number?: string
          period_end?: string | null
          period_start?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          tds_amount?: number | null
          tds_percent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_payouts_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_payouts_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_payouts_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_portfolio_images: {
        Row: {
          created_at: string | null
          description: string | null
          designer_id: string | null
          display_order: number | null
          id: string
          image_url: string
          is_featured: boolean | null
          project_title: string | null
          project_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          designer_id?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          project_title?: string | null
          project_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          designer_id?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          project_title?: string | null
          project_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_portfolio_images_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_portfolio_images_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_project_credit: {
        Row: {
          client_name: string | null
          created_at: string | null
          credit_health: string | null
          credit_limit_for_project: number | null
          credit_used: number | null
          designer_id: string
          id: string
          outstanding: number | null
          paid: number | null
          project_id: string
          project_name: string
          project_status: string | null
          project_value: number | null
          updated_at: string | null
        }
        Insert: {
          client_name?: string | null
          created_at?: string | null
          credit_health?: string | null
          credit_limit_for_project?: number | null
          credit_used?: number | null
          designer_id: string
          id?: string
          outstanding?: number | null
          paid?: number | null
          project_id: string
          project_name: string
          project_status?: string | null
          project_value?: number | null
          updated_at?: string | null
        }
        Update: {
          client_name?: string | null
          created_at?: string | null
          credit_health?: string | null
          credit_limit_for_project?: number | null
          credit_used?: number | null
          designer_id?: string
          id?: string
          outstanding?: number | null
          paid?: number | null
          project_id?: string
          project_name?: string
          project_status?: string | null
          project_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_project_credit_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_projects: {
        Row: {
          actual_completion_date: string | null
          actual_start_date: string | null
          approval_status: string | null
          built_up_area: number | null
          carpet_area: number | null
          client_address: string | null
          client_id: string | null
          client_name: string | null
          client_phone: string | null
          commission_amount: number | null
          completed_deliveries: number | null
          completion_date: string | null
          created_at: string | null
          credit_allocated: number | null
          credit_used: number | null
          current_quotation_id: string | null
          delay_days: number | null
          designer_id: string | null
          end_date: string | null
          estimated_budget: number | null
          expected_completion: string | null
          final_cost: number | null
          id: string
          is_client_visible: boolean | null
          last_site_visit: string | null
          location: string | null
          notes: string | null
          overall_progress_percent: number | null
          pending_change_requests: number | null
          pending_deliveries: number | null
          project_name: string
          project_type: string | null
          project_value: number | null
          start_date: string | null
          status: string | null
          total_paid: number | null
          total_site_visits: number | null
          updated_at: string | null
        }
        Insert: {
          actual_completion_date?: string | null
          actual_start_date?: string | null
          approval_status?: string | null
          built_up_area?: number | null
          carpet_area?: number | null
          client_address?: string | null
          client_id?: string | null
          client_name?: string | null
          client_phone?: string | null
          commission_amount?: number | null
          completed_deliveries?: number | null
          completion_date?: string | null
          created_at?: string | null
          credit_allocated?: number | null
          credit_used?: number | null
          current_quotation_id?: string | null
          delay_days?: number | null
          designer_id?: string | null
          end_date?: string | null
          estimated_budget?: number | null
          expected_completion?: string | null
          final_cost?: number | null
          id?: string
          is_client_visible?: boolean | null
          last_site_visit?: string | null
          location?: string | null
          notes?: string | null
          overall_progress_percent?: number | null
          pending_change_requests?: number | null
          pending_deliveries?: number | null
          project_name: string
          project_type?: string | null
          project_value?: number | null
          start_date?: string | null
          status?: string | null
          total_paid?: number | null
          total_site_visits?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_completion_date?: string | null
          actual_start_date?: string | null
          approval_status?: string | null
          built_up_area?: number | null
          carpet_area?: number | null
          client_address?: string | null
          client_id?: string | null
          client_name?: string | null
          client_phone?: string | null
          commission_amount?: number | null
          completed_deliveries?: number | null
          completion_date?: string | null
          created_at?: string | null
          credit_allocated?: number | null
          credit_used?: number | null
          current_quotation_id?: string | null
          delay_days?: number | null
          designer_id?: string | null
          end_date?: string | null
          estimated_budget?: number | null
          expected_completion?: string | null
          final_cost?: number | null
          id?: string
          is_client_visible?: boolean | null
          last_site_visit?: string | null
          location?: string | null
          notes?: string | null
          overall_progress_percent?: number | null
          pending_change_requests?: number | null
          pending_deliveries?: number | null
          project_name?: string
          project_type?: string | null
          project_value?: number | null
          start_date?: string | null
          status?: string | null
          total_paid?: number | null
          total_site_visits?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "designer_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_projects_current_quotation_id_fkey"
            columns: ["current_quotation_id"]
            isOneToOne: false
            referencedRelation: "designer_quotations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_projects_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_projects_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_quotations: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          created_by: string | null
          designer_margin: number | null
          designer_margin_percent: number | null
          discount_amount: number | null
          discount_percent: number | null
          id: string
          internal_notes: string | null
          notes: string | null
          parent_quotation_id: string | null
          payment_terms: string | null
          project_id: string | null
          quotation_number: string
          rejected_at: string | null
          rejection_reason: string | null
          sent_at: string | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          tax_percent: number | null
          terms_and_conditions: string | null
          total_amount: number | null
          updated_at: string | null
          valid_until: string | null
          version: number | null
          viewed_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by?: string | null
          designer_margin?: number | null
          designer_margin_percent?: number | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          parent_quotation_id?: string | null
          payment_terms?: string | null
          project_id?: string | null
          quotation_number: string
          rejected_at?: string | null
          rejection_reason?: string | null
          sent_at?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_percent?: number | null
          terms_and_conditions?: string | null
          total_amount?: number | null
          updated_at?: string | null
          valid_until?: string | null
          version?: number | null
          viewed_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by?: string | null
          designer_margin?: number | null
          designer_margin_percent?: number | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          parent_quotation_id?: string | null
          payment_terms?: string | null
          project_id?: string | null
          quotation_number?: string
          rejected_at?: string | null
          rejection_reason?: string | null
          sent_at?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_percent?: number | null
          terms_and_conditions?: string | null
          total_amount?: number | null
          updated_at?: string | null
          valid_until?: string | null
          version?: number | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_quotations_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_quotations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_quotations_parent_quotation_id_fkey"
            columns: ["parent_quotation_id"]
            isOneToOne: false
            referencedRelation: "designer_quotations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_quotations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "designer_quotations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_referrals: {
        Row: {
          client_email: string | null
          client_id: string | null
          client_name: string | null
          client_phone: string | null
          commission_earned: number | null
          commission_paid: boolean | null
          commission_paid_at: string | null
          contacted_at: string | null
          converted_at: string | null
          converted_order_id: string | null
          converted_value: number | null
          created_at: string | null
          designer_id: string
          estimated_value: number | null
          follow_up_date: string | null
          follow_up_notes: string | null
          id: string
          notes: string | null
          product_categories: string[] | null
          project_id: string | null
          referral_code: string | null
          referral_reason: string | null
          referral_type: string
          referred_to_id: string
          referred_to_type: string
          status: string | null
          updated_at: string | null
          valid_until: string | null
          visited_at: string | null
        }
        Insert: {
          client_email?: string | null
          client_id?: string | null
          client_name?: string | null
          client_phone?: string | null
          commission_earned?: number | null
          commission_paid?: boolean | null
          commission_paid_at?: string | null
          contacted_at?: string | null
          converted_at?: string | null
          converted_order_id?: string | null
          converted_value?: number | null
          created_at?: string | null
          designer_id: string
          estimated_value?: number | null
          follow_up_date?: string | null
          follow_up_notes?: string | null
          id?: string
          notes?: string | null
          product_categories?: string[] | null
          project_id?: string | null
          referral_code?: string | null
          referral_reason?: string | null
          referral_type: string
          referred_to_id: string
          referred_to_type: string
          status?: string | null
          updated_at?: string | null
          valid_until?: string | null
          visited_at?: string | null
        }
        Update: {
          client_email?: string | null
          client_id?: string | null
          client_name?: string | null
          client_phone?: string | null
          commission_earned?: number | null
          commission_paid?: boolean | null
          commission_paid_at?: string | null
          contacted_at?: string | null
          converted_at?: string | null
          converted_order_id?: string | null
          converted_value?: number | null
          created_at?: string | null
          designer_id?: string
          estimated_value?: number | null
          follow_up_date?: string | null
          follow_up_notes?: string | null
          id?: string
          notes?: string | null
          product_categories?: string[] | null
          project_id?: string | null
          referral_code?: string | null
          referral_reason?: string | null
          referral_type?: string
          referred_to_id?: string
          referred_to_type?: string
          status?: string | null
          updated_at?: string | null
          valid_until?: string | null
          visited_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_referrals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "designer_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_referrals_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_referrals_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_referrals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "designer_referrals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_retailer_links: {
        Row: {
          commission_percentage: number | null
          created_at: string | null
          designer_id: string
          id: string
          is_active: boolean | null
          retailer_id: string
          updated_at: string | null
        }
        Insert: {
          commission_percentage?: number | null
          created_at?: string | null
          designer_id: string
          id?: string
          is_active?: boolean | null
          retailer_id: string
          updated_at?: string | null
        }
        Update: {
          commission_percentage?: number | null
          created_at?: string | null
          designer_id?: string
          id?: string
          is_active?: boolean | null
          retailer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_retailer_links_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_retailer_links_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_reviews: {
        Row: {
          created_at: string | null
          customer_id: string | null
          designer_id: string | null
          id: string
          is_verified: boolean | null
          project_type: string | null
          rating: number | null
          review_text: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          designer_id?: string | null
          id?: string
          is_verified?: boolean | null
          project_type?: string | null
          rating?: number | null
          review_text?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          designer_id?: string | null
          id?: string
          is_verified?: boolean | null
          project_type?: string | null
          rating?: number | null
          review_text?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_reviews_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_reviews_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_saved_products: {
        Row: {
          collection_name: string | null
          created_at: string | null
          custom_margin_percent: number | null
          custom_selling_price: number | null
          designer_id: string | null
          id: string
          notes: string | null
          product_id: string | null
        }
        Insert: {
          collection_name?: string | null
          created_at?: string | null
          custom_margin_percent?: number | null
          custom_selling_price?: number | null
          designer_id?: string | null
          id?: string
          notes?: string | null
          product_id?: string | null
        }
        Update: {
          collection_name?: string | null
          created_at?: string | null
          custom_margin_percent?: number | null
          custom_selling_price?: number | null
          designer_id?: string | null
          id?: string
          notes?: string | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_saved_products_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_saved_products_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_saved_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_supplier_dues: {
        Row: {
          created_at: string | null
          days_overdue: number | null
          designer_id: string
          due_date: string | null
          id: string
          invoice_amount: number
          invoice_date: string | null
          invoice_number: string | null
          last_reminder_date: string | null
          notes: string | null
          outstanding: number | null
          paid_amount: number | null
          project_id: string | null
          project_name: string | null
          reminders_received: number | null
          status: string | null
          supplier_id: string | null
          supplier_name: string
          supplier_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          days_overdue?: number | null
          designer_id: string
          due_date?: string | null
          id?: string
          invoice_amount: number
          invoice_date?: string | null
          invoice_number?: string | null
          last_reminder_date?: string | null
          notes?: string | null
          outstanding?: number | null
          paid_amount?: number | null
          project_id?: string | null
          project_name?: string | null
          reminders_received?: number | null
          status?: string | null
          supplier_id?: string | null
          supplier_name: string
          supplier_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          days_overdue?: number | null
          designer_id?: string
          due_date?: string | null
          id?: string
          invoice_amount?: number
          invoice_date?: string | null
          invoice_number?: string | null
          last_reminder_date?: string | null
          notes?: string | null
          outstanding?: number | null
          paid_amount?: number | null
          project_id?: string | null
          project_name?: string | null
          reminders_received?: number | null
          status?: string | null
          supplier_id?: string | null
          supplier_name?: string
          supplier_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_supplier_dues_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_wholesaler_links: {
        Row: {
          cif_enabled: boolean | null
          created_at: string | null
          designer_id: string
          id: string
          is_active: boolean | null
          updated_at: string | null
          wholesaler_id: string
        }
        Insert: {
          cif_enabled?: boolean | null
          created_at?: string | null
          designer_id: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          wholesaler_id: string
        }
        Update: {
          cif_enabled?: boolean | null
          created_at?: string | null
          designer_id?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "designer_wholesaler_links_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_wholesaler_links_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_broadcasts: {
        Row: {
          actual_cost: number | null
          attachment_urls: string[] | null
          broadcast_name: string
          broadcast_type: string
          channels: string[]
          created_at: string | null
          estimated_cost: number | null
          id: string
          image_url: string | null
          is_template: boolean | null
          location_filter: Json | null
          max_purchase_amount: number | null
          message: string
          min_purchase_amount: number | null
          payment_behavior: string | null
          product_link: string | null
          purchase_date_from: string | null
          purchase_date_to: string | null
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
          target_customer_ids: string[] | null
          target_segments: string[]
          template_name: string | null
          total_clicked: number | null
          total_delivered: number | null
          total_failed: number | null
          total_opened: number | null
          total_recipients: number | null
          total_sent: number | null
          updated_at: string | null
          user_id: string
          video_url: string | null
        }
        Insert: {
          actual_cost?: number | null
          attachment_urls?: string[] | null
          broadcast_name: string
          broadcast_type: string
          channels?: string[]
          created_at?: string | null
          estimated_cost?: number | null
          id?: string
          image_url?: string | null
          is_template?: boolean | null
          location_filter?: Json | null
          max_purchase_amount?: number | null
          message: string
          min_purchase_amount?: number | null
          payment_behavior?: string | null
          product_link?: string | null
          purchase_date_from?: string | null
          purchase_date_to?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          target_customer_ids?: string[] | null
          target_segments?: string[]
          template_name?: string | null
          total_clicked?: number | null
          total_delivered?: number | null
          total_failed?: number | null
          total_opened?: number | null
          total_recipients?: number | null
          total_sent?: number | null
          updated_at?: string | null
          user_id: string
          video_url?: string | null
        }
        Update: {
          actual_cost?: number | null
          attachment_urls?: string[] | null
          broadcast_name?: string
          broadcast_type?: string
          channels?: string[]
          created_at?: string | null
          estimated_cost?: number | null
          id?: string
          image_url?: string | null
          is_template?: boolean | null
          location_filter?: Json | null
          max_purchase_amount?: number | null
          message?: string
          min_purchase_amount?: number | null
          payment_behavior?: string | null
          product_link?: string | null
          purchase_date_from?: string | null
          purchase_date_to?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          target_customer_ids?: string[] | null
          target_segments?: string[]
          template_name?: string | null
          total_clicked?: number | null
          total_delivered?: number | null
          total_failed?: number | null
          total_opened?: number | null
          total_recipients?: number | null
          total_sent?: number | null
          updated_at?: string | null
          user_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "digital_broadcasts_product_link_fkey"
            columns: ["product_link"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_connection_requests: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          proposed_credit_limit: number | null
          proposed_payment_terms: string | null
          responded_at: string | null
          response_message: string | null
          retailer_id: string
          status: string | null
          updated_at: string | null
          wholesaler_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          proposed_credit_limit?: number | null
          proposed_payment_terms?: string | null
          responded_at?: string | null
          response_message?: string | null
          retailer_id: string
          status?: string | null
          updated_at?: string | null
          wholesaler_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          proposed_credit_limit?: number | null
          proposed_payment_terms?: string | null
          responded_at?: string | null
          response_message?: string | null
          retailer_id?: string
          status?: string | null
          updated_at?: string | null
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovery_connection_requests_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discovery_connection_requests_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dispute_comments: {
        Row: {
          attachments: Json | null
          comment: string
          created_at: string | null
          dispute_id: string | null
          id: string
          is_internal: boolean | null
          user_id: string | null
        }
        Insert: {
          attachments?: Json | null
          comment: string
          created_at?: string | null
          dispute_id?: string | null
          id?: string
          is_internal?: boolean | null
          user_id?: string | null
        }
        Update: {
          attachments?: Json | null
          comment?: string
          created_at?: string | null
          dispute_id?: string | null
          id?: string
          is_internal?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispute_comments_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "disputes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          assigned_to: string | null
          attachments: Json | null
          created_at: string | null
          description: string | null
          dispute_number: string
          dispute_type: string | null
          escalated_to: string | null
          id: string
          priority: string | null
          raised_by: string | null
          reference_id: string | null
          reference_type: string | null
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          attachments?: Json | null
          created_at?: string | null
          description?: string | null
          dispute_number: string
          dispute_type?: string | null
          escalated_to?: string | null
          id?: string
          priority?: string | null
          raised_by?: string | null
          reference_id?: string | null
          reference_type?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          attachments?: Json | null
          created_at?: string | null
          description?: string | null
          dispute_number?: string
          dispute_type?: string | null
          escalated_to?: string | null
          id?: string
          priority?: string | null
          raised_by?: string | null
          reference_id?: string | null
          reference_type?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disputes_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_escalated_to_fkey"
            columns: ["escalated_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_raised_by_fkey"
            columns: ["raised_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_expirations: {
        Row: {
          alert_days_before: number | null
          alert_frequency_days: number | null
          created_at: string | null
          document_name: string
          document_number: string | null
          document_type: string
          document_url: string | null
          expiry_date: string | null
          file_size_kb: number | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          issue_date: string | null
          last_alert_sent_at: string | null
          metadata: Json | null
          mime_type: string | null
          notes: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          renewal_date: string | null
          renewal_reminder_sent: boolean | null
          renewal_status: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          alert_days_before?: number | null
          alert_frequency_days?: number | null
          created_at?: string | null
          document_name: string
          document_number?: string | null
          document_type: string
          document_url?: string | null
          expiry_date?: string | null
          file_size_kb?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          issue_date?: string | null
          last_alert_sent_at?: string | null
          metadata?: Json | null
          mime_type?: string | null
          notes?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          renewal_date?: string | null
          renewal_reminder_sent?: boolean | null
          renewal_status?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          alert_days_before?: number | null
          alert_frequency_days?: number | null
          created_at?: string | null
          document_name?: string
          document_number?: string | null
          document_type?: string
          document_url?: string | null
          expiry_date?: string | null
          file_size_kb?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          issue_date?: string | null
          last_alert_sent_at?: string | null
          metadata?: Json | null
          mime_type?: string | null
          notes?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          renewal_date?: string | null
          renewal_reminder_sent?: boolean | null
          renewal_status?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          address: string | null
          city: string | null
          contact_name: string
          created_at: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          notes: string | null
          phone_primary: string
          phone_secondary: string | null
          postal_code: string | null
          relationship: string
          staff_id: string
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_name: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          notes?: string | null
          phone_primary: string
          phone_secondary?: string | null
          postal_code?: string | null
          relationship: string
          staff_id: string
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_name?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          notes?: string | null
          phone_primary?: string
          phone_secondary?: string | null
          postal_code?: string | null
          relationship?: string
          staff_id?: string
          state?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      emi_schedules: {
        Row: {
          amount: number
          created_at: string | null
          credit_application_id: string | null
          due_date: string
          emi_number: number
          id: string
          late_fee: number | null
          paid_amount: number | null
          paid_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          credit_application_id?: string | null
          due_date: string
          emi_number: number
          id?: string
          late_fee?: number | null
          paid_amount?: number | null
          paid_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          credit_application_id?: string | null
          due_date?: string
          emi_number?: number
          id?: string
          late_fee?: number | null
          paid_amount?: number | null
          paid_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emi_schedules_credit_application_id_fkey"
            columns: ["credit_application_id"]
            isOneToOne: false
            referencedRelation: "credit_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string | null
          created_by: string
          description: string | null
          expense_date: string
          expense_number: string
          id: string
          notes: string | null
          payment_method: string | null
          receipt_url: string | null
          status: Database["public"]["Enums"]["expense_status"]
          sub_category: string | null
          updated_at: string | null
          vendor_contact: string | null
          vendor_name: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string | null
          created_by: string
          description?: string | null
          expense_date?: string
          expense_number: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["expense_status"]
          sub_category?: string | null
          updated_at?: string | null
          vendor_contact?: string | null
          vendor_name?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string | null
          created_by?: string
          description?: string | null
          expense_date?: string
          expense_number?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["expense_status"]
          sub_category?: string | null
          updated_at?: string | null
          vendor_contact?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string
          created_at: string | null
          created_by: string | null
          display_order: number | null
          id: string
          is_published: boolean | null
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          category: string
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          question?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faqs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_alerts: {
        Row: {
          alert_message: string
          alert_title: string
          alert_type: string
          created_at: string | null
          id: string
          is_read: boolean | null
          is_resolved: boolean | null
          merchant_id: string
          order_id: string | null
          product_id: string | null
          rating_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          review_id: string | null
          severity: string
        }
        Insert: {
          alert_message: string
          alert_title: string
          alert_type: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          merchant_id: string
          order_id?: string | null
          product_id?: string | null
          rating_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          review_id?: string | null
          severity: string
        }
        Update: {
          alert_message?: string
          alert_title?: string
          alert_type?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          merchant_id?: string
          order_id?: string | null
          product_id?: string | null
          rating_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          review_id?: string | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_alerts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_alerts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_alerts_rating_id_fkey"
            columns: ["rating_id"]
            isOneToOne: false
            referencedRelation: "order_ratings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_alerts_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "product_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      field_gps_logs: {
        Row: {
          accuracy: number | null
          altitude: number | null
          battery_level: number | null
          id: string
          is_charging: boolean | null
          is_online: boolean | null
          latitude: number
          longitude: number
          network_type: string | null
          recorded_at: string | null
          staff_id: string
          visit_id: string | null
        }
        Insert: {
          accuracy?: number | null
          altitude?: number | null
          battery_level?: number | null
          id?: string
          is_charging?: boolean | null
          is_online?: boolean | null
          latitude: number
          longitude: number
          network_type?: string | null
          recorded_at?: string | null
          staff_id: string
          visit_id?: string | null
        }
        Update: {
          accuracy?: number | null
          altitude?: number | null
          battery_level?: number | null
          id?: string
          is_charging?: boolean | null
          is_online?: boolean | null
          latitude?: number
          longitude?: number
          network_type?: string | null
          recorded_at?: string | null
          staff_id?: string
          visit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "field_gps_logs_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_gps_logs_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "field_visits"
            referencedColumns: ["id"]
          },
        ]
      }
      field_visits: {
        Row: {
          created_at: string | null
          customer_id: string | null
          duration_minutes: number | null
          employer_id: string
          end_address: string | null
          end_latitude: number | null
          end_longitude: number | null
          end_time: string | null
          id: string
          notes: string | null
          photo_url: string | null
          photos: Json | null
          retailer_id: string | null
          staff_id: string
          start_address: string | null
          start_latitude: number | null
          start_longitude: number | null
          start_time: string
          status: string | null
          updated_at: string | null
          visit_purpose: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          duration_minutes?: number | null
          employer_id: string
          end_address?: string | null
          end_latitude?: number | null
          end_longitude?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          photo_url?: string | null
          photos?: Json | null
          retailer_id?: string | null
          staff_id: string
          start_address?: string | null
          start_latitude?: number | null
          start_longitude?: number | null
          start_time: string
          status?: string | null
          updated_at?: string | null
          visit_purpose?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          duration_minutes?: number | null
          employer_id?: string
          end_address?: string | null
          end_latitude?: number | null
          end_longitude?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          photo_url?: string | null
          photos?: Json | null
          retailer_id?: string | null
          staff_id?: string
          start_address?: string | null
          start_latitude?: number | null
          start_longitude?: number | null
          start_time?: string
          status?: string | null
          updated_at?: string | null
          visit_purpose?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "field_visits_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_visits_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_visits_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_visits_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_configurations: {
        Row: {
          alert_on_credit_threshold: boolean | null
          alert_on_payment_due: boolean | null
          alert_on_payment_received: boolean | null
          auto_calculate_gst: boolean | null
          auto_credit_approval: boolean | null
          auto_mark_paid_on_upi: boolean | null
          created_at: string | null
          credit_alert_percentage: number | null
          default_credit_days: number | null
          default_payment_mode: string | null
          default_sale_type: string | null
          enable_auto_payment_reminders: boolean | null
          enable_auto_settlement: boolean | null
          enable_private_mode: boolean | null
          gst_percentage: number | null
          id: string
          max_credit_limit: number | null
          payment_reminder_days_before: number | null
          primary_account_holder_name: string | null
          primary_account_number: string | null
          primary_bank_name: string | null
          primary_ifsc_code: string | null
          private_mode_require_pin: boolean | null
          private_mode_staff_access: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          alert_on_credit_threshold?: boolean | null
          alert_on_payment_due?: boolean | null
          alert_on_payment_received?: boolean | null
          auto_calculate_gst?: boolean | null
          auto_credit_approval?: boolean | null
          auto_mark_paid_on_upi?: boolean | null
          created_at?: string | null
          credit_alert_percentage?: number | null
          default_credit_days?: number | null
          default_payment_mode?: string | null
          default_sale_type?: string | null
          enable_auto_payment_reminders?: boolean | null
          enable_auto_settlement?: boolean | null
          enable_private_mode?: boolean | null
          gst_percentage?: number | null
          id?: string
          max_credit_limit?: number | null
          payment_reminder_days_before?: number | null
          primary_account_holder_name?: string | null
          primary_account_number?: string | null
          primary_bank_name?: string | null
          primary_ifsc_code?: string | null
          private_mode_require_pin?: boolean | null
          private_mode_staff_access?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          alert_on_credit_threshold?: boolean | null
          alert_on_payment_due?: boolean | null
          alert_on_payment_received?: boolean | null
          auto_calculate_gst?: boolean | null
          auto_credit_approval?: boolean | null
          auto_mark_paid_on_upi?: boolean | null
          created_at?: string | null
          credit_alert_percentage?: number | null
          default_credit_days?: number | null
          default_payment_mode?: string | null
          default_sale_type?: string | null
          enable_auto_payment_reminders?: boolean | null
          enable_auto_settlement?: boolean | null
          enable_private_mode?: boolean | null
          gst_percentage?: number | null
          id?: string
          max_credit_limit?: number | null
          payment_reminder_days_before?: number | null
          primary_account_holder_name?: string | null
          primary_account_number?: string | null
          primary_bank_name?: string | null
          primary_ifsc_code?: string | null
          private_mode_require_pin?: boolean | null
          private_mode_staff_access?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      finishes: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      footfall_analytics: {
        Row: {
          created_at: string | null
          date: string
          hour: number | null
          id: string
          peak_hour: boolean | null
          recorded_at: string | null
          source: string | null
          store_id: string | null
          unique_visitors: number | null
          visitor_count: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          hour?: number | null
          id?: string
          peak_hour?: boolean | null
          recorded_at?: string | null
          source?: string | null
          store_id?: string | null
          unique_visitors?: number | null
          visitor_count?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          hour?: number | null
          id?: string
          peak_hour?: boolean | null
          recorded_at?: string | null
          source?: string | null
          store_id?: string | null
          unique_visitors?: number | null
          visitor_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "footfall_analytics_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gst_compliance_audit_log: {
        Row: {
          action: string
          change_summary: string | null
          created_at: string | null
          device_info: string | null
          entity_id: string | null
          entity_number: string | null
          entity_type: string
          id: string
          ip_address: string | null
          is_reversal: boolean | null
          new_values: Json | null
          old_values: Json | null
          reversal_of: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          change_summary?: string | null
          created_at?: string | null
          device_info?: string | null
          entity_id?: string | null
          entity_number?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          is_reversal?: boolean | null
          new_values?: Json | null
          old_values?: Json | null
          reversal_of?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          change_summary?: string | null
          created_at?: string | null
          device_info?: string | null
          entity_id?: string | null
          entity_number?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          is_reversal?: boolean | null
          new_values?: Json | null
          old_values?: Json | null
          reversal_of?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gst_compliance_audit_log_reversal_of_fkey"
            columns: ["reversal_of"]
            isOneToOne: false
            referencedRelation: "gst_compliance_audit_log"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gst_compliance_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gst_invoice_items: {
        Row: {
          cess_amount: number | null
          cess_rate: number | null
          cgst_amount: number | null
          cgst_rate: number | null
          created_at: string | null
          description: string
          discount_amount: number | null
          discount_percent: number | null
          gst_invoice_id: string | null
          gst_rate: number
          hsn_code: string
          id: string
          igst_amount: number | null
          igst_rate: number | null
          product_id: string | null
          quantity: number
          sgst_amount: number | null
          sgst_rate: number | null
          taxable_value: number
          total_amount: number
          unit: string | null
          unit_price: number
        }
        Insert: {
          cess_amount?: number | null
          cess_rate?: number | null
          cgst_amount?: number | null
          cgst_rate?: number | null
          created_at?: string | null
          description: string
          discount_amount?: number | null
          discount_percent?: number | null
          gst_invoice_id?: string | null
          gst_rate: number
          hsn_code: string
          id?: string
          igst_amount?: number | null
          igst_rate?: number | null
          product_id?: string | null
          quantity: number
          sgst_amount?: number | null
          sgst_rate?: number | null
          taxable_value: number
          total_amount: number
          unit?: string | null
          unit_price: number
        }
        Update: {
          cess_amount?: number | null
          cess_rate?: number | null
          cgst_amount?: number | null
          cgst_rate?: number | null
          created_at?: string | null
          description?: string
          discount_amount?: number | null
          discount_percent?: number | null
          gst_invoice_id?: string | null
          gst_rate?: number
          hsn_code?: string
          id?: string
          igst_amount?: number | null
          igst_rate?: number | null
          product_id?: string | null
          quantity?: number
          sgst_amount?: number | null
          sgst_rate?: number | null
          taxable_value?: number
          total_amount?: number
          unit?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "gst_invoice_items_gst_invoice_id_fkey"
            columns: ["gst_invoice_id"]
            isOneToOne: false
            referencedRelation: "gst_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gst_invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      gst_invoices: {
        Row: {
          ack_date: string | null
          ack_number: string | null
          buyer_address: string | null
          buyer_gstin: string | null
          buyer_name: string
          buyer_state_code: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          cess_amount: number | null
          cgst_amount: number | null
          created_at: string | null
          created_by: string | null
          discount_amount: number | null
          financial_year: string
          id: string
          igst_amount: number | null
          invoice_date: string
          invoice_id: string | null
          invoice_number: string
          invoice_type: string
          irn: string | null
          irn_date: string | null
          is_exempt: boolean | null
          is_inter_state: boolean | null
          is_locked: boolean | null
          is_nil_rated: boolean | null
          is_reverse_charge: boolean | null
          locked_at: string | null
          locked_reason: string | null
          notes: string | null
          order_id: string | null
          original_invoice_date: string | null
          original_invoice_id: string | null
          original_invoice_number: string | null
          place_of_supply: string
          round_off: number | null
          sgst_amount: number | null
          signed_qr_code: string | null
          status: string | null
          subtotal: number
          supplier_address: string | null
          supplier_gstin: string | null
          supplier_name: string
          supplier_state_code: string | null
          supply_type: string
          taxable_value: number
          terms_and_conditions: string | null
          total_amount: number
          total_tax: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ack_date?: string | null
          ack_number?: string | null
          buyer_address?: string | null
          buyer_gstin?: string | null
          buyer_name: string
          buyer_state_code?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          cess_amount?: number | null
          cgst_amount?: number | null
          created_at?: string | null
          created_by?: string | null
          discount_amount?: number | null
          financial_year: string
          id?: string
          igst_amount?: number | null
          invoice_date: string
          invoice_id?: string | null
          invoice_number: string
          invoice_type: string
          irn?: string | null
          irn_date?: string | null
          is_exempt?: boolean | null
          is_inter_state?: boolean | null
          is_locked?: boolean | null
          is_nil_rated?: boolean | null
          is_reverse_charge?: boolean | null
          locked_at?: string | null
          locked_reason?: string | null
          notes?: string | null
          order_id?: string | null
          original_invoice_date?: string | null
          original_invoice_id?: string | null
          original_invoice_number?: string | null
          place_of_supply: string
          round_off?: number | null
          sgst_amount?: number | null
          signed_qr_code?: string | null
          status?: string | null
          subtotal?: number
          supplier_address?: string | null
          supplier_gstin?: string | null
          supplier_name: string
          supplier_state_code?: string | null
          supply_type: string
          taxable_value?: number
          terms_and_conditions?: string | null
          total_amount?: number
          total_tax?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ack_date?: string | null
          ack_number?: string | null
          buyer_address?: string | null
          buyer_gstin?: string | null
          buyer_name?: string
          buyer_state_code?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          cess_amount?: number | null
          cgst_amount?: number | null
          created_at?: string | null
          created_by?: string | null
          discount_amount?: number | null
          financial_year?: string
          id?: string
          igst_amount?: number | null
          invoice_date?: string
          invoice_id?: string | null
          invoice_number?: string
          invoice_type?: string
          irn?: string | null
          irn_date?: string | null
          is_exempt?: boolean | null
          is_inter_state?: boolean | null
          is_locked?: boolean | null
          is_nil_rated?: boolean | null
          is_reverse_charge?: boolean | null
          locked_at?: string | null
          locked_reason?: string | null
          notes?: string | null
          order_id?: string | null
          original_invoice_date?: string | null
          original_invoice_id?: string | null
          original_invoice_number?: string | null
          place_of_supply?: string
          round_off?: number | null
          sgst_amount?: number | null
          signed_qr_code?: string | null
          status?: string | null
          subtotal?: number
          supplier_address?: string | null
          supplier_gstin?: string | null
          supplier_name?: string
          supplier_state_code?: string | null
          supply_type?: string
          taxable_value?: number
          terms_and_conditions?: string | null
          total_amount?: number
          total_tax?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gst_invoices_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gst_invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gst_invoices_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gst_invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gst_invoices_original_invoice_id_fkey"
            columns: ["original_invoice_id"]
            isOneToOne: false
            referencedRelation: "gst_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gst_invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gst_returns: {
        Row: {
          acknowledgement_number: string | null
          cess: number | null
          cgst: number | null
          created_at: string | null
          filed_at: string | null
          filed_by: string | null
          filing_period: string | null
          id: string
          igst: number | null
          input_tax_credit: number | null
          notes: string | null
          period_month: number | null
          period_year: number | null
          profile_id: string | null
          return_number: string
          return_type: string | null
          sgst: number | null
          status: string | null
          tax_payable: number | null
          total_purchases: number | null
          total_sales: number | null
          total_tax: number | null
          updated_at: string | null
        }
        Insert: {
          acknowledgement_number?: string | null
          cess?: number | null
          cgst?: number | null
          created_at?: string | null
          filed_at?: string | null
          filed_by?: string | null
          filing_period?: string | null
          id?: string
          igst?: number | null
          input_tax_credit?: number | null
          notes?: string | null
          period_month?: number | null
          period_year?: number | null
          profile_id?: string | null
          return_number: string
          return_type?: string | null
          sgst?: number | null
          status?: string | null
          tax_payable?: number | null
          total_purchases?: number | null
          total_sales?: number | null
          total_tax?: number | null
          updated_at?: string | null
        }
        Update: {
          acknowledgement_number?: string | null
          cess?: number | null
          cgst?: number | null
          created_at?: string | null
          filed_at?: string | null
          filed_by?: string | null
          filing_period?: string | null
          id?: string
          igst?: number | null
          input_tax_credit?: number | null
          notes?: string | null
          period_month?: number | null
          period_year?: number | null
          profile_id?: string | null
          return_number?: string
          return_type?: string | null
          sgst?: number | null
          status?: string | null
          tax_payable?: number | null
          total_purchases?: number | null
          total_sales?: number | null
          total_tax?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gst_returns_filed_by_fkey"
            columns: ["filed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gst_returns_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gst_settings: {
        Row: {
          apply_cess: boolean | null
          auto_calculate_gst: boolean | null
          business_gstin: string | null
          business_state_code: string | null
          composition_scheme: boolean | null
          created_at: string | null
          default_cess_rate: number | null
          default_gst_rate: number | null
          e_invoice_enabled: boolean | null
          e_invoice_threshold: number | null
          e_way_bill_enabled: boolean | null
          e_way_bill_threshold: number | null
          hsn_mandatory: boolean | null
          id: string
          reverse_charge_applicable: boolean | null
          settings: Json | null
          show_gst_breakup: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          apply_cess?: boolean | null
          auto_calculate_gst?: boolean | null
          business_gstin?: string | null
          business_state_code?: string | null
          composition_scheme?: boolean | null
          created_at?: string | null
          default_cess_rate?: number | null
          default_gst_rate?: number | null
          e_invoice_enabled?: boolean | null
          e_invoice_threshold?: number | null
          e_way_bill_enabled?: boolean | null
          e_way_bill_threshold?: number | null
          hsn_mandatory?: boolean | null
          id?: string
          reverse_charge_applicable?: boolean | null
          settings?: Json | null
          show_gst_breakup?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          apply_cess?: boolean | null
          auto_calculate_gst?: boolean | null
          business_gstin?: string | null
          business_state_code?: string | null
          composition_scheme?: boolean | null
          created_at?: string | null
          default_cess_rate?: number | null
          default_gst_rate?: number | null
          e_invoice_enabled?: boolean | null
          e_invoice_threshold?: number | null
          e_way_bill_enabled?: boolean | null
          e_way_bill_threshold?: number | null
          hsn_mandatory?: boolean | null
          id?: string
          reverse_charge_applicable?: boolean | null
          settings?: Json | null
          show_gst_breakup?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gst_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gst_slabs: {
        Row: {
          applicable_hsn_codes: string[] | null
          cess_rate: number | null
          cgst_rate: number
          created_at: string | null
          description: string | null
          id: string
          igst_rate: number
          is_active: boolean | null
          name: string
          rate: number
          sgst_rate: number
          updated_at: string | null
        }
        Insert: {
          applicable_hsn_codes?: string[] | null
          cess_rate?: number | null
          cgst_rate: number
          created_at?: string | null
          description?: string | null
          id?: string
          igst_rate: number
          is_active?: boolean | null
          name: string
          rate: number
          sgst_rate: number
          updated_at?: string | null
        }
        Update: {
          applicable_hsn_codes?: string[] | null
          cess_rate?: number | null
          cgst_rate?: number
          created_at?: string | null
          description?: string | null
          id?: string
          igst_rate?: number
          is_active?: boolean | null
          name?: string
          rate?: number
          sgst_rate?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      help_articles: {
        Row: {
          category: string
          content: string
          created_at: string | null
          created_by: string | null
          description: string
          helpful_count: number | null
          id: string
          is_published: boolean | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          created_by?: string | null
          description: string
          helpful_count?: number | null
          id?: string
          is_published?: boolean | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          description?: string
          helpful_count?: number | null
          id?: string
          is_published?: boolean | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      holidays: {
        Row: {
          applicable_to_region: string | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          is_mandatory: boolean | null
          name: string
        }
        Insert: {
          applicable_to_region?: string | null
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          is_mandatory?: boolean | null
          name: string
        }
        Update: {
          applicable_to_region?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          is_mandatory?: boolean | null
          name?: string
        }
        Relationships: []
      }
      hsn_master: {
        Row: {
          cess_rate: number | null
          cgst_rate: number | null
          chapter: string | null
          created_at: string | null
          created_by: string | null
          description: string
          effective_from: string | null
          effective_to: string | null
          gst_rate: number
          hsn_code: string
          id: string
          igst_rate: number | null
          is_active: boolean | null
          section: string | null
          sgst_rate: number | null
          unit_of_measurement: string | null
          updated_at: string | null
        }
        Insert: {
          cess_rate?: number | null
          cgst_rate?: number | null
          chapter?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          effective_from?: string | null
          effective_to?: string | null
          gst_rate?: number
          hsn_code: string
          id?: string
          igst_rate?: number | null
          is_active?: boolean | null
          section?: string | null
          sgst_rate?: number | null
          unit_of_measurement?: string | null
          updated_at?: string | null
        }
        Update: {
          cess_rate?: number | null
          cgst_rate?: number | null
          chapter?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          effective_from?: string | null
          effective_to?: string | null
          gst_rate?: number
          hsn_code?: string
          id?: string
          igst_rate?: number | null
          is_active?: boolean | null
          section?: string | null
          sgst_rate?: number | null
          unit_of_measurement?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hsn_master_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      incentive_rules: {
        Row: {
          applicable_to_department: string | null
          applicable_to_position: string | null
          created_at: string | null
          created_by: string | null
          effective_from: string
          effective_to: string | null
          id: string
          incentive_amount: number | null
          incentive_percentage: number | null
          is_active: boolean | null
          rule_name: string
          rule_type: string | null
          target_value: number | null
          updated_at: string | null
        }
        Insert: {
          applicable_to_department?: string | null
          applicable_to_position?: string | null
          created_at?: string | null
          created_by?: string | null
          effective_from: string
          effective_to?: string | null
          id?: string
          incentive_amount?: number | null
          incentive_percentage?: number | null
          is_active?: boolean | null
          rule_name: string
          rule_type?: string | null
          target_value?: number | null
          updated_at?: string | null
        }
        Update: {
          applicable_to_department?: string | null
          applicable_to_position?: string | null
          created_at?: string | null
          created_by?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          incentive_amount?: number | null
          incentive_percentage?: number | null
          is_active?: boolean | null
          rule_name?: string
          rule_type?: string | null
          target_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incentive_rules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      incentive_transactions: {
        Row: {
          achieved_value: number | null
          amount: number
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          id: string
          incentive_rule_id: string | null
          paid_at: string | null
          period_end: string | null
          period_start: string | null
          reason: string | null
          staff_id: string
          status: string | null
          target_value: number | null
          updated_at: string | null
        }
        Insert: {
          achieved_value?: number | null
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          incentive_rule_id?: string | null
          paid_at?: string | null
          period_end?: string | null
          period_start?: string | null
          reason?: string | null
          staff_id: string
          status?: string | null
          target_value?: number | null
          updated_at?: string | null
        }
        Update: {
          achieved_value?: number | null
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          incentive_rule_id?: string | null
          paid_at?: string | null
          period_end?: string | null
          period_start?: string | null
          reason?: string | null
          staff_id?: string
          status?: string | null
          target_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incentive_transactions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incentive_transactions_incentive_rule_id_fkey"
            columns: ["incentive_rule_id"]
            isOneToOne: false
            referencedRelation: "incentive_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incentive_transactions_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      incognito_audit_logs: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incognito_audit_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "incognito_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incognito_audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      incognito_sessions: {
        Row: {
          created_at: string | null
          ended_at: string | null
          id: string
          is_active: boolean | null
          session_token: string
          started_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          session_token: string
          started_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          session_token?: string
          started_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incognito_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      insight_actions: {
        Row: {
          action_description: string
          action_type: string
          actual_impact_amount: number | null
          completed_at: string | null
          created_at: string | null
          id: string
          insight_id: string
          merchant_id: string
          outcome_notes: string | null
          outcome_status: string | null
          roi_percentage: number | null
        }
        Insert: {
          action_description: string
          action_type: string
          actual_impact_amount?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          insight_id: string
          merchant_id: string
          outcome_notes?: string | null
          outcome_status?: string | null
          roi_percentage?: number | null
        }
        Update: {
          action_description?: string
          action_type?: string
          actual_impact_amount?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          insight_id?: string
          merchant_id?: string
          outcome_notes?: string | null
          outcome_status?: string | null
          roi_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "insight_actions_insight_id_fkey"
            columns: ["insight_id"]
            isOneToOne: false
            referencedRelation: "smart_insights"
            referencedColumns: ["id"]
          },
        ]
      }
      insight_preferences: {
        Row: {
          created_at: string | null
          customer_inactive_threshold_days: number | null
          daily_digest: boolean | null
          enable_credit_insights: boolean | null
          enable_customer_insights: boolean | null
          enable_opportunity_insights: boolean | null
          enable_pricing_insights: boolean | null
          enable_stock_insights: boolean | null
          id: string
          immediate_critical_alerts: boolean | null
          merchant_id: string
          payment_delay_threshold_days: number | null
          price_variance_threshold_percentage: number | null
          stock_low_threshold_days: number | null
          updated_at: string | null
          weekly_summary: boolean | null
        }
        Insert: {
          created_at?: string | null
          customer_inactive_threshold_days?: number | null
          daily_digest?: boolean | null
          enable_credit_insights?: boolean | null
          enable_customer_insights?: boolean | null
          enable_opportunity_insights?: boolean | null
          enable_pricing_insights?: boolean | null
          enable_stock_insights?: boolean | null
          id?: string
          immediate_critical_alerts?: boolean | null
          merchant_id: string
          payment_delay_threshold_days?: number | null
          price_variance_threshold_percentage?: number | null
          stock_low_threshold_days?: number | null
          updated_at?: string | null
          weekly_summary?: boolean | null
        }
        Update: {
          created_at?: string | null
          customer_inactive_threshold_days?: number | null
          daily_digest?: boolean | null
          enable_credit_insights?: boolean | null
          enable_customer_insights?: boolean | null
          enable_opportunity_insights?: boolean | null
          enable_pricing_insights?: boolean | null
          enable_stock_insights?: boolean | null
          id?: string
          immediate_critical_alerts?: boolean | null
          merchant_id?: string
          payment_delay_threshold_days?: number | null
          price_variance_threshold_percentage?: number | null
          stock_low_threshold_days?: number | null
          updated_at?: string | null
          weekly_summary?: boolean | null
        }
        Relationships: []
      }
      interior_designers: {
        Row: {
          address: string | null
          average_rating: number | null
          bank_account_name: string | null
          bank_account_number: string | null
          bank_ifsc: string | null
          bank_name: string | null
          business_name: string | null
          city: string | null
          client_rating: number | null
          commission_percentage: number | null
          country: string | null
          created_at: string | null
          created_by: string | null
          credit_limit: number | null
          designer_type: string | null
          email: string | null
          gst_number: string | null
          gstin: string | null
          has_no_default_badge: boolean | null
          id: string
          is_accepting_projects: boolean | null
          is_active: boolean | null
          is_osas_verified: boolean | null
          is_premium_designer: boolean | null
          latitude: number | null
          longitude: number | null
          max_budget: number | null
          min_budget: number | null
          name: string
          outstanding_balance: number | null
          pan_number: string | null
          payment_discipline_score: number | null
          pending_commission: number | null
          phone: string | null
          portfolio_url: string | null
          postal_code: string | null
          project_completion_ratio: number | null
          review_count: number | null
          serviceable_cities: string[] | null
          serviceable_radius_km: number | null
          services_offered: string[] | null
          specialization: string | null
          state: string | null
          total_commission_earned: number | null
          total_projects: number | null
          total_revenue: number | null
          trust_score: number | null
          updated_at: string | null
          upi_id: string | null
          user_id: string | null
          vendor_feedback_score: number | null
          years_of_experience: number | null
        }
        Insert: {
          address?: string | null
          average_rating?: number | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          business_name?: string | null
          city?: string | null
          client_rating?: number | null
          commission_percentage?: number | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          designer_type?: string | null
          email?: string | null
          gst_number?: string | null
          gstin?: string | null
          has_no_default_badge?: boolean | null
          id?: string
          is_accepting_projects?: boolean | null
          is_active?: boolean | null
          is_osas_verified?: boolean | null
          is_premium_designer?: boolean | null
          latitude?: number | null
          longitude?: number | null
          max_budget?: number | null
          min_budget?: number | null
          name: string
          outstanding_balance?: number | null
          pan_number?: string | null
          payment_discipline_score?: number | null
          pending_commission?: number | null
          phone?: string | null
          portfolio_url?: string | null
          postal_code?: string | null
          project_completion_ratio?: number | null
          review_count?: number | null
          serviceable_cities?: string[] | null
          serviceable_radius_km?: number | null
          services_offered?: string[] | null
          specialization?: string | null
          state?: string | null
          total_commission_earned?: number | null
          total_projects?: number | null
          total_revenue?: number | null
          trust_score?: number | null
          updated_at?: string | null
          upi_id?: string | null
          user_id?: string | null
          vendor_feedback_score?: number | null
          years_of_experience?: number | null
        }
        Update: {
          address?: string | null
          average_rating?: number | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          business_name?: string | null
          city?: string | null
          client_rating?: number | null
          commission_percentage?: number | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          designer_type?: string | null
          email?: string | null
          gst_number?: string | null
          gstin?: string | null
          has_no_default_badge?: boolean | null
          id?: string
          is_accepting_projects?: boolean | null
          is_active?: boolean | null
          is_osas_verified?: boolean | null
          is_premium_designer?: boolean | null
          latitude?: number | null
          longitude?: number | null
          max_budget?: number | null
          min_budget?: number | null
          name?: string
          outstanding_balance?: number | null
          pan_number?: string | null
          payment_discipline_score?: number | null
          pending_commission?: number | null
          phone?: string | null
          portfolio_url?: string | null
          postal_code?: string | null
          project_completion_ratio?: number | null
          review_count?: number | null
          serviceable_cities?: string[] | null
          serviceable_radius_km?: number | null
          services_offered?: string[] | null
          specialization?: string | null
          state?: string | null
          total_commission_earned?: number | null
          total_projects?: number | null
          total_revenue?: number | null
          trust_score?: number | null
          updated_at?: string | null
          upi_id?: string | null
          user_id?: string | null
          vendor_feedback_score?: number | null
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "interior_designers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interior_service_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          auto_reorder_enabled: boolean | null
          created_at: string | null
          id: string
          last_movement_date: string | null
          last_movement_type: string | null
          last_restocked_at: string | null
          product_id: string | null
          quantity_in_stock: number | null
          reorder_level: number | null
          reorder_quantity: number | null
          reorder_threshold: number | null
          reserved_quantity: number | null
          updated_at: string | null
          warehouse_id: string | null
          warehouse_location: string | null
        }
        Insert: {
          auto_reorder_enabled?: boolean | null
          created_at?: string | null
          id?: string
          last_movement_date?: string | null
          last_movement_type?: string | null
          last_restocked_at?: string | null
          product_id?: string | null
          quantity_in_stock?: number | null
          reorder_level?: number | null
          reorder_quantity?: number | null
          reorder_threshold?: number | null
          reserved_quantity?: number | null
          updated_at?: string | null
          warehouse_id?: string | null
          warehouse_location?: string | null
        }
        Update: {
          auto_reorder_enabled?: boolean | null
          created_at?: string | null
          id?: string
          last_movement_date?: string | null
          last_movement_type?: string | null
          last_restocked_at?: string | null
          product_id?: string | null
          quantity_in_stock?: number | null
          reorder_level?: number | null
          reorder_quantity?: number | null
          reorder_threshold?: number | null
          reserved_quantity?: number | null
          updated_at?: string | null
          warehouse_id?: string | null
          warehouse_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_batches: {
        Row: {
          batch_number: string
          cost_price: number | null
          created_at: string | null
          expiry_date: string | null
          id: string
          manufactured_date: string | null
          notes: string | null
          product_id: string | null
          quantity: number
          received_date: string | null
          updated_at: string | null
          warehouse_id: string | null
        }
        Insert: {
          batch_number: string
          cost_price?: number | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          manufactured_date?: string | null
          notes?: string | null
          product_id?: string | null
          quantity?: number
          received_date?: string | null
          updated_at?: string | null
          warehouse_id?: string | null
        }
        Update: {
          batch_number?: string
          cost_price?: number | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          manufactured_date?: string | null
          notes?: string | null
          product_id?: string | null
          quantity?: number
          received_date?: string | null
          updated_at?: string | null
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_batches_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_batches_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          area_sqft: number | null
          base_rate: number
          box_quantity: number | null
          cess_amount: number | null
          cess_rate: number | null
          cgst_amount: number | null
          cgst_rate: number | null
          created_at: string | null
          gst_rate: number | null
          hsn_code: string | null
          id: string
          igst_amount: number | null
          igst_rate: number | null
          invoice_id: string
          item_description: string
          line_total: number
          mrp: number | null
          pieces_per_box: number | null
          product_id: string | null
          quantity: number
          sac_code: string | null
          scheme_discount_amount: number | null
          scheme_discount_percent: number | null
          sgst_amount: number | null
          sgst_rate: number | null
          sort_order: number | null
          taxable_value: number
          total_tax: number | null
          trade_discount_amount: number | null
          trade_discount_percent: number | null
          unit: string | null
          unit_price: number
          updated_at: string | null
          weight_kg: number | null
        }
        Insert: {
          area_sqft?: number | null
          base_rate: number
          box_quantity?: number | null
          cess_amount?: number | null
          cess_rate?: number | null
          cgst_amount?: number | null
          cgst_rate?: number | null
          created_at?: string | null
          gst_rate?: number | null
          hsn_code?: string | null
          id?: string
          igst_amount?: number | null
          igst_rate?: number | null
          invoice_id: string
          item_description: string
          line_total: number
          mrp?: number | null
          pieces_per_box?: number | null
          product_id?: string | null
          quantity?: number
          sac_code?: string | null
          scheme_discount_amount?: number | null
          scheme_discount_percent?: number | null
          sgst_amount?: number | null
          sgst_rate?: number | null
          sort_order?: number | null
          taxable_value: number
          total_tax?: number | null
          trade_discount_amount?: number | null
          trade_discount_percent?: number | null
          unit?: string | null
          unit_price: number
          updated_at?: string | null
          weight_kg?: number | null
        }
        Update: {
          area_sqft?: number | null
          base_rate?: number
          box_quantity?: number | null
          cess_amount?: number | null
          cess_rate?: number | null
          cgst_amount?: number | null
          cgst_rate?: number | null
          created_at?: string | null
          gst_rate?: number | null
          hsn_code?: string | null
          id?: string
          igst_amount?: number | null
          igst_rate?: number | null
          invoice_id?: string
          item_description?: string
          line_total?: number
          mrp?: number | null
          pieces_per_box?: number | null
          product_id?: string | null
          quantity?: number
          sac_code?: string | null
          scheme_discount_amount?: number | null
          scheme_discount_percent?: number | null
          sgst_amount?: number | null
          sgst_rate?: number | null
          sort_order?: number | null
          taxable_value?: number
          total_tax?: number | null
          trade_discount_amount?: number | null
          trade_discount_percent?: number | null
          unit?: string | null
          unit_price?: number
          updated_at?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_payments: {
        Row: {
          adjustment_reference: string | null
          adjustment_type: string | null
          amount: number
          bank_name: string | null
          cheque_date: string | null
          created_at: string | null
          created_by: string | null
          id: string
          invoice_id: string
          notes: string | null
          payment_date: string
          payment_id: string | null
          payment_mode: string
          reference_number: string | null
        }
        Insert: {
          adjustment_reference?: string | null
          adjustment_type?: string | null
          amount: number
          bank_name?: string | null
          cheque_date?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          invoice_id: string
          notes?: string | null
          payment_date?: string
          payment_id?: string | null
          payment_mode: string
          reference_number?: string | null
        }
        Update: {
          adjustment_reference?: string | null
          adjustment_type?: string | null
          amount?: number
          bank_name?: string | null
          cheque_date?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_date?: string
          payment_id?: string | null
          payment_mode?: string
          reference_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_payments_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_series: {
        Row: {
          created_at: string | null
          current_number: number | null
          financial_year: string
          id: string
          is_locked: boolean | null
          last_used_at: string | null
          locked_at: string | null
          locked_reason: string | null
          padding_length: number | null
          prefix: string | null
          series_type: string
          start_number: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_number?: number | null
          financial_year: string
          id?: string
          is_locked?: boolean | null
          last_used_at?: string | null
          locked_at?: string | null
          locked_reason?: string | null
          padding_length?: number | null
          prefix?: string | null
          series_type: string
          start_number?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_number?: number | null
          financial_year?: string
          id?: string
          is_locked?: boolean | null
          last_used_at?: string | null
          locked_at?: string | null
          locked_reason?: string | null
          padding_length?: number | null
          prefix?: string | null
          series_type?: string
          start_number?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_series_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_types: {
        Row: {
          can_convert_to: string[] | null
          code: string
          created_at: string | null
          default_due_days: number | null
          description: string | null
          id: string
          is_active: boolean | null
          is_gst_applicable: boolean | null
          name: string
          prefix: string | null
          requires_gst_number: boolean | null
          sequence_current: number | null
          sequence_format: string | null
          settings: Json | null
          show_tax_breakup: boolean | null
          template_name: string | null
          updated_at: string | null
        }
        Insert: {
          can_convert_to?: string[] | null
          code: string
          created_at?: string | null
          default_due_days?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_gst_applicable?: boolean | null
          name: string
          prefix?: string | null
          requires_gst_number?: boolean | null
          sequence_current?: number | null
          sequence_format?: string | null
          settings?: Json | null
          show_tax_breakup?: boolean | null
          template_name?: string | null
          updated_at?: string | null
        }
        Update: {
          can_convert_to?: string[] | null
          code?: string
          created_at?: string | null
          default_due_days?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_gst_applicable?: boolean | null
          name?: string
          prefix?: string | null
          requires_gst_number?: boolean | null
          sequence_current?: number | null
          sequence_format?: string | null
          settings?: Json | null
          show_tax_breakup?: boolean | null
          template_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount_due: number | null
          amount_paid: number | null
          cash_discount_amount: number | null
          cash_discount_percent: number | null
          cess_amount: number | null
          cess_rate: number | null
          cgst_amount: number | null
          cgst_rate: number | null
          created_at: string | null
          created_by: string | null
          customer_address: string | null
          customer_gstin: string | null
          customer_name: string | null
          customer_state: string | null
          customer_state_code: string | null
          delivery_date: string | null
          discount_amount: number | null
          due_date: string
          e_invoice_ack_date: string | null
          e_invoice_ack_no: string | null
          e_invoice_irn: string | null
          e_way_bill_date: string | null
          e_way_bill_no: string | null
          grand_total: number | null
          id: string
          igst_amount: number | null
          igst_rate: number | null
          invoice_number: string
          invoice_type: string | null
          issue_date: string
          last_payment_date: string | null
          linked_challan_id: string | null
          linked_proforma_id: string | null
          loading_charges: number | null
          lr_date: string | null
          lr_number: string | null
          notes: string | null
          order_id: string | null
          original_invoice_id: string | null
          other_charges: number | null
          other_charges_description: string | null
          packaging_charges: number | null
          payment_status: string | null
          payment_terms: string | null
          place_of_supply: string | null
          po_date: string | null
          po_number: string | null
          retailer_id: string | null
          reverse_charge: boolean | null
          rounding_amount: number | null
          scheme_discount_amount: number | null
          scheme_discount_percent: number | null
          seller_address: string | null
          seller_gstin: string | null
          seller_name: string | null
          seller_state: string | null
          seller_state_code: string | null
          sgst_amount: number | null
          sgst_rate: number | null
          shipping_address: string | null
          shipping_state: string | null
          shipping_state_code: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          subtotal: number
          supply_type: string | null
          tax_amount: number | null
          total_amount: number
          trade_discount_amount: number | null
          trade_discount_percent: number | null
          transport_charges: number | null
          transport_mode: string | null
          unloading_charges: number | null
          updated_at: string | null
          vehicle_number: string | null
          wholesaler_id: string | null
        }
        Insert: {
          amount_due?: number | null
          amount_paid?: number | null
          cash_discount_amount?: number | null
          cash_discount_percent?: number | null
          cess_amount?: number | null
          cess_rate?: number | null
          cgst_amount?: number | null
          cgst_rate?: number | null
          created_at?: string | null
          created_by?: string | null
          customer_address?: string | null
          customer_gstin?: string | null
          customer_name?: string | null
          customer_state?: string | null
          customer_state_code?: string | null
          delivery_date?: string | null
          discount_amount?: number | null
          due_date: string
          e_invoice_ack_date?: string | null
          e_invoice_ack_no?: string | null
          e_invoice_irn?: string | null
          e_way_bill_date?: string | null
          e_way_bill_no?: string | null
          grand_total?: number | null
          id?: string
          igst_amount?: number | null
          igst_rate?: number | null
          invoice_number: string
          invoice_type?: string | null
          issue_date: string
          last_payment_date?: string | null
          linked_challan_id?: string | null
          linked_proforma_id?: string | null
          loading_charges?: number | null
          lr_date?: string | null
          lr_number?: string | null
          notes?: string | null
          order_id?: string | null
          original_invoice_id?: string | null
          other_charges?: number | null
          other_charges_description?: string | null
          packaging_charges?: number | null
          payment_status?: string | null
          payment_terms?: string | null
          place_of_supply?: string | null
          po_date?: string | null
          po_number?: string | null
          retailer_id?: string | null
          reverse_charge?: boolean | null
          rounding_amount?: number | null
          scheme_discount_amount?: number | null
          scheme_discount_percent?: number | null
          seller_address?: string | null
          seller_gstin?: string | null
          seller_name?: string | null
          seller_state?: string | null
          seller_state_code?: string | null
          sgst_amount?: number | null
          sgst_rate?: number | null
          shipping_address?: string | null
          shipping_state?: string | null
          shipping_state_code?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal: number
          supply_type?: string | null
          tax_amount?: number | null
          total_amount: number
          trade_discount_amount?: number | null
          trade_discount_percent?: number | null
          transport_charges?: number | null
          transport_mode?: string | null
          unloading_charges?: number | null
          updated_at?: string | null
          vehicle_number?: string | null
          wholesaler_id?: string | null
        }
        Update: {
          amount_due?: number | null
          amount_paid?: number | null
          cash_discount_amount?: number | null
          cash_discount_percent?: number | null
          cess_amount?: number | null
          cess_rate?: number | null
          cgst_amount?: number | null
          cgst_rate?: number | null
          created_at?: string | null
          created_by?: string | null
          customer_address?: string | null
          customer_gstin?: string | null
          customer_name?: string | null
          customer_state?: string | null
          customer_state_code?: string | null
          delivery_date?: string | null
          discount_amount?: number | null
          due_date?: string
          e_invoice_ack_date?: string | null
          e_invoice_ack_no?: string | null
          e_invoice_irn?: string | null
          e_way_bill_date?: string | null
          e_way_bill_no?: string | null
          grand_total?: number | null
          id?: string
          igst_amount?: number | null
          igst_rate?: number | null
          invoice_number?: string
          invoice_type?: string | null
          issue_date?: string
          last_payment_date?: string | null
          linked_challan_id?: string | null
          linked_proforma_id?: string | null
          loading_charges?: number | null
          lr_date?: string | null
          lr_number?: string | null
          notes?: string | null
          order_id?: string | null
          original_invoice_id?: string | null
          other_charges?: number | null
          other_charges_description?: string | null
          packaging_charges?: number | null
          payment_status?: string | null
          payment_terms?: string | null
          place_of_supply?: string | null
          po_date?: string | null
          po_number?: string | null
          retailer_id?: string | null
          reverse_charge?: boolean | null
          rounding_amount?: number | null
          scheme_discount_amount?: number | null
          scheme_discount_percent?: number | null
          seller_address?: string | null
          seller_gstin?: string | null
          seller_name?: string | null
          seller_state?: string | null
          seller_state_code?: string | null
          sgst_amount?: number | null
          sgst_rate?: number | null
          shipping_address?: string | null
          shipping_state?: string | null
          shipping_state_code?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number
          supply_type?: string | null
          tax_amount?: number | null
          total_amount?: number
          trade_discount_amount?: number | null
          trade_discount_percent?: number | null
          transport_charges?: number | null
          transport_mode?: string | null
          unloading_charges?: number | null
          updated_at?: string | null
          vehicle_number?: string | null
          wholesaler_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_documents: {
        Row: {
          created_at: string | null
          document_name: string
          document_number: string | null
          document_type: string
          expiry_date: string | null
          file_size: number | null
          file_url: string
          id: string
          is_verified: boolean | null
          mime_type: string | null
          notes: string | null
          staff_id: string
          updated_at: string | null
          uploaded_by: string | null
          verification_date: string | null
          verification_notes: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_name: string
          document_number?: string | null
          document_type: string
          expiry_date?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          is_verified?: boolean | null
          mime_type?: string | null
          notes?: string | null
          staff_id: string
          updated_at?: string | null
          uploaded_by?: string | null
          verification_date?: string | null
          verification_notes?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_name?: string
          document_number?: string | null
          document_type?: string
          expiry_date?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          is_verified?: boolean | null
          mime_type?: string | null
          notes?: string | null
          staff_id?: string
          updated_at?: string | null
          uploaded_by?: string | null
          verification_date?: string | null
          verification_notes?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_analytics: {
        Row: {
          amount_spent: number | null
          avg_contact_time_hours: number | null
          avg_deal_value: number | null
          avg_quality_rating: number | null
          conversion_rate: number | null
          cost_per_conversion: number | null
          created_at: string | null
          credits_spent: number | null
          designer_id: string
          id: string
          leads_contacted: number | null
          leads_converted: number | null
          leads_marked_invalid: number | null
          leads_purchased: number | null
          period_end: string
          period_start: string
          period_type: string
          refunds_requested: number | null
          roi_percentage: number | null
          total_converted_value: number | null
          total_follow_ups: number | null
          updated_at: string | null
        }
        Insert: {
          amount_spent?: number | null
          avg_contact_time_hours?: number | null
          avg_deal_value?: number | null
          avg_quality_rating?: number | null
          conversion_rate?: number | null
          cost_per_conversion?: number | null
          created_at?: string | null
          credits_spent?: number | null
          designer_id: string
          id?: string
          leads_contacted?: number | null
          leads_converted?: number | null
          leads_marked_invalid?: number | null
          leads_purchased?: number | null
          period_end: string
          period_start: string
          period_type: string
          refunds_requested?: number | null
          roi_percentage?: number | null
          total_converted_value?: number | null
          total_follow_ups?: number | null
          updated_at?: string | null
        }
        Update: {
          amount_spent?: number | null
          avg_contact_time_hours?: number | null
          avg_deal_value?: number | null
          avg_quality_rating?: number | null
          conversion_rate?: number | null
          cost_per_conversion?: number | null
          created_at?: string | null
          credits_spent?: number | null
          designer_id?: string
          id?: string
          leads_contacted?: number | null
          leads_converted?: number | null
          leads_marked_invalid?: number | null
          leads_purchased?: number | null
          period_end?: string
          period_start?: string
          period_type?: string
          refunds_requested?: number | null
          roi_percentage?: number | null
          total_converted_value?: number | null
          total_follow_ups?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_analytics_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "lead_analytics_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_follow_ups: {
        Row: {
          attachments: Json | null
          call_recording_url: string | null
          created_at: string | null
          designer_id: string
          designer_lead_id: string
          duration_minutes: number | null
          follow_up_date: string | null
          follow_up_type: string
          id: string
          next_action: string | null
          next_follow_up_date: string | null
          outcome: string | null
          outcome_notes: string | null
          reminder_set: boolean | null
        }
        Insert: {
          attachments?: Json | null
          call_recording_url?: string | null
          created_at?: string | null
          designer_id: string
          designer_lead_id: string
          duration_minutes?: number | null
          follow_up_date?: string | null
          follow_up_type: string
          id?: string
          next_action?: string | null
          next_follow_up_date?: string | null
          outcome?: string | null
          outcome_notes?: string | null
          reminder_set?: boolean | null
        }
        Update: {
          attachments?: Json | null
          call_recording_url?: string | null
          created_at?: string | null
          designer_id?: string
          designer_lead_id?: string
          duration_minutes?: number | null
          follow_up_date?: string | null
          follow_up_type?: string
          id?: string
          next_action?: string | null
          next_follow_up_date?: string | null
          outcome?: string | null
          outcome_notes?: string | null
          reminder_set?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_follow_ups_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "lead_follow_ups_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_follow_ups_designer_lead_id_fkey"
            columns: ["designer_lead_id"]
            isOneToOne: false
            referencedRelation: "designer_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_packages: {
        Row: {
          budget_ranges: string[] | null
          cities: string[] | null
          created_at: string | null
          credits_included: number | null
          description: string | null
          display_order: number | null
          id: string
          includes_contact_info: boolean | null
          includes_project_details: boolean | null
          is_active: boolean | null
          is_verified_leads: boolean | null
          leads_per_month: number | null
          max_budget: number | null
          min_budget: number | null
          name: string
          package_type: string
          price: number
          priority_access: boolean | null
          project_types: string[] | null
          updated_at: string | null
          validity_days: number | null
        }
        Insert: {
          budget_ranges?: string[] | null
          cities?: string[] | null
          created_at?: string | null
          credits_included?: number | null
          description?: string | null
          display_order?: number | null
          id?: string
          includes_contact_info?: boolean | null
          includes_project_details?: boolean | null
          is_active?: boolean | null
          is_verified_leads?: boolean | null
          leads_per_month?: number | null
          max_budget?: number | null
          min_budget?: number | null
          name: string
          package_type: string
          price?: number
          priority_access?: boolean | null
          project_types?: string[] | null
          updated_at?: string | null
          validity_days?: number | null
        }
        Update: {
          budget_ranges?: string[] | null
          cities?: string[] | null
          created_at?: string | null
          credits_included?: number | null
          description?: string | null
          display_order?: number | null
          id?: string
          includes_contact_info?: boolean | null
          includes_project_details?: boolean | null
          is_active?: boolean | null
          is_verified_leads?: boolean | null
          leads_per_month?: number | null
          max_budget?: number | null
          min_budget?: number | null
          name?: string
          package_type?: string
          price?: number
          priority_access?: boolean | null
          project_types?: string[] | null
          updated_at?: string | null
          validity_days?: number | null
        }
        Relationships: []
      }
      lead_purchase_history: {
        Row: {
          amount_paid: number
          created_at: string | null
          credits_purchased: number | null
          designer_id: string
          id: string
          invoice_number: string | null
          notes: string | null
          package_id: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          purchase_type: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          amount_paid: number
          created_at?: string | null
          credits_purchased?: number | null
          designer_id: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          package_id?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          purchase_type: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          amount_paid?: number
          created_at?: string | null
          credits_purchased?: number | null
          designer_id?: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          package_id?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          purchase_type?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_purchase_history_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "lead_purchase_history_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_purchase_history_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "lead_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_balances: {
        Row: {
          casual_leave_balance: number | null
          casual_leave_total: number | null
          casual_leave_used: number | null
          compensatory_leave: number | null
          created_at: string | null
          earned_leave_balance: number | null
          earned_leave_total: number | null
          earned_leave_used: number | null
          id: string
          sick_leave_balance: number | null
          sick_leave_total: number | null
          sick_leave_used: number | null
          staff_id: string | null
          updated_at: string | null
          year: number
        }
        Insert: {
          casual_leave_balance?: number | null
          casual_leave_total?: number | null
          casual_leave_used?: number | null
          compensatory_leave?: number | null
          created_at?: string | null
          earned_leave_balance?: number | null
          earned_leave_total?: number | null
          earned_leave_used?: number | null
          id?: string
          sick_leave_balance?: number | null
          sick_leave_total?: number | null
          sick_leave_used?: number | null
          staff_id?: string | null
          updated_at?: string | null
          year: number
        }
        Update: {
          casual_leave_balance?: number | null
          casual_leave_total?: number | null
          casual_leave_used?: number | null
          compensatory_leave?: number | null
          created_at?: string | null
          earned_leave_balance?: number | null
          earned_leave_total?: number | null
          earned_leave_used?: number | null
          id?: string
          sick_leave_balance?: number | null
          sick_leave_total?: number | null
          sick_leave_used?: number | null
          staff_id?: string | null
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "leave_balances_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          end_date: string
          id: string
          is_emergency: boolean | null
          leave_type: string | null
          owner_notified_at: string | null
          reason: string | null
          rejection_reason: string | null
          request_number: string
          staff_id: string | null
          start_date: string
          status: string | null
          total_days: number
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          is_emergency?: boolean | null
          leave_type?: string | null
          owner_notified_at?: string | null
          reason?: string | null
          rejection_reason?: string | null
          request_number: string
          staff_id?: string | null
          start_date: string
          status?: string | null
          total_days: number
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          is_emergency?: boolean | null
          leave_type?: string | null
          owner_notified_at?: string | null
          reason?: string | null
          rejection_reason?: string | null
          request_number?: string
          staff_id?: string | null
          start_date?: string
          status?: string | null
          total_days?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      ledger_entries: {
        Row: {
          amount: number
          balance_after: number | null
          category: string | null
          created_at: string | null
          description: string | null
          entry_number: string
          entry_type: string | null
          id: string
          profile_id: string | null
          reference_id: string | null
          reference_type: string | null
        }
        Insert: {
          amount: number
          balance_after?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          entry_number: string
          entry_type?: string | null
          id?: string
          profile_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
        }
        Update: {
          amount?: number
          balance_after?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          entry_number?: string
          entry_type?: string | null
          id?: string
          profile_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      look_and_feel: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      loyalty_program_settings: {
        Row: {
          allow_redemption_with_offers: boolean | null
          birthday_bonus_points: number | null
          bulk_order_multiplier: number | null
          bulk_order_threshold: number | null
          created_at: string | null
          earn_rate: number
          festival_multiplier: number | null
          id: string
          is_enabled: boolean | null
          max_redemption_per_order: number | null
          min_order_value_for_points: number | null
          min_redemption_points: number | null
          points_expiry_enabled: boolean | null
          points_expiry_months: number | null
          program_name: string | null
          redemption_rate: number
          referral_bonus_points: number | null
          signup_bonus_points: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allow_redemption_with_offers?: boolean | null
          birthday_bonus_points?: number | null
          bulk_order_multiplier?: number | null
          bulk_order_threshold?: number | null
          created_at?: string | null
          earn_rate?: number
          festival_multiplier?: number | null
          id?: string
          is_enabled?: boolean | null
          max_redemption_per_order?: number | null
          min_order_value_for_points?: number | null
          min_redemption_points?: number | null
          points_expiry_enabled?: boolean | null
          points_expiry_months?: number | null
          program_name?: string | null
          redemption_rate?: number
          referral_bonus_points?: number | null
          signup_bonus_points?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allow_redemption_with_offers?: boolean | null
          birthday_bonus_points?: number | null
          bulk_order_multiplier?: number | null
          bulk_order_threshold?: number | null
          created_at?: string | null
          earn_rate?: number
          festival_multiplier?: number | null
          id?: string
          is_enabled?: boolean | null
          max_redemption_per_order?: number | null
          min_order_value_for_points?: number | null
          min_redemption_points?: number | null
          points_expiry_enabled?: boolean | null
          points_expiry_months?: number | null
          program_name?: string | null
          redemption_rate?: number
          referral_bonus_points?: number | null
          signup_bonus_points?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      loyalty_redemptions: {
        Row: {
          customer_id: string
          discount_value: number
          id: string
          order_id: string
          points_redeemed: number
          redeemed_at: string | null
          refunded_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          customer_id: string
          discount_value: number
          id?: string
          order_id: string
          points_redeemed: number
          redeemed_at?: string | null
          refunded_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          customer_id?: string
          discount_value?: number
          id?: string
          order_id?: string
          points_redeemed?: number
          redeemed_at?: string | null
          refunded_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_redemptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_redemptions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_transactions: {
        Row: {
          balance_after: number
          created_at: string | null
          created_by: string | null
          customer_id: string
          description: string
          expired: boolean | null
          expires_at: string | null
          id: string
          notes: string | null
          order_amount: number | null
          order_id: string | null
          points: number
          referral_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          balance_after: number
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          description: string
          expired?: boolean | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          order_amount?: number | null
          order_id?: string | null
          points: number
          referral_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          balance_after?: number
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          description?: string
          expired?: boolean | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          order_amount?: number | null
          order_id?: string | null
          points?: number
          referral_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_audit_logs: {
        Row: {
          action_description: string
          action_type: string
          changes: Json | null
          consent_verified: boolean | null
          created_at: string | null
          customer_data_accessed: boolean | null
          data_access_count: number | null
          entity_id: string
          entity_name: string | null
          entity_type: string
          id: string
          metadata: Json | null
          user_email: string | null
          user_id: string
          user_role: string | null
        }
        Insert: {
          action_description: string
          action_type: string
          changes?: Json | null
          consent_verified?: boolean | null
          created_at?: string | null
          customer_data_accessed?: boolean | null
          data_access_count?: number | null
          entity_id: string
          entity_name?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
          user_email?: string | null
          user_id: string
          user_role?: string | null
        }
        Update: {
          action_description?: string
          action_type?: string
          changes?: Json | null
          consent_verified?: boolean | null
          created_at?: string | null
          customer_data_accessed?: boolean | null
          data_access_count?: number | null
          entity_id?: string
          entity_name?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
          user_email?: string | null
          user_id?: string
          user_role?: string | null
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          campaign_name: string
          campaign_type: string
          channels: string[] | null
          conversion_revenue: number | null
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          is_active: boolean | null
          start_date: string
          status: string | null
          target_audience: Json | null
          target_roles: string[] | null
          total_clicked: number | null
          total_conversions: number | null
          total_delivered: number | null
          total_opened: number | null
          total_sent: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          campaign_name: string
          campaign_type: string
          channels?: string[] | null
          conversion_revenue?: number | null
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          start_date: string
          status?: string | null
          target_audience?: Json | null
          target_roles?: string[] | null
          total_clicked?: number | null
          total_conversions?: number | null
          total_delivered?: number | null
          total_opened?: number | null
          total_sent?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          campaign_name?: string
          campaign_type?: string
          channels?: string[] | null
          conversion_revenue?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          start_date?: string
          status?: string | null
          target_audience?: Json | null
          target_roles?: string[] | null
          total_clicked?: number | null
          total_conversions?: number | null
          total_delivered?: number | null
          total_opened?: number | null
          total_sent?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      non_osas_customers: {
        Row: {
          address: string | null
          bad_debt_amount: number | null
          bad_debt_marked_at: string | null
          bad_debt_marked_by: string | null
          created_at: string | null
          customer_type: string | null
          days_past_due_max: number | null
          email: string | null
          id: string
          is_active: boolean | null
          is_bad_debt: boolean | null
          last_payment_date: string | null
          last_purchase_date: string | null
          mobile_number: string | null
          name: string
          osas_conversion_status: string | null
          osas_invitation_count: number | null
          osas_invitation_date: string | null
          overdue_amount: number | null
          payment_behavior: string | null
          total_outstanding: number | null
          total_payments: number | null
          total_purchases: number | null
          updated_at: string | null
          wholesaler_id: string
        }
        Insert: {
          address?: string | null
          bad_debt_amount?: number | null
          bad_debt_marked_at?: string | null
          bad_debt_marked_by?: string | null
          created_at?: string | null
          customer_type?: string | null
          days_past_due_max?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_bad_debt?: boolean | null
          last_payment_date?: string | null
          last_purchase_date?: string | null
          mobile_number?: string | null
          name: string
          osas_conversion_status?: string | null
          osas_invitation_count?: number | null
          osas_invitation_date?: string | null
          overdue_amount?: number | null
          payment_behavior?: string | null
          total_outstanding?: number | null
          total_payments?: number | null
          total_purchases?: number | null
          updated_at?: string | null
          wholesaler_id: string
        }
        Update: {
          address?: string | null
          bad_debt_amount?: number | null
          bad_debt_marked_at?: string | null
          bad_debt_marked_by?: string | null
          created_at?: string | null
          customer_type?: string | null
          days_past_due_max?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_bad_debt?: boolean | null
          last_payment_date?: string | null
          last_purchase_date?: string | null
          mobile_number?: string | null
          name?: string
          osas_conversion_status?: string | null
          osas_invitation_count?: number | null
          osas_invitation_date?: string | null
          overdue_amount?: number | null
          payment_behavior?: string | null
          total_outstanding?: number | null
          total_payments?: number | null
          total_purchases?: number | null
          updated_at?: string | null
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "non_osas_customers_bad_debt_marked_by_fkey"
            columns: ["bad_debt_marked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "non_osas_customers_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      non_osas_invoices: {
        Row: {
          ageing_bucket: string | null
          created_at: string | null
          customer_id: string
          days_overdue: number | null
          due_date: string | null
          id: string
          invoice_date: string | null
          invoice_number: string | null
          notes: string | null
          outstanding_amount: number | null
          paid_amount: number | null
          status: string | null
          total_amount: number
          updated_at: string | null
          wholesaler_id: string
        }
        Insert: {
          ageing_bucket?: string | null
          created_at?: string | null
          customer_id: string
          days_overdue?: number | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          notes?: string | null
          outstanding_amount?: number | null
          paid_amount?: number | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          wholesaler_id: string
        }
        Update: {
          ageing_bucket?: string | null
          created_at?: string | null
          customer_id?: string
          days_overdue?: number | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          notes?: string | null
          outstanding_amount?: number | null
          paid_amount?: number | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "non_osas_invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "non_osas_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "non_osas_invoices_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      non_osas_payments: {
        Row: {
          amount: number
          bank_name: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string
          id: string
          invoice_id: string | null
          notes: string | null
          payment_date: string | null
          payment_mode: string
          payment_proof_url: string | null
          reference_number: string | null
          wholesaler_id: string
        }
        Insert: {
          amount: number
          bank_name?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_mode: string
          payment_proof_url?: string | null
          reference_number?: string | null
          wholesaler_id: string
        }
        Update: {
          amount?: number
          bank_name?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_mode?: string
          payment_proof_url?: string | null
          reference_number?: string | null
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "non_osas_payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "non_osas_payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "non_osas_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "non_osas_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "non_osas_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "non_osas_payments_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          channel: string | null
          clicked_at: string | null
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          id: string
          notification_id: string | null
          provider: string | null
          provider_message_id: string | null
          read_at: string | null
          recipient: string | null
          sent_at: string | null
          status: string | null
        }
        Insert: {
          channel?: string | null
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          notification_id?: string | null
          provider?: string | null
          provider_message_id?: string | null
          read_at?: string | null
          recipient?: string | null
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          channel?: string | null
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          notification_id?: string | null
          provider?: string | null
          provider_message_id?: string | null
          read_at?: string | null
          recipient?: string | null
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_enabled: boolean | null
          id: string
          in_app_enabled: boolean | null
          notification_type: string | null
          push_enabled: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          sms_enabled: boolean | null
          updated_at: string | null
          user_id: string | null
          whatsapp_enabled: boolean | null
        }
        Insert: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          in_app_enabled?: boolean | null
          notification_type?: string | null
          push_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sms_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp_enabled?: boolean | null
        }
        Update: {
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          in_app_enabled?: boolean | null
          notification_type?: string | null
          push_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sms_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          body_template: string
          channel: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          notification_type: string | null
          subject: string | null
          template_name: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          body_template: string
          channel?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          notification_type?: string | null
          subject?: string | null
          template_name: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          body_template?: string
          channel?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          notification_type?: string | null
          subject?: string | null
          template_name?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          metadata: Json | null
          notification_type: string | null
          priority: string | null
          read_at: string | null
          reference_id: string | null
          reference_type: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          notification_type?: string | null
          priority?: string | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          notification_type?: string | null
          priority?: string | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      offer_redemptions: {
        Row: {
          customer_id: string
          discount_applied: number
          final_amount: number
          id: string
          offer_id: string
          order_id: string
          original_amount: number
          redeemed_at: string | null
        }
        Insert: {
          customer_id: string
          discount_applied: number
          final_amount: number
          id?: string
          offer_id: string
          order_id: string
          original_amount: number
          redeemed_at?: string | null
        }
        Update: {
          customer_id?: string
          discount_applied?: number
          final_amount?: number
          id?: string
          offer_id?: string
          order_id?: string
          original_amount?: number
          redeemed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offer_redemptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offer_redemptions_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers_promotions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offer_redemptions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      offers_promotions: {
        Row: {
          applicable_brands: string[] | null
          applicable_categories: string[] | null
          applicable_products: string[] | null
          buy_quantity: number | null
          campaign_id: string | null
          created_at: string | null
          current_usage_count: number | null
          description: string | null
          discount_amount: number | null
          discount_percentage: number | null
          get_quantity: number | null
          id: string
          is_active: boolean | null
          max_discount_cap: number | null
          min_purchase_amount: number | null
          offer_code: string | null
          offer_name: string
          offer_type: string
          priority: number | null
          terms_conditions: string | null
          total_usage_limit: number | null
          updated_at: string | null
          usage_limit_per_customer: number | null
          user_id: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          applicable_brands?: string[] | null
          applicable_categories?: string[] | null
          applicable_products?: string[] | null
          buy_quantity?: number | null
          campaign_id?: string | null
          created_at?: string | null
          current_usage_count?: number | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          get_quantity?: number | null
          id?: string
          is_active?: boolean | null
          max_discount_cap?: number | null
          min_purchase_amount?: number | null
          offer_code?: string | null
          offer_name: string
          offer_type: string
          priority?: number | null
          terms_conditions?: string | null
          total_usage_limit?: number | null
          updated_at?: string | null
          usage_limit_per_customer?: number | null
          user_id: string
          valid_from: string
          valid_until: string
        }
        Update: {
          applicable_brands?: string[] | null
          applicable_categories?: string[] | null
          applicable_products?: string[] | null
          buy_quantity?: number | null
          campaign_id?: string | null
          created_at?: string | null
          current_usage_count?: number | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          get_quantity?: number | null
          id?: string
          is_active?: boolean | null
          max_discount_cap?: number | null
          min_purchase_amount?: number | null
          offer_code?: string | null
          offer_name?: string
          offer_type?: string
          priority?: number | null
          terms_conditions?: string | null
          total_usage_limit?: number | null
          updated_at?: string | null
          usage_limit_per_customer?: number | null
          user_id?: string
          valid_from?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_promotions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_promotions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_activity_logs: {
        Row: {
          action: string
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          order_id: string
          performed_by: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          order_id: string
          performed_by?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          order_id?: string
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_activity_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_activity_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          discount_amount: number | null
          id: string
          line_total: number
          order_id: string | null
          price: number | null
          product_id: string | null
          quantity: number
          tax_rate: number | null
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          discount_amount?: number | null
          id?: string
          line_total: number
          order_id?: string | null
          price?: number | null
          product_id?: string | null
          quantity: number
          tax_rate?: number | null
          unit_price: number
        }
        Update: {
          created_at?: string | null
          discount_amount?: number | null
          id?: string
          line_total?: number
          order_id?: string | null
          price?: number | null
          product_id?: string | null
          quantity?: number
          tax_rate?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_ratings: {
        Row: {
          created_at: string | null
          customer_id: string
          delivery_rating: number | null
          id: string
          is_public: boolean | null
          is_verified_purchase: boolean | null
          merchant_id: string
          merchant_responded_at: string | null
          merchant_response: string | null
          order_id: string
          product_quality_rating: number | null
          rating: number
          review_text: string | null
          review_title: string | null
          sentiment: string | null
          service_rating: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          delivery_rating?: number | null
          id?: string
          is_public?: boolean | null
          is_verified_purchase?: boolean | null
          merchant_id: string
          merchant_responded_at?: string | null
          merchant_response?: string | null
          order_id: string
          product_quality_rating?: number | null
          rating: number
          review_text?: string | null
          review_title?: string | null
          sentiment?: string | null
          service_rating?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          delivery_rating?: number | null
          id?: string
          is_public?: boolean | null
          is_verified_purchase?: boolean | null
          merchant_id?: string
          merchant_responded_at?: string | null
          merchant_response?: string | null
          order_id?: string
          product_quality_rating?: number | null
          rating?: number
          review_text?: string | null
          review_title?: string | null
          sentiment?: string | null
          service_rating?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_ratings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_ratings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_return_items: {
        Row: {
          created_at: string | null
          id: string
          line_total: number
          order_item_id: string
          product_id: string | null
          quantity_returned: number
          reason: string | null
          return_id: string
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          line_total: number
          order_item_id: string
          product_id?: string | null
          quantity_returned: number
          reason?: string | null
          return_id: string
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          line_total?: number
          order_item_id?: string
          product_id?: string | null
          quantity_returned?: number
          reason?: string | null
          return_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_return_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_return_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_return_items_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "order_returns"
            referencedColumns: ["id"]
          },
        ]
      }
      order_returns: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          challan_date: string | null
          challan_number: string | null
          completed_at: string | null
          created_at: string | null
          credit_note_id: string | null
          delivery_id: string | null
          e_invoice_date: string | null
          e_invoice_number: string | null
          id: string
          images: Json | null
          inspected_at: string | null
          inspected_by: string | null
          inspection_notes: string | null
          is_gst_return: boolean | null
          notes: string | null
          order_id: string | null
          pickup_assigned_to: string | null
          pickup_completed_at: string | null
          pickup_scheduled: boolean | null
          pickup_scheduled_at: string | null
          reason: string | null
          reason_category: string | null
          received_at: string | null
          refund_amount: number | null
          refund_method: string | null
          replacement_order_id: string | null
          requested_by: string | null
          resellable_status:
            | Database["public"]["Enums"]["return_condition_type"]
            | null
          retailer_id: string | null
          return_image: string | null
          return_number: string
          return_type: string | null
          returned_by: string | null
          status: string | null
          total_return_amount: number | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          challan_date?: string | null
          challan_number?: string | null
          completed_at?: string | null
          created_at?: string | null
          credit_note_id?: string | null
          delivery_id?: string | null
          e_invoice_date?: string | null
          e_invoice_number?: string | null
          id?: string
          images?: Json | null
          inspected_at?: string | null
          inspected_by?: string | null
          inspection_notes?: string | null
          is_gst_return?: boolean | null
          notes?: string | null
          order_id?: string | null
          pickup_assigned_to?: string | null
          pickup_completed_at?: string | null
          pickup_scheduled?: boolean | null
          pickup_scheduled_at?: string | null
          reason?: string | null
          reason_category?: string | null
          received_at?: string | null
          refund_amount?: number | null
          refund_method?: string | null
          replacement_order_id?: string | null
          requested_by?: string | null
          resellable_status?:
            | Database["public"]["Enums"]["return_condition_type"]
            | null
          retailer_id?: string | null
          return_image?: string | null
          return_number: string
          return_type?: string | null
          returned_by?: string | null
          status?: string | null
          total_return_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          challan_date?: string | null
          challan_number?: string | null
          completed_at?: string | null
          created_at?: string | null
          credit_note_id?: string | null
          delivery_id?: string | null
          e_invoice_date?: string | null
          e_invoice_number?: string | null
          id?: string
          images?: Json | null
          inspected_at?: string | null
          inspected_by?: string | null
          inspection_notes?: string | null
          is_gst_return?: boolean | null
          notes?: string | null
          order_id?: string | null
          pickup_assigned_to?: string | null
          pickup_completed_at?: string | null
          pickup_scheduled?: boolean | null
          pickup_scheduled_at?: string | null
          reason?: string | null
          reason_category?: string | null
          received_at?: string | null
          refund_amount?: number | null
          refund_method?: string | null
          replacement_order_id?: string | null
          requested_by?: string | null
          resellable_status?:
            | Database["public"]["Enums"]["return_condition_type"]
            | null
          retailer_id?: string | null
          return_image?: string | null
          return_number?: string
          return_type?: string | null
          returned_by?: string | null
          status?: string | null
          total_return_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_returns_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_returns_credit_note_id_fkey"
            columns: ["credit_note_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_returns_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_returns_inspected_by_fkey"
            columns: ["inspected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_returns_pickup_assigned_to_fkey"
            columns: ["pickup_assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_returns_replacement_order_id_fkey"
            columns: ["replacement_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_returns_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_returns_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      order_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_favorite: boolean | null
          items: Json
          last_used_at: string | null
          template_name: string
          total_amount: number
          updated_at: string | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          items: Json
          last_used_at?: string | null
          template_name: string
          total_amount?: number
          updated_at?: string | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          items?: Json
          last_used_at?: string | null
          template_name?: string
          total_amount?: number
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          customer_notes: string | null
          customer_type: string | null
          delivered_at: string | null
          delivery_confirmed_at: string | null
          delivery_confirmed_by_retailer: boolean | null
          delivery_driver_id: string | null
          delivery_pod_uploaded: boolean | null
          delivery_proof_image: string | null
          delivery_returned: boolean | null
          designer_id: string | null
          designer_order_flow: string | null
          discount_amount: number | null
          discount_applied: number | null
          gst_invoice: boolean | null
          id: string
          internal_notes: string | null
          is_private: boolean | null
          is_trial_mode: boolean | null
          metadata: Json | null
          notes: string | null
          offer_code_used: string | null
          offer_id: string | null
          order_category: Database["public"]["Enums"]["order_category"] | null
          order_number: string
          order_type: string | null
          osas_batch_id: string | null
          osas_credit_consumed: number | null
          osas_delivery_verified: boolean | null
          osas_delivery_verified_at: string | null
          osas_delivery_verified_by: string | null
          osas_pay_eligible: boolean | null
          osas_payment_approved_at: string | null
          osas_payment_eligible: boolean | null
          osas_payment_settled_at: string | null
          osas_payment_status: string | null
          osas_settlement_reference: string | null
          paid_amount: number | null
          payment_mode: string | null
          project_id: string | null
          retailer_id: string | null
          return_image: string | null
          return_reason: string | null
          returned_at: string | null
          split_payments: Json | null
          staff_member_id: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          trial_session_id: string | null
          updated_at: string | null
          user_id: string | null
          wholesaler_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          customer_notes?: string | null
          customer_type?: string | null
          delivered_at?: string | null
          delivery_confirmed_at?: string | null
          delivery_confirmed_by_retailer?: boolean | null
          delivery_driver_id?: string | null
          delivery_pod_uploaded?: boolean | null
          delivery_proof_image?: string | null
          delivery_returned?: boolean | null
          designer_id?: string | null
          designer_order_flow?: string | null
          discount_amount?: number | null
          discount_applied?: number | null
          gst_invoice?: boolean | null
          id?: string
          internal_notes?: string | null
          is_private?: boolean | null
          is_trial_mode?: boolean | null
          metadata?: Json | null
          notes?: string | null
          offer_code_used?: string | null
          offer_id?: string | null
          order_category?: Database["public"]["Enums"]["order_category"] | null
          order_number: string
          order_type?: string | null
          osas_batch_id?: string | null
          osas_credit_consumed?: number | null
          osas_delivery_verified?: boolean | null
          osas_delivery_verified_at?: string | null
          osas_delivery_verified_by?: string | null
          osas_pay_eligible?: boolean | null
          osas_payment_approved_at?: string | null
          osas_payment_eligible?: boolean | null
          osas_payment_settled_at?: string | null
          osas_payment_status?: string | null
          osas_settlement_reference?: string | null
          paid_amount?: number | null
          payment_mode?: string | null
          project_id?: string | null
          retailer_id?: string | null
          return_image?: string | null
          return_reason?: string | null
          returned_at?: string | null
          split_payments?: Json | null
          staff_member_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          trial_session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          wholesaler_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          customer_notes?: string | null
          customer_type?: string | null
          delivered_at?: string | null
          delivery_confirmed_at?: string | null
          delivery_confirmed_by_retailer?: boolean | null
          delivery_driver_id?: string | null
          delivery_pod_uploaded?: boolean | null
          delivery_proof_image?: string | null
          delivery_returned?: boolean | null
          designer_id?: string | null
          designer_order_flow?: string | null
          discount_amount?: number | null
          discount_applied?: number | null
          gst_invoice?: boolean | null
          id?: string
          internal_notes?: string | null
          is_private?: boolean | null
          is_trial_mode?: boolean | null
          metadata?: Json | null
          notes?: string | null
          offer_code_used?: string | null
          offer_id?: string | null
          order_category?: Database["public"]["Enums"]["order_category"] | null
          order_number?: string
          order_type?: string | null
          osas_batch_id?: string | null
          osas_credit_consumed?: number | null
          osas_delivery_verified?: boolean | null
          osas_delivery_verified_at?: string | null
          osas_delivery_verified_by?: string | null
          osas_pay_eligible?: boolean | null
          osas_payment_approved_at?: string | null
          osas_payment_eligible?: boolean | null
          osas_payment_settled_at?: string | null
          osas_payment_status?: string | null
          osas_settlement_reference?: string | null
          paid_amount?: number | null
          payment_mode?: string | null
          project_id?: string | null
          retailer_id?: string | null
          return_image?: string | null
          return_reason?: string | null
          returned_at?: string | null
          split_payments?: Json | null
          staff_member_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          trial_session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          wholesaler_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivery_driver_id_fkey"
            columns: ["delivery_driver_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers_promotions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_osas_batch_id_fkey"
            columns: ["osas_batch_id"]
            isOneToOne: false
            referencedRelation: "osas_settlement_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_osas_delivery_verified_by_fkey"
            columns: ["osas_delivery_verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_staff_member_id_fkey"
            columns: ["staff_member_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_trial_session_id_fkey"
            columns: ["trial_session_id"]
            isOneToOne: false
            referencedRelation: "incognito_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "wholesalers"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_admin_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          permissions: Json | null
          revoked_at: string | null
          role_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          permissions?: Json | null
          revoked_at?: string | null
          role_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          permissions?: Json | null
          revoked_at?: string | null
          role_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "osas_admin_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_admin_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_audit_log: {
        Row: {
          action_category: string
          action_type: string
          admin_id: string
          admin_role: string | null
          amount: number | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          new_value: Json | null
          old_value: Json | null
          order_id: string | null
          reason_code: string | null
          reason_description: string | null
          retailer_id: string | null
          user_agent: string | null
          wholesaler_id: string | null
        }
        Insert: {
          action_category: string
          action_type: string
          admin_id: string
          admin_role?: string | null
          amount?: number | null
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          order_id?: string | null
          reason_code?: string | null
          reason_description?: string | null
          retailer_id?: string | null
          user_agent?: string | null
          wholesaler_id?: string | null
        }
        Update: {
          action_category?: string
          action_type?: string
          admin_id?: string
          admin_role?: string | null
          amount?: number | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          order_id?: string | null
          reason_code?: string | null
          reason_description?: string | null
          retailer_id?: string | null
          user_agent?: string | null
          wholesaler_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "osas_audit_log_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_audit_log_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_audit_log_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_audit_log_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_conversion_tracking: {
        Row: {
          application_started_at: string | null
          contacted_at: string | null
          conversion_type: string
          converted_at: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          decision_at: string | null
          documents_submitted_at: string | null
          id: string
          initiated_at: string | null
          interested_at: string | null
          notes: string | null
          onboarding_incentive: number | null
          referral_bonus_amount: number | null
          referral_bonus_paid: boolean | null
          rejection_reason: string | null
          retailer_id: string | null
          status: string | null
          updated_at: string | null
          wholesaler_id: string
        }
        Insert: {
          application_started_at?: string | null
          contacted_at?: string | null
          conversion_type: string
          converted_at?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          decision_at?: string | null
          documents_submitted_at?: string | null
          id?: string
          initiated_at?: string | null
          interested_at?: string | null
          notes?: string | null
          onboarding_incentive?: number | null
          referral_bonus_amount?: number | null
          referral_bonus_paid?: boolean | null
          rejection_reason?: string | null
          retailer_id?: string | null
          status?: string | null
          updated_at?: string | null
          wholesaler_id: string
        }
        Update: {
          application_started_at?: string | null
          contacted_at?: string | null
          conversion_type?: string
          converted_at?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          decision_at?: string | null
          documents_submitted_at?: string | null
          id?: string
          initiated_at?: string | null
          interested_at?: string | null
          notes?: string | null
          onboarding_incentive?: number | null
          referral_bonus_amount?: number | null
          referral_bonus_paid?: boolean | null
          rejection_reason?: string | null
          retailer_id?: string | null
          status?: string | null
          updated_at?: string | null
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "osas_conversion_tracking_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_conversion_tracking_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "non_osas_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_conversion_tracking_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_conversion_tracking_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_credit_eligibility_queue: {
        Row: {
          admin_credit_override: number | null
          admin_notes: string | null
          ai_recommended_credit: number | null
          ai_risk_score: number | null
          approved_credit_limit: number | null
          avg_order_value: number | null
          created_at: string | null
          current_status: string
          dispute_count: number | null
          id: string
          interest_rate_percent: number | null
          monitoring_end_date: string | null
          monitoring_month: number | null
          monitoring_start_date: string | null
          payment_timeliness_percent: number | null
          penalty_rate_percent: number | null
          repayment_cycle_days: number | null
          retailer_id: string
          return_rate_percent: number | null
          reviewed_at: string | null
          reviewed_by: string | null
          temporary_boost_reason: string | null
          temporary_boost_until: string | null
          temporary_credit_boost: number | null
          total_orders: number | null
          updated_at: string | null
          wholesaler_id: string
        }
        Insert: {
          admin_credit_override?: number | null
          admin_notes?: string | null
          ai_recommended_credit?: number | null
          ai_risk_score?: number | null
          approved_credit_limit?: number | null
          avg_order_value?: number | null
          created_at?: string | null
          current_status: string
          dispute_count?: number | null
          id?: string
          interest_rate_percent?: number | null
          monitoring_end_date?: string | null
          monitoring_month?: number | null
          monitoring_start_date?: string | null
          payment_timeliness_percent?: number | null
          penalty_rate_percent?: number | null
          repayment_cycle_days?: number | null
          retailer_id: string
          return_rate_percent?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          temporary_boost_reason?: string | null
          temporary_boost_until?: string | null
          temporary_credit_boost?: number | null
          total_orders?: number | null
          updated_at?: string | null
          wholesaler_id: string
        }
        Update: {
          admin_credit_override?: number | null
          admin_notes?: string | null
          ai_recommended_credit?: number | null
          ai_risk_score?: number | null
          approved_credit_limit?: number | null
          avg_order_value?: number | null
          created_at?: string | null
          current_status?: string
          dispute_count?: number | null
          id?: string
          interest_rate_percent?: number | null
          monitoring_end_date?: string | null
          monitoring_month?: number | null
          monitoring_start_date?: string | null
          payment_timeliness_percent?: number | null
          penalty_rate_percent?: number | null
          repayment_cycle_days?: number | null
          retailer_id?: string
          return_rate_percent?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          temporary_boost_reason?: string | null
          temporary_boost_until?: string | null
          temporary_credit_boost?: number | null
          total_orders?: number | null
          updated_at?: string | null
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "osas_credit_eligibility_queue_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_credit_eligibility_queue_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_credit_eligibility_queue_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_delivery_verification_queue: {
        Row: {
          created_at: string | null
          delivery_date: string | null
          delivery_latitude: number | null
          delivery_location: string | null
          delivery_longitude: number | null
          delivery_status: string
          delivery_time: string | null
          driver_id: string | null
          driver_name: string | null
          driver_phone: string | null
          exception_notes: string | null
          exception_resolved: boolean | null
          exception_resolved_at: string | null
          exception_resolved_by: string | null
          exception_type: string | null
          id: string
          invoice_amount: number
          invoice_id: string | null
          is_exception: boolean | null
          order_id: string
          payment_eligible: boolean | null
          payment_triggered: boolean | null
          payment_triggered_at: string | null
          pod_uploaded: boolean | null
          pod_uploaded_at: string | null
          pod_uploaded_by: string | null
          pod_url: string | null
          rejection_reason: string | null
          retailer_id: string
          updated_at: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
          wholesaler_id: string
        }
        Insert: {
          created_at?: string | null
          delivery_date?: string | null
          delivery_latitude?: number | null
          delivery_location?: string | null
          delivery_longitude?: number | null
          delivery_status: string
          delivery_time?: string | null
          driver_id?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          exception_notes?: string | null
          exception_resolved?: boolean | null
          exception_resolved_at?: string | null
          exception_resolved_by?: string | null
          exception_type?: string | null
          id?: string
          invoice_amount: number
          invoice_id?: string | null
          is_exception?: boolean | null
          order_id: string
          payment_eligible?: boolean | null
          payment_triggered?: boolean | null
          payment_triggered_at?: string | null
          pod_uploaded?: boolean | null
          pod_uploaded_at?: string | null
          pod_uploaded_by?: string | null
          pod_url?: string | null
          rejection_reason?: string | null
          retailer_id: string
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          wholesaler_id: string
        }
        Update: {
          created_at?: string | null
          delivery_date?: string | null
          delivery_latitude?: number | null
          delivery_location?: string | null
          delivery_longitude?: number | null
          delivery_status?: string
          delivery_time?: string | null
          driver_id?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          exception_notes?: string | null
          exception_resolved?: boolean | null
          exception_resolved_at?: string | null
          exception_resolved_by?: string | null
          exception_type?: string | null
          id?: string
          invoice_amount?: number
          invoice_id?: string | null
          is_exception?: boolean | null
          order_id?: string
          payment_eligible?: boolean | null
          payment_triggered?: boolean | null
          payment_triggered_at?: string | null
          pod_uploaded?: boolean | null
          pod_uploaded_at?: string | null
          pod_uploaded_by?: string | null
          pod_url?: string | null
          rejection_reason?: string | null
          retailer_id?: string
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "osas_delivery_verification_queue_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_delivery_verification_queue_exception_resolved_by_fkey"
            columns: ["exception_resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_delivery_verification_queue_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_delivery_verification_queue_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_delivery_verification_queue_pod_uploaded_by_fkey"
            columns: ["pod_uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_delivery_verification_queue_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_delivery_verification_queue_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_delivery_verification_queue_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_designer_collection_visibility: {
        Row: {
          avg_collection_delay_days: number | null
          collection_health: string | null
          collection_rate: number | null
          designer_id: string
          high_value_pending: number | null
          id: string
          osas_repayment_correlation: string | null
          overdue_milestones: number | null
          rescheduled_count: number | null
          snapshot_date: string | null
          total_billed: number | null
          total_collected: number | null
          total_pending: number | null
          total_project_value: number | null
          total_projects: number | null
          updated_at: string | null
        }
        Insert: {
          avg_collection_delay_days?: number | null
          collection_health?: string | null
          collection_rate?: number | null
          designer_id: string
          high_value_pending?: number | null
          id?: string
          osas_repayment_correlation?: string | null
          overdue_milestones?: number | null
          rescheduled_count?: number | null
          snapshot_date?: string | null
          total_billed?: number | null
          total_collected?: number | null
          total_pending?: number | null
          total_project_value?: number | null
          total_projects?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_collection_delay_days?: number | null
          collection_health?: string | null
          collection_rate?: number | null
          designer_id?: string
          high_value_pending?: number | null
          id?: string
          osas_repayment_correlation?: string | null
          overdue_milestones?: number | null
          rescheduled_count?: number | null
          snapshot_date?: string | null
          total_billed?: number | null
          total_collected?: number | null
          total_pending?: number | null
          total_project_value?: number | null
          total_projects?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "osas_designer_collection_visibility_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_designer_ledger: {
        Row: {
          account_status: string | null
          active_emi_plans: number | null
          active_projects: number | null
          avg_client_payment_delay: number | null
          client_collection_rate: number | null
          credit_frozen: boolean | null
          designer_id: string
          designer_type: string | null
          emi_outstanding: number | null
          id: string
          penalties_collected: number | null
          recovery_rate: number | null
          risk_level: string | null
          risk_score: number | null
          total_credit_limit: number | null
          total_credit_used: number | null
          total_disbursed: number | null
          total_outstanding: number | null
          total_overdue: number | null
          total_penalties: number | null
          total_project_value: number | null
          total_projects: number | null
          total_recovered: number | null
          updated_at: string | null
        }
        Insert: {
          account_status?: string | null
          active_emi_plans?: number | null
          active_projects?: number | null
          avg_client_payment_delay?: number | null
          client_collection_rate?: number | null
          credit_frozen?: boolean | null
          designer_id: string
          designer_type?: string | null
          emi_outstanding?: number | null
          id?: string
          penalties_collected?: number | null
          recovery_rate?: number | null
          risk_level?: string | null
          risk_score?: number | null
          total_credit_limit?: number | null
          total_credit_used?: number | null
          total_disbursed?: number | null
          total_outstanding?: number | null
          total_overdue?: number | null
          total_penalties?: number | null
          total_project_value?: number | null
          total_projects?: number | null
          total_recovered?: number | null
          updated_at?: string | null
        }
        Update: {
          account_status?: string | null
          active_emi_plans?: number | null
          active_projects?: number | null
          avg_client_payment_delay?: number | null
          client_collection_rate?: number | null
          credit_frozen?: boolean | null
          designer_id?: string
          designer_type?: string | null
          emi_outstanding?: number | null
          id?: string
          penalties_collected?: number | null
          recovery_rate?: number | null
          risk_level?: string | null
          risk_score?: number | null
          total_credit_limit?: number | null
          total_credit_used?: number | null
          total_disbursed?: number | null
          total_outstanding?: number | null
          total_overdue?: number | null
          total_penalties?: number | null
          total_project_value?: number | null
          total_projects?: number | null
          total_recovered?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "osas_designer_ledger_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_designer_recovery_logs: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string
          designer_id: string
          id: string
          outcome: string | null
          performed_at: string | null
          performed_by: string
          promise_amount: number | null
          promise_date: string | null
          workload_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description: string
          designer_id: string
          id?: string
          outcome?: string | null
          performed_at?: string | null
          performed_by: string
          promise_amount?: number | null
          promise_date?: string | null
          workload_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string
          designer_id?: string
          id?: string
          outcome?: string | null
          performed_at?: string | null
          performed_by?: string
          promise_amount?: number | null
          promise_date?: string | null
          workload_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "osas_designer_recovery_logs_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_designer_recovery_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_designer_recovery_logs_workload_id_fkey"
            columns: ["workload_id"]
            isOneToOne: false
            referencedRelation: "osas_designer_recovery_workload"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_designer_recovery_workload: {
        Row: {
          assigned_agent_id: string | null
          assigned_at: string | null
          created_at: string | null
          designer_id: string
          escalated_to: string | null
          escalation_reason: string | null
          id: string
          is_escalated: boolean | null
          last_contact_date: string | null
          next_follow_up_date: string | null
          notes: string | null
          outstanding_amount: number
          overdue_bucket: string | null
          overdue_days: number | null
          priority: number | null
          promise_to_pay_date: string | null
          recovery_status: string | null
          risk_severity: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_agent_id?: string | null
          assigned_at?: string | null
          created_at?: string | null
          designer_id: string
          escalated_to?: string | null
          escalation_reason?: string | null
          id?: string
          is_escalated?: boolean | null
          last_contact_date?: string | null
          next_follow_up_date?: string | null
          notes?: string | null
          outstanding_amount: number
          overdue_bucket?: string | null
          overdue_days?: number | null
          priority?: number | null
          promise_to_pay_date?: string | null
          recovery_status?: string | null
          risk_severity?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_agent_id?: string | null
          assigned_at?: string | null
          created_at?: string | null
          designer_id?: string
          escalated_to?: string | null
          escalation_reason?: string | null
          id?: string
          is_escalated?: boolean | null
          last_contact_date?: string | null
          next_follow_up_date?: string | null
          notes?: string | null
          outstanding_amount?: number
          overdue_bucket?: string | null
          overdue_days?: number | null
          priority?: number | null
          promise_to_pay_date?: string | null
          recovery_status?: string | null
          risk_severity?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "osas_designer_recovery_workload_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_designer_recovery_workload_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_designer_recovery_workload_escalated_to_fkey"
            columns: ["escalated_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_emi_schedule: {
        Row: {
          created_at: string | null
          due_date: string
          emi_amount: number
          emi_number: number
          id: string
          interest_component: number | null
          paid_amount: number | null
          paid_at: string | null
          principal_component: number
          repayment_ledger_id: string
          retailer_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          due_date: string
          emi_amount: number
          emi_number: number
          id?: string
          interest_component?: number | null
          paid_amount?: number | null
          paid_at?: string | null
          principal_component: number
          repayment_ledger_id: string
          retailer_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          due_date?: string
          emi_amount?: number
          emi_number?: number
          id?: string
          interest_component?: number | null
          paid_amount?: number | null
          paid_at?: string | null
          principal_component?: number
          repayment_ledger_id?: string
          retailer_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "osas_emi_schedule_repayment_ledger_id_fkey"
            columns: ["repayment_ledger_id"]
            isOneToOne: false
            referencedRelation: "osas_retailer_repayment_ledger"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_emi_schedule_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_monitoring_decisions: {
        Row: {
          credit_limit_approved: number | null
          decided_at: string | null
          decided_by: string
          decision: string
          decision_type: string
          extension_months: number | null
          id: string
          new_status: string | null
          notes: string | null
          previous_status: string | null
          reason: string | null
          retailer_monitoring_id: string
          risk_level_assigned: string | null
        }
        Insert: {
          credit_limit_approved?: number | null
          decided_at?: string | null
          decided_by: string
          decision: string
          decision_type: string
          extension_months?: number | null
          id?: string
          new_status?: string | null
          notes?: string | null
          previous_status?: string | null
          reason?: string | null
          retailer_monitoring_id: string
          risk_level_assigned?: string | null
        }
        Update: {
          credit_limit_approved?: number | null
          decided_at?: string | null
          decided_by?: string
          decision?: string
          decision_type?: string
          extension_months?: number | null
          id?: string
          new_status?: string | null
          notes?: string | null
          previous_status?: string | null
          reason?: string | null
          retailer_monitoring_id?: string
          risk_level_assigned?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "osas_monitoring_decisions_decided_by_fkey"
            columns: ["decided_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_monitoring_decisions_retailer_monitoring_id_fkey"
            columns: ["retailer_monitoring_id"]
            isOneToOne: false
            referencedRelation: "retailer_monitoring_status"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_non_osas_visibility: {
        Row: {
          average_delay_days: number | null
          conversion_attempts: number | null
          conversion_score: number | null
          frequent_late_payments: boolean | null
          high_reminder_frequency: boolean | null
          id: string
          last_conversion_attempt_date: string | null
          multiple_wholesaler_credit: boolean | null
          non_osas_outstanding: number | null
          non_osas_overdue: number | null
          osas_conversion_eligible: boolean | null
          retailer_id: string
          snapshot_date: string | null
          updated_at: string | null
          wholesaler_reminder_count: number | null
        }
        Insert: {
          average_delay_days?: number | null
          conversion_attempts?: number | null
          conversion_score?: number | null
          frequent_late_payments?: boolean | null
          high_reminder_frequency?: boolean | null
          id?: string
          last_conversion_attempt_date?: string | null
          multiple_wholesaler_credit?: boolean | null
          non_osas_outstanding?: number | null
          non_osas_overdue?: number | null
          osas_conversion_eligible?: boolean | null
          retailer_id: string
          snapshot_date?: string | null
          updated_at?: string | null
          wholesaler_reminder_count?: number | null
        }
        Update: {
          average_delay_days?: number | null
          conversion_attempts?: number | null
          conversion_score?: number | null
          frequent_late_payments?: boolean | null
          high_reminder_frequency?: boolean | null
          id?: string
          last_conversion_attempt_date?: string | null
          multiple_wholesaler_credit?: boolean | null
          non_osas_outstanding?: number | null
          non_osas_overdue?: number | null
          osas_conversion_eligible?: boolean | null
          retailer_id?: string
          snapshot_date?: string | null
          updated_at?: string | null
          wholesaler_reminder_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "osas_non_osas_visibility_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_payment_reminder_logs: {
        Row: {
          created_at: string | null
          delivered_at: string | null
          failure_reason: string | null
          id: string
          message_content: string | null
          osas_invoice_id: string | null
          reminder_channel: string
          reminder_template: string | null
          reminder_type: string
          retailer_id: string
          sent_at: string | null
          status: string | null
          triggered_by: string | null
          triggered_by_user: string | null
        }
        Insert: {
          created_at?: string | null
          delivered_at?: string | null
          failure_reason?: string | null
          id?: string
          message_content?: string | null
          osas_invoice_id?: string | null
          reminder_channel: string
          reminder_template?: string | null
          reminder_type: string
          retailer_id: string
          sent_at?: string | null
          status?: string | null
          triggered_by?: string | null
          triggered_by_user?: string | null
        }
        Update: {
          created_at?: string | null
          delivered_at?: string | null
          failure_reason?: string | null
          id?: string
          message_content?: string | null
          osas_invoice_id?: string | null
          reminder_channel?: string
          reminder_template?: string | null
          reminder_type?: string
          retailer_id?: string
          sent_at?: string | null
          status?: string | null
          triggered_by?: string | null
          triggered_by_user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "osas_payment_reminder_logs_osas_invoice_id_fkey"
            columns: ["osas_invoice_id"]
            isOneToOne: false
            referencedRelation: "retailer_osas_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_payment_reminder_logs_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_payment_reminder_logs_triggered_by_user_fkey"
            columns: ["triggered_by_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_recovery_logs: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string
          id: string
          new_status: string | null
          outcome: string | null
          performed_at: string | null
          performed_by: string
          previous_status: string | null
          promise_amount: number | null
          promise_date: string | null
          retailer_id: string
          workload_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description: string
          id?: string
          new_status?: string | null
          outcome?: string | null
          performed_at?: string | null
          performed_by: string
          previous_status?: string | null
          promise_amount?: number | null
          promise_date?: string | null
          retailer_id: string
          workload_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string
          id?: string
          new_status?: string | null
          outcome?: string | null
          performed_at?: string | null
          performed_by?: string
          previous_status?: string | null
          promise_amount?: number | null
          promise_date?: string | null
          retailer_id?: string
          workload_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "osas_recovery_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_recovery_logs_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_recovery_logs_workload_id_fkey"
            columns: ["workload_id"]
            isOneToOne: false
            referencedRelation: "osas_recovery_workload"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_recovery_workload: {
        Row: {
          assigned_agent_id: string | null
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          escalated_at: string | null
          escalated_to: string | null
          escalation_reason: string | null
          follow_up_count: number | null
          id: string
          is_escalated: boolean | null
          last_contact_date: string | null
          last_contact_outcome: string | null
          next_follow_up_date: string | null
          notes: string | null
          outstanding_amount: number
          overdue_bucket: string | null
          overdue_days: number | null
          priority: number | null
          promise_to_pay_date: string | null
          recovery_status: string | null
          retailer_id: string
          risk_score: number | null
          risk_severity: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_agent_id?: string | null
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          escalated_at?: string | null
          escalated_to?: string | null
          escalation_reason?: string | null
          follow_up_count?: number | null
          id?: string
          is_escalated?: boolean | null
          last_contact_date?: string | null
          last_contact_outcome?: string | null
          next_follow_up_date?: string | null
          notes?: string | null
          outstanding_amount: number
          overdue_bucket?: string | null
          overdue_days?: number | null
          priority?: number | null
          promise_to_pay_date?: string | null
          recovery_status?: string | null
          retailer_id: string
          risk_score?: number | null
          risk_severity?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_agent_id?: string | null
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          escalated_at?: string | null
          escalated_to?: string | null
          escalation_reason?: string | null
          follow_up_count?: number | null
          id?: string
          is_escalated?: boolean | null
          last_contact_date?: string | null
          last_contact_outcome?: string | null
          next_follow_up_date?: string | null
          notes?: string | null
          outstanding_amount?: number
          overdue_bucket?: string | null
          overdue_days?: number | null
          priority?: number | null
          promise_to_pay_date?: string | null
          recovery_status?: string | null
          retailer_id?: string
          risk_score?: number | null
          risk_severity?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "osas_recovery_workload_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_recovery_workload_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_recovery_workload_escalated_to_fkey"
            columns: ["escalated_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_recovery_workload_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_repayment_transactions: {
        Row: {
          amount: number
          bank_reference: string | null
          created_at: string | null
          emi_number: number | null
          id: string
          notes: string | null
          payment_method: string | null
          processed_at: string | null
          repayment_ledger_id: string
          retailer_id: string
          status: string | null
          transaction_reference: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          bank_reference?: string | null
          created_at?: string | null
          emi_number?: number | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          processed_at?: string | null
          repayment_ledger_id: string
          retailer_id: string
          status?: string | null
          transaction_reference?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          bank_reference?: string | null
          created_at?: string | null
          emi_number?: number | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          processed_at?: string | null
          repayment_ledger_id?: string
          retailer_id?: string
          status?: string | null
          transaction_reference?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "osas_repayment_transactions_repayment_ledger_id_fkey"
            columns: ["repayment_ledger_id"]
            isOneToOne: false
            referencedRelation: "osas_retailer_repayment_ledger"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_repayment_transactions_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_retailer_eligibility_history: {
        Row: {
          average_payment_days: number | null
          changed_by: string | null
          created_at: string | null
          credit_limit_approved: number | null
          id: string
          monitoring_days_completed: number | null
          new_status: string
          notes: string | null
          previous_status: string | null
          retailer_id: string
          risk_indicator: string | null
          wholesaler_id: string
        }
        Insert: {
          average_payment_days?: number | null
          changed_by?: string | null
          created_at?: string | null
          credit_limit_approved?: number | null
          id?: string
          monitoring_days_completed?: number | null
          new_status: string
          notes?: string | null
          previous_status?: string | null
          retailer_id: string
          risk_indicator?: string | null
          wholesaler_id: string
        }
        Update: {
          average_payment_days?: number | null
          changed_by?: string | null
          created_at?: string | null
          credit_limit_approved?: number | null
          id?: string
          monitoring_days_completed?: number | null
          new_status?: string
          notes?: string | null
          previous_status?: string | null
          retailer_id?: string
          risk_indicator?: string | null
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "osas_retailer_eligibility_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_retailer_eligibility_history_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_retailer_eligibility_history_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_retailer_ledger: {
        Row: {
          account_status: string | null
          active_emi_plans: number | null
          credit_frozen: boolean | null
          days_since_last_payment: number | null
          default_probability: number | null
          freeze_date: string | null
          id: string
          last_payment_date: string | null
          last_reminder_date: string | null
          recovery_rate: number | null
          retailer_id: string
          risk_level: string | null
          risk_score: number | null
          total_credit_limit: number | null
          total_credit_used: number | null
          total_disbursed: number | null
          total_emi_outstanding: number | null
          total_outstanding: number | null
          total_overdue: number | null
          total_penalties_applied: number | null
          total_penalties_collected: number | null
          total_penalties_waived: number | null
          total_recovered: number | null
          updated_at: string | null
        }
        Insert: {
          account_status?: string | null
          active_emi_plans?: number | null
          credit_frozen?: boolean | null
          days_since_last_payment?: number | null
          default_probability?: number | null
          freeze_date?: string | null
          id?: string
          last_payment_date?: string | null
          last_reminder_date?: string | null
          recovery_rate?: number | null
          retailer_id: string
          risk_level?: string | null
          risk_score?: number | null
          total_credit_limit?: number | null
          total_credit_used?: number | null
          total_disbursed?: number | null
          total_emi_outstanding?: number | null
          total_outstanding?: number | null
          total_overdue?: number | null
          total_penalties_applied?: number | null
          total_penalties_collected?: number | null
          total_penalties_waived?: number | null
          total_recovered?: number | null
          updated_at?: string | null
        }
        Update: {
          account_status?: string | null
          active_emi_plans?: number | null
          credit_frozen?: boolean | null
          days_since_last_payment?: number | null
          default_probability?: number | null
          freeze_date?: string | null
          id?: string
          last_payment_date?: string | null
          last_reminder_date?: string | null
          recovery_rate?: number | null
          retailer_id?: string
          risk_level?: string | null
          risk_score?: number | null
          total_credit_limit?: number | null
          total_credit_used?: number | null
          total_disbursed?: number | null
          total_emi_outstanding?: number | null
          total_outstanding?: number | null
          total_overdue?: number | null
          total_penalties_applied?: number | null
          total_penalties_collected?: number | null
          total_penalties_waived?: number | null
          total_recovered?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "osas_retailer_ledger_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: true
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_retailer_repayment_ledger: {
        Row: {
          created_at: string | null
          days_overdue: number | null
          due_date: string
          emi_amount: number | null
          emi_converted: boolean | null
          emi_remaining: number | null
          emi_tenure: number | null
          extended_due_date: string | null
          id: string
          last_payment_date: string | null
          last_reminder_sent: string | null
          max_skips_allowed: number | null
          notes: string | null
          order_id: string
          original_amount: number
          original_due_date: string
          outstanding_amount: number
          paid_amount: number | null
          payment_mode: string | null
          penalty_amount: number | null
          penalty_applied: boolean | null
          reminder_count: number | null
          repayment_status: string | null
          retailer_id: string
          skip_count: number | null
          updated_at: string | null
          wholesaler_id: string
        }
        Insert: {
          created_at?: string | null
          days_overdue?: number | null
          due_date: string
          emi_amount?: number | null
          emi_converted?: boolean | null
          emi_remaining?: number | null
          emi_tenure?: number | null
          extended_due_date?: string | null
          id?: string
          last_payment_date?: string | null
          last_reminder_sent?: string | null
          max_skips_allowed?: number | null
          notes?: string | null
          order_id: string
          original_amount: number
          original_due_date: string
          outstanding_amount: number
          paid_amount?: number | null
          payment_mode?: string | null
          penalty_amount?: number | null
          penalty_applied?: boolean | null
          reminder_count?: number | null
          repayment_status?: string | null
          retailer_id: string
          skip_count?: number | null
          updated_at?: string | null
          wholesaler_id: string
        }
        Update: {
          created_at?: string | null
          days_overdue?: number | null
          due_date?: string
          emi_amount?: number | null
          emi_converted?: boolean | null
          emi_remaining?: number | null
          emi_tenure?: number | null
          extended_due_date?: string | null
          id?: string
          last_payment_date?: string | null
          last_reminder_sent?: string | null
          max_skips_allowed?: number | null
          notes?: string | null
          order_id?: string
          original_amount?: number
          original_due_date?: string
          outstanding_amount?: number
          paid_amount?: number | null
          payment_mode?: string | null
          penalty_amount?: number | null
          penalty_applied?: boolean | null
          reminder_count?: number | null
          repayment_status?: string | null
          retailer_id?: string
          skip_count?: number | null
          updated_at?: string | null
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "osas_retailer_repayment_ledger_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_retailer_repayment_ledger_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_retailer_repayment_ledger_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_retailer_risk_profile: {
        Row: {
          avg_order_value: number | null
          avg_payment_days: number | null
          created_at: string | null
          credit_utilization_score: number | null
          default_count: number | null
          delay_pattern: Json | null
          dispute_count: number | null
          dispute_score: number | null
          id: string
          last_calculated_at: string | null
          late_payments: number | null
          manual_override: boolean | null
          on_time_payments: number | null
          order_consistency_score: number | null
          override_at: string | null
          override_by: string | null
          override_reason: string | null
          payment_timeliness_score: number | null
          peak_credit_usage: number | null
          retailer_id: string
          return_count: number | null
          return_rate_percent: number | null
          return_rate_score: number | null
          risk_level: string | null
          risk_score: number | null
          total_credit_used: number | null
          total_orders: number | null
          updated_at: string | null
        }
        Insert: {
          avg_order_value?: number | null
          avg_payment_days?: number | null
          created_at?: string | null
          credit_utilization_score?: number | null
          default_count?: number | null
          delay_pattern?: Json | null
          dispute_count?: number | null
          dispute_score?: number | null
          id?: string
          last_calculated_at?: string | null
          late_payments?: number | null
          manual_override?: boolean | null
          on_time_payments?: number | null
          order_consistency_score?: number | null
          override_at?: string | null
          override_by?: string | null
          override_reason?: string | null
          payment_timeliness_score?: number | null
          peak_credit_usage?: number | null
          retailer_id: string
          return_count?: number | null
          return_rate_percent?: number | null
          return_rate_score?: number | null
          risk_level?: string | null
          risk_score?: number | null
          total_credit_used?: number | null
          total_orders?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_order_value?: number | null
          avg_payment_days?: number | null
          created_at?: string | null
          credit_utilization_score?: number | null
          default_count?: number | null
          delay_pattern?: Json | null
          dispute_count?: number | null
          dispute_score?: number | null
          id?: string
          last_calculated_at?: string | null
          late_payments?: number | null
          manual_override?: boolean | null
          on_time_payments?: number | null
          order_consistency_score?: number | null
          override_at?: string | null
          override_by?: string | null
          override_reason?: string | null
          payment_timeliness_score?: number | null
          peak_credit_usage?: number | null
          retailer_id?: string
          return_count?: number | null
          return_rate_percent?: number | null
          return_rate_score?: number | null
          risk_level?: string | null
          risk_score?: number | null
          total_credit_used?: number | null
          total_orders?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "osas_retailer_risk_profile_override_by_fkey"
            columns: ["override_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_retailer_risk_profile_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: true
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_risk_alerts: {
        Row: {
          action_taken: string | null
          action_taken_at: string | null
          action_taken_by: string | null
          alert_type: string
          auto_generated: boolean | null
          created_at: string | null
          current_value: number | null
          description: string
          escalated: boolean | null
          escalated_at: string | null
          escalated_to: string | null
          id: string
          is_resolved: boolean | null
          metrics: Json | null
          requires_action: boolean | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          retailer_id: string | null
          risk_level: string
          severity: string
          threshold_value: number | null
          title: string
          updated_at: string | null
          wholesaler_id: string | null
        }
        Insert: {
          action_taken?: string | null
          action_taken_at?: string | null
          action_taken_by?: string | null
          alert_type: string
          auto_generated?: boolean | null
          created_at?: string | null
          current_value?: number | null
          description: string
          escalated?: boolean | null
          escalated_at?: string | null
          escalated_to?: string | null
          id?: string
          is_resolved?: boolean | null
          metrics?: Json | null
          requires_action?: boolean | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          retailer_id?: string | null
          risk_level: string
          severity: string
          threshold_value?: number | null
          title: string
          updated_at?: string | null
          wholesaler_id?: string | null
        }
        Update: {
          action_taken?: string | null
          action_taken_at?: string | null
          action_taken_by?: string | null
          alert_type?: string
          auto_generated?: boolean | null
          created_at?: string | null
          current_value?: number | null
          description?: string
          escalated?: boolean | null
          escalated_at?: string | null
          escalated_to?: string | null
          id?: string
          is_resolved?: boolean | null
          metrics?: Json | null
          requires_action?: boolean | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          retailer_id?: string | null
          risk_level?: string
          severity?: string
          threshold_value?: number | null
          title?: string
          updated_at?: string | null
          wholesaler_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "osas_risk_alerts_action_taken_by_fkey"
            columns: ["action_taken_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_risk_alerts_escalated_to_fkey"
            columns: ["escalated_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_risk_alerts_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_risk_alerts_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_risk_alerts_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_settlement_batches: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          bank_partner: string | null
          bank_reference: string | null
          bank_response: Json | null
          batch_date: string
          batch_number: string
          completed_at: string | null
          created_at: string | null
          failed_count: number | null
          generated_at: string | null
          generated_by: string | null
          id: string
          last_retry_at: string | null
          nbfc_partner: string | null
          net_settlement: number | null
          notes: string | null
          retry_count: number | null
          sent_to_bank_at: string | null
          status: string
          total_amount: number
          total_orders: number
          total_osas_fee: number | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          bank_partner?: string | null
          bank_reference?: string | null
          bank_response?: Json | null
          batch_date: string
          batch_number: string
          completed_at?: string | null
          created_at?: string | null
          failed_count?: number | null
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          last_retry_at?: string | null
          nbfc_partner?: string | null
          net_settlement?: number | null
          notes?: string | null
          retry_count?: number | null
          sent_to_bank_at?: string | null
          status?: string
          total_amount?: number
          total_orders?: number
          total_osas_fee?: number | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          bank_partner?: string | null
          bank_reference?: string | null
          bank_response?: Json | null
          batch_date?: string
          batch_number?: string
          completed_at?: string | null
          created_at?: string | null
          failed_count?: number | null
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          last_retry_at?: string | null
          nbfc_partner?: string | null
          net_settlement?: number | null
          notes?: string | null
          retry_count?: number | null
          sent_to_bank_at?: string | null
          status?: string
          total_amount?: number
          total_orders?: number
          total_osas_fee?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "osas_settlement_batches_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_settlement_batches_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_settlement_ledger: {
        Row: {
          bank_account_last4: string | null
          bank_reference_number: string | null
          batch_id: string | null
          created_at: string | null
          credited_at: string | null
          expected_credit_time: string | null
          id: string
          invoice_amount: number
          invoice_id: string | null
          net_settlement: number
          order_id: string
          osas_fee: number | null
          payment_mode: string | null
          retailer_id: string
          settlement_amount: number
          settlement_date: string | null
          settlement_status: string | null
          updated_at: string | null
          wholesaler_id: string
        }
        Insert: {
          bank_account_last4?: string | null
          bank_reference_number?: string | null
          batch_id?: string | null
          created_at?: string | null
          credited_at?: string | null
          expected_credit_time?: string | null
          id?: string
          invoice_amount: number
          invoice_id?: string | null
          net_settlement: number
          order_id: string
          osas_fee?: number | null
          payment_mode?: string | null
          retailer_id: string
          settlement_amount: number
          settlement_date?: string | null
          settlement_status?: string | null
          updated_at?: string | null
          wholesaler_id: string
        }
        Update: {
          bank_account_last4?: string | null
          bank_reference_number?: string | null
          batch_id?: string | null
          created_at?: string | null
          credited_at?: string | null
          expected_credit_time?: string | null
          id?: string
          invoice_amount?: number
          invoice_id?: string | null
          net_settlement?: number
          order_id?: string
          osas_fee?: number | null
          payment_mode?: string | null
          retailer_id?: string
          settlement_amount?: number
          settlement_date?: string | null
          settlement_status?: string | null
          updated_at?: string | null
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "osas_settlement_ledger_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "osas_settlement_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_settlement_ledger_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_settlement_ledger_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_settlement_ledger_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_settlement_ledger_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_skip_payment_history: {
        Row: {
          approved_automatically: boolean | null
          created_at: string | null
          extension_days: number
          id: string
          new_due_date: string
          original_due_date: string
          reason: string | null
          repayment_ledger_id: string
          retailer_id: string
          skip_number: number
        }
        Insert: {
          approved_automatically?: boolean | null
          created_at?: string | null
          extension_days: number
          id?: string
          new_due_date: string
          original_due_date: string
          reason?: string | null
          repayment_ledger_id: string
          retailer_id: string
          skip_number: number
        }
        Update: {
          approved_automatically?: boolean | null
          created_at?: string | null
          extension_days?: number
          id?: string
          new_due_date?: string
          original_due_date?: string
          reason?: string | null
          repayment_ledger_id?: string
          retailer_id?: string
          skip_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "osas_skip_payment_history_repayment_ledger_id_fkey"
            columns: ["repayment_ledger_id"]
            isOneToOne: false
            referencedRelation: "osas_retailer_repayment_ledger"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_skip_payment_history_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_support_tickets: {
        Row: {
          adjustment_amount: number | null
          assigned_at: string | null
          assigned_to: string | null
          attachments: Json | null
          created_at: string | null
          description: string
          disputed_amount: number | null
          escalated_at: string | null
          escalated_to: string | null
          escalation_reason: string | null
          expected_amount: number | null
          first_response_at: string | null
          id: string
          ledger_adjustment_made: boolean | null
          order_id: string | null
          priority: string | null
          raised_by: string
          raised_for_role: string | null
          repayment_id: string | null
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          retailer_id: string | null
          settlement_id: string | null
          sla_breach: boolean | null
          status: string | null
          subject: string
          ticket_number: string
          ticket_type: string
          updated_at: string | null
          wholesaler_id: string | null
        }
        Insert: {
          adjustment_amount?: number | null
          assigned_at?: string | null
          assigned_to?: string | null
          attachments?: Json | null
          created_at?: string | null
          description: string
          disputed_amount?: number | null
          escalated_at?: string | null
          escalated_to?: string | null
          escalation_reason?: string | null
          expected_amount?: number | null
          first_response_at?: string | null
          id?: string
          ledger_adjustment_made?: boolean | null
          order_id?: string | null
          priority?: string | null
          raised_by: string
          raised_for_role?: string | null
          repayment_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          retailer_id?: string | null
          settlement_id?: string | null
          sla_breach?: boolean | null
          status?: string | null
          subject: string
          ticket_number: string
          ticket_type: string
          updated_at?: string | null
          wholesaler_id?: string | null
        }
        Update: {
          adjustment_amount?: number | null
          assigned_at?: string | null
          assigned_to?: string | null
          attachments?: Json | null
          created_at?: string | null
          description?: string
          disputed_amount?: number | null
          escalated_at?: string | null
          escalated_to?: string | null
          escalation_reason?: string | null
          expected_amount?: number | null
          first_response_at?: string | null
          id?: string
          ledger_adjustment_made?: boolean | null
          order_id?: string | null
          priority?: string | null
          raised_by?: string
          raised_for_role?: string | null
          repayment_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          retailer_id?: string | null
          settlement_id?: string | null
          sla_breach?: boolean | null
          status?: string | null
          subject?: string
          ticket_number?: string
          ticket_type?: string
          updated_at?: string | null
          wholesaler_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "osas_support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_support_tickets_escalated_to_fkey"
            columns: ["escalated_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_support_tickets_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_support_tickets_raised_by_fkey"
            columns: ["raised_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_support_tickets_repayment_id_fkey"
            columns: ["repayment_id"]
            isOneToOne: false
            referencedRelation: "osas_retailer_repayment_ledger"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_support_tickets_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_support_tickets_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_support_tickets_settlement_id_fkey"
            columns: ["settlement_id"]
            isOneToOne: false
            referencedRelation: "osas_settlement_ledger"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_support_tickets_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_system_config: {
        Row: {
          category: string
          config_key: string
          config_type: string
          config_value: Json
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category: string
          config_key: string
          config_type: string
          config_value: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string
          config_key?: string
          config_type?: string
          config_value?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "osas_system_config_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_ticket_comments: {
        Row: {
          attachments: Json | null
          comment: string
          created_at: string | null
          id: string
          is_internal: boolean | null
          ticket_id: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          comment: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          ticket_id: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          comment?: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "osas_ticket_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "osas_support_tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_ticket_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      osas_wholesaler_controls: {
        Row: {
          allowed_payment_modes: Json | null
          auto_approve_pod: boolean | null
          avg_settlement_time_hours: number | null
          bank_account_id: string | null
          created_at: string | null
          custom_cutoff_time: string | null
          custom_osas_fee_percent: number | null
          dispute_rate_percent: number | null
          id: string
          is_verified: boolean | null
          max_daily_limit: number | null
          max_per_retailer_limit: number | null
          pause_reason: string | null
          pause_until: string | null
          paused: boolean | null
          paused_at: string | null
          paused_by: string | null
          require_manual_verification: boolean | null
          same_day_enabled: boolean | null
          settlement_day: string | null
          settlement_frequency: string | null
          total_disputes: number | null
          total_settlements: number | null
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
          wholesaler_id: string
        }
        Insert: {
          allowed_payment_modes?: Json | null
          auto_approve_pod?: boolean | null
          avg_settlement_time_hours?: number | null
          bank_account_id?: string | null
          created_at?: string | null
          custom_cutoff_time?: string | null
          custom_osas_fee_percent?: number | null
          dispute_rate_percent?: number | null
          id?: string
          is_verified?: boolean | null
          max_daily_limit?: number | null
          max_per_retailer_limit?: number | null
          pause_reason?: string | null
          pause_until?: string | null
          paused?: boolean | null
          paused_at?: string | null
          paused_by?: string | null
          require_manual_verification?: boolean | null
          same_day_enabled?: boolean | null
          settlement_day?: string | null
          settlement_frequency?: string | null
          total_disputes?: number | null
          total_settlements?: number | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
          wholesaler_id: string
        }
        Update: {
          allowed_payment_modes?: Json | null
          auto_approve_pod?: boolean | null
          avg_settlement_time_hours?: number | null
          bank_account_id?: string | null
          created_at?: string | null
          custom_cutoff_time?: string | null
          custom_osas_fee_percent?: number | null
          dispute_rate_percent?: number | null
          id?: string
          is_verified?: boolean | null
          max_daily_limit?: number | null
          max_per_retailer_limit?: number | null
          pause_reason?: string | null
          pause_until?: string | null
          paused?: boolean | null
          paused_at?: string | null
          paused_by?: string | null
          require_manual_verification?: boolean | null
          same_day_enabled?: boolean | null
          settlement_day?: string | null
          settlement_frequency?: string | null
          total_disputes?: number | null
          total_settlements?: number | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "osas_wholesaler_controls_paused_by_fkey"
            columns: ["paused_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_wholesaler_controls_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "osas_wholesaler_controls_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      out_of_stock_notifications: {
        Row: {
          created_at: string | null
          email: string | null
          expires_at: string | null
          id: string
          notification_method: string | null
          notified: boolean | null
          notified_at: string | null
          phone: string | null
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          expires_at?: string | null
          id?: string
          notification_method?: string | null
          notified?: boolean | null
          notified_at?: string | null
          phone?: string | null
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          expires_at?: string | null
          id?: string
          notification_method?: string | null
          notified?: boolean | null
          notified_at?: string | null
          phone?: string | null
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "out_of_stock_notifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "out_of_stock_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_settlements: {
        Row: {
          created_at: string | null
          id: string
          nbfc_fee: number | null
          net_amount: number
          notes: string | null
          osas_commission: number | null
          payment_id: string | null
          retailer_id: string | null
          settled_at: string | null
          settlement_number: string
          settlement_reference: string | null
          settlement_status: string | null
          updated_at: string | null
          wholesaler_amount: number
          wholesaler_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nbfc_fee?: number | null
          net_amount: number
          notes?: string | null
          osas_commission?: number | null
          payment_id?: string | null
          retailer_id?: string | null
          settled_at?: string | null
          settlement_number: string
          settlement_reference?: string | null
          settlement_status?: string | null
          updated_at?: string | null
          wholesaler_amount: number
          wholesaler_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nbfc_fee?: number | null
          net_amount?: number
          notes?: string | null
          osas_commission?: number | null
          payment_id?: string | null
          retailer_id?: string | null
          settled_at?: string | null
          settlement_number?: string
          settlement_reference?: string | null
          settlement_status?: string | null
          updated_at?: string | null
          wholesaler_amount?: number
          wholesaler_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_settlements_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_settlements_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_settlements_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          category: string | null
          collector_staff_id: string | null
          created_at: string | null
          created_by: string | null
          gateway_name: string | null
          gateway_transaction_id: string | null
          id: string
          invoice_id: string | null
          is_private: boolean | null
          is_same_day: boolean | null
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          payment_mode_detail: string | null
          payment_number: string
          proof_url: string | null
          receipt_url: string | null
          reference_number: string | null
          retailer_id: string | null
          staff_id: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          collector_staff_id?: string | null
          created_at?: string | null
          created_by?: string | null
          gateway_name?: string | null
          gateway_transaction_id?: string | null
          id?: string
          invoice_id?: string | null
          is_private?: boolean | null
          is_same_day?: boolean | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_mode_detail?: string | null
          payment_number: string
          proof_url?: string | null
          receipt_url?: string | null
          reference_number?: string | null
          retailer_id?: string | null
          staff_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          collector_staff_id?: string | null
          created_at?: string | null
          created_by?: string | null
          gateway_name?: string | null
          gateway_transaction_id?: string | null
          id?: string
          invoice_id?: string | null
          is_private?: boolean | null
          is_same_day?: boolean | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_mode_detail?: string | null
          payment_number?: string
          proof_url?: string | null
          receipt_url?: string | null
          reference_number?: string | null
          retailer_id?: string | null
          staff_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_collector_staff_id_fkey"
            columns: ["collector_staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_goals: {
        Row: {
          created_at: string | null
          created_by: string | null
          current_value: number | null
          description: string | null
          end_date: string
          goal_type: string
          id: string
          is_team_goal: boolean | null
          progress_percentage: number | null
          staff_id: string | null
          start_date: string
          status: string | null
          target_value: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          current_value?: number | null
          description?: string | null
          end_date: string
          goal_type: string
          id?: string
          is_team_goal?: boolean | null
          progress_percentage?: number | null
          staff_id?: string | null
          start_date: string
          status?: string | null
          target_value: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          current_value?: number | null
          description?: string | null
          end_date?: string
          goal_type?: string
          id?: string
          is_team_goal?: boolean | null
          progress_percentage?: number | null
          staff_id?: string | null
          start_date?: string
          status?: string | null
          target_value?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_goals_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string | null
          created_at: string | null
          description: string | null
          id: string
          is_system: boolean | null
          module: string | null
          permission_code: string
          permission_name: string
          resource: string | null
          updated_at: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          module?: string | null
          permission_code: string
          permission_name: string
          resource?: string | null
          updated_at?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          module?: string | null
          permission_code?: string
          permission_name?: string
          resource?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      photo_search_history: {
        Row: {
          action_taken: string | null
          created_at: string | null
          id: string
          match_confidence: number | null
          matched_products: Json | null
          order_created_id: string | null
          photo_url: string
          search_query: string | null
          top_match_id: string | null
          user_id: string
        }
        Insert: {
          action_taken?: string | null
          created_at?: string | null
          id?: string
          match_confidence?: number | null
          matched_products?: Json | null
          order_created_id?: string | null
          photo_url: string
          search_query?: string | null
          top_match_id?: string | null
          user_id: string
        }
        Update: {
          action_taken?: string | null
          created_at?: string | null
          id?: string
          match_confidence?: number | null
          matched_products?: Json | null
          order_created_id?: string | null
          photo_url?: string
          search_query?: string | null
          top_match_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_search_history_order_created_id_fkey"
            columns: ["order_created_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_search_history_top_match_id_fkey"
            columns: ["top_match_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_search_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          id: string
          price: number
          product_id: string
          recorded_at: string | null
          wholesaler_id: string
        }
        Insert: {
          id?: string
          price: number
          product_id: string
          recorded_at?: string | null
          wholesaler_id: string
        }
        Update: {
          id?: string
          price?: number
          product_id?: string
          recorded_at?: string | null
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_history_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_rules: {
        Row: {
          applicable_categories: string[] | null
          applicable_customer_types: string[] | null
          applicable_products: string[] | null
          calculation_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          is_stackable: boolean | null
          max_order_value: number | null
          max_quantity: number | null
          min_order_value: number | null
          min_quantity: number | null
          name: string
          priority: number | null
          rule_type: string
          settings: Json | null
          updated_at: string | null
          user_id: string | null
          valid_from: string | null
          valid_to: string | null
          value: number
        }
        Insert: {
          applicable_categories?: string[] | null
          applicable_customer_types?: string[] | null
          applicable_products?: string[] | null
          calculation_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_stackable?: boolean | null
          max_order_value?: number | null
          max_quantity?: number | null
          min_order_value?: number | null
          min_quantity?: number | null
          name: string
          priority?: number | null
          rule_type: string
          settings?: Json | null
          updated_at?: string | null
          user_id?: string | null
          valid_from?: string | null
          valid_to?: string | null
          value: number
        }
        Update: {
          applicable_categories?: string[] | null
          applicable_customer_types?: string[] | null
          applicable_products?: string[] | null
          calculation_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_stackable?: boolean | null
          max_order_value?: number | null
          max_quantity?: number | null
          min_order_value?: number | null
          min_quantity?: number | null
          name?: string
          priority?: number | null
          rule_type?: string
          settings?: Json | null
          updated_at?: string | null
          user_id?: string | null
          valid_from?: string | null
          valid_to?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "pricing_rules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      private_stock_movements: {
        Row: {
          cash_sale_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          movement_type: string
          new_stock: number
          notes: string | null
          previous_stock: number
          product_id: string | null
          quantity_change: number
        }
        Insert: {
          cash_sale_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          movement_type: string
          new_stock: number
          notes?: string | null
          previous_stock: number
          product_id?: string | null
          quantity_change: number
        }
        Update: {
          cash_sale_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          movement_type?: string
          new_stock?: number
          notes?: string | null
          previous_stock?: number
          product_id?: string | null
          quantity_change?: number
        }
        Relationships: [
          {
            foreignKeyName: "private_stock_movements_cash_sale_id_fkey"
            columns: ["cash_sale_id"]
            isOneToOne: false
            referencedRelation: "cash_sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "private_stock_movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "private_stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_attribute_definitions: {
        Row: {
          attribute_group: string | null
          attribute_key: string
          attribute_name: string
          attribute_type: string
          category_id: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          is_filterable: boolean | null
          is_required: boolean | null
          is_visible: boolean | null
          options: Json | null
          subcategory_id: string | null
          unit: string | null
          updated_at: string | null
          validation_rules: Json | null
        }
        Insert: {
          attribute_group?: string | null
          attribute_key: string
          attribute_name: string
          attribute_type: string
          category_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_filterable?: boolean | null
          is_required?: boolean | null
          is_visible?: boolean | null
          options?: Json | null
          subcategory_id?: string | null
          unit?: string | null
          updated_at?: string | null
          validation_rules?: Json | null
        }
        Update: {
          attribute_group?: string | null
          attribute_key?: string
          attribute_name?: string
          attribute_type?: string
          category_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_filterable?: boolean | null
          is_required?: boolean | null
          is_visible?: boolean | null
          options?: Json | null
          subcategory_id?: string | null
          unit?: string | null
          updated_at?: string | null
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "product_attribute_definitions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_attribute_definitions_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_attribute_values: {
        Row: {
          attribute_id: string
          created_at: string | null
          id: string
          product_id: string
          updated_at: string | null
          value_boolean: boolean | null
          value_json: Json | null
          value_number: number | null
          value_text: string | null
        }
        Insert: {
          attribute_id: string
          created_at?: string | null
          id?: string
          product_id: string
          updated_at?: string | null
          value_boolean?: boolean | null
          value_json?: Json | null
          value_number?: number | null
          value_text?: string | null
        }
        Update: {
          attribute_id?: string
          created_at?: string | null
          id?: string
          product_id?: string
          updated_at?: string | null
          value_boolean?: boolean | null
          value_json?: Json | null
          value_number?: number | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_attribute_values_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "product_attribute_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_attribute_values_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_audit_log: {
        Row: {
          action: string
          change_summary: string | null
          changed_by: string
          created_at: string | null
          field_name: string | null
          id: string
          metadata: Json | null
          new_value: string | null
          old_value: string | null
          product_id: string
        }
        Insert: {
          action: string
          change_summary?: string | null
          changed_by: string
          created_at?: string | null
          field_name?: string | null
          id?: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
          product_id: string
        }
        Update: {
          action?: string
          change_summary?: string | null
          changed_by?: string
          created_at?: string | null
          field_name?: string | null
          id?: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_audit_log_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_audit_log_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_gst_categories: {
        Row: {
          category_type: string | null
          cess_rate: number | null
          created_at: string | null
          description: string | null
          gst_rate: number
          hsn_code: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category_type?: string | null
          cess_rate?: number | null
          created_at?: string | null
          description?: string | null
          gst_rate?: number
          hsn_code: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category_type?: string | null
          cess_rate?: number | null
          created_at?: string | null
          description?: string | null
          gst_rate?: number
          hsn_code?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_promotions: {
        Row: {
          amount_paid: number
          created_at: string
          duration_days: number
          end_date: string | null
          id: string
          payment_id: string | null
          plan_id: string | null
          plan_name: string | null
          product_id: string
          start_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_paid?: number
          created_at?: string
          duration_days?: number
          end_date?: string | null
          id?: string
          payment_id?: string | null
          plan_id?: string | null
          plan_name?: string | null
          product_id: string
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          duration_days?: number
          end_date?: string | null
          id?: string
          payment_id?: string | null
          plan_id?: string | null
          plan_name?: string | null
          product_id?: string
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_promotions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          created_at: string | null
          customer_id: string
          helpful_count: number | null
          id: string
          is_featured: boolean | null
          is_public: boolean | null
          is_verified_purchase: boolean | null
          merchant_id: string
          merchant_responded_at: string | null
          merchant_response: string | null
          not_helpful_count: number | null
          order_id: string | null
          product_id: string
          quality_rating: number | null
          rating: number
          review_images: string[] | null
          review_text: string
          review_title: string | null
          review_videos: string[] | null
          updated_at: string | null
          value_for_money_rating: number | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          helpful_count?: number | null
          id?: string
          is_featured?: boolean | null
          is_public?: boolean | null
          is_verified_purchase?: boolean | null
          merchant_id: string
          merchant_responded_at?: string | null
          merchant_response?: string | null
          not_helpful_count?: number | null
          order_id?: string | null
          product_id: string
          quality_rating?: number | null
          rating: number
          review_images?: string[] | null
          review_text: string
          review_title?: string | null
          review_videos?: string[] | null
          updated_at?: string | null
          value_for_money_rating?: number | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          helpful_count?: number | null
          id?: string
          is_featured?: boolean | null
          is_public?: boolean | null
          is_verified_purchase?: boolean | null
          merchant_id?: string
          merchant_responded_at?: string | null
          merchant_response?: string | null
          not_helpful_count?: number | null
          order_id?: string | null
          product_id?: string
          quality_rating?: number | null
          rating?: number
          review_images?: string[] | null
          review_text?: string
          review_title?: string | null
          review_videos?: string[] | null
          updated_at?: string | null
          value_for_money_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          application: string | null
          auto_reactivate_on_restock: boolean | null
          barcode: string | null
          batch_tracking_enabled: boolean | null
          box_coverage_sqft: number | null
          brand: string | null
          category: string | null
          category_id: string | null
          collection: string | null
          color: string | null
          coming_soon: boolean | null
          cost_price: number | null
          created_at: string | null
          created_by: string | null
          dead_stock_discount: number | null
          dead_stock_listed_at: string | null
          description: string | null
          dimensions: Json | null
          expiry_date: string | null
          finish: string | null
          frost_resistance: boolean | null
          gst_slab_id: string | null
          hsn_code: string | null
          id: string
          image_url: string | null
          images: Json | null
          is_active: boolean | null
          is_dead_stock: boolean | null
          is_featured: boolean | null
          look_and_feel: string | null
          mrp: number | null
          name: string
          origin: string | null
          osas_visibility: boolean | null
          out_of_stock_notify_enabled: boolean | null
          pei_rating: number | null
          pieces_per_box: number | null
          product_tags: Json | null
          sac_code: string | null
          series: string | null
          share_count: number | null
          size: string | null
          sku: string
          slip_resistance: boolean | null
          subcategory_id: string | null
          tags: Json | null
          tax_rate: number | null
          thickness_mm: number | null
          tile_body_type_id: string | null
          unit: string | null
          unit_price: number
          updated_at: string | null
          user_id: string | null
          video_url: string | null
          view_count: number | null
          visibility_status: string | null
          water_absorption_percent: number | null
          weight: number | null
          weight_per_box: number | null
        }
        Insert: {
          application?: string | null
          auto_reactivate_on_restock?: boolean | null
          barcode?: string | null
          batch_tracking_enabled?: boolean | null
          box_coverage_sqft?: number | null
          brand?: string | null
          category?: string | null
          category_id?: string | null
          collection?: string | null
          color?: string | null
          coming_soon?: boolean | null
          cost_price?: number | null
          created_at?: string | null
          created_by?: string | null
          dead_stock_discount?: number | null
          dead_stock_listed_at?: string | null
          description?: string | null
          dimensions?: Json | null
          expiry_date?: string | null
          finish?: string | null
          frost_resistance?: boolean | null
          gst_slab_id?: string | null
          hsn_code?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_active?: boolean | null
          is_dead_stock?: boolean | null
          is_featured?: boolean | null
          look_and_feel?: string | null
          mrp?: number | null
          name: string
          origin?: string | null
          osas_visibility?: boolean | null
          out_of_stock_notify_enabled?: boolean | null
          pei_rating?: number | null
          pieces_per_box?: number | null
          product_tags?: Json | null
          sac_code?: string | null
          series?: string | null
          share_count?: number | null
          size?: string | null
          sku: string
          slip_resistance?: boolean | null
          subcategory_id?: string | null
          tags?: Json | null
          tax_rate?: number | null
          thickness_mm?: number | null
          tile_body_type_id?: string | null
          unit?: string | null
          unit_price: number
          updated_at?: string | null
          user_id?: string | null
          video_url?: string | null
          view_count?: number | null
          visibility_status?: string | null
          water_absorption_percent?: number | null
          weight?: number | null
          weight_per_box?: number | null
        }
        Update: {
          application?: string | null
          auto_reactivate_on_restock?: boolean | null
          barcode?: string | null
          batch_tracking_enabled?: boolean | null
          box_coverage_sqft?: number | null
          brand?: string | null
          category?: string | null
          category_id?: string | null
          collection?: string | null
          color?: string | null
          coming_soon?: boolean | null
          cost_price?: number | null
          created_at?: string | null
          created_by?: string | null
          dead_stock_discount?: number | null
          dead_stock_listed_at?: string | null
          description?: string | null
          dimensions?: Json | null
          expiry_date?: string | null
          finish?: string | null
          frost_resistance?: boolean | null
          gst_slab_id?: string | null
          hsn_code?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_active?: boolean | null
          is_dead_stock?: boolean | null
          is_featured?: boolean | null
          look_and_feel?: string | null
          mrp?: number | null
          name?: string
          origin?: string | null
          osas_visibility?: boolean | null
          out_of_stock_notify_enabled?: boolean | null
          pei_rating?: number | null
          pieces_per_box?: number | null
          product_tags?: Json | null
          sac_code?: string | null
          series?: string | null
          share_count?: number | null
          size?: string | null
          sku?: string
          slip_resistance?: boolean | null
          subcategory_id?: string | null
          tags?: Json | null
          tax_rate?: number | null
          thickness_mm?: number | null
          tile_body_type_id?: string | null
          unit?: string | null
          unit_price?: number
          updated_at?: string | null
          user_id?: string | null
          video_url?: string | null
          view_count?: number | null
          visibility_status?: string | null
          water_absorption_percent?: number | null
          weight?: number | null
          weight_per_box?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_gst_slab_id_fkey"
            columns: ["gst_slab_id"]
            isOneToOne: false
            referencedRelation: "gst_slabs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_tile_body_type_id_fkey"
            columns: ["tile_body_type_id"]
            isOneToOne: false
            referencedRelation: "tile_body_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_status: string | null
          avatar_url: string | null
          blocked_at: string | null
          blocked_by: string | null
          business_name: string | null
          business_type: string | null
          created_at: string | null
          email: string
          email_opt_in: boolean | null
          full_name: string | null
          gst_number: string | null
          id: string
          is_blocked: boolean | null
          last_campaign_sent_at: string | null
          marketing_opt_in: boolean | null
          osas_credit_limit_approved: number | null
          osas_credit_utilization: number | null
          osas_eligible_at: string | null
          osas_monitoring_start_date: string | null
          osas_monitoring_status: string | null
          osas_risk_indicator: string | null
          osas_same_day_enabled: boolean | null
          pan_number: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          sms_opt_in: boolean | null
          updated_at: string | null
          verification_documents: Json | null
          verified_at: string | null
          verified_by: string | null
          wallet_balance: number | null
          whatsapp_opt_in: boolean | null
        }
        Insert: {
          account_status?: string | null
          avatar_url?: string | null
          blocked_at?: string | null
          blocked_by?: string | null
          business_name?: string | null
          business_type?: string | null
          created_at?: string | null
          email: string
          email_opt_in?: boolean | null
          full_name?: string | null
          gst_number?: string | null
          id: string
          is_blocked?: boolean | null
          last_campaign_sent_at?: string | null
          marketing_opt_in?: boolean | null
          osas_credit_limit_approved?: number | null
          osas_credit_utilization?: number | null
          osas_eligible_at?: string | null
          osas_monitoring_start_date?: string | null
          osas_monitoring_status?: string | null
          osas_risk_indicator?: string | null
          osas_same_day_enabled?: boolean | null
          pan_number?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          sms_opt_in?: boolean | null
          updated_at?: string | null
          verification_documents?: Json | null
          verified_at?: string | null
          verified_by?: string | null
          wallet_balance?: number | null
          whatsapp_opt_in?: boolean | null
        }
        Update: {
          account_status?: string | null
          avatar_url?: string | null
          blocked_at?: string | null
          blocked_by?: string | null
          business_name?: string | null
          business_type?: string | null
          created_at?: string | null
          email?: string
          email_opt_in?: boolean | null
          full_name?: string | null
          gst_number?: string | null
          id?: string
          is_blocked?: boolean | null
          last_campaign_sent_at?: string | null
          marketing_opt_in?: boolean | null
          osas_credit_limit_approved?: number | null
          osas_credit_utilization?: number | null
          osas_eligible_at?: string | null
          osas_monitoring_start_date?: string | null
          osas_monitoring_status?: string | null
          osas_risk_indicator?: string | null
          osas_same_day_enabled?: boolean | null
          pan_number?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          sms_opt_in?: boolean | null
          updated_at?: string | null
          verification_documents?: Json | null
          verified_at?: string | null
          verified_by?: string | null
          wallet_balance?: number | null
          whatsapp_opt_in?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_blocked_by_fkey"
            columns: ["blocked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_areas: {
        Row: {
          actual_cost: number | null
          area_name: string
          area_type: string | null
          carpet_area: number | null
          created_at: string | null
          estimated_budget: number | null
          id: string
          notes: string | null
          priority: number | null
          project_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          actual_cost?: number | null
          area_name: string
          area_type?: string | null
          carpet_area?: number | null
          created_at?: string | null
          estimated_budget?: number | null
          id?: string
          notes?: string | null
          priority?: number | null
          project_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_cost?: number | null
          area_name?: string
          area_type?: string | null
          carpet_area?: number | null
          created_at?: string | null
          estimated_budget?: number | null
          id?: string
          notes?: string | null
          priority?: number | null
          project_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_areas_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_areas_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_change_requests: {
        Row: {
          admin_approved_at: string | null
          admin_approved_by: string | null
          affected_areas: string[] | null
          affected_items: Json | null
          attachments: Json | null
          category: string | null
          client_approval_required: boolean | null
          client_approved_at: string | null
          client_approved_by: string | null
          client_rejection_reason: string | null
          cost_impact: number | null
          created_at: string | null
          created_by: string | null
          description: string
          designer_approved_at: string | null
          id: string
          implementation_notes: string | null
          implemented_at: string | null
          new_specification: string | null
          notes: string | null
          original_specification: string | null
          priority: string | null
          project_id: string | null
          request_number: string | null
          requested_by: string
          requester_name: string | null
          revised_quotation_id: string | null
          status: string | null
          timeline_impact_days: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          admin_approved_at?: string | null
          admin_approved_by?: string | null
          affected_areas?: string[] | null
          affected_items?: Json | null
          attachments?: Json | null
          category?: string | null
          client_approval_required?: boolean | null
          client_approved_at?: string | null
          client_approved_by?: string | null
          client_rejection_reason?: string | null
          cost_impact?: number | null
          created_at?: string | null
          created_by?: string | null
          description: string
          designer_approved_at?: string | null
          id?: string
          implementation_notes?: string | null
          implemented_at?: string | null
          new_specification?: string | null
          notes?: string | null
          original_specification?: string | null
          priority?: string | null
          project_id?: string | null
          request_number?: string | null
          requested_by: string
          requester_name?: string | null
          revised_quotation_id?: string | null
          status?: string | null
          timeline_impact_days?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          admin_approved_at?: string | null
          admin_approved_by?: string | null
          affected_areas?: string[] | null
          affected_items?: Json | null
          attachments?: Json | null
          category?: string | null
          client_approval_required?: boolean | null
          client_approved_at?: string | null
          client_approved_by?: string | null
          client_rejection_reason?: string | null
          cost_impact?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          designer_approved_at?: string | null
          id?: string
          implementation_notes?: string | null
          implemented_at?: string | null
          new_specification?: string | null
          notes?: string | null
          original_specification?: string | null
          priority?: string | null
          project_id?: string | null
          request_number?: string | null
          requested_by?: string
          requester_name?: string | null
          revised_quotation_id?: string | null
          status?: string | null
          timeline_impact_days?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_change_requests_admin_approved_by_fkey"
            columns: ["admin_approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_change_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_change_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_change_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_change_requests_revised_quotation_id_fkey"
            columns: ["revised_quotation_id"]
            isOneToOne: false
            referencedRelation: "designer_quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      project_deliveries: {
        Row: {
          actual_date: string | null
          created_at: string | null
          created_by: string | null
          delivery_address: string | null
          delivery_number: string | null
          delivery_photos: Json | null
          expected_date: string | null
          has_issues: boolean | null
          id: string
          issue_description: string | null
          issue_resolved: boolean | null
          items: Json | null
          notes: string | null
          order_id: string | null
          project_id: string | null
          quotation_id: string | null
          received_by: string | null
          receiver_phone: string | null
          status: string | null
          supplier_name: string | null
          supplier_phone: string | null
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string | null
        }
        Insert: {
          actual_date?: string | null
          created_at?: string | null
          created_by?: string | null
          delivery_address?: string | null
          delivery_number?: string | null
          delivery_photos?: Json | null
          expected_date?: string | null
          has_issues?: boolean | null
          id?: string
          issue_description?: string | null
          issue_resolved?: boolean | null
          items?: Json | null
          notes?: string | null
          order_id?: string | null
          project_id?: string | null
          quotation_id?: string | null
          received_by?: string | null
          receiver_phone?: string | null
          status?: string | null
          supplier_name?: string | null
          supplier_phone?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_date?: string | null
          created_at?: string | null
          created_by?: string | null
          delivery_address?: string | null
          delivery_number?: string | null
          delivery_photos?: Json | null
          expected_date?: string | null
          has_issues?: boolean | null
          id?: string
          issue_description?: string | null
          issue_resolved?: boolean | null
          items?: Json | null
          notes?: string | null
          order_id?: string | null
          project_id?: string | null
          quotation_id?: string | null
          received_by?: string | null
          receiver_phone?: string | null
          status?: string | null
          supplier_name?: string | null
          supplier_phone?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_deliveries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_deliveries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_deliveries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_deliveries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_deliveries_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "designer_quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      project_material_status: {
        Row: {
          actual_delivery: string | null
          category: string | null
          created_at: string | null
          expected_delivery: string | null
          has_issues: boolean | null
          id: string
          installation_status: string | null
          installed_at: string | null
          installed_by: string | null
          issue_notes: string | null
          issue_resolved: boolean | null
          issue_type: string | null
          material_name: string
          notes: string | null
          order_reference: string | null
          ordered_at: string | null
          ordering_status: string | null
          photos: Json | null
          project_id: string | null
          quality_notes: string | null
          quality_status: string | null
          quantity_delivered: number | null
          quantity_required: number | null
          quotation_item_id: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          actual_delivery?: string | null
          category?: string | null
          created_at?: string | null
          expected_delivery?: string | null
          has_issues?: boolean | null
          id?: string
          installation_status?: string | null
          installed_at?: string | null
          installed_by?: string | null
          issue_notes?: string | null
          issue_resolved?: boolean | null
          issue_type?: string | null
          material_name: string
          notes?: string | null
          order_reference?: string | null
          ordered_at?: string | null
          ordering_status?: string | null
          photos?: Json | null
          project_id?: string | null
          quality_notes?: string | null
          quality_status?: string | null
          quantity_delivered?: number | null
          quantity_required?: number | null
          quotation_item_id?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_delivery?: string | null
          category?: string | null
          created_at?: string | null
          expected_delivery?: string | null
          has_issues?: boolean | null
          id?: string
          installation_status?: string | null
          installed_at?: string | null
          installed_by?: string | null
          issue_notes?: string | null
          issue_resolved?: boolean | null
          issue_type?: string | null
          material_name?: string
          notes?: string | null
          order_reference?: string | null
          ordered_at?: string | null
          ordering_status?: string | null
          photos?: Json | null
          project_id?: string | null
          quality_notes?: string | null
          quality_status?: string | null
          quantity_delivered?: number | null
          quantity_required?: number | null
          quotation_item_id?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_material_status_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_material_status_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_material_status_quotation_item_id_fkey"
            columns: ["quotation_item_id"]
            isOneToOne: false
            referencedRelation: "quotation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          completed_date: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          is_payment_received: boolean | null
          milestone_name: string
          milestone_order: number | null
          payment_amount: number | null
          payment_percentage: number | null
          payment_received_at: string | null
          project_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_payment_received?: boolean | null
          milestone_name: string
          milestone_order?: number | null
          payment_amount?: number | null
          payment_percentage?: number | null
          payment_received_at?: string | null
          project_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_payment_received?: boolean | null
          milestone_name?: string
          milestone_order?: number | null
          payment_amount?: number | null
          payment_percentage?: number | null
          payment_received_at?: string | null
          project_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_approvals: {
        Row: {
          action: string
          actor_id: string | null
          actor_name: string | null
          actor_type: string | null
          created_at: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          notes: string | null
          quotation_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_name?: string | null
          actor_type?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          notes?: string | null
          quotation_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_name?: string | null
          actor_type?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          notes?: string | null
          quotation_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotation_approvals_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_approvals_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "designer_quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_items: {
        Row: {
          area_id: string | null
          brand: string | null
          category: string | null
          cost_price: number | null
          created_at: string | null
          description: string | null
          id: string
          item_type: string
          margin_amount: number | null
          margin_percent: number | null
          name: string
          notes: string | null
          product_id: string | null
          quantity: number | null
          quotation_id: string | null
          sku: string | null
          sort_order: number | null
          total_price: number | null
          unit: string | null
          unit_price: number | null
        }
        Insert: {
          area_id?: string | null
          brand?: string | null
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          item_type: string
          margin_amount?: number | null
          margin_percent?: number | null
          name: string
          notes?: string | null
          product_id?: string | null
          quantity?: number | null
          quotation_id?: string | null
          sku?: string | null
          sort_order?: number | null
          total_price?: number | null
          unit?: string | null
          unit_price?: number | null
        }
        Update: {
          area_id?: string | null
          brand?: string | null
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          item_type?: string
          margin_amount?: number | null
          margin_percent?: number | null
          name?: string
          notes?: string | null
          product_id?: string | null
          quantity?: number | null
          quotation_id?: string | null
          sku?: string | null
          sort_order?: number | null
          total_price?: number | null
          unit?: string | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotation_items_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "project_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_items_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "designer_quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      rating_statistics: {
        Row: {
          average_rating: number | null
          entity_id: string
          entity_type: string
          five_star_count: number | null
          four_star_count: number | null
          id: string
          last_calculated_at: string | null
          negative_count: number | null
          negative_percentage: number | null
          neutral_count: number | null
          one_star_count: number | null
          positive_count: number | null
          positive_percentage: number | null
          three_star_count: number | null
          total_ratings: number | null
          total_reviews: number | null
          two_star_count: number | null
          updated_at: string | null
        }
        Insert: {
          average_rating?: number | null
          entity_id: string
          entity_type: string
          five_star_count?: number | null
          four_star_count?: number | null
          id?: string
          last_calculated_at?: string | null
          negative_count?: number | null
          negative_percentage?: number | null
          neutral_count?: number | null
          one_star_count?: number | null
          positive_count?: number | null
          positive_percentage?: number | null
          three_star_count?: number | null
          total_ratings?: number | null
          total_reviews?: number | null
          two_star_count?: number | null
          updated_at?: string | null
        }
        Update: {
          average_rating?: number | null
          entity_id?: string
          entity_type?: string
          five_star_count?: number | null
          four_star_count?: number | null
          id?: string
          last_calculated_at?: string | null
          negative_count?: number | null
          negative_percentage?: number | null
          neutral_count?: number | null
          one_star_count?: number | null
          positive_count?: number | null
          positive_percentage?: number | null
          three_star_count?: number | null
          total_ratings?: number | null
          total_reviews?: number | null
          two_star_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          program_id: string | null
          referral_code: string
          referrer_id: string
          total_uses: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          program_id?: string | null
          referral_code: string
          referrer_id: string
          total_uses?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          program_id?: string | null
          referral_code?: string
          referrer_id?: string
          total_uses?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_codes_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "referral_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_codes_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_programs: {
        Row: {
          applicable_to: string | null
          created_at: string | null
          created_by: string | null
          effective_from: string
          effective_to: string | null
          id: string
          is_active: boolean | null
          max_rewards_per_referrer: number | null
          min_transaction_amount: number | null
          program_name: string
          program_type: string | null
          referee_reward_amount: number | null
          referee_reward_percentage: number | null
          referrer_reward_amount: number | null
          referrer_reward_percentage: number | null
          reward_validity_days: number | null
          terms_conditions: string | null
          updated_at: string | null
        }
        Insert: {
          applicable_to?: string | null
          created_at?: string | null
          created_by?: string | null
          effective_from: string
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          max_rewards_per_referrer?: number | null
          min_transaction_amount?: number | null
          program_name: string
          program_type?: string | null
          referee_reward_amount?: number | null
          referee_reward_percentage?: number | null
          referrer_reward_amount?: number | null
          referrer_reward_percentage?: number | null
          reward_validity_days?: number | null
          terms_conditions?: string | null
          updated_at?: string | null
        }
        Update: {
          applicable_to?: string | null
          created_at?: string | null
          created_by?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          max_rewards_per_referrer?: number | null
          min_transaction_amount?: number | null
          program_name?: string
          program_type?: string | null
          referee_reward_amount?: number | null
          referee_reward_percentage?: number | null
          referrer_reward_amount?: number | null
          referrer_reward_percentage?: number | null
          reward_validity_days?: number | null
          terms_conditions?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_programs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_rewards: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_redeemed: boolean | null
          redeemed_at: string | null
          redeemed_in_order_id: string | null
          referral_transaction_id: string | null
          reward_amount: number
          reward_type: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_redeemed?: boolean | null
          redeemed_at?: string | null
          redeemed_in_order_id?: string | null
          referral_transaction_id?: string | null
          reward_amount: number
          reward_type?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_redeemed?: boolean | null
          redeemed_at?: string | null
          redeemed_in_order_id?: string | null
          referral_transaction_id?: string | null
          reward_amount?: number
          reward_type?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_rewards_redeemed_in_order_id_fkey"
            columns: ["redeemed_in_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_rewards_referral_transaction_id_fkey"
            columns: ["referral_transaction_id"]
            isOneToOne: false
            referencedRelation: "referral_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_transactions: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          program_id: string | null
          qualified_at: string | null
          referee_id: string
          referee_reward_amount: number | null
          referral_code_id: string
          referrer_id: string
          referrer_reward_amount: number | null
          rewarded_at: string | null
          status: string | null
          transaction_amount: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          program_id?: string | null
          qualified_at?: string | null
          referee_id: string
          referee_reward_amount?: number | null
          referral_code_id: string
          referrer_id: string
          referrer_reward_amount?: number | null
          rewarded_at?: string | null
          status?: string | null
          transaction_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          program_id?: string | null
          qualified_at?: string | null
          referee_id?: string
          referee_reward_amount?: number | null
          referral_code_id?: string
          referrer_id?: string
          referrer_reward_amount?: number | null
          rewarded_at?: string | null
          status?: string | null
          transaction_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_transactions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "referral_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_transactions_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_transactions_referral_code_id_fkey"
            columns: ["referral_code_id"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_transactions_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      refunds: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          payment_id: string | null
          processed_at: string | null
          reason: string | null
          refund_amount: number
          refund_method: string
          refund_number: string
          refund_status: string
          return_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_id?: string | null
          processed_at?: string | null
          reason?: string | null
          refund_amount: number
          refund_method: string
          refund_number: string
          refund_status?: string
          return_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_id?: string | null
          processed_at?: string | null
          reason?: string | null
          refund_amount?: number
          refund_method?: string
          refund_number?: string
          refund_status?: string
          return_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "refunds_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "order_returns"
            referencedColumns: ["id"]
          },
        ]
      }
      reminder_governance: {
        Row: {
          abuse_flag: boolean | null
          abuse_flagged_at: string | null
          abuse_flagged_by: string | null
          abuse_reason: string | null
          created_at: string | null
          daily_limit: number | null
          date: string
          id: string
          is_restricted: boolean | null
          monthly_limit: number | null
          reminders_sent_month: number | null
          reminders_sent_today: number | null
          reminders_sent_week: number | null
          restricted_until: string | null
          restriction_reason: string | null
          updated_at: string | null
          weekly_limit: number | null
          wholesaler_id: string
        }
        Insert: {
          abuse_flag?: boolean | null
          abuse_flagged_at?: string | null
          abuse_flagged_by?: string | null
          abuse_reason?: string | null
          created_at?: string | null
          daily_limit?: number | null
          date?: string
          id?: string
          is_restricted?: boolean | null
          monthly_limit?: number | null
          reminders_sent_month?: number | null
          reminders_sent_today?: number | null
          reminders_sent_week?: number | null
          restricted_until?: string | null
          restriction_reason?: string | null
          updated_at?: string | null
          weekly_limit?: number | null
          wholesaler_id: string
        }
        Update: {
          abuse_flag?: boolean | null
          abuse_flagged_at?: string | null
          abuse_flagged_by?: string | null
          abuse_reason?: string | null
          created_at?: string | null
          daily_limit?: number | null
          date?: string
          id?: string
          is_restricted?: boolean | null
          monthly_limit?: number | null
          reminders_sent_month?: number | null
          reminders_sent_today?: number | null
          reminders_sent_week?: number | null
          restricted_until?: string | null
          restriction_reason?: string | null
          updated_at?: string | null
          weekly_limit?: number | null
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminder_governance_abuse_flagged_by_fkey"
            columns: ["abuse_flagged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminder_governance_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      retailer_business_profiles: {
        Row: {
          accepts_credit: boolean | null
          annual_turnover_range: string | null
          business_category: string[] | null
          created_at: string | null
          delivery_available: boolean | null
          employee_count: number | null
          has_online_presence: boolean | null
          id: string
          is_verified: boolean | null
          latitude: number | null
          longitude: number | null
          min_order_value: number | null
          operating_hours: Json | null
          preferred_brands: string[] | null
          retailer_id: string
          service_radius_km: number | null
          social_media_links: Json | null
          store_area_sqft: number | null
          updated_at: string | null
          verification_date: string | null
          visibility_status: string | null
          website_url: string | null
        }
        Insert: {
          accepts_credit?: boolean | null
          annual_turnover_range?: string | null
          business_category?: string[] | null
          created_at?: string | null
          delivery_available?: boolean | null
          employee_count?: number | null
          has_online_presence?: boolean | null
          id?: string
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          min_order_value?: number | null
          operating_hours?: Json | null
          preferred_brands?: string[] | null
          retailer_id: string
          service_radius_km?: number | null
          social_media_links?: Json | null
          store_area_sqft?: number | null
          updated_at?: string | null
          verification_date?: string | null
          visibility_status?: string | null
          website_url?: string | null
        }
        Update: {
          accepts_credit?: boolean | null
          annual_turnover_range?: string | null
          business_category?: string[] | null
          created_at?: string | null
          delivery_available?: boolean | null
          employee_count?: number | null
          has_online_presence?: boolean | null
          id?: string
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          min_order_value?: number | null
          operating_hours?: Json | null
          preferred_brands?: string[] | null
          retailer_id?: string
          service_radius_km?: number | null
          social_media_links?: Json | null
          store_area_sqft?: number | null
          updated_at?: string | null
          verification_date?: string | null
          visibility_status?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retailer_business_profiles_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: true
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      retailer_discovery_preferences: {
        Row: {
          auto_connect: boolean | null
          created_at: string | null
          exclude_existing_partners: boolean | null
          id: string
          min_annual_turnover: string | null
          min_credit_score: number | null
          preferred_categories: string[] | null
          preferred_payment_terms: string[] | null
          search_radius_km: number | null
          updated_at: string | null
          wholesaler_id: string
        }
        Insert: {
          auto_connect?: boolean | null
          created_at?: string | null
          exclude_existing_partners?: boolean | null
          id?: string
          min_annual_turnover?: string | null
          min_credit_score?: number | null
          preferred_categories?: string[] | null
          preferred_payment_terms?: string[] | null
          search_radius_km?: number | null
          updated_at?: string | null
          wholesaler_id: string
        }
        Update: {
          auto_connect?: boolean | null
          created_at?: string | null
          exclude_existing_partners?: boolean | null
          id?: string
          min_annual_turnover?: string | null
          min_credit_score?: number | null
          preferred_categories?: string[] | null
          preferred_payment_terms?: string[] | null
          search_radius_km?: number | null
          updated_at?: string | null
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "retailer_discovery_preferences_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      retailer_emi_plans: {
        Row: {
          amount_paid: number | null
          amount_pending: number | null
          approved_by: string | null
          created_at: string | null
          emi_amount: number
          emis_paid: number | null
          emis_pending: number | null
          end_date: string | null
          id: string
          interest_rate: number | null
          linked_invoice_ids: string[] | null
          notes: string | null
          principal_amount: number
          retailer_id: string
          start_date: string
          status: string | null
          tenure_months: number
          total_amount: number
          total_emis: number
          updated_at: string | null
        }
        Insert: {
          amount_paid?: number | null
          amount_pending?: number | null
          approved_by?: string | null
          created_at?: string | null
          emi_amount: number
          emis_paid?: number | null
          emis_pending?: number | null
          end_date?: string | null
          id?: string
          interest_rate?: number | null
          linked_invoice_ids?: string[] | null
          notes?: string | null
          principal_amount: number
          retailer_id: string
          start_date: string
          status?: string | null
          tenure_months: number
          total_amount: number
          total_emis: number
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number | null
          amount_pending?: number | null
          approved_by?: string | null
          created_at?: string | null
          emi_amount?: number
          emis_paid?: number | null
          emis_pending?: number | null
          end_date?: string | null
          id?: string
          interest_rate?: number | null
          linked_invoice_ids?: string[] | null
          notes?: string | null
          principal_amount?: number
          retailer_id?: string
          start_date?: string
          status?: string | null
          tenure_months?: number
          total_amount?: number
          total_emis?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retailer_emi_plans_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retailer_emi_plans_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      retailer_emi_schedule: {
        Row: {
          created_at: string | null
          due_date: string
          emi_amount: number
          emi_number: number
          emi_plan_id: string
          id: string
          interest_component: number | null
          late_fee: number | null
          late_fee_paid: number | null
          paid_amount: number | null
          paid_date: string | null
          payment_id: string | null
          principal_component: number | null
          retailer_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          due_date: string
          emi_amount: number
          emi_number: number
          emi_plan_id: string
          id?: string
          interest_component?: number | null
          late_fee?: number | null
          late_fee_paid?: number | null
          paid_amount?: number | null
          paid_date?: string | null
          payment_id?: string | null
          principal_component?: number | null
          retailer_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          due_date?: string
          emi_amount?: number
          emi_number?: number
          emi_plan_id?: string
          id?: string
          interest_component?: number | null
          late_fee?: number | null
          late_fee_paid?: number | null
          paid_amount?: number | null
          paid_date?: string | null
          payment_id?: string | null
          principal_component?: number | null
          retailer_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retailer_emi_schedule_emi_plan_id_fkey"
            columns: ["emi_plan_id"]
            isOneToOne: false
            referencedRelation: "retailer_emi_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retailer_emi_schedule_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "retailer_osas_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retailer_emi_schedule_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      retailer_manual_credit: {
        Row: {
          amount_paid: number | null
          created_at: string | null
          credit_amount: number
          credit_date: string | null
          credit_from_id: string | null
          credit_from_name: string | null
          credit_from_type: string
          due_date: string | null
          id: string
          interest_rate: number | null
          notes: string | null
          outstanding: number | null
          retailer_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string | null
          credit_amount: number
          credit_date?: string | null
          credit_from_id?: string | null
          credit_from_name?: string | null
          credit_from_type: string
          due_date?: string | null
          id?: string
          interest_rate?: number | null
          notes?: string | null
          outstanding?: number | null
          retailer_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number | null
          created_at?: string | null
          credit_amount?: number
          credit_date?: string | null
          credit_from_id?: string | null
          credit_from_name?: string | null
          credit_from_type?: string
          due_date?: string | null
          id?: string
          interest_rate?: number | null
          notes?: string | null
          outstanding?: number | null
          retailer_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retailer_manual_credit_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      retailer_monitoring_status: {
        Row: {
          average_delay_days: number | null
          created_at: string | null
          credit_eligible: boolean | null
          current_month: number | null
          delay_frequency: number | null
          eligibility_decision_by: string | null
          eligibility_decision_date: string | null
          eligibility_notes: string | null
          id: string
          monitoring_end_date: string | null
          monitoring_start_date: string
          on_time_payment_rate: number | null
          partial_payment_rate: number | null
          payment_discipline_score: number | null
          recommended_credit_limit: number | null
          retailer_id: string
          risk_flags: string[] | null
          risk_level: string | null
          status: string | null
          total_months: number | null
          updated_at: string | null
          wholesaler_id: string
        }
        Insert: {
          average_delay_days?: number | null
          created_at?: string | null
          credit_eligible?: boolean | null
          current_month?: number | null
          delay_frequency?: number | null
          eligibility_decision_by?: string | null
          eligibility_decision_date?: string | null
          eligibility_notes?: string | null
          id?: string
          monitoring_end_date?: string | null
          monitoring_start_date?: string
          on_time_payment_rate?: number | null
          partial_payment_rate?: number | null
          payment_discipline_score?: number | null
          recommended_credit_limit?: number | null
          retailer_id: string
          risk_flags?: string[] | null
          risk_level?: string | null
          status?: string | null
          total_months?: number | null
          updated_at?: string | null
          wholesaler_id: string
        }
        Update: {
          average_delay_days?: number | null
          created_at?: string | null
          credit_eligible?: boolean | null
          current_month?: number | null
          delay_frequency?: number | null
          eligibility_decision_by?: string | null
          eligibility_decision_date?: string | null
          eligibility_notes?: string | null
          id?: string
          monitoring_end_date?: string | null
          monitoring_start_date?: string
          on_time_payment_rate?: number | null
          partial_payment_rate?: number | null
          payment_discipline_score?: number | null
          recommended_credit_limit?: number | null
          retailer_id?: string
          risk_flags?: string[] | null
          risk_level?: string | null
          status?: string | null
          total_months?: number | null
          updated_at?: string | null
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "retailer_monitoring_status_eligibility_decision_by_fkey"
            columns: ["eligibility_decision_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retailer_monitoring_status_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retailer_monitoring_status_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      retailer_osas_invoices: {
        Row: {
          created_at: string | null
          days_overdue: number | null
          due_date: string
          emi_plan_id: string | null
          id: string
          invoice_amount: number
          invoice_date: string | null
          invoice_number: string
          is_emi_converted: boolean | null
          notes: string | null
          original_invoice_id: string | null
          osas_paid_to_wholesaler: number | null
          outstanding_amount: number | null
          penalty_amount: number | null
          penalty_applied_date: string | null
          penalty_rate: number | null
          retailer_id: string
          retailer_paid_to_osas: number | null
          status: string | null
          updated_at: string | null
          wholesaler_id: string | null
        }
        Insert: {
          created_at?: string | null
          days_overdue?: number | null
          due_date: string
          emi_plan_id?: string | null
          id?: string
          invoice_amount: number
          invoice_date?: string | null
          invoice_number: string
          is_emi_converted?: boolean | null
          notes?: string | null
          original_invoice_id?: string | null
          osas_paid_to_wholesaler?: number | null
          outstanding_amount?: number | null
          penalty_amount?: number | null
          penalty_applied_date?: string | null
          penalty_rate?: number | null
          retailer_id: string
          retailer_paid_to_osas?: number | null
          status?: string | null
          updated_at?: string | null
          wholesaler_id?: string | null
        }
        Update: {
          created_at?: string | null
          days_overdue?: number | null
          due_date?: string
          emi_plan_id?: string | null
          id?: string
          invoice_amount?: number
          invoice_date?: string | null
          invoice_number?: string
          is_emi_converted?: boolean | null
          notes?: string | null
          original_invoice_id?: string | null
          osas_paid_to_wholesaler?: number | null
          outstanding_amount?: number | null
          penalty_amount?: number | null
          penalty_applied_date?: string | null
          penalty_rate?: number | null
          retailer_id?: string
          retailer_paid_to_osas?: number | null
          status?: string | null
          updated_at?: string | null
          wholesaler_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retailer_osas_invoices_original_invoice_id_fkey"
            columns: ["original_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retailer_osas_invoices_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retailer_osas_invoices_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      retailer_osas_outstanding: {
        Row: {
          active_emi_count: number | null
          credit_available: number | null
          credit_frozen: boolean | null
          credit_limit: number | null
          credit_used: number | null
          credit_utilization_percent: number | null
          current_dues: number | null
          emi_paid: number | null
          emi_pending: number | null
          freeze_reason: string | null
          frozen_at: string | null
          id: string
          overdue_amount: number | null
          payment_status: string | null
          pending_penalties: number | null
          retailer_id: string
          total_emi_amount: number | null
          total_outstanding: number | null
          total_penalties: number | null
          updated_at: string | null
        }
        Insert: {
          active_emi_count?: number | null
          credit_available?: number | null
          credit_frozen?: boolean | null
          credit_limit?: number | null
          credit_used?: number | null
          credit_utilization_percent?: number | null
          current_dues?: number | null
          emi_paid?: number | null
          emi_pending?: number | null
          freeze_reason?: string | null
          frozen_at?: string | null
          id?: string
          overdue_amount?: number | null
          payment_status?: string | null
          pending_penalties?: number | null
          retailer_id: string
          total_emi_amount?: number | null
          total_outstanding?: number | null
          total_penalties?: number | null
          updated_at?: string | null
        }
        Update: {
          active_emi_count?: number | null
          credit_available?: number | null
          credit_frozen?: boolean | null
          credit_limit?: number | null
          credit_used?: number | null
          credit_utilization_percent?: number | null
          current_dues?: number | null
          emi_paid?: number | null
          emi_pending?: number | null
          freeze_reason?: string | null
          frozen_at?: string | null
          id?: string
          overdue_amount?: number | null
          payment_status?: string | null
          pending_penalties?: number | null
          retailer_id?: string
          total_emi_amount?: number | null
          total_outstanding?: number | null
          total_penalties?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retailer_osas_outstanding_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: true
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      retailer_osas_payments: {
        Row: {
          amount: number
          created_at: string | null
          failure_reason: string | null
          id: string
          osas_invoice_id: string | null
          payment_date: string | null
          payment_gateway: string | null
          payment_mode: string
          reference_number: string | null
          retailer_id: string
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          failure_reason?: string | null
          id?: string
          osas_invoice_id?: string | null
          payment_date?: string | null
          payment_gateway?: string | null
          payment_mode: string
          reference_number?: string | null
          retailer_id: string
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          failure_reason?: string | null
          id?: string
          osas_invoice_id?: string | null
          payment_date?: string | null
          payment_gateway?: string | null
          payment_mode?: string
          reference_number?: string | null
          retailer_id?: string
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retailer_osas_payments_osas_invoice_id_fkey"
            columns: ["osas_invoice_id"]
            isOneToOne: false
            referencedRelation: "retailer_osas_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retailer_osas_payments_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      retailer_other_payments: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          invoice_reference: string | null
          notes: string | null
          payment_date: string | null
          payment_mode: string | null
          payment_to_id: string | null
          payment_to_name: string | null
          payment_to_type: string
          reference_number: string | null
          retailer_id: string
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          invoice_reference?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_mode?: string | null
          payment_to_id?: string | null
          payment_to_name?: string | null
          payment_to_type: string
          reference_number?: string | null
          retailer_id: string
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          invoice_reference?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_mode?: string | null
          payment_to_id?: string | null
          payment_to_name?: string | null
          payment_to_type?: string
          reference_number?: string | null
          retailer_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retailer_other_payments_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      retailer_payment_behavior: {
        Row: {
          average_payment_delay_days: number | null
          id: string
          last_30_days_late: number | null
          last_30_days_on_time: number | null
          on_time_payment_rate: number | null
          paid_late: number | null
          paid_on_time: number | null
          payment_discipline_score: number | null
          pending_invoices: number | null
          reminders_received: number | null
          reminders_responded: number | null
          retailer_id: string
          total_invoices: number | null
          trend: string | null
          updated_at: string | null
        }
        Insert: {
          average_payment_delay_days?: number | null
          id?: string
          last_30_days_late?: number | null
          last_30_days_on_time?: number | null
          on_time_payment_rate?: number | null
          paid_late?: number | null
          paid_on_time?: number | null
          payment_discipline_score?: number | null
          pending_invoices?: number | null
          reminders_received?: number | null
          reminders_responded?: number | null
          retailer_id: string
          total_invoices?: number | null
          trend?: string | null
          updated_at?: string | null
        }
        Update: {
          average_payment_delay_days?: number | null
          id?: string
          last_30_days_late?: number | null
          last_30_days_on_time?: number | null
          on_time_payment_rate?: number | null
          paid_late?: number | null
          paid_on_time?: number | null
          payment_discipline_score?: number | null
          pending_invoices?: number | null
          reminders_received?: number | null
          reminders_responded?: number | null
          retailer_id?: string
          total_invoices?: number | null
          trend?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retailer_payment_behavior_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      retailer_products: {
        Row: {
          created_at: string | null
          custom_price: number | null
          display_order: number | null
          id: string
          is_available: boolean | null
          is_featured: boolean | null
          notes: string | null
          product_id: string
          retailer_id: string
          stock_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_price?: number | null
          display_order?: number | null
          id?: string
          is_available?: boolean | null
          is_featured?: boolean | null
          notes?: string | null
          product_id: string
          retailer_id: string
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_price?: number | null
          display_order?: number | null
          id?: string
          is_available?: boolean | null
          is_featured?: boolean | null
          notes?: string | null
          product_id?: string
          retailer_id?: string
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retailer_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retailer_products_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      retailer_rankings: {
        Row: {
          calculated_at: string | null
          created_at: string | null
          credit_score: number | null
          date: string | null
          id: string
          overall_score: number | null
          payment_punctuality_score: number | null
          period: string | null
          period_end: string
          period_start: string
          previous_rank: number | null
          rank: number | null
          retailer_id: string | null
          total_orders: number | null
          total_purchases: number | null
        }
        Insert: {
          calculated_at?: string | null
          created_at?: string | null
          credit_score?: number | null
          date?: string | null
          id?: string
          overall_score?: number | null
          payment_punctuality_score?: number | null
          period?: string | null
          period_end: string
          period_start: string
          previous_rank?: number | null
          rank?: number | null
          retailer_id?: string | null
          total_orders?: number | null
          total_purchases?: number | null
        }
        Update: {
          calculated_at?: string | null
          created_at?: string | null
          credit_score?: number | null
          date?: string | null
          id?: string
          overall_score?: number | null
          payment_punctuality_score?: number | null
          period?: string | null
          period_end?: string
          period_start?: string
          previous_rank?: number | null
          rank?: number | null
          retailer_id?: string | null
          total_orders?: number | null
          total_purchases?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "retailer_rankings_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      retailers: {
        Row: {
          address: string | null
          aoa_document: string | null
          aoa_document_verified: boolean | null
          business_name: string | null
          business_type:
            | Database["public"]["Enums"]["business_type_enum"]
            | null
          certificate_of_incorporation: string | null
          certificate_of_incorporation_verified: boolean | null
          cin_number: string | null
          city: string | null
          company_pan_card: string | null
          company_pan_card_verified: boolean | null
          created_at: string | null
          created_by: string | null
          credit_limit: number | null
          email: string | null
          favorite_wholesalers: Json | null
          gst_certificate: string | null
          gst_certificate_verified: boolean | null
          gst_number: string | null
          gumasta_certificate: string | null
          gumasta_certificate_verified: boolean | null
          id: string
          is_active: boolean | null
          kyc_rejection_reason: string | null
          kyc_status: string | null
          kyc_submitted_at: string | null
          kyc_verified_at: string | null
          moa_document: string | null
          moa_document_verified: boolean | null
          mobile_number: string | null
          name: string
          osas_active_emi_count: number | null
          osas_average_payment_days: number | null
          osas_credit_limit: number | null
          osas_credit_limit_approved: number | null
          osas_credit_used: number | null
          osas_credit_utilization: number | null
          osas_eligible_at: string | null
          osas_last_payment_date: string | null
          osas_late_payments: number | null
          osas_max_skips: number | null
          osas_monitoring_end_date: string | null
          osas_monitoring_start_date: string | null
          osas_monitoring_status: string | null
          osas_next_due_date: string | null
          osas_on_time_payments: number | null
          osas_payment_score: number | null
          osas_repayment_streak: number | null
          osas_risk_indicator: string | null
          osas_same_day_enabled: boolean | null
          osas_skips_used: number | null
          osas_total_orders: number | null
          osas_total_outstanding: number | null
          osas_total_penalties: number | null
          osas_total_repaid: number | null
          outstanding_balance: number | null
          owner_aadhar_card_back: string | null
          owner_aadhar_card_back_verified: boolean | null
          owner_aadhar_card_front: string | null
          owner_aadhar_card_front_verified: boolean | null
          owner_name: string
          owner_pan_card: string | null
          owner_pan_card_verified: boolean | null
          postal_code: string | null
          state: string | null
          udhyam_aadhar: string | null
          udhyam_aadhar_verified: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          aoa_document?: string | null
          aoa_document_verified?: boolean | null
          business_name?: string | null
          business_type?:
            | Database["public"]["Enums"]["business_type_enum"]
            | null
          certificate_of_incorporation?: string | null
          certificate_of_incorporation_verified?: boolean | null
          cin_number?: string | null
          city?: string | null
          company_pan_card?: string | null
          company_pan_card_verified?: boolean | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          email?: string | null
          favorite_wholesalers?: Json | null
          gst_certificate?: string | null
          gst_certificate_verified?: boolean | null
          gst_number?: string | null
          gumasta_certificate?: string | null
          gumasta_certificate_verified?: boolean | null
          id?: string
          is_active?: boolean | null
          kyc_rejection_reason?: string | null
          kyc_status?: string | null
          kyc_submitted_at?: string | null
          kyc_verified_at?: string | null
          moa_document?: string | null
          moa_document_verified?: boolean | null
          mobile_number?: string | null
          name: string
          osas_active_emi_count?: number | null
          osas_average_payment_days?: number | null
          osas_credit_limit?: number | null
          osas_credit_limit_approved?: number | null
          osas_credit_used?: number | null
          osas_credit_utilization?: number | null
          osas_eligible_at?: string | null
          osas_last_payment_date?: string | null
          osas_late_payments?: number | null
          osas_max_skips?: number | null
          osas_monitoring_end_date?: string | null
          osas_monitoring_start_date?: string | null
          osas_monitoring_status?: string | null
          osas_next_due_date?: string | null
          osas_on_time_payments?: number | null
          osas_payment_score?: number | null
          osas_repayment_streak?: number | null
          osas_risk_indicator?: string | null
          osas_same_day_enabled?: boolean | null
          osas_skips_used?: number | null
          osas_total_orders?: number | null
          osas_total_outstanding?: number | null
          osas_total_penalties?: number | null
          osas_total_repaid?: number | null
          outstanding_balance?: number | null
          owner_aadhar_card_back?: string | null
          owner_aadhar_card_back_verified?: boolean | null
          owner_aadhar_card_front?: string | null
          owner_aadhar_card_front_verified?: boolean | null
          owner_name: string
          owner_pan_card?: string | null
          owner_pan_card_verified?: boolean | null
          postal_code?: string | null
          state?: string | null
          udhyam_aadhar?: string | null
          udhyam_aadhar_verified?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          aoa_document?: string | null
          aoa_document_verified?: boolean | null
          business_name?: string | null
          business_type?:
            | Database["public"]["Enums"]["business_type_enum"]
            | null
          certificate_of_incorporation?: string | null
          certificate_of_incorporation_verified?: boolean | null
          cin_number?: string | null
          city?: string | null
          company_pan_card?: string | null
          company_pan_card_verified?: boolean | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          email?: string | null
          favorite_wholesalers?: Json | null
          gst_certificate?: string | null
          gst_certificate_verified?: boolean | null
          gst_number?: string | null
          gumasta_certificate?: string | null
          gumasta_certificate_verified?: boolean | null
          id?: string
          is_active?: boolean | null
          kyc_rejection_reason?: string | null
          kyc_status?: string | null
          kyc_submitted_at?: string | null
          kyc_verified_at?: string | null
          moa_document?: string | null
          moa_document_verified?: boolean | null
          mobile_number?: string | null
          name?: string
          osas_active_emi_count?: number | null
          osas_average_payment_days?: number | null
          osas_credit_limit?: number | null
          osas_credit_limit_approved?: number | null
          osas_credit_used?: number | null
          osas_credit_utilization?: number | null
          osas_eligible_at?: string | null
          osas_last_payment_date?: string | null
          osas_late_payments?: number | null
          osas_max_skips?: number | null
          osas_monitoring_end_date?: string | null
          osas_monitoring_start_date?: string | null
          osas_monitoring_status?: string | null
          osas_next_due_date?: string | null
          osas_on_time_payments?: number | null
          osas_payment_score?: number | null
          osas_repayment_streak?: number | null
          osas_risk_indicator?: string | null
          osas_same_day_enabled?: boolean | null
          osas_skips_used?: number | null
          osas_total_orders?: number | null
          osas_total_outstanding?: number | null
          osas_total_penalties?: number | null
          osas_total_repaid?: number | null
          outstanding_balance?: number | null
          owner_aadhar_card_back?: string | null
          owner_aadhar_card_back_verified?: boolean | null
          owner_aadhar_card_front?: string | null
          owner_aadhar_card_front_verified?: boolean | null
          owner_name?: string
          owner_pan_card?: string | null
          owner_pan_card_verified?: boolean | null
          postal_code?: string | null
          state?: string | null
          udhyam_aadhar?: string | null
          udhyam_aadhar_verified?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      return_items: {
        Row: {
          condition: string | null
          created_at: string | null
          id: string
          inspected_at: string | null
          inspected_by: string | null
          inspection_notes: string | null
          inspection_status: string | null
          line_total: number
          order_item_id: string | null
          product_id: string | null
          quantity: number
          reason: string | null
          requires_refurbishment: boolean | null
          return_id: string | null
          unit_price: number
        }
        Insert: {
          condition?: string | null
          created_at?: string | null
          id?: string
          inspected_at?: string | null
          inspected_by?: string | null
          inspection_notes?: string | null
          inspection_status?: string | null
          line_total: number
          order_item_id?: string | null
          product_id?: string | null
          quantity: number
          reason?: string | null
          requires_refurbishment?: boolean | null
          return_id?: string | null
          unit_price: number
        }
        Update: {
          condition?: string | null
          created_at?: string | null
          id?: string
          inspected_at?: string | null
          inspected_by?: string | null
          inspection_notes?: string | null
          inspection_status?: string | null
          line_total?: number
          order_item_id?: string | null
          product_id?: string | null
          quantity?: number
          reason?: string | null
          requires_refurbishment?: boolean | null
          return_id?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "return_items_inspected_by_fkey"
            columns: ["inspected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_items_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "order_returns"
            referencedColumns: ["id"]
          },
        ]
      }
      return_media: {
        Row: {
          created_at: string | null
          id: string
          media_type: string
          media_url: string
          return_id: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          media_type: string
          media_url: string
          return_id: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          media_type?: string
          media_url?: string
          return_id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "return_media_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "order_returns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      return_pickups: {
        Row: {
          actual_pickup_time: string | null
          assigned_to: string | null
          assigned_to_name: string | null
          assigned_to_phone: string | null
          created_at: string
          failure_reason: string | null
          id: string
          notes: string | null
          pickup_address: string | null
          pickup_location_lat: number | null
          pickup_location_lon: number | null
          pickup_type: string
          proof_images: string[] | null
          return_id: string
          scheduled_date: string | null
          scheduled_time: string | null
          signature_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          actual_pickup_time?: string | null
          assigned_to?: string | null
          assigned_to_name?: string | null
          assigned_to_phone?: string | null
          created_at?: string
          failure_reason?: string | null
          id?: string
          notes?: string | null
          pickup_address?: string | null
          pickup_location_lat?: number | null
          pickup_location_lon?: number | null
          pickup_type: string
          proof_images?: string[] | null
          return_id: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          signature_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          actual_pickup_time?: string | null
          assigned_to?: string | null
          assigned_to_name?: string | null
          assigned_to_phone?: string | null
          created_at?: string
          failure_reason?: string | null
          id?: string
          notes?: string | null
          pickup_address?: string | null
          pickup_location_lat?: number | null
          pickup_location_lon?: number | null
          pickup_type?: string
          proof_images?: string[] | null
          return_id?: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          signature_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "return_pickups_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_pickups_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "order_returns"
            referencedColumns: ["id"]
          },
        ]
      }
      return_status_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          created_at: string | null
          id: string
          new_status: string
          notes: string | null
          old_status: string
          return_id: string
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status: string
          notes?: string | null
          old_status: string
          return_id: string
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status?: string
          notes?: string | null
          old_status?: string
          return_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "return_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_status_history_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "order_returns"
            referencedColumns: ["id"]
          },
        ]
      }
      returns_replacements: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          images: string[] | null
          order_id: string
          order_item_id: string | null
          pickup_address: string | null
          pickup_completed_at: string | null
          pickup_scheduled_date: string | null
          product_id: string | null
          quantity: number
          reason: string
          reason_category: string | null
          refund_amount: number | null
          refund_method: string | null
          refund_processed_at: string | null
          refund_transaction_id: string | null
          rejection_reason: string | null
          replacement_order_id: string | null
          replacement_shipped_at: string | null
          request_type: string
          resolution_notes: string | null
          resolved_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          images?: string[] | null
          order_id: string
          order_item_id?: string | null
          pickup_address?: string | null
          pickup_completed_at?: string | null
          pickup_scheduled_date?: string | null
          product_id?: string | null
          quantity: number
          reason: string
          reason_category?: string | null
          refund_amount?: number | null
          refund_method?: string | null
          refund_processed_at?: string | null
          refund_transaction_id?: string | null
          rejection_reason?: string | null
          replacement_order_id?: string | null
          replacement_shipped_at?: string | null
          request_type: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          images?: string[] | null
          order_id?: string
          order_item_id?: string | null
          pickup_address?: string | null
          pickup_completed_at?: string | null
          pickup_scheduled_date?: string | null
          product_id?: string | null
          quantity?: number
          reason?: string
          reason_category?: string | null
          refund_amount?: number | null
          refund_method?: string | null
          refund_processed_at?: string | null
          refund_transaction_id?: string | null
          rejection_reason?: string | null
          replacement_order_id?: string | null
          replacement_shipped_at?: string | null
          request_type?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "returns_replacements_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_replacements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_replacements_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_replacements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_replacements_replacement_order_id_fkey"
            columns: ["replacement_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      review_helpfulness_votes: {
        Row: {
          created_at: string | null
          id: string
          review_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          review_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          review_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_helpfulness_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "product_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          granted_by: string | null
          id: string
          is_granted: boolean | null
          permission_id: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          is_granted?: boolean | null
          permission_id?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          is_granted?: boolean | null
          permission_id?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      rounding_settings: {
        Row: {
          apply_to: string | null
          created_at: string | null
          id: string
          max_rounding_amount: number | null
          round_invoice_total: boolean | null
          round_line_items: boolean | null
          round_tax_amounts: boolean | null
          round_to: number | null
          rounding_method: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          apply_to?: string | null
          created_at?: string | null
          id?: string
          max_rounding_amount?: number | null
          round_invoice_total?: boolean | null
          round_line_items?: boolean | null
          round_tax_amounts?: boolean | null
          round_to?: number | null
          rounding_method?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          apply_to?: string | null
          created_at?: string | null
          id?: string
          max_rounding_amount?: number | null
          round_invoice_total?: boolean | null
          round_line_items?: boolean | null
          round_tax_amounts?: boolean | null
          round_to?: number | null
          rounding_method?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rounding_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_payments: {
        Row: {
          basic_salary: number
          created_at: string | null
          finalized_at: string | null
          finalized_by: string | null
          id: string
          is_finalized: boolean | null
          net_salary: number
          notes: string | null
          paid_by: string | null
          payment_date: string | null
          payment_method: string | null
          payment_period_end: string
          payment_period_start: string
          payment_reference: string | null
          slip_generated_at: string | null
          slip_pdf_url: string | null
          slip_shared_via: string | null
          staff_id: string
          status: string | null
          total_deductions: number | null
          total_incentives: number | null
          updated_at: string | null
        }
        Insert: {
          basic_salary: number
          created_at?: string | null
          finalized_at?: string | null
          finalized_by?: string | null
          id?: string
          is_finalized?: boolean | null
          net_salary: number
          notes?: string | null
          paid_by?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_period_end: string
          payment_period_start: string
          payment_reference?: string | null
          slip_generated_at?: string | null
          slip_pdf_url?: string | null
          slip_shared_via?: string | null
          staff_id: string
          status?: string | null
          total_deductions?: number | null
          total_incentives?: number | null
          updated_at?: string | null
        }
        Update: {
          basic_salary?: number
          created_at?: string | null
          finalized_at?: string | null
          finalized_by?: string | null
          id?: string
          is_finalized?: boolean | null
          net_salary?: number
          notes?: string | null
          paid_by?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_period_end?: string
          payment_period_start?: string
          payment_reference?: string | null
          slip_generated_at?: string | null
          slip_pdf_url?: string | null
          slip_shared_via?: string | null
          staff_id?: string
          status?: string | null
          total_deductions?: number | null
          total_incentives?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salary_payments_finalized_by_fkey"
            columns: ["finalized_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_payments_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_payments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_analytics: {
        Row: {
          average_order_value: number | null
          calculated_at: string | null
          cash_sales: number | null
          created_at: string | null
          credit_sales: number | null
          date: string
          id: string
          profile_id: string | null
          top_category: string | null
          top_product_id: string | null
          total_cost: number | null
          total_orders: number | null
          total_profit: number | null
          total_sales: number | null
        }
        Insert: {
          average_order_value?: number | null
          calculated_at?: string | null
          cash_sales?: number | null
          created_at?: string | null
          credit_sales?: number | null
          date: string
          id?: string
          profile_id?: string | null
          top_category?: string | null
          top_product_id?: string | null
          total_cost?: number | null
          total_orders?: number | null
          total_profit?: number | null
          total_sales?: number | null
        }
        Update: {
          average_order_value?: number | null
          calculated_at?: string | null
          cash_sales?: number | null
          created_at?: string | null
          credit_sales?: number | null
          date?: string
          id?: string
          profile_id?: string | null
          top_category?: string | null
          top_product_id?: string | null
          total_cost?: number | null
          total_orders?: number | null
          total_profit?: number | null
          total_sales?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_analytics_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_analytics_top_product_id_fkey"
            columns: ["top_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      same_day_payments: {
        Row: {
          approved_by: string | null
          created_at: string | null
          id: string
          net_amount: number
          notes: string | null
          payment_id: string | null
          processed_at: string | null
          processing_fee: number | null
          retailer_repaid_amount: number | null
          retailer_repaid_at: string | null
          retailer_repayment_due_date: string | null
          retailer_repayment_status: string | null
          settlement_status: string | null
        }
        Insert: {
          approved_by?: string | null
          created_at?: string | null
          id?: string
          net_amount: number
          notes?: string | null
          payment_id?: string | null
          processed_at?: string | null
          processing_fee?: number | null
          retailer_repaid_amount?: number | null
          retailer_repaid_at?: string | null
          retailer_repayment_due_date?: string | null
          retailer_repayment_status?: string | null
          settlement_status?: string | null
        }
        Update: {
          approved_by?: string | null
          created_at?: string | null
          id?: string
          net_amount?: number
          notes?: string | null
          payment_id?: string | null
          processed_at?: string | null
          processing_fee?: number | null
          retailer_repaid_amount?: number | null
          retailer_repaid_at?: string | null
          retailer_repayment_due_date?: string | null
          retailer_repayment_status?: string | null
          settlement_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "same_day_payments_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "same_day_payments_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_notifications: {
        Row: {
          created_at: string | null
          id: string
          notification_data: Json | null
          scheduled_at: string
          sent_at: string | null
          status: string | null
          template_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notification_data?: Json | null
          scheduled_at: string
          sent_at?: string | null
          status?: string | null
          template_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notification_data?: Json | null
          scheduled_at?: string
          sent_at?: string | null
          status?: string | null
          template_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_notifications_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      security_alerts: {
        Row: {
          action_attempted: string
          alert_type: string
          created_at: string | null
          id: string
          ip_address: string | null
          is_resolved: boolean | null
          metadata: Json | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          resource_id: string | null
          resource_type: string | null
          severity: string
          staff_id: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_attempted: string
          alert_type: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          is_resolved?: boolean | null
          metadata?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          staff_id?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_attempted?: string
          alert_type?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          is_resolved?: boolean | null
          metadata?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          resource_id?: string | null
          resource_type?: string | null
          severity?: string
          staff_id?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_alerts_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      segment_insights: {
        Row: {
          action_recommendation: string | null
          affected_customer_count: number | null
          affected_customer_ids: string[] | null
          created_at: string | null
          expires_at: string | null
          id: string
          insight_message: string
          insight_title: string
          insight_type: string
          is_dismissed: boolean | null
          is_resolved: boolean | null
          metric_change_percentage: number | null
          metric_value: number | null
          resolved_at: string | null
          segment_id: string | null
          severity: string | null
          user_id: string
        }
        Insert: {
          action_recommendation?: string | null
          affected_customer_count?: number | null
          affected_customer_ids?: string[] | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          insight_message: string
          insight_title: string
          insight_type: string
          is_dismissed?: boolean | null
          is_resolved?: boolean | null
          metric_change_percentage?: number | null
          metric_value?: number | null
          resolved_at?: string | null
          segment_id?: string | null
          severity?: string | null
          user_id: string
        }
        Update: {
          action_recommendation?: string | null
          affected_customer_count?: number | null
          affected_customer_ids?: string[] | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          insight_message?: string
          insight_title?: string
          insight_type?: string
          is_dismissed?: boolean | null
          is_resolved?: boolean | null
          metric_change_percentage?: number | null
          metric_value?: number | null
          resolved_at?: string | null
          segment_id?: string | null
          severity?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "segment_insights_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "customer_segments"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_promotions: {
        Row: {
          amount_paid: number | null
          created_at: string
          duration_days: number | null
          end_date: string | null
          id: string
          payment_id: string | null
          plan_id: string | null
          plan_name: string | null
          start_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string
          duration_days?: number | null
          end_date?: string | null
          id?: string
          payment_id?: string | null
          plan_id?: string | null
          plan_name?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_paid?: number | null
          created_at?: string
          duration_days?: number | null
          end_date?: string | null
          id?: string
          payment_id?: string | null
          plan_id?: string | null
          plan_name?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_promotions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_visits: {
        Row: {
          action_items: string | null
          areas_inspected: string[] | null
          attendees: Json | null
          client_present: boolean | null
          client_visible: boolean | null
          created_at: string | null
          created_by: string | null
          designer_id: string | null
          duration_minutes: number | null
          id: string
          latitude: number | null
          location_notes: string | null
          longitude: number | null
          next_visit_date: string | null
          next_visit_purpose: string | null
          observations: string | null
          photos: Json | null
          project_id: string | null
          purpose: string
          remarks: string | null
          updated_at: string | null
          visit_date: string
          visit_time: string | null
          work_progress_percent: number | null
        }
        Insert: {
          action_items?: string | null
          areas_inspected?: string[] | null
          attendees?: Json | null
          client_present?: boolean | null
          client_visible?: boolean | null
          created_at?: string | null
          created_by?: string | null
          designer_id?: string | null
          duration_minutes?: number | null
          id?: string
          latitude?: number | null
          location_notes?: string | null
          longitude?: number | null
          next_visit_date?: string | null
          next_visit_purpose?: string | null
          observations?: string | null
          photos?: Json | null
          project_id?: string | null
          purpose: string
          remarks?: string | null
          updated_at?: string | null
          visit_date: string
          visit_time?: string | null
          work_progress_percent?: number | null
        }
        Update: {
          action_items?: string | null
          areas_inspected?: string[] | null
          attendees?: Json | null
          client_present?: boolean | null
          client_visible?: boolean | null
          created_at?: string | null
          created_by?: string | null
          designer_id?: string | null
          duration_minutes?: number | null
          id?: string
          latitude?: number | null
          location_notes?: string | null
          longitude?: number | null
          next_visit_date?: string | null
          next_visit_purpose?: string | null
          observations?: string | null
          photos?: Json | null
          project_id?: string | null
          purpose?: string
          remarks?: string | null
          updated_at?: string | null
          visit_date?: string
          visit_time?: string | null
          work_progress_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "site_visits_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_visits_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "site_visits_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_visits_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "site_visits_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "designer_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      sizes: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      smart_insights: {
        Row: {
          action_notes: string | null
          action_taken: boolean | null
          action_taken_at: string | null
          confidence_score: number | null
          created_at: string | null
          current_value: number | null
          data_snapshot: Json | null
          detailed_analysis: string | null
          dismissed_at: string | null
          dismissed_reason: string | null
          expected_value: number | null
          expires_at: string | null
          id: string
          insight_category: string
          insight_type: string
          is_actionable: boolean | null
          is_active: boolean | null
          is_dismissed: boolean | null
          merchant_id: string
          message: string
          potential_impact_amount: number | null
          priority: string | null
          recommendation: string
          related_customer_ids: string[] | null
          related_order_ids: string[] | null
          related_product_ids: string[] | null
          title: string
          trend_percentage: number | null
          updated_at: string | null
        }
        Insert: {
          action_notes?: string | null
          action_taken?: boolean | null
          action_taken_at?: string | null
          confidence_score?: number | null
          created_at?: string | null
          current_value?: number | null
          data_snapshot?: Json | null
          detailed_analysis?: string | null
          dismissed_at?: string | null
          dismissed_reason?: string | null
          expected_value?: number | null
          expires_at?: string | null
          id?: string
          insight_category: string
          insight_type: string
          is_actionable?: boolean | null
          is_active?: boolean | null
          is_dismissed?: boolean | null
          merchant_id: string
          message: string
          potential_impact_amount?: number | null
          priority?: string | null
          recommendation: string
          related_customer_ids?: string[] | null
          related_order_ids?: string[] | null
          related_product_ids?: string[] | null
          title: string
          trend_percentage?: number | null
          updated_at?: string | null
        }
        Update: {
          action_notes?: string | null
          action_taken?: boolean | null
          action_taken_at?: string | null
          confidence_score?: number | null
          created_at?: string | null
          current_value?: number | null
          data_snapshot?: Json | null
          detailed_analysis?: string | null
          dismissed_at?: string | null
          dismissed_reason?: string | null
          expected_value?: number | null
          expires_at?: string | null
          id?: string
          insight_category?: string
          insight_type?: string
          is_actionable?: boolean | null
          is_active?: boolean | null
          is_dismissed?: boolean | null
          merchant_id?: string
          message?: string
          potential_impact_amount?: number | null
          priority?: string | null
          recommendation?: string
          related_customer_ids?: string[] | null
          related_order_ids?: string[] | null
          related_product_ids?: string[] | null
          title?: string
          trend_percentage?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string | null
          department: string | null
          employee_id: string
          employer_id: string | null
          employment_type: string | null
          hire_date: string | null
          id: string
          is_active: boolean | null
          name: string | null
          phone: string | null
          position: string | null
          previous_positions: Json | null
          requires_selfie_attendance: boolean | null
          updated_at: string | null
          user_id: string | null
          weekly_off_days: number[] | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          employee_id: string
          employer_id?: string | null
          employment_type?: string | null
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          phone?: string | null
          position?: string | null
          previous_positions?: Json | null
          requires_selfie_attendance?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          weekly_off_days?: number[] | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          employee_id?: string
          employer_id?: string | null
          employment_type?: string | null
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          phone?: string | null
          position?: string | null
          previous_positions?: Json | null
          requires_selfie_attendance?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          weekly_off_days?: number[] | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_performance: {
        Row: {
          attendance_hours: number | null
          calculated_at: string | null
          created_at: string | null
          customer_satisfaction_score: number | null
          date: string
          efficiency_score: number | null
          id: string
          notes: string | null
          orders_handled: number | null
          staff_id: string | null
          total_sales: number | null
        }
        Insert: {
          attendance_hours?: number | null
          calculated_at?: string | null
          created_at?: string | null
          customer_satisfaction_score?: number | null
          date: string
          efficiency_score?: number | null
          id?: string
          notes?: string | null
          orders_handled?: number | null
          staff_id?: string | null
          total_sales?: number | null
        }
        Update: {
          attendance_hours?: number | null
          calculated_at?: string | null
          created_at?: string | null
          customer_satisfaction_score?: number | null
          date?: string
          efficiency_score?: number | null
          id?: string
          notes?: string | null
          orders_handled?: number | null
          staff_id?: string | null
          total_sales?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_performance_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_roster: {
        Row: {
          created_at: string | null
          date: string
          employer_id: string
          id: string
          notes: string | null
          planned_end_time: string | null
          planned_start_time: string | null
          shift_type: string | null
          staff_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          employer_id: string
          id?: string
          notes?: string | null
          planned_end_time?: string | null
          planned_start_time?: string | null
          shift_type?: string | null
          staff_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          employer_id?: string
          id?: string
          notes?: string | null
          planned_end_time?: string | null
          planned_start_time?: string | null
          shift_type?: string | null
          staff_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_roster_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_roster_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_salaries: {
        Row: {
          basic_salary: number
          commission_percentage: number | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          effective_from: string
          effective_to: string | null
          hourly_rate: number | null
          id: string
          late_penalty_per_day: number | null
          overtime_multiplier: number | null
          salary_type: string | null
          staff_id: string
          updated_at: string | null
        }
        Insert: {
          basic_salary: number
          commission_percentage?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          effective_from: string
          effective_to?: string | null
          hourly_rate?: number | null
          id?: string
          late_penalty_per_day?: number | null
          overtime_multiplier?: number | null
          salary_type?: string | null
          staff_id: string
          updated_at?: string | null
        }
        Update: {
          basic_salary?: number
          commission_percentage?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          effective_from?: string
          effective_to?: string | null
          hourly_rate?: number | null
          id?: string
          late_penalty_per_day?: number | null
          overtime_multiplier?: number | null
          salary_type?: string | null
          staff_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_salaries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_salaries_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_adjustments: {
        Row: {
          adjustment_number: string
          adjustment_type: string
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          id: string
          inventory_id: string
          product_id: string
          quantity_adjusted: number
          quantity_after: number
          quantity_before: number
          reason: string
          rejection_reason: string | null
          requested_by: string
          status: string | null
          updated_at: string | null
          warehouse_id: string | null
        }
        Insert: {
          adjustment_number: string
          adjustment_type: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          inventory_id: string
          product_id: string
          quantity_adjusted: number
          quantity_after: number
          quantity_before: number
          reason: string
          rejection_reason?: string | null
          requested_by: string
          status?: string | null
          updated_at?: string | null
          warehouse_id?: string | null
        }
        Update: {
          adjustment_number?: string
          adjustment_type?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          inventory_id?: string
          product_id?: string
          quantity_adjusted?: number
          quantity_after?: number
          quantity_before?: number
          reason?: string
          rejection_reason?: string | null
          requested_by?: string
          status?: string | null
          updated_at?: string | null
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_adjustments_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_adjustments_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_adjustments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_adjustments_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_adjustments_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          created_at: string | null
          destination: string | null
          id: string
          linked_document_id: string | null
          linked_document_type: string | null
          movement_type: string
          new_quantity: number
          previous_quantity: number
          product_id: string
          quantity_changed: number
          remarks: string | null
          source: string | null
          user_id: string
          warehouse_id: string | null
        }
        Insert: {
          created_at?: string | null
          destination?: string | null
          id?: string
          linked_document_id?: string | null
          linked_document_type?: string | null
          movement_type: string
          new_quantity: number
          previous_quantity: number
          product_id: string
          quantity_changed: number
          remarks?: string | null
          source?: string | null
          user_id: string
          warehouse_id?: string | null
        }
        Update: {
          created_at?: string | null
          destination?: string | null
          id?: string
          linked_document_id?: string | null
          linked_document_type?: string | null
          movement_type?: string
          new_quantity?: number
          previous_quantity?: number
          product_id?: string
          quantity_changed?: number
          remarks?: string | null
          source?: string | null
          user_id?: string
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_transfers: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          completed_at: string | null
          created_at: string | null
          from_warehouse_id: string | null
          id: string
          notes: string | null
          product_id: string | null
          quantity: number
          requested_by: string | null
          status: string | null
          to_warehouse_id: string | null
          transfer_number: string
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          completed_at?: string | null
          created_at?: string | null
          from_warehouse_id?: string | null
          id?: string
          notes?: string | null
          product_id?: string | null
          quantity: number
          requested_by?: string | null
          status?: string | null
          to_warehouse_id?: string | null
          transfer_number: string
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          completed_at?: string | null
          created_at?: string | null
          from_warehouse_id?: string | null
          id?: string
          notes?: string | null
          product_id?: string | null
          quantity?: number
          requested_by?: string | null
          status?: string | null
          to_warehouse_id?: string | null
          transfer_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_transfers_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transfers_from_warehouse_id_fkey"
            columns: ["from_warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transfers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transfers_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transfers_to_warehouse_id_fkey"
            columns: ["to_warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          category_id: string
          created_at: string | null
          default_gst_rate: number | null
          description: string | null
          display_order: number | null
          hsn_code: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          default_gst_rate?: number | null
          description?: string | null
          display_order?: number | null
          hsn_code?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          default_gst_rate?: number | null
          description?: string | null
          display_order?: number | null
          hsn_code?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_history: {
        Row: {
          amount: number | null
          created_at: string | null
          event_type: string
          id: string
          new_plan_id: string | null
          new_status: string | null
          old_plan_id: string | null
          old_status: string | null
          payment_id: string | null
          performed_by: string | null
          reason: string | null
          subscription_id: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          event_type: string
          id?: string
          new_plan_id?: string | null
          new_status?: string | null
          old_plan_id?: string | null
          old_status?: string | null
          payment_id?: string | null
          performed_by?: string | null
          reason?: string | null
          subscription_id: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          event_type?: string
          id?: string
          new_plan_id?: string | null
          new_status?: string | null
          old_plan_id?: string | null
          old_status?: string | null
          payment_id?: string | null
          performed_by?: string | null
          reason?: string | null
          subscription_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_orders: {
        Row: {
          amount: number
          billing_period: string | null
          created_at: string | null
          discount_percentage: number | null
          error_code: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          original_amount: number
          paid_at: string | null
          payment_id: string | null
          payment_method: string | null
          payment_signature: string | null
          plan_id: string
          plan_name: string
          razorpay_order_id: string | null
          refund_amount: number | null
          refund_reason: string | null
          refunded_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          billing_period?: string | null
          created_at?: string | null
          discount_percentage?: number | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          original_amount: number
          paid_at?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_signature?: string | null
          plan_id: string
          plan_name: string
          razorpay_order_id?: string | null
          refund_amount?: number | null
          refund_reason?: string | null
          refunded_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          billing_period?: string | null
          created_at?: string | null
          discount_percentage?: number | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          original_amount?: number
          paid_at?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_signature?: string | null
          plan_id?: string
          plan_name?: string
          razorpay_order_id?: string | null
          refund_amount?: number | null
          refund_reason?: string | null
          refunded_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          billing_period: string | null
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          discounted_price: number
          features: Json
          id: string
          includes_advanced_analytics: boolean | null
          includes_api_access: boolean | null
          includes_priority_support: boolean | null
          is_active: boolean | null
          is_recommended: boolean | null
          max_products: number | null
          max_users: number | null
          max_warehouses: number | null
          name: string
          original_price: number
          role: string
          sort_order: number | null
          trial_days: number | null
          updated_at: string | null
        }
        Insert: {
          billing_period?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          discounted_price: number
          features: Json
          id: string
          includes_advanced_analytics?: boolean | null
          includes_api_access?: boolean | null
          includes_priority_support?: boolean | null
          is_active?: boolean | null
          is_recommended?: boolean | null
          max_products?: number | null
          max_users?: number | null
          max_warehouses?: number | null
          name: string
          original_price: number
          role: string
          sort_order?: number | null
          trial_days?: number | null
          updated_at?: string | null
        }
        Update: {
          billing_period?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          discounted_price?: number
          features?: Json
          id?: string
          includes_advanced_analytics?: boolean | null
          includes_api_access?: boolean | null
          includes_priority_support?: boolean | null
          is_active?: boolean | null
          is_recommended?: boolean | null
          max_products?: number | null
          max_users?: number | null
          max_warehouses?: number | null
          name?: string
          original_price?: number
          role?: string
          sort_order?: number | null
          trial_days?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_usage: {
        Row: {
          created_at: string | null
          feature_key: string
          id: string
          metadata: Json | null
          period_end: string
          period_start: string
          subscription_id: string
          updated_at: string | null
          usage_count: number | null
          usage_limit: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          feature_key: string
          id?: string
          metadata?: Json | null
          period_end: string
          period_start: string
          subscription_id: string
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          feature_key?: string
          id?: string
          metadata?: Json | null
          period_end?: string
          period_start?: string
          subscription_id?: string
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_usage_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount_paid: number
          auto_renew: boolean | null
          cancelled_at: string | null
          cancelled_reason: string | null
          created_at: string | null
          end_date: string
          id: string
          notes: string | null
          payment_id: string | null
          payment_signature: string | null
          plan_id: string
          plan_name: string
          refund_requested_at: string | null
          start_date: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount_paid: number
          auto_renew?: boolean | null
          cancelled_at?: string | null
          cancelled_reason?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_signature?: string | null
          plan_id: string
          plan_name: string
          refund_requested_at?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number
          auto_renew?: boolean | null
          cancelled_at?: string | null
          cancelled_reason?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_signature?: string | null
          plan_id?: string
          plan_name?: string
          refund_requested_at?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      support_categories: {
        Row: {
          allowed_roles: Json | null
          color: string
          created_at: string | null
          default_priority: string | null
          description: string | null
          display_order: number | null
          icon: string
          id: string
          is_active: boolean | null
          name: string
          sla_resolution_hours: number | null
          sla_response_hours: number | null
          updated_at: string | null
        }
        Insert: {
          allowed_roles?: Json | null
          color?: string
          created_at?: string | null
          default_priority?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string
          id?: string
          is_active?: boolean | null
          name: string
          sla_resolution_hours?: number | null
          sla_response_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          allowed_roles?: Json | null
          color?: string
          created_at?: string | null
          default_priority?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string
          id?: string
          is_active?: boolean | null
          name?: string
          sla_resolution_hours?: number | null
          sla_response_hours?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      support_comments: {
        Row: {
          attachments: Json | null
          comment_text: string
          created_at: string | null
          id: string
          is_internal: boolean | null
          ticket_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          comment_text: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          ticket_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attachments?: Json | null
          comment_text?: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          ticket_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          attachments: Json | null
          category: string
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          priority: string
          reference_id: string | null
          reference_type: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          subject: string
          tags: Json | null
          ticket_number: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          attachments?: Json | null
          category: string
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          priority?: string
          reference_id?: string | null
          reference_type?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          subject: string
          tags?: Json | null
          ticket_number: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          attachments?: Json | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          priority?: string
          reference_id?: string | null
          reference_type?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          subject?: string
          tags?: Json | null
          ticket_number?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_logs: {
        Row: {
          created_at: string | null
          error_code: string | null
          id: string
          log_level: string | null
          message: string
          metadata: Json | null
          request_id: string | null
          source: string | null
          stack_trace: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_code?: string | null
          id?: string
          log_level?: string | null
          message: string
          metadata?: Json | null
          request_id?: string | null
          source?: string | null
          stack_trace?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_code?: string | null
          id?: string
          log_level?: string | null
          message?: string
          metadata?: Json | null
          request_id?: string | null
          source?: string | null
          stack_trace?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string | null
          data_type: string | null
          description: string | null
          id: string
          is_encrypted: boolean | null
          is_public: boolean | null
          setting_category: string | null
          setting_key: string
          setting_value: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          data_type?: string | null
          description?: string | null
          id?: string
          is_encrypted?: boolean | null
          is_public?: boolean | null
          setting_category?: string | null
          setting_key: string
          setting_value?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          data_type?: string | null
          description?: string | null
          id?: string
          is_encrypted?: boolean | null
          is_public?: boolean | null
          setting_category?: string | null
          setting_key?: string
          setting_value?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      task_reminders: {
        Row: {
          action_url: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          dismissed_at: string | null
          due_date: string | null
          id: string
          is_completed: boolean | null
          is_dismissed: boolean | null
          priority: string | null
          reference_id: string | null
          reference_type: string | null
          task_type: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          dismissed_at?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          is_dismissed?: boolean | null
          priority?: string | null
          reference_id?: string | null
          reference_type?: string | null
          task_type: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          dismissed_at?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          is_dismissed?: boolean | null
          priority?: string | null
          reference_id?: string | null
          reference_type?: string | null
          task_type?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_slabs: {
        Row: {
          cess_rate: number | null
          cgst_rate: number
          created_at: string | null
          description: string | null
          effective_from: string
          effective_to: string | null
          hsn_code: string | null
          id: string
          igst_rate: number
          is_active: boolean | null
          product_category: string | null
          sac_code: string | null
          sgst_rate: number
          updated_at: string | null
        }
        Insert: {
          cess_rate?: number | null
          cgst_rate: number
          created_at?: string | null
          description?: string | null
          effective_from: string
          effective_to?: string | null
          hsn_code?: string | null
          id?: string
          igst_rate: number
          is_active?: boolean | null
          product_category?: string | null
          sac_code?: string | null
          sgst_rate: number
          updated_at?: string | null
        }
        Update: {
          cess_rate?: number | null
          cgst_rate?: number
          created_at?: string | null
          description?: string | null
          effective_from?: string
          effective_to?: string | null
          hsn_code?: string | null
          id?: string
          igst_rate?: number
          is_active?: boolean | null
          product_category?: string | null
          sac_code?: string | null
          sgst_rate?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      ticket_status_history: {
        Row: {
          comment: string | null
          created_at: string | null
          from_status: string | null
          id: string
          ticket_id: string
          to_status: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          from_status?: string | null
          id?: string
          ticket_id: string
          to_status: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          from_status?: string | null
          id?: string
          ticket_id?: string
          to_status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_status_history_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_status_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tile_body_types: {
        Row: {
          code: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          properties: Json | null
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          properties?: Json | null
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          properties?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transport_charges: {
        Row: {
          base_charge: number | null
          charge_type: string
          created_at: string | null
          free_delivery_above: number | null
          gst_rate: number | null
          hsn_code: string | null
          id: string
          is_active: boolean | null
          is_taxable: boolean | null
          max_charge: number | null
          min_charge: number | null
          name: string
          per_kg_charge: number | null
          per_km_charge: number | null
          per_unit_charge: number | null
          updated_at: string | null
          user_id: string | null
          weight_slabs: Json | null
          zone_charges: Json | null
        }
        Insert: {
          base_charge?: number | null
          charge_type: string
          created_at?: string | null
          free_delivery_above?: number | null
          gst_rate?: number | null
          hsn_code?: string | null
          id?: string
          is_active?: boolean | null
          is_taxable?: boolean | null
          max_charge?: number | null
          min_charge?: number | null
          name: string
          per_kg_charge?: number | null
          per_km_charge?: number | null
          per_unit_charge?: number | null
          updated_at?: string | null
          user_id?: string | null
          weight_slabs?: Json | null
          zone_charges?: Json | null
        }
        Update: {
          base_charge?: number | null
          charge_type?: string
          created_at?: string | null
          free_delivery_above?: number | null
          gst_rate?: number | null
          hsn_code?: string | null
          id?: string
          is_active?: boolean | null
          is_taxable?: boolean | null
          max_charge?: number | null
          min_charge?: number | null
          name?: string
          per_kg_charge?: number | null
          per_km_charge?: number | null
          per_unit_charge?: number | null
          updated_at?: string | null
          user_id?: string | null
          weight_slabs?: Json | null
          zone_charges?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "transport_charges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_devices: {
        Row: {
          app_version: string | null
          created_at: string | null
          device_id: string | null
          device_model: string | null
          device_name: string | null
          device_type: string | null
          id: string
          ip_address: unknown
          is_active: boolean | null
          is_trusted: boolean | null
          last_activity_at: string | null
          last_latitude: number | null
          last_login_at: string | null
          last_longitude: number | null
          location_city: string | null
          location_country: string | null
          login_method: string | null
          os_version: string | null
          push_token: string | null
          requires_2fa: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          app_version?: string | null
          created_at?: string | null
          device_id?: string | null
          device_model?: string | null
          device_name?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          is_trusted?: boolean | null
          last_activity_at?: string | null
          last_latitude?: number | null
          last_login_at?: string | null
          last_longitude?: number | null
          location_city?: string | null
          location_country?: string | null
          login_method?: string | null
          os_version?: string | null
          push_token?: string | null
          requires_2fa?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          app_version?: string | null
          created_at?: string | null
          device_id?: string | null
          device_model?: string | null
          device_name?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          is_trusted?: boolean | null
          last_activity_at?: string | null
          last_latitude?: number | null
          last_login_at?: string | null
          last_longitude?: number | null
          location_city?: string | null
          location_country?: string | null
          login_method?: string | null
          os_version?: string | null
          push_token?: string | null
          requires_2fa?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          granted_by: string | null
          id: string
          is_granted: boolean | null
          permission_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          granted_by?: string | null
          id?: string
          is_granted?: boolean | null
          permission_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          granted_by?: string | null
          id?: string
          is_granted?: boolean | null
          permission_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          business_mode: string | null
          created_at: string | null
          dashboard_layout: string | null
          default_role: string | null
          enable_sound: boolean | null
          enable_vibration: boolean | null
          font_size: string | null
          id: string
          language: string | null
          notification_tone: string | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_mode?: string | null
          created_at?: string | null
          dashboard_layout?: string | null
          default_role?: string | null
          enable_sound?: boolean | null
          enable_vibration?: boolean | null
          font_size?: string | null
          id?: string
          language?: string | null
          notification_tone?: string | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_mode?: string | null
          created_at?: string | null
          dashboard_layout?: string | null
          default_role?: string | null
          enable_sound?: boolean | null
          enable_vibration?: boolean | null
          font_size?: string | null
          id?: string
          language?: string | null
          notification_tone?: string | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      warehouses: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          location: string | null
          name: string
          owner_id: string | null
          postal_code: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name: string
          owner_id?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name?: string
          owner_id?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warehouses_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wholesaler_payment_reminders: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          customer_response: string | null
          delivered_at: string | null
          id: string
          invoice_id: string | null
          promise_to_pay_date: string | null
          read_at: string | null
          reminder_message: string | null
          reminder_template: string | null
          reminder_type: string
          retailer_id: string | null
          sent_at: string | null
          status: string | null
          wholesaler_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          customer_response?: string | null
          delivered_at?: string | null
          id?: string
          invoice_id?: string | null
          promise_to_pay_date?: string | null
          read_at?: string | null
          reminder_message?: string | null
          reminder_template?: string | null
          reminder_type: string
          retailer_id?: string | null
          sent_at?: string | null
          status?: string | null
          wholesaler_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          customer_response?: string | null
          delivered_at?: string | null
          id?: string
          invoice_id?: string | null
          promise_to_pay_date?: string | null
          read_at?: string | null
          reminder_message?: string | null
          reminder_template?: string | null
          reminder_type?: string
          retailer_id?: string | null
          sent_at?: string | null
          status?: string | null
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wholesaler_payment_reminders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesaler_payment_reminders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesaler_payment_reminders_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesaler_payment_reminders_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesaler_payment_reminders_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wholesaler_product_feed: {
        Row: {
          available_quantity: number | null
          brand: string | null
          category: string | null
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          last_updated: string | null
          min_order_quantity: number | null
          mrp: number | null
          product_name: string
          sku: string | null
          specifications: Json | null
          subcategory: string | null
          tags: string[] | null
          wholesale_price: number
          wholesaler_id: string
        }
        Insert: {
          available_quantity?: number | null
          brand?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          last_updated?: string | null
          min_order_quantity?: number | null
          mrp?: number | null
          product_name: string
          sku?: string | null
          specifications?: Json | null
          subcategory?: string | null
          tags?: string[] | null
          wholesale_price: number
          wholesaler_id: string
        }
        Update: {
          available_quantity?: number | null
          brand?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          last_updated?: string | null
          min_order_quantity?: number | null
          mrp?: number | null
          product_name?: string
          sku?: string | null
          specifications?: Json | null
          subcategory?: string | null
          tags?: string[] | null
          wholesale_price?: number
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wholesaler_product_feed_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "wholesalers"
            referencedColumns: ["id"]
          },
        ]
      }
      wholesaler_product_pricing: {
        Row: {
          created_at: string | null
          delivery_time_days: number | null
          discount_percentage: number | null
          id: string
          is_available: boolean | null
          last_updated: string | null
          max_order_quantity: number | null
          min_order_quantity: number | null
          price: number
          product_id: string
          stock_available: number | null
          updated_at: string | null
          wholesaler_id: string
        }
        Insert: {
          created_at?: string | null
          delivery_time_days?: number | null
          discount_percentage?: number | null
          id?: string
          is_available?: boolean | null
          last_updated?: string | null
          max_order_quantity?: number | null
          min_order_quantity?: number | null
          price: number
          product_id: string
          stock_available?: number | null
          updated_at?: string | null
          wholesaler_id: string
        }
        Update: {
          created_at?: string | null
          delivery_time_days?: number | null
          discount_percentage?: number | null
          id?: string
          is_available?: boolean | null
          last_updated?: string | null
          max_order_quantity?: number | null
          min_order_quantity?: number | null
          price?: number
          product_id?: string
          stock_available?: number | null
          updated_at?: string | null
          wholesaler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wholesaler_product_pricing_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesaler_product_pricing_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wholesaler_retailer_links: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          region: string | null
          retailer_id: string | null
          updated_at: string | null
          wholesaler_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          region?: string | null
          retailer_id?: string | null
          updated_at?: string | null
          wholesaler_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          region?: string | null
          retailer_id?: string | null
          updated_at?: string | null
          wholesaler_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wholesaler_retailer_links_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesaler_retailer_links_wholesaler_id_fkey"
            columns: ["wholesaler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wholesalers: {
        Row: {
          address: string | null
          aoa_document: string | null
          aoa_document_verified: boolean | null
          business_name: string
          business_type:
            | Database["public"]["Enums"]["business_type_enum"]
            | null
          certificate_of_incorporation: string | null
          certificate_of_incorporation_verified: boolean | null
          cin_number: string | null
          city: string | null
          company_pan_card: string | null
          company_pan_card_verified: boolean | null
          contact_person: string | null
          country: string | null
          created_at: string | null
          email: string | null
          gst_certificate: string | null
          gst_certificate_verified: boolean | null
          gst_number: string | null
          gumasta_certificate: string | null
          gumasta_certificate_verified: boolean | null
          id: string
          is_active: boolean | null
          kyc_rejection_reason: string | null
          kyc_status: string | null
          kyc_submitted_at: string | null
          kyc_verified_at: string | null
          moa_document: string | null
          moa_document_verified: boolean | null
          outstanding_balance: number | null
          owner_aadhar_card_back: string | null
          owner_aadhar_card_back_verified: boolean | null
          owner_aadhar_card_front: string | null
          owner_aadhar_card_front_verified: boolean | null
          owner_name: string | null
          owner_pan_card: string | null
          owner_pan_card_verified: boolean | null
          phone: string | null
          postal_code: string | null
          state: string | null
          udhyam_aadhar: string | null
          udhyam_aadhar_verified: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          aoa_document?: string | null
          aoa_document_verified?: boolean | null
          business_name: string
          business_type?:
            | Database["public"]["Enums"]["business_type_enum"]
            | null
          certificate_of_incorporation?: string | null
          certificate_of_incorporation_verified?: boolean | null
          cin_number?: string | null
          city?: string | null
          company_pan_card?: string | null
          company_pan_card_verified?: boolean | null
          contact_person?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          gst_certificate?: string | null
          gst_certificate_verified?: boolean | null
          gst_number?: string | null
          gumasta_certificate?: string | null
          gumasta_certificate_verified?: boolean | null
          id?: string
          is_active?: boolean | null
          kyc_rejection_reason?: string | null
          kyc_status?: string | null
          kyc_submitted_at?: string | null
          kyc_verified_at?: string | null
          moa_document?: string | null
          moa_document_verified?: boolean | null
          outstanding_balance?: number | null
          owner_aadhar_card_back?: string | null
          owner_aadhar_card_back_verified?: boolean | null
          owner_aadhar_card_front?: string | null
          owner_aadhar_card_front_verified?: boolean | null
          owner_name?: string | null
          owner_pan_card?: string | null
          owner_pan_card_verified?: boolean | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          udhyam_aadhar?: string | null
          udhyam_aadhar_verified?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          aoa_document?: string | null
          aoa_document_verified?: boolean | null
          business_name?: string
          business_type?:
            | Database["public"]["Enums"]["business_type_enum"]
            | null
          certificate_of_incorporation?: string | null
          certificate_of_incorporation_verified?: boolean | null
          cin_number?: string | null
          city?: string | null
          company_pan_card?: string | null
          company_pan_card_verified?: boolean | null
          contact_person?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          gst_certificate?: string | null
          gst_certificate_verified?: boolean | null
          gst_number?: string | null
          gumasta_certificate?: string | null
          gumasta_certificate_verified?: boolean | null
          id?: string
          is_active?: boolean | null
          kyc_rejection_reason?: string | null
          kyc_status?: string | null
          kyc_submitted_at?: string | null
          kyc_verified_at?: string | null
          moa_document?: string | null
          moa_document_verified?: boolean | null
          outstanding_balance?: number | null
          owner_aadhar_card_back?: string | null
          owner_aadhar_card_back_verified?: boolean | null
          owner_aadhar_card_front?: string | null
          owner_aadhar_card_front_verified?: boolean | null
          owner_name?: string | null
          owner_pan_card?: string | null
          owner_pan_card_verified?: boolean | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          udhyam_aadhar?: string | null
          udhyam_aadhar_verified?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      client_project_summary: {
        Row: {
          carpet_area: number | null
          client_email: string | null
          client_id: string | null
          client_name: string | null
          client_phone: string | null
          completed_milestones: number | null
          designer_email: string | null
          designer_id: string | null
          designer_name: string | null
          designer_phone: string | null
          estimated_budget: number | null
          expected_completion: string | null
          final_cost: number | null
          is_client_visible: boolean | null
          location: string | null
          overall_progress_percent: number | null
          pending_quotations: number | null
          project_id: string | null
          project_name: string | null
          project_type: string | null
          start_date: string | null
          status: string | null
          total_milestone_amount: number | null
          total_milestones: number | null
          total_paid: number | null
          total_received: number | null
          unread_notifications: number | null
          visible_site_visits: number | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "designer_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designer_projects_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_projects_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
        ]
      }
      designer_dashboard_stats: {
        Row: {
          active_clients: number | null
          active_projects: number | null
          approved_commission: number | null
          approved_quotations: number | null
          completed_projects: number | null
          converted_referrals: number | null
          designer_id: string | null
          designer_name: string | null
          pending_commission: number | null
          pending_quotations: number | null
          preferred_partners: number | null
          referral_commission: number | null
          total_commission: number | null
          total_partners: number | null
          total_projects: number | null
          total_referrals: number | null
          unread_alerts: number | null
          urgent_alerts: number | null
        }
        Insert: {
          active_clients?: never
          active_projects?: never
          approved_commission?: never
          approved_quotations?: never
          completed_projects?: never
          converted_referrals?: never
          designer_id?: string | null
          designer_name?: string | null
          pending_commission?: never
          pending_quotations?: never
          preferred_partners?: never
          referral_commission?: never
          total_commission?: never
          total_partners?: never
          total_projects?: never
          total_referrals?: never
          unread_alerts?: never
          urgent_alerts?: never
        }
        Update: {
          active_clients?: never
          active_projects?: never
          approved_commission?: never
          approved_quotations?: never
          completed_projects?: never
          converted_referrals?: never
          designer_id?: string | null
          designer_name?: string | null
          pending_commission?: never
          pending_quotations?: never
          preferred_partners?: never
          referral_commission?: never
          total_commission?: never
          total_partners?: never
          total_projects?: never
          total_referrals?: never
          unread_alerts?: never
          urgent_alerts?: never
        }
        Relationships: []
      }
      designer_partner_summary: {
        Row: {
          designer_id: string | null
          is_preferred: boolean | null
          last_order_date: string | null
          mapping_id: string | null
          partner_city: string | null
          partner_id: string | null
          partner_name: string | null
          partner_type: string | null
          partnership_tier: string | null
          performance_score: number | null
          relationship_started_at: string | null
          successful_referrals: number | null
          total_commission_earned: number | null
          total_orders: number | null
          total_value: number | null
        }
        Relationships: [
          {
            foreignKeyName: "designer_partner_mappings_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designer_dashboard_stats"
            referencedColumns: ["designer_id"]
          },
          {
            foreignKeyName: "designer_partner_mappings_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "interior_designers"
            referencedColumns: ["id"]
          },
        ]
      }
      document_expirations_with_status: {
        Row: {
          alert_days_before: number | null
          alert_frequency_days: number | null
          created_at: string | null
          days_until_expiry: number | null
          document_name: string | null
          document_number: string | null
          document_type: string | null
          document_url: string | null
          expiry_date: string | null
          file_size_kb: number | null
          id: string | null
          is_active: boolean | null
          is_expired: boolean | null
          is_verified: boolean | null
          issue_date: string | null
          last_alert_sent_at: string | null
          metadata: Json | null
          mime_type: string | null
          notes: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          renewal_date: string | null
          renewal_reminder_sent: boolean | null
          renewal_status: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          alert_days_before?: number | null
          alert_frequency_days?: number | null
          created_at?: string | null
          days_until_expiry?: never
          document_name?: string | null
          document_number?: string | null
          document_type?: string | null
          document_url?: string | null
          expiry_date?: string | null
          file_size_kb?: number | null
          id?: string | null
          is_active?: boolean | null
          is_expired?: never
          is_verified?: boolean | null
          issue_date?: string | null
          last_alert_sent_at?: string | null
          metadata?: Json | null
          mime_type?: string | null
          notes?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          renewal_date?: string | null
          renewal_reminder_sent?: boolean | null
          renewal_status?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          alert_days_before?: number | null
          alert_frequency_days?: number | null
          created_at?: string | null
          days_until_expiry?: never
          document_name?: string | null
          document_number?: string | null
          document_type?: string | null
          document_url?: string | null
          expiry_date?: string | null
          file_size_kb?: number | null
          id?: string | null
          is_active?: boolean | null
          is_expired?: never
          is_verified?: boolean | null
          issue_date?: string | null
          last_alert_sent_at?: string | null
          metadata?: Json | null
          mime_type?: string | null
          notes?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          renewal_date?: string | null
          renewal_reminder_sent?: boolean | null
          renewal_status?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_client_portal_invitation: {
        Args: { p_profile_id: string; p_token: string }
        Returns: boolean
      }
      award_bonus_points: {
        Args: {
          p_bonus_type: string
          p_custom_points?: number
          p_customer_id: string
          p_description?: string
          p_merchant_id: string
        }
        Returns: number
      }
      award_loyalty_points: {
        Args: {
          p_customer_id: string
          p_merchant_id: string
          p_order_amount: number
          p_order_id: string
        }
        Returns: number
      }
      backfill_retailer_rankings: {
        Args: never
        Returns: {
          period_end: string
          period_start: string
          period_type: string
          retailer_count: number
        }[]
      }
      backfill_sales_analytics: {
        Args: { end_date?: string; start_date?: string }
        Returns: {
          orders_count: number
          processed_date: string
        }[]
      }
      calculate_invoice_totals: {
        Args: { p_invoice_id: string }
        Returns: undefined
      }
      calculate_loyalty_points: {
        Args: { p_merchant_id: string; p_order_amount: number }
        Returns: number
      }
      calculate_monthly_retailer_rankings: { Args: never; Returns: undefined }
      calculate_partner_performance_score: {
        Args: { p_mapping_id: string }
        Returns: number
      }
      calculate_quarterly_retailer_rankings: { Args: never; Returns: undefined }
      calculate_retailer_rankings_for_period: {
        Args: {
          p_period_end: string
          p_period_start: string
          p_period_type: string
        }
        Returns: undefined
      }
      calculate_sales_analytics_for_date: {
        Args: { target_date: string }
        Returns: undefined
      }
      calculate_segment_members: {
        Args: { p_segment_id: string }
        Returns: number
      }
      calculate_yearly_retailer_rankings: { Args: never; Returns: undefined }
      create_client_notification: {
        Args: {
          p_action_label?: string
          p_action_url?: string
          p_client_id: string
          p_message: string
          p_project_id: string
          p_reference_id?: string
          p_reference_type?: string
          p_title: string
          p_type: string
        }
        Returns: string
      }
      create_client_portal_invitation: {
        Args: {
          p_client_id: string
          p_email: string
          p_expires_in_days?: number
        }
        Returns: string
      }
      create_designer_alert: {
        Args: {
          p_action_label?: string
          p_action_url?: string
          p_alert_type: string
          p_designer_id: string
          p_expires_at?: string
          p_message: string
          p_metadata?: Json
          p_priority?: string
          p_reference_id?: string
          p_reference_type?: string
          p_title: string
        }
        Returns: string
      }
      create_designer_analytics_snapshot: {
        Args: { p_designer_id: string; p_snapshot_type?: string }
        Returns: string
      }
      create_feedback_alert: {
        Args: {
          p_alert_message?: string
          p_alert_title?: string
          p_alert_type: string
          p_merchant_id: string
          p_order_id?: string
          p_product_id?: string
          p_rating_id?: string
          p_review_id?: string
          p_severity: string
        }
        Returns: string
      }
      create_marketing_audit_log: {
        Args: {
          p_action_description: string
          p_action_type: string
          p_changes?: Json
          p_entity_id: string
          p_entity_name: string
          p_entity_type: string
          p_metadata?: Json
          p_user_id: string
        }
        Returns: string
      }
      expire_loyalty_points: { Args: never; Returns: number }
      expire_old_subscriptions: { Args: never; Returns: undefined }
      generate_challan_number: { Args: never; Returns: string }
      generate_change_request_number: { Args: never; Returns: string }
      generate_invoice_number: {
        Args: { p_invoice_type?: string; p_user_id: string }
        Returns: string
      }
      generate_payment_number: { Args: never; Returns: string }
      generate_payout_number: { Args: never; Returns: string }
      generate_quotation_number: { Args: never; Returns: string }
      generate_referral_code: { Args: never; Returns: string }
      generate_segment_insights: {
        Args: { p_user_id: string }
        Returns: number
      }
      generate_ticket_number: { Args: never; Returns: string }
      get_current_subscription: {
        Args: { user_uuid: string }
        Returns: {
          days_remaining: number
          end_date: string
          id: string
          plan_id: string
          plan_name: string
          start_date: string
          status: string
        }[]
      }
      get_designer_commission_rate: {
        Args: { p_category?: string; p_designer_id: string }
        Returns: number
      }
      get_designer_lead_stats: {
        Args: { p_designer_id: string }
        Returns: {
          contacted_leads: number
          conversion_rate: number
          converted_leads: number
          credits_balance: number
          lost_leads: number
          new_leads: number
          pending_follow_ups: number
          total_converted_value: number
          total_leads: number
        }[]
      }
      get_designer_unread_alert_count: {
        Args: { p_designer_id: string }
        Returns: number
      }
      get_merchant_feedback_summary: {
        Args: { p_merchant_id: string }
        Returns: {
          average_rating: number
          negative_percentage: number
          positive_percentage: number
          recent_low_ratings: number
          total_ratings: number
          unresolved_alerts: number
        }[]
      }
      get_sale_total_returned: { Args: { sale_id: string }; Returns: number }
      has_active_subscription: { Args: { user_uuid: string }; Returns: boolean }
      increment_article_helpful: {
        Args: { article_id: string }
        Returns: undefined
      }
      increment_article_views: {
        Args: { article_id: string }
        Returns: undefined
      }
      is_attendance_locked: {
        Args: { p_date: string; p_employer_id: string }
        Returns: boolean
      }
      log_activity: {
        Args: {
          p_action: string
          p_entity_id?: string
          p_entity_type?: string
          p_metadata?: Json
        }
        Returns: string
      }
      purchase_lead: {
        Args: {
          p_designer_id: string
          p_lead_id: string
          p_use_credits?: boolean
        }
        Returns: string
      }
      record_client_portal_login: {
        Args: { p_profile_id: string }
        Returns: undefined
      }
      redeem_loyalty_points: {
        Args: {
          p_customer_id: string
          p_merchant_id: string
          p_order_id: string
          p_points_to_redeem: number
        }
        Returns: Json
      }
      refresh_sales_analytics_today: { Args: never; Returns: undefined }
      update_points_expiring_soon: { Args: never; Returns: number }
      update_rating_statistics: {
        Args: { p_entity_id: string; p_entity_type: string }
        Returns: undefined
      }
      update_review_helpfulness_counts: {
        Args: { p_review_id: string }
        Returns: undefined
      }
    }
    Enums: {
      business_type_enum: "proprietorship" | "private_limited" | "llp" | "other"
      cash_sale_payment_status: "paid" | "partial" | "unpaid"
      delivery_status: "pending" | "in_transit" | "delivered" | "failed"
      delivery_type: "standard" | "express" | "self_pickup"
      expense_category:
        | "utilities"
        | "rent"
        | "salaries"
        | "supplies"
        | "travel"
        | "maintenance"
        | "communication"
        | "professional"
        | "other"
      expense_status: "pending" | "approved" | "rejected" | "paid"
      invoice_payment_status:
        | "unpaid"
        | "paid"
        | "partially_paid"
        | "adjusted"
        | "overdue"
        | "cancelled"
        | "refunded"
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
      invoice_type_enum:
        | "TAX_INVOICE"
        | "BILL_OF_SUPPLY"
        | "DELIVERY_CHALLAN"
        | "PROFORMA"
        | "CREDIT_NOTE"
        | "DEBIT_NOTE"
        | "EXPORT_INVOICE"
        | "CASH_MEMO"
      order_category:
        | "standard"
        | "returned"
        | "replaced"
        | "private"
        | "osas_paid"
      order_status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "completed"
        | "cancelled"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      refund_method_type: "credit_note" | "osas_adjustment" | "manual_refund"
      return_condition_type:
        | "resellable"
        | "repackage_needed"
        | "scrap"
        | "supplier_return"
      return_reason_type:
        | "damaged"
        | "expired"
        | "wrong_item"
        | "excess"
        | "packaging_defect"
        | "refusal"
        | "quality_issue"
        | "other"
      supply_type_enum: "intra_state" | "inter_state" | "export" | "sez"
      user_role:
        | "admin"
        | "staff"
        | "manager"
        | "viewer"
        | "interior_designer"
        | "retailer"
        | "customer"
        | "wholesaler"
        | "delivery_driver"
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
      business_type_enum: ["proprietorship", "private_limited", "llp", "other"],
      cash_sale_payment_status: ["paid", "partial", "unpaid"],
      delivery_status: ["pending", "in_transit", "delivered", "failed"],
      delivery_type: ["standard", "express", "self_pickup"],
      expense_category: [
        "utilities",
        "rent",
        "salaries",
        "supplies",
        "travel",
        "maintenance",
        "communication",
        "professional",
        "other",
      ],
      expense_status: ["pending", "approved", "rejected", "paid"],
      invoice_payment_status: [
        "unpaid",
        "paid",
        "partially_paid",
        "adjusted",
        "overdue",
        "cancelled",
        "refunded",
      ],
      invoice_status: ["draft", "sent", "paid", "overdue", "cancelled"],
      invoice_type_enum: [
        "TAX_INVOICE",
        "BILL_OF_SUPPLY",
        "DELIVERY_CHALLAN",
        "PROFORMA",
        "CREDIT_NOTE",
        "DEBIT_NOTE",
        "EXPORT_INVOICE",
        "CASH_MEMO",
      ],
      order_category: [
        "standard",
        "returned",
        "replaced",
        "private",
        "osas_paid",
      ],
      order_status: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "completed",
        "cancelled",
      ],
      payment_status: ["pending", "completed", "failed", "refunded"],
      refund_method_type: ["credit_note", "osas_adjustment", "manual_refund"],
      return_condition_type: [
        "resellable",
        "repackage_needed",
        "scrap",
        "supplier_return",
      ],
      return_reason_type: [
        "damaged",
        "expired",
        "wrong_item",
        "excess",
        "packaging_defect",
        "refusal",
        "quality_issue",
        "other",
      ],
      supply_type_enum: ["intra_state", "inter_state", "export", "sez"],
      user_role: [
        "admin",
        "staff",
        "manager",
        "viewer",
        "interior_designer",
        "retailer",
        "customer",
        "wholesaler",
        "delivery_driver",
      ],
    },
  },
} as const
