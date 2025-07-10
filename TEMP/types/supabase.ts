export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          is_approved: boolean
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          is_approved?: boolean
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          is_approved?: boolean
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      calculations: {
        Row: {
          id: string
          user_id: string
          client_name: string
          premium_a: number
          premium_b: number
          face_amount_a: number
          face_amount_b: number
          funding_period: number
          inflation_rate: number
          agent_name: string
          frequency_a: string
          frequency_b: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_name: string
          premium_a: number
          premium_b: number
          face_amount_a: number
          face_amount_b: number
          funding_period: number
          inflation_rate?: number
          agent_name: string
          frequency_a?: string
          frequency_b?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_name?: string
          premium_a?: number
          premium_b?: number
          face_amount_a?: number
          face_amount_b?: number
          funding_period?: number
          inflation_rate?: number
          agent_name?: string
          frequency_a?: string
          frequency_b?: string
          created_at?: string
        }
      }
      calculation_results: {
        Row: {
          id: string
          calculation_id: string
          interest_rate: number
          future_value_a: number
          inflation_adjusted_value_a: number
          future_value_b: number
          inflation_adjusted_value_b: number
          created_at: string
        }
        Insert: {
          id?: string
          calculation_id: string
          interest_rate: number
          future_value_a: number
          inflation_adjusted_value_a: number
          future_value_b: number
          inflation_adjusted_value_b: number
          created_at?: string
        }
        Update: {
          id?: string
          calculation_id?: string
          interest_rate?: number
          future_value_a?: number
          inflation_adjusted_value_a?: number
          future_value_b?: number
          inflation_adjusted_value_b?: number
          created_at?: string
        }
      }
      calculation_exports: {
        Row: {
          id: string
          calculation_id: string
          file_path: string
          file_type: string
          shared_with: string | null
          created_at: string
        }
        Insert: {
          id?: string
          calculation_id: string
          file_path: string
          file_type: string
          shared_with?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          calculation_id?: string
          file_path?: string
          file_type?: string
          shared_with?: string | null
          created_at?: string
        }
      }
    }
  }
}
